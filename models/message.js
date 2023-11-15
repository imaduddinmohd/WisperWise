const mongoose = require("mongoose");
const connection = require("../database");

const senderSchema = new mongoose.Schema({
  name: String,
  id: String,
});

const messageSchema = new mongoose.Schema({
  sender: senderSchema,
  body: String,
  time: String,
});

const Message = connection.model("Message", messageSchema);

module.exports = messageSchema;
