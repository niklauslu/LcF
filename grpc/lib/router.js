class Router {

  constructor() {
    this._methods = {}
  }

  method(method, fn) {
    let self = this
    this._methods[method] = function (call, callback) {

      let cb = callback
      let response = {
        send: (data, code = 0, msg = '') => {
          let ret = {
            code: code,
            data: data ? JSON.stringify(data) : '',
            msg: msg,
            time: parseInt(Date.now() / 1000)
          }
          cb(null, ret)
        },
        json: (obj) => {
          cb(null, {
            code: obj.code || 0,
            data: obj.data ? JSON.stringify(obj.data) : '',
            msg: obj.msg || '',
            time: parseInt(Date.now() / 1000)
          })
        }
      }

      fn(call.request, response)

    }
  }

  methods() {
    return this._methods
  }

  use(methods) {
    for (let key in methods) {
      this._methods[key] = methods[key]
    }
  }

}

module.exports = () => {
  return new Router()
}