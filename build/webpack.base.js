/**
 * webpack基础配置
 */
const path = require('path')
const webpack = require('webpack')

const DIST = 'dist'
const DIST_OUTPUT_PATH = '../' + DIST
const DIST_CLEAN_PATH = DIST
const DIST_PATH = path.resolve(__dirname, DIST_OUTPUT_PATH) // 所有输出文件的目标路径
const JS_OUTPUT_PATH = 'js/'
const IMG_OUTPUT_PATH = 'images/'
const CSS_OUTPUT_PATH = 'css/'

const PUBLIC_PATH = '/'

const HASH = false
const CssFileName = HASH ? '[name].[hash].css' : '[name].css'
const JsFileName = HASH ? '[name].[chunkhash].js' : '[name].js'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const extractCSS = new ExtractTextPlugin(CSS_OUTPUT_PATH + CssFileName)
const extractLESS = new ExtractTextPlugin(CSS_OUTPUT_PATH + CssFileName)

const webpackEntrys = require('./webpackEntrys') // 获取所有entry


let config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: webpackEntrys,
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
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: "src/view/index.html"
    }),
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