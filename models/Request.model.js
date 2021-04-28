const { Schema, model } = require("mongoose");

let RequestSchema = new Schema(
  {
    email: String,
    message: String
  }
);

//define model
let RequestModel = model("request", RequestSchema);

//export model
module.exports = RequestModel;