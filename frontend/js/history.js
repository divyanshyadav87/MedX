// ===========================
// HISTORY.JS — Scan History Page
// Connected to real backend API
// ===========================
import { requireAuth, showToast } from './main.js';
import { getUserHistory } from './api.js';

async function init() {
  const user = requireAuth();
  if (!user) return;

  const historyList = document.getElementById('historyList');
  const historyEmpty = document.getElementById('historyEmpty');
  const searchInput = document.getElementById('searchInput');

  let allHistory = [];

  // Load history from backend
  try {
    const response = await getUserHistory(1, 100);
    allHistory = response.data || [];
  } catch (error) {
    showToast('Failed to load history', 'error');
    allHistory = [];
  }

  function renderHistory(filter = '') {
    const filtered = filter
      ? allHistory.filter(s =>
          s.medicineName.toLowerCase().includes(filter.toLowerCase()) ||
          (s.medicineDetails?.category && s.medicineDetails.category.toLowerCase().includes(filter.toLowerCase()))
        )
      : allHistory;

    historyList.innerHTML = '';

    if (filtered.length === 0) {
      historyList.style.display = 'none';
      historyEmpty.style.display = '';

      if (filter && allHistory.length > 0) {
        historyEmpty.querySelector('h3').textContent = 'No results found';
        historyEmpty.querySelector('p').textContent = `No medicines matching "${filter}"`;
      } else {
        historyEmpty.querySelector('h3').textContent = 'No scans yet';
        historyEmpty.querySelector('p').textContent = 'Start by scanning your first medicine';
      }
      return;
    }

    historyList.style.display = '';
    historyEmpty.style.display = 'none';

    filtered.forEach((entry, index) => {
      const item = document.createElement('div');
      item.className = 'history-item glass-card';
      item.style.animationDelay = `${index * 0.05}s`;
      item.style.animation = 'fadeInUp 0.4s ease forwards';

      const dateStr = new Date(entry.uploadedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      // Build tags from medicine details
      const tags = [];
      if (entry.medicineDetails?.category) tags.push(entry.medicineDetails.category);
      if (entry.medicineDetails?.dosageForm) tags.push(entry.medicineDetails.dosageForm);
      if (entry.isFavorite) tags.push('⭐ Favorite');

      const tagsHTML = tags
        .map(tag => `<span class="history-tag">${tag}</span>`)
        .join('');

      item.innerHTML = `
        <div class="history-item-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18.5 5.5-12 12"/><path d="M15.5 5.5a3 3 0 1 1 3 3"/><path d="M8.5 18.5a3 3 0 1 1-3-3"/></svg>
        </div>
        <div class="history-item-info">
          <h3>${entry.medicineName}</h3>
          <div class="history-item-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${dateStr}
          </div>
        </div>
        <div class="history-item-tags">${tagsHTML}</div>
      `;

      // Navigate to results page using the medicine's MongoDB ID
      item.addEventListener('click', () => {
        const medId = entry.medicineId;
        if (medId) {
          window.location.href = `/results.html?id=${medId}`;
        }
      });

      historyList.appendChild(item);
    });
  }

  // Search
  searchInput?.addEventListener('input', () => {
    renderHistory(searchInput.value);
  });

  renderHistory();
}

document.addEventListener('DOMContentLoaded', init);
