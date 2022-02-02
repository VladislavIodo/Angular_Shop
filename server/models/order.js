const {Schema, model} = require("mongoose");

const orderSchema = new Schema({
  id: {type: String},
  name: {type: String},
  surname: {type: String},
  email: {type: String},
  city: {type: String},
  street: {type: String},
  payment: {type: String},
  product: {type: Array},
  status: {type: String},
  date: {type: Date},
  totalPrice: {type: Number}
})

module.exports = model("order", orderSchema);
