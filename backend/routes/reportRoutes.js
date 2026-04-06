const express = require('express');
const router = express.Router();
const multer = require('multer');
const reportController = require('../controllers/reportController');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Report Analysis Endpoint
router.post('/analyze-report', upload.single('report'), reportController.analyzeReport);

module.exports = router;
