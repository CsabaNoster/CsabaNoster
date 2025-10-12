import type { APIRoute } from 'astro';

// Editing via API is no longer supported; mappings are hardcoded.
export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({ error: 'Mapping edits are disabled. Use src/lib/artAssignments.ts.' }), { status: 410, headers: { 'Content-Type': 'application/json' } });
};
