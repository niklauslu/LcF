# 日志处理

> 对于一个程序来说，日记的记录是非常重要的，在开发的时候，本地可以用console.log打印出日志，但是当程序部署到服务器了，console.log就不管用了，就需要把日志输出记录到文件，这里选用`log4js`来进行日志的处理，整合到项目之中

### 建立一个核心log类

###### 在`lib`文件夹下建立一个`log.js`文件,加入构造方法

```js
const log4js = require('log4js')

class Log {

  constructor(opt = '') {
    let filename = typeof opt === 'string' ? (opt ? opt : 'default') : (opt.name ? opt.name : 'default')
    this.filename = filename
  }

}

module.exports = (opt = '') => {
  return new Log(opt)
}
```

日志需要输出到文件，为了更好的进行分类记录，所以文件名当做一个参数传入

##### 构建初始化方法(_init)，生成`logger`

```js
_init(){
  log4js.configure({
    appenders: {
      req: {
        type: 'dateFile',
        filename: 'logs/req/',
        pattern: 'yyyy-MM-dd.log',
        maxLogSize: 10 * 1024 * 1024, // = 10Mb
        numBackups: 5, // keep five backup files
        compress: true, // compress the backups
        encoding: 'utf-8',
        alwaysIncludePattern: true
      },
      dateFile: {
        type: 'dateFile',
        filename: 'logs/',
        pattern: 'yyyy-MM/dd/' + this.filename + '.log',
        maxLogSize: 10 * 1024 * 1024, // = 10Mb
        numBackups: 5, // keep five backup files
        compress: true, // compress the backups
        encoding: 'utf-8',
        alwaysIncludePattern: true
      },
      out: {
        type: 'stdout'
      }
    },
    categories: {
      default: {
        appenders: ['dateFile', 'out'],
        level: 'trace'
      },
      req: {
        appenders: ['req', 'out'],
        level: 'trace'
      }
    }
  })

  this.logger = log4js.getLogger()
  this.reqLogger = log4js.getLogger('req')
}
```

此部分生成两个logger，一个用于代码中记录日志，reqLogger专门用于记录请求日志，logger的配置可以参考[log4js-node](https://github.com/log4js-node/log4js-node)的文档，这里两种logger都是使用的dateFile型，记录日志文件到一个按日期区分的文件或文件夹

###### 不同logger的方法调用方式

基本logger调用`info()`

```js
_log(level = 'info' , ...args){

  this._init()

  let infos = []
  for (var key in args) {

    if (args.hasOwnProperty(key)) {
      if (typeof args[key] == 'object') {
        infos.push(JSON.stringify(args[key]))
      } else if (typeof args[key] == 'undefined') {
        infos.push('undefined')
      } else if (typeof args[key] == 'function') {
        infos.push('function')
      } else {
        infos.push(args[key])
      }

    }
  }

  let logStr = infos.join(' | ')
  this.logger[level](logStr)
}

info(...args){
  this._log('info' , ...args)
}
```

reqLogger调用`reqLog()`

```js
reqLog(url , method = 'GET', ip = '' , referer = '', body = null , uid = ''){
  this._init()

  this.reqLogger.info(`[${uid}] ${method} ${url} Ip:${ip} Referer:${referer}`)
  if(body) this.reqLogger.info('[${uid}] body:' + JSON.stringify(body))
}
```

### req_log中间件

为了记录请求的日志还需要建一个req_log的中间件，在`app/middleware`下建立`req_log.js`

```js
const Log = require('../../lib/log')()
const uuid = require('uuid')

let logReq = (req , res , next) => {

  // 从req中获取需要记录的信息
  let method = req.originalMethod
  let url = req.originalUrl
  let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip
  let referer = req.get('referer') || ''
  
  let body = (method.toUpperCase() == 'POST') ? req.body : null

  // 生成请求的唯一标识
  let reqUid = uuid.v1()
  req.UID = reqUid

  Log.reqLog(url, method, ip, referer, body , reqUid)

  next()

}

module.exports = logReq
```

在入口文件`app.js`中use中间件
```js
// 记录请求日志
const logReqMid = require('./app/middleware/log_req')
app.use(logReqMid)
```

在本地启动Web服务，可记录对应日志
```
[2018-05-21T15:14:36.676] [INFO] req - [9e73cf70-5cc6-11e8-8f73-f77e35c05eea] GET / Ip:::ffff:127.0.0.1 Referer:
```

### 在程序代码中记录日志

例如在`app/controller/index.js`中需要记录日志

引用Log类
```js
const Log = require('./../../lib/log')('router-index')
```

在需要的地方调用方法
```js
...
Log.info(......)
...
```