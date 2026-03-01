const mongoose = require('mongoose');
require('dotenv').config();
const dbConnect=()=>{
  // Use environment variable or hardcoded URL
  const mongoUrl = process.env.MONGO_URL || 'mongodb+srv://prabal6318:prabal5518@cluster0.us0v5gl.mongodb.net/?appName=Cluster0';
  
  mongoose.connect(mongoUrl,{
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