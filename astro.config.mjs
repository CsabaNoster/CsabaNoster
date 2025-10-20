import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { astroStatic } from '@astrojs/adapter-static';

export default defineConfig({
  // Update this to your real custom domain once DNS + Pages are configured.
  // For GitHub Pages with a custom domain, this should match the value in public/CNAME.
  site: 'https://nosterslab.com', // update if different domain chosen
  integrations: [mdx(), tailwind(), sitemap()],
  adapter: astroStatic(),
});
