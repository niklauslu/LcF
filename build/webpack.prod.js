const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const config = require('./webpack.base')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const webpackCopyPlugin = require('./webpackCopyPlugin')

const DIST_CLEAN_PATH = 'public/assets'
const CleanWebpackPlugin = require('clean-webpack-plugin')

const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

// pwa不是很实用？
// const WorkboxPlugin = require('workbox-webpack-plugin')
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
    new CleanWebpackPlugin([DIST_CLEAN_PATH], {
      root: path.join(__dirname , '../')
    }),
    // new WorkboxPlugin.GenerateSW({

    //   cacheId: 'webpack-pwa', // 设置前缀
    //   skipWaiting: true, // 强制等待中的 Service Worker 被激活
    //   clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
    //   swDest: 'service-wroker.js', // 输出 Service worker 文件
    //   globPatterns: ['**/*'], // 匹配的文件
    //   globIgnores: ['service-wroker.js'], // 忽略的文件
    //   runtimeCaching: [
    //     // 配置路由请求缓存
    //     {
    //       urlPattern: /.*\.js/, // 匹配文件
    //       handler: 'networkFirst' // 网络优先
    //     }
    //   ]
    // })
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.min.js'
    }
  }
})