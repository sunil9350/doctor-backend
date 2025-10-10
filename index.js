const express = require("express");
const app = express();
const route = require("../Router/route");
const data = require("../models/userdata");
const cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", route);
console.log("hello");
app.listen(process.env.Port, () => {
  console.log("server is running");
});
