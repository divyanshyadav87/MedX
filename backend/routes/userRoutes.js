// ============================================================
// User Routes
// GET    /api/user/history      - Get scan history (protected)
// GET    /api/user/favorites    - Get favorited medicines (protected)
// DELETE /api/user/history/:id  - Delete history entry (protected)
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getHistory,
  getFavorites,
  deleteHistoryEntry,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

// All user routes are protected
router.use(protect);

router.get("/history", getHistory);
router.get("/favorites", getFavorites);
router.delete("/history/:id", deleteHistoryEntry);

module.exports = router;
