const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body || {};

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Please provide all required fields",
      });
    }

    const existingUser =
      await User.findOne({
        email: email
          .trim()
          .toLowerCase(),
      });

    if (existingUser) {
      return res.status(409).json({
        message:
          "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const user =
      await User.create({
        name,
        email: email
          .trim()
          .toLowerCase(),
        password: hashedPassword,
      });

    return res.status(201).json({
      message:
        "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Registration Error:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

// LOGIN
const loginUser = async (
  req,
  res
) => {
  try {
    console.log(
      "LOGIN BODY:",
      req.body
    );

    const {
      email,
      password,
    } = req.body || {};

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Please provide email and password",
      });
    }

    const user =
      await User.findOne({
        email: email
          .trim()
          .toLowerCase(),
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message:
        "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

// GET CURRENT USER
const getMe = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.userId
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};