import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Update this to your real custom domain once DNS + Pages are configured.
  // For GitHub Pages with a custom domain, this should match the value in public/CNAME.
  site: 'https://nosterslab.com', // update if different domain chosen
  integrations: [tailwind(), mdx(), sitemap()],
  markdown: {
    syntaxHighlight: 'prism'
  },
  output: 'server',
  // No server proxy needed; Astro API routes handle auth
});
