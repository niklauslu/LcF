/**
 * contoller router 控制器
 */

let fs = require('fs')
let path = require('path')

let controller = (app, options) => {
  let verbose = options.verbose
  let controllerPath = options.controller_path || 'app/controller'

  let readControllerPath = path.join(__dirname, './../', controllerPath)
  // 加载controller文件夹下的文件及文件夹
  fs.readdirSync(readControllerPath).forEach((pathName) => {

    try {
      // require各个controller文件对象（文件夹加载对用文件夹下index.js）
      let controllerObj = require('./../' + controllerPath + '/' + pathName)
      
      let controllerName = pathName.replace('.js', '')
      // index文件转为空
      if (controllerName === 'index') controllerName = ''

      app.use('/' + controllerName, controllerObj)

      verbose && console.log('Add contoller:%s from path:%s', '/' + controllerName, readControllerPath + '/' + pathName)

    } catch (err) {
      console.log('add controller err ', err)
    }

  })
}

module.exports = controller