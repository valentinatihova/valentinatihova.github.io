import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    '.astro',
    '.claude',
    '.cursor',
    'seo-audit',
    'graphify-out',
    // shortcut: charts of the hidden ML articles, deleted in fix/remove-content
    'src/components/article/ZyfraViz.tsx',
    'src/components/article/BankChurnViz.tsx',
    'src/components/article/BankChurnMetricsViz.tsx',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // Fast refresh only matters for React islands in dev: the OG script and the MDX component map are not islands.
    files: ['scripts/**', 'src/components/article/MDXComponents.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
