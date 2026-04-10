// src/api/base44Client.js
// Real Base44 API client using the official SDK with service role (api_key)

import { createClient } from "@base44/sdk";

const _client = createClient({
  appId: import.meta.env.VITE_BASE44_APP_ID,
  serviceToken: import.meta.env.VITE_BASE44_API_KEY,
  requiresAuth: false,
});

// Expose the service role interface as the main interface
// so the rest of the app doesn't need to change
export const base44 = {
  auth: {
    me: async () => ({
      id: 'admin',
      email: 'admin@bizbot.app',
      full_name: 'Admin',
      role: 'admin',
    }),
    logout: () => {},
    redirectToLogin: () => {},
  },
  entities: _client.asServiceRole.entities,
  integrations: _client.asServiceRole.integrations,
};
