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


