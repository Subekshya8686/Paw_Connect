import { CameraIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateUser = ({ handleModalClose }) => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    image: "",
    role: "Admin",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        handleImageUpload(file);
      }
    } else {
      setUserDetails({ ...userDetails, [name]: value });
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
        setUserDetails((prev) => ({ ...prev, image: response.data.data }));
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submission starts

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user",
        userDetails,
        {
          headers: {
            "Content-Type": "application/json", // Ensure JSON format
          },
        }
      );

      console.log("User created successfully:", response.data);

      setUserDetails({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        image: "",
      });
      window.location.reload();
      handleModalClose();
    } catch (error) {
      console.error(
        "Error creating user:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // Set loading to false when submission ends
    }
  };

  const handleBack = () => {
    handleModalClose();
    console.log("Back to previous page");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mx-4">
        <h2 className="text-2xl font-bold text-gray-900">Add New Admin</h2>
        <button>
          <span className="text-blue-500 cursor-pointer" onClick={handleBack}>
            Back
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="col-span-1 flex ml-4">
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="hidden"
              id="user-image"
            />
            <label
              htmlFor="user-image"
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

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-2 rounded-lg border-gray-300">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={userDetails.name}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userDetails.email}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userDetails.password}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={userDetails.phone}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={userDetails.address}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg"
              />
              <input
                type="date"
                name="dateOfBirth"
                value={userDetails.dateOfBirth}
                onChange={handleChange}
                className="p-3 border-2 border-gray-300 rounded-lg text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <button
            type="submit"
            className="bg-[#66AEA6] text-white px-8 py-3 rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-md"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <span>Loading...</span> // Show loading text or spinner
            ) : (
              "Add User"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="bg-[#96614D] text-white px-8 py-3 rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
