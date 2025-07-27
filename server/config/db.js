const mongoose = require("mongoose");

// const mongoDBUrl =
//   "mongodb+srv://subekshya4:Subekshya12@cluster0.lskghy8.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0";
const mongoDBUrl = "mongodb://localhost:27017/pawconnect";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDBUrl);
    console.log("MongoDB database connection established successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
