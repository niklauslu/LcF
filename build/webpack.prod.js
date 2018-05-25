const webpack = require('webpack');
const merge = require('webpack-merge')
const config = require('./webpack.base')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpackCopyPlugin = require('./webpackCopyPlugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
// copy操作
// config.plugins.push(webpackCopyPlugin())
const webpackEntrys = require('./webpackEntrys') // 获取所有entry

module.exports = merge(config, {
  mode: 'production',
  entry: webpackEntrys({
    hot: false
  }),
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    webpackCopyPlugin(),
    new WorkboxPlugin.GenerateSW({

      cacheId: 'webpack-pwa', // 设置前缀
      skipWaiting: true, // 强制等待中的 Service Worker 被激活
      clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
      swDest: 'service-wroker.js', // 输出 Service worker 文件
      globPatterns: ['**/*'], // 匹配的文件
      globIgnores: ['service-wroker.js'], // 忽略的文件
      runtimeCaching: [
        // 配置路由请求缓存
        {
          urlPattern: /.*\.js/, // 匹配文件
          handler: 'networkFirst' // 网络优先
        }
      ]
    })
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.min.js'
    }
  }
})