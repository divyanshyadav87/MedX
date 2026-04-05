// ============================================================
// Global Error Handler Middleware
// Catches all unhandled errors and returns consistent responses
// ============================================================

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);
  console.error("Stack:", err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ---- Mongoose Validation Error ----
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(". ");
  }

  // ---- Mongoose Duplicate Key Error ----
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}. This ${field} already exists.`;
  }

  // ---- Mongoose Cast Error (invalid ObjectId) ----
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ---- Multer File Upload Errors ----
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File too large. Maximum allowed size is 10MB.";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message = "Unexpected file field. Please use 'image' as the field name.";
  }

  // ---- JWT Errors ----
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please log in again.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    timestamp: new Date(),
  });
};

module.exports = errorHandler;
