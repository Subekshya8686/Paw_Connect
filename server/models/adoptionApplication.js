const mongoose = require("mongoose");

const adoptionApplicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  applicantName: {
    type: String,
    required: true,
  },
  applicantEmail: {
    type: String,
    required: true,
  },
  applicantPhone: {
    type: String,
    required: true,
  },
  districtOrCity: {
    type: String,
    required: true,
  },
  homeAddress: {
    type: String,
    required: true,
  },
  householdMembers: {
    type: Number,
    required: true,
  },
  hasPets: {
    type: Boolean,
    required: true,
  },
  petDetails: {
    type: String,
    default: "",
  },
  residenceType: {
    type: String,
    required: true,
  },
  reasonForAdoption: {
    type: String,
    required: true,
  },
  experienceWithPets: {
    type: String,
    required: true,
  },
  agreementToTerms: {
    type: Boolean,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId, // Admin handling the application
    default: null, // Will be filled when an admin reviews it
  },
  adminStatus: {
    type: String,
    enum: ["Under Review", "Approved", "Rejected"],
    default: "Under Review",
  },
  adminNotes: {
    type: String,
    default: "",
  },
  handledAt: {
    type: Date,
    default: null,
  },
});

// Creating the AdoptionApplication model
const AdoptionApplication = mongoose.model(
  "AdoptionApplication",
  adoptionApplicationSchema
);

module.exports = AdoptionApplication;
