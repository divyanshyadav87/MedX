// ============================================================
// Grok AI Service (xAI)
// Handles all AI interactions using xAI's Grok models:
//   1. Vision API  → extract medicine name from image
//   2. Text API    → get comprehensive medicine details
// ============================================================

const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");
const { fetchFDADetails } = require("./fdaService");

// Initialize xAI client using the OpenAI SDK format
const openai = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

const VISION_MODEL = "grok-2-vision-latest";
const TEXT_MODEL = "grok-2-latest";

// ============================================================
// 1. identifyMedicineFromImage
//    Sends image to Grok Vision model to extract the name.
// ============================================================
const identifyMedicineFromImage = async (imagePath) => {
  try {
    console.log(`🔍 Sending image to Grok Vision API (${VISION_MODEL})...`);

    // Read image file and convert to base64 data URI format
    const absolutePath = path.resolve(imagePath);
    const imageBuffer = fs.readFileSync(absolutePath);
    const base64Image = imageBuffer.toString("base64");

    // Determine mime type
    const ext = path.extname(imagePath).toLowerCase().replace(".", "");
    const mimeMap = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
    const mimeType = mimeMap[ext] || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const response = await openai.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "You are a pharmaceutical expert. Identify the medicine name from this image. Look for text on packaging, labels, pills, capsules, syringes, tubes, or any pharmaceutical product. Return ONLY the medicine name — nothing else. If you cannot identify the medicine, respond with exactly: UNIDENTIFIED"
            },
            {
              type: "image_url",
              image_url: { url: dataUrl }
            }
          ]
        }
      ],
      max_tokens: 100,
      temperature: 0.1
    });

    const medicineName = response.choices[0].message.content.trim();
    console.log(`✅ Grok Vision identified: "${medicineName}"`);

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
    console.error("❌ Grok Vision API Error:", error.message);
    if (error.message.includes("Could not identify")) {
      throw error;
    }
    throw new Error(`AI image analysis failed: ${error.message}`);
  }
};

// ============================================================
// 2. getMedicineDetails
//    Sends medicine name to Grok Text model and returns JSON.
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

    console.log(`🧠 Calling Grok API (${TEXT_MODEL}) to compile comprehensive JSON details...`);

    const prompt = `You are a knowledgeable pharmacist and medical information specialist. 
Provide accurate, comprehensive information about medicines. 
Always respond with valid JSON only — no markdown, no code fences, no extra text.
If you're unsure about any field, provide your best professional assessment with a note.

Provide comprehensive information about the medicine "${medicineName}". 
Return ONLY a valid JSON object with the exact following structure:
{
  "medicineName": "exact medicine name",
  "genericName": "generic/chemical name",
  "brand": "common brand names",
  "manufacturer": "primary manufacturer",
  "category": "therapeutic category (e.g., Analgesic, Antibiotic, etc.)",
  "chemicalComposition": "chemical formula or composition",
  "activeIngredients": ["list", "of", "active", "ingredients"],
  "uses": ["primary use 1", "primary use 2", "etc."],
  "sideEffects": ["side effect 1", "side effect 2", "etc."],
  "dosage": "standard dosage information",
  "dosageForm": "tablet/capsule/syrup/injection/cream/etc.",
  "strength": "common strengths available",
  "frequency": "how often to take",
  "warnings": ["warning 1", "warning 2"],
  "precautions": ["precaution 1", "precaution 2"],
  "drugInteractions": ["interaction 1", "interaction 2"],
  "foodInteractions": ["food interaction 1", "food interaction 2"],
  "storageInstructions": "storage requirements",
  "administrationRoute": "oral/topical/intravenous/etc.",
  "onset": "time to start working",
  "duration": "how long effects last",
  "pregnancyCategory": "FDA pregnancy category",
  "lactation": "safety during breastfeeding",
  "overdosage": "overdose information and treatment",
  "approximatePrice": "approximate price range"
}

Be detailed and accurate. For arrays, provide at least 3-5 items where applicable.
Only output Raw JSON format, nothing else!

${fdaContext}`;

    const response = await openai.chat.completions.create({
      model: TEXT_MODEL,
      messages: [
        { role: "system", content: "You are a JSON generating system. Output ONLY valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    const content = response.choices[0].message.content.trim();
    console.log("✅ Grok medicine details received");

    // Parse the JSON response
    let medicineData;
    try {
      // Some LLMs still wrap output in code fences despite instructions
      let cleanedContent = content.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      medicineData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("❌ Failed to parse Grok response as JSON");
      // Attempt to extract JSON from the response aggressively
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        medicineData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("AI returned invalid data format");
      }
    }

    // Ensure all expected fields exist with defaults
    const defaults = {
      medicineName: medicineName,
      genericName: "",
      brand: "",
      manufacturer: "",
      category: "",
      chemicalComposition: "",
      activeIngredients: [],
      uses: [],
      sideEffects: [],
      dosage: "",
      dosageForm: "",
      strength: "",
      frequency: "",
      warnings: [],
      precautions: [],
      drugInteractions: [],
      foodInteractions: [],
      storageInstructions: "",
      administrationRoute: "",
      onset: "",
      duration: "",
      pregnancyCategory: "",
      lactation: "",
      overdosage: "",
      approximatePrice: "",
    };

    return { ...defaults, ...medicineData };
  } catch (error) {
    console.error("❌ Grok Details Error:", error.message);
    throw new Error(`Failed to get medicine details: ${error.message}`);
  }
};

module.exports = {
  identifyMedicineFromImage,
  getMedicineDetails,
};
