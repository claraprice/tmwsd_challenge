var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
  res.send('TMWSD is here!')
})

module.exports = router
