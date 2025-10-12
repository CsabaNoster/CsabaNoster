# NostersLab

Creative engineering & content site (Astro + Tailwind + MDX) with collections for:
- Projects (`/projects`)
- Art (`/art`)
- Book Reviews (`/reviews`)
- Thoughts (`/thoughts`)

## Development
Install deps then start dev server.

```bash
npm install
npm run dev
```

## Content Collections
Edit or add Markdown in `content/<collection>/`. Frontmatter fields are validated by `src/content/config.ts`.

## Build
```bash
npm run build
npm run preview
```

## Roadmap Ideas
- Add RSS feed & sitemap (sitemap added)
- Add search (FlexSearch)
- Theming refinements (dynamic palette, dark mode art)
- Performance budget & image automation
