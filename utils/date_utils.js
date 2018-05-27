const moment = require('moment')

class DateUtils {

  getTimestamp(timeStr){
    let date = new Date(timeStr)
    return parseInt(date.getTime() / 1000)
  }

  dateFormat(timestamp, format){
    format = format || 'YYYY-MM-DD HH:mm'
    let date = null
    if (!timestamp) {
      date = new Date()
    } else {
      date = new Date(timestamp * 1000)
    }
    //logger.debug(date);
    return moment(date).format(format)
  }

  dateDisplay(timestamp){
    let now = parseInt(Date.now() / 1000)
    let long = now - timestamp
    if(long < 60){
      return long + '秒前'
    }else if (long >= 60 && long < 3600){
      return parseInt(long / 60).toString() + '分钟前'
    }else if(long >= 3600 && long < 24 * 3600){
      return parseInt(long / 3600).toString() + '小时前'
    }else if(long >= 24 * 3600 && long < 24 * 3600 * 30){
      return parseInt(long / 3600 / 24).toString() + '天前'
    }else {
      let format = 'YYYY-MM-DD HH:mm'
      let date = new Date(timestamp * 1000)
      return moment(date).format(format)
    }
  }

  monthPlus(timestamp , num = 1  , returnTimestamp = true){
    let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    let year = parseInt(this.dateFormat(timestamp , 'YYYY'))
    let month = parseInt(this.dateFormat(timestamp , 'MM'))
    let day = parseInt(this.dateFormat(timestamp,'DD'))
    // console.log('year:' , year)
    // console.log('month:' , month)
    // console.log('day:' , day)
    // 设置二月的值
    if(((year % 4 == 0) && (year / 100 != 0)) || (year % 100 == 0) && (year % 400 == 0)){
      monthDays[1] = 29
    }else{
      monthDays[1] = 28
    }

    let days = 0
    // 起始月份的天数
    let currentMonthDay = monthDays[month - 1] - day
    days += currentMonthDay
    // console.log('first day:' , days)
    for(let i=0 ; i < num ; i++){
      month = month + 1
      if(month > 12){
        month = 1
        year = year + 1
      } 
      // 设置二月的值
      if(((year % 4 == 0) && (year / 100 != 0)) || (year % 100 == 0) && (year % 400 == 0)){
        monthDays[1] = 29
      }else{
        monthDays[1] = 28
      }

      let thisMonthDay = monthDays[month-1]
      // 最后一个月
      if(i == num -1){
        thisMonthDay = ((thisMonthDay - day) < 0) ? thisMonthDay : day
      }
      console.log('for days:' , thisMonthDay)
      days += thisMonthDay
    }

    if (returnTimestamp){
      timestamp = timestamp || parseInt(Date.now() / 1000)
      return timestamp + days * 24 * 3600
    }else {
      return days
    }
    
  }
}

module.exports = new DateUtils()