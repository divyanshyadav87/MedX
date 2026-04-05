// ===========================
// AUTH.JS — Login & Signup
// Connected to real backend API
// ===========================
import { setUser, showToast } from './main.js';
import { loginUser, registerUser } from './api.js';

// ---- Password Toggle ----
function initPasswordToggles() {
  const toggles = [
    { btn: 'toggleLoginPassword', input: 'loginPassword' },
    { btn: 'toggleSignupPassword', input: 'signupPassword' },
  ];

  toggles.forEach(({ btn, input }) => {
    const toggleBtn = document.getElementById(btn);
    const inputEl = document.getElementById(input);
    if (!toggleBtn || !inputEl) return;

    const eyeOpen = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    const eyeClosed = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

    toggleBtn.addEventListener('click', () => {
      const isPassword = inputEl.type === 'password';
      inputEl.type = isPassword ? 'text' : 'password';
      toggleBtn.innerHTML = isPassword ? eyeClosed : eyeOpen;
    });
  });
}

// ---- Password Strength ----
function initPasswordStrength() {
  const passwordInput = document.getElementById('signupPassword');
  const strengthBars = document.querySelectorAll('.strength-bar');
  if (!passwordInput || !strengthBars.length) return;

  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let strength = 0;

    if (val.length >= 6) strength++;
    if (val.length >= 10) strength++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength++;
    if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) strength++;

    strengthBars.forEach((bar, i) => {
      bar.classList.remove('active', 'weak', 'medium', 'strong');
      if (i < strength) {
        bar.classList.add('active');
        if (strength <= 1) bar.classList.add('weak');
        else if (strength <= 2) bar.classList.add('medium');
        else bar.classList.add('strong');
      }
    });
  });
}

// ---- Login Form ----
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Clear errors
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    let hasError = false;

    if (!email || !email.includes('@')) {
      showFieldError('loginEmail', 'Please enter a valid email');
      hasError = true;
    }

    if (!password || password.length < 4) {
      showFieldError('loginPassword', 'Password is required');
      hasError = true;
    }

    if (hasError) return;

    // Call real backend API
    const btn = document.getElementById('loginSubmitBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div> Signing in...';
    btn.disabled = true;

    try {
      const response = await loginUser(email, password);
      showToast('Welcome back! 🎉', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 800);
    } catch (error) {
      showToast(error.message || 'Login failed. Please try again.', 'error');
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}

// ---- Signup Form ----
function initSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName')?.value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    // Clear errors
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    let hasError = false;

    if (!name) {
      showFieldError('signupName', 'Name is required');
      hasError = true;
    }

    if (!email || !email.includes('@')) {
      showFieldError('signupEmail', 'Please enter a valid email');
      hasError = true;
    }

    if (!password || password.length < 6) {
      showFieldError('signupPassword', 'Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    // Call real backend API
    const btn = document.getElementById('signupSubmitBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div> Creating account...';
    btn.disabled = true;

    try {
      const response = await registerUser(name, email, password);
      showToast('Account created successfully! 🎉', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 800);
    } catch (error) {
      showToast(error.message || 'Registration failed. Please try again.', 'error');
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}

// ---- Social Login (placeholder) ----
function initSocialLogin() {
  document.querySelectorAll('#googleLoginBtn, #googleSignupBtn').forEach(btn => {
    btn?.addEventListener('click', () => {
      showToast('Google login coming soon!', 'info');
    });
  });
}

// ---- Helper ----
function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.classList.add('input-error');
  const error = document.createElement('div');
  error.className = 'error-message';
  error.textContent = message;
  input.closest('.input-group').appendChild(error);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initPasswordStrength();
  initLoginForm();
  initSignupForm();
  initSocialLogin();
});
