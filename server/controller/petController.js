const Pet = require("../models/pet");

// Get all pets with search by name, breed, type, and adoptionStatus, with pagination
const getPets = async (req, res) => {
  try {
    const {
      search = "",
      breed = "",
      type = "",
      adoptionStatus = "", // New filter for adoption status
      size = 6, // Set default size to 5 per page
      page = 1,
    } = req.query;

    // Convert size and page to numbers
    const pageSize = parseInt(size, 10);
    const currentPage = parseInt(page, 10);

    // Build search query to match name, breed, type, and adoptionStatus using the provided query parameters
    const query = {};

    // If search term is provided, search for name, breed, or type (case-insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive search for name
        { breed: { $regex: search, $options: "i" } }, // Case-insensitive search for breed
        { type: { $regex: search, $options: "i" } }, // Case-insensitive search for type
      ];
    }

    // If breed is provided separately, search specifically by breed
    if (breed) {
      query.breed = { $regex: breed, $options: "i" }; // Case-insensitive search for breed
    }

    // If type is provided separately, search specifically by type
    if (type) {
      query.type = { $regex: type, $options: "i" }; // Case-insensitive search for type
    }

    // If adoptionStatus is provided separately, search specifically by adoptionStatus
    if (adoptionStatus) {
      query.adoptionStatus = { $regex: adoptionStatus, $options: "i" }; // Case-insensitive search for adoptionStatus
    }

    // Get total pet count for pagination
    const totalPets = await Pet.countDocuments(query);
    const totalPages = Math.ceil(totalPets / pageSize);

    // Fetch pets with pagination
    const pets = await Pet.find(query)
      .limit(pageSize)
      .skip((currentPage - 1) * pageSize);

    res.status(200).json({
      success: true,
      pets,
      totalPages,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch pets", details: error.message });
  }
};

// Get a single pet by ID
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    res.status(200).json(pet);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch pet", details: error.message });
  }
};

const createPet = async (req, res) => {
  try {
    // Destructure required fields from req.body
    const {
      name,
      description,
      type,
      breed,
      age,
      weight,
      vaccinated,
      specialNeeds,
      healthDetails,
      height,
      eyeColor,
      furType,
      color,
      dateOfBirth,
      photo,
      adoptionStatus,
    } = req.body;

    // Basic validation for required fields
    if (!name || !type || !breed || !age || !weight || !dateOfBirth) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Prepare the pet data object
    const petData = {
      name,
      description,
      type,
      breed,
      age,
      weight,
      vaccinated,
      specialNeeds,
      healthDetails,
      height,
      eyeColor,
      furType,
      color,
      dateOfBirth,
      photo,
      adoptionStatus,
    };

    // Create and save the new pet
    const pet = new Pet(petData);
    const savedPet = await pet.save();

    // Respond with the saved pet data
    res.status(201).json({
      message: "Pet created successfully",
      data: savedPet,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      error: "Failed to create pet",
      details: error.message,
    });
  }
};

// Update a pet by ID
const updatePet = async (req, res) => {
  try {
    let petData = req.body;

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, petData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPet) return res.status(404).json({ error: "Pet not found" });
    res.status(200).json(updatedPet);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update pet", details: error.message });
  }
};

// Delete a pet
const deletePet = async (req, res) => {
  try {
    const deletedPet = await Pet.findByIdAndDelete(req.params.id);
    if (!deletedPet) return res.status(404).json({ error: "Pet not found" });
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete pet", details: error.message });
  }
};

// Sort pets from latest to oldest based on dateAdded
const getPetsSortedByDate = async (req, res) => {
  try {
    const { size = 10, page = 1 } = req.query;

    // Convert size and page to numbers
    const pageSize = parseInt(size, 10);
    const currentPage = parseInt(page, 10);

    // Sort pets by dateAdded in descending order (latest first)
    const pets = await Pet.find()
      .sort({ dateAdded: -1 }) // Sort in descending order by dateAdded
      .limit(pageSize)
      .skip((currentPage - 1) * pageSize);

    // Get total pet count for pagination
    const totalPets = await Pet.countDocuments();
    const totalPages = Math.ceil(totalPets / pageSize);

    res.status(200).json({
      success: true,
      pets,
      totalPages,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch pets", details: error.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const { petId } = req.params;
    const userId = req.user.userId; // Use userId here as per the JWT payload
    console.log(req.user); // Debugging purpose

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ error: "Pet not found" });

    const isBookmarked = pet.bookmarkedBy.includes(userId);

    // Toggle bookmark action
    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      {
        [isBookmarked ? "$pull" : "$addToSet"]: { bookmarkedBy: userId },
      },
      { new: true }
    );

    // Return the response
    res.status(200).json({
      success: true,
      message: isBookmarked ? "Bookmark removed" : "Pet bookmarked",
      pet: updatedPet,
    });
  } catch (error) {
    console.error(error); // Log for debugging
    res.status(500).json({
      error: "Failed to toggle bookmark",
      details: error.message,
    });
  }
};

// Get pets bookmarked by the user
const getBookmarkedPets = async (req, res) => {
  try {
    const userId = req.user.userId; // Use userId from JWT payload
    console.log(req.user);

    // Find pets where the userId exists in the bookmarkedBy array
    const pets = await Pet.find({ bookmarkedBy: userId });

    if (pets.length === 0) {
      return res.status(404).json({ error: "No bookmarked pets found" });
    }

    res.status(200).json({
      success: true,
      pets,
    });
  } catch (error) {
    console.error(error); // Log for debugging
    res.status(500).json({
      error: "Failed to fetch bookmarked pets",
      details: error.message,
    });
  }
};

module.exports = {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetsSortedByDate,
  toggleBookmark,
  getBookmarkedPets,
};
