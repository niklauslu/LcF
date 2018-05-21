const Sequelize = require('sequelize')
const config = require('./../config/').db

let model = () => {
  let DB

  let getDb = (opt) => {
    let dbname = opt.dbname
    let username = opt.username
    let password = opt.password
    let host = opt.host
    let port = opt.port

    return new Sequelize(dbname, username, password, {
      host: host,
      port: port,
      dialect: 'mysql',
      // operatorsAliases: false,

      pool: {
        max: opt.maxLimit,
        min: 0,
        acquire: 30000,
        idle: 10000
      },

    })
  }

  return {
    // 单例模式
    getInstance: () => {
      if (!DB) {
        DB = getDb(config)
      }

      return DB
    }
  }
}

module.exports = model().getInstance()