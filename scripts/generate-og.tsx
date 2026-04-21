/**
 * Build-time OG image generator.
 *
 * Produces /public/og-image.png (root) and /public/og/<article-id>.png for each article.
 * Uses satori (JSX -> SVG) + @resvg/resvg-js (SVG -> PNG). Works on any static host.
 *
 * Brand system (P10 / Audit #4 / Audit #6 — Branded Identity Kit):
 *   - Single accent: amber (#ce7f46). No sky, no constellation.
 *   - VT monogram is the identity seal — same geometry as /public/favicon.svg.
 *   - Editorial frame + typeface colophon reinforce the publication voice.
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
const fontsDir = resolve(root, 'node_modules/@fontsource');

const fraunces400 = readFileSync(resolve(fontsDir, 'fraunces/files/fraunces-latin-400-normal.woff'));
const fraunces400Italic = readFileSync(resolve(fontsDir, 'fraunces/files/fraunces-latin-400-italic.woff'));
const fraunces700 = readFileSync(resolve(fontsDir, 'fraunces/files/fraunces-latin-700-normal.woff'));
const mono400 = readFileSync(resolve(fontsDir, 'jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'));
const mono500 = readFileSync(resolve(fontsDir, 'jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff'));

const fonts = [
  { name: 'Fraunces', data: fraunces400, weight: 400 as const, style: 'normal' as const },
  { name: 'Fraunces', data: fraunces400Italic, weight: 400 as const, style: 'italic' as const },
  { name: 'Fraunces', data: fraunces700, weight: 700 as const, style: 'normal' as const },
  { name: 'JetBrains Mono', data: mono400, weight: 400 as const, style: 'normal' as const },
  { name: 'JetBrains Mono', data: mono500, weight: 500 as const, style: 'normal' as const },
];

const STONE_950 = '#0c0a09';
const STONE_900 = '#1c1917';
const STONE_800 = '#292524';
const STONE_700 = '#44403c';
const STONE_500 = '#78716c';
const STONE_400 = '#a8a29e';
const STONE_200 = '#e7e5e4';
const STONE_100 = '#f5f5f4';
const STONE_50 = '#fafaf9';
const ACCENT = '#ce7f46';

/**
 * Monogram seal — VT mark scaled for OG canvas.
 * Geometry mirrors /public/favicon.svg (32x32 coords scaled to `size`).
 */
function MonogramSeal({ size = 88 }: { size?: number }) {
  const s = size / 32;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ display: 'flex' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="7" fill={STONE_950} />
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="6.5"
        fill="none"
        stroke={STONE_700}
        strokeWidth="1"
      />
      <path
        d="M 7.5 8.5 L 16 22.5 L 24.5 8.5"
        stroke={STONE_50}
        strokeWidth={2.1 / s}
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <path
        d="M 11.5 8.5 L 20.5 8.5"
        stroke={STONE_50}
        strokeWidth={2.1 / s}
        strokeLinecap="square"
        fill="none"
      />
      <rect x="10" y="25.5" width="12" height="1.25" fill={ACCENT} />
    </svg>
  );
}

function EditorialFrame() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        left: 40,
        right: 40,
        bottom: 40,
        border: `1px solid ${STONE_700}`,
      }}
    />
  );
}

function CornerDots() {
  const dotStyle = { position: 'absolute' as const, width: 8, height: 8, borderRadius: 4, background: STONE_500 };
  return (
    <>
      <div style={{ ...dotStyle, top: 36, left: 36 }} />
      <div style={{ ...dotStyle, top: 36, right: 36 }} />
      <div style={{ ...dotStyle, bottom: 36, left: 36 }} />
      <div style={{ ...dotStyle, bottom: 36, right: 36 }} />
    </>
  );
}

function RootTemplate() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        position: 'relative',
        display: 'flex',
        fontFamily: 'Fraunces',
        color: STONE_50,
        background: `linear-gradient(180deg, ${STONE_900} 0%, ${STONE_950} 100%)`,
      }}
    >
      <EditorialFrame />
      <CornerDots />

      {/* Monogram seal top-right */}
      <div style={{ position: 'absolute', top: 82, right: 82, display: 'flex' }}>
        <MonogramSeal size={96} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 110,
          left: 90,
          right: 230,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 18,
            letterSpacing: 4,
            color: STONE_400,
            textTransform: 'uppercase',
          }}
        >
          Senior Data &amp; MarTech Engineer
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            color: STONE_50,
          }}
        >
          Valentina Tihova
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 34,
            lineHeight: 1.25,
            color: STONE_200,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Production data pipelines, decisioning</span>
          <span style={{ color: ACCENT, fontStyle: 'italic' }}>systems, and reporting infrastructure.</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          bottom: 90,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ height: 1, background: STONE_700, marginBottom: 28 }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'JetBrains Mono',
            fontSize: 15,
            letterSpacing: 2,
            color: STONE_400,
            textTransform: 'uppercase',
          }}
        >
          <span>8+ years  ·  fintech · retail · telecom  ·  remote in europe</span>
          <span style={{ color: STONE_500 }}>valentinatihova.com</span>
        </div>
      </div>
    </div>
  );
}

interface ArticleMeta {
  id: string;
  title: string;
  summary: string;
  readTime: string;
  date: string;
  tags: string[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase();
}

function ArticleTemplate(article: ArticleMeta) {
  const firstTag = article.tags[0] ?? 'Case Study';
  const metaLine = `${article.readTime.toUpperCase()}  ·  ${formatDate(article.date)}  ·  ${article.tags.slice(0, 4).join(' · ').toUpperCase()}`;

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        position: 'relative',
        display: 'flex',
        fontFamily: 'Fraunces',
        color: STONE_50,
        background: `linear-gradient(180deg, ${STONE_900} 0%, ${STONE_950} 100%)`,
      }}
    >
      <EditorialFrame />
      <CornerDots />

      {/* Monogram seal top-right */}
      <div style={{ position: 'absolute', top: 76, right: 76, display: 'flex' }}>
        <MonogramSeal size={72} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 90,
          right: 200,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: 'JetBrains Mono',
            fontSize: 16,
            letterSpacing: 4,
            color: ACCENT,
            textTransform: 'uppercase',
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 5, background: ACCENT }} />
          <span>{firstTag}</span>
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.1,
            color: STONE_50,
            display: 'flex',
          }}
        >
          {article.title}
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 26,
            lineHeight: 1.35,
            color: STONE_200,
            fontStyle: 'italic',
            display: 'flex',
          }}
        >
          {article.summary}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          bottom: 90,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ height: 1, background: STONE_700, marginBottom: 24 }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'JetBrains Mono',
            fontSize: 14,
            letterSpacing: 2,
            color: STONE_400,
            textTransform: 'uppercase',
          }}
        >
          <span>{metaLine}</span>
          <span style={{ color: STONE_500 }}>valentinatihova.com</span>
        </div>
      </div>
    </div>
  );
}

async function renderPng(element: any, outPath: string) {
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
      ArticleTemplate({
        id: article.id,
        title: article.title,
        summary: article.summary,
        readTime: article.readTime,
        date: article.date,
        tags: article.tags,
      }),
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
