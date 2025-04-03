// src/api/base44Client.js
// Mock implementation - no actual Base44 SDK usage

export function fetchWithAuth(url, options = {}) {
  // Return mock data for any request
  return Promise.resolve({
    ok: true,
    json: async () => ({ data: [] })
  });
}

export function isAuthenticated() {
  return true;
}

// Mock Base44 SDK initialization
export function initBase44() {
  return {
    auth: {
      isAuthenticated: () => true,
      getToken: () => 'mock-token',
      login: () => Promise.resolve({ authenticated: true }),
      logout: () => Promise.resolve()
    },
    entities: {
      get: async () => ({ data: [] }),
      create: async (data) => ({ success: true, data }),
      update: async (data) => ({ success: true, data }),
      delete: async (id) => ({ success: true })
    },
    integrations: {
      Core: {
        SendEmail: async () => ({ success: true }),
        InvokeLLM: async () => ({ success: true }),
        SendSMS: async () => ({ success: true })
      }
    }
  };
}
