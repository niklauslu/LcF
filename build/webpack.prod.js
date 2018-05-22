const webpack = require('webpack');
const merge = require('webpack-merge')
const config = require('./webpack.base')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpackCopyPlugin = require('./webpackCopyPlugin') 
// copy操作
// config.plugins.push(webpackCopyPlugin())
const webpackEntrys = require('./webpackEntrys') // 获取所有entry

module.exports = merge(config, {
  entry: webpackEntrys({
    hot: false
  }),
  devtool: 'source-map',
  plugins : [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    webpackCopyPlugin()
  ]
})