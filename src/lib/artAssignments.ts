// Hardcoded mapping of image base filenames (without extension) to theme arrays.
// Example:
//   'Noster_a_city_landscape': ['Cyberpunk', 'Neon'],
//   'art25_something': ['Surreal']
// The theme names should match those in desiredThemes (case-insensitive; will be canonicalized).
import { desiredThemes as ART_THEMES } from './artThemes';

export const ART_ASSIGNMENTS: Record<string, string[]> = {
  // Mapping provided by user (themes canonicalized at runtime)
  'Noster_JohnWick_charcoal': ['Feelings'],
  'Noster_a_city_landscape': ['Surreal'],
  'Noster_a_drawn_picture_of_keanu': ['Neon'],
  'Noster_alice': ['Surreal'],
  'Noster_kanekis_mask': ['Cyberpunk'],
  'Noster_steampunk_cyberpunk_neon': ['Cyberpunk', 'Neon'],
  'alice_in_wonder': ['Surreal'],
  'cyberpunk1': ['Neon', 'Cyberpunk'],
  'cyborg': ['Cyberpunk'],
  'john_wick': ['Neon', 'Feelings'],
  'kanekis_mask': ['Cyberpunk'],
  'loner': ['Feelings'],
  'lone_cyborg': ['Neon', 'Feelings', 'Cyberpunk'],
  'lone_figure': ['Feelings'],
  'no5ter_Japanese': ['Paintings'],
  'no5ter_Japanese_painting': ['Paintings'],
  'no5ter_Japanese_painting1': ['Paintings'],
  'no5ter_Japanese_sakura_tree_4': ['Paintings'],
  'no5ter_abstract_traditional': ['Paintings'],
  'no5ter_a_surreal_and_abstract': ['Paintings'],
  'no5ter_deep_space': ['Surreal'],
  'no5ter_dreamlike_Alice': ['Surreal'],
  'no5ter_expressionist_sakura_tree_0': ['Paintings'],
  'no5ter_expressionist_sakura_tree_1': ['Paintings'],
  'no5ter_expressionist_sakura_tree_2': ['Paintings'],
  'no5ter_expressionist_sakura_tree_3': ['Paintings'],
  'no5ter_more_neon_colours': ['Neon'],
  'no5ter_neon_colours': ['Neon'],
  'no5ter_surreal_Alice': ['Surreal'],
  'no5ter_surreal_Alice_in': ['Surreal'],
  'post_apocalyptic_cyberpunk': ['Neon', 'Cyberpunk', 'Feelings'],
  'universe': ['Surreal', 'Feelings'],
  'vast_open_world': ['Feelings'],
};

// Helper: get themes for a base name, canonicalized to configured theme casing.
export function getThemesForBase(base: string): string[] {
  if (!base) return [];
  const lcBase = base.toLowerCase();
  // Case-insensitive lookup over provided keys
  let raw: string[] | undefined;
  for (const k of Object.keys(ART_ASSIGNMENTS)) {
    if (k.toLowerCase() === lcBase) { raw = ART_ASSIGNMENTS[k]; break; }
  }
  const arr = Array.isArray(raw) ? raw : [];
  const canon = (n: string) => {
    const low = String(n).toLowerCase();
    const hit = (ART_THEMES as unknown as string[]).find((t) => t.toLowerCase() === low);
    return hit || String(n);
  };
  return Array.from(new Set(arr.map(canon)));
}
