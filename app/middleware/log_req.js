const Log = require('../../lib/log')()
const uuid = require('uuid')

/**
 * 记录请求日志
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let logReq = (req , res , next) => {

  // 从req中获取需要记录的信息
  let method = req.originalMethod
  let url = req.originalUrl
  let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip
  let referer = req.get('referer') || ''
  
  let body = (method.toUpperCase() == 'POST') ? req.body : null

  // 生成请求的唯一标识
  let reqUid = uuid.v1()
  req.UID = reqUid

  Log.reqLog(url, method, ip, referer, body , reqUid)

  next()

}

module.exports = logReq