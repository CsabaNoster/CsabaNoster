import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
  const res = new Response(JSON.stringify({ success: true }), { status: 200 });
  res.headers.set('Set-Cookie', 'auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
  return res;
};
