const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/medicalRanges.json');
const medicalDB = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

/**
 * Extracts assumed patient info from raw text
 */
function extractPatientInfo(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  let name = 'Guest Patient';
  let age = 30; // default
  let gender = 'male'; // default

  // Simple heuristics line by line
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const lineStr = lines[i].toLowerCase();
    
    // Extract Patient Name
    const nameMatch = lines[i].match(/(?:Patient\s*Name|Name)\s*[:\-]?\s*([A-Za-z\s]+)/i);
    if (nameMatch && nameMatch[1] && nameMatch[1].trim().length > 2) {
      if (name === 'Guest Patient') {
        name = nameMatch[1].trim();
      }
    }

    // Extract Age
    const ageMatch = lineStr.match(/age\s*[:\-]?\s*(\d+)/i) || lineStr.match(/(\d+)\s*(?:yrs|years?)/i);
    if (ageMatch && ageMatch[1]) {
      const parsedAge = parseInt(ageMatch[1], 10);
      if (parsedAge > 0 && parsedAge < 120) {
        age = parsedAge;
      }
    }

    // Extract Gender
    if (lineStr.match(/\b(?:sex|gender)\s*[:\-]?\s*(m|male|f|female)\b/i)) {
      const genStr = lineStr.match(/\b(?:sex|gender)\s*[:\-]?\s*(m|male|f|female)\b/i)[1].toLowerCase();
      gender = (genStr === 'm' || genStr === 'male') ? 'male' : 'female';
    } else if (lineStr.includes('female')) {
      gender = 'female';
    } else if (lineStr.includes('male')) {
      gender = 'male';
    }
  }

  return { name, age, gender };
}

/**
 * Matches extracted text against local database and calculates metrics
 * @param {string} rawText 
 * @returns {Object} Object containing extracted patient info and list of matched parameters
 */
exports.analyzeReport = (rawText) => {
  const patientInfo = extractPatientInfo(rawText);
  const lines = rawText.split('\n').map(l => l.trim().toLowerCase()).filter(Boolean);
  const results = [];
  const rawTextLower = rawText.toLowerCase();

  // Basic normalization for common OCR errors
  const normalizedText = rawTextLower
    .replace(/[^a-z0-9\.\s\%µ//]/g, '') 
    .replace(/\s+/g, ' ');

  Object.keys(medicalDB).forEach((testName) => {
    const testRanges = medicalDB[testName];
    const testNameLower = testName.toLowerCase();
    
    // Check if test name is mentioned in text (fuzzy/exact match)
    const isExactMatch = rawTextLower.includes(testNameLower);
    
    // Partial Match Strategy (e.g. "hemo" for "hemoglobin")
    const words = testNameLower.split(' ');
    const isPartialMatch = words.some(w => rawTextLower.includes(w) && w.length > 3);

    if (isExactMatch || isPartialMatch) {
      let confidence = 100;
      if (!isExactMatch) confidence -= 15; // Approximate match penalty

      // Try to extract value with Regex: Test Name followed by numbers
      // A typical line: "Hemoglobin 14.5 g/dL"
      const regexStr = `${testNameLower.split(' ')[0]}[^0-9]*([0-9]+\\.?[0-9]*)`;
      const valRegex = new RegExp(regexStr, 'i');
      const valMatch = rawTextLower.match(valRegex) || normalizedText.match(valRegex);

      if (valMatch && valMatch[1]) {
        const extractedValue = parseFloat(valMatch[1]);
        
        // Find correct range reference for the patient
        const matchingRange = testRanges.find(r => 
          (!r.gender || r.gender === patientInfo.gender) &&
          (!r.age_min || patientInfo.age >= r.age_min) &&
          (!r.age_max || patientInfo.age <= r.age_max)
        ) || testRanges[0]; // fallback to generic if conditions mismatch

        // Detect Unit logic:
        const unitPresent = rawTextLower.includes(matchingRange.unit.toLowerCase());
        if (!unitPresent) confidence -= 15; // Unit mismatch/missing penalty
        
        let status = 'Normal';
        if (extractedValue < matchingRange.min) status = 'Low';
        if (extractedValue > matchingRange.max) status = 'High';

        results.push({
          name: testName,
          value: extractedValue,
          unit: matchingRange.unit,
          category: matchingRange.category,
          status,
          normalRange: `${matchingRange.min} - ${matchingRange.max}`,
          confidence: Math.max(0, confidence)
        });
      }
    }
  });

  return {
    patientInfo,
    results
  };
};
