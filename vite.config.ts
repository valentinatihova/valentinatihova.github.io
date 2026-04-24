import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'

function normalizeBase(raw: string | undefined): string {
  if (!raw?.trim() || raw.trim() === '/') return '/'
  const t = raw.trim()
  const withLeading = t.startsWith('/') ? t : `/${t}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // Dev server always uses root base so http://localhost:5173/ works even if
  // VITE_BASE is set in the shell (e.g. testing GitHub Pages subpath builds).
  const base = command === 'serve' ? '/' : normalizeBase(process.env.VITE_BASE)
  const siteUrlForMeta = (process.env.VITE_SITE_URL ?? 'https://valentinatihova.com').replace(
    /\/$/,
    '',
  )

  return {
    base,
    server: {
      port: 5173,
      strictPort: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
              return 'react-core'
            }

            if (id.includes('node_modules/framer-motion/')) {
              return 'motion'
            }

            if (id.includes('node_modules/d3/') || id.includes('node_modules/d3-sankey/')) {
              return 'data-viz'
            }

            if (
              id.includes('node_modules/react-syntax-highlighter/') ||
              id.includes('node_modules/refractor/') ||
              id.includes('node_modules/prismjs/')
            ) {
              return 'syntax-highlighting'
            }

            if (
              id.includes('node_modules/shiki/') ||
              id.includes('node_modules/rehype-pretty-code/') ||
              id.includes('node_modules/@mdx-js/')
            ) {
              return 'mdx-stack'
            }
          },
        },
      },
    },
    plugins: [
      {
        name: 'inject-site-meta-url',
        transformIndexHtml(html) {
          return html.replaceAll('https://valentinatihova.com', siteUrlForMeta)
        },
      },
      { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
      react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
      tailwindcss(),
    ],
  }
})
