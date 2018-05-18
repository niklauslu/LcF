const Log = require('./../lib/log')('log')

Log.info('1111' , 2222)
Log.info('3333')

Log.reqLog('http://www.baidu.com' , {a:1} , {b:2})