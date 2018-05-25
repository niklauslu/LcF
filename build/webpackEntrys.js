const fs = require('fs')
const path = require('path')
// const webpackHot = 'webpack-hot-middleware/client?noInfo=true&reload=true'
// const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'

let getEntrys = (opt) => {
  console.log(opt)
  let entrys = {}

  const vender = 'babel-polyfill'
  entrys.vender = vender

  const entrysJsPath = path.join(__dirname, '../src/js')

  let entryPaths = fs.readdirSync(entrysJsPath)

  entryPaths.forEach(entry => {
    let entryPath = path.join(entrysJsPath, entry)
    if (fs.statSync(entryPath).isFile()) {
      let entryKey = entry.replace('.js', '')

      entrys[entryKey] = (opt.hot === true) ? [entryPath, hotMiddlewareScript] : entryPath
    }
  })

  console.log(entrys)

  return entrys
}

module.exports = (opt) => {
  return getEntrys(opt)
}