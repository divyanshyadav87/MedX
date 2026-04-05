// ============================================================
// UserHistory Model
// Tracks which medicines a user has scanned and their favorites
// ============================================================

const mongoose = require("mongoose");

const userHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    medicineName: {
      type: String,
      required: true,
    },
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    uploadedImagePath: {
      type: String,
      default: "",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast user-specific queries
userHistorySchema.index({ userId: 1, uploadedAt: -1 });
userHistorySchema.index({ userId: 1, isFavorite: 1 });

module.exports = mongoose.model("UserHistory", userHistorySchema);
