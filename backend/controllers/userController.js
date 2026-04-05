// ============================================================
// User Controller
// Handles user history, favorites, and profile features
// ============================================================

const UserHistory = require("../models/UserHistory");
const Medicine = require("../models/Medicine");

// ---- GET /api/user/history ----
// Get paginated scan history for the logged-in user
const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      UserHistory.find({ userId: req.user._id })
        .populate("medicineId", "name genericName brand category dosageForm uses")
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit),
      UserHistory.countDocuments({ userId: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      message: `Found ${history.length} history entries`,
      data: history.map((entry) => ({
        id: entry._id,
        medicineName: entry.medicineName,
        medicineId: entry.medicineId?._id,
        medicineDetails: entry.medicineId
          ? {
              name: entry.medicineId.name,
              genericName: entry.medicineId.genericName,
              brand: entry.medicineId.brand,
              category: entry.medicineId.category,
              dosageForm: entry.medicineId.dosageForm,
              uses: entry.medicineId.uses,
            }
          : null,
        uploadedImagePath: entry.uploadedImagePath,
        isFavorite: entry.isFavorite,
        uploadedAt: entry.uploadedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

// ---- POST /api/medicines/:medicineId/favorite ----
// Toggle favorite status for a medicine in user's history
const toggleFavorite = async (req, res, next) => {
  try {
    const { medicineId } = req.params;

    // Find the most recent history entry for this user + medicine
    const historyEntry = await UserHistory.findOne({
      userId: req.user._id,
      medicineId,
    }).sort({ uploadedAt: -1 });

    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: "No history entry found for this medicine",
        error: "NOT_FOUND",
        timestamp: new Date(),
      });
    }

    // Toggle the favorite status
    historyEntry.isFavorite = !historyEntry.isFavorite;
    await historyEntry.save();

    // Also update all other history entries for this user + medicine
    await UserHistory.updateMany(
      {
        userId: req.user._id,
        medicineId,
        _id: { $ne: historyEntry._id },
      },
      { isFavorite: historyEntry.isFavorite }
    );

    const statusMessage = historyEntry.isFavorite
      ? "Added to favorites"
      : "Removed from favorites";

    console.log(
      `⭐ ${statusMessage}: ${historyEntry.medicineName} (user: ${req.user.email})`
    );

    res.status(200).json({
      success: true,
      message: statusMessage,
      data: {
        medicineId,
        isFavorite: historyEntry.isFavorite,
      },
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

// ---- GET /api/user/favorites ----
// Get all favorited medicines for the logged-in user
const getFavorites = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get unique favorited medicines (avoid duplicates from multiple scans)
    const favorites = await UserHistory.aggregate([
      { $match: { userId: req.user._id, isFavorite: true } },
      { $sort: { uploadedAt: -1 } },
      {
        $group: {
          _id: "$medicineId",
          medicineName: { $first: "$medicineName" },
          uploadedImagePath: { $first: "$uploadedImagePath" },
          favoritedAt: { $first: "$uploadedAt" },
          historyId: { $first: "$_id" },
        },
      },
      { $sort: { favoritedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Populate medicine details
    const medicineIds = favorites.map((f) => f._id);
    const medicines = await Medicine.find({ _id: { $in: medicineIds } });
    const medicineMap = {};
    medicines.forEach((m) => {
      medicineMap[m._id.toString()] = m;
    });

    const total = await UserHistory.aggregate([
      { $match: { userId: req.user._id, isFavorite: true } },
      { $group: { _id: "$medicineId" } },
      { $count: "total" },
    ]);

    res.status(200).json({
      success: true,
      message: `Found ${favorites.length} favorite(s)`,
      data: favorites.map((fav) => {
        const med = medicineMap[fav._id.toString()];
        return {
          historyId: fav.historyId,
          medicineId: fav._id,
          medicineName: fav.medicineName,
          uploadedImagePath: fav.uploadedImagePath,
          favoritedAt: fav.favoritedAt,
          medicineDetails: med
            ? {
                genericName: med.genericName,
                brand: med.brand,
                category: med.category,
                dosageForm: med.dosageForm,
                uses: med.uses,
                approximatePrice: med.approximatePrice,
              }
            : null,
        };
      }),
      pagination: {
        page,
        limit,
        total: total[0]?.total || 0,
        pages: Math.ceil((total[0]?.total || 0) / limit),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

// ---- DELETE /api/user/history/:id ----
// Delete a specific history entry
const deleteHistoryEntry = async (req, res, next) => {
  try {
    const entry = await UserHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "History entry not found",
        error: "NOT_FOUND",
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: "History entry deleted",
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, toggleFavorite, getFavorites, deleteHistoryEntry };
