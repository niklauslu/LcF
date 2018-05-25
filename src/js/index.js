import Vue from 'vue'
import App from './../vue/app.vue'

import './../less/index.less'

// PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/assets/service-worker.js').then(registration => {
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}

//创建一个vue实例,挂载在#app上面  
new Vue({
  el: '#app',
  components: {
    App
  }
})
