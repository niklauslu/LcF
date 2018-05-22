# Webpack集成

> webpack是一个十分强大的前端打包工具，这里将介绍一下如何将webpack整合到express项目中

### webpack配置文件

这里使用的是webpack4，配置文件的编写就不多做说明，可以参考[官方文档](https://webpack.js.org/concepts/)([中文文档](https://www.webpackjs.com/concepts/))

下面是自己项目的基础配置
```js
/**
 * webpack基础配置
 */
const path = require('path')
const webpack = require('webpack')

const DIST = 'public/assets'
const DIST_OUTPUT_PATH = '../' + DIST
const DIST_CLEAN_PATH = DIST
const DIST_PATH = path.resolve(__dirname, DIST_OUTPUT_PATH) // 所有输出文件的目标路径
const JS_OUTPUT_PATH = 'js/'
const IMG_OUTPUT_PATH = 'images/'
const CSS_OUTPUT_PATH = 'css/'

const PUBLIC_PATH = '/assets/'

const HASH = false
const CssFileName = HASH ? '[name].[hash].css' : '[name].css'
const JsFileName = HASH ? '[name].[chunkhash].js' : '[name].js'

// const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')


const ExtractTextPlugin = require("extract-text-webpack-plugin")
const extractCSS = new ExtractTextPlugin(CSS_OUTPUT_PATH + CssFileName)
const extractLESS = new ExtractTextPlugin(CSS_OUTPUT_PATH + CssFileName)

const webpackEntrys = require('./webpackEntrys') // 获取所有entry

let config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: entry: webpackEntrys({
    hot: true
  }),
  output: {
    filename: JS_OUTPUT_PATH + JsFileName,
    path: DIST_PATH,
    publicPath: PUBLIC_PATH
  },

  module: {
    rules: [{
        test: /\.css$/,
        use: extractCSS.extract(['css-loader', 'postcss-loader'])
      },
      {
        test: /\.less$/i,
        use: extractLESS.extract(['css-loader', 'less-loader'])
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: IMG_OUTPUT_PATH
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    extractCSS,
    extractLESS,
    new CleanWebpackPlugin([DIST_CLEAN_PATH], {
      root: path.join(__dirname , '../')
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: "src/view/index.html"
    // }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2
        }
      }
    }
  }

}

const webpackCopyPlugin = require('./webpackCopyPlugin') // copy操作
config.plugins.push(webpackCopyPlugin())

module.exports = config
```

之所以把`HtmlWebpackPlugin`去掉，是因为在express项目中，已经使用了`ejs`做模板解析，就不需要在做html的解析了，直接使用`webpackCopyPlugin`copy模板文件到对应目录就可以了

### webpack-dev-middleware + webpack-hot-middleware

改造一下entry
```
entry: './path/to/my/entry/file.js'
```
改为
```js

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'

...

entry: ['./path/to/my/entry/file.js' , hotMiddlewareScript ]

...

```

在`app.js`中加入下面操作

```js
// process.env.NODE_ENV = 'dev'
if (env == 'dev') {
  const webpack = require('webpack');
  const merge = require('webpack-merge')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackConfBase = require('./build/webpack.base')

  const webpackConf = merge(webpackConfBase, {
    devtool: 'inline-source-map',
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]
  })
  const compiler = webpack(webpackConf)
  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/assets/',
    quiet: true //向控制台显示任何内容
  }))
  app.use(webpackHotMiddleware(compiler , {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }))
  
}
```

项目集成webpack-dev-middleware是当`NODE_ENV=dev`时做的操作，正式上线的时候使用下面的操作

在package.json中加入
```
"scripts": {
  "build": "webpack --config build/webpack.prod.js"
},
```
然后进行部署环境的打包
```
npm run build
```