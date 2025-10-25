# Copilot Instructions for `staticsite/`

This guide is for AI coding agents working on the static export of Noster's Lab, located in `staticsite/`. It summarizes the essential structure, conventions, and workflows for immediate productivity.

## Architecture & Structure
- **Flat HTML/CSS/JS site**: No build system; all files are static and must use relative paths.
- **Main pages**: `index.html`, `projects.html`, `art.html`, `reviews.html`, `thoughts.html`.
- **Section subpages**: Each project/art/review/thought detail is a separate HTML file in its section folder (e.g., `projects/watch-2-0.html`).
- **Assets**:
  - `img/`: UI textures, icons, theme images
  - `backgrounds/`: Theme backgrounds (e.g., `cyberpunk/`, `main/`, `steampunk/`)
  - `uploads/`: User-uploaded images, organized by section and slug (e.g., `uploads/projects/watch-2-0/`)
  - `downloads/`, `videos/`: Downloadable files and videos
  - `js/`: UI scripts (e.g., `lightbox.js`)
- **Content reference**: Markdown source in `content/` is for reference only, not rendered.

## Required Patterns & Conventions
- **Content window**: Every page and subpage must wrap main content in `<main class="content-window">` for consistent layout and theming.
- **Relative paths**: All asset/image references in HTML and CSS must use relative paths from the current file.
- **Theme backgrounds**: Set via CSS and a `<div id="bg-image">` or similar element. Add new backgrounds to the correct subfolder and update CSS if needed.
- **Adding a page**:
  1. Copy an existing page as a template.
  2. Place images in the matching `uploads/` subfolder.
  3. Use relative paths for all assets.
  4. Ensure `<main class="content-window">` wraps the main content.
  5. Update navigation links if needed.

## Example: Adding a Project Page
- Create `projects/my-new-project.html`.
- Place images in `uploads/projects/my-new-project/`.
- Use `<main class="content-window">` in the HTML.
- Reference images as `../uploads/projects/my-new-project/image.jpg`.

## Automation & Scripts
- For bulk copying or updates, use the `copy_static_site.ps1` script at the repo root (not in `staticsite/`).

## Gotchas
- Do not use absolute paths; always use relative paths for portability.
- Do not edit markdown in `content/` unless updating reference material.
- Duplicated files or folders (e.g., `img/img/`, `backgrounds/backgrounds/`) may exist—prefer the top-level folder.

---
For more, see `staticsite/README.md` for structure and examples.
