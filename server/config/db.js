const mongoose = require("mongoose");

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
