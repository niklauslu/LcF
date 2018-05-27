# 数据库操作

> 相对于前端开发人员来说，后端开发更加关心的是数据库操作，Node.js有相关的[mysql](https://github.com/mysqljs/mysql)模块可以进行数据库的操作，这种没有用到ORM的思想，在开发过程中，还是效率不是很高，所以改用[Sequelize](http://docs.sequelizejs.com/manual/installation/getting-started.html)来进行数据库的操作

### 核心文件引入sequelize

```node
npm install sequelize --save
npm install mysql2 --save
```

建立文件`lib/model.js`

```js
const Sequelize = require('sequelize')
// 数据库配置
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
```

单例模式在设计模式中是一种非常常见的模式，这个有兴趣的可以深入了解下

### 建立一个model基类base_model
`server/model/base_model.js`

```js
const DB = require('./../../lib/model')

class BaseModel {

  constructor() {}

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

}

module.exports = BaseModel
```

建立一个基类的目的是为了把一些公共方法抽离出来，让你需要的model都继承这个基类，比如还可以写一个公共的save方法，在实际使用中，你会体会到继承的好处的

```js

/**
 * 公共保存方法
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

```

### 定义对应的模型xxx_model

已定义一个`app_model`为例，建立一个文件`server/model/app_model.js`

```js
const Sequelize = require('sequelize')
const BaseModel = require('./base_model') // 引入需要继承的基类

class AppModel extends BaseModel{

  constructor() {
    super() // 应用基类构造方法

    // 参照sequelize文档，定义一个model
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
      
      // 还有很多属性

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
      createdAt: 'create_time', // create_time字段
      updatedAt: 'update_time', // update_time字段
      freezeTableName: true,
      tableName: 't_app'
    })

    this._model = model
    return this
  }

  // 编写相关的模型方法
  ...

  async getById(id){
    let data = await this.model().findById(id)
    return data 
  }

}

module.exports = () => {
  return new AppModel()
}
```

> sequelize默认使用createdAt和updatedAt，都是date类型，这里通过配置改为create_time和udpate_time时间戳类型

### Model的使用

引入model
```
const AppModel = require('./../server/model/app_model.js')
```

调用`getById()方法`
```
AppModel().getById(id).then(res => {})
```

还可以直接调用sequelize的方法
```
AppModel().model().findById(id)
```

### 小结

这里只是做了一个简单的数据库操作的整合，Sequelize是一个很强大的数据库ORM，想要熟练的在项目中使用，就多多去翻翻官方文档吧（[传送门](http://docs.sequelizejs.com/manual/installation/getting-started.html)）