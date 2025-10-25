// Shared theme utilities for Art gallery
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const desiredThemes = ['Cyberpunk', 'Paintings', 'Surreal', 'Neon', 'Feelings'] as const;
export type ThemeName = typeof desiredThemes[number] | string;

// Normalize a filename base to a compact key: lowercase, remove non-alphanumerics
export const mapKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Manual theme assignments by basename (case/space-insensitive). Do not include extensions.
export const themeMap: Record<string, string[]> = {
  // Cyberpunk
  [mapKey('art02')]: ['Cyberpunk','Neon'],
  [mapKey('art03')]: ['Cyberpunk'],
  [mapKey('art06')]: ['Cyberpunk','Neon'],
  [mapKey('art29')]: ['Cyberpunk','Surreal'],
  [mapKey('art30')]: ['Cyberpunk','Neon'],
  [mapKey('art31')]: ['Cyberpunk','Neon'],
  // Neon additions
  [mapKey('art04')]: ['Neon','Feelings'],
  [mapKey('art21')]: ['Neon'],
  [mapKey('art22')]: ['Neon'],
  [mapKey('art26')]: ['Neon'],
  // Surreal
  [mapKey('art01')]: ['Surreal'],
  [mapKey('art11')]: ['Surreal'],
  [mapKey('art12')]: ['Surreal'],
  [mapKey('art23')]: ['Surreal'],
  [mapKey('art24')]: ['Surreal'],
  [mapKey('art25')]: ['Surreal'],
  [mapKey('art27')]: ['Surreal'],
  [mapKey('art32')]: ['Surreal','Feelings'],
  // Paintings
  [mapKey('art09')]: ['Paintings'],
  [mapKey('art10')]: ['Paintings'],
  [mapKey('art13')]: ['Paintings'],
  [mapKey('art14')]: ['Paintings'],
  [mapKey('art15')]: ['Paintings'],
  [mapKey('art16')]: ['Paintings'],
  [mapKey('art17')]: ['Paintings'],
  [mapKey('art18')]: ['Paintings','Feelings'],
  [mapKey('art19')]: ['Paintings'],
  [mapKey('art20')]: ['Paintings'],
  // Feelings
  [mapKey('art07')]: ['Feelings'],
  [mapKey('art08')]: ['Feelings'],
  [mapKey('art33')]: ['Feelings'],
};

// Heuristic keyword-based inference for themes from a filename base.
export function inferThemes(baseName: string): string[] {
  const src = baseName.toLowerCase();
  const has = (w: string | RegExp) => (typeof w === 'string' ? src.includes(w) : w.test(src));

  const out = new Set<string>();
  // Cyberpunk cues
  if (has('cyberpunk') || has('cyborg') || has('kaneki') || has('mask') || has('post_apocalyptic') || has('steampunk')) {
    out.add('Cyberpunk');
  }
  // Neon cues
  if (has('neon') || has('glow')) {
    out.add('Neon');
  }
  // Surreal cues
  if (has('surreal') || has('dream') || has('dreamlike') || has('alice') || has('deep_space') || has('universe') || has('vast_open_world')) {
    out.add('Surreal');
  }
  // Paintings cues
  if (has('painting') || has('paint') || has('charcoal') || has('drawn') || has('expressionist') || has('sakura') || has('japanese')) {
    out.add('Paintings');
  }
  // Feelings cues
  if (has('feelings') || has('loner') || has('lone') || has('abstract') || has('emotion')) {
    out.add('Feelings');
  }
  return Array.from(out);
}

// Load user-provided JSON mapping from public/uploads/art/themes.json (build-time)
export function loadUserThemeMap(): Record<string, string[]> {
  try {
    // Prefer cwd-based path in dev/preview
    let themesPath = path.join(process.cwd(), 'public', 'uploads', 'art', 'themes.json');
    if (!fs.existsSync(themesPath)) {
      // Fallback relative to this file
      const url = new URL('../../public/uploads/art/themes.json', import.meta.url);
      themesPath = fileURLToPath(url);
    }
    if (!fs.existsSync(themesPath)) return {};
    const raw = fs.readFileSync(themesPath, 'utf-8');
    const data = JSON.parse(raw);
    const out: Record<string, string[]> = {};
    for (const k of Object.keys(data || {})) {
      const key = mapKey(k);
      const arr = Array.isArray((data as any)[k]) ? (data as any)[k] : [];
      out[key] = arr as string[];
      // Also populate a numeric artNN key if the original starts with artNN or NN- so numbered images match
      const m1 = key.match(/^art([0-9]{1,3})(?![0-9])/i);
      const m2 = m1 ? null : key.match(/^([0-9]{1,3})(?![0-9])/);
      const m = m1 || m2;
      if (m && m[1]) {
        const n = parseInt(m[1], 10);
        if (!isNaN(n)) {
          const numKey = mapKey(`art${String(n)}`);
          if (!(numKey in out)) {
            out[numKey] = arr as string[];
          }
        }
      }
    }
    return out;
  } catch {
    return {};
  }
}

// Load user-provided titles mapping from public/uploads/art/titles.json
export function loadUserTitlesMap(): Record<string, string> {
  try {
    let titlesPath = path.join(process.cwd(), 'public', 'uploads', 'art', 'titles.json');
    if (!fs.existsSync(titlesPath)) {
      const url = new URL('../../public/uploads/art/titles.json', import.meta.url);
      titlesPath = fileURLToPath(url);
    }
    if (!fs.existsSync(titlesPath)) return {};
    const raw = fs.readFileSync(titlesPath, 'utf-8');
    const data = JSON.parse(raw);
    const out: Record<string, string> = {};
    for (const k of Object.keys(data || {})) {
      out[mapKey(k)] = String((data as any)[k] ?? '').trim();
    }
    return out;
  } catch {
    return {};
  }
}
