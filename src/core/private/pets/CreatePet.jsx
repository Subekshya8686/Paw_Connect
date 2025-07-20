import { CameraIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePet = ({ handleModalClose }) => {
  const navigate = useNavigate();

  const [petDetails, setPetDetails] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
    vaccinated: false,
    specialNeeds: false,
    healthDetails: "",
    height: "",
    furType: "",
    color: "",
    eyeColor: "",
    dateOfBirth: "",
    photo: "", // Only keep the photo property
    description: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      setPetDetails({ ...petDetails, photo: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreview(fileReader.result);
      };
      if (file) {
        fileReader.readAsDataURL(file);
        handleImageUpload(file); // Call the upload function after preview is set
      }
    } else {
      setPetDetails({
        ...petDetails,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Image uploaded successfully:", response.data.data);

      if (response.data.success) {
        setPetDetails((prev) => ({ ...prev, photo: response.data.data }));
        console.log("Image uploaded:", response.data.data);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send pet details including the already uploaded image
      const response = await axios.post(
        "http://localhost:5000/api/v1/pet/create", // Adjust the endpoint accordingly for creating the pet
        petDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Optionally reset form after successful submission
      setPetDetails({
        name: "",
        type: "",
        breed: "",
        age: "",
        weight: "",
        vaccinated: false,
        specialNeeds: false,
        healthDetails: "",
        height: "",
        furType: "",
        color: "",
        eyeColor: "",
        dateOfBirth: "",
        photo: "", // Reset photo field after submission
        description: "",
      });
      // Reload the page to reflect the new pet addition
      window.location.reload();
      // Redirect or close modal after successful creation
      handleModalClose();
    } catch (error) {
      console.error(
        "Error creating pet:",
        error.response?.data || error.message
      );
    }
  };

  const handleBack = () => {
    handleModalClose();
    console.log("Back to previous page");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mx-4">
        <h2 className="text-2xl font-bold text-gray-900 ">Add New Pet</h2>
        <button>
          <span className="text-blue-500 cursor-pointer" onClick={handleBack}>
            Back
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          {/* Image Column (First Column) */}
          <div className="col-span-1 flex ml-4">
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              className="p-3 border-2 border-gray-300 rounded-lg hidden"
              id="pet-image"
            />
            <label
              htmlFor="pet-image"
              className="cursor-pointer w-48 h-48 border-2 border-gray-300 rounded-md flex items-center justify-center"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md shadow-md"
                />
              ) : (
                <CameraIcon className="w-12 h-12 text-gray-400" />
              )}
            </label>
          </div>

          {/* Pet Details Columns */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-2 rounded-lg border-gray-300">
            {/* Pet Name, Breed, and Type */}
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Pet's Name"
                value={petDetails.name}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="breed"
                placeholder="Breed"
                value={petDetails.breed}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="type"
                placeholder="Pet Type (e.g. Dog, Cat)"
                value={petDetails.type}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
                required
              />

              <textarea
                name="description"
                placeholder="Pet Description"
                value={petDetails.description}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg h-32 w-full"
                required
              />
              <div className="flex gap-4 p-4">
                <label className="text-lg text-gray-700">
                  Vaccinated:
                  <input
                    type="checkbox"
                    name="vaccinated"
                    checked={petDetails.vaccinated}
                    onChange={handleChange}
                    className="ml-2"
                  />
                </label>

                <label className="text-lg text-gray-700">
                  Special Needs:
                  <input
                    type="checkbox"
                    name="specialNeeds"
                    checked={petDetails.specialNeeds}
                    onChange={handleChange}
                    className="ml-2"
                  />
                </label>
              </div>
            </div>

            {/* Age, Weight, and Other Details */}
            <div className="flex flex-col gap-4">
              <input
                type="number"
                name="age"
                placeholder="Age(months)"
                value={petDetails.age}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
                required
              />
              <input
                type="date"
                name="dateOfBirth"
                value={petDetails.dateOfBirth}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg text-gray-400"
              />
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={petDetails.weight}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
                required
              />
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={petDetails.height}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="color"
                placeholder="Pet Color i.e Fur Color, Feather Color"
                value={petDetails.color}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="eyeColor"
                placeholder="Eye Color"
                value={petDetails.eyeColor}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <button
            type="submit"
            className="bg-[#66AEA6] text-white px-8 py-3 rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-md"
          >
            Add Pet
          </button>
          <button
            type="button"
            onClick={() => navigate("/pets")}
            className="bg-[#96614D] text-white px-8 py-3 rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePet;
