const mongoose = require("mongoose");
const connection = require("../database");
const messageSchema = require("./message");

const roomSchema = new mongoose.Schema({
  name: String,
  members: Number,
  messages: [messageSchema],
});

const Room = connection.model("Room", roomSchema);

module.exports = Room;
