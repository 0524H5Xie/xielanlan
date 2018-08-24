var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var usersSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  pwd: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  meta: {
    createTime: {
      type: Date,
      default: Date.now()
    },
    updateTime: {
      type: Date,
      default: Date.now()
    }
  }
})
usersSchema.pre('save',function (next) {
  if(!this.isNew) this.meta.updateTime = Date.now();
  next()
})
//创建模型对象
var Users = mongoose.model('Users',usersSchema);
module.exports = Users;