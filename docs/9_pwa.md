### 渐进式网络应用程序PWA

> PWA（ 全称：Progressive Web App ）也就是渐进式的网页应用程序，为网页应用提供离线体验

### 使用workbox构建PWA

安装 `workbox-webpack-plugin` 插件

```node
npm install workbox-webpack-plugin --save-dev
```

在webpack.prod.js配置文件中加入

```js
...
const WorkboxPlugin = require('workbox-webpack-plugin')
...

module.exports = {
  plugins : [
    ...
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助 ServiceWorkers 快速启用
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true
    })
  ]
}

```

在`index.js`中加入

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}
```