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
    plugins: [
      tailwindcss(),
      // MDX files are compiled by @astrojs/mdx with jsxImportSource:"astro",
      // which produces Astro VNodes incompatible with React. This plugin swaps
      // the runtime to react/jsx-runtime so that MDX loaded via import.meta.glob
      // in ArticleBody renders as React elements. The swap runs for BOTH the SSR
      // and client passes: ArticleBody is now `client:load`, so Astro must
      // server-render the MDX React tree (putting article prose in static HTML)
      // as well as hydrate it. MDX is only ever consumed as React here.
      {
        name: 'mdx-react-compat',
        enforce: 'post',
        transform(code, id) {
          if (!id.endsWith('.mdx')) return;
          return {
            code: code
              .replace(/from ['"]astro\/jsx-runtime['"]/g, 'from "react/jsx-runtime"')
              .replace(/from ['"]astro\/jsx-dev-runtime['"]/g, 'from "react/jsx-dev-runtime"'),
            map: null,
          };
        },
      },
    ],
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
