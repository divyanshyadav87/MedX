// ============================================================
// Google Gemini AI Service
// Handles all AI interactions using Google Gemini models:
//   1. Vision API  → extract medicine name from image
//   2. Text API    → get comprehensive medicine details
// ============================================================

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const { fetchFDADetails } = require("./fdaService");

// Initialize Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VISION_MODEL = "gemini-2.5-flash-lite";
const TEXT_MODEL = "gemini-2.5-flash-lite"; // Flash-Lite is optimized for maximum speed

// Helper to convert local file information to GoogleGenerativeAI.Part object
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

// Helper to auto-retry Gemini API calls on transient 503 errors
async function generateContentWithRetry(model, args, maxRetries = 2) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await model.generateContent(args);
    } catch (error) {
      if (
        error.message.includes("503") || 
        error.message.includes("high demand") || 
        error.message.includes("OVERLOADED")
      ) {
        attempt++;
        if (attempt >= maxRetries) throw error;
        console.warn(`⏳ Gemini API busy (503). Retrying attempt ${attempt}...`);
        await new Promise((res) => setTimeout(res, attempt * 2000));
      } else {
        throw error; // Throw other errors normally
      }
    }
  }
}

// ============================================================
// 1. identifyMedicineFromImage
//    Sends image to Gemini Vision model to extract the name.
// ============================================================
const identifyMedicineFromImage = async (imagePath) => {
  try {
    console.log(`🔍 Sending image to Google Gemini Vision API (${VISION_MODEL})...`);

    // Check if the file exists
    const absolutePath = path.resolve(imagePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    // Determine mime type
    const ext = path.extname(imagePath).toLowerCase().replace(".", "");
    const mimeMap = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
    const mimeType = mimeMap[ext] || "image/jpeg";

    const imagePart = fileToGenerativePart(absolutePath, mimeType);

    const prompt = "You are a pharmaceutical expert. Identify the medicine name from this image. Look for text on packaging, labels, pills, capsules, syringes, tubes, or any pharmaceutical product. Return ONLY the medicine name — nothing else. If you cannot identify the medicine, respond with exactly: UNIDENTIFIED";

    const model = genAI.getGenerativeModel({ model: VISION_MODEL });
    const result = await generateContentWithRetry(model, [prompt, imagePart]);
    const response = await result.response;
    const medicineName = response.text().trim();

    console.log(`✅ Gemini Vision identified: "${medicineName}"`);

    if (
      medicineName === "UNIDENTIFIED" ||
      medicineName.toLowerCase().includes("cannot") ||
      medicineName.toLowerCase().includes("unable") ||
      medicineName.toLowerCase().includes("sorry") ||
      medicineName.toLowerCase().includes("i am an ai")
    ) {
      throw new Error(
        "Could not identify the medicine from the image. Please upload a clearer image showing the medicine name or packaging."
      );
    }

    return medicineName;
  } catch (error) {
    console.error("❌ Gemini Vision API Error:", error.message);
    if (error.message.includes("Could not identify")) {
      throw error;
    }
    throw new Error(`AI image analysis failed: ${error.message}`);
  }
};

// ============================================================
// 2. getMedicineDetails
//    Sends medicine name to Gemini Text model and returns JSON.
// ============================================================
const getMedicineDetails = async (medicineName) => {
  try {
    console.log(`💊 Fetching details for: "${medicineName}"...`);

    // 1. Fetch authoritative data from USFDA
    const fdaData = await fetchFDADetails(medicineName);

    let fdaContext = "";
    if (fdaData) {
      fdaContext = `
--- FDA OFFICIAL DATA ---
The following data was retrieved from the official US FDA database for this medicine:
${JSON.stringify(fdaData, null, 2)}

CRITICAL INSTRUCTION:
- You MUST prioritize and incorporate the above FDA data for clinical fields (activeIngredients, uses, warnings, sideEffects, dosage, etc.).
- Merge the FDA data with your general medical knowledge to fill in any missing fields (like approximatePrice, category, specific simple explanations).
- Convert complex FDA terminology into clear, accessible language suitable for the general public, while maintaining medical accuracy.
-------------------------`;
    } else {
      fdaContext = `
--- FDA OFFICIAL DATA ---
No FDA data was found for this medicine. Rely entirely on your medical knowledge base to provide accurate details.
-------------------------`;
    }

    console.log(`🧠 Calling Gemini API (${TEXT_MODEL}) to compile comprehensive JSON details...`);

    const prompt = `You are a knowledgeable pharmacist. 
Provide highly concise, essential information about the medicine "${medicineName}", tailored for the Indian pharmaceutical market (including common Indian brand names and pricing in INR).
CRITICAL INSTRUCTION: Keep all text and descriptions extremely brief. For arrays, provide strictly 2-4 short bullet points containing ONLY the most essential and sufficient information. Do not use filler words.
Return a valid JSON object with the exact following structure.

{
  "medicineName": "exact medicine name",
  "genericName": "generic/chemical name",
  "brand": "common brand names in India",
  "manufacturer": "primary manufacturer in India",
  "category": "therapeutic category (e.g., Analgesic, Antibiotic, etc.)",
  "activeIngredients": ["list", "of", "active", "ingredients"],
  "uses": ["primary use 1", "primary use 2", "etc."],
  "sideEffects": ["side effect 1", "side effect 2", "etc."],
  "dosage": "standard dosage information",
  "warnings": ["warning 1", "warning 2"],
  "precautions": ["precaution 1", "precaution 2"],
  "approximatePrice": "approximate price range in Indian Rupees (₹/INR) in the Indian market"
}

${fdaContext}`;

    const model = genAI.getGenerativeModel({
      model: TEXT_MODEL,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    const result = await generateContentWithRetry(model, prompt);
    let content = await result.response.text();
    content = content.trim();

    console.log("✅ Gemini medicine details received");

    // Parse the JSON response
    let medicineData;
    try {
      medicineData = JSON.parse(content);
    } catch (parseError) {
      console.error("❌ Failed to parse Gemini response as JSON");
      // Attempt to extract JSON from the response aggressively 
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        medicineData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("AI returned invalid data format");
      }
    }

    // Safety checks for Mongoose schema (Schema expects strings, AI sometimes returns arrays for plurals)
    if (Array.isArray(medicineData.brand)) medicineData.brand = medicineData.brand.join(", ");
    if (Array.isArray(medicineData.manufacturer)) medicineData.manufacturer = medicineData.manufacturer.join(", ");
    if (Array.isArray(medicineData.genericName)) medicineData.genericName = medicineData.genericName.join(", ");
    if (Array.isArray(medicineData.approximatePrice)) medicineData.approximatePrice = medicineData.approximatePrice.join(" - ");

    // Ensure all expected fields exist with defaults
    const defaults = {
      medicineName: medicineName,
      genericName: "",
      brand: "",
      manufacturer: "",
      category: "",
      activeIngredients: [],
      uses: [],
      sideEffects: [],
      dosage: "",
      warnings: [],
      precautions: [],
      approximatePrice: "",
    };

    return { ...defaults, ...medicineData };
  } catch (error) {
    console.error("❌ Gemini Details Error:", error.message);
    throw new Error(`Failed to get medicine details: ${error.message}`);
  }
};

module.exports = {
  identifyMedicineFromImage,
  getMedicineDetails,
};
