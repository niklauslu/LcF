const fs = require('fs')
const path = require('path')

let config = {

  // 数据库mysql配置
  db: {

  },

  // session配置
  session: {
    secret: 'qweasdzxcrtyfghvbn'
  },

  // web站点port
  port: 9000,

  // rpc配置
  rpc: {

    server: {
      host: '0.0.0.0',
      port: '10001',
    },

    client: {
      host: '127.0.0.1',
      port: '10001',
    },

    protos_path: path.join(__dirname, './../grpc/protos')
  }

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