// ============================================================
// JWT Authentication Middleware
// Verifies the Bearer token on protected routes
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
      error: "UNAUTHORIZED",
      timestamp: new Date(),
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token may be invalid.",
        error: "USER_NOT_FOUND",
        timestamp: new Date(),
      });
    }

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
        error: "TOKEN_EXPIRED",
        timestamp: new Date(),
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid token.",
      error: "INVALID_TOKEN",
      timestamp: new Date(),
    });
  }
};

module.exports = { protect };
