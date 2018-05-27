const RedisClient = require('./../lib/redis')

let redisClient = RedisClient()

redisClient.get('app_info:813eae9f7c89465891838986c69731d1').then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
});

redisClient.get('blog_tags:1').then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
});

let rc1 = RedisClient()

rc1.get('blog_tags:8').then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
});

