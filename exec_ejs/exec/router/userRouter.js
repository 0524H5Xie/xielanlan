//1. 引入express模块
var express = require('express');

//2. 引入加密模块,加密是不可逆的
var sha1 = require('sha1');

//3. 引入第三方中间件
var bodyParser = require('body-parser');

//4. 引入Users模块
var Users = require('../model/Users');

//5. 创建路由器,这里就相当于小型的app对象
var router = express.Router();

//6. 引用第三方中间件，来实现post请求解析请求主体内容，然后挂载到req.body上去,固定写法。
router.use(bodyParser.urlencoded({extended: true}));


//7. 正则验证用户填写的信息是否规范
var usernameReg = /^[A-Za-z_0-9]{5,10}$/;     //用户可以输入英文、数字、下划线，长度为5-10位
var pwdReg = /^[A-Za-z_0-9]{6,18}$/;    //可以输入英文、数字、下划线，长度为6-18位
var emailReg = /^[A-Za-z_0-9]{3,10}@[A-Za-z_0-9]{2,5}\.com$/;

//8. 定义一个中间件函数，中间件就是相当是一个函数
function regTest(req,res,next) {
  // 1. 获取用户填写的信息
  var userMsg = req.body;
  var username = userMsg.username;
  var pwd = userMsg.pwd;
  var rePwd = userMsg.rePwd;
  var email = userMsg.email;
  //2. 让页面提交的时候，默认传递过来一个默认的参数
  var type = userMsg.type;
  //定义一个变量errMsg用来存储所有的错误信息,默认是一个空对象
  var errMsg = {};

  //3. 判断密码和确认密码是否一致
  if (type === 'register' && pwd !== rePwd) {
    //渲染页面
    //往错误对象errMsg上动态添加一个属性，记录这次的错误信息
    errMsg.rePwdErr = '两次输入的密码不一致，请重新输入~~';
  }

  //4. 正则验证用户填写的信息是否规范,并且手机所有的错误信息。
  if (!usernameReg.test(username)) {
    errMsg.usernameErr = '用户名不符合规范，可以输入英文、数字、下划线，长度为5-10位';
  } else if (!pwdReg.test(pwd)) {
   errMsg.pwdErr = '密码不符合规范，可以输入英文、数字、下划线，长度为6-18位';
  } else if (type === 'regist' && !emailReg.test(email)) {
    //返回响应，错误提示给用户
   errMsg.emailErr = '邮箱不符合规范';
  }
  //把收集完成的错误信息的错误对象挂载到res上去，让下面的路由模块也可以共享同一个res对象，这样就可以访问到res对象上的错误对象了。
  res.errMsg = errMsg;

  //5. 调用next()方法，不然下面的路由不会执行
  next();

}

//9. 设置路由
  //9.1 处理登录逻辑的路由
router.post('/login', regTest, function (req, res) {
  var userMsg = req.body;
  var username = userMsg.username;
  var pwd = userMsg.pwd;
  //拿到错误对象
  var errMsg = res.errMsg;

  //判断用户名和密码有没有产生错误
  if(errMsg.usernameErr || errMsg.pwdErr) {
    //渲染ejs模板之前，将用户输入的用户名挂载到错误对象上。
    errMsg.username = username;
    //渲染页面，返回错误对象
    res.render('login',{errMsg: errMsg});
    return;
  }

  //5.检测用户输入的信息和数据库中的信息是否一致
  Users.findOne({username: username, pwd: sha1(pwd)}, function (err, data) {
    if (!err && data) {
      res.send('登录成功~~' + username);
    } else {
      res.render('login',{errMsg: {err: '用户名或者密码错误'}});
    }
  });

});

  //9.2 处理注册逻辑的路由
router.post('/register', regTest, function (req, res) {

  var userMsg = req.body;
  var username = userMsg.username;
  var pwd = userMsg.pwd;
  var email = userMsg.email;
  //获取错误对象
  var errMsg = res.errMsg;


  //判断用户输入的信息有没有产生错误信息
  if(errMsg.usernameErr || errMsg.pwdErr ||errMsg.rePwdErr || errMsg.emailErr) {
    //渲染ejs模板之前，将用户输入的用户名挂载到错误对象上。
    errMsg.username = username;
    errMsg.email = email;
    //渲染页面，返回错误信息
    res.render('register',{errMsg: errMsg});
    return;
  }

  //去数据库中查找是否有相同用户名
  Users.findOne({username: username}, function (err, data) {

    if (!err && !data) {
      //方法没有出错并且没有找到相同的用户名
      // 5. 将用户的信息保存数据库中，注册成功
      Users.create({username: username, pwd: sha1(pwd), email: email}, function (err) {
        if (!err) {
          //因为没有错误，可以登录，为了满足，url地址我们将资源重定向到userLogin上。
          res.redirect('/userLogin');
        }else console.log(err);

      })
    } else {
      //方法出错了或者找到了相同的用户名
      //返回响应，错误提示给用户
      res.render('register',{errMsg: {usernameErr: '用户名已存在，请重新输入~'}});
    }
  });

});


//10. 因为这是一个独立的模块，所以我们要曝露出去我们写好的router模块,方便外面使用。
module.exports = router;