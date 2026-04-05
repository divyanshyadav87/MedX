// ============================================================
// Input Validators
// Uses express-validator for request validation
// ============================================================

const { body, query, param, validationResult } = require("express-validator");

// ---- Generic validation result checker ----
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
      timestamp: new Date(),
    });
  }
  next();
};

// ---- Registration Validators ----
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

// ---- Login Validators ----
const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

// ---- Medicine Search Validator ----
const searchValidation = [
  query("name")
    .trim()
    .notEmpty()
    .withMessage("Medicine name is required for search")
    .isLength({ min: 2 })
    .withMessage("Search query must be at least 2 characters"),
  validate,
];

// ---- ObjectId Param Validator ----
const objectIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ID format"),
  validate,
];

const medicineIdValidation = [
  param("medicineId")
    .isMongoId()
    .withMessage("Invalid medicine ID format"),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  searchValidation,
  objectIdValidation,
  medicineIdValidation,
  validate,
};
