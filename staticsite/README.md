# Static Site Folder Structure for `staticsite/`

This document explains the organization of the static export of Noster's Lab. Follow this structure to add new pages, assets, or update existing content.

## Top-Level Folders

- `index.html` — Home page
- `projects.html`, `art.html`, `reviews.html`, `thoughts.html` — Main section listing pages
- `styles.css`, `styles.cyberpunk.css` — Main and theme CSS
- `img/` — UI textures, icons, and theme images
- `backgrounds/` — Background images for themes (e.g., `cyberpunk/`, `main/`, `steampunk/`)
- `uploads/` — User-uploaded images, organized by section (e.g., `uploads/projects/`, `uploads/art/`)
- `downloads/`, `videos/` — Downloadable files and videos

## Subpages

- Each project, art, review, or thought detail page should be in its own subfolder under the relevant section:
    - Example: `projects/watch-2-0.html`, `art/sketch-1.html`, `reviews/book-one.html`
- Images for a subpage should be placed in a matching subfolder:
    - Example: `uploads/projects/watch-2-0/1000008110.jpg` for `projects/watch-2-0.html`

## Content Window Requirement

- Every page and subpage **must** have a `<main class="content-window">` wrapping the main content for consistent layout and theme.
- If you add a new page, copy the structure from an existing page and ensure the main content is inside this element.

## Adding a New Page

1. Create a new HTML file in the appropriate section folder (e.g., `projects/your-new-project.html`).
2. Place any images in a matching subfolder under `uploads/` (e.g., `uploads/projects/your-new-project/`).
3. Use relative paths for all images and assets (e.g., `../uploads/projects/your-new-project/image.jpg`).
4. Ensure the main content is inside `<main class="content-window">`.
5. Update navigation links if needed.

## Example Structure

```
staticsite/
├── index.html
├── projects.html
├── art.html
├── reviews.html
├── thoughts.html
├── styles.css
├── styles.cyberpunk.css
├── img/
├── backgrounds/
│   └── cyberpunk/
├── uploads/
│   └── projects/
│       └── watch-2-0/
│           └── 1000008110.jpg
│   └── art/
│       └── sketch-1/
│           └── sketch.jpg
├── downloads/
├── videos/
└── projects/
        └── watch-2-0.html
└── art/
        └── sketch-1.html
└── reviews/
        └── book-one.html
```

## Notes
- All asset and image references in HTML and CSS must use relative paths from the current file.
- The background image and theme are set via CSS and the `<div id="bg-image">` or similar element.
- If you copy or add new backgrounds, place them in the correct `backgrounds/` subfolder and update the CSS or inline style as needed.

---

For questions or to automate asset copying, use the provided `copy_static_site.ps1` script.
# Static Site Folder Structure for Nosters Lab

This static site is a direct export of the Astro version. All assets, pages, and styles are organized for easy maintenance and future updates.

## Structure Overview

```
staticsite/
├── index.html
├── projects.html
├── art.html
├── reviews.html
├── thoughts.html
├── styles.css
├── styles.cyberpunk.css
├── img/
│   └── ... (UI textures, steel, copper, etc.)
├── backgrounds/
│   ├── cyberpunk/
│   ├── main/
│   ├── steampunk/
│   └── ... (background images)
├── uploads/
│   ├── projects/
│   ├── art/
│   ├── reviews/
│   ├── robotics/
│   ├── thoughts/
│   └── ... (uploaded images)
├── js/
│   └── ... (UI scripts)
├── videos/
│   └── ... (project/review videos, if any)
├── downloads/
│   └── ... (downloadable files, if any)
└── content/ (optional, for reference)
    ├── projects/
    ├── art/
    ├── reviews/
    ├── thoughts/
    └── ... (original markdown)
```

## What to Copy

- All HTML pages (main and subpages) from Astro build output
- All CSS files from `src/` (main and theme styles)
- All images, backgrounds, overlays, and uploads from `public/`
- All JavaScript files from `public/js/`
- All videos and downloads from `public/` (if used)
- (Optional) All markdown/content files for reference

## How to Add New Content

1. Add new HTML pages to the root or a subfolder.
2. Place new images in the appropriate `img/`, `backgrounds/`, or `uploads/` subfolder.
3. Add new CSS or JS files as needed.
4. Update links in HTML/CSS to use relative paths (e.g., `backgrounds/cyberpunk/cyberpunk.png`).

---

This structure ensures your static site will look and function exactly like the Astro version, with all backgrounds, overlays, and theme images in place.
