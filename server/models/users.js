const {Schema, model} = require("mongoose");

const usersSchema = new Schema(
  {
    id: {type: String},
    role: {type: String},
    userName: {type: String},
    userSurname: {type: String},
    nickName: {type: String},
    email: {type: String},
    password: {type: String},
    avatar: {type: String}
  }
)
module.exports = model("users", usersSchema);
