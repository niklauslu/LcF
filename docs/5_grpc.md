# rpc接口服务

### gRPC简介

grpc是google开发的一款rpc框架，rpc框架还有很多，之所以选择grpc，一是因为支持的语言多，c++,java,go,python,ruby,node.js,c#,php,还有移动端Android java,objective-c,支持范围广泛，再就是grpc使用起来比较灵活，比较适合开发人员自己搭建自己的rpc服务，用来做微服务很适合

### grpc简单示例

#### 安装grpc

```node
npm install grpc --save
```

#### 定义proto文件

建立一个proto文件`grpc/protos/base.proto`(使用的是proto3)

```proto
syntax='proto3'; // 申明使用的proto版本

package base; // package名

// 定义一个service,service里面定义rpc接口方法
service base {

  // demo方法
  rpc demoMethod (Request) returns (Response);

}

// 定义请求结构
message Request {
  string uid  = 1; // 请求唯一id
  string body  = 2; // 请求数据 json字符串
}

// 定义返回结构
message Response {
  int32 code  = 1; // 返回值code
  string data = 2; // 返回数据，json字符串
  string msg  = 3; // 返回消息,字符串类型
  int32 time = 4; // 返回时间戳
}

```

> 为了方便使用，我们将文件名,package名，service名统一

#### 服务端`server.js`

以`base.proto`为例

```js
const grpc = require('grpc')
const path = require('path')

let proto = 'base'
let protoFile = path.join(__dirname, './protos/' + proto + '.proto')

// 加载proto文件,获取package
let package = grpc.load(protoFile)[proto]

/**
 * 定义方法
 * @param {*} call 
 * @param {*} cb 
 * 按照固定格式 
 * (call ,cb) => {}
 * call.request 获取请求参数
 * cb(null , {}) 返回数据
 */
let demoMethod = (call, cb) =>{

  // 获取请求参数
  let req = call.request
  let uid = req.uid
  let data = JSON.parse(req.body)

  // 返回数据
  let ret = {
    code : 1,
    data : JSON.stringify({uid : uid , data :data}),
    message : 'success',
    time : parseInt(Date.now() / 1000)
  }

  // 调用返回数据方法
  cb(null, ret)
}

let server = {
  run : (port = '10001', host = '0.0.0.0') => {

    let serv = new grpc.Server()

    // 添加服务方法
    serv.addService(package[proto].service, {
      demoMethod: demoMethod
    })

    // 绑定端口号
    serv.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure())

    // 启动服务
    serv.start()

    console.log(`grpc server starting at ${host}:${port}`)
  }
}

server.run()
```

#### 客户端调用
`client.js`

```js
const grpc = require('grpc')
const path = require('path')

let proto = 'base'
let protoFile = path.join(__dirname, './protos/' + proto + '.proto')

// 加载proto文件,获取package
let package = grpc.load(protoFile)[proto]

let client = (port = '10001' , host = '127.0.0.1') => {

  return new package[proto](`${host}:${port}`, grpc.credentials.createInsecure())

}

// 方法调用
let req = {uid : '1234567890' , body :JSON.stringify({foo : 'bar'})}
client.demoMeothed(req, (err, response) => {
  if(err) {
    console.log(err)
  }

  console.log(response)
})
```

### 构建rpc服务

#### 封装`server`,`client`

新建`grpc/index.js`文件,将`server`,`client`封装一下

```js
/**
 * grpc
 */
const grpc = require('grpc')
const path = require('path')
const fs = require('fs')

// 加载proto文件,获取package
let protos = fs.readdirSync('./protos')
let services = []

// 所有rpc接口方法的路由目录
let routesPath = path.join(__dirname, './../server/routes')

// 更新定义proto文件加载服务和获取对应接口方法
protos.forEach(protoFile => {
  if (protoFile.indexOf('.ptoto') === -1) {
    continue
  }

  let proto = protoFile.replace('.proto', '')

  // 获取对应服务的接口方法
  let methodPath = path.join(routesPath, proto)
  if (!fs.existsSync(methodPath)) {
    console.log(`method ${proto} not found ...`)
    continue
  }
  let methods = require(methodPath)

  // 加载服务packeage
  let package = grpc.load('./protos/' + protoFile)[proto]

  services.push({
    proto: proto,
    package: package,
    methods: methods
  })

})

// rpc服务端
let getServer = () => {
  let server = new grpc.Server()
  services.forEach(service => {
    server.addService(service.package[service.proto].service, service.methods)
    console.log('addService', service.proto)
  })

  return server
}

exports.server = {
  run: (port, host) => {
    let server = getServer()
    server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure())
    server.start()

    console.log('grpc server start:', `${host}:${port}`)
  }
}

// rpc客户端
let getClients = (name, port = '10001', host = '127.0.0.1') => {

  let clients = {}

  services.forEach(service => {
    if (name != service.proto) {
      continue
    }

    // 获取不同服务对应的client对象
    clients[name] = new service.package[name](`${host}:${port}`, grpc.credentials.createInsecure())
  })

  return clients

}

exports.client = getClients
```

#### 服务端入口

项目目录下`server.js`

```js
import { server } from './grpc'

const config = require('./config').rpc.server

server.run(config.port , config.host)
```

启动服务

```node
node server.js
```

#### 客户端代理

```
// grpc/proxy.js

const {client} = require('./index')
const config = require('./../config').rpc.client

module.exports = (clientServiceName = 'default') => {
  return client(clientServiceName , config.port , config.host)
}
```

调用示例,以base为例

```js
const rpcClient = require('./../grpc/proxy')('base')

let reqObj = {uid : '1234567890' , body :JSON.stringify({foo : 'bar'})}

rpcClient.demoMeothed(reqObj, (err, response) => {
  if(err) {
    console.log(err)
  }

  console.log(response)
})

```

### 小结

当rpc服务构建完毕之后，我们可以把之前的`model`层单独抽离出来，构建一个专门和数据库打交道的后台server，建有关数据的一些逻辑处理放到这个服务中，然后大前端关注前端页面的逻辑处理，数据通过rpc接口获取，这样就可以做到简单的前后端人员分离了