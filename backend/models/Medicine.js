// ============================================================
// Medicine Model
// Stores comprehensive medicine data returned by the AI
// Acts as a cache to avoid duplicate API calls
// ============================================================

const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      unique: true,
      trim: true,
      index: true,
    },
    genericName: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "",
    },
    manufacturer: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    activeIngredients: {
      type: [String],
      default: [],
    },
    uses: {
      type: [String],
      default: [],
    },
    sideEffects: {
      type: [String],
      default: [],
    },
    dosage: {
      type: String,
      default: "",
    },
    warnings: {
      type: [String],
      default: [],
    },
    precautions: {
      type: [String],
      default: [],
    },
    approximatePrice: {
      type: String,
      default: "",
    },
    aiGeneratedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search functionality
medicineSchema.index({ name: "text", genericName: "text", brand: "text" });

module.exports = mongoose.model("Medicine", medicineSchema);
