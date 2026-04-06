const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Gets a simple, non-diagnostic explanation for a given medical test result
 */
exports.getExplanation = async (testData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Explain this medical test in simple terms.
    
    Test: ${testData.name}
    Value: ${testData.value} ${testData.unit}
    Status: ${testData.status}
    
    Rules:
    * Do not diagnose
    * Use "may indicate"
    * Keep it very simple (1-2 sentences max)`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error fetching AI explanation:', error);
    return "This test measures " + testData.name + " levels in your blood.";
  }
};

/**
 * Gets a structured Medical Action Plan based on all out-of-range results.
 */
exports.generateActionPlan = async (resultsArray) => {
  try {
    const outliers = resultsArray.filter(r => r.status !== 'Normal');
    if (outliers.length === 0) {
      return {
        diagnostic: ["Maintain current routine", "Schedule annual checkup"],
        lifestyle: ["Continue balanced diet", "Maintain consistent sleep schedule"],
        monitor: ["No critical red flags currently"]
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Pass the outliers as context
    const outStr = outliers.map(o => `${o.name}: ${o.status} (${o.value} vs normal ${o.normalRange})`).join(", ");

    const prompt = `Based on these out-of-range medical test results: ${outStr}
    
    Create a very brief medical action plan with exactly these three arrays of strings formatted in strict valid JSON. Do not return markdown blocks, only the raw JSON.
    Structure:
    {
      "diagnostic": ["Step 1", "Step 2"],
      "lifestyle": ["Change 1", "Change 2"],
      "monitor": ["Red flag 1", "Red flag 2"]
    }
    Rules: Keep steps to 1 sentence maximum. Limit each array to exactly 2 items. Use "may consider" instead of prescribing.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    // Strip markdown formatting if it returns it
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
  } catch (error) {
    console.error('Error fetching action plan:', error);
    return {
      diagnostic: ["Consult with a physician regarding your lab results."],
      lifestyle: ["Maintain a balanced lifestyle and diet."],
      monitor: ["Monitor for general symptoms of fatigue or dizziness."]
    };
  }
};
