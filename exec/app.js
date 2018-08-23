//引入express模块
var express = require('express');
//连接数据库
require('./db');
//引入Users模块
var Users = require('./model/Users');

//创建应用对象
var app = express();
//设置路由
//处理登录逻辑的路由
app.get('/login', function (req, res) {
  //1. 获取用户请求信息
  var userMsg = req.query;
  //2. 处理用户的请求信息
  var username = userMsg.username;
  var pwd = userMsg.pwd;
  var email = userMsg.email;

  //3. 定义正则规则
  var usernameReg = /^[A-Za-z_0-9]{5,10}$/;     //用户可以输入英文、数字、下划线，长度为5-10位
  //4. 检测用户输入的信息
  if(!username && !pwd) {
    res.send('用户名和密码不能为空！');
    return;
  }else if(!username) {
    res.send('用户名不能为空！');
    return;
  } else if(!usernameReg.test(username)) {
    res.send('用户名格式不正确，请重新输入。');
    return;
  }else if(!pwd) {
    res.send('密码不能为空！');
    return;
  }


  //5.检测用户输入的信息和数据库中的信息是否一致
  Users.findOne({username: username},function (err,data) {
    if(!err && data) {
      //如果方法没出错，并且查询到了用户名
      //继续接着下一步查询密码
      Users.findOne({pwd: pwd},function(err,data) {
        if(!err && data) {
          //如果方法没出错，并且查询到了密码
          //响应登录成功
          res.send('登录成功了！');
        }else {
          //方法出错或者没查询到密码
          //响应密码输入错误
          res.send('密码输入错误了，请输入正确的密码。');
        }
      });
    }else {
      //方法出错或者没查询到用户名
      //响应用户名输入错误
      res.send('用户名或者密码错误，请重新输入！');
    }
  });



});
//处理注册逻辑的路由
app.get('/regist', function (req, res) {
  /*
    1. 获取用户填写的信息
    2. 判断密码和确认密码是否一致
    3. 正则验证用户填写的信息是否规范
    4. 去数据库中查找是否有相同用户名，
        如果有的话，返回注册失败
    5. 将用户的信息保存数据库中，注册成功
   */
  
  // 1. 获取用户填写的信息
  // console.log(req.query);
  var username = req.query.username;
  var pwd = req.query.pwd;
  var rePwd = req.query.rePwd;
  var email = req.query.email;
  
  // 2. 判断密码和确认密码是否一致
  if (pwd !== rePwd) {
    //返回响应，错误提示给用户
    res.send('两次输入的密码不一致，请重新输入~~');
    return;
  }
  
  // 3. 正则验证用户填写的信息是否规范
  var usernameReg = /^[A-Za-z_0-9]{5,10}$/;     //用户可以输入英文、数字、下划线，长度为5-10位
  var pwdReg = /^[A-Za-z_0-9]{6,18}$/;    //可以输入英文、数字、下划线，长度为6-18位
  var emailReg = /^[A-Za-z_0-9]{3,10}@[A-Za-z_0-9]{2,5}\.com$/;
  
  if (!usernameReg.test(username)) {
    //返回响应，错误提示给用户
    res.send('用户名不符合规范，可以输入英文、数字、下划线，长度为5-10位');
    return;
  } else if (!pwdReg.test(pwd)) {
    //返回响应，错误提示给用户
    res.send('密码不符合规范，可以输入英文、数字、下划线，长度为6-18位');
    return;
  } else if (!emailReg.test(email)) {
    //返回响应，错误提示给用户
    res.send('邮箱不符合规范');
    return;
  }
  
  // 4. 去数据库中查找是否有相同用户名
  Users.findOne({username: username}, function (err, data) {
    if (!err && !data) {
      //方法没有出错并且没有找到相同的用户名
      // 5. 将用户的信息保存数据库中，注册成功
      Users.create({username: username, pwd: pwd, email: email}, function (err) {
        if (!err) res.send('注册成功~');
        else console.log(err);
      })
    } else {
      //方法出错了或者找到了相同的用户名
      //返回响应，错误提示给用户
      res.send('用户名已存在，请重新输入~');
    }
  })
  
});

//监听端口号
app.listen(3000, function (err) {
  if (!err) console.log('服务器启动成功了~');
  else console.log(err);
});