var express = require('express')
//引入path,是node的核心模块,专门用来解析路径问题的
var path = require('path')
var router = express.Router()
router.get('/userLogin',function (req, res) {
  var filepath = path.resolve(__dirname,'../public/login.html')
  res.sendFile(filepath)
})
router.get('/userRegist',function (req, res) {
  var filepath = path.resolve(__dirname,'../public/regist.html')
  res.sendFile(filepath)
})
module.exports = router;