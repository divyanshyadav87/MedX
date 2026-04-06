require('dotenv').config({ path: __dirname + '/../backend/.env' });
const { analyzeReport } = require('../backend/controllers/reportController');

(async () => {
  const req = {
    body: {
      user_info: { age: 25, gender: 'male' },
      tests: [
        { name: "Hemoglobin", value: 10.5, unit: "g/dL" },
        { name: "WBC", value: 12000, unit: "/µL" }
      ]
    }
  };

  const res = {
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (data) {
      console.log('Status:', this.statusCode);
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  };

  await analyzeReport(req, res);
})();
