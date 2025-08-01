import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LoginModal from "./Login";

// Define the mutation function
const registerUser = async (userData) => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/user",
    userData
  );
  return response.data;
};

const Register = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ role: "User" });
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // useMutation hook to handle the registration mutation
  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      alert("User registered successfully!");
      // console.log(data);
      setIsLoginOpen(true);
    },
    onError: (err) => {
      console.error(err);
      alert("Error registering user.");
    },
  });

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data) => {
    const { confirmPassword, ...finalData } = data; // Exclude confirmPassword
    const finalPayload = { ...formData, ...finalData };
    console.log("Form submitted:", finalPayload); // Role will be included here
    try {
      await mutateAsync(finalPayload); // Trigger the mutation
    } catch (err) {
      console.error("Error during mutation:", err);
    }
  };

  const password = watch("password"); // Watch the password field to validate confirm password

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center font-lora">
      <div
        className="container mx-auto max-w-full sm:max-w-md md:max-w-lg lg:max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden flex md:mx-[10vw]"
        style={{ height: "90vh" }}
      >
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl z-50"
        >
          &times;
        </button>

        {/* Left Section: Pet Image */}
        <div className="hidden lg:flex w-1/2 bg-[#96614D] items-center justify-center">
          <div className="rounded-lg overflow-hidden">
            <img
              src="pet-image.png"
              alt="Pets"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mx-5 flex justify-between px-4">
            <h1 className="text-3xl font-bold mb-4 text-[#FF8A65]">
              {step === 1 ? "Personal Information" : "Account Details"} 🐾
            </h1>
            {/* <button
              onClick={onClose}
              className="text-black text-3xl items-start mb-5"
            >
              &times;
            </button> */}
          </div>

          <form
            className="px-10 sm:p-4 mx-5"
            onSubmit={
              step === 1 ? handleSubmit(handleNext) : handleSubmit(onSubmit)
            }
          >
            {step === 1 && (
              <>
                {/* Name */}
                <label className="form-control w-full mb-6 relative">
                  <span className="label-text text-gray-700">Name</span>
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...register("name", {
                      required: "Please enter your name.",
                    })}
                    className="input input-bordered w-full rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-[#FF8A65] transition-all duration-200"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </label>

                {/* Date of Birth */}
                <label className="form-control w-full mb-6 relative">
                  <span className="label-text text-gray-700">
                    Date of Birth
                  </span>
                  <input
                    type="date"
                    {...register("dateOfBirth", {
                      required: "Please enter your date of birth.",
                    })}
                    className="input input-bordered w-full rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-[#FF8A65] transition-all duration-200"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </label>

                {/* Address */}
                <label className="form-control w-full mb-6 relative">
                  <span className="label-text text-gray-700">Address</span>
                  <input
                    type="text"
                    placeholder="Your Address"
                    {...register("address", {
                      required: "Please enter your name.",
                    })}
                    className="input input-bordered w-full rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-[#FF8A65] transition-all duration-200"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </label>

                {/* Next Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn bg-[#66AEA6] text-white hover:bg-[#30756D] rounded-lg py-2 "
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Email */}
                <label className="form-control w-full mb-6 relative">
                  <span className="label-text text-gray-700">Email</span>
                  <input
                    type="email"
                    placeholder="Email Address"
                    {...register("email", {
                      required: "Please enter your email.",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address.",
                      },
                    })}
                    className="input input-bordered w-full rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-[#FF8A65] transition-all duration-200"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </label>

                {/* Password */}
                <label className="form-control w-full mb-6 relative">
                  <span className="label-text text-gray-700">Password</span>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    {...register("password", {
                      required: "Please enter your password.",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long.",
                      },
                    })}
                    className="input input-bordered w-full rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-[#FF8A65] transition-all duration-200"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </label>

                {/* Confirm Password */}
                <label className="form-control w-full mb-6 relative">
                  <span className="label-text text-gray-700">
                    Confirm Password
                  </span>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password.",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className="input input-bordered w-full rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-[#FF8A65] transition-all duration-200"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </label>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn bg-[#C38872] text-gray-50 hover:bg-[#A2715E] rounded-lg py-2 px-6"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn bg-[#66AEA6] text-white hover:bg-[#30756D] rounded-lg py-2 px-6 transition-colors duration-300"
                  >
                    Register
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <LoginModal onClose={() => setIsLoginOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
