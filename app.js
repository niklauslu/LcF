/**
 * web服务入口文件
 */
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const config = require('./config') // 加载配置文件
const env = process.env.NODE_ENV ? process.env.NODE_ENV :'production'
console.log('NODE_ENV:' + env)
const version = require('./package.json').version

// webpack
if (env == 'dev') {
  const webpack = require('webpack');
  const merge = require('webpack-merge')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackConfBase = require('./build/webpack.base')

  const webpackConf = merge(webpackConfBase, {
    devtool: 'inline-source-map',
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]
  })
  const compiler = webpack(webpackConf)
  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/assets/',
    quiet: true //向控制台显示任何内容
  }))
  app.use(webpackHotMiddleware(compiler , {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }))
  
}else{
  // 正式环境部署
  
  if (!fs.existsSync(path.join(__dirname , './public/assets'))) {
    console.log('请运行打包命令：npm run build')
    process.exit()
    // const { exec } = require('child_process')
    // exec('npm run build', (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`exec error: ${error}`);
    //     return;
    //   }
    //   console.log(`stdout: ${stdout}`);
    //   console.log(`stderr: ${stderr}`);

    //   console.log('部署打包 end !!!')
    //   fs.writeFileSync(path.join(assetsPath , 'version.json') , JSON.stringify({version : version}))
    // })
    
  }
}

// 中间件
const bodyParser = require('body-parser') // 处理请求中body的内容
const methodOverride = require('method-override') //支持更多的请求方式（PUT,DELETE）等
const session = require('express-session') // session中间件

// 使用ejs模板引擎
app.set('view engine', 'ejs')
// 设置模板目录
app.set('views', path.join(__dirname, env == 'dev' ? './src/template' : './public/views'))

// 静态文件
app.use('/assets', express.static(path.join(__dirname, './public/assets')))
app.use('/js', express.static(path.join(__dirname, './public/assets/js')))
app.use('/css', express.static(path.join(__dirname, './public/assets/css')))
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')))

// session 支持
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: config.session.secret // session加密
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

app.use((req , res , next) => {
  res.locals.VERSION = env == 'production' ? version : Date.now()
  next()
})
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

let port = config.port
app.listen(port, () => {
  console.log('A web server listening at port:%s', port);
});