# valentinatihova.com

Personal portfolio and case-study site for Valentina Tihova — Senior Data & MarTech Engineer.

## What it is

A static React SPA deployed on GitHub Pages at [valentinatihova.com](https://valentinatihova.com). It serves as a professional landing page and a collection of long-form case studies written around real production work.

## What's inside

| Section | Purpose |
|---------|---------|
| **Home** | Short bio, tag-filtered article index |
| **Case studies** | Deep-dive write-ups (machine learning, MarTech, data viz) — some backed by public GitHub notebooks |
| **Resume** | Inline HTML CV with a downloadable PDF link |
| **Lab** | One-off interactive demos (e.g. baby feeding spiral infographic) |

## Stack

- React 18 + TypeScript, bundled with Vite
- MDX for article content
- Tailwind CSS + Framer Motion
- Custom SVG / D3-style data visualizations (no D3 dependency)
- Pre-rendered HTML shell + `sitemap.xml` via `scripts/prerender-html.tsx`
- OG images generated at build time via `scripts/generate-og.tsx`

## Deploy

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy-pages.yml`), which builds and publishes to GitHub Pages. The custom domain is set in `public/CNAME`.

```
npm run dev      # local dev server
npm run build    # production build + prerender + OG images
```
