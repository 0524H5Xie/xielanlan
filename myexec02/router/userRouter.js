var express = require('express')
var sha1 = require('sha1')
var bodyParser = require('body-parser')
var Users = require('../model/Users');
var router = express.Router();
//业务逻辑,应用第三方中间件
router.use(bodyParser.urlencoded({extended:true}))

var usernameReg = /^[A-Za-z_0-9]{5,10}$/     //用户可以输入英文、数字、下划线，长度为5-10位
var pwdReg = /^[A-Za-z_0-9]{6,18}$/     //可以输入英文、数字、下划线，长度为6-18位
var emailReg = /^[A-Za-z_0-9]{3,10}@[A-Za-z_0-9]{2,5}\.com$/
//应用级中间件,定义中间函数
function regTest(req,res,next) {
  //
  var username = req.body.username;
  var pwd = req.body.pwd;
  var rePwd = req.body.rePwd;
  var email = req.body.email;
  var type = req.body.type;

  //router
  /*  if(type === 'regist' && pwd !== rePwd){
      res.send('两次密码不一致')
      return
    }
    if (!usernameReg.test(username)) {
      //返回响应，错误提示给用户
      res.send('用户名不符合规范，可以输入英文、数字、下划线，长度为5-10位');
      return;
    } else if (!pwdReg.test(pwd)) {
      //返回响应，错误提示给用户
      res.send('密码不符合规范，可以输入英文、数字、下划线，长度为6-18位');
      return;
    } else if (type === 'regist' && !emailReg.test(email)) {
      //返回响应，错误提示给用户
      res.send('邮箱不符合规范');
      return;
    }
    next()
  }*/
  //ejs
  var errMsg = {}
  if (type === 'regist' && pwd !== rePwd) {
    errMsg.rePwdErr = '两次密码不一样~~~~~';
  }
  if (!usernameReg.test(username)) {
    //返回响应，错误提示给用户
    errMsg.usernameErr = '用户名不符合规范，可以输入英文、数字、下划线，长度为5-10位';
  }
  if (!pwdReg.test(pwd)) {
    //返回响应，错误提示给用户
    errMsg.pwdErr = '密码不符合规范，可以输入英文、数字、下划线，长度为6-18位';
  }
  if (type === 'regist' && !emailReg.test(email)) {
    //返回响应，错误提示给用户
    errMsg.emailErr = '邮箱不符合规范';
  }
  //返回到响应对象res上
  res.errMsg = errMsg;
  next();
}

//登录
 //router
/*router.post('/login',regTest,function (req, res) {
  var username = req.body.username;
  var pwd = req.body.pwd;
  Users.findOne({username:username,pwd:sha1(pwd)},function(err){
    if(!err && data){
      res.send('登录成功' + username);
    }else{
      res.send('登录失败,')
    }
  })
})*/
 //ejs
router.post('/login',regTest,function (req, res) {
  var username = req.body.username;
  var pwd = req.body.pwd;
  var errMsg = res.errMsg;
  if(errMsg.usernameErr ||errMsg.pwdErr){
    errMsg.username = username;
    res.render('login',{errMsg:errMsg})
    return
  }
  Users.findOne({username:username,pwd:sha1(pwd)},function(err){
    if(!err && data){
      res.send('登录成功' + username);
    }else{
      res.render('login',{errMsg:{err:'用户名或密码错误'}})
    }
  })
})
//注册
 //router
/*router.post('/regist',regTest,function (req,res){
  var username = req.body.username;
  var pwd = req.body.pwd;
  var email = req.body.email;
  Users.findOne({username:username},function (err,data) {
    if(!err && !data){
      Users.create({username:username,pwd : sha1(pwd),email:email},function (err) {
        if(!err) res.send('注册成功')
        else console.log(err);
      })
    }else res.send('用户名已存在,请再次输入')
  })
})*/
 //ejs
router.post('/regist',regTest,function (req,res){
  var username = req.body.username;
  var pwd = req.body.pwd;
  var email = req.body.email;
  var errMsg = res.errMsg;
  if(errMsg.usernameErr ||errMsg.pwdErr ||errMsg.rePwdErr ||errMsg.emailErr){
    errMsg.username = username;
    errMsg.email = email;
    res.render('regist',{errMsg:errMsg})
    return;
  }
  Users.findOne({username:username},function (err,data) {
    if(!err && !data){
      Users.create({username:username,pwd : sha1(pwd),email:email},function (err) {
        if(!err) res.redirect('/userLogin')

        else console.log(err);
      })
    }else {
      res.render('regist',{errMsg:{usernameErr:'用户名已存在,请再次输入'}})
    }
  })
})
//暴漏
module.exports = router;