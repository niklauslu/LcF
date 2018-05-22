const request = require('request')

class HttpUtil {

  get(action){
    return new Promise((resolve, reject) => {
      request( action, (error, response, body) => {
        if(error){
          reject(error)
        }
        
        if (!error && response.statusCode == 200) {
          resolve(body)
        }
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
      })
    })
    
  }

  post(action , data = {} , method = 'json'){
    // console.log('xml================' , data)
    let contentType = 'application/json'
    let body = data
    if(method == 'json'){
      // if (data){
      //   body = JSON.stringify(data)
      // }
      
    }else if(method == 'xml'){
      contentType = 'text/xml'
      body = this._objToXml(data)
      
    }
    // console.log('===================' , body)
    return new Promise((resolve, reject) => {
      request({
        url: action,
        method: 'POST',
        json: true,
        headers: {
          'content-type' : contentType,
        },
        body: body
      }, function (error, response, body) {
        // console.log(response.statusCode)
        if(error) {
          reject (response)
        }
        if (!error && response.statusCode == 200) {
          resolve(body)
        }
      })
    })
  }

  _objToXml(obj){
 
    let xml = '<xml>'
    for (let key in obj) {
      if(obj[key]){
        xml += `<${key}>${obj[key]}</${key}>`
      }
      
    }
    xml += '</xml>'
    // console.log('_objToXml================' , xml)
    return xml
  }
}

module.exports = new HttpUtil