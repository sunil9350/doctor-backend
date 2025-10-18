const mongoose = require("mongoose");
const SpecialityData = mongoose.Schema({
  doctorId: {
    type: String,
    unique: true,
    required: true
  },
  name:String,
  speciality:String,
  degree:String,
  Experience:Number,
  About:String,
  Fee:Number,
  Address:String,

});


const doctordata=mongoose.model('doctors',SpecialityData);

module.exports=doctordata;