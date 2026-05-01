import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { FEEDING_DIARY_ENTRIES, diaryDatesSorted, entriesForDate } from '../../data/feedingDiaryData';
import { trackEvent } from '../../lib/analytics';

const BIRTH_DATE_MS = new Date('2026-02-24T12:00:00').getTime();

function weekFromBirth(dateISO: string): number {
  const dayMs = new Date(`${dateISO}T12:00:00`).getTime();
  const dayIndex = Math.floor((dayMs - BIRTH_DATE_MS) / 86_400_000);
  return Math.floor(dayIndex / 7) + 1;
}

const WEEK_COLORS: Record<number, string> = {
  3: '#8a6a20',
  4: '#1e4a8a',
  5: '#1a2a5a',
};

function openRawDataTable() {
  const dates = diaryDatesSorted(FEEDING_DIARY_ENTRIES);

  // Group dates by week
  const byWeek = new Map<number, string[]>();
  for (const date of dates) {
    const wk = weekFromBirth(date);
    if (!byWeek.has(wk)) byWeek.set(wk, []);
    byWeek.get(wk)!.push(date);
  }

  const tableRows: string[] = [];
  for (const [wk, wkDates] of [...byWeek.entries()].sort((a, b) => a[0] - b[0])) {
    const bg = WEEK_COLORS[wk] ?? '#292524';
    tableRows.push(`<tr class="week-header">
      <td colspan="4" style="background:${bg}20; color:${bg === '#8a6a20' ? '#c89848' : bg === '#1e4a8a' ? '#6b84ba' : '#8899cc'}">
        Week ${wk} from birth
      </td>
    </tr>`);

    for (const date of wkDates) {
      const entries = entriesForDate(date, FEEDING_DIARY_ENTRIES);
      const total = entries.reduce((s, e) => s + e.volumeMl, 0);
      const d = new Date(`${date}T12:00:00`);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      entries.forEach((e, i) => {
        tableRows.push(`<tr>
          ${i === 0 ? `<td rowspan="${entries.length}" class="date-cell">${dayLabel}</td>` : ''}
          <td class="wk-num">${i === 0 ? `W${wk}` : ''}</td>
          <td class="time">${e.time}</td>
          <td class="vol">${e.volumeMl} ml</td>
        </tr>`);
      });

      tableRows.push(`<tr class="total-row">
        <td colspan="3" class="total-label">Daily total</td>
        <td class="vol">${total} ml</td>
      </tr>`);
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Feeding diary — raw data</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0c0a09; color: #e7e5e4; font-family: system-ui, sans-serif; padding: 2rem 1.5rem; }
    h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem; }
    p.sub { font-size: 0.8rem; color: #78716c; margin-bottom: 1.5rem; font-family: monospace; }
    table { border-collapse: collapse; width: 100%; max-width: 560px; font-size: 0.875rem; }
    thead th { text-align: left; padding: 0.5rem 1rem 0.5rem 0.75rem; font-family: monospace; font-size: 0.7rem;
      letter-spacing: 0.12em; text-transform: uppercase; color: #78716c; border-bottom: 1px solid #292524; }
    td { padding: 0.4rem 0.75rem; border-bottom: 1px solid #1c1917; vertical-align: middle; }
    td.date-cell { color: #a8a29e; font-family: monospace; font-size: 0.78rem; white-space: nowrap;
      border-right: 1px solid #292524; }
    td.wk-num { color: #57534e; font-family: monospace; font-size: 0.72rem; text-align: center; width: 2.5rem; }
    td.time { color: #d6d3d1; font-family: monospace; }
    td.vol { font-variant-numeric: tabular-nums; text-align: right; font-family: monospace; }
    tr.week-header td { padding: 0.55rem 0.75rem; font-family: monospace; font-size: 0.72rem;
      font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; border-bottom: none; }
    tr.total-row td { background: #1c1917; color: #a8a29e; font-size: 0.78rem; }
    tr.total-row td.vol { color: #e7e5e4; font-weight: 600; }
    td.total-label { font-family: monospace; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; }
    @media (max-width: 500px) { body { padding: 1rem; } td { padding: 0.35rem 0.5rem; } }
  </style>
</head>
<body>
  <h1>Feeding diary — raw data</h1>
  <p class="sub">${FEEDING_DIARY_ENTRIES.length} entries · ${dates.length} days · birth 24 Feb 2026</p>
  <table>
    <thead>
      <tr>
        <th>Day</th>
        <th style="text-align:center">Wk</th>
        <th>Time</th>
        <th style="text-align:right">Volume</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows.join('\n')}
    </tbody>
  </table>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=580,height=820,resizable=yes,scrollbars=yes');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatDayLabel(dateISO: string): string {
  const d = new Date(`${dateISO}T12:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * One-day feeding strip: pick a calendar date, see times and volumes as bars on a 24h axis.
 */
export const FeedingTimelineDiary: React.FC = () => {
  const dates = useMemo(() => diaryDatesSorted(FEEDING_DIARY_ENTRIES), []);
  const [selected, setSelected] = useState(() => dates[0] ?? '');

  const rows = useMemo(() => entriesForDate(selected, FEEDING_DIARY_ENTRIES), [selected]);

  const margin = { top: 20, right: 16, bottom: 40, left: 44 };
  const width = 720;
  const innerW = width - margin.left - margin.right;
  const innerH = 200;
  const height = innerH + margin.top + margin.bottom;

  const { bars } = useMemo(() => {
    const maxV = d3.max(rows, (r) => r.volumeMl) ?? 120;
    const yMax = Math.ceil(Math.max(maxV * 1.15, 60) / 20) * 20;
    const x = d3.scaleLinear().domain([0, 24 * 60]).range([0, innerW]);
    const y = d3.scaleLinear().domain([0, yMax]).range([innerH, 0]);
    const barW = Math.max(6, Math.min(14, innerW / Math.max(rows.length * 1.8, 12)));

    const bars = rows.map((r) => {
      const m = timeToMinutes(r.time);
      const cx = x(m);
      return { ...r, x0: cx - barW / 2, w: barW, y1: y(r.volumeMl), y0: y(0), labelY: y(r.volumeMl) - 6 };
    });

    return { bars };
  }, [rows, innerW, innerH]);

  return (
    <div className="not-prose my-12 rounded-2xl border border-stone-800 bg-stone-950/50 p-6 md:p-8">
      <div className="flex flex-col gap-4 border-b border-stone-800 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">Feeding diary</p>
          <h3 className="mt-2 font-serif text-xl text-stone-50 md:text-2xl">Timeline by day</h3>
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-stone-400">
            Pick a calendar day to see times and volumes on a 24-hour axis.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <button
            onClick={() => { trackEvent('raw_data_table_open'); openRawDataTable(); }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 transition-colors hover:border-stone-600 hover:text-stone-200"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="1" y="3" width="14" height="10" rx="1.5" />
              <line x1="1" y1="6.5" x2="15" y2="6.5" />
              <line x1="5.5" y1="6.5" x2="5.5" y2="13" />
            </svg>
            Raw data table ↗
          </button>
          <label className="flex min-w-[12rem] flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
          Day
          <select
            className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 font-sans text-sm font-medium normal-case tracking-normal text-stone-100 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/40"
            value={selected}
            onChange={(e) => { trackEvent('diary_day_change', { label: e.target.value }); setSelected(e.target.value); }}
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {formatDayLabel(d)}
              </option>
            ))}
          </select>
        </label>
        </div>
      </div>

      <p className="mt-4 font-mono text-xs text-stone-500">
        {rows.length} feeding{rows.length === 1 ? '' : 's'} ·{' '}
        {rows.reduce((s, r) => s + r.volumeMl, 0)} ml total
      </p>

      {rows.length === 0 ? (
        <p className="mt-6 text-stone-400">No entries for this date.</p>
      ) : (
        <svg
          className="mt-4 w-full max-w-[720px] text-stone-300"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Feeding volumes for ${formatDayLabel(selected)}`}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {[0, 6, 12, 18, 24].map((h) => {
              const x = (h / 24) * innerW;
              return (
                <g key={h}>
                  <line x1={x} y1={0} x2={x} y2={innerH} stroke="#44403c" strokeWidth={1} strokeDasharray="4 6" />
                  <text
                    x={x}
                    y={innerH + 28}
                    textAnchor="middle"
                    fill="#78716c"
                    fontSize={11}
                    className="font-mono"
                  >
                    {h === 24 ? '0' : `${h}:00`}
                  </text>
                </g>
              );
            })}
            {bars.map((b) => (
              <g key={b.id}>
                <rect
                  x={b.x0}
                  y={b.y1}
                  width={b.w}
                  height={b.y0 - b.y1}
                  rx={3}
                  fill="#6b84ba"
                  fillOpacity={0.75}
                  stroke="#516a9d"
                  strokeWidth={1}
                />
                <text
                  x={b.x0 + b.w / 2}
                  y={b.labelY}
                  textAnchor="middle"
                  fill="#e7e5e4"
                  fontSize={10}
                  className="font-mono"
                >
                  {b.volumeMl}
                </text>
                <text
                  x={b.x0 + b.w / 2}
                  y={innerH + 14}
                  textAnchor="middle"
                  fill="#a8a29e"
                  fontSize={9}
                  className="font-mono"
                >
                  {b.time}
                </text>
              </g>
            ))}
            <text x={0} y={-6} fill="#78716c" fontSize={11} className="font-mono">
              ml
            </text>
          </g>
        </svg>
      )}
    </div>
  );
};
