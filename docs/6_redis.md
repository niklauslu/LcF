# Redis集成

> redis是一个key-value的存储系统，在项目数据库一般使用的是mysql，redis在项目中一般可用于做缓存的处理，nodejs在使用redis时是很方便的

### 安装redis

在不同操作系统安装redis服务，可自行google或者百度

### node_redis集成

```node
npm install redis --save
```

建立核心类`lib/redis.js`

```js
const redis = require('redis')

class Client {
  
  // 构造函数
  constructor(host, port) {
    this.client = redis.createClient(port, host)
    // 错误
    this.client.on('error',  (err) => {
      console.log('redis error ' , err)
    })
    // 关闭
    this.client.on('end' , () => {
      console.log('redis end ')
    })
  }

}

module.exports = (host = '127.0.0.1', port = '6379') => {
  // redis默认host，端口号是120.0.0.1:6379
  return new Client(host, port)
}

```

添加方法

```js
// 设置值
set(key, value, expire = 0) {
  let that = this
  return new Promise((resolve, reject) => {
    that.client.set(key, value, function (err) {

      if (err) {
        reject(err)
      } else {
        if (expire) {
          that.client.expire(key, expire, function (err) {
            if (err) {
              reject(err)
            } else {
              resolve(true)
            }
          })
        } else {
          resolve(true)
        }

      }

      that.client.quit()
    })
  })

}

// 取值
get(key) {
  let that = this
  return new Promise((resolve, reject) => {
    that.client.get(key, function (err, reply) {
      if (err) {
        reject(err)
      } else {
        resolve(reply)
      }

      that.client.quit()
    })
  })
}

// 删除
del(key) {
  let that = this
  return new Promise((resolve, reject) => {
    that.client.del(key, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }

      that.client.quit()
    })
  })
}

```

### 小结

这就样一个简单的redis核心应用类就完成了，基本可以满足在项目中做缓存的需求的，redis的功能其实远不止这么简单，遇到复杂的情况，可根据情况继续扩展