//1. 引入express模块
var express = require('express');

//2. 引入node中的核心模块path来解决路径的问题
var path = require('path');

//3. 创建路由器,这里就相当于小型的app对象
var router = express.Router();

//4. 用户访问登录页面的路由
router.get('/userLogin', function (req, res) {
  //处理文件的路径跳出一层的问题
  var filePath = path.resolve(__dirname, '../', 'public/login.html');
  //返回登录页面给用户
  res.sendFile(filePath);
});

//5. 用户访问注册页面的路由
router.get('/userRegister', function (req, res) {
  //处理文件的路径跳出一层的问题
  var filePath = path.resolve(__dirname, '../', 'public/register.html');
  //返回注册页面给用户
  res.sendFile(filePath);
});



//6. 因为这是一个独立的模块，所以我们要曝露出去我们写好的router模块,方便外面使用。
module.exports = router;