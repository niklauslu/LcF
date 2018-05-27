const webpack = require('webpack')
const path = require('path')
// const merge = require('webpack-merge')
// const config = require('./webpack.base')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const webpackEntrys = require('./webpackEntrys') // 获取所有entry

const DIST_CLEAN_PATH = 'public/ssr'
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  target: 'node',
  entry : webpackEntrys({
    hot: false,
    ssr : true
  }),
  devtool: 'source-map',
  output: {
    filename: '[name].[hash].ssr.js',
    path: path.join(__dirname , '../public/ssr'),
    publicPath: '/ssr/',
    libraryTarget: 'commonjs2'
  },
  module : {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: ['vue-loader']
      }
    ]
  },
  plugins: [
    // new UglifyJSPlugin({
    //   sourceMap: true
    // }),
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify('production')
    // }),
    new VueSSRServerPlugin(),
    new CleanWebpackPlugin([DIST_CLEAN_PATH], {
      root: path.join(__dirname , '../')
    }),
    new VueLoaderPlugin()
  ],
  externals: nodeExternals({
    // 不要外置化 webpack 需要处理的依赖模块。
    // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
    whitelist: /\.css$/
  }),
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.min.js'
    }
  }
}