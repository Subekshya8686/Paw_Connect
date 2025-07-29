const express = require("express");
const router = express.Router();
const fosterApplicationController = require("../controller/fosterController");

// Route to submit a new foster application
router.post("/apply", fosterApplicationController.submitFosterApplication);

// Route to get all foster applications (for admin or review purposes)
router.get("/getAll", fosterApplicationController.getAllFosterApplications);

// Route to get a specific foster application by its ID
router.get("/get/:id", fosterApplicationController.getFosterApplicationById);

// Route for admin to review an adoption application
router.put("/:id/review", fosterApplicationController.reviewFosterApplication);

// Define the download route
router.get("/download", fosterApplicationController.downloadFosterApplications);

// Route to delete a foster application
router.delete(
  "/delete/:id",
  fosterApplicationController.deleteFosterApplication
);

module.exports = router;
