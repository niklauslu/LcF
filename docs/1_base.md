# 基础架构

### 文件目录结构

项目目录结构设计
```
project
|--app                                   // web服务应用目录
    |--controller                        // 控制器目录 (C)
    |--middleware                        // 中间件
    |--service                           
|--build                                 // 前端打包构建
|--config                                // 配置文件目录
    |--index.js
    |--dev.js
    |--prod.js
|--docs                                  
|--grpc                                  // rpc相关
|--logs                                  // 日志文件
|--lib                                   // lib核心文件目录
|--node_modules
|--public                                // 公共文件目录
    |--assets                            // 公共资源 (打包后)
    |--views                             // 模板文件夹 (V)
    |--uploads                           // 上传文件夹
|--server                                // rpc服务端应用目录
    |--routes                            // 方法路由
    |--model                             // 模型文件夹 (M)
    |--service
|--src                                   // 前端资源文件
    |--fonts
    |--images
    |--js
    |--less
    |--template
|--tests                                 // 测试文件夹
|--utils                                 // 公共方法，工具类
|--.babelrc
|--.eslintrc.json
|--.gitignore
|--app.js                                // web服务入口文件
|--LICENSE
|--nodemon.json
|--package.json
|--README.md
|--server.js                             // rpc服务端入口文件

```

> 在`mac`和`linux`环境，设置`logs`,`public/uploads`文件夹权限为`777`

### 架构设计

### 配置文件

`config/index.js`

```js
const fs = require('fs')
const path = require('path')

let config = {

  // 数据库mysql配置
  db: {
    host: '', 
    port: 3306,
    dbname: '',
    username: '',
    password: '',
    maxLimit: 10,
  },

  // session配置
  session : {
    secret : ''
  },

  // web站点port
  port : 8000

}

// 配置文件可根据部署环境的不同加载对应环境的配置文件
let env = process.env.NODE_ENV ? process.env.NODE_ENV : ''

if (env) {
  if (fs.existsSync(path.join(__dirname, './' + env + '.js'))) {
    let extendsConfig = require('./' + env)
    if (extendsConfig) {
      config = Object.assign(config, extendsConfig)
    }
  }

}

module.exports = config
```
