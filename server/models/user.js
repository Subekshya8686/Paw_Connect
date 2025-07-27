const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  image: {
    type: String,
    default: null,
    required: false,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    required: true,
    default: "User",
  },
});

module.exports = mongoose.model("User", UserSchema);
