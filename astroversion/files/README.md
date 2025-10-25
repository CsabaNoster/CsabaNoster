# Watch 2.0 – Website Content Pack

This pack gives you **prompts** and **upload-ready content files** (Markdown, JSON, XML) so you can build the site in VS Code using Copilot or your own static site tooling. No UI code is included here—just structured content and instructions.

## Folders
- `prompts/` – Copy/paste prompts for Copilot (or any LLM agent) to generate your actual pages/components.
- `content/` – Markdown/YAML with the project’s narrative, specs, BOM, wiring notes, etc.
- `site/` – SEO/supporting files (sitemap, robots, metadata) and a composed `index.md` you can render to HTML.
- `assets/` – Put your photos and diagrams here. Includes a checklist to keep filenames/captions tidy.

## How to use
1. Open VS Code in this folder.
2. Add your images to `assets/`. Keep the filenames listed in `assets/PLACEHOLDERS.txt` or update `content/gallery.yml` accordingly.
3. Use the prompts in `prompts/` to have Copilot generate a single-file HTML page, a Next.js/React page, or a static site (choose your stack).
4. Replace placeholder links in `content/downloads.md` once your files are hosted.
5. Export the generated site to your webhost or GitHub Pages.

— Generated 2025-10-12
