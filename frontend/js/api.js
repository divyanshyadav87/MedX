// ===========================
// API.JS — Backend API Service Layer
// Central module for all backend communication
// ===========================

export const BASE_URL = 'https://cureeye.onrender.com';
export const API_BASE = `${BASE_URL}/api`;

// ---- Token Management ----
export function getToken() {
  return localStorage.getItem('CureEye_token');
}

export function setToken(token) {
  localStorage.setItem('CureEye_token', token);
}

export function clearToken() {
  localStorage.removeItem('CureEye_token');
}

// ---- Generic Fetch Helper ----
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  // Add auth header if token exists (don't set Content-Type for FormData)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON bodies (not FormData)
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  // Handle 401 (expired/invalid token)
  if (res.status === 401) {
    clearToken();
    localStorage.removeItem('CureEye_user');
    // Don't redirect if already on auth pages
    if (!window.location.pathname.includes('login') && !window.location.pathname.includes('signup')) {
      window.location.href = '/login.html';
    }
    throw new Error(data.message || 'Session expired. Please log in again.');
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

// ============================================================
// AUTH API
// ============================================================

export async function registerUser(name, email, password) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  // Save token and user info
  setToken(data.data.token);
  localStorage.setItem('CureEye_user', JSON.stringify(data.data.user));
  return data;
}

export async function loginUser(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  // Save token and user info
  setToken(data.data.token);
  localStorage.setItem('CureEye_user', JSON.stringify(data.data.user));
  return data;
}

export async function getCurrentUser() {
  return apiFetch('/auth/me');
}

// ============================================================
// MEDICINE API
// ============================================================

export async function identifyMedicine(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  return apiFetch('/medicines/identify', {
    method: 'POST',
    body: formData,
  });
}

export async function searchMedicine(name) {
  return apiFetch(`/medicines/search?name=${encodeURIComponent(name)}`);
}

export async function getMedicineById(id) {
  return apiFetch(`/medicines/${id}`);
}

// ============================================================
// USER API (History & Favorites)
// ============================================================

export async function getUserHistory(page = 1, limit = 20) {
  return apiFetch(`/user/history?page=${page}&limit=${limit}`);
}

export async function toggleFavorite(medicineId) {
  return apiFetch(`/medicines/${medicineId}/favorite`, {
    method: 'POST',
  });
}

export async function getUserFavorites(page = 1, limit = 20) {
  return apiFetch(`/user/favorites?page=${page}&limit=${limit}`);
}

export async function deleteHistoryEntry(id) {
  return apiFetch(`/user/history/${id}`, {
    method: 'DELETE',
  });
}
