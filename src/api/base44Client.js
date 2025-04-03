// src/api/base44Client.js
// Bypass Base44 authentication for Vercel deployment

// Override Base44 SDK authentication
export function fetchWithAuth(url, options = {}) {
  // If the URL is the Base44 login URL, return a mock response
  if (url.includes('base44.app/login')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({ authenticated: true })
    });
  }
  return fetch(url, options);
}

export function isAuthenticated() {
  return true;
}

// Override Base44 SDK initialization
export function initBase44() {
  return {
    auth: {
      isAuthenticated: () => true,
      getToken: () => 'mock-token',
      login: () => Promise.resolve({ authenticated: true }),
      logout: () => Promise.resolve()
    },
    entities: {
      // Add your entity definitions here
    }
  };
}
