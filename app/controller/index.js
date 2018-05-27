const express = require('express')
const router = express.Router()
const Log = require('./../../lib/log')('router-index')

router.use('/' , async(req , res) => {
  // res.locals.title = 'LcF'

  // Log.info('/index timestemp' , Date.now())
  // res.locals.datas = JSON.stringify({msg : 'hello ssr!'})
  // res.locals.sub_title = 'welcome !!!!!'
  // return res.render('index')
  // res.locals.message = 'Hello Vue SSR!'
  res.locals.title = 'hello'
  res.display()

})

module.exports = router