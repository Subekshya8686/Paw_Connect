import { CameraIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogContent } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import config from "../../config/config";
import { useAuth } from "../../hooks/useAuth";
import AppBar from "../../shared/AppBar/AppBar";
import ForgotPassword from "../../shared/ChangePassword/ForgetPassword";
import Footer from "../../shared/Footer/Footer";
import api from "../../utils/api";

const fetchPets = async () => {
  const response = await api.get("/pet/getAllPets");
  return response.data.pets;
};

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    isAuthenticated,
    userId: currentUserId,
    isLoading: authLoading,
  } = useAuth();

  console.log("URL param id:", id);
  console.log("Current user id:", currentUserId);
  console.log("Is authenticated:", isAuthenticated);
  console.log("Auth loading:", authLoading);

  const [bookmarkedPets, setBookmarkedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  // Wait for auth to load before making any decisions
  useEffect(() => {
    if (authLoading) return; // Don't do anything while auth is loading

    if (!isAuthenticated) {
      // User is not authenticated, redirect to home
      console.log("User not authenticated, redirecting to home");
      navigate("/");
      return;
    }

    if (id && currentUserId && id !== currentUserId) {
      // User is trying to access someone else's profile, redirect to their own
      console.log("Redirecting to own profile");
      navigate(`/user/${currentUserId}`);
      return;
    }
  }, [authLoading, isAuthenticated, id, currentUserId, navigate]);

  const [openEditModal, setOpenEditModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const {
    data: pets,
    isLoading,
    error,
  } = useQuery({ queryKey: ["pets"], queryFn: fetchPets });

  useEffect(() => {
    if (userData.image) {
      setImagePreview(userData.image);
    }
  }, [userData.image]);

  useEffect(() => {
    const fetchUserData = async () => {
      // Don't fetch if auth is still loading or user is not authenticated
      if (authLoading || !isAuthenticated || !id) return;

      try {
        console.log("Fetching user data for ID:", id);
        const response = await api.get(`/user/${id}`);
        console.log("User data fetched successfully:", response.data);
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        // Don't redirect on API errors, just log them
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log(
            "Authorization error, user might not be allowed to view this profile"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, authLoading, isAuthenticated]);

  useEffect(() => {
    const fetchBookmarkedPets = async () => {
      try {
        const response = await api.get("/pet/bookmarked");
        setBookmarkedPets(response.data.pets);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarkedPets();
  }, []);

  // console.log(userData);

  // Handle modal open/close
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const [openForgotModal, setOpenForgotModal] = useState(false);

  const handleOpenForgotModal = () => setOpenForgotModal(true);
  const handleCloseForgotModal = () => setOpenForgotModal(false);

  const [imagePreview, setImagePreview] = useState("");
  console.log("Image preview:", imagePreview);

  // Handle profile data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value, // This will update the correct field in the userData state
    }));
  };

  const onSubmit = async () => {
    console.log("Updated user data", userData);
    const dataToSend = { ...userData }; // Create a copy of userData
    if (dataToSend.image === null) {
      delete dataToSend.image; // Remove the image property if it's null
    }
    console.log("Data to send:", dataToSend);
    try {
      const response = await api.put(`/user/update/${id}`, dataToSend);
      console.log("User updated successfully:", response.data);
      // Close the modal or do any other necessary action after successful update
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const [image, setImage] = useState(userData.image || "/default-user.png");

  const handleImageChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        handleImageUpload(file);
      }
    } else {
      setUserData({ ...userDetails, [name]: value });
    }
  };

  const handleImageUpload = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const { data } = await api.post("/user/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Image uploaded successfully:", data.data); // Assuming response contains image URL

      setImagePreview(data?.data);
      // Now update user data with the uploaded image URL
      setUserData((prevData) => ({
        ...prevData,
        image: data.data, // Assuming data.data contains the image URL
      }));

      // Update user profile after the image upload
      await updateUserProfile(data.data); // Update the profile immediately with the new image
    } catch (error) {
      console.error("Error uploading image:", error.message || error);
    }
  };

  const updateUserProfile = async (imageUrl) => {
    const updatedData = {
      ...userData,
      image: imageUrl, // Use the image URL directly here
    };
    console.log("Updated user data:", updatedData);

    try {
      const response = await api.put(`/user/update/${id}`, updatedData);
      console.log("User profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating user profile:", error.message || error);
    }
  };

  if (authLoading || loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {error.message}
      </div>
    );
  if (!isAuthenticated)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 font-lora">
      <AppBar />
      <div className="flex flex-col mx-8 my-6">
        <div className="bg-white shadow-lg rounded-lg p-6 mx-6 md:mx-12 lg:mx-20 flex flex-col lg:flex-row items-center justify-center gap-12 my-4 border border-indigo-200">
          {/* <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={image}
              alt={userData.name}
              className="w-72 md:w-80 lg:w-96 h-auto rounded-xl shadow-lg border-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-4 text-sm text-gray-700"
            />
          </div> */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="hidden"
              id="user-image"
            />
            <label
              htmlFor="user-image"
              className="cursor-pointer w-48 h-48 border-2 border-indigo-300 rounded-md flex items-center justify-center hover:border-indigo-400 transition-colors"
            >
              {imagePreview ? (
                <img
                  src={`${config.UPLOAD_BASE_URL}/${imagePreview}`}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md shadow-md"
                />
              ) : (
                <CameraIcon className="w-12 h-12 text-indigo-400" />
              )}
            </label>
          </div>

          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-indigo-900 mb-3">
              {userData.name}
            </h2>
            <p className="text-xl text-indigo-700 mb-4">{userData.email}</p>
            <p className="text-lg text-indigo-600 mb-4">{userData.phone}</p>
            <p className="text-lg text-indigo-600 mb-4">{userData.address}</p>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleOpenEditModal}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md"
              >
                Edit Profile
              </button>
              <button
                onClick={handleOpenForgotModal}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Bookmarked pets section */}
        {bookmarkedPets && bookmarkedPets.length > 0 && (
          <div className="flex justify-center flex-col py-6 lg:mx-20 md:mx-12 bg-white rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-bold text-center mb-6 text-indigo-900 font-poppins">
              Bookmarked Pets
            </h3>
            {bookmarkedPets && bookmarkedPets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
                {bookmarkedPets?.map((pet) => (
                  <div
                    key={pet._id}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      navigate(`/profile/${pet._id}`);
                    }}
                    className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-indigo-200 cursor-pointer hover:scale-105"
                  >
                    <img
                      src={`${config.UPLOAD_BASE_URL}/${pet?.photo}`}
                      alt={pet.name}
                      className="w-full h-56 object-cover rounded-t-lg"
                    />
                    <div className="p-4 sm:p-6 text-center relative">
                      <h4 className="text-lg sm:text-xl font-semibold text-indigo-800 font-poppins mb-2">
                        {pet.name}
                      </h4>
                      <a
                        href="#"
                        className="text-indigo-500 hover:text-indigo-600 text-sm absolute bottom-2 right-4 sm:bottom-4 sm:right-6"
                      >
                        View More
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-indigo-700">
                No bookmarked pets found.
              </p>
            )}
          </div>
        )}

        {/* Pets available for adoption */}
        <div className="flex justify-center flex-col py-6 lg:mx-20 md:mx-12 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-center mb-6 text-indigo-900 font-poppins">
            Pets Available For Adoption
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            {pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate(`/profile/${pet._id}`);
                }}
                className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-indigo-200 cursor-pointer hover:scale-105"
              >
                <img
                  src={`${config.UPLOAD_BASE_URL}/${pet?.photo}`}
                  alt={pet.name}
                  className="w-full h-56 object-cover rounded-t-lg"
                />
                <div className="p-4 sm:p-6 text-center relative">
                  <h4 className="text-lg sm:text-xl font-semibold text-indigo-800 font-poppins mb-2">
                    {pet.name}
                  </h4>
                  <a
                    href="#"
                    className="text-indigo-500 hover:text-indigo-600 text-sm absolute bottom-2 right-4 sm:bottom-4 sm:right-6"
                  >
                    View More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {openForgotModal && (
        <ForgotPassword
          open={openForgotModal}
          handleClose={handleCloseForgotModal}
        />
      )}

      {/* Edit Profile Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <div className="font-lora">
          <DialogContent>
            <form
              className="px-10 sm:p-4 mx-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h1 className="text-2xl font-bold py-4">Edit Profile</h1>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={userData.name}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-all"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userData.email}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-all"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={userData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-all"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={userData.address}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="submit"
                  className="px-10 py-3 bg-indigo-600 text-white rounded-lg transition-all duration-300 hover:bg-indigo-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-10 py-3 bg-red-500 text-white rounded-lg transition-all duration-300 hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default UserProfile;
