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
const allowedOrigins = [
  "https://doctor-42p9.onrender.com", // production
  "http://localhost:5173",            // local dev
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use("/", route);
app.use("/admin", send);
app.listen(process.env.Port, () => {
  console.log("server is running");
});
