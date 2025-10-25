import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

function slugify(title: string): string {
  const s = (title || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'untitled';
}

export const POST: APIRoute = async ({ request }) => {
  if (process.env.NODE_ENV === 'production') {
    return new Response(JSON.stringify({ error: 'Disabled in production' }), { status: 403 });
  }
  try {
    let body: any = null;
    try { body = await request.json(); } catch { body = JSON.parse(await request.text() || '{}'); }
    const items: Array<{ src: string; title: string }> = Array.isArray(body?.items) ? body.items : [];
    if (!items.length) {
      return new Response(JSON.stringify({ ok: false, error: 'No items provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const publicDir = path.join(process.cwd(), 'public');
    const results: Array<{ from: string; to?: string; error?: string }> = [];

    for (const it of items) {
      try {
        const webSrc = decodeURIComponent(String(it.src || ''));
        if (!webSrc.startsWith('/uploads/art/')) {
          results.push({ from: webSrc, error: 'Unsupported path' });
          continue;
        }
        const abs = path.join(publicDir, webSrc.replace(/^\//, ''));
        if (!fs.existsSync(abs)) {
          results.push({ from: webSrc, error: 'File not found' });
          continue;
        }
        const dir = path.dirname(abs);
        const ext = path.extname(abs);
        const base = path.basename(abs, ext);
        const titleSlug = slugify(String(it.title || ''));
        const m = base.match(/art[ _-]*([0-9]{1,3})/i);
        const n = m ? parseInt(m[1], 10) : NaN;
        const prefix = !isNaN(n) ? `art${String(n)}-` : '';
        let newBase = `${prefix}${titleSlug}`;
        let candidate = `${newBase}${ext}`;
        let target = path.join(dir, candidate);
        let suffix = 1;
        while (fs.existsSync(target) && path.resolve(target) !== path.resolve(abs)) {
          candidate = `${newBase}-${suffix}${ext}`;
          target = path.join(dir, candidate);
          suffix++;
        }
        if (path.resolve(target) !== path.resolve(abs)) {
          fs.renameSync(abs, target);
        }
        const newWeb = path.join(path.dirname(webSrc), candidate).replace(/\\/g, '/');
        results.push({ from: webSrc, to: newWeb });
      } catch (e: any) {
        results.push({ from: String((it && it.src) || ''), error: e?.message || 'Rename failed' });
      }
    }

    return new Response(JSON.stringify({ ok: true, results }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
};
