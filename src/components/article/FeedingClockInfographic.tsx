import React, { useMemo } from 'react';
import { FEEDING_DIARY_ENTRIES } from '../../data/feedingDiaryData';

// ── SVG canvas ─────────────────────────────────────────────────────────────
const W = 960, H = 1120;
const CX = 480, CY = 472;

// ── Spiral: 3 loops = weeks 3, 4, 5 ───────────────────────────────────────
// Loop gap = (R_MAX - R_MIN) / N_LOOPS = 100 px
const R_MIN = 86, R_MAX = 386;
const N_LOOPS = 3, N_DAYS = 21;
const T_MAX = N_LOOPS * 2 * Math.PI;

// ── Gaussian wave geometry ─────────────────────────────────────────────────
// Each diary feed becomes a gaussian bump on the arc.
// Total band extent from center: INNER_D (below) + WAVE_H (above) = 49 px < 50 (half of 100 px gap).
const INNER_D = 9;    // baseline depth below spiral centerline
const WAVE_H  = 40;   // max radial height of a saturated feed peak
const ML_CAP  = 200;  // normalization ceiling per single feed (ml)
const G_SIGMA = 0.05; // sigma = 5 % of one-day arc ≈ 72 min

// ── Palette ────────────────────────────────────────────────────────────────
const BG    = '#f7efd9';
const TRCK  = '#ddd0b6';
const W3F   = '#8a9bc0';   // week 3 fill (muted blue)
const W4F   = '#4a6491';   // week 4 fill
const W5F   = '#31426f';   // week 5 fill (deep navy)
const W3BG  = '#c89848';   // week 3 background tint  (amber-gold)
const W4BG  = '#3060a8';   // week 4 background tint  (blue)
const W5BG  = '#203070';   // week 5 background tint  (dark navy)
const TICK  = '#c4b49a';
const WKLN  = '#8898b8';
const LBD   = '#5a5047';
const LBW   = '#2c3c60';
const HOLE  = '#ede3cd';
const CRDG  = '#faf3e4', CRDB = '#d7c9ab', CRDM = '#6b5e4c', CRDV = '#4c5d84';

// ── Geometry helpers ───────────────────────────────────────────────────────
const rSpiral  = (t: number) => R_MIN + (R_MAX - R_MIN) * (t / T_MAX);
const dayTheta = (i: number) => (i / N_DAYS) * T_MAX;

function polar(r: number, t: number): [number, number] {
  const a = t - Math.PI / 2;   // 0 → 12-o'clock, clockwise
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

const toMins  = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const fmtMins = (m: number)  => {
  const h = Math.floor(m / 60), min = m % 60;
  return h === 0 ? `${min}m` : min === 0 ? `${h}h` : `${h}h\u202f${min}m`;
};

// ── Day metadata ───────────────────────────────────────────────────────────
const BASE_MS = new Date('2026-04-07T12:00:00').getTime();
const DOW_ABR = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];
interface DayMeta { iso: string; week: number; dowAbbr: string; dayNum: number }
const DAY_META: DayMeta[] = Array.from({ length: N_DAYS }, (_, i) => {
  const d = new Date(BASE_MS + i * 86_400_000);
  return { iso: d.toISOString().slice(0, 10), week: Math.floor(i / 7) + 3, dowAbbr: DOW_ABR[i % 7], dayNum: d.getDate() };
});
const PARTIAL_ISO = new Set(['2026-04-13', '2026-04-19', '2026-04-21', '2026-04-22', '2026-04-23']);

// ── Path builders ──────────────────────────────────────────────────────────

/** Wide tinted background band covering one week's full spiral track. */
function weekBgPath(wk: number, steps = 100): string {
  const i0 = (wk - 3) * 7;
  const t0 = dayTheta(i0), t1 = dayTheta(i0 + 7);
  const hw = INNER_D + WAVE_H;   // just wide enough to cover the feed wave
  const pts: string[] = [];
  for (let s = 0; s <= steps; s++) {
    const t = t0 + (t1 - t0) * (s / steps);
    const [x, y] = polar(rSpiral(t) - hw, t);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  for (let s = steps; s >= 0; s--) {
    const t = t0 + (t1 - t0) * (s / steps);
    const [x, y] = polar(rSpiral(t) + hw, t);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return 'M' + pts[0] + 'L' + pts.slice(1).join('L') + 'Z';
}

/** Gaussian feed-wave polygon for one day slot [t0, t1].
 *  Each feed becomes a radial bump; height ∝ volume. */
function buildFeedWave(
  t0: number, t1: number,
  feeds: Array<{ minute: number; volumeMl: number }>,
  samples = 90,
): string {
  const sigma = (t1 - t0) * G_SIGMA;
  const outer: string[] = [], inner: string[] = [];
  for (let s = 0; s <= samples; s++) {
    const t = t0 + (t1 - t0) * (s / samples);
    const rBase = rSpiral(t);
    let h = 0;
    for (const f of feeds) {
      const tf = t0 + (f.minute / 1440) * (t1 - t0);
      const dt = t - tf;
      h += (f.volumeMl / ML_CAP) * WAVE_H * Math.exp(-dt * dt / (2 * sigma * sigma));
    }
    h = Math.min(h, WAVE_H + 8);  // soft cap
    const [ox, oy] = polar(rBase + h, t);
    outer.push(`${ox.toFixed(1)},${oy.toFixed(1)}`);
  }
  for (let s = samples; s >= 0; s--) {
    const t = t0 + (t1 - t0) * (s / samples);
    const [ix, iy] = polar(rSpiral(t) - INNER_D, t);
    inner.push(`${ix.toFixed(1)},${iy.toFixed(1)}`);
  }
  return 'M' + [...outer, ...inner].join('L') + 'Z';
}

function spiralCenterPath(steps = 400): string {
  return Array.from({ length: steps + 1 }, (_, s) => {
    const t = (s / steps) * T_MAX;
    const [x, y] = polar(rSpiral(t), t);
    return (s === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }).join('');
}

/** Tangential rotation (degrees) for in-arc labels, with lower-half flip for readability. */
function safeRotDeg(tM: number): number {
  const rot = (tM % (2 * Math.PI)) * (180 / Math.PI);  // 0–360 within one loop
  return (rot > 90 && rot < 270) ? rot + 180 : rot;
}

// ── Week fill / tint maps ──────────────────────────────────────────────────
const WK_FILL: Record<number, string>    = { 3: W3F,  4: W4F,  5: W5F  };
const WK_BG_COL: Record<number, string>  = { 3: W3BG, 4: W4BG, 5: W5BG };

// ── Component ──────────────────────────────────────────────────────────────
export const FeedingClockInfographic: React.FC = () => {

  // Aggregate diary entries by date (includes per-feed data for gaussian wave)
  const dailyMap = useMemo(() => {
    const m = new Map<string, { totalMl: number; feedCount: number; feeds: Array<{ minute: number; volumeMl: number }> }>();
    for (const e of FEEDING_DIARY_ENTRIES) {
      const prev = m.get(e.dateISO) ?? { totalMl: 0, feedCount: 0, feeds: [] };
      m.set(e.dateISO, {
        totalMl:   prev.totalMl + e.volumeMl,
        feedCount: prev.feedCount + 1,
        feeds: [...prev.feeds, { minute: toMins(e.time), volumeMl: e.volumeMl }],
      });
    }
    return m;
  }, []);

  // Summary statistics (complete days only)
  const stats = useMemo(() => {
    const complete = DAY_META
      .filter(d => dailyMap.has(d.iso) && !PARTIAL_ISO.has(d.iso))
      .map(d => dailyMap.get(d.iso)!);

    const avgDailyMl = complete.length
      ? Math.round(complete.reduce((s, d) => s + d.totalMl, 0) / complete.length) : 0;
    const peakMl = complete.length ? Math.max(...complete.map(d => d.totalMl)) : 0;
    const peakMeta  = DAY_META.find(d => dailyMap.get(d.iso)?.totalMl === peakMl && !PARTIAL_ISO.has(d.iso));
    const peakLabel = peakMeta ? `${peakMeta.dowAbbr} ${peakMeta.dayNum} Apr` : '';
    const avgFeeds  = complete.length
      ? (complete.reduce((s, d) => s + d.feedCount, 0) / complete.length).toFixed(1) : '—';

    const gaps: number[] = [];
    for (const [, data] of dailyMap) {
      const sorted = [...data.feeds].sort((a, b) => a.minute - b.minute);
      for (let i = 1; i < sorted.length; i++) {
        const g = sorted[i].minute - sorted[i - 1].minute;
        if (g > 0 && g < 360) gaps.push(g);
      }
    }
    const avgGap = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0;
    return { avgDailyMl, peakMl, peakLabel, avgFeeds, avgIntervalLabel: fmtMins(avgGap) };
  }, [dailyMap]);

  // Per-day computed geometry
  const segs = useMemo(() => DAY_META.map((meta, i) => {
    const t0 = dayTheta(i), t1 = dayTheta(i + 1), tM = (t0 + t1) / 2;
    const data       = dailyMap.get(meta.iso);
    const hasData    = !!data;
    const isPartial  = hasData && PARTIAL_ISO.has(meta.iso);
    const isComplete = hasData && !isPartial;
    const color      = WK_FILL[meta.week];
    const opacity    = !hasData ? 0.28 : isPartial ? 0.55 : 1.0;
    const feeds      = data?.feeds ?? [];

    // Feed-peak dot positions (top of each gaussian bump, for precise timing markers)
    const dots = feeds.map(f => {
      const tf = t0 + (f.minute / 1440) * (t1 - t0);
      const peakH = Math.min((f.volumeMl / ML_CAP) * WAVE_H, WAVE_H);
      const [x, y] = polar(rSpiral(tf) + peakH + 4, tf);
      return { x, y };
    });

    const rM = rSpiral(tM);
    const [lx, ly] = polar(rM, tM);
    const rotDeg = safeRotDeg(tM);

    return { ...meta, i, t0, t1, tM, color, opacity, feeds, dots, lx, ly, rotDeg, hasData, isPartial, isComplete };
  }), [dailyMap]);

  const guideSpiral = spiralCenterPath();

  return (
    <div className="not-prose my-12">
      <div className="overflow-hidden rounded-[2rem] border border-[#c5b89e] bg-[#f7efd9] shadow-[0_35px_90px_rgba(0,0,0,0.18)]">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="bg-[#37486f] px-6 py-5 text-[#f6f0e3] md:px-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-[#cfd9ef]">
            Feeding diary · Weeks 3 – 5
          </p>
          <h2 className="mt-1.5 font-serif text-2xl md:text-3xl">Growth spiral</h2>
          <p className="mt-1 font-mono text-[11px] text-[#99aac8]">
            Apr 7 – Apr 27, 2026 · each hump = one feed · hump height = volume (ml)
          </p>
        </div>

        {/* ── SVG ──────────────────────────────────────────────────────── */}
        <div className="px-1 py-4 md:px-4 md:py-8">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto block h-auto w-full max-w-[960px]"
            role="img"
            aria-label="Spiral chart: gaussian feed curves across weeks 3 to 5"
          >
            <rect width={W} height={H} fill={BG} />

            {/* ── Week background tint bands (clearly distinct per week) ── */}
            {([3, 4, 5] as const).map(w => (
              <path key={`bg-${w}`}
                d={weekBgPath(w)}
                fill={WK_BG_COL[w]}
                opacity="0.16"
              />
            ))}

            {/* ── Spiral centerline guide ─────────────────────────────── */}
            <path d={guideSpiral} fill="none" stroke={TRCK} strokeWidth="1.5" opacity="0.5" />

            {/* ── Gaussian feed-wave curves (one polygon per day) ─────── */}
            {segs.map(s => (
              <path key={`wv-${s.iso}`}
                d={buildFeedWave(s.t0, s.t1, s.feeds)}
                fill={s.color}
                opacity={s.opacity}
              />
            ))}

            {/* ── Inner highlight stripe for soft depth ──────────────── */}
            {segs.map(s => s.hasData && (
              <path key={`hi-${s.iso}`}
                d={buildFeedWave(s.t0, s.t1, s.feeds.map(f => ({ ...f, volumeMl: f.volumeMl * 0.22 })), 20)}
                fill="white"
                opacity="0.13"
              />
            ))}

            {/* ── Day boundary ticks ─────────────────────────────────── */}
            {segs.map(s => {
              const r = rSpiral(s.t0);
              const [x1, y1] = polar(r - INNER_D - 4, s.t0);
              const [x2, y2] = polar(r + WAVE_H + 6, s.t0);
              return <line key={`tk-${s.i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={TICK} strokeWidth="0.9" opacity="0.65" />;
            })}

            {/* ── Week boundary lines (strong) ───────────────────────── */}
            {[0, 7, 14, 21].map(idx => {
              const t = dayTheta(idx);
              const r = rSpiral(t);
              const [x1, y1] = polar(r - INNER_D - 20, t);
              const [x2, y2] = polar(r + WAVE_H + 24, t);
              return (
                <line key={`wb-${idx}`} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={WKLN} strokeWidth="3" opacity="0.9" />
              );
            })}

            {/* ── Feed-peak dots (individual timing markers) ─────────── */}
            {segs.map(s =>
              s.dots.map((dot, j) => (
                <circle key={`fd-${s.iso}-${j}`} cx={dot.x} cy={dot.y} r="2.8"
                  fill={s.color} opacity={s.opacity * 0.85} />
              ))
            )}

            {/* ── Day labels – tangential, inside arc ────────────────── */}
            {segs.map(s => {
              if (!s.hasData) return null;
              return (
                <g key={`dl-${s.iso}`} transform={`rotate(${s.rotDeg},${s.lx},${s.ly})`}>
                  <text x={s.lx} y={s.ly - 4}
                    textAnchor="middle"
                    fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="600"
                    fill={LBD} stroke={BG} strokeWidth="3.5" paintOrder="stroke" opacity="0.9">
                    {s.dowAbbr.toUpperCase()}
                  </text>
                  <text x={s.lx} y={s.ly + 12}
                    textAnchor="middle"
                    fontSize="16" fontFamily="'Fraunces',serif" fontWeight="700"
                    fill={LBW} stroke={BG} strokeWidth="4" paintOrder="stroke" opacity="0.95">
                    {s.dayNum}
                  </text>
                </g>
              );
            })}

            {/* ── Week pill badges – horizontal (no rotation), upper-right ─ */}
            {/* Placed at 1.5 days into each week on the same angular zone,
                spreading outward: W3≈(674,417) W4≈(770,391) W5≈(868,366)  */}
            {([3, 4, 5] as const).map(w => {
              const tL = dayTheta((w - 3) * 7 + 1.5);
              const r  = rSpiral(tL) + WAVE_H + 68;  // well outside the wave
              const [lx, ly] = polar(r, tL);
              const col = WK_FILL[w];
              return (
                <g key={`wl-${w}`}>
                  {/* pill background */}
                  <rect x={lx - 50} y={ly - 14} width="100" height="28" rx="14"
                    fill={col} opacity="0.93" />
                  {/* text */}
                  <text x={lx} y={ly + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="14" fontFamily="'JetBrains Mono',monospace" fontWeight="700"
                    letterSpacing="0.16em" fill="white">
                    {`WEEK ${w}`}
                  </text>
                </g>
              );
            })}

            {/* ── Peak day badge ─────────────────────────────────────── */}
            {(() => {
              const peakSeg = segs.find(s => s.isComplete && dailyMap.get(s.iso)?.totalMl === stats.peakMl);
              if (!peakSeg) return null;
              const r = rSpiral(peakSeg.tM) - INNER_D - 34;
              const [bx, by] = polar(r, peakSeg.tM);
              return (
                <g>
                  <circle cx={bx} cy={by} r="28" fill={W4F} opacity="0.93" />
                  <text x={bx} y={by - 8} textAnchor="middle"
                    fontSize="8" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fill="white">
                    PEAK
                  </text>
                  <text x={bx} y={by + 10} textAnchor="middle"
                    fontSize="13" fontFamily="'Fraunces',serif" fontWeight="700" fill="white">
                    {stats.peakMl} ml
                  </text>
                </g>
              );
            })()}

            {/* ── Center hole ────────────────────────────────────────── */}
            <circle cx={CX} cy={CY} r={R_MIN - 14} fill={HOLE} stroke={TRCK} strokeWidth="1.5" />
            <text x={CX} y={CY - 12} textAnchor="middle"
              fontSize="18" fontFamily="'Fraunces',serif" fontStyle="italic" fontWeight="700" fill={LBW}>
              Vic
            </text>
            <text x={CX} y={CY + 6} textAnchor="middle"
              fontSize="8.5" fontFamily="'JetBrains Mono',monospace" letterSpacing="0.18em" fill={LBD}>
              FEEDING
            </text>
            <text x={CX} y={CY + 21} textAnchor="middle"
              fontSize="8.5" fontFamily="'JetBrains Mono',monospace" letterSpacing="0.18em" fill={LBD}>
              SPIRAL
            </text>

            {/* ── Legend (lower-left, larger & clearer) ──────────────── */}
            <g transform="translate(24,870)">
              {/* title */}
              <text y="0" fontSize="12" fontFamily="'JetBrains Mono',monospace"
                fontWeight="700" letterSpacing="0.20em" fill={LBD}>LEGEND</text>

              {/* feed wave sample */}
              <g transform="translate(0,12)">
                <path d="M0,12 Q10,0 20,4 Q30,8 40,14 Q50,12 60,2 Q70,-4 80,6 L80,20 L0,20 Z"
                  fill={W4F} opacity="0.88" />
                <text x="90" y="15" fontSize="11" fontFamily="'JetBrains Mono',monospace" fill={LBD}>
                  each hump = 1 feed
                </text>
                <text x="90" y="28" fontSize="11" fontFamily="'JetBrains Mono',monospace" fill={LBD}>
                  hump height = ml
                </text>
              </g>

              {/* per-feed dot */}
              <g transform="translate(0,52)">
                <circle cx="8" cy="8" r="4" fill={W4F} opacity="0.85" />
                <text x="22" y="13" fontSize="11" fontFamily="'JetBrains Mono',monospace" fill={LBD}>
                  dot = feed peak timing
                </text>
              </g>

              {/* week colour swatches */}
              {([3, 4, 5] as const).map((w, i) => (
                <g key={`lg-${w}`} transform={`translate(0,${74 + i * 22})`}>
                  <rect width="28" height="14" rx="7" fill={WK_FILL[w]} opacity="0.92" />
                  <rect x="36" width="28" height="14" rx="7" fill={WK_BG_COL[w]} opacity="0.4" />
                  <text x="72" y="11" fontSize="11" fontFamily="'JetBrains Mono',monospace" fill={LBD}>
                    week {w} · fill / tint
                  </text>
                </g>
              ))}

              {/* partial day */}
              <g transform="translate(0,144)">
                <rect width="28" height="14" rx="7" fill={W5F} opacity="0.45" />
                <text x="38" y="11" fontSize="11" fontFamily="'JetBrains Mono',monospace" fill={LBD}>
                  faded = partial diary day
                </text>
              </g>
            </g>

            {/* ── Metric cards ───────────────────────────────────────── */}
            <g transform="translate(150,980)">
              <rect width="268" height="94" rx="14" fill={CRDG} stroke={CRDB} strokeWidth="1" />
              <text x="16" y="25" fontSize="9.5" fontFamily="'JetBrains Mono',monospace"
                letterSpacing="0.18em" fill={CRDM}>AVG DAILY</text>
              <text x="16" y="57" fontSize="28" fontFamily="'Fraunces',serif"
                fontWeight="600" fill={CRDV}>{stats.avgDailyMl} ml</text>
              <text x="16" y="79" fontSize="9" fontFamily="'JetBrains Mono',monospace" fill={CRDM}>PEAK</text>
              <text x="54" y="79" fontSize="17" fontFamily="'Fraunces',serif"
                fontWeight="600" fill={CRDV}>{stats.peakMl} ml</text>
              <text x="120" y="79" fontSize="9" fontFamily="'JetBrains Mono',monospace" fill={CRDM}>
                · {stats.peakLabel}
              </text>
            </g>

            <g transform="translate(542,980)">
              <rect width="268" height="94" rx="14" fill={CRDG} stroke={CRDB} strokeWidth="1" />
              <text x="16" y="25" fontSize="9.5" fontFamily="'JetBrains Mono',monospace"
                letterSpacing="0.18em" fill={CRDM}>FEEDS / DAY</text>
              <text x="16" y="57" fontSize="28" fontFamily="'Fraunces',serif"
                fontWeight="600" fill={CRDV}>{stats.avgFeeds}</text>
              <text x="16" y="79" fontSize="9" fontFamily="'JetBrains Mono',monospace" fill={CRDM}>
                AVG INTERVAL
              </text>
              <text x="132" y="79" fontSize="17" fontFamily="'Fraunces',serif"
                fontWeight="600" fill={CRDV}>{stats.avgIntervalLabel}</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
