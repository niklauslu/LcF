/**
 * 错误处理中间件类
 */

class ErrorMid {

  // 错误日志输出
  logErrors(err, req, res, next) {
    console.error(err.stack)
    next(err)
  }

  // 错误处理
  errorHandler(err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({
        error: 'Something blew up!'
      })
    } else {
      // next(err);
      res.status(500).send('500 error ! Something blew up!')
    }
  }

  // 404错误处理
  error404(req, res, next) {

    if (req.xhr) {
      return res.status(404).json({
        code: 404
      })
    } else {
      // error page
      return res.status(404).send('404 not found!')
    }

  }
  

}

module.exports = new ErrorMid()