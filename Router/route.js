const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const connection = require("../connection/db");
const data = require("../models/userdata");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const authentication = require("../Module/userauth");
const { set } = require("mongoose");
route.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();
   const expire = Date.now() + 10 * 60 * 1000;
   console.log(expire)
  try {
    const hash = await bcrypt.hash(password, 10);
    const save = await data.create({
      username: username,
      email: email,
      password: hash,
      otp: otp,
      otpexpire:expire
    
    });
    const mail = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: "arixsontechnologies@gmail.com",
        pass: "fnwg uwru ehmf znlb",
      },
    });

    const receiver = {
      from: "arixsontechnologies@gmail.com",
      to: email,
      subject: "this otp verification code ",
      text: `your otp is ${otp} `,
    };

    await mail.sendMail(receiver, (error, emailresponse) => {
      if (error) {
        throw error;
      }
      console.log("sucess");
    });

    res.status(200).json({ userdata: { username, email } });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue);
      return res.status(400).json({ error: `${field} already exists` });
    }
  }
});

route.post("/verify", async (req, res) => {

  const { otp,email } = req.body;

  try {
    const user = await data.findOne({email:email});
     console.log(user)
    if (!user.email) {
      return res.status(404).json({ message: "User not found" });
    }
         if (Date.now() > user.otpexpire) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp.toString().trim() !== otp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.otp = undefined;
    user.otpexpire=undefined;
    await user.save();
    res.send("otp is verified");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

route.post('/resend', async (req,res)=>{
    const {email}=req.body;
const save=data.create({

  otp:otp,
 otpexpire:expire
});

   const mail = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: "arixsontechnologies@gmail.com",
        pass: "fnwg uwru ehmf znlb",
      },
    });

    const receiver = {
      from: "arixsontechnologies",
      to: email,
      subject: "this otp verification code ",
      text: `your otp is ${otp} `,
    };

    await mail.sendMail(receiver, (error, emailresponse) => {
      if (error) {
        throw error;
      }
      console.log("sucess");
    });
res.send('send otp')
    
})

route.post("/login", async (req, res) => {
  const { username, password} = req.body;
  const userfind = await data.findOne({ username: username });
  if (!userfind) {
    return res
      .status(401)
      .json({ message: "username and password is incorrrrrrect" });
  }
  const decode = await bcrypt.compare(password, userfind.password);
  if (!decode) {
    return res
      .status(402)
      .json({ message: "username and password is incorrect" });
  }
  const token = jwt.sign(
    {
      username: username,
      email: userfind.email,
    },process.env.Secret);
  res.cookie("token", token, {
    httpOnly: true, // prevents JS access (better security)
    maxAge: 100 * 10000,
  });
  console.log(token);

  res.status(200).json({ msg: "login sucessfull" });
});

route.post("/profile", authentication, async (req, res) => {
  const { phone, address, gender, age } = req.body;
  if (!phone || !address || !gender || !age) {
    return res.status(400).json({ msg: "enter the value" });
  }
  const email = req.user.email;

  const updata = await data.findOneAndUpdate(
    { email: email },

    { $set: { phone, address, gender, age } }
  );

  res.send("data update sucessfully");
});
route.get("/logout", (req, res) => {
  const logout = res.clearCookie("token");
  console.log(logout);
  res.json({ msg: "logout successfully" });
});

module.exports = route;
