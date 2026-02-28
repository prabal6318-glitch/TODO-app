const mongoose = require('mongoose');
require('dotenv').config();
const dbConnect=()=>{
  mongoose.connect(process.env.MONGO_URL,{
    retryWrites: true,
    w: "majority",
    serverSelectionTimeoutMS: 5000,
  }).then(()=>{
    console.log('Database connected successfully');
  }).catch((err)=>{
    console.log('Database connection failed:');
    console.error(err.message);
    process.exit(1);
  });
}

module.exports= dbConnect;
