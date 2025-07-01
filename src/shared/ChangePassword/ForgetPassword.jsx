import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const ForgotPassword = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading to true when API request starts

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/forgot-password",
        {
          email,
        }
      );
      setMessage(response.data.message);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.response.data.error || "Failed to send reset email");
      setMessage("");
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="font-lora">
        <DialogContent>
          <form className="px-10 sm:p-4 mx-4" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold py-4">Forgot Password</h1>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#4FBF65] transition-all"
                required
              />
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="submit"
                className="px-10 py-3 bg-[#66AEA6] text-white rounded-lg transition-all duration-300 hover:bg-[#30756D]"
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  <span className="loading loading-spinner loading-xs"></span> // Show spinner when loading
                ) : (
                  "Send Reset Link"
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-10 py-3 bg-[#d9534f] text-white rounded-lg transition-all duration-300 hover:bg-[#c9302c]"
              >
                Cancel
              </button>
            </div>

            {message && (
              <p style={{ color: "green" }} className="mt-4">
                {message}
              </p>
            )}
            {error && (
              <p style={{ color: "red" }} className="mt-4">
                {error}
              </p>
            )}
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default ForgotPassword;
