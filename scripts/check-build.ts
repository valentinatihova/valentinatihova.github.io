/**
 * Post-build checks over dist/. Run after `astro build`:
 *   npm run check:build            known issues are reported, do not fail
 *   npm run check:build -- --strict known issues fail too
 *
 * BANNED_TERMS (comma-separated, from a CI secret) lists words that must never
 * reach the published site, e.g. client names under NDA.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { allArticles } from '../src/data/articles';

const SITE = 'https://valentinatihova.com';
const dist = resolve(import.meta.dirname, '..', 'dist');
const strict = process.argv.includes('--strict');

// Each entry is removed by the branch that fixes it.
const KNOWN = new Map([
  ['canonical-trailing-slash', 'positioning batch'],
]);

const failures: { check: string; detail: string }[] = [];
const fail = (check: string, detail: string) => failures.push({ check, detail });

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

if (!existsSync(dist)) {
  console.error('dist/ not found: run `astro build` first');
  process.exit(2);
}
const files = walk(dist);
const html = files.filter((f) => f.endsWith('.html'));
const text = files.filter((f) => /\.(html|js|css|xml|txt|json)$/.test(f));
const read = (f: string) => readFileSync(f, 'utf8');

const resolvesTo = (path: string) =>
  [join(dist, path), join(dist, path, 'index.html'), join(dist, `${path.replace(/\/$/, '')}.html`)].some(
    (p) => existsSync(p) && statSync(p).isFile(),
  );

// 1. Every sitemap URL is built, with one <h1>, a <title> and a description.
const sitemap = files.filter((f) => /sitemap-\d+\.xml$/.test(f)).map(read).join('');
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const path = loc.replace(SITE, '') || '/';
  if (!resolvesTo(path)) {
    fail('sitemap-route-missing', path);
    continue;
  }
  const page = read([join(dist, path, 'index.html'), join(dist, path)].find((p) => existsSync(p) && statSync(p).isFile())!);
  const h1 = (page.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail('one-h1', `${path} has ${h1}`);
  if (!/<title>[^<]+<\/title>/.test(page)) fail('title', path);
  if (!/<meta name="description" content="[^"]+"/.test(page)) fail('description', path);
}

for (const f of html) {
  const page = read(f);
  const rel = '/' + relative(dist, f).replace(/index\.html$/, '');

  // 2. Internal links and assets resolve.
  for (const [, url] of page.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = url.startsWith(SITE) ? url.slice(SITE.length) || '/' : url;
    if (!u.startsWith('/') || u.startsWith('//')) continue;
    const path = u.split('#')[0].split('?')[0];
    if (path && !resolvesTo(path)) fail('broken-internal-link', `${rel} -> ${u}`);
  }

  // 3. Content must be visible without JS and with reduced motion.
  // The back-to-top button is meant to start hidden, so buttons are skipped.
  const hidden = [...page.matchAll(/<(\w+)[^>]*style="opacity:\s*0[;"]/g)].filter(([, tag]) => tag !== 'button');
  if (hidden.length) fail('first-screen-hidden', `${rel} has ${hidden.length} element(s) with inline opacity:0`);

  // 4. Canonical is the page's own URL, with a trailing slash.
  const canonical = page.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const redirect = /http-equiv="refresh"/.test(page);
  if (canonical && !redirect && !rel.startsWith('/404') && canonical !== SITE + rel) {
    fail('canonical-trailing-slash', `${rel} canonical is ${canonical}`);
  }
}

// 5. Hidden articles leave no trace in the published files.
const corpus = text.map(read).join('\n');
for (const a of allArticles.filter((a) => a.hidden)) {
  if (corpus.includes(a.title)) fail('hidden-content-published', `"${a.title}" is in dist/`);
}

// 6. Only cookieless analytics: no Google Analytics.
if (/googletagmanager\.com|gtag\(/.test(corpus)) fail('no-google-analytics', 'Google Analytics found in dist/');

// 7. Fonts are self-hosted: nothing loads from Google before first paint.
if (/fonts\.(googleapis|gstatic)\.com/.test(corpus)) fail('self-hosted-fonts', 'Google Fonts URL found in dist/');

// 8. Banned terms never reach the site. Terms are not printed.
const banned = (process.env.BANNED_TERMS ?? '').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
const lower = corpus.toLowerCase();
banned.forEach((t, i) => lower.includes(t) && fail('banned-term', `term #${i + 1} from BANNED_TERMS found`));

let errors = 0;
for (const { check, detail } of failures) {
  const known = KNOWN.get(check);
  if (known && !strict) console.warn(`known  ${check}: ${detail} (fix pending: ${known})`);
  else {
    console.error(`FAIL   ${check}: ${detail}`);
    errors++;
  }
}
console.log(`${html.length} pages checked, ${errors} failure(s), ${failures.length - errors} known issue(s)`);
process.exit(errors ? 1 : 0);
