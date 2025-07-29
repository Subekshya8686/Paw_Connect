const FosterApplication = require("../models/fosterApplication");

const fs = require('fs');
const json2csv = require('json2csv').parse; // Use json2csv package to convert JSON to CSV

// Download all foster applications as CSV
const downloadFosterApplications = async (req, res) => {
  try {
    // Get all foster applications
    const applications = await FosterApplication.find({});

    if (applications.length === 0) {
      return res.status(404).json({ error: "No foster applications found" });
    }

    // Convert applications to CSV format
    const csv = json2csv(applications);

    // Set the appropriate headers for file download
    res.header('Content-Type', 'text/csv');
    res.attachment('foster_applications.csv');
    res.send(csv);
  } catch (error) {
    console.error("Error downloading foster applications:", error);
    res.status(500).json({
      error: "Failed to download foster applications",
      details: error.message,
    });
  }
};

// Submit a foster application
const submitFosterApplication = async (req, res) => {
  try {
    const {
      applicantId,
      petId,
      applicantName,
      applicantEmail,
      applicantPhone,
      districtOrCity,
      homeAddress,
      householdMembers,
      hasPets,
      petDetails,
      residenceType,
      reasonForFostering,
      experienceWithPets,
      availabilityDuration,
      abilityToHandleMedicalNeeds,
      hasFencedYard,
      agreementToTerms,
    } = req.body;

    // Validate required fields
    // if (
    //   !applicantId ||
    //   !applicantName ||
    //   !applicantEmail ||
    //   !applicantPhone ||
    //   !districtOrCity ||
    //   !homeAddress ||
    //   !householdMembers ||
    //   hasPets === undefined ||
    //   !residenceType ||
    //   !reasonForFostering ||
    //   !experienceWithPets ||
    //   !availabilityDuration ||
    //   abilityToHandleMedicalNeeds === undefined ||
    //   hasFencedYard === undefined ||
    //   agreementToTerms === undefined
    // ) {
    //   return res
    //     .status(400)
    //     .json({ error: "All required fields must be filled" });
    // }

    // Create a new foster application
    const newFosterApplication = new FosterApplication({
      applicantId,
      petId,
      applicantName,
      applicantEmail,
      applicantPhone,
      districtOrCity,
      homeAddress,
      householdMembers,
      hasPets,
      petDetails,
      residenceType,
      reasonForFostering,
      experienceWithPets,
      availabilityDuration,
      abilityToHandleMedicalNeeds,
      hasFencedYard,
      agreementToTerms,
    });

    // Save to the database
    await newFosterApplication.save();

    res.status(201).json({
      message: "Foster application submitted successfully",
      data: newFosterApplication,
    });
  } catch (error) {
    console.error("Error submitting foster application:", error);
    res.status(500).json({
      error: "Failed to submit foster application",
      details: error.message,
    });
  }
};

// Get all foster applications
const getAllFosterApplications = async (req, res) => {
  try {
    const applications = await FosterApplication.find({});
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch foster applications",
      details: error.message,
    });
  }
};

// Get a specific foster application by ID
const getFosterApplicationById = async (req, res) => {
  try {
    const application = await FosterApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Foster application not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch foster application",
      details: error.message,
    });
  }
};

// Delete a foster application
const deleteFosterApplication = async (req, res) => {
  try {
    const application = await FosterApplication.findByIdAndDelete(
      req.params.id
    );
    if (!application) {
      return res.status(404).json({ error: "Foster application not found" });
    }
    res
      .status(200)
      .json({ message: "Foster application deleted successfully" });
  } catch (error) {
    console.error("Error deleting foster application:", error);
    res.status(500).json({
      error: "Failed to delete foster application",
      details: error.message,
    });
  }
};

// Admin review foster application
const reviewFosterApplication = async (req, res) => {
  try {
    const { adminId, adminStatus, adminNotes } = req.body;
    const { id } = req.params; // Application ID

    // Validate required fields
    if (!adminId || !adminStatus) {
      return res
        .status(400)
        .json({ error: "Admin ID and status are required" });
    }

    // Update the application with admin review details
    const updatedApplication = await FosterApplication.findByIdAndUpdate(
      id,
      { adminId, adminStatus, adminNotes, handledAt: new Date() },
      { new: true } // Return the updated document
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: "Foster application not found" });
    }

    res.status(200).json({
      message: "Application reviewed successfully",
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Error reviewing foster application:", error);
    res.status(500).json({
      error: "Failed to review foster application",
      details: error.message,
    });
  }
};

module.exports = {
  submitFosterApplication,
  getAllFosterApplications,
  getFosterApplicationById,
  deleteFosterApplication,
  reviewFosterApplication,
  downloadFosterApplications
};
