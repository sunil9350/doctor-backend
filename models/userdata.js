const mongoose = require("mongoose");

const Userdata = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  phone: Number,
  address: String,
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  age: {
    type: Number,
  },
  otp: { type: Number },
  otpexpire: Number,
});

const data = mongoose.model("users", Userdata);

module.exports = data;
