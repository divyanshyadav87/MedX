// ============================================================
// Medicine Controller
// Core feature: image upload → AI identification → details
// Also handles search and retrieval
// ============================================================

const Medicine = require("../models/Medicine");
const UserHistory = require("../models/UserHistory");
const {
  identifyMedicineFromImage,
  getMedicineDetails,
} = require("../utils/geminiService");
const fs = require("fs");
const path = require("path");

// ---- POST /api/medicines/identify ----
// Main workflow: receive image → identify → get details → store → respond
const identifyMedicine = async (req, res, next) => {
  try {
    // 1. Validate that an image file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded. Please upload a medicine image.",
        error: "NO_FILE",
        timestamp: new Date(),
      });
    }

    console.log(`📸 Image received: ${req.file.filename} (${req.file.size} bytes)`);

    const imagePath = req.file.path;

    // 2. Send image to OpenAI Vision API to extract medicine name
    let medicineName;
    try {
      medicineName = identifyMedicineFromImage
        ? await identifyMedicineFromImage(imagePath)
        : null;
    } catch (aiError) {
      // Clean up uploaded file on AI failure
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      return res.status(422).json({
        success: false,
        message: aiError.message,
        error: "AI_IDENTIFICATION_FAILED",
        timestamp: new Date(),
      });
    }

    if (!medicineName) {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      return res.status(422).json({
        success: false,
        message: "Could not identify the medicine from the image.",
        error: "IDENTIFICATION_FAILED",
        timestamp: new Date(),
      });
    }

    // 3. Check if medicine already exists in database (cache)
    let medicine = await Medicine.findOne({
      name: { $regex: new RegExp(`^${escapeRegex(medicineName)}$`, "i") },
    });

    if (medicine) {
      console.log(`💾 Medicine found in cache: ${medicine.name}`);
    } else {
      // 4. Medicine not in DB → call GPT-4 for detailed information
      console.log(`🆕 New medicine. Fetching details from AI...`);
      const details = await getMedicineDetails(medicineName);

      // 5. Save to MongoDB
      medicine = await Medicine.create({
        name: details.medicineName || medicineName,
        genericName: details.genericName,
        brand: details.brand,
        manufacturer: details.manufacturer,
        category: details.category,
        chemicalComposition: details.chemicalComposition,
        activeIngredients: details.activeIngredients,
        uses: details.uses,
        sideEffects: details.sideEffects,
        dosage: details.dosage,
        dosageForm: details.dosageForm,
        strength: details.strength,
        frequency: details.frequency,
        warnings: details.warnings,
        precautions: details.precautions,
        drugInteractions: details.drugInteractions,
        foodInteractions: details.foodInteractions,
        storageInstructions: details.storageInstructions,
        administrationRoute: details.administrationRoute,
        onset: details.onset,
        duration: details.duration,
        pregnancyCategory: details.pregnancyCategory,
        lactation: details.lactation,
        overdosage: details.overdosage,
        approximatePrice: details.approximatePrice,
        aiGeneratedAt: new Date(),
      });

      console.log(`✅ Medicine saved to database: ${medicine.name}`);
    }

    // 6. Add entry to user history
    await UserHistory.create({
      userId: req.user._id,
      medicineName: medicine.name,
      medicineId: medicine._id,
      uploadedImagePath: req.file.filename,
      uploadedAt: new Date(),
    });

    console.log(`📝 History entry added for user: ${req.user.email}`);

    // 7. Return complete medicine data
    res.status(200).json({
      success: true,
      message: "Medicine identified successfully",
      data: formatMedicineResponse(medicine),
      imageUrl: `/uploads/${req.file.filename}`,
      timestamp: new Date(),
    });
  } catch (error) {
    // Clean up uploaded file on any error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// ---- GET /api/medicines/search?name=aspirin ----
// Search for medicine by name
const searchMedicine = async (req, res, next) => {
  try {
    const { name } = req.query;

    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: escapeRegex(name), $options: "i" } },
        { genericName: { $regex: escapeRegex(name), $options: "i" } },
        { brand: { $regex: escapeRegex(name), $options: "i" } },
      ],
    }).limit(20);

    if (medicines.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No medicines found matching "${name}"`,
        data: [],
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: `Found ${medicines.length} result(s)`,
      data: medicines.map(formatMedicineResponse),
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

// ---- GET /api/medicines/:id ----
// Get medicine by MongoDB ID
const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
        error: "NOT_FOUND",
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      data: formatMedicineResponse(medicine),
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

// ---- Helper: format medicine data for response ----
function formatMedicineResponse(med) {
  return {
    id: med._id,
    medicineName: med.name,
    genericName: med.genericName,
    brand: med.brand,
    manufacturer: med.manufacturer,
    category: med.category,
    chemicalComposition: med.chemicalComposition,
    activeIngredients: med.activeIngredients,
    uses: med.uses,
    sideEffects: med.sideEffects,
    dosage: med.dosage,
    dosageForm: med.dosageForm,
    strength: med.strength,
    frequency: med.frequency,
    warnings: med.warnings,
    precautions: med.precautions,
    drugInteractions: med.drugInteractions,
    foodInteractions: med.foodInteractions,
    storageInstructions: med.storageInstructions,
    administrationRoute: med.administrationRoute,
    onset: med.onset,
    duration: med.duration,
    pregnancyCategory: med.pregnancyCategory,
    lactation: med.lactation,
    overdosage: med.overdosage,
    approximatePrice: med.approximatePrice,
    aiGeneratedAt: med.aiGeneratedAt,
    createdAt: med.createdAt,
  };
}

// ---- Helper: escape special regex characters in user input ----
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = { identifyMedicine, searchMedicine, getMedicineById };
