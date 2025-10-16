# Copilot instructions for `myownsite` (Astro site)

Purpose: make AI agents effective immediately on the Astro + Tailwind content site. For firmware work, see `c:/streamdeck/.github/copilot-instructions.md`.

## Stack & workflows
- Astro 4, Tailwind 3, MDX, Sitemap. Scripts (run in `c:/myownsite`):
  - `npm run dev` (dev server), `npm run build`, `npm run preview`, `npm run check` (type/content validation).
- VS Code task: “Astro Dev” runs the dev server in the background.
- Config: `astro.config.mjs` sets `site: 'https://nosterslab.com'` and integrates Tailwind/MDX/Sitemap. Keep `public/CNAME` in sync with `site`.
- If `npm run dev` fails, run `npm install`; ensure Node 18+. Missing images under `public/backgrounds/` only cause 404s (not fatal).

## Architecture & routing
- Layout: `src/layouts/BaseLayout.astro` owns the chrome: header nav (`.steam-nav`), copper buttons (`.steam-btn`/`.steam-brand-link`), rotating photo layer (`#bg-image`), and Nixie clock (`.nixie-clock`). Pages import this layout and render into `<slot/>`.
- Pages: route files in `src/pages/*.astro` (e.g., `index.astro`, listings for projects/art/reviews/thoughts, plus `design` and `robotics` links in the nav). Ensure corresponding route files exist for linked sections.
- Content schema: `src/content/config.ts` defines collections `projects`, `design`, `art`, `reviews`, `thoughts` with shared fields `{ title, summary?, tags[], published, date }` where `date` is transformed from string to `Date`.
- Assets: background photos at `public/backgrounds/*` and UI textures at `public/img/*` (steel and PCB copper). BaseLayout’s inline JS swaps `bg-*.webp` every 15s and renders the clock.

## Styling & UI conventions
- Single stylesheet: `src/styles.css` defines the entire theme. Tweak these blocks rather than using inline styles:
  - `.steam-nav` and `.nixie-clock` use uploaded steel textures (`/img/steel_dark_*`).
  - `.steam-btn`/`.steam-btn__plate` and `.steam-brand-link` implement engraved copper buttons with a sheen hover.
  - `.bg-art` and `.bg-photo-layer` create the fixed photo background with a radial mask and color overlay.
  - `.content-window` wraps page content to improve contrast; reveal effects are toggled by `[data-reveal]` and JS in `BaseLayout` (reduced motion respected).

## Content authoring
- Markdown lives under `content/{projects,design,art,reviews,thoughts}/`; frontmatter must satisfy `src/content/config.ts`.
- Adding fields: extend the collection schema in `config.ts`, then use in frontmatter. New collection: define via `defineCollection`, create folder under `content/`, and add a listing page in `src/pages/`.

## Concrete examples
- New project entry: create `content/projects/<slug>.md` with `{ title, date: 'YYYY-MM-DD', summary?, tags?, repo?, link?, stack? }`.
- Update header look: edit `.steam-nav`/`.nixie-clock` in `src/styles.css`; structural markup is in `src/layouts/BaseLayout.astro`.
- Background rotation: adjust the `images` array in `BaseLayout.astro` to point at existing files in `/public/backgrounds`.

## Gotchas
- Domain changes: update both `astro.config.mjs` `site` and `public/CNAME`.
- Dates: invalid `date` strings will fail `npm run check`.
- Backgrounds: ensure `/public/backgrounds/bg-{mobile,desktop,wide}.webp` exist, or change the `images` list.

# Copilot Instructions

- [x] Clarify Project Requirements
  - Secure user authentication for Astro site
  - Node.js/Express backend (api/)
  - PostgreSQL database (db/)
  - Passwords hashed with bcrypt
  - JWT sessions
  - Restrict downloads/contact to logged-in users

- [x] Scaffold the Project
  - Created:
    - src/pages/register.astro (registration page)
    - src/pages/login.astro (login page)
    - src/pages/contact.astro (contact page, protected)
    - src/components/DownloadButton.astro (protected download button)
    - api/auth/ (Express backend for auth)
    - db/ (PostgreSQL migrations and config)

- [x] Customize the Project
  - Integrated authentication with Astro frontend
  - Protected contact page and download buttons
  - Only logged-in users can access downloads/contact

- [ ] Install Required Extensions
  - No extensions required for this setup

- [ ] Compile the Project
  - Next: Install dependencies and run diagnostics
