import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL;
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

if (!baseUrl) {
    throw new Error('Missing VITE_INSFORGE_BASE_URL (check forsa-web/.env or forsa-web/.env.local)');
}

if (!anonKey) {
    throw new Error('Missing VITE_INSFORGE_ANON_KEY (check forsa-web/.env or forsa-web/.env.local)');
}

export const insforge = createClient({ baseUrl, anonKey });

// Backwards-compatible alias (some codebases expect Supabase-like `client.db`).
insforge.db = insforge.database;
