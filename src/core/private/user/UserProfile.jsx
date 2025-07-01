import { useEffect, useState } from "react";

import { CameraIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import ForgotPassword from "../../../shared/ChangePassword/ForgetPassword";
import LoadingScreen from "../../../shared/LoadingScreen/LoadingScreen";

const API_BASE_URL = "http://localhost:5000/api/v1/user"; // Replace with your actual API base URL

export const fetchAdminData = async (adminId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${adminId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin data:", error);
    throw error;
  }
};

export const updateAdminProfile = async (adminId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update/${adminId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating admin profile:", error);
    throw error;
  }
};

const AdminProfile = () => {
  //   const { data: admin, refetch } = useQuery({ queryKey: ["adminProfile"], queryFn: fetchAdminData });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const adminId = localStorage.getItem("userId");
  const [menuOpen, setMenuOpen] = useState(false);

  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [openEditModal, setOpenEditModal] = useState(false);

  // Handle modal open/close
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const [openForgotModal, setOpenForgotModal] = useState(false);

  const handleOpenForgotModal = () => setOpenForgotModal(true);
  const handleCloseForgotModal = () => setOpenForgotModal(false);

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchDataWithDelay = () => {
      const timeoutId = setTimeout(async () => {
        try {
          const data = await fetchAdminData(adminId);
          setAdminData(data);
          setImagePreview(data.image || "");
        } catch (error) {
          console.error("Error fetching admin data:", error);
        } finally {
          setIsLoading(false);
        }
      }, 2000); // 2 seconds delay

      return timeoutId;
    };

    const timeoutId = fetchDataWithDelay();

    // Cleanup timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [adminId]);
  console.log("Admin data:", adminData);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      await updateAdminProfile(adminId, formData);
      const updatedData = await fetchAdminData(adminId);
      setAdminData(updatedData); // Update state with new data
      setOpenEditModal(false); // Close modal
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageChange = (e) => {
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

      if (response.data.success) {
        const imageUrl = response.data.data; // Assuming backend returns the URL
        console.log("Image uploaded successfully:", imageUrl);

        // Update state with new image URL
        setAdminData((prev) => ({ ...prev, image: imageUrl }));

        // Send updated data to backend
        await updateAdminProfile(adminId, { image: imageUrl });

        // Fetch the latest admin data
        const updatedData = await fetchAdminData(adminId);
        setAdminData(updatedData);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  return (
    <div className="flex-1 px-4 font-lora">
      {/* <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center gap-12 my-4 border-2 flex-1 px-4 font-lora"> */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-2xl font-bold">Profile</h2>
        {/* <button onClick={() => setMenuOpen((prev) => !prev)}>
          <UserCircleIcon className="w-12 h-12 text-[#A35E47] hover:text-[#8A4D3B]" />
        </button> */}
      </div>
      {/* {menuOpen && (
        <div className="absolute right-10 z-10 w-40 bg-white shadow-lg rounded-lg p-2">
          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Profile
          </button>
          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Logout
          </button>
        </div>
      )} */}
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center gap-12 my-4 border-2 flex-1 px-4 font-lora">
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
              className="cursor-pointer w-48 h-48 border-2 border-gray-300 rounded-md flex items-center justify-center"
            >
              {imagePreview ? (
                <img
                  src={`http://localhost:5000/uploads/${adminData.image}`}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md shadow-md"
                />
              ) : (
                <CameraIcon className="w-12 h-12 text-gray-400" />
              )}
            </label>
          </div>

          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              {adminData.name}
            </h2>
            <p className="text-xl text-gray-700 mb-4">{adminData.email}</p>
            <p className="text-lg text-gray-600 mb-4">{adminData.phone}</p>
            <p className="text-lg text-gray-600 mb-4">{adminData.address}</p>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleOpenEditModal}
                className="bg-[#66AEA6] text-white px-8 py-3 rounded-lg hover:bg-[#30756D] transition-all duration-300 shadow-md"
              >
                Edit Profile
              </button>
              <button
                onClick={handleOpenForgotModal}
                className="bg-[#96614D] text-white px-8 py-3 rounded-lg hover:bg-[#A2715E] transition-all duration-300 shadow-md"
              >
                Change Password
              </button>
            </div>
          </div>
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
                <form className="px-10 sm:p-4 mx-4" onSubmit={handleSubmit}>
                  <h1 className="text-2xl font-bold py-4">Edit Profile</h1>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={adminData.name}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#4FBF65] transition-all"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={adminData.email}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#4FBF65] transition-all"
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      value={adminData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#4FBF65] transition-all"
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={adminData.address}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#4FBF65] transition-all"
                    />
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      type="submit"
                      className="px-10 py-3 bg-[#66AEA6] text-white rounded-lg transition-all duration-300 hover:bg-[#30756D]"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseEditModal}
                      className="px-10 py-3 bg-[#d9534f] text-white rounded-lg transition-all duration-300 hover:bg-[#c9302c]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </DialogContent>
            </div>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
