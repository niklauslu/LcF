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