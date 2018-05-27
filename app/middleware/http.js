const fs = require('fs')
const path = require('path')

module.exports = (req , res , next) => {
  res.locals.VERSION = process.env.NODE_ENV == 'production' ? version : Date.now()

  const template = fs.readFileSync(path.join(__dirname ,'./../../src/template/index.ssr.html'), 'utf-8')

  res.display = () => {
    const { createBundleRenderer } = require('vue-server-renderer')
    const serverBundle = require('./../../public/ssr/vue-ssr-server-bundle.json')
    const clientManifest = require('./../../public/assets/vue-ssr-client-manifest.json')

    const renderer = createBundleRenderer(serverBundle, {
      runInNewContext: false, // 推荐
      template,
      clientManifest
    })

    let context = res.locals
    renderer.renderToString(context, (err, html) => {
      // 处理异常……
      if(err){
        console.log(err)
      }

      console.log(html)
      
      res.end(html)
    })
  }

  next()
}