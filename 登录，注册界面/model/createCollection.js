//引入mongoose模块
var mongoose = require('mongoose');

//创建Schema对象
var Schema = mongoose.Schema;

//创建约束集合条件对象
var createSchema = new Schema({
  username:{
    type:String,
    unique :true ,
    required :true
  },
  password:{
    type:String,
    required : true
  },
  email:{
    type:String,
    required : true ,
    unique: true
  },
  meta :{
    createTime :{
      type : Date,
      default : Date.now()
    },
    updateTime:{
      type: Date ,
      default: Date.now()
    }
  }
})

//给调用条件的对象绑定事件   更新时间
createSchema.pre('save',function(next){
  if(!this.isNew){
    this.meta.updateTime = Date.now();
  }
    next();
})

//创建model对象   传入集合名
var createMessage = mongoose.model('createMessages',createSchema);

//将集合暴露出去  直接等于集合model 调用时方便，直接调用
module.exports = createMessage;