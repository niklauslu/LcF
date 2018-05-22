const clients = require('./core')

class Client {

  constructor(name = ''){
    this.client = name ? clients[name] : null
  }

  use(proto , method , request ){
    let client = clients[proto]
    return new Promise((resolve , reject) => {
      client[method](request , function (error , response) {  
        if(error){
          console.log('grpc client error:' , error)
          reject(error)
        }

        resolve(response)
      })
    })
  }

  package(name){
    this.client = clients[name]
    return this
  }

  method(name , request){
    
    return new Promise((resolve, reject) => {
      let client = this.client
      if(!client){
        reject('grpc client error: client init err')
      }

      client[name](request, function (error, response) {
        if (error) {
          console.log('grpc client error:', error)
          reject(error)
        }

        resolve(response)
      })
    })
  }
}

module.exports = Client