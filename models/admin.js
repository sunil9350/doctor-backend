const mongoose = require("mongoose");
const admindata = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});
const admin = mongoose.model("admindata", admindata);
module.exports = admin;
