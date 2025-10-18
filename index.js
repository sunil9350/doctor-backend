const express = require("express");
const app = express();
const route = require("./Router/route");
const send = require("./Router/admin");
const data = require("./models/userdata");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "https://doctor-42p9.onrender.com",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/", route);
app.use("/admin", send);
app.listen(process.env.Port, () => {
  console.log("server is running");
});
