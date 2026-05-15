import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypePrettyCode from 'rehype-pretty-code';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://valentinatihova.com',
  output: 'static',

  integrations: [
    react(),
    mdx({
      // rehype-pretty-code handles syntax highlighting inside MDX files
      // loaded via import.meta.glob in ArticleBody.tsx (Vite processes them
      // through this same plugin chain at build time).
      rehypePlugins: [
        [rehypePrettyCode, { theme: 'one-dark-pro', keepBackground: false }],
      ],
    }),
    // Sitemap auto-generated from all static pages. Excludes /404 automatically.
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
    // Preserve chunk splitting strategy from the old Vite config.
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/framer-motion/')) return 'motion';
            if (id.includes('node_modules/d3/') || id.includes('node_modules/d3-sankey/')) return 'data-viz';
            if (
              id.includes('node_modules/react-syntax-highlighter/') ||
              id.includes('node_modules/refractor/')
            )
              return 'syntax-highlighting';
          },
        },
      },
    },
  },

  // Markdown / MDX options — keep rehype-pretty-code for syntax highlighting.
  markdown: {
    syntaxHighlight: false, // handled by rehype-pretty-code in MDX
  },
});
