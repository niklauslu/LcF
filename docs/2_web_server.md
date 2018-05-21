# 构建一个MVC架构web服务

### 1.利用express搭建简单的web服务

Express 是一个基于 Node.js 平台的极简、灵活的 web 应用开发框架，利用它来搭建一个Web服务是很方便快速并且高效的，只需要几个简单的步骤

第一步：安装express 
```node
npm install express --save
```

第二步：新建文件入口文件`app.js`

```js
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

let port = 9000
app.listen(port, () => {
  console.log('a web server started , listening at port:%s', port);
});
```

在本地测试，值需要在控制台输入`node app.js`,然后打开浏览器输入`localhost:9000`,就可以看到效果了！

### 2.一步步完善web服务

搭建一个web服务是很简单的操作，但这是远远不够我们进行开发工作的，所以下面将一步步完善这个web服务，以满足进行项目开发的基本需求

#### 2.1 web中间件

express本身是一个极其简单的框架，它之所以强大，就在于它的中间件，各种中间件，总有一款能满足需求

##### 2.1.1 请求处理

首页我们需要一个`body-parser`中间件处理请求中body的内容
```node
npm install body-parser --save
```

加上`method-override`支持更多的请求方式（PUT,DELETE）等
```node
npm install method-override --save
```

然后再`app.js`中加上
```js

... 

// 中间件
const bodyParser = require('body-parser') // 处理请求中body的内容
const methodOverride = require('method-override') //支持更多的请求方式（PUT,DELETE）等

...

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

...
```

##### 2.2.2 session支持

```node
npm install express-session --save
```

`app.js`添加
```js
...

const session = require('express-session') // session中间件

...

// session 支持
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: '1234567890ascdefg' // session加密
}))
```

##### 2.2.3 静态资源文件
静态文件使用express自带中间件
```js
...

// 静态文件
app.use('/assets', express.static(path.join(__dirname, './public/assets')))
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')))

...
```

#### 2.2 错误处理

错误处理自己构建中间件方法，在`app/middleware`文件夹建立`error.js`

```js
/**
 * 错误处理中间件类
 */

class ErrorMid {

  // 错误日志输出
  logErrors(err, req, res, next) {
    console.error(err.stack)
    next(err)
  }

  // 错误处理
  errorHandler(err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({
        error: 'Something blew up!'
      })
    } else {
      // next(err);
      res.status(500).send('500 error ! Something blew up!')
    }
  }

  // 404错误处理
  error404(req, res, next) {

    if (req.xhr) {
      return res.status(404).json({
        code: 404
      })
    } else {
      // error page
      return res.status(404).send('404 not found!')
    }

  }
  

}

module.exports = new ErrorMid()
```

在`app.js`中引用
```js
...

// 错误处理
const ErrorMid = require('./app/middleware/error')
app.use(ErrorMid.logErrors) // 错误日志输出
app.use(ErrorMid.errorHandler) // 错误处理 500
app.use(ErrorMid.error404) // 404错误

...
```
> 顺序不能乱

### 3.构建MVC

#### 3.1 Controller控制层
express除了中间件，还有一块很重要的就是路由，实现controller控制层的主要工作就是做路由的逻辑处理

在`lib`文件夹下建立核心文件`boot.js`

```js

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
```

在`app.js`中引用
```js
...

// 添加控制层逻辑
const controller = require('./lib/boot')
controller(app, {
  verbose: true
})

...
```

#### 3.2 View视图层

模板引擎使用`EJS`

```node
npm install ejs --save
```

在`app.js`添加

```js
...

// 使用ejs末班引擎
app.set('view engine', 'ejs')
// 设置模板目录
app.set('views', path.join(__dirname, './public/views'))

...
```

若是习惯使用html文件课改为

```js
...

app.set('views', path.join(__dirname, './public/views'))
app.engine('html', require('ejs').__express)
app.set('view engine' , 'html')

...
```

#### 3.3 Model模型

模型层单独见数据库(mysql)整合

### 其他相关

+ 日志处理单独见[日志处理](https://github.com/niklauslu/LcF/wiki/%E6%97%A5%E5%BF%97%E5%A4%84%E7%90%86)
+ model整合数据库见[Sequelize整合mysql数据库]()
