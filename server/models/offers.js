const {Schema, model} = require("mongoose");

const offerSchema = new Schema({
  id: {type: String},
  name: {type: String},
  description: {type: String},
  designer: {type: String},
  price: {type: Number},
  category: {type: String},
  img: {type: String},
  availability: {type: Number},
  partNumber: {type: Number}
})

module.exports = model("offer", offerSchema);
