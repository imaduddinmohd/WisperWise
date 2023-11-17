const mongoose = require("mongoose");

require("dotenv").config();

const connection = mongoose.createConnection(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  rooms: [mongoose.Schema.Types.ObjectId],
});

const User = connection.model("User", UserSchema);

module.exports = connection;
