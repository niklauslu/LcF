const express = require('express')
const router = express.Router()
const Log = require('./../../lib/log')('router-index')

router.use('/' , async(req , res) => {
  res.locals.title = 'LcF'

  Log.info('/index timestemp' , Date.now())
  return res.render('index')
})

module.exports = router