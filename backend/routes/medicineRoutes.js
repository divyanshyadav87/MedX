// ============================================================
// Medicine Routes
// POST /api/medicines/identify      - Upload & identify (protected)
// GET  /api/medicines/search?name=  - Search by name
// GET  /api/medicines/:id           - Get by ID
// POST /api/medicines/:medicineId/favorite - Toggle favorite (protected)
// ============================================================

const express = require("express");
const router = express.Router();
const {
  identifyMedicine,
  searchMedicine,
  getMedicineById,
} = require("../controllers/medicineController");
const { toggleFavorite } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  searchValidation,
  objectIdValidation,
  medicineIdValidation,
} = require("../utils/validators");

// Protected: upload image and identify medicine
router.post("/identify", protect, upload.single("image"), identifyMedicine);

// Public: search medicines by name
router.get("/search", searchValidation, searchMedicine);

// Public: get medicine by ID
router.get("/:id", objectIdValidation, getMedicineById);

// Protected: toggle favorite on a medicine
router.post("/:medicineId/favorite", protect, medicineIdValidation, toggleFavorite);

module.exports = router;
