const grpc = require('grpc')
const path = require('path')
const fs = require('fs')
const config = require('./../../config').rpc

const HOST = config.host + ':' + config.port

// 获取protos
const protosPath = config.protos_path
let protos = fs.readdirSync(protosPath)

let mapService = []
protos.forEach(proto => {
  if (proto.indexOf('.proto') < 0) continue

  let protoPath = path.join(protosPath , proto)
  let package = grpc.load(protoPath)[proto]
  console.log(`load proto from path:${protoPath}`)

  mapService.push({
    proto: proto.replace('.proto' , ''),
    package: package
  })
  
})

// 获取methods
let methods = {}
const methodsPath = config.routes_path
fs.readdirSync(methodsPath).forEach(method => {
  try {
    let methodName = method.replace('.js', '')
    methods[methodName] = require(path.join(methodsPath, methodName))
    console.log(`add method:${methodName}`)
  } catch (err) {
    console.log('add methods error ', err)
  }
})

let getServer = () => {
  let server = new grpc.Server()
  mapService.forEach(service => {
    server.addService(service.package[service.proto].service, methods[service.proto])
    console.log('addService', service.proto)
  })

  return server
}


module.exports = {
  run : () => {
    let server = getServer()
    server.bind(HOST, grpc.ServerCredentials.createInsecure())
    server.start()

    console.log('grpc server start:', HOST)
  }
}
