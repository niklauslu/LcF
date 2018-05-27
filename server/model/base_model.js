const DB = require('./../../lib/model')

class BaseModel {

  constructor() {

  }

  /**
   * 获取模型
   */
  model() {
    return this._model || null
  }

  /**
   * 返回db
   */
  db() {
    return DB
  }

  /**
   * 事务支持
   */
  async getTrans() {
    return await DB.transaction()
  }

  /**
   * 原生sql查询
   * @param {*} sql 
   * @param {*} replacements 
   */
  async query(sql, replacements = null) {
    let opts = {}
    opts.type = DB.QueryTypes.SELECT
    if (replacements) opts.replacements = replacements
    return await DB.query(sql, opts)
  }

  /**
   * 
   * @param {*} data 
   * @param {*} key 
   * @param {*} keyCheck 
   */
  async save(data, keys = ['id']) {

    if (!this._model) {
      return null
    }

    let obj = null
    if (keys.length) {
      let where = {}
      keys.forEach(key => {
        if (data[key]) where[key] = data[key]
      })

      obj = await this._model.findOne({
        where: where
      })
    }

    let res
    if (obj) {
      // 更新
      res = await obj.update(data)
    } else {
      // 新增
      res = await this._model.create(data)
    }

    return res

  }

  async lists(where = {}, page = 1, size = 0, order = null) {

    let opt = {}
    opt.where = where
    if (size) {
      opt.offset = (page - 1) * size
      opt.limit = size
    }
    if (order) {
      opt.order = order
    }
    let ret = await this._model.findAndCountAll(opt)
    return [ret.rows, ret.count]
  }


}

module.exports = BaseModel