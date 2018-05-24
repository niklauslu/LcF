const grpc = require('grpc')
const path = require('path')
const fs = require('fs')

// 加载proto文件,获取package
let protos = fs.readdirSync('./protos')
let services = []
let routesPath = path.join(__dirname, './../server/routes')

protos.forEach(protoFile => {
  if(protoFile.indexOf('.ptoto') === -1){
    continue
  }

  let proto = protoFile.replace('.proto' , '')

  let methodPath = path.join(routesPath, proto)
  if(!fs.existsSync(methodPath)){
    console.log( `method ${proto} not found ...`)
    continue
  }

  let methods = require(methodPath)

  let package = grpc.load('./protos/' + protoFile)[proto]

  services.push({
    proto : proto,
    package : package,
    methods : methods
  })


}) 

// methods
let methods = {}

fs.readdirSync(routesPath).forEach(routers => {
  let key = routers.replace('.js' , '')
  methods[key] = require(path.join(routesPath , key))
})

let getServer = () => {
  let server = new grpc.Server()
  services.forEach(service => {
    server.addService(service.package[service.proto].service, service.methods)
    console.log('addService', service.proto)
  })

  return server
}

exports.server = {
  run : (port , host) => {
    let server = getServer()
    server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure())
    server.start()

    console.log('grpc server start:', `${host}:${port}`)
  }
}

let getClients = (name , port = '10001', host = '127.0.0.1') => {

  let clients = {}

  services.forEach(service => {
    if (name != service.proto){
      continue
    }

    clients[name] = service.package[name](`${host}:${port}`, grpc.credentials.createInsecure())
  })

  return clients

}

exports.client = getClients