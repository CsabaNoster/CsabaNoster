import type { APIRoute } from 'astro';
import { verifyToken } from '../../../../src/lib/auth';
import { readFileSync, statSync } from 'fs';
import { resolve, join } from 'path';

function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) return {};
  return Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('=').map(decodeURIComponent)));
}

export const GET: APIRoute = async ({ params, request }) => {
  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies['auth'];
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  try {
    verifyToken(token);
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const splat = (params as any).path as string[] | undefined;
  if (!splat || !splat.length) return new Response('Not found', { status: 404 });

  // Prevent path traversal by removing any ".." segments
  const safePath = splat.join('/').replace(/(^|\/)(?:\.\.)($|\/)/g, '');
  const publicDir = resolve('./public', 'downloads');
  const filePath = resolve(publicDir, safePath);
  if (!filePath.startsWith(publicDir)) {
    return new Response('Forbidden', { status: 403 });
  }
  try {
  const stats = statSync(filePath);
  if (!stats.isFile()) return new Response('Not found', { status: 404 });
  const data = readFileSync(filePath);
  const headers = new Headers();
  headers.set('Content-Length', String(stats.size));
  headers.set('Content-Type', 'application/octet-stream');
  headers.set('Content-Disposition', `attachment; filename="${filePath.split(/[\\/]/).pop()}"`);
  return new Response(data, { status: 200, headers });
  } catch (err) {
    return new Response('Not found', { status: 404 });
  }
};
