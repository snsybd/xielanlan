//引入mongoose模块
var mongoose = require('mongoose');

//连接数据库
mongoose.connect('mongodb://localhost:27017/sign',{useNewUrlParser:true});

//侦听数据库是否连接成功
mongoose.connection.once('open',function(err){
  if(!err){
    console.log('数据库连接成功')
  }else {
    console.log(err);
  }
})