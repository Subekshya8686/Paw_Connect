const mongoose = require("mongoose");

const FosterApplicationSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
    }, // Optional field for current pets
    residenceType: {
      type: String,
      required: true,
      // enum: ["House", "Apartment", "Other"],
    },

    reasonForFostering: {
      type: String,
      required: true,
    },
    experienceWithPets: {
      type: String,
      required: true,
    },
    availabilityDuration: {
      type: String,
      required: true,
    }, // Short-term, Long-term
    abilityToHandleMedicalNeeds: {
      type: Boolean,
      required: true,
    },
    hasFencedYard: {
      type: Boolean,
      required: true,
    },
    agreementToTerms: {
      type: Boolean,
      required: true,
    },

    // Admin Review Fields
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    adminStatus: {
      type: String,
      enum: ["Under Review", "Approved", "Rejected"],
      default: "Under Review",
    },
    adminNotes: {
      type: String,
    },
    handledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FosterApplication", FosterApplicationSchema);
