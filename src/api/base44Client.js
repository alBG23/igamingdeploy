// src/api/base44Client.js

// Stub version that avoids redirect or real auth logic
export function fetchWithAuth(url, options = {}) {
  console.log("[Stub] fetchWithAuth called:", url);
  return Promise.resolve({
    ok: true,
    json: async () => ({ data: "stub" })
  });
}

export function isAuthenticated() {
  return true;
}
