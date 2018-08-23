//引入mongoose模块前还要npm i mongoose
var mongoose=require('mongoose');

//链接数据库 useNewUrlParse 使用最新的资源解析器
mongoose.connect('mongodb://localhost:27017/exec',{useNewUrlParser:true});

//绑定事件监听   监听数据库是否链接成功判断是否成功
mongoose.connection.once('open',function (err) {
  if (!err) console.log('数据库链接成功');
  else console.log(err);
});