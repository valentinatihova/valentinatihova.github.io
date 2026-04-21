/**
 * Feeding diary — transcribed from notebook photos (filenames 1 … 4).
 * `dateISO` is the calendar day in local time; `time` is 24h HH:MM.
 * Sums like "60 + 30" are stored as total ml. Edit / extend as you add pages.
 */
export type FeedingDiaryEntry = {
  id: string;
  /** ISO date yyyy-mm-dd (local calendar day) */
  dateISO: string;
  time: string;
  volumeMl: number;
  /** Which source photo batch (1–4) */
  sourceImage: 1 | 2 | 3 | 4;
};

export const FEEDING_DIARY_ENTRIES: FeedingDiaryEntry[] = [
  // —— Photo 1: tail of prior day, 14 Apr, start of 15 Apr ——
  { id: '1-01', dateISO: '2026-04-13', time: '20:15', volumeMl: 90, sourceImage: 1 },
  { id: '1-02', dateISO: '2026-04-13', time: '22:00', volumeMl: 90, sourceImage: 1 },
  { id: '1-03', dateISO: '2026-04-14', time: '00:50', volumeMl: 120, sourceImage: 1 },
  { id: '1-04', dateISO: '2026-04-14', time: '04:10', volumeMl: 120, sourceImage: 1 },
  { id: '1-05', dateISO: '2026-04-14', time: '08:10', volumeMl: 120, sourceImage: 1 },
  { id: '1-06', dateISO: '2026-04-14', time: '09:47', volumeMl: 60, sourceImage: 1 },
  { id: '1-07', dateISO: '2026-04-14', time: '12:15', volumeMl: 150, sourceImage: 1 },
  { id: '1-08', dateISO: '2026-04-14', time: '15:30', volumeMl: 120, sourceImage: 1 },
  { id: '1-09', dateISO: '2026-04-14', time: '19:00', volumeMl: 160, sourceImage: 1 },
  { id: '1-10', dateISO: '2026-04-14', time: '20:40', volumeMl: 60, sourceImage: 1 },
  { id: '1-11', dateISO: '2026-04-15', time: '00:50', volumeMl: 180, sourceImage: 1 },
  { id: '1-12', dateISO: '2026-04-15', time: '03:43', volumeMl: 150, sourceImage: 1 },
  { id: '1-13', dateISO: '2026-04-15', time: '09:15', volumeMl: 120, sourceImage: 1 },
  { id: '1-14', dateISO: '2026-04-15', time: '11:00', volumeMl: 60, sourceImage: 1 },
  { id: '1-15', dateISO: '2026-04-15', time: '12:55', volumeMl: 120, sourceImage: 1 },
  { id: '1-16', dateISO: '2026-04-15', time: '16:00', volumeMl: 120, sourceImage: 1 },
  { id: '1-17', dateISO: '2026-04-15', time: '19:30', volumeMl: 180, sourceImage: 1 },
  { id: '1-18', dateISO: '2026-04-15', time: '21:50', volumeMl: 120, sourceImage: 1 },
  { id: '1-19', dateISO: '2026-04-16', time: '01:10', volumeMl: 90, sourceImage: 1 },
  { id: '1-20', dateISO: '2026-04-16', time: '03:00', volumeMl: 60, sourceImage: 1 },
  { id: '1-21', dateISO: '2026-04-16', time: '05:26', volumeMl: 120, sourceImage: 1 },
  { id: '1-22', dateISO: '2026-04-16', time: '07:30', volumeMl: 90, sourceImage: 1 },

  // —— Photo 2 ——
  { id: '2-01', dateISO: '2026-04-16', time: '09:10', volumeMl: 60, sourceImage: 2 },
  { id: '2-02', dateISO: '2026-04-16', time: '11:30', volumeMl: 60, sourceImage: 2 },
  { id: '2-03', dateISO: '2026-04-16', time: '13:00', volumeMl: 120, sourceImage: 2 },
  { id: '2-04', dateISO: '2026-04-16', time: '14:40', volumeMl: 120, sourceImage: 2 },
  { id: '2-05', dateISO: '2026-04-16', time: '16:15', volumeMl: 90, sourceImage: 2 },
  { id: '2-06', dateISO: '2026-04-16', time: '18:45', volumeMl: 120, sourceImage: 2 },
  { id: '2-07', dateISO: '2026-04-16', time: '20:45', volumeMl: 90, sourceImage: 2 },
  { id: '2-08', dateISO: '2026-04-16', time: '21:30', volumeMl: 60, sourceImage: 2 },
  { id: '2-09', dateISO: '2026-04-17', time: '00:50', volumeMl: 90, sourceImage: 2 },
  { id: '2-10', dateISO: '2026-04-17', time: '03:10', volumeMl: 120, sourceImage: 2 },
  { id: '2-11', dateISO: '2026-04-17', time: '06:10', volumeMl: 120, sourceImage: 2 },
  { id: '2-12', dateISO: '2026-04-17', time: '07:44', volumeMl: 90, sourceImage: 2 },
  { id: '2-13', dateISO: '2026-04-17', time: '09:30', volumeMl: 90, sourceImage: 2 },
  { id: '2-14', dateISO: '2026-04-17', time: '11:50', volumeMl: 90, sourceImage: 2 },
  { id: '2-15', dateISO: '2026-04-17', time: '12:20', volumeMl: 30, sourceImage: 2 },
  { id: '2-16', dateISO: '2026-04-17', time: '16:00', volumeMl: 120, sourceImage: 2 },
  { id: '2-17', dateISO: '2026-04-17', time: '16:30', volumeMl: 60, sourceImage: 2 },
  { id: '2-18', dateISO: '2026-04-17', time: '18:17', volumeMl: 60, sourceImage: 2 },
  { id: '2-19', dateISO: '2026-04-17', time: '19:20', volumeMl: 45, sourceImage: 2 },
  { id: '2-20', dateISO: '2026-04-17', time: '19:50', volumeMl: 90, sourceImage: 2 },

  // —— Photo 3 ——
  { id: '3-01', dateISO: '2026-04-17', time: '21:20', volumeMl: 60, sourceImage: 3 },
  { id: '3-02', dateISO: '2026-04-18', time: '00:30', volumeMl: 90, sourceImage: 3 },
  { id: '3-03', dateISO: '2026-04-18', time: '02:30', volumeMl: 90, sourceImage: 3 },
  { id: '3-04', dateISO: '2026-04-18', time: '05:15', volumeMl: 120, sourceImage: 3 },
  { id: '3-05', dateISO: '2026-04-18', time: '07:00', volumeMl: 90, sourceImage: 3 },
  { id: '3-06', dateISO: '2026-04-18', time: '09:11', volumeMl: 90, sourceImage: 3 },
  { id: '3-07', dateISO: '2026-04-18', time: '10:40', volumeMl: 60, sourceImage: 3 },
  { id: '3-08', dateISO: '2026-04-18', time: '11:50', volumeMl: 120, sourceImage: 3 },
  { id: '3-09', dateISO: '2026-04-18', time: '13:40', volumeMl: 90, sourceImage: 3 },
  { id: '3-10', dateISO: '2026-04-18', time: '14:15', volumeMl: 30, sourceImage: 3 },
  { id: '3-11', dateISO: '2026-04-18', time: '17:15', volumeMl: 120, sourceImage: 3 },
  { id: '3-12', dateISO: '2026-04-18', time: '17:46', volumeMl: 60, sourceImage: 3 },
  { id: '3-13', dateISO: '2026-04-18', time: '18:20', volumeMl: 60, sourceImage: 3 },
  { id: '3-14', dateISO: '2026-04-18', time: '20:00', volumeMl: 90, sourceImage: 3 },
  { id: '3-15', dateISO: '2026-04-18', time: '21:30', volumeMl: 120, sourceImage: 3 },
  { id: '3-16', dateISO: '2026-04-18', time: '22:10', volumeMl: 60, sourceImage: 3 },
  { id: '3-17', dateISO: '2026-04-19', time: '00:30', volumeMl: 60, sourceImage: 3 },
  { id: '3-18', dateISO: '2026-04-19', time: '02:50', volumeMl: 120, sourceImage: 3 },
  { id: '3-19', dateISO: '2026-04-19', time: '05:30', volumeMl: 90, sourceImage: 3 },
  { id: '3-20', dateISO: '2026-04-19', time: '07:10', volumeMl: 120, sourceImage: 3 },
  { id: '3-21', dateISO: '2026-04-19', time: '09:10', volumeMl: 120, sourceImage: 3 },
  { id: '3-22', dateISO: '2026-04-19', time: '11:30', volumeMl: 100, sourceImage: 3 },
  { id: '3-23', dateISO: '2026-04-19', time: '12:30', volumeMl: 60, sourceImage: 3 },

  // —— Photo 4 ——
  { id: '4-01', dateISO: '2026-04-19', time: '21:40', volumeMl: 120, sourceImage: 4 },
  { id: '4-02', dateISO: '2026-04-20', time: '02:45', volumeMl: 120, sourceImage: 4 },
  { id: '4-03', dateISO: '2026-04-20', time: '06:00', volumeMl: 120, sourceImage: 4 },
  { id: '4-04', dateISO: '2026-04-20', time: '07:50', volumeMl: 90, sourceImage: 4 },
  { id: '4-05', dateISO: '2026-04-20', time: '11:50', volumeMl: 90, sourceImage: 4 },
  { id: '4-06', dateISO: '2026-04-20', time: '13:05', volumeMl: 60, sourceImage: 4 },
  { id: '4-07', dateISO: '2026-04-20', time: '13:50', volumeMl: 90, sourceImage: 4 },
  { id: '4-08', dateISO: '2026-04-20', time: '15:00', volumeMl: 60, sourceImage: 4 },
  { id: '4-09', dateISO: '2026-04-20', time: '23:52', volumeMl: 120, sourceImage: 4 },
  { id: '4-10', dateISO: '2026-04-21', time: '01:30', volumeMl: 100, sourceImage: 4 },
  { id: '4-11', dateISO: '2026-04-21', time: '04:20', volumeMl: 90, sourceImage: 4 },
  { id: '4-12', dateISO: '2026-04-21', time: '07:20', volumeMl: 120, sourceImage: 4 },
  { id: '4-13', dateISO: '2026-04-21', time: '09:30', volumeMl: 60, sourceImage: 4 },
  { id: '4-14', dateISO: '2026-04-21', time: '22:33', volumeMl: 120, sourceImage: 4 },
  { id: '4-15', dateISO: '2026-04-22', time: '23:40', volumeMl: 60, sourceImage: 4 },
  { id: '4-16', dateISO: '2026-04-23', time: '03:00', volumeMl: 90, sourceImage: 4 },
  { id: '4-17', dateISO: '2026-04-23', time: '05:10', volumeMl: 120, sourceImage: 4 },
  { id: '4-18', dateISO: '2026-04-23', time: '07:20', volumeMl: 60, sourceImage: 4 },
  { id: '4-19', dateISO: '2026-04-23', time: '10:10', volumeMl: 90, sourceImage: 4 },
  { id: '4-20', dateISO: '2026-04-23', time: '11:15', volumeMl: 120, sourceImage: 4 },
  { id: '4-21', dateISO: '2026-04-23', time: '13:40', volumeMl: 60, sourceImage: 4 },
];

export function diaryDatesSorted(entries: FeedingDiaryEntry[] = FEEDING_DIARY_ENTRIES): string[] {
  return [...new Set(entries.map((e) => e.dateISO))].sort();
}

export function entriesForDate(dateISO: string, entries: FeedingDiaryEntry[] = FEEDING_DIARY_ENTRIES): FeedingDiaryEntry[] {
  return entries.filter((e) => e.dateISO === dateISO).sort((a, b) => a.time.localeCompare(b.time));
}
