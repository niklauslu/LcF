const fs = require('fs')
const path = require('path')

let config = {

  // 数据库mysql配置
  db: {
    host: '59939c0a9a983.gz.cdb.myqcloud.com',
    port: 5579,
    dbname: 'cc_sneaker',
    username: 'root',
    password: 'Lucong19890512',
    maxLimit: 10,
  },

  // session配置
  session : {
    secret : 'qweasdzxcrtyfghvbn'
  },

  // web站点port
  port : 9000

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