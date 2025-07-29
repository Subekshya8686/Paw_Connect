const express = require("express");
const router = express.Router();
const {
  submitAdoptionApplication,
  getAdoptionApplicationById,
  getAllAdoptionApplications,
  reviewAdoptionApplication,
  downloadAdoptionApplications,
} = require("../controller/adoptionController");

// POST request to submit an adoption application
router.post("/submit", submitAdoptionApplication);

// GET request to get all adoption applications
router.get("/getAll", getAllAdoptionApplications);

// GET request to get a specific adoption application by ID
router.get("/get/:id", getAdoptionApplicationById);

// Route for admin to review an adoption application
router.put("/:id/review", reviewAdoptionApplication);

router.get("/download", downloadAdoptionApplications);

module.exports = router;
