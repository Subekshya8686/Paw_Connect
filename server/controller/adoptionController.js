const AdoptionApplication = require("../models/adoptionApplication");
const fs = require("fs");
// const json2csv = require("json2csv"); // Use json2csv package to convert JSON to CSV
const { parse } = require("json2csv");

const downloadAdoptionApplications = async (req, res) => {
  try {
    // Get all adoption applications
    const applications = await AdoptionApplication.find({});

    if (applications.length === 0) {
      return res.status(404).json({ error: "No adoption applications found" });
    }

    // Map the applications to a more readable format, for example:
    const formattedApplications = applications.map((application) => ({
      "Applicant ID": application.applicantId,
      "Pet ID": application.petId,
      "Applicant Name": application.applicantName,
      Email: application.applicantEmail,
      Phone: application.applicantPhone,
      "District/City": application.districtOrCity,
      "Home Address": application.homeAddress,
      "Household Members": application.householdMembers,
      "Has Pets": application.hasPets ? "Yes" : "No",
      "Pet Details": application.petDetails,
      "Residence Type": application.residenceType,
      "Reason for Adoption": application.reasonForAdoption,
      "Experience with Pets": application.experienceWithPets,
      "Agreement to Terms": application.agreementToTerms ? "Yes" : "No",
    }));

    // Convert the formatted applications to CSV format using json2csv's parse function
    const csv = parse(formattedApplications);

    // Set the appropriate headers for file download
    res.header("Content-Type", "text/csv");
    res.attachment("adoption_applications.csv"); // You can adjust the file name here
    res.send(csv);
  } catch (error) {
    console.error("Error downloading adoption applications:", error);
    res.status(500).json({
      error: "Failed to download adoption applications",
      details: error.message,
    });
  }
};

// Submit an adoption application
const submitAdoptionApplication = async (req, res) => {
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
      reasonForAdoption,
      experienceWithPets,
      agreementToTerms,
    } = req.body;

    // Validate required fields
    // if (
    //   !applicantId ||
    //   !petId ||
    //   !applicantName ||
    //   !applicantEmail ||
    //   !applicantPhone ||
    //   !districtOrCity ||
    //   !homeAddress ||
    //   !householdMembers ||
    //   hasPets === undefined ||
    //   // !residenceType ||
    //   !reasonForAdoption ||
    //   !experienceWithPets ||
    //   agreementToTerms === undefined
    // ) {
    //   return res.status(400).json({ error: "All required fields must be filled" });
    // }

    // Create a new adoption application
    const newAdoptionApplication = new AdoptionApplication({
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
      reasonForAdoption,
      experienceWithPets,
      agreementToTerms,
    });

    // Save to the database
    await newAdoptionApplication.save();

    res.status(201).json({
      message: "Adoption application submitted successfully",
      data: newAdoptionApplication,
    });
  } catch (error) {
    console.error("Error submitting adoption application:", error);
    res.status(500).json({
      error: "Failed to submit adoption application",
      details: error.message,
    });
  }
};

// Get all adoption applications
const getAllAdoptionApplications = async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({});
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch adoption applications",
      details: error.message,
    });
  }
};

// Get a specific adoption application by ID
const getAdoptionApplicationById = async (req, res) => {
  try {
    const application = await AdoptionApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Adoption application not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch adoption application",
      details: error.message,
    });
  }
};

// Delete an adoption application
const deleteAdoptionApplication = async (req, res) => {
  try {
    const application = await AdoptionApplication.findByIdAndDelete(
      req.params.id
    );
    if (!application) {
      return res.status(404).json({ error: "Adoption application not found" });
    }
    res
      .status(200)
      .json({ message: "Adoption application deleted successfully" });
  } catch (error) {
    console.error("Error deleting adoption application:", error);
    res.status(500).json({
      error: "Failed to delete adoption application",
      details: error.message,
    });
  }
};

// Admin review adoption application
const reviewAdoptionApplication = async (req, res) => {
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
    const updatedApplication = await AdoptionApplication.findByIdAndUpdate(
      id,
      { adminId, adminStatus, adminNotes, handledAt: new Date() },
      { new: true } // Return the updated document
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: "Adoption application not found" });
    }

    res.status(200).json({
      message: "Application reviewed successfully",
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Error reviewing adoption application:", error);
    res.status(500).json({
      error: "Failed to review adoption application",
      details: error.message,
    });
  }
};

module.exports = {
  submitAdoptionApplication,
  getAllAdoptionApplications,
  getAdoptionApplicationById,
  deleteAdoptionApplication,
  reviewAdoptionApplication,
  downloadAdoptionApplications,
};
