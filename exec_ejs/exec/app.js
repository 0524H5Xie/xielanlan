//1. 引入express模块
var express = require('express');

//2. 连接数据库
require('./db');

//引入路由器
var userPageRouter = require('./router/userPageRouter.js');
var userRouter = require('./router/userRouter.js');

//3. 创建应用对象
var app = express();

//配置模板资源目录
app.set('views','../views');
//配置模板引擎用ejs的方式来解析
app.set('view engine','ejs');


//4. 应用路由器
  //这里的实质是  userRouter，userPageRouter,都是一个函数,那么就是一个中间件。
app.use(userRouter);
app.use(userPageRouter);

//5. 监听端口号
app.listen(3000, function (err) {
  if (!err) console.log('服务器启动成功了~');
  else console.log(err);
});