const fs = require('fs')
const path = require('path')
// const webpackHot = 'webpack-hot-middleware/client?noInfo=true&reload=true'
// const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'

/**
 * 
 * @param {*
 * hot : true|false 开发模式下热加载
 * ssr : true|false vue服务端渲染
 * } opt 
 */
let getEntrys = (opt) => {
  console.log(opt)
  let hot = opt.hot || true
  let vueSsr = opt.ssr || false

  let entrys = {}

  const vender = 'babel-polyfill'
  if(!vueSsr) entrys.vender = vender

  const entrysJsPath = path.join(__dirname, '../src/js')
  const vueSsrJsPath = path.join(__dirname , '../src/vue/ssr')

  let entryPaths = fs.readdirSync(entrysJsPath)

  entryPaths.forEach(entry => {
    let entryPath = path.join(entrysJsPath, entry)

    if (fs.statSync(entryPath).isFile()) {
      let entryKey = entry.replace('.js', '')

      if(vueSsr) {
        entrySsrPath = path.join(vueSsrJsPath , entry) // ssr服务端渲染
        entrys[entryKey] = entrySsrPath
      }else {
        entrys[entryKey] = (opt.hot === true) ? [entryPath, hotMiddlewareScript] : entryPath
      }
      
    }
  })

  console.log(entrys)

  return entrys
}

module.exports = (opt) => {
  return getEntrys(opt)
}