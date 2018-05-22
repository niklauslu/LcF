const grpc = require('grpc')
const path = require('path')
const config = require('./../config/index')
const protos = config.protos.default
const HOST = config.host.default

let clients = {}

protos.forEach(proto => {
  let protoPath = path.join(__dirname, './../protos/' + proto + '.proto')
  let package = grpc.load(protoPath)[proto]
  let client = new package[proto](HOST , grpc.credentials.createInsecure())
  clients[proto] = client
})

module.exports = clients
