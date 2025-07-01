import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ForgotPassword from "../../shared/ChangePassword/ForgetPassword";
import api from "../../utils/api";

const login = async (email, password) => {
  try {
    const response = await api.post("/user/login", { email, password });
    if (response.data.success === true) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Login failed:", error);
    return false;
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
  const { login: authLogin } = useAuth();

  const [openForgotModal, setOpenForgotModal] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleOpenForgotModal = () => setOpenForgotModal(true);
  const handleCloseForgotModal = () => setOpenForgotModal(false);

  const onSubmit = async (data) => {
    const { email, password } = data;
    const response = await login(email, password);

    if (response) {
      setLoginSuccess(true);
      authLogin(response.token, response.role, response.userId);

      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500); // Delay so user sees the success message
    } else {
      setError("email", { message: "Invalid email or password." });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center font-lora">
      <div
        className="container mx-auto max-w-full sm:max-w-md md:max-w-lg lg:max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden flex md:mx-[10vw]"
        style={{ height: "90vh" }}
      >
        {/* Left Section */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center">
          <div className="rounded-lg overflow-hidden">
            <img src="pet-image.png" alt="Pets" className="w-full h-auto" />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mx-4 mt-5 flex justify-between items-start px-4">
            <div>
          {loginSuccess && (
            <div className="mx-4 mb-2 text-green-600 text-sm font-medium">
              ✅ Login successful! Redirecting...
            </div>
          )}
              <h1 className="text-3xl font-bold mb-2 text-indigo-600">
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
                className="input input-bordered w-full rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                disabled={loginSuccess}
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
                className="input input-bordered w-full rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                disabled={loginSuccess}
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
                className="text-sm text-indigo-600 hover:underline cursor-pointer"
                onClick={handleOpenForgotModal}
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loginSuccess}
              className={`btn w-full ${
                loginSuccess
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white rounded-lg py-2 transition-colors duration-300`}
            >
              {loginSuccess ? "Success" : "Sign In"}
            </button>
          </form>

          {/* Sign Up */}
          <p className="text-center mt-4 text-sm text-gray-500">
            Don’t have an account?{" "}
            <a
              className="text-indigo-600 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
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
