const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "secretkey123";
const nodemailer = require("nodemailer");
const Pet = require("../models/pet");

// Get all user
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    // res.status(200).json(users);
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, image, address, dateOfBirth, role } =
      req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password (ensure password is defined)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      dateOfBirth, // Store the validated date
      image, // Store the filename of the uploaded image
      role,
    });

    // Save to DB
    const savedUser = await user.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      protocol: "smtp",
      auth: {
        user: "subekshyakayastha4@gmail.com",
        pass: "lshrfgtlqyjjdihl",
      },
    });

    const info = await transporter.sendMail({
      from: "subekshyakayastha4@gmail.com",
      to: savedUser.email,
      subject: "User Registration",
      html: `
      <h1>Your User Registration has been completed</h1>
      `,
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      info,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    console.log(res);
    res
      .status(500)
      .json({ error: "Failed to create user", details: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update user", details: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // Payload
      SECRET_KEY,
      { expiresIn: "6h" } // Token expiration
    );

    // Return success response with the token
    res.json({
      message: "Login successful",
      token,
      success: true,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to login", details: error.message });
  }
};

const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename, // Send the file name as response
  });
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate a one-time password reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id },
      SECRET_KEY,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Store the reset token in the user's document (optional)
    user.resetPasswordToken = resetToken;
    await user.save();

    // Create a password reset URL
    const resetUrl = `http://localhost:5174/reset-password/${resetToken}`;

    // Send email with the reset link
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      protocol: "smtp",
      auth: {
        user: "subekshyakayastha4@gmail.com",
        pass: "lshrfgtlqyjjdihl",
      },
    });

    const info = await transporter.sendMail({
      from: "subekshyakayastha4@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
      info,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to send reset email", details: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded)
      return res.status(400).json({ error: "Invalid or expired token" });

    // Find user by the decoded userId from the token
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    user.resetPasswordToken = undefined; // Remove the reset token after successful reset
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to reset password", details: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  uploadImage,
  forgotPassword,
  resetPassword,
};
