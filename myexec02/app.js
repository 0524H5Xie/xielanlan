
//引入express模块
var express = require('express')
//连接数据库
require('./db')
//引入路由模块
var userRouter = require('./router/userfaceRouter')
var userfaceRouter = require('./router/userRouter')

//创建应用对象
var app = express();
//ejs
app.set('views','./views')
app.set('view engine','ejs')



//主模块应用路由器
app.use(userRouter)
app.use(userfaceRouter)
//监听端口号
app.listen(3000,function (err) {
  if(!err)console.log('服务器启动成功了');
  else console.log(err);
})