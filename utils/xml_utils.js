const xml2js = require('xml2js')

class XmlUtils {

  toObj(xml){
    var parseString = xml2js.parseString
    return new Promise((resolve , reject) => {
      parseString(xml, { explicitArray: false } , (err, result) => {
        if(err) {
          reject(err)
        }
        resolve(result.xml)
      })
    })
   
  }
}

module.exports = new XmlUtils()