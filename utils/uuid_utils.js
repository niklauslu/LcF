const uuidv4 = require('uuid/v4')

class UuidUtils {

  v4(){
    return uuidv4().replace(/-/g,'')
  }

  random(max = 16  , up = false){
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    let num = up ? 35 +26 : 35
    let res = ''
    for (var i = 0; i < max; i++) {
      var id = Math.ceil(Math.random() * num)
      res += chars[id]
    }
    return res
    
  }

  randomNum(max = 16 ){
    var chars = ['0','1','2','3','4','5','6','7','8','9']

    let num = 9
    let res = ''
    for (var i = 0; i < max; i++) {
      var id = Math.ceil(Math.random() * num)
      res += chars[id]
    }
    return res
    
  }
}

module.exports = new UuidUtils()