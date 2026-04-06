const parserService = require('../services/parserService');
const rangeMatcher = require('../services/rangeMatcher');
const aiService = require('../services/aiService');
const fs = require('fs');

exports.analyzeReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // 1. Extract Text
    const extractedText = await parserService.extractText(req.file);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // 2. Match with Local JSON DB
    const { patientInfo, results } = rangeMatcher.analyzeReport(extractedText);

    if (results.length === 0) {
       return res.status(200).json({
         results: [],
         summary: { overallStatus: 'Unknown', score: 0 },
         patientInfo,
         disclaimer: "This is AI-generated information and not a medical diagnosis.",
         message: "Could not detect any standard medical parameters."
       });
    }

    // 3. Get AI Explanations and calculate overall confidence
    let averageConfidence = 0;
    
    const explainedResults = await Promise.all(results.map(async (res) => {
      averageConfidence += res.confidence;
      res.explanation = await aiService.getExplanation(res);
      return res;
    }));

    averageConfidence = Math.round(averageConfidence / results.length);
    
    // 4. Generate Medical Action Plan
    const actionPlan = await aiService.generateActionPlan(results);

    // Overall Status
    const totalIssues = results.filter(r => r.status !== 'Normal').length;
    const overallStatus = totalIssues === 0 ? 'Optimal' : (totalIssues > 2 ? 'Needs Attention' : 'Monitor');

    res.status(200).json({
      results: explainedResults,
      summary: {
        overallStatus,
        keyPoints: `${totalIssues} out of range parameters detected.`,
        confidenceScore: averageConfidence
      },
      patientInfo,
      actionPlan,
      disclaimer: "This is AI-generated information and not a medical diagnosis."
    });

  } catch (error) {
    console.error('Error analyzing report:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // clean up on error
    }
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
