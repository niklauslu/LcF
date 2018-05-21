const Sequelize = require('sequelize')
const BaseModel = require('./base_model')

class AppModel extends BaseModel {

  constructor() {
    super()

    let model = this.db().define('app', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      uuid: {
        type: Sequelize.STRING(32)
      },
      name: {
        type: Sequelize.STRING(64)
      },
      app_id: {
        type: Sequelize.STRING(32)
      },
      app_secret: {
        type: Sequelize.STRING(128)
      },
      description: {
        type: Sequelize.STRING(255),
        defaultValue: ''
      },
      access_token: {
        type: Sequelize.STRING(255),
        defaultValue: ''
      },
      access_token_deadline: {
        type: Sequelize.BIGINT(11),
        defaultValue: 0
      },
      jsapi_ticket: {
        type: Sequelize.STRING(255),
        defaultValue: ''
      },
      jsapi_ticket_deadline: {
        type: Sequelize.BIGINT(11),
        defaultValue: 0
      },
      verify_text: {
        type: Sequelize.STRING(64),
        defaultValue: ''
      },
      verify_code: {
        type: Sequelize.STRING(32),
        defaultValue: ''
      },
      original_id: {
        type: Sequelize.STRING(32),
        defaultValue: ''
      },
      create_time: {
        type: Sequelize.BIGINT(11),
        defaultValue: parseInt(Date.now() / 1000)
      },
      update_time: {
        type: Sequelize.BIGINT(11),
        defaultValue: parseInt(Date.now() / 1000)
      },
      status: {
        type: Sequelize.INTEGER(2),
        defaultValue: 1
      }

    }, {
      timestamps: true,
      createdAt: 'create_time',
      updatedAt: 'update_time',
      freezeTableName: true,
      tableName: 't_app'
    })

    this._model = model
    return this
  }

  getUuid() {
    let random = (max = 16, up = false) => {
      var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ]

      let num = up ? 35 + 26 : 35
      let res = ''
      for (var i = 0; i < max; i++) {
        var id = Math.ceil(Math.random() * num)
        res += chars[id]
      }
      return res

    }

    return 'oc_' + random()
  }

  async getByUUid(uuid) {
    let data = await this._model.findOne({
      where: {
        uuid: uuid
      }
    })
    return data
  }

  async getByAppId(appId) {
    let data = await this._model.findOne({
      where: {
        app_id: appId
      }
    })
    return data
  }

  /**
   * 更新app信息
   * @param {*} uuid 
   * @param {*} data 
   */
  // async updateInfo(uuid , data){
  //   let find = await this.getByUUid(uuid)
  //   if(find){
  //     await find.update(data)
  //     return find
  //   }else{
  //     data.uuid = uuid
  //     let appObj = await this._model.create(data)
  //     return appObj
  //   }
  // }

  async updateInfoByUuid(uuid, data) {
    let find = await this.getByUUid(uuid)
    if (find) {
      await find.update(data)
      return find
    } else {
      return false
    }
  }

  /**
   * 获取微信配置
   * @param {*} uuid 
   */
  async getAppWxOpt(uuid) {
    let app = await this.getByUUid(uuid)
    if (app) {
      return {
        app_id: app.app_id,
        app_secret: app.app_secret
      }
    } else {
      return null
    }
  }

  /**
   * 获取access_token
   * @param {*} uuid 
   * @param {*} access_token 
   */
  async getAccessToken(uuid, access_token = '') {
    let app = await this.getByUUid(uuid)
    if (!app) return null

    let dateNow = parseInt(Date.now() / 1000)
    let accessToken = app.access_token
    let deadline = app.access_token_deadline
    if (deadline > dateNow) {
      return accessToken ? accessToken : null
    } else {
      if (access_token) {
        app.access_token = access_token
        app.access_token_deadline = dateNow + 7000
        await app.save()

        return access_token
      } else {
        return null
      }
    }
  }

  /**
   * 获取jsapi_ticket
   * @param {*} uuid 
   * @param {*} jsapi_ticket 
   */
  async getJsapiTicket(uuid, jsapi_ticket = '') {
    let app = await this.getByUUid(uuid)
    if (!app) return null

    let dateNow = parseInt(Date.now() / 1000)
    let jsapiTicket = app.jsapi_ticket
    let deadline = app.jsapi_ticket_deadline

    if (deadline > dateNow) {
      return jsapiTicket ? jsapiTicket : null
    } else {
      if (jsapi_ticket) {
        app.jsapi_ticket = jsapi_ticket
        app.jsapi_ticket_deadline = dateNow + 7000
        await app.save()

        return jsapi_ticket
      } else {
        return null
      }
    }
  }
}

module.exports = function () {
  return new AppModel()
}