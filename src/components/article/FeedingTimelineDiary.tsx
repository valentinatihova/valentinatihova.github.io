import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { FEEDING_DIARY_ENTRIES, diaryDatesSorted, entriesForDate } from '../../data/feedingDiaryData';

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
            Notebook pages transcribed in photo order (1→4). Dates are editorial placeholders — adjust in{' '}
            <code className="rounded border border-stone-700 bg-stone-900 px-1.5 py-0.5 font-mono text-[0.8em] text-stone-200">
              feedingDiaryData.ts
            </code>{' '}
            when you lock real calendar days.
          </p>
        </div>
        <label className="flex min-w-[12rem] flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
          Day
          <select
            className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 font-sans text-sm font-medium normal-case tracking-normal text-stone-100 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/40"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {formatDayLabel(d)}
              </option>
            ))}
          </select>
        </label>
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
