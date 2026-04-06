// ===========================
// RESULTS.JS — Medicine Results Page
// Connected to real backend API
// ===========================
import { requireAuth, showToast } from './main.js';
import { getMedicineById, toggleFavorite } from './api.js';

// SVG icons for each section
const SECTION_ICONS = {
  name: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18.5 5.5-12 12"/><path d="M15.5 5.5a3 3 0 1 1 3 3"/><path d="M8.5 18.5a3 3 0 1 1-3-3"/></svg>',
  ingredients: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  uses: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  dosage: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18.5 5.5-12 12"/><path d="M15.5 5.5a3 3 0 1 1 3 3"/><path d="M8.5 18.5a3 3 0 1 1-3-3"/></svg>',
  sideEffects: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  warnings: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  precautions: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  storage: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
  onset: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  pregnancy: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  price: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  drugInteractions: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  foodInteractions: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
  overdosage: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  composition: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/></svg>',
};

async function init() {
  const user = requireAuth();
  if (!user) return;

  const params = new URLSearchParams(window.location.search);
  const medicineId = params.get('id');

  if (!medicineId) {
    window.location.href = '/history.html';
    return;
  }

  // Try to load from sessionStorage first (just scanned), then fallback to API
  let medicine = null;
  const cached = sessionStorage.getItem('MedX_last_result');

  if (cached) {
    const parsed = JSON.parse(cached);
    if (parsed.id === medicineId) {
      medicine = parsed;
      sessionStorage.removeItem('MedX_last_result');
    }
  }

  if (!medicine) {
    try {
      const response = await getMedicineById(medicineId);
      medicine = response.data;
    } catch (error) {
      showToast('Failed to load medicine details', 'error');
      setTimeout(() => { window.location.href = '/history.html'; }, 1000);
      return;
    }
  }

  // Back button
  document.getElementById('backBtn')?.addEventListener('click', () => {
    if (document.referrer.includes('history')) {
      history.back();
    } else {
      window.location.href = '/history.html';
    }
  });

  // Favorite button
  document.getElementById('favoriteBtn')?.addEventListener('click', async () => {
    try {
      const res = await toggleFavorite(medicineId);
      showToast(res.message || 'Updated favorites! ❤️', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update favorites', 'error');
    }
  });

  // Share button
  document.getElementById('shareBtn')?.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: medicine.medicineName,
        text: `Check out this medicine info: ${medicine.medicineName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  });

  renderMedicine(medicine);
}

function renderMedicine(med) {
  // Update header names
  const medName = med.medicineName || med.name || 'Unknown Medicine';
  
  const artNameEl = document.getElementById('artMedicineName');
  if (artNameEl) artNameEl.textContent = medName;
  
  const mainNameEl = document.getElementById('medicineNameEthereal');
  if (mainNameEl) mainNameEl.textContent = medName;

  const genericEl = document.getElementById('medicineGenericEthereal');
  if (genericEl) genericEl.textContent = med.genericName || '';
  
  // Load Image
  const imgEl = document.getElementById('uploadedMedicineImage');
  if (imgEl && med.imageUrl) {
    imgEl.src = med.imageUrl;
    imgEl.style.display = 'block';
  }

  document.title = `${medName} — MedX`;

  // Badges
  const badgesContainer = document.getElementById('etherealBadges');
  if (badgesContainer) {
    badgesContainer.innerHTML = '';
    if (med.category) {
      badgesContainer.innerHTML += `<div class="ethereal-badge primary">${med.category}</div>`;
    }
    badgesContainer.innerHTML += `<div class="ethereal-badge secondary">MEDICAL AI SCAN</div>`;
  }

  // Price
  const priceEl = document.getElementById('priceValue');
  if (priceEl) {
    priceEl.innerHTML = (med.approximatePrice && med.approximatePrice !== "") ? 
      `${med.approximatePrice} <span>/ Est. Value</span>` : 'N/A';
  }

  // Uses
  const usesList = document.getElementById('usesList');
  if (usesList) {
    usesList.innerHTML = (med.uses && med.uses.length > 0) ? 
      med.uses.map(use => `
        <div class="ethereal-use-item">
          <div class="ethereal-use-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
          ${use}
        </div>`).join('') : '<div class="ethereal-use-item">Information not available</div>';
  }

  // Dosage
  const dosageEl = document.getElementById('dosageText');
  if (dosageEl) {
    dosageEl.textContent = med.dosage || 'Dosage information not available from the scan. Consult a doctor.';
  }

  // Warnings (Nested inner cards)
  const warningsGrid = document.getElementById('warningsGrid');
  if (warningsGrid) {
    warningsGrid.innerHTML = (med.warnings && med.warnings.length > 0) ?
      med.warnings.map(warning => {
        // Try to separate title from description if it contains a colon
        let title = "CLINICAL WARNING";
        let desc = warning;
        if (warning.includes(':')) {
           const parts = warning.split(':');
           title = parts[0];
           desc = parts.slice(1).join(':').trim();
        }
        return `
        <div class="ethereal-inner-warning-card">
          <div class="ethereal-inner-warning-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <strong>${title}</strong>
          </div>
          <div class="ethereal-inner-warning-desc">${desc}</div>
        </div>`;
      }).join('') : '<div class="ethereal-inner-warning-desc">No severe warnings noted.</div>';
  }

  // Side Effects (Emoji pills)
  const emojis = ['🤢', '🤕', '🥱', '🤒', '😵', '🌡️', '⚠️', '💦'];
  const sideEffectsPills = document.getElementById('sideEffectsPills');
  if (sideEffectsPills) {
    sideEffectsPills.innerHTML = (med.sideEffects && med.sideEffects.length > 0) ?
      med.sideEffects.map((effect, i) => `
        <div class="ethereal-pill">
          ${emojis[i % emojis.length]} ${effect}
        </div>
      `).join('') : '<div class="ethereal-pill">None commonly reported</div>';
  }

  // Ingredients
  const ingredientsEl = document.getElementById('ingredientsText');
  if (ingredientsEl) {
    ingredientsEl.textContent = (med.activeIngredients && med.activeIngredients.length > 0) ?
      med.activeIngredients.join(', ') : 'Not specified';
  }

  // Precautions (Dot pills)
  const precautionsPills = document.getElementById('precautionsPills');
  if (precautionsPills) {
    precautionsPills.innerHTML = (med.precautions && med.precautions.length > 0) ?
      med.precautions.map(prec => `
        <div class="ethereal-precaution-pill">
          <div class="ethereal-precaution-dot"></div>
          ${prec}
        </div>
      `).join('') : '<div class="ethereal-text">No specific precautions logged.</div>';
  }

  // Warning Banner Logic (from previous version, ensuring it still runs if it exists)
  const warningBanner = document.getElementById('severeWarningBanner');
  const warningText = document.getElementById('severeWarningText');
  if (med.warnings && med.warnings.length > 0) {
    const hasCritical = med.warnings.some(w => /severe|fatal|critical|black box|life-threatening|stroke|heart attack/i.test(w));
    if (hasCritical && warningBanner && warningText) {
      warningBanner.style.display = 'flex';
      warningText.textContent = "This medicine carries severe or critical warnings. Please strictly follow your physician's guidance and read the warnings section below.";
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
