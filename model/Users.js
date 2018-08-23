
//引入，mongoose模块
var mongoose=require('mongoose');

//获取Schema 模式对象
var Schema=mongoose.Schema;

//创建集合的约束对象
var usersSchema = new Schema({
  username:{
    type:String,
    unique:true,
    required:true
  },
  pwd:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  meta:{
  createTime:{
    type:Date,
    default:Date.now()
  },
    updateTime:{
      type:Date,
      default:Date.now()
    }
  }
});

usersSchema.pre('save',function (next) {
  if (!this.isNew) this.meta.updateTime=Date.now();
  next();
});


//创建模型对象  集合名称 约束对象
 var Users = mongoose.model('Users',usersSchema);

 //暴露出去

module.exports=Users;