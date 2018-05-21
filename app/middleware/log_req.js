const Log = require('../../lib/log')()
const uuid = require('uuid')

let logReq = (req , res , next) => {

  let method = req.originalMethod
  let url = req.originalUrl
  let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip
  let referer = req.get('referer') || ''
  
  let body = (method.toUpperCase() == 'POST') ? req.body : null

  let reqUid = uuid.v1()
  req.UID = reqUid

  Log.reqLog(url, method, ip, referer, body , reqUid)

 
  next()

}

module.exports = logReq