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
// const CleanWebpackPlugin = require('clean-webpack-plugin')

// vue-loader插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')


const ExtractTextPlugin = require("extract-text-webpack-plugin")
const extractCSS = new ExtractTextPlugin(CSS_OUTPUT_PATH + CssFileName)
const extractLESS = new ExtractTextPlugin(CSS_OUTPUT_PATH + CssFileName)

const webpackEntrys = require('./webpackEntrys') // 获取所有entry

let config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: webpackEntrys({
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
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: ['vue-loader']
      }
    ]
  },
  plugins: [
    extractCSS,
    extractLESS,
    // new CleanWebpackPlugin([DIST_CLEAN_PATH], {
    //   root: path.join(__dirname , '../')
    // }),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: "src/view/index.html"
    // }),
    new webpack.ProvidePlugin({
      // $: 'jquery'
    }),
    new VueLoaderPlugin(),
    // 生成 `vue-ssr-client-manifest.json`。
    // new VueSSRClientPlugin()
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
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    }
  }

}



module.exports = config