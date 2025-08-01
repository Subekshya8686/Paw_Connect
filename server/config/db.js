const mongoose = require("mongoose");

const mongoDBUrl = "mongodb://localhost:27017/pawconnect";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDBUrl);
  } catch (err) {
    process.exit(1);
  }
};

module.exports = connectDB;
