const express = require('express')
const router = express.Router()

router.use('/' , async(req , res) => {
  res.locals.title = 'LcF'
  return res.render('index')
})

module.exports = router