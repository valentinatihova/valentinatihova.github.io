/**
 * Post-build prerender: generate per-route dist/<route>/index.html files
 * with correct <head> meta tags (title, description, canonical, og:*, twitter:*).
 *
 * Body keeps the SPA shell unchanged — client-side rendering still takes over
 * after hydration. The value is that OG scrapers (Facebook / LinkedIn / Twitter
 * / Slack / iMessage), which do not execute JS, see per-route metadata.
 *
 * Runs after `vite build`. Source of truth: src/data/articles.ts.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from '../src/data/articles';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

const SITE_URL = (process.env.VITE_SITE_URL ?? 'https://valentinatihova.com').replace(/\/$/, '');
const BASE_HTML_PATH = resolve(distDir, 'index.html');

if (!existsSync(BASE_HTML_PATH)) {
  console.error('[prerender] dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const BASE_HTML = readFileSync(BASE_HTML_PATH, 'utf8');

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface Seo {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt?: string;
}

function applyMeta(html: string, seo: Seo) {
  const t = esc(seo.title);
  const d = esc(seo.description);
  const u = esc(seo.url);
  const i = esc(seo.image);
  const ia = esc(seo.imageAlt ?? seo.title);

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${u}$2`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${u}$2`)
    .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/, `$1${i}$2`)
    .replace(/(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/, `$1${ia}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/, `$1${i}$2`)
    .replace(/(<meta\s+name="twitter:image:alt"\s+content=")[^"]*(")/, `$1${ia}$2`);
}

function writeRoute(pathSegments: string[], seo: Seo) {
  const html = applyMeta(BASE_HTML, seo);
  const outDir = resolve(distDir, ...pathSegments);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, 'index.html');
  writeFileSync(outPath, html);
  console.log(`[prerender] /${pathSegments.join('/')}/index.html`);
}

writeRoute(['resume'], {
  title: 'Resume | Valentina Tihova \u2014 Senior Data & MarTech Engineer',
  description:
    'Chronology, scope, and production-facing responsibilities for Valentina Tihova \u2014 Senior Data & MarTech Engineer. 8+ years across fintech, retail, and telecom. Remote in Europe, EU work authorized.',
  url: `${SITE_URL}/resume`,
  image: `${SITE_URL}/og-image.png`,
  imageAlt: 'Valentina Tihova \u2014 Senior Data & MarTech Engineer. Editorial portfolio.',
});

for (const article of articles) {
  writeRoute(['article', article.id], {
    title: `${article.title} | Valentina Tihova`,
    description: article.summary,
    url: `${SITE_URL}/article/${article.id}`,
    image: `${SITE_URL}/og/${article.id}.png`,
    imageAlt: article.title,
  });
}

function xmlEsc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function writeSitemap() {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  const entry = (loc: string, changefreq: string, priority: string, lastmod?: string) => {
    lines.push('  <url>');
    lines.push(`    <loc>${xmlEsc(loc)}</loc>`);
    if (lastmod) lines.push(`    <lastmod>${xmlEsc(lastmod)}</lastmod>`);
    lines.push(`    <changefreq>${changefreq}</changefreq>`);
    lines.push(`    <priority>${priority}</priority>`);
    lines.push('  </url>');
  };

  entry(`${SITE_URL}/`, 'weekly', '1.0');
  entry(`${SITE_URL}/resume`, 'monthly', '0.9');

  for (const article of articles) {
    const changefreq =
      article.id === 'final-project-da' ||
      article.id === 'ml-model-for-zyfra' ||
      article.id === 'bank-churn-prediction'
        ? 'yearly'
        : 'monthly';
    const priority = article.id === 'sfmc-false-opens' ? '0.9' : '0.7';
    entry(`${SITE_URL}/article/${article.id}`, changefreq, priority, article.date);
  }

  lines.push('</urlset>');
  writeFileSync(resolve(distDir, 'sitemap.xml'), `${lines.join('\n')}\n`);
  console.log('[prerender] /sitemap.xml');
}

function writeRobots() {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  writeFileSync(resolve(distDir, 'robots.txt'), body);
  console.log('[prerender] /robots.txt');
}

writeSitemap();
writeRobots();

console.log(`[prerender] generated ${articles.length + 1} route HTML files`);
