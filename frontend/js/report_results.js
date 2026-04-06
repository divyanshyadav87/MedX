document.addEventListener('DOMContentLoaded', () => {
  const rawData = localStorage.getItem('reportResults');
  if (!rawData) {
    document.body.innerHTML = `
      <div style="display:flex; height:100vh; align-items:center; justify-content:center; color:white;">
        <div style="text-align:center;">
          <h2>No Results Found</h2>
          <p style="color:var(--text-muted); margin-bottom:2rem;">Please upload a report first.</p>
          <a href="/upload.html" class="export-btn" style="text-decoration:none; display:inline-block;">Upload Report</a>
        </div>
      </div>
    `;
    return;
  }

  const data = JSON.parse(rawData);
  const { results, summary, patientInfo } = data;

  // Extracted Patient Info
  const pName = patientInfo?.name || "Guest Patient";
  const pAge = patientInfo?.age || "--";
  const pGender = patientInfo?.gender || "unknown";
  const pGenderCap = pGender.charAt(0).toUpperCase() + pGender.slice(1);
  const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Update Profile Data
  document.getElementById('patientNameDisplay').innerText = pName;
  document.getElementById('patientAgeDisplay').innerText = `Age: ${pAge}`;
  document.getElementById('patientGenderDisplay').innerText = `Gender: ${pGenderCap}`;
  document.getElementById('reportDateDisplay').innerText = `Date: ${dateFormatted}`;

  // Analyze Results metrics
  let totalTests = results.length;
  let normalTests = results.filter(r => r.status === 'Normal').length;
  let score = totalTests > 0 ? Math.round((normalTests / totalTests) * 100) : 0;
  
  // Set Score
  document.getElementById('overallScoreText').innerText = score;
  document.getElementById('overallScoreRing').style.setProperty('--score', score);
  document.getElementById('aiConfidenceDisplay').innerText = summary.confidenceScore;

  // Set Status Badge
  const badge = document.getElementById('overallStatusBadge');
  if (score > 80) {
    badge.innerText = 'NORMAL';
    badge.className = 'status-badge badge-normal';
  } else {
    badge.innerText = 'ATTENTION REQUIRED';
    badge.className = 'status-badge badge-attention';
  }

  // Critical Alert?
  const critical = results.find(r => r.status === 'High' || r.status === 'Low');
  if (critical) {
    document.getElementById('criticalAlertCard').style.display = 'flex';
    const alertMsg = `${critical.name} levels are ${critical.status.toLowerCase()}. ${critical.explanation}`;
    document.getElementById('criticalAlertText').innerText = alertMsg;
  }

  // Render Data Tables by Category
  const grouped = {};
  results.forEach(r => {
    let cat = r.category || 'General Panel';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(r);
  });

  const panelsContainer = document.getElementById('dataPanelsContainer');
  let tablesHtml = '';
  
  for (const cat in grouped) {
    tablesHtml += `
      <div class="data-panel" style="margin-bottom: 2rem;">
        <div class="panel-header">
          <div class="panel-title">${cat}</div>
          <div class="panel-meta">Last updated: 2 hours ago</div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>User Value</th>
              <th>Normal Range</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
    `;

    grouped[cat].forEach(item => {
      let dotColor = 'dot-normal';
      let statusColorStyle = 'color: var(--accent-green);';
      if (item.status === 'High') { dotColor = 'dot-high'; statusColorStyle = 'color: var(--accent-red);'; }
      if (item.status === 'Low') { dotColor = 'dot-low'; statusColorStyle = 'color: var(--accent-orange);'; }

      tablesHtml += `
            <tr>
              <td style="font-weight:500;">${item.name}</td>
              <td>${item.value} <span style="font-size:0.8em;color:var(--text-muted)">${item.unit}</span></td>
              <td style="color:var(--text-muted)">${item.normalRange}</td>
              <td style="${statusColorStyle} font-weight:600; font-size:0.9rem;">
                <span class="status-dot ${dotColor}"></span>${item.status}
              </td>
            </tr>
      `;
    });

    tablesHtml += `
          </tbody>
        </table>
      </div>
    `;
  }
  panelsContainer.innerHTML = tablesHtml;

  // Render Charts (Top 2 outliers or first 2)
  const chartsContainer = document.getElementById('chartsGridContainer');
  const chartsData = results.filter(r => r.status !== 'Normal').slice(0, 2);
  if (chartsData.length === 0) chartsData.push(...results.slice(0, 2));

  let chartsHtml = '';
  chartsData.forEach(item => {
    // Parse normal ranges to calc progress bar
    const [minStr, maxStr] = item.normalRange.split(' - ');
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);
    const value = item.value;
    
    let percent = 50; 
    let colorClassStyle = 'background-color: var(--accent-green);';
    let alertLabel = '';

    if (item.status === 'High') { colorClassStyle = 'background-color: var(--accent-red);'; alertLabel = 'Over Limit'; }
    if (item.status === 'Low') { colorClassStyle = 'background-color: var(--accent-orange);'; alertLabel = 'Below Range'; }

    if (!isNaN(min) && !isNaN(max)) {
      const rangeSpan = max - min;
      const lowerBound = min - (rangeSpan * 0.5);
      const upperBound = max + (rangeSpan * 0.5);
      
      let p = (value - lowerBound) / (upperBound - lowerBound) * 100;
      percent = Math.max(0, Math.min(100, Math.round(p)));
    }

    chartsHtml += `
      <div class="chart-card">
        <div class="chart-header">${item.name} COMPARISON</div>
        <div class="chart-stats">
          <div class="chart-stat-value">Your Value (${value})</div>
          <div class="chart-alert">${alertLabel}</div>
        </div>
        <div class="chart-bar-container">
          <div class="chart-bar-fill" style="width: ${percent}%; ${colorClassStyle}"></div>
          <div class="target-line" style="left: 50%;"></div>
        </div>
        <div class="chart-labels">
          <span>Min</span>
          <span>Target: ${item.normalRange}</span>
          <span>Max</span>
        </div>
      </div>
    `;
  });
  chartsContainer.innerHTML = chartsHtml;

  // Render Medical Action Plan
  const apContainer = document.getElementById('actionPlanContainer');
  let apHtml = '';
  
  if (data.actionPlan) {
    const { diagnostic, lifestyle, monitor } = data.actionPlan;
    
    // Diagnostic
    if (diagnostic && diagnostic.length > 0) {
      apHtml += `
        <div class="plan-card">
          <div class="plan-card-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-main)"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Immediate Diagnostic Steps
          </div>
          <ul class="plan-ul">
            ${diagnostic.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Lifestyle
    if (lifestyle && lifestyle.length > 0) {
      apHtml += `
        <div class="plan-card lifestyle">
          <div class="plan-card-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-main)"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Targeted Lifestyle Changes
          </div>
          <ul class="plan-ul">
            ${lifestyle.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Monitor
    if (monitor && monitor.length > 0) {
      apHtml += `
        <div class="plan-card monitor">
          <div class="plan-card-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-main)"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Red Flags to Monitor
          </div>
          <ul class="plan-ul">
            ${monitor.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>
      `;
    }
  } else {
    apHtml = '<div style="color:var(--text-muted); font-size:0.9rem;">No action plan generated.</div>';
  }
  
  apContainer.innerHTML = apHtml;

});
