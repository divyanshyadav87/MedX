// ===========================
// HOME.JS — Homepage-specific JS
// ===========================
import { showToast } from './main.js';

// ---- Stats Counter ----
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let counted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach(el => animateCounter(el));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

    const current = eased * target;

    if (isDecimal) {
      el.textContent = current.toFixed(1) + suffix;
    } else {
      const formatted = Math.floor(current).toLocaleString();
      el.textContent = formatted + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ---- FAQ Accordion ----
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// ---- Interactive Demo ----
function initDemo() {
  const uploadArea = document.getElementById('demoUploadArea');
  const scanning = document.getElementById('demoScanning');
  const result = document.getElementById('demoResult');
  const browseBtn = document.getElementById('demoBrowseBtn');
  const sampleBtn = document.getElementById('demoSampleBtn');
  const fileInput = document.getElementById('demoFileInput');
  const resetBtn = document.getElementById('demoResetBtn');
  const heroDemoBtn = document.getElementById('heroDemoBtn');

  if (!uploadArea) return;

  // Sample medicines for demo
  const sampleMedicines = [
    {
      name: 'Dolo-650 Paracetamol Tablets IP',
      mfg: 'by Micro Labs Ltd. • Generic: Paracetamol',
      ingredients: 'Paracetamol (Acetaminophen) 650mg',
      uses: 'Pain relief, Fever reduction, Cold & Flu',
      sideEffects: 'Nausea, Stomach pain (rare)',
      dosage: '1 tablet every 4-6 hours as needed',
    },
    {
      name: 'Amoxicillin 500mg Capsules',
      mfg: 'by Cipla Ltd. • Generic: Amoxicillin',
      ingredients: 'Amoxicillin Trihydrate 500mg',
      uses: 'Bacterial infections, UTI, Ear infections',
      sideEffects: 'Diarrhea, Rash, Nausea',
      dosage: '1 capsule every 8 hours for 7-10 days',
    },
    {
      name: 'Aspirin 75mg Tablets',
      mfg: 'by Bayer • Generic: Acetylsalicylic Acid',
      ingredients: 'Acetylsalicylic Acid 75mg',
      uses: 'Blood thinning, Heart attack prevention',
      sideEffects: 'Stomach upset, Bleeding risk',
      dosage: '1 tablet daily with food',
    },
  ];

  function showScanning() {
    uploadArea.style.display = 'none';
    scanning.classList.add('active');
    result.classList.remove('active');

    setTimeout(() => {
      scanning.classList.remove('active');
      const med = sampleMedicines[Math.floor(Math.random() * sampleMedicines.length)];
      document.getElementById('demoMedName').textContent = med.name;
      document.getElementById('demoMedMfg').textContent = med.mfg;
      document.getElementById('demoIngredients').textContent = med.ingredients;
      document.getElementById('demoUses').textContent = med.uses;
      document.getElementById('demoSideEffects').textContent = med.sideEffects;
      document.getElementById('demoDosage').textContent = med.dosage;
      result.classList.add('active');
    }, 2500);
  }

  browseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  fileInput?.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      showScanning();
    }
  });

  sampleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showScanning();
  });

  heroDemoBtn?.addEventListener('click', () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => showScanning(), 800);
  });

  uploadArea?.addEventListener('click', () => fileInput.click());

  // Drag and drop
  uploadArea?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea?.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    showScanning();
  });

  resetBtn?.addEventListener('click', () => {
    result.classList.remove('active');
    uploadArea.style.display = '';
    fileInput.value = '';
  });
}

// ---- Smooth scroll for anchor links ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initStatsCounter();
  initFAQ();
  initDemo();
  initSmoothScroll();
});
