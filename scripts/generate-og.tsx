/**
 * Build-time OG image generator.
 *
 * Produces /public/og-image.png (root) and /public/og/<article-id>.png for each article.
 * Uses satori (JSX -> SVG) + @resvg/resvg-js (SVG -> PNG). Works on any static host.
 *
 * Same look as the site hero: paper card, ink text, Inter Tight headings, one
 * Instrument Serif italic accent, Public Sans for meta and mustard as the only accent (see src/index.css).
 * Satori reads static woff only, so the fonts come from the static @fontsource packages.
 *
 * Run: npm run og
 * Wired into: npm run build (see package.json)
 */
import React from 'react';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { articles } from '../src/data/articles';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const font = (pkg: string, file: string) => readFileSync(resolve(root, 'node_modules/@fontsource', pkg, 'files', file));

const fonts = [
  { name: 'Inter Tight', data: font('inter-tight', 'inter-tight-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'Instrument Serif', data: font('instrument-serif', 'instrument-serif-latin-400-italic.woff'), weight: 400 as const, style: 'italic' as const },
  { name: 'Public Sans', data: font('public-sans', 'public-sans-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Public Sans', data: font('public-sans', 'public-sans-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
];

// Tokens from src/index.css
const INK = '#1e1611';
const MUTED = '#6e675c';
const FIELD = '#efeae0';
const RULE = '#d6cfbf';
const FIXED = '#c9951e';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 80px 64px',
        fontFamily: 'Public Sans',
        color: INK,
        backgroundColor: FIELD,
        borderBottom: `12px solid ${FIXED}`,
      }}
    >
      {children}
    </div>
  );
}

function Footer({ left }: { left: string }) {
  return (
    <div
      style={{
        marginTop: 'auto',
        paddingTop: 24,
        borderTop: `1px solid ${RULE}`,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 24,
        color: MUTED,
      }}
    >
      <span>{left}</span>
      <span style={{ color: FIXED, fontWeight: 600 }}>valentinatihova.com</span>
    </div>
  );
}

function RootTemplate() {
  return (
    <Card>
      <div style={{ fontSize: 26, fontWeight: 600 }}>Data &amp; AI Analyst</div>
      <div style={{ marginTop: 28, fontFamily: 'Inter Tight', fontWeight: 600, fontSize: 84, lineHeight: 1.0, letterSpacing: -3, display: 'flex' }}>
        <span>I find where a product&apos;s data misleads people,&nbsp;</span><span style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic', fontWeight: 400, color: FIXED, letterSpacing: -1 }}>and fix it.</span>
      </div>
      <Footer left="Valentina Tihova · Valencia, Spain" />
    </Card>
  );
}

interface ArticleMeta {
  title: string;
  summary: string;
  readTime: string;
  date: string;
}

function ArticleTemplate(article: ArticleMeta) {
  const date = new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <Card>
      <div style={{ fontSize: 26, fontWeight: 600 }}>Valentina Tihova</div>
      <div style={{ marginTop: 24, fontFamily: 'Inter Tight', fontWeight: 600, fontSize: 66, lineHeight: 1.02, letterSpacing: -2, display: 'flex' }}>
        {article.title}
      </div>
      <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.4, color: MUTED, display: 'flex' }}>{article.summary}</div>
      <Footer left={`${date} · ${article.readTime}`} />
    </Card>
  );
}

async function renderPng(element: Parameters<typeof satori>[0], outPath: string) {
  const svg = await satori(element, { width: 1200, height: 630, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();
  const dir = dirname(outPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(outPath, png);
  console.log(`[og] wrote ${outPath} (${(png.length / 1024).toFixed(1)} kB)`);
}

function renderFaviconPngFromSvg(svgPath: string, outPath: string, size: number) {
  const svg = readFileSync(svgPath, 'utf8');
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
  const png = resvg.render().asPng();
  const dir = dirname(outPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(outPath, png);
  console.log(`[og] wrote ${outPath} (${(png.length / 1024).toFixed(1)} kB)`);
}

async function main() {
  const publicDir = resolve(root, 'public');

  await renderPng(RootTemplate(), resolve(publicDir, 'og-image.png'));

  for (const article of articles) {
    await renderPng(
      ArticleTemplate(article),
      resolve(publicDir, 'og', `${article.id}.png`)
    );
  }

  renderFaviconPngFromSvg(
    resolve(publicDir, 'favicon.svg'),
    resolve(publicDir, 'apple-touch-icon.png'),
    180
  );

  console.log(`[og] generated ${articles.length + 2} images`);
}

main().catch((err) => {
  console.error('[og] failed:', err);
  process.exit(1);
});
