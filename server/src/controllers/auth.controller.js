const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const buildAuthResponse = (user) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const safeUser = user.toObject ? user.toObject() : user;
  delete safeUser.password;

  return {
    token,
    user: safeUser,
  };
};

exports.registerUser = async (req, res) => {
  try {
    const { fullName } = req.body;
    const email = req.body.email
      .trim()
      .toLowerCase();

    const password = req.body.password;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.authProvider === "google" && !existingUser.password) {
        return res.status(400).json({
          message: "This email is already registered with Google. Please continue with Google."
        });
      }

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
      user: {
        ...user.toObject(),
        password: undefined,
      }
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

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google sign-in. Please continue with Google.",
      });
    }

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

    console.log("Login successful for:", email);

    const authResponse = buildAuthResponse(user);

    res.status(200).json({
      message:
        "Login successful",
      ...authResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        message: "Google authentication is not configured on the server.",
      });
    }

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required.",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({
        message: "Unable to read Google account details.",
      });
    }

    const email = payload.email.trim().toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        authProvider: "google",
        avatar: payload.picture || null,
      });
    } else {
      let shouldSave = false;

      if (!user.googleId) {
        user.googleId = payload.sub;
        shouldSave = true;
      }

      if (user.authProvider !== "google") {
        user.authProvider = "google";
        shouldSave = true;
      }

      if (!user.avatar && payload.picture) {
        user.avatar = payload.picture;
        shouldSave = true;
      }

      if (!user.fullName && payload.name) {
        user.fullName = payload.name;
        shouldSave = true;
      }

      if (shouldSave) {
        await user.save();
      }
    }

    const authResponse = buildAuthResponse(user);

    res.status(200).json({
      message: "Google authentication successful",
      ...authResponse,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      message: "Google authentication failed.",
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
