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