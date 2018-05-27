// import Vue from 'vue'
// import App from './../vue/app.vue'

import './../less/index.less'

// PWA
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/assets/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration)
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError)
//     })
//   })
// }

//创建一个vue实例,挂载在#app上面  
// new Vue({
//   el: '#app',
//   components: {
//     App
//   }
// })

import { createApp } from './../vue/app'

// 客户端特定引导逻辑……
let context = {
  posts: [
    {
      id:1,
      title: 'hello'
    },
    {
      id:2,
      title: 'welcome'
    }
  ]
}
const { app } = createApp(context)
// 这里假定 App.vue 模板中根元素具有 `id="app"`
app.$mount('#app')

