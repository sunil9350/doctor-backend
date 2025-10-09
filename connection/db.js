
const  mongoose=require('mongoose')
require('dotenv').config();

const connection=mongoose.connect(process.env.Mongo_db).then(()=>{
    console.log('database is running')
})

module.exports=connection;