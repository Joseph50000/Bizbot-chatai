// src/api/base44Client.js
// Real Base44 API client using the official SDK with service role (api_key)

import { createClient } from "@base44/sdk";

const APP_ID = import.meta.env.VITE_BASE44_APP_ID;
const API_KEY = import.meta.env.VITE_BASE44_API_KEY;

if (!APP_ID || !API_KEY) {
  console.error(
    "[BizBot] Missing environment variables: VITE_BASE44_APP_ID and/or VITE_BASE44_API_KEY. " +
    "Make sure they are set in Vercel → Settings → Environment Variables."
  );
}

const _client = createClient({
  appId: APP_ID ?? "missing-app-id",
  serviceToken: API_KEY ?? "missing-api-key",
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
