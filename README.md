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

## Deploy (GitHub Pages)

Workflow: `.github/workflows/deploy-pages.yml`. On push to `main` / `master`, it builds with the correct `VITE_BASE` / `VITE_SITE_URL` for Pages (project repo vs `*.github.io` user repo), copies `dist/index.html` to `dist/404.html` for SPA routing, then deploys.

### First-time setup on GitHub

1. Create the repo (for apex domain **valentinatihova.com**, name it **`yourusername.github.io`** so `VITE_BASE=/`; otherwise use any name — site will live at `https://username.github.io/repo/`).
2. **Settings → Pages → Build and deployment**: Source **GitHub Actions** (not “Deploy from branch”).
3. Push `main`; open **Actions** and wait for **Deploy to GitHub Pages** to finish green.
4. **Custom domain**: DNS points to GitHub Pages; in repo **Settings → Pages** add **Custom domain** `valentinatihova.com` (matches `public/CNAME`). Enable **Enforce HTTPS** after DNS validates.

```
npm run dev      # local dev server
npm run build    # production build + prerender + OG images
```
