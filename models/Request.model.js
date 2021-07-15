const {Schema, model} = require("mongoose");

const RequestSchema = new Schema(
  {
    email: String,
    message: String
  }
);

const RequestModel = model("request", RequestSchema);

module.exports = RequestModel;