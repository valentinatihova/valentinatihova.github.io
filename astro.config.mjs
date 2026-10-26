import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import rehypePrettyCode from 'rehype-pretty-code';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://valentinatihova.com',
  output: 'static',

  integrations: [
    react(),
    mdx(),
    // Sitemap auto-generated from all static pages. Excludes /404 automatically.
    // The retired Apex article is only a browser redirect, keep it out of the sitemap.
    sitemap({ filter: (page) => !page.includes('/article/data-cloud-metadata-apex') }),
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // MDX inherits this processor; rehype-pretty-code highlights code blocks at build time.
  markdown: {
    processor: unified({
      rehypePlugins: [[rehypePrettyCode, { theme: 'one-dark-pro', keepBackground: false }]],
    }),
    syntaxHighlight: false,
  },
});
