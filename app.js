/**
 * web服务入口文件
 */
const express = require('express')
const app = express()
const path = require('path')

// 中间件
const bodyParser = require('body-parser') // 处理请求中body的内容
const methodOverride = require('method-override') //支持更多的请求方式（PUT,DELETE）等
const session = require('express-session') // session中间件

// 使用ejs模板引擎
app.set('view engine', 'ejs')
// 设置模板目录
app.set('views', path.join(__dirname, './public/views'))

// 静态文件
app.use('/assets', express.static(path.join(__dirname, './public/assets')))
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')))

// session 支持
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: '1234567890ascdefg' // session加密
}))

// 处理请求中body的内容 (req.body)
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json()) // json
app.use(bodyParser.raw({
  type: 'application/xml'
})) // xml
app.use(bodyParser.text({
  type: 'text/xml'
}))

// 支持更多的请求方式 (?_method=put)
app.use(methodOverride('_method'))

// 记录请求日志
const logReqMid = require('./app/middleware/log_req')
app.use(logReqMid)

// 添加控制层逻辑
const controller = require('./lib/boot')
controller(app, {
  verbose: true
})

// 错误处理
const ErrorMid = require('./app/middleware/error')
app.use(ErrorMid.logErrors) // 错误日志输出
app.use(ErrorMid.errorHandler) // 错误处理 500
app.use(ErrorMid.error404) // 404错误

let port = 9000
app.listen(port, () => {
  console.log('A web server listening at port:%s', port);
});