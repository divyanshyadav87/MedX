// ===========================
// MAIN.JS — Shared functionality
// Now integrated with backend API + i18n
// ===========================
import { getToken, clearToken } from './api.js';
import { initLanguageToggle, applyTranslations, t } from './i18n.js';
export { t, applyTranslations };

// ---- Auth State Management ----
export function getUser() {
  try {
    const user = localStorage.getItem('MedX_user');
    const token = getToken();
    // Both user data AND valid token must exist
    if (user && token) return JSON.parse(user);
    return null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem('MedX_user', JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem('MedX_user');
  clearToken();
}

export function requireAuth() {
  const user = getUser();
  if (!user) {
    window.location.href = '/login.html';
    return null;
  }
  return user;
}

// ---- Toast Notifications ----
export function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  };

  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ---- Mobile Menu ----
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('mobileNav');
  if (!btn || !overlay) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  overlay.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ---- Navbar Auth State ----
function initNavbarAuth() {
  const user = getUser();

  // Homepage has different nav structure
  const loggedOutActions = document.getElementById('loggedOutActions');
  const loggedInActions = document.getElementById('loggedInActions');
  const navDashboard = document.getElementById('navDashboard');
  const navHistory = document.getElementById('navHistory');
  const mobileNavDashboard = document.getElementById('mobileNavDashboard');
  const mobileNavHistory = document.getElementById('mobileNavHistory');
  const mobileLoggedOut = document.getElementById('mobileLoggedOut');
  const mobileLoggedIn = document.getElementById('mobileLoggedIn');

  if (user) {
    // Show logged in state
    if (loggedOutActions) loggedOutActions.style.display = 'none';
    if (loggedInActions) loggedInActions.style.display = 'flex';
    if (navDashboard) navDashboard.style.display = '';
    if (navHistory) navHistory.style.display = '';
    if (mobileNavDashboard) mobileNavDashboard.style.display = '';
    if (mobileNavHistory) mobileNavHistory.style.display = '';
    if (mobileLoggedOut) mobileLoggedOut.style.display = 'none';
    if (mobileLoggedIn) mobileLoggedIn.style.display = '';

    // Set email
    const emailEls = document.querySelectorAll('#userEmail, #mobileUserEmail');
    emailEls.forEach(el => { if(el) el.textContent = user.email; });
  }

  // Sign out buttons
  document.querySelectorAll('#signOutBtn, #mobileSignOutBtn').forEach(btn => {
    btn?.addEventListener('click', () => {
      clearUser();
      showToast('Signed out successfully', 'success');
      setTimeout(() => { window.location.href = '/'; }, 500);
    });
  });
}

// ---- Scroll Reveal ----
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ---- Particle Background ----
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 25000);
    for (let i = 0; i < Math.min(count, 60); i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.05,
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 58, 237, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.05 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

// ---- Navbar scroll effect ----
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.style.borderBottomColor = 'rgba(255,255,255,0.08)';
      navbar.style.background = 'rgba(10, 14, 26, 0.95)';
    } else {
      navbar.style.borderBottomColor = 'rgba(255,255,255,0.06)';
      navbar.style.background = 'rgba(10, 14, 26, 0.85)';
    }
    lastScroll = currentScroll;
  });
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  initLanguageToggle();
  applyTranslations();
  initMobileMenu();
  initNavbarAuth();
  initScrollReveal();
  initParticles();
  initNavbarScroll();
});
