const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { fullName } = req.body;
    const email = req.body.email
      .trim()
      .toLowerCase();

    const password = req.body.password;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email
      .trim()
      .toLowerCase();

    const password = req.body.password;

    console.log("Login attempt for:", email);

    const user = await User.findOne({
      email,
    });

    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log("User found, comparing passwords");

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({
        message:
          "Invalid credentials",
      });
    }

    console.log("Password matched, generating token");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Login successful for:", email);

    res.status(200).json({
      message:
        "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateProfile = async (
  req,
  res
) => {
  try {
    const updatedUser =
      await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new: true }
      ).select("-password");

    res.status(200).json(
      updatedUser
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};