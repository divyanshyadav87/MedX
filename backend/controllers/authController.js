// ============================================================
// Auth Controller
// Handles user registration and login
// ============================================================

const User = require("../models/User");

// ---- POST /api/auth/register ----
// Create a new user account and return JWT token
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
        error: "DUPLICATE_EMAIL",
        timestamp: new Date(),
      });
    }

    // Create user (password is hashed by pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate JWT token
    const token = user.generateToken();

    console.log(`✅ New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

// ---- POST /api/auth/login ----
// Authenticate user and return JWT token
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        error: "INVALID_CREDENTIALS",
        timestamp: new Date(),
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        error: "INVALID_CREDENTIALS",
        timestamp: new Date(),
      });
    }

    // Generate JWT token
    const token = user.generateToken();

    console.log(`✅ User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

// ---- GET /api/auth/me ----
// Get current logged-in user profile
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
