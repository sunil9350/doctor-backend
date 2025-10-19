const express = require("express");
const send = express.Router();
const admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HttpStatusCode } = require("axios");
const authentication = require("../auth/userauth");
const doctordata = require("../models/doctorSchema");

send.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const adminExists = await admin.findOne();
    if (adminExists) {
      return res
        .status(400)
        .json({ msg: "Registration closed. Admin already exists." });
    }

    const hash = await bcrypt.hash(password, 10);

    // Step 3: Create new admin
    const newAdmin = await admin.create({
      username,
      email,
      password: hash,
    });

    res
      .status(201)
      .json({ msg: "Admin registered successfully", admin: newAdmin });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Username or Email already exists" });
    }
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

send.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const adminexits = await admin.findOne();
    if (!adminexits) {
      return res.status(300).json({ msg: "Please register first " });
    }
    if (username !== adminexits.username) {
      return res.status(300).json({ msg: "username password is incorrect" });
    }
    const decrypt = await bcrypt.compare(password, adminexits.password);
    if (!decrypt) {
      return res.status(300).json({ msg: "username password is incorrect" });
    }
    const token = jwt.sign(
      {
        username: adminexits.username,
        email: adminexits.email,
      },
      process.env.Secret
    );

    res.cookie("token", token);
    console.log(token);
    res.send("login sucessfull");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error during login." });
  }
});

send.post("/registerdoctors", authentication, async (req, res) => {
  const { speciality, name, degree, Experience, About, Fee, Address } =
    req.body;
  const count = await doctordata.countDocuments();
  const doctorId = `DOC${(count + 1).toString().padStart(4, "0")}`;
  await doctordata.create({
    doctorId: doctorId,
    speciality,
    name,
    degree,
    Experience,
    About,
    Fee,
    Address,
  });
  const doctor = await doctordata.findOne({ doctorId });
  res.status(200).json({doctor})
});

send.get('/doctor/:speciality', async(req,res)=>{
      try{
      const {speciality}=req.params;    
      console.log(speciality)  
          const allowedSpecialities = ['general', 'dematology'];

    if (!allowedSpecialities.includes(speciality.toLowerCase())) {
      return res.status(400).json({ msg: "Invalid speciality" });
    }
      const data=await doctordata.find({speciality:speciality})
      if(!data ||data.lenght===0){
            return res.status(403).json({msg:"Doctor from this speciality not found"})
      }
      res.json(data);
      }
      catch(err){
       console.log(err);
      }
})




module.exports = send;
