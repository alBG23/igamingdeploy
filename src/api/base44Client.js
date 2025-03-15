import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "67cdeacbe19d3e85f6c3b3fd", 
  requiresAuth: true // Ensure authentication is required for all operations
});
