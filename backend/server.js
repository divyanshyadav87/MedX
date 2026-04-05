// ============================================================
//  CureEye Backend Server
//  AI-Powered Medicine Identification System
// ============================================================
//  Entry point. Configures Express, connects to MongoDB,
//  mounts routes, and starts listening.
// ============================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ---- Connect to MongoDB ----
connectDB();

// ============================================================
// Global Middleware
// ============================================================

// CORS – allow frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse JSON bodies (for non-multipart requests)
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---- Rate Limiting ----
// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // 100 requests per window
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    error: "RATE_LIMIT_EXCEEDED",
    timestamp: new Date(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for upload/identify endpoint (AI calls are expensive)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many upload requests. Please wait before trying again.",
    error: "UPLOAD_RATE_LIMIT",
    timestamp: new Date(),
  },
});

// Auth limiter (prevent brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
    error: "AUTH_RATE_LIMIT",
    timestamp: new Date(),
  },
});

// Apply rate limiters
app.use("/api/", apiLimiter);
app.use("/api/auth/", authLimiter);
app.use("/api/medicines/identify", uploadLimiter);

// ============================================================
// Routes
// ============================================================

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🏥 CureEye API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      medicines: "/api/medicines",
      user: "/api/user",
    },
    timestamp: new Date(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// Mount route modules
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// ============================================================
// 404 Handler – for unmatched routes
// ============================================================
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: "NOT_FOUND",
    timestamp: new Date(),
  });
});

// ============================================================
// Global Error Handler
// ============================================================
app.use(errorHandler);

// ============================================================
// Start Server
// ============================================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║   🏥  CureEye API Server                ║
  ║   📡  Port: ${PORT}                        ║
  ║   🌍  Env:  ${process.env.NODE_ENV || "development"}               ║
  ║   📁  Uploads: ./uploads/               ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});

module.exports = app;
