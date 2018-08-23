//引入express模块
var express = require('express');

require('./db/connect');
//引入创建model模块
var createCollection = require('./model/createCollection');

//创建应用对象
var app = express();
//设置路由   登录
app.get('/signIn',function(res,req) {
// 1. 获取数据查找数据库是否有相同用户名的
//      密码相同登录成功
  //密码不相同 则提示密码输入有误
  // 2.没有找到就提示  用户名错误，请去注册
  // console.log(res.query)

  createCollection.findOne({username: res.query.username}, function (err, data) {
    // 方法没有错误  且找到了匹配数据
    if (!err && data) {
      // console.log(this.password)
      //console.log(data.password)
      if(data.password === res.query.password){
        req.send('<h1>登陆成功.....</h1>');
        return;
      }else{
        //方法没有错误  但没有找到匹配的数据
        req.send('<h1>密码输入有误，请重新输入......</h1>');
        return;
      };


    } else  {
      req.send('<h1>没有此用户，请前往注册......</h1>');
      }
  })

})


//设置路由   注册
app.get('/signUP',function(res,req){
  /*1.获取浏览器发来的数据
    2.判断两次输入的密码是否一致
    3.判断用户名 密码 邮箱 是否符合
    4.查找数据库是否有用户名相同的  有的话返回注册失败
    5.没有的话存入数据库
  * */


  //console.log(res.query)   数据储存在res.url上  query是将url查询字符转换成对象
  var username = res.query.username;
  var password = res.query.password;
  var passwordAgian = res.query.passwordAgian;
  var email = res.query.email;

//  判断两次输入的密码是否一致  不一样就返回并终止后台程序
if(password !== passwordAgian){
  req.send('<h1>两次密码不一致，请重新输入.....</h1>');
  return ;
};

//判断用户名  密码 邮箱 是否符合条件
  var usernameReg = /^[A-Za-z_0-9]{5,10}$/;   //用户名大小写字母 下滑线 数字 总共长度5-10位
  var passwordReg = /^[A-Za-z_0-9]{5,18}$/;   //密码大小写字母 下滑线 数字 总共长度5-18位
  var emailReg = /^[A-Za-z_0-9]{5,8}@[A-Za-z_0-9]{2,5}\.com$/;  //（5-8） @ (2-5) .com

//  判断输入的是否符合正则表达式、
  if(!usernameReg.test(username)){
    req.send('<h1>用户名格式错误，请重新输入....</h1>');
    return ;
  }else if(!passwordReg.test(password)) {
    req.send('<h1>密码格式不正确，请重新输入 ......</h1>');
    return;
  }else if(!emailReg.test(email)){
    req.send('<h1>邮箱输入不正确，请重新输入......</h1>');
    return ;
  }

//  查找数据库  看是否有应户名相同的
  createCollection.findOne({username:username},function(err,data){
    //方法没有错误  并且 没有找到数据
    if(!err && !data){
      createCollection.create({username:username,password:password,email:email},function(err){
        if(!err){
          req.send('<h1>注册成功</h1>');
          return ;
        }
      })
    }else{
      req.send('<h1>用户名已存在，请重新创建用户名.....</h1>')
      return ;
    }
  })
})

//侦听端口号
app.listen(3000,function(err){
  if (!err)  console.log('服务器开始服务了.....') ;
  else console.log(err)
})