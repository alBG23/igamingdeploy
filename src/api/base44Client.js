// src/api/base44Client.js

export function fetchWithAuth(url, options = {}) {
  return fetch(url, options);
}

export function isAuthenticated() {
  return true;
}
