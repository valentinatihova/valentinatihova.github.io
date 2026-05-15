import React, { useMemo } from 'react';
import { FEEDING_DIARY_ENTRIES, type FeedingDiaryEntry } from '../../data/feedingDiaryData';

/** Дата рождения (локальный календарь). */
const BIRTH = new Date(2026, 1, 24, 0, 0, 0, 0);

function parseEntryLocal(entry: FeedingDiaryEntry): Date {
  const [h, m] = entry.time.split(':').map(Number);
  const [y, mo, d] = entry.dateISO.split('-').map(Number);
  return new Date(y, mo - 1, d, h, m, 0, 0);
}

function calendarDayIndexSinceBirth(dt: Date): number {
  const b0 = new Date(BIRTH.getFullYear(), BIRTH.getMonth(), BIRTH.getDate());
  const d0 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  return Math.round((d0.getTime() - b0.getTime()) / 86_400_000);
}

function layoutEntry(entry: FeedingDiaryEntry) {
  const dt = parseEntryLocal(entry);
  const dayIx = calendarDayIndexSinceBirth(dt);
  const weekIx = Math.floor(dayIx / 7);
  const dayInWeek = ((dayIx % 7) + 7) % 7;
  const minuteOfDay = dt.getHours() * 60 + dt.getMinutes();
  const minutesIntoWeek = dayInWeek * 1440 + minuteOfDay;
  const theta = weekIx * 2 * Math.PI + (minutesIntoWeek / (7 * 1440)) * 2 * Math.PI;
  return { dt, dayIx, weekIx, dayInWeek, minuteOfDay, minutesIntoWeek, theta };
}

function mlToRadius(ml: number): number {
  if (ml <= 70) return 4;
  if (ml <= 100) return 5.5;
  if (ml <= 140) return 7;
  if (ml <= 170) return 8.5;
  return 10;
}

function isNight(hour: number): boolean {
  return hour < 7 || hour >= 22;
}

function weekDateRangeLabel(weekIx: number): string {
  const start = new Date(BIRTH.getFullYear(), BIRTH.getMonth(), BIRTH.getDate() + weekIx * 7);
  const end = new Date(BIRTH.getFullYear(), BIRTH.getMonth(), BIRTH.getDate() + weekIx * 7 + 6);
  const f = (d: Date) =>
    d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '');
  return `${f(start)}–${f(end)}`;
}

export const FeedingSpiralMockupPage: React.FC = () => {
  const cx = 460;
  const cy = 460;
  const r0 = 48;
  const dr = 24;

  const { dots, weekCards, guideArcs } = useMemo(() => {
    const layouts = FEEDING_DIARY_ENTRIES.map((e) => ({ entry: e, ...layoutEntry(e) }));
    const maxW = Math.max(0, ...layouts.map((l) => l.weekIx));
    const lastDay = Math.max(0, ...layouts.map((l) => l.dayIx));
    const maxWeekClamped = Math.max(maxW, Math.floor(lastDay / 7));

    const dots = layouts.map((l) => {
      const r = r0 + l.weekIx * dr;
      const x = cx + r * Math.cos(l.theta - Math.PI / 2);
      const y = cy + r * Math.sin(l.theta - Math.PI / 2);
      const hr = l.dt.getHours();
      return {
        key: l.entry.id,
        x,
        y,
        r: mlToRadius(l.entry.volumeMl),
        fill: isNight(hr) ? '#6366f1' : '#f59e0b',
        stroke: '#1c1917',
        title: `${l.entry.dateISO} ${l.entry.time} · ${l.entry.volumeMl} ml · нед. ${l.weekIx}`,
      };
    });

    const byWeek = new Map<number, FeedingDiaryEntry[]>();
    FEEDING_DIARY_ENTRIES.forEach((e) => {
      const { weekIx } = layoutEntry(e);
      if (!byWeek.has(weekIx)) byWeek.set(weekIx, []);
      byWeek.get(weekIx)!.push(e);
    });

    const weekCards = Array.from({ length: maxWeekClamped + 1 }, (_, w) => {
      const list = byWeek.get(w) ?? [];
      const total = list.reduce((s, e) => s + e.volumeMl, 0);
      return {
        weekIx: w,
        label: weekDateRangeLabel(w),
        count: list.length,
        totalMl: total,
        hasData: list.length > 0,
      };
    });

    const guideArcs = Array.from({ length: maxWeekClamped + 1 }, (_, w) => {
      const r = r0 + w * dr;
      return { w, r };
    });

    return { dots, weekCards, guideArcs };
  }, []);

  return (
    <div>
      <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        <a
          href="/"
          className="mb-8 inline-flex font-mono text-sm text-stone-400 transition-colors hover:text-stone-100"
        >
          ← На главную
        </a>

        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">Лаб / макет</p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
          Спираль недель + карточки (комбо 1+2)
        </h1>
        <p className="mt-4 max-w-[60ch] font-serif text-lg leading-relaxed text-stone-300">
          Отдельная страница-макет: статья про часы не менялась. Рождение —{' '}
          <strong className="text-stone-100">24 февраля 2026</strong>, дневник с{' '}
          <strong className="text-stone-100">вечера 13 апреля 2026</strong> (первые записи в данных). Угол по кругу =
          одна «жизненная» неделя (7×24 ч), каждый новый виток = следующая неделя. Объём смеси{' '}
          <em>не</em> кодируется радиусом спирали — только размер точки по легенде (как обсуждали для честной
          количественной подачи).
        </p>

        <div className="not-prose mt-10 rounded-2xl border border-stone-800 bg-stone-950/60 p-4 md:p-8">
          <h2 className="font-serif text-xl text-stone-100">Спираль</h2>
          <p className="mt-2 max-w-[62ch] font-mono text-xs leading-relaxed text-stone-500">
            Пунктир — недели без дневника (ещё не вели). Цвет точки: ночь (22–07) сине-фиолетовый, день — янтарный.
          </p>

          <div className="mt-6 overflow-x-auto">
            <svg width={920} height={920} viewBox="0 0 920 920" className="mx-auto min-w-[min(100%,920px)]" role="img" aria-label="Спираль недель кормления">
              <rect width="920" height="920" fill="#0c0a09" rx="12" />
              {guideArcs.map(({ w, r }) => {
                const hasAny = weekCards[w]?.hasData;
                return (
                  <circle
                    key={w}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={hasAny ? '#44403c' : '#292524'}
                    strokeWidth="1"
                    strokeDasharray={hasAny ? '4 5' : '2 6'}
                    opacity={hasAny ? 0.85 : 0.45}
                  />
                );
              })}
              {guideArcs.map(({ w, r }) => {
                const lx = cx + (r + 14) * Math.cos(-Math.PI / 2);
                const ly = cy + (r + 14) * Math.sin(-Math.PI / 2);
                if (w % 2 === 1) return null;
                return (
                  <text key={`lbl-${w}`} x={lx} y={ly} fill="#78716c" fontSize="11" className="font-mono" textAnchor="middle" dominantBaseline="middle">
                    {`Н${w}`}
                  </text>
                );
              })}
              {dots.map((d) => (
                <circle key={d.key} cx={d.x} cy={d.y} r={d.r} fill={d.fill} stroke={d.stroke} strokeWidth="1.2" opacity="0.92">
                  <title>{d.title}</title>
                </circle>
              ))}
              <g transform={`translate(48, 48)`}>
                <rect x="0" y="0" width="200" height="112" rx="10" fill="#1c1917" stroke="#44403c" />
                <text x="14" y="26" fill="#a8a29e" fontSize="11" className="font-mono">
                  Легенда мл (дискретно)
                </text>
                {[60, 120, 180].map((ml, i) => (
                  <g key={ml} transform={`translate(20, ${40 + i * 22})`}>
                    <circle cx="0" cy="0" r={mlToRadius(ml)} fill="#e7e5e4" />
                    <text x="18" y="4" fill="#d6d3d1" fontSize="11" className="font-mono">
                      {ml} ml
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        <div className="not-prose mt-12 rounded-2xl border border-stone-800 bg-stone-950/60 p-4 md:p-8">
          <h2 className="font-serif text-xl text-stone-100">Монтаж недель (карточки)</h2>
          <p className="mt-2 max-w-[62ch] font-mono text-xs text-stone-500">
            Горизонтальный ряд — «пакет мини-циклов»: каждая неделя одна плашка; пустые до старта дневника серые.
          </p>
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
            {weekCards.map((w) => (
              <div
                key={w.weekIx}
                className={`min-w-[9.5rem] shrink-0 rounded-xl border px-3 py-3 ${
                  w.hasData ? 'border-stone-600 bg-stone-900/80' : 'border-stone-800 bg-stone-900/30 opacity-70'
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Неделя {w.weekIx}</div>
                <div className="mt-1 font-mono text-[10px] text-stone-500">{w.label}</div>
                <div className="mt-3 font-serif text-2xl text-stone-50">{w.hasData ? `${w.totalMl}` : '—'}</div>
                <div className="font-mono text-[10px] text-stone-500">ml / 7 дн.</div>
                <div className="mt-2 font-mono text-xs text-stone-400">{w.hasData ? `${w.count} кормлений` : 'нет записей'}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 max-w-[60ch] text-sm leading-relaxed text-stone-500">
          Вдохновение ритмом и «плотным монтажом» — как в разборе{' '}
          <a
            href="https://design.bureau.ru/udivitelnye-gifki-na-nauchnye-temy-ot-eleonory-lutts/"
            className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent/85"
            target="_blank"
            rel="noreferrer"
          >
            иллюстраций Элеоноры Лутц
          </a>
          ; здесь вместо GIF — статичный SVG + скролл карточек для портфолио.
        </p>
      </div>
    </div>
  );
};
