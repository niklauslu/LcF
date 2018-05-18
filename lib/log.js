/**
 * 日志类
 */
const log4js = require('log4js')

class Log {
  constructor(opt) {
    let filename = typeof opt === 'string' ? opt : opt.name

    log4js.configure({
      appenders: {
        req: {
          type: 'dateFile',
          filename:  'logs/req/',
          pattern: 'yyyy-MM-dd.log',
          maxLogSize: 10 * 1024 * 1024, // = 10Mb
          numBackups: 5, // keep five backup files
          compress: true, // compress the backups
          encoding: 'utf-8',
          alwaysIncludePattern: true
        },
        dateFile: {
          type: 'dateFile',
          filename:  'logs/',
          pattern: 'yyyy-MM/dd/' + filename + '.log',
          maxLogSize: 10 * 1024 * 1024, // = 10Mb
          numBackups: 5, // keep five backup files
          compress: true, // compress the backups
          encoding: 'utf-8',
          alwaysIncludePattern: true
        },
        out: {
          type: 'stdout'
        }
      },
      categories: {
        default: {
          appenders: ['req', 'out'],
          level: 'trace'
        },
        dateFile : {
          appenders: ['dateFile', 'out'],
          level: 'trace'
        }
      }
    })

    this.logger = log4js.getLogger('dateFile')
    this.reqLogger = log4js.getLogger()
  }

  _log(level = 'info' , ...args){
    // let args = arguments || []

    let infos = []
    for (var key in args) {
      // if(key = 'level') continue

      if (args.hasOwnProperty(key)) {
        if (typeof args[key] == 'object') {
          infos.push(JSON.stringify(args[key]))
        } else if (typeof args[key] == 'undefined') {
          infos.push('undefined')
        } else if (typeof args[key] == 'function') {
          infos.push('function')
        } else {
          infos.push(args[key])
        }

      }
    }

    let logStr = infos.join(' | ')
    this.logger[level](logStr)
  }

  info(...args){
    // let args = arguments || []
    this._log('info' , ...args)
  }

  /**
   * 记录请求日志
   * @param {*} url 
   * @param {*} query 
   * @param {*} body 
   */
  reqLog(url , method = 'GET', query = null , body = null){
    this.reqLogger.info('req url:' + url)

    if(query) this.reqLogger.info('req query:' + JSON.stringify(query))
    if(body) this.reqLogger.info('req body:' + JSON.stringify(body))
  }
}

module.exports = (opt) => {
  return new Log(opt)
}