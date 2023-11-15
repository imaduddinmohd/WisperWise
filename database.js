const mongoose = require("mongoose");

const connection = mongoose.createConnection(
  "mongodb://localhost:27017/wisperwise",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  rooms: [mongoose.Schema.Types.ObjectId],
});

const User = connection.model("User", UserSchema);

module.exports = connection;
