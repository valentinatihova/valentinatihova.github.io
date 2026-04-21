/**
 * Representative series for on-page D3 charts — same structure as the notebook
 * (daily means, metal/stage splits, feed-size comparison, total concentration).
 * For cell-exact values, use the GitHub notebook.
 */

/**
 * Recovery correlation heatmap — 28 rows transcribed from the project figure (numeric cells
 * match the screenshot; unlabeled rows use inferred schema keys consistent with the notebook pipeline).
 */
export type HeatmapCell = {
  schemaKey: string;
  /** Short row title, e.g. stage + signal */
  labelLine1: string;
  /** Readable process meaning (English), shown next to the heatmap */
  labelLine2: string;
  finalRecovery: number;
  rougherRecovery: number;
};

export const RECOVERY_CORR_HEATMAP: HeatmapCell[] = [
  {
    schemaKey: 'final.output.concentrate_sol',
    labelLine1: 'Final conc. — solubles',
    labelLine2: 'Soluble salts in final concentrate',
    finalRecovery: 0.27,
    rougherRecovery: 0.14,
  },
  {
    schemaKey: 'final.output.concentrate_ag',
    labelLine1: 'Final conc. — Ag',
    labelLine2: 'Silver in final concentrate',
    finalRecovery: 0.25,
    rougherRecovery: 0.084,
  },
  {
    schemaKey: 'final.output.recovery',
    labelLine1: 'Final recovery',
    labelLine2: 'Target: final recovery rate',
    finalRecovery: 1,
    rougherRecovery: 0.33,
  },
  {
    schemaKey: 'final.output.tail_au',
    labelLine1: 'Final tail — Au',
    labelLine2: 'Gold in final process tailings',
    finalRecovery: -0.44,
    rougherRecovery: -0.14,
  },
  {
    schemaKey: 'primary_cleaner.input.sulfate',
    labelLine1: 'Primary input — sulfate',
    labelLine2: 'Sulfate in primary cleaner feed',
    finalRecovery: 0.4,
    rougherRecovery: 0.27,
  },
  {
    schemaKey: 'primary_cleaner.input.depressant',
    labelLine1: 'Primary input — depressant',
    labelLine2: 'Depressant in primary cleaner feed',
    finalRecovery: 0.21,
    rougherRecovery: 0.11,
  },
  {
    schemaKey: 'primary_cleaner.output.concentrate_ag',
    labelLine1: 'Primary conc. — Ag',
    labelLine2: 'Silver in primary cleaner concentrate',
    finalRecovery: 0.24,
    rougherRecovery: 0.14,
  },
  {
    schemaKey: 'primary_cleaner.output.concentrate_sol',
    labelLine1: 'Primary conc. — solubles',
    labelLine2: 'Soluble salts in primary cleaner concentrate',
    finalRecovery: 0.2,
    rougherRecovery: 0.066,
  },
  {
    schemaKey: 'primary_cleaner.output.tail_ag',
    labelLine1: 'Primary tail — Ag',
    labelLine2: 'Silver in primary cleaner tailings',
    finalRecovery: 0.2,
    rougherRecovery: 0.2,
  },
  {
    schemaKey: 'primary_cleaner.output.tail_sol',
    labelLine1: 'Primary tail — solubles',
    labelLine2: 'Soluble salts in primary cleaner tailings',
    finalRecovery: -0.39,
    rougherRecovery: -0.17,
  },
  {
    schemaKey: 'rougher.input.feed_ag',
    labelLine1: 'Rougher feed — Ag',
    labelLine2: 'Silver in rougher feed ore',
    finalRecovery: 0.31,
    rougherRecovery: 0.18,
  },
  {
    schemaKey: 'rougher.input.feed_sol',
    labelLine1: 'Rougher feed — solubles',
    labelLine2: 'Soluble salts in rougher feed ore',
    finalRecovery: 0.26,
    rougherRecovery: 0.19,
  },
  {
    schemaKey: 'rougher.input.feed_au',
    labelLine1: 'Rougher feed — Au',
    labelLine2: 'Gold in rougher feed ore',
    finalRecovery: 0.31,
    rougherRecovery: 0.16,
  },
  {
    schemaKey: 'rougher.input.feed_size',
    labelLine1: 'Rougher feed — size',
    labelLine2: 'Particle size at rougher feed',
    finalRecovery: 0.33,
    rougherRecovery: 0.24,
  },
  {
    schemaKey: 'rougher.input.floatbank11_xanthate',
    labelLine1: 'Rougher bank 11 — xanthate',
    labelLine2: 'Xanthate in rougher flotation (bank 11)',
    finalRecovery: 0.32,
    rougherRecovery: 0.24,
  },
  {
    schemaKey: 'rougher.input.floatbank10_sulfate',
    labelLine1: 'Rougher bank 10 — sulfate',
    labelLine2: 'Sulfate in rougher flotation (bank 10)',
    finalRecovery: 0.2,
    rougherRecovery: 0.66,
  },
  {
    schemaKey: 'rougher.output.concentrate_pb',
    labelLine1: 'Rougher conc. — Pb',
    labelLine2: 'Lead in rougher concentrate',
    finalRecovery: -0.014,
    rougherRecovery: 0.55,
  },
  {
    schemaKey: 'rougher.output.concentrate_sol',
    labelLine1: 'Rougher conc. — solubles',
    labelLine2: 'Soluble salts in rougher concentrate',
    finalRecovery: 0.018,
    rougherRecovery: 0.57,
  },
  {
    schemaKey: 'rougher.output.concentrate_au',
    labelLine1: 'Rougher conc. — Au',
    labelLine2: 'Gold in rougher concentrate',
    finalRecovery: -0.034,
    rougherRecovery: 0.56,
  },
  {
    schemaKey: 'rougher.output.recovery',
    labelLine1: 'Rougher recovery',
    labelLine2: 'Target: rougher recovery rate',
    finalRecovery: 0.33,
    rougherRecovery: 1,
  },
  {
    schemaKey: 'rougher.output.tail_ag',
    labelLine1: 'Rougher tail — Ag',
    labelLine2: 'Silver in rougher flotation tailings',
    finalRecovery: -0.15,
    rougherRecovery: -0.26,
  },
  {
    schemaKey: 'rougher.output.tail_sol',
    labelLine1: 'Rougher tail — solubles',
    labelLine2: 'Soluble salts in rougher tailings',
    finalRecovery: -0.32,
    rougherRecovery: -0.31,
  },
  {
    schemaKey: 'rougher.output.tail_au',
    labelLine1: 'Rougher tail — Au',
    labelLine2: 'Gold in rougher flotation tailings',
    finalRecovery: -0.33,
    rougherRecovery: -0.38,
  },
  {
    schemaKey: 'rougher.state.floatbank10_c_air',
    labelLine1: 'Rougher cell 10 — air (C)',
    labelLine2: 'Air rate in rougher cell 10, channel C',
    finalRecovery: 0.23,
    rougherRecovery: 0.17,
  },
  {
    schemaKey: 'secondary_cleaner.output.tail_au',
    labelLine1: 'Secondary tail — Au',
    labelLine2: 'Gold in secondary cleaner tailings',
    finalRecovery: -0.35,
    rougherRecovery: -0.15,
  },
  {
    schemaKey: 'secondary_cleaner.state.floatbank2_a_level',
    labelLine1: 'Secondary bank 2 — level A',
    labelLine2: 'Float level in secondary cleaner bank 2',
    finalRecovery: 0.21,
    rougherRecovery: 0.25,
  },
  {
    schemaKey: 'secondary_cleaner.state.floatbank4_b_air',
    labelLine1: 'Secondary bank 4 — air B',
    labelLine2: 'Air rate in secondary cleaner bank 4B',
    finalRecovery: 0.17,
    rougherRecovery: 0.24,
  },
  {
    schemaKey: 'rougher.output.recovery#2',
    labelLine1: 'Rougher recovery',
    labelLine2: 'Duplicate rougher recovery row (as in source heatmap)',
    finalRecovery: 0.33,
    rougherRecovery: 1,
  },
];

export type DailyPoint = { day: number; [key: string]: number };

function makeDailySeries(
  keys: string[],
  base: number[],
  drift: number[],
  noise: number,
  n = 120,
): DailyPoint[] {
  const out: DailyPoint[] = [];
  for (let d = 0; d < n; d++) {
    const row: DailyPoint = { day: d };
    keys.forEach((k, i) => {
      const wobble = Math.sin(d / 11 + i) * noise + Math.sin(d * 2.17 + i * 1.41) * noise * 0.35;
      row[k] = Math.max(0, base[i] + drift[i] * (d / n) * 0.15 + wobble);
    });
    out.push(row);
  }
  return out;
}

/** Au: concentration rises rougher → primary → final (notebook narrative). */
export const AU_LINES = makeDailySeries(
  ['rougher.output.concentrate_au', 'primary_cleaner.output.concentrate_au', 'final.output.concentrate_au'],
  [19, 32, 40],
  [22, 18, 28],
  2.2,
);

export const AG_LINES = makeDailySeries(
  ['rougher.output.concentrate_ag', 'primary_cleaner.output.concentrate_ag', 'final.output.concentrate_ag'],
  [12, 8.5, 5.2],
  [-3, -2.5, -1],
  1.1,
);

export const PB_LINES = makeDailySeries(
  ['rougher.output.concentrate_pb', 'primary_cleaner.output.concentrate_pb', 'final.output.concentrate_pb'],
  [7.6, 9.6, 10.2],
  [1.2, 0.8, 0.5],
  0.65,
);

/** By-stage view: Au through process chain. */
export const STAGE_AU_LINES = makeDailySeries(
  ['rougher (Au)', 'primary_cleaner (Au)', 'final (Au)'],
  [19, 32, 44],
  [15, 12, 8],
  2.0,
);

export const STAGE_AG_LINES = makeDailySeries(
  ['rougher (Ag)', 'primary_cleaner (Ag)', 'final (Ag)'],
  [11.8, 8.2, 5.1],
  [-2, -1.5, -0.8],
  0.9,
);

export const STAGE_PB_LINES = makeDailySeries(
  ['rougher (Pb)', 'primary_cleaner (Pb)', 'final (Pb)'],
  [7.7, 9.6, 10.1],
  [0.8, 0.5, 0.3],
  0.5,
);

/** Histogram bins for daily mean feed_size (train vs test), rougher.input.feed_size < 150. */
export const FEED_SIZE_HIST = {
  bins: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150] as number[],
  train: [2, 8, 22, 45, 62, 58, 48, 35, 22, 14, 9, 6, 3],
  test: [4, 12, 28, 52, 55, 44, 32, 20, 12, 8, 5, 3, 2],
};

export const TOTAL_CONC_BEFORE = {
  label: 'Before row filters',
  series: [
    { name: 'feed (sum)', values: [0, 2, 5, 12, 28, 48, 62, 55, 38, 22, 12, 6] },
    { name: 'rougher conc (sum)', values: [0, 1, 4, 10, 24, 44, 58, 52, 36, 20, 10, 5] },
    { name: 'final conc (sum)', values: [0, 1, 3, 8, 18, 32, 46, 50, 44, 30, 16, 8] },
  ],
  binEdges: [0, 15, 30, 45, 60, 75, 90, 105, 120, 140, 160, 180, 220],
};

export const TOTAL_CONC_AFTER = {
  label: 'After removing low totals & outliers',
  series: [
    { name: 'feed (sum)', values: [0, 0, 1, 4, 14, 38, 58, 52, 34, 16, 6, 2] },
    { name: 'rougher conc (sum)', values: [0, 0, 1, 3, 12, 34, 54, 48, 32, 14, 5, 1] },
    { name: 'final conc (sum)', values: [0, 0, 1, 3, 10, 28, 46, 50, 40, 22, 8, 2] },
  ],
  binEdges: [0, 15, 30, 45, 60, 75, 90, 105, 120, 140, 160, 180, 220],
};
