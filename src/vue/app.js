import Vue from 'vue'
import App from './app.vue'

export function createApp(context) {

  console.log(context)

  const app = new Vue({
    // 根实例简单的渲染应用程序组件
    data : context,
    components : {
      App
    },
    render : h => h(App , {
      props : {
        title : 'title'
      }
    })
  })

  return { app }
}