const express = require("express");
const router = express.Router();
const {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  getPetsSortedByDate,
  toggleBookmark,
  getBookmarkedPets,
} = require("../controller/petController");
const upload = require("../config/multerConfig");
const { authorizeRole, authenticateToken } = require("../security/auth");

// Create a new pet
router.post("/create", createPet);

// Get all pets
router.get("/getAllPets", getPets);

// Get a specific pet by ID
router.get("/get/:id", getPetById);

// Update a pet by ID
router.put("/update/:id", updatePet);

// Delete a pet by ID
router.delete("/delete/:id", deletePet);

router.get("/getSortedPets", getPetsSortedByDate);

// Bookmark route
router.post("/:petId/bookmark", authenticateToken, toggleBookmark);

// Route to get bookmarked pets
router.get("/bookmarked", authenticateToken, getBookmarkedPets);

module.exports = router;
