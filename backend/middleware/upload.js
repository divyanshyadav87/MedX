// ============================================================
// Multer Upload Middleware
// Configures file upload: storage, file filtering, size limits
// ============================================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId-timestamp-originalname
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `medicine-${uniqueSuffix}${ext}`);
  },
});

// File filter: only allow image formats
const fileFilter = (req, file, cb) => {
  const allowedFormats = (process.env.ALLOWED_IMAGE_FORMATS || "jpg,jpeg,png")
    .split(",")
    .map((fmt) => fmt.trim().toLowerCase());

  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  const mimeAllowed = file.mimetype.startsWith("image/");

  if (allowedFormats.includes(ext) && mimeAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file format. Allowed formats: ${allowedFormats.join(", ")}`
      ),
      false
    );
  }
};

// Max file size from env or default 10MB
const maxSize = parseInt(process.env.MAX_IMAGE_SIZE) || 10 * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxSize,
  },
});

module.exports = upload;
