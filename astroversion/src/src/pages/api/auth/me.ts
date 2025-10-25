import type { APIRoute } from 'astro';
import { verifyToken } from '../../../lib/auth';

function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) return {};
  return Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('=')));
}

export const GET: APIRoute = async ({ request }) => {
  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies.auth;
  if (!token) return new Response(JSON.stringify({ authenticated: false }), { status: 200 });
  try {
    const payload = verifyToken(token) as any;
    return new Response(JSON.stringify({ authenticated: true, user: { username: payload.username } }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ authenticated: false }), { status: 200 });
  }
};
