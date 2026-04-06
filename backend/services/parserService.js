const fs = require('fs');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

/**
 * Extracts raw text from an uploaded file.
 * Automatically determines if file is a PDF or an Image.
 */
exports.extractText = async (file) => {
  const filePath = file.path;
  const mimeType = file.mimetype;

  try {
    if (mimeType === 'application/pdf') {
      // PDF Processing
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (mimeType.startsWith('image/')) {
      // Image OCR Processing
      const result = await Tesseract.recognize(filePath, 'eng', {
        logger: (m) => console.log(m)
      });
      return result.data.text;
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or Image.');
    }
  } catch (error) {
    console.error('Error during extraction:', error);
    throw new Error('Failed to extract text from the document.');
  }
};
