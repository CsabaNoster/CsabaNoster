import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

function sanitizeName(name: string): string {
  // keep letters, numbers, spaces, dashes, underscores; collapse others to dash
  const base = name.replace(/\.[^.]+$/, '');
  const clean = base.replace(/[^a-zA-Z0-9 _-]+/g, '-').replace(/\s+/g, '_').replace(/-+/g, '-').replace(/_+/g, '_');
  return clean.replace(/^[-_]+|[-_]+$/g, '') || 'image';
}

export const POST: APIRoute = async ({ request }) => {
  if (process.env.NODE_ENV === 'production') {
    return new Response(JSON.stringify({ error: 'Uploads disabled in production' }), { status: 403 });
  }
  try {
    const form = await request.formData();
    const entries = form.getAll('files');
    if (!entries || !entries.length) {
      return new Response(JSON.stringify({ error: 'No files provided' }), { status: 400 });
    }
    const artDir = path.join(process.cwd(), 'public', 'uploads', 'art');
    fs.mkdirSync(artDir, { recursive: true });
    const saved: Array<{ filename: string; base: string; src: string }> = [];
    for (const entry of entries) {
      if (typeof entry === 'object' && 'arrayBuffer' in entry) {
        const file = entry as File;
        const origName = file.name || 'image';
        const extMatch = origName.match(/\.[^.]+$/);
        const ext = extMatch ? extMatch[0].toLowerCase() : '.png';
        const base = sanitizeName(origName);
        // ensure unique filename
        let candidate = base + ext;
        let i = 1;
        while (fs.existsSync(path.join(artDir, candidate))) {
          candidate = `${base}-${i}${ext}`;
          i++;
        }
        const buf = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(artDir, candidate), buf);
        saved.push({ filename: candidate, base: candidate.replace(/\.[^.]+$/, ''), src: `/uploads/art/${candidate}` });
      }
    }
    return new Response(JSON.stringify({ ok: true, saved }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Upload failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
