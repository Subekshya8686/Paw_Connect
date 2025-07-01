import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Assuming you are using React Router

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL (e.g., /reset-password/:token)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setMessage("");
      return;
    }

    setLoading(true); // Start loading before making the request
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/reset-password",
        {
          token,
          newPassword,
        }
      );
      setMessage(response.data.message);
      setError(""); // Clear any previous errors
      setLoading(false); // Stop loading after the response

      // Redirect to login page after success
      //   setTimeout(() => {
      //     history.push("/login");
      //   }, 2000);
    } catch (err) {
      setError(err.response.data.error || "Failed to reset password");
      setMessage("");
      setLoading(false); // Stop loading on error
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto max-w-xl bg-white shadow-lg rounded-lg overflow-hidden flex font-lora justify-center mt-20">
      <form className="px-10 sm:p-4 mx-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold py-4">Reset Password</h1>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#4FBF65] transition-all"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              "Reset Password"
            )}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-10 py-3 bg-[#d9534f] text-white rounded-lg transition-all duration-300 hover:bg-[#c9302c]"
          >
            Return
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
    </div>
  );
};

export default ResetPassword;
