//引入express模块
var express = require('express');

//链接数据库 index可以省略不写
require('./db/index');

//引入Users模块
var Users = require('./model/Users');

//创建应用对象
var app = express();


//设置路由
//处理登录逻辑
app.get('/login', function (req, res) {
//1，获取用户信息
  //2，判断名字是否在数据库中 没有则返回  有则继续下一步
  //3，判断密码是否正确  正确则登录成功    返回则提示输入密码错误

//1，获取用户信息
  var username = req.query.username;
  var pwd = req.query.pwd;


  //2，去数据库中查找有没相同用户名和密码  data找到返回{} 没有返回null 如果没有 ，注册失败
  Users.findOne({username: username,pwd: pwd}, function (err, data) {
    if (!err && data) {
      //方法没有出错 找到相同用户名 找到相同密码
      res.send('登录成功');
    } else {
      //方法有出错 或者没有找到相同用户名 或者没有找到相同密码
      //返回响应 提示用户输入错误  return 可写可不写
      res.send('用户名不存在或密码错误，请重新输入');
    }
  });
});



//处理注册逻辑
app.get('/regist', function (req, res) {

//1，获取用户 填写的信息
  //2，判断两次密码是否一致
  //3，正则验证用户填写的信息是否规范
  //4，去数据库中查找有没相同用户名
  //如果有 ，注册失败
  //5，将用户的填写的信息保存在数据库中，注册成功

//1，获取用户 填写的信息
  console.log(req.query);//查询到用户所填写的信息
  var username = req.query.username;
  var pwd = req.query.pwd;
  var rePwd = req.query.rePwd;
  var email = req.query.email;

  //2，判断两次密码是否一致
  if (pwd !== rePwd) {
    //返回响应 提示用户输入错误
    res.send('两次输入的密码不一致，请重新输入');
    return;
  }

  //3，正则验证用户填写的信息是否规范 \.把点转义加个斜杠
  var usernameReg =/^[A-Za-z_0-9]{4,12}$/ ; //用户可以输入英文 数字 下划线 长度为4-12
  var pwdReg =/^[A-za-z_0-9]{6,20}$/ ; //用户可以输入英文 数字 下划线 长度为6-20
  var emailReg =/^[A-za-z_0-9]{3,12}@[A-za-z_0-9]{2,10}\.com$/ ;  //用户可以输入英文 数字 下划线
  console.log(usernameReg.test(username));

  if (!usernameReg.test(username)) {
    //返回响应 提示用户输入错误
    res.send('用户名输入不规范，请可以输入英文 数字 下划线 长度为4-12');
    return;
  } else if (!pwdReg.test(pwd)) {
    //返回响应 提示密码输入错误
    res.send('密码输入不规范，请可以输入英文 数字 下划线 长度为6-20');
    return;
  } else if (!emailReg.test(email)) {
    //返回响应 提示邮箱输入错误
    res.send('邮箱输入不规范');
    return;
  }

  //4，去数据库中查找有没相同用户名 data找到返回{} 没有返回null
  //如果有 ，注册失败
  Users.findOne({username: username}, function (err, data) {
    if (!err && !data) {
      //方法没有出错 没有找到相同用户名

      //5，将用户的填写的信息保存在数据库中，注册成功
      Users.create({username: username, pwd: pwd, email: email}, function (err) {
        if (!err) res.send('注册成功');
        else console.log(err);
      })
    } else {
      //方法有出错 或者有找到相同用户名
      //返回响应 提示用户输入错误  return 可写可不写
      res.send('用户名已存在，请重新输入');
    }
  })
});




//监听端口号
app.listen(3006, function (err) {
  if (!err) console.log('服务器启动成功了');
  else console.log(err);
});