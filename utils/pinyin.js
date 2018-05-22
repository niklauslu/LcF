const pinyin = require('pinyin')

class Pinyin {
 
  trans(str){

    let res = pinyin(str , {
      style: pinyin.STYLE_NORMAL, // 设置拼音风格 
      heteronym: true
    })

    let resArr = []
    res.map(e => {
      resArr.push(e[0])
    })

    return resArr.join('_')
  }


}

module.exports = new Pinyin()
