/**
 * 日志类
 */
const log4js = require('log4js')

class Log {
  
  constructor(opt = '') {
    let filename = typeof opt === 'string' ? (opt ? opt : 'default') : (opt.name ? opt.name : 'default')
    this.filename = filename
  }

  _init(){
    log4js.configure({
      appenders: {
        req: {
          type: 'dateFile',
          filename: 'logs/req/',
          pattern: 'yyyy-MM-dd.log',
          maxLogSize: 10 * 1024 * 1024, // = 10Mb
          numBackups: 5, // keep five backup files
          compress: false, // compress the backups
          encoding: 'utf-8',
          alwaysIncludePattern: true
        },
        dateFile: {
          type: 'dateFile',
          filename: 'logs/',
          pattern: 'yyyy-MM/dd/' + this.filename + '.log',
          maxLogSize: 10 * 1024 * 1024, // = 10Mb
          numBackups: 5, // keep five backup files
          compress: false, // compress the backups
          encoding: 'utf-8',
          alwaysIncludePattern: true
        },
        out: {
          type: 'stdout'
        }
      },
      categories: {
        default: {
          appenders: ['dateFile', 'out'],
          level: 'trace'
        },
        req: {
          appenders: ['req', 'out'],
          level: 'trace'
        }
      }
    })

    this.logger = log4js.getLogger()
    this.reqLogger = log4js.getLogger('req')
  }

  _log(level = 'info' , ...args){

    this._init()

    let infos = []
    for (var key in args) {

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

  trace(...args){
    this._log('trace' , ...args)
  }

  debug(...args){
    this._log('debug', ...args)
  }

  warn(...args){
    this._log('warn' , ...args)
  }

  error(...args){
    this._log('error', ...args)
  }

  fatal(...args){
    this._log('fatal', ...args)
  }

  /**
   * 记录请求日志
   * @param {*} url 
   * @param {*} query 
   * @param {*} body 
   */
  reqLog(url , method = 'GET', ip = '' , referer = '', body = null , uid = ''){
    this._init()

    this.reqLogger.info(`[${uid}] ${method} ${url} Ip:${ip} Referer:${referer}`)
    if(body) this.reqLogger.info('[${uid}] body:' + JSON.stringify(body))
  }
}

module.exports = (opt = '') => {
  return new Log(opt)
}