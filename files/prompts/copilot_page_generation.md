# Prompt: Build a single-file project page from provided content
You are VS Code Copilot acting as an expert frontend developer and technical editor.
Goal: Generate a **single HTML file** (no external frameworks) that renders the Watch 2.0 project page using the content files in `content/` and the meta in `site/meta.json`.

## Requirements
- Responsive layout, clean aesthetic akin to a dieselpunk palette (dark, warm accents).
- Sections in this order: hero, overview, gallery, features, specs, BOM, wiring, firmware, build notes, downloads, changelog, license.
- Lightbox for the gallery (vanilla JS; under 40 lines).
- Add Open Graph/Twitter meta using `site/meta.json` and the hero image path in `content/gallery.yml` (first image marked `hero: true`).
- Include JSON-LD schema (`Project`) using fields from `site/meta.json`.
- No external CSS/JS; write a `<style>` and a small `<script>` inside the HTML.
- Accessibility: semantic headings, `alt` text from `content/gallery.yml`, high contrast, focusable lightbox close.
- Create a sticky “Download files” button linking to anchors in the downloads section.

## Inputs
- `content/*.md` and `content/gallery.yml`
- `site/meta.json`

## Output
- Create `dist/index.html` in-memory and show full code.
- After the code, list any missing image files.

## Style cues
- Use CSS Grid/Flex; rounded cards; subtle borders; max width 1120px; system-ui fonts.
- Keep the JS tiny and dependency-free.
