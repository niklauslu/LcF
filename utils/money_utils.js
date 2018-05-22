
class MoneyUtils {

  format(number, places = 2, symbol = '', thousand = ',', decimal = '.') {
    places = !isNaN(places = Math.abs(places)) ? places : 2
    symbol = symbol !== undefined ? symbol : '￥'
    thousand = thousand || ','
    decimal = decimal || '.'
    number = number / 100
    var negative = number < 0 ? '-' : ''
    var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + ''
    var j = (j = i.length) > 3 ? j % 3 : 0
    return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '')
  }

}

module.exports = new MoneyUtils()