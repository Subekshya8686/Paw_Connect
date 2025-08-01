import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../../shared/ChangePassword/ForgetPassword";

// Function for handling the login API request
const login = async (email, password) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/user/login",
      { email, password }
    );

    console.log("Login response:", response.data);
    if (response.data.success === true) {
      // Store the token in localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);
      console.log("Login successful:", response.data.role);
      return true; // Successfully logged in
    } else {
      return false; // Invalid credentials
    }
  } catch (error) {
    console.error("Login failed:", error);
    return false; // Error during login process
  }
};

const LoginModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();

  const [openForgotModal, setOpenForgotModal] = useState(false);

  const handleOpenForgotModal = () => setOpenForgotModal(true);
  const handleCloseForgotModal = () => setOpenForgotModal(false);

  const onSubmit = async (data) => {
    const { email, password } = data;

    const success = await login(email, password);

    if (success) {
      console.log("Login successful");
      onClose();
      // Redirect to the dashboard after successful login
      window.location.reload();
    } else {
      console.log("Login failed");
      // Handle invalid credentials or error
      setError("email", { message: "Invalid email or password." });
    }

    console.log("Form submitted:", data);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center font-lora">
      <div
        className="container mx-auto max-w-full sm:max-w-md md:max-w-lg lg:max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden flex md:mx-[10vw]"
        style={{ height: "90vh" }}
      >
        {/* Left Section */}
        <div className="hidden lg:flex w-1/2 bg-[#96614D] items-center justify-center">
          <div className="rounded-lg overflow-hidden">
            <img src="pet-image.png" alt="Pets" className="w-full h-auto" />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mx-4 mt-5 flex justify-between items-start px-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-[#FF8A65]">
                Welcome Back 🐾
              </h1>
              <p className="text-sm text-gray-500">
                Today is a new day. It’s your day. You shape it. <br />
                Sign in to start managing your pet's journey.
              </p>
            </div>
            <button onClick={onClose} className="text-black text-3xl">
              &times;
            </button>
          </div>

          {/* Login Form */}
          <form className="sm:p-4 mx-2" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <label className="form-control w-full mb-6 relative">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="text"
                placeholder="Email"
                {...register("email", { required: "Please enter your email." })}
                className="input input-bordered w-full rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-[#FF8A65] transition-all duration-200"
              />
              {errors.email && (
                <div className="absolute left-0 bottom-[-1.25rem] w-full text-red-500 text-xs">
                  {errors.email.message}
                </div>
              )}
            </label>

            {/* Password */}
            <label className="form-control w-full mb-6 relative">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                placeholder="At least 8 characters"
                {...register("password", {
                  required: "Please enter your password.",
                })}
                className="input input-bordered w-full rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-[#FF8A65] transition-all duration-200"
              />
              {errors.password && (
                <div className="absolute left-0 bottom-[-1.25rem] w-full text-red-500 text-xs">
                  {errors.password.message}
                </div>
              )}
            </label>

            {/* Forgot Password */}
            <div className="text-right mb-4">
              <a
                className="text-sm text-[#FF8A65] hover:underline"
                onClick={handleOpenForgotModal}
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="btn w-full bg-[#66AEA6] text-white hover:bg-[#30756D] rounded-lg py-2 transition-colors duration-300"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up */}
          <p className="text-center mt-4 text-sm text-gray-500">
            Don’t have an account?{" "}
            <a
              className="text-[#FF8A65] hover:underline"
              onClick={() => navigate("/register")}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
      {openForgotModal && (
        <ForgotPassword
          open={openForgotModal}
          handleClose={handleCloseForgotModal}
        />
      )}
    </div>
  );
};

export default LoginModal;
