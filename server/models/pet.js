// /models/pet.model.js
const mongoose = require("mongoose");

// Defining the pet schema with additional details
const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, // e.g., Dog, Cat, Rabbit
  },
  breed: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number, // Weight of the pet in kilograms
    required: true,
  },
  vaccinated: {
    type: Boolean,
    default: false, // Indicates if the pet is vaccinated
  },
  specialNeeds: {
    type: Boolean,
    default: false, // Indicates if the pet has special needs
  },
  healthDetails: {
    type: String, // Extra health details like allergies, medical history, etc.
    default: "",
  },
  height: {
    type: Number, // Height in centimeters
    default: 0,
  },
  furType: {
    type: String, // Type of fur (e.g., short, long, curly, etc.)
    default: "",
  },
  color: {
    type: String, // Main color of the pet
    default: "",
  },
  eyeColor: {
    type: String, // Eye color of the pet
    default: "",
  },
  dateOfBirth: {
    type: Date, // Date of birth of the pet
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now, // Date when the pet was added to the system
  },
  adoptionStatus: {
    type: String,
    enum: ["adopted", "available", "in foster care"],
    default: "available",
  },
  bookmarkedBy: {
    type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
    default: [], // Default to an empty array
  },
  photo: { type: String },
});

// Creating the Pet model
const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
