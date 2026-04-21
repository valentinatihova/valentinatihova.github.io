import React, { useEffect, useId, useRef } from 'react';
import * as d3 from 'd3';
import {
  AG_LINES,
  AU_LINES,
  FEED_SIZE_HIST,
  PB_LINES,
  RECOVERY_CORR_HEATMAP,
  STAGE_AG_LINES,
  STAGE_AU_LINES,
  STAGE_PB_LINES,
  TOTAL_CONC_AFTER,
  TOTAL_CONC_BEFORE,
  type DailyPoint,
  type HeatmapCell,
} from '../../data/zyfraVizData';

const wrapChart = (title: string, subtitle: string | undefined, children: React.ReactNode) => (
  <div className="not-prose my-10 rounded-2xl border border-stone-700/80 bg-stone-900/60 p-6 md:p-8">
    <h3 className="font-serif text-lg font-semibold tracking-tight text-stone-50 md:text-xl">{title}</h3>
    {subtitle ? (
      <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-stone-400 md:text-[0.9375rem]">{subtitle}</p>
    ) : null}
    {children}
  </div>
);

/** Diverging scale aligned with the notebook heatmap screenshot (purple → cream). */
function recoveryColor(v: number): string {
  return d3
    .scaleSequential<string>(d3.interpolateRgbBasis(['#1a0d2b', '#5c1f3a', '#9e1a44', '#e86b4a', '#f28d5e', '#f7e8d0']))
    .domain([-0.5, 1])
    .clamp(true)(v) as string;
}

function formatHeatmapCellValue(v: number): string {
  const a = Math.abs(v);
  if (a > 0 && a < 0.1) return v.toFixed(3);
  return v.toFixed(2);
}

export const ZyfraRecoveryHeatmap: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  const gradId = useId().replace(/:/g, '');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rows: HeatmapCell[] = RECOVERY_CORR_HEATMAP;
    const cols = [
      { key: 'finalRecovery' as const, line1: 'Final stage', line2: 'recovery' },
      { key: 'rougherRecovery' as const, line1: 'Rougher stage', line2: 'recovery' },
    ];

    const margin = { top: 44, right: 28, bottom: 40, left: 8 };
    const labelColW = 318;
    const cw = 76;
    const ch = 36;
    const gridLeft = margin.left + labelColW;
    const width = gridLeft + cols.length * cw + margin.right;
    const legendBarH = 8;
    const legendGap = 16;
    const height = margin.top + rows.length * ch + legendGap + legendBarH + margin.bottom;

    const svg = d3.select(el).attr('viewBox', `0 0 ${width} ${height}`).style('width', '100%').style('height', 'auto');
    svg.selectAll('*').remove();

    cols.forEach((c, j) => {
      const cx = gridLeft + j * cw + cw / 2;
      svg
        .append('text')
        .attr('x', cx)
        .attr('y', margin.top - 22)
        .attr('text-anchor', 'middle')
        .attr('fill', '#d6d3d1')
        .attr('font-family', 'system-ui, sans-serif')
        .attr('font-size', 10)
        .attr('font-weight', 600)
        .text(c.line1);
      svg
        .append('text')
        .attr('x', cx)
        .attr('y', margin.top - 8)
        .attr('text-anchor', 'middle')
        .attr('fill', '#a8a29e')
        .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
        .attr('font-size', 9)
        .text(c.line2);
    });

    rows.forEach((row, i) => {
      const y0 = margin.top + i * ch;
      const cy = y0 + ch / 2;

      svg
        .append('text')
        .attr('x', margin.left + labelColW - 12)
        .attr('y', cy)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#d6d3d1')
        .attr('font-family', 'Georgia, ui-serif, serif')
        .attr('font-size', 10)
        .attr('font-weight', 500)
        .text(row.labelLine2);

      cols.forEach((c, j) => {
        const v = row[c.key];
        const cell = svg.append('g').attr('transform', `translate(${gridLeft + j * cw},${y0})`);
        const fill = recoveryColor(v);
        const rgb = d3.rgb(fill);
        const lum = rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722;
        cell
          .append('rect')
          .attr('width', cw - 6)
          .attr('height', ch - 6)
          .attr('rx', 5)
          .attr('fill', fill)
          .attr('aria-label', `${row.labelLine2}, ${c.key === 'finalRecovery' ? 'final' : 'rougher'} recovery r ${formatHeatmapCellValue(v)}`);
        const textFill = lum > 165 ? '#1c1917' : '#fafaf9';
        cell
          .append('text')
          .attr('x', (cw - 6) / 2)
          .attr('y', (ch - 6) / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', textFill)
          .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
          .attr('font-size', 10)
          .attr('font-weight', 700)
          .attr('pointer-events', 'none')
          .text(formatHeatmapCellValue(v));
      });
    });

    const legendW = Math.min(280, width - margin.left - margin.right);
    const lx = margin.left + (width - margin.left - margin.right - legendW) / 2;
    const ly = margin.top + rows.length * ch + legendGap;
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', gradId).attr('x1', '0%').attr('x2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#1a0d2b');
    grad.append('stop').attr('offset', '35%').attr('stop-color', '#9e1a44');
    grad.append('stop').attr('offset', '72%').attr('stop-color', '#f28d5e');
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#f7e8d0');
    svg
      .append('rect')
      .attr('x', lx)
      .attr('y', ly)
      .attr('width', legendW)
      .attr('height', legendBarH)
      .attr('rx', 4)
      .attr('fill', `url(#${gradId})`);
  }, [gradId]);

  return wrapChart(
    'Recovery drivers (heatmap)',
    'Same logic as the notebook: keep features strongly tied to final or rougher recovery before modeling.',
    <svg ref={ref} className="mt-6 w-full" aria-label="Correlation heatmap for recovery targets" />,
  );
};

type LineSpec = { key: string; color: string; label: string };

function ConcentrationChart({
  title,
  subtitle,
  data,
  lines,
  yLabel,
}: {
  title: string;
  subtitle: string;
  data: DailyPoint[];
  lines: LineSpec[];
  yLabel: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const margin = { top: 16, right: 120, bottom: 40, left: 52 };
    const width = 720 - margin.left - margin.right;
    const height = 220 - margin.top - margin.bottom;

    const allVals: number[] = [];
    data.forEach((d) => lines.forEach((L) => allVals.push(d[L.key] as number)));
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(allVals)! * 1.08])
      .nice()
      .range([height, 0]);
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.day) as [number, number])
      .range([0, width]);

    const svg = d3
      .select(el)
      .attr('viewBox', `0 0 720 260`)
      .style('width', '100%')
      .style('height', 'auto');
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat((d) => `day ${d}`))
      .call((s) => s.selectAll('text').attr('fill', '#a8a29e').attr('font-size', 10).attr('font-family', 'JetBrains Mono, ui-monospace, monospace'))
      .call((s) => s.selectAll('path,line').attr('stroke', '#57534e'));

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .call((s) => s.selectAll('text').attr('fill', '#a8a29e').attr('font-size', 10).attr('font-family', 'JetBrains Mono, ui-monospace, monospace'))
      .call((s) => s.selectAll('path,line').attr('stroke', '#57534e'));

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#78716c')
      .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
      .attr('font-size', 10)
      .text(yLabel);

    lines.forEach((L) => {
      const lg = d3
        .line<DailyPoint>()
        .x((d) => x(d.day))
        .y((d) => y(d[L.key] as number))
        .curve(d3.curveMonotoneX);
      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', L.color)
        .attr('stroke-width', 2)
        .attr('d', lg);

      g.append('text')
        .attr('x', width + 10)
        .attr('y', y(data[data.length - 1]![L.key] as number))
        .attr('dominant-baseline', 'middle')
        .attr('fill', L.color)
        .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
        .attr('font-size', 10)
        .text(L.label);
    });
  }, [data, JSON.stringify(lines)]);

  return wrapChart(title, subtitle, <svg ref={ref} className="mt-6 w-full" aria-label={title} />);
}

export const ZyfraMetalConcentrationCharts: React.FC = () => (
  <div className="not-prose space-y-10">
    <ConcentrationChart
      title="Gold (Au) — daily mean concentration"
      subtitle="Rougher → primary cleaner → final output (representative resampled series)."
      data={AU_LINES}
      yLabel="Concentration"
      lines={[
        { key: 'rougher.output.concentrate_au', color: '#94a3b8', label: 'rougher' },
        { key: 'primary_cleaner.output.concentrate_au', color: '#38bdf8', label: 'primary' },
        { key: 'final.output.concentrate_au', color: '#fbbf24', label: 'final' },
      ]}
    />
    <ConcentrationChart
      title="Silver (Ag) — daily mean concentration"
      subtitle="Silver tends to fall through the chain in this process slice."
      data={AG_LINES}
      yLabel="Concentration"
      lines={[
        { key: 'rougher.output.concentrate_ag', color: '#94a3b8', label: 'rougher' },
        { key: 'primary_cleaner.output.concentrate_ag', color: '#38bdf8', label: 'primary' },
        { key: 'final.output.concentrate_ag', color: '#fbbf24', label: 'final' },
      ]}
    />
    <ConcentrationChart
      title="Lead (Pb) — daily mean concentration"
      subtitle="Moderate rise toward final concentrate."
      data={PB_LINES}
      yLabel="Concentration"
      lines={[
        { key: 'rougher.output.concentrate_pb', color: '#94a3b8', label: 'rougher' },
        { key: 'primary_cleaner.output.concentrate_pb', color: '#38bdf8', label: 'primary' },
        { key: 'final.output.concentrate_pb', color: '#fbbf24', label: 'final' },
      ]}
    />
  </div>
);

export const ZyfraStageConcentrationCharts: React.FC = () => (
  <div className="not-prose space-y-10">
    <ConcentrationChart
      title="By stage — gold (Au)"
      subtitle="All Au concentrate streams resampled by day for each stage bucket."
      data={STAGE_AU_LINES}
      yLabel="Concentration"
      lines={[
        { key: 'rougher (Au)', color: '#94a3b8', label: 'rougher' },
        { key: 'primary_cleaner (Au)', color: '#38bdf8', label: 'primary' },
        { key: 'final (Au)', color: '#fbbf24', label: 'final' },
      ]}
    />
    <ConcentrationChart
      title="By stage — silver (Ag)"
      subtitle="Stage-wise Ag lines for the same daily aggregation window."
      data={STAGE_AG_LINES}
      yLabel="Concentration"
      lines={[
        { key: 'rougher (Ag)', color: '#94a3b8', label: 'rougher' },
        { key: 'primary_cleaner (Ag)', color: '#38bdf8', label: 'primary' },
        { key: 'final (Ag)', color: '#fbbf24', label: 'final' },
      ]}
    />
    <ConcentrationChart
      title="By stage — lead (Pb)"
      subtitle="Pb across flotation and cleaning chain."
      data={STAGE_PB_LINES}
      yLabel="Concentration"
      lines={[
        { key: 'rougher (Pb)', color: '#94a3b8', label: 'rougher' },
        { key: 'primary_cleaner (Pb)', color: '#38bdf8', label: 'primary' },
        { key: 'final (Pb)', color: '#fbbf24', label: 'final' },
      ]}
    />
  </div>
);

export const ZyfraFeedSizeHistogram: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { bins, train, test } = FEED_SIZE_HIST;
    const margin = { top: 16, right: 24, bottom: 44, left: 48 };
    const width = 720 - margin.left - margin.right;
    const height = 240 - margin.top - margin.bottom;
    const n = bins.length - 1;
    const xLin = d3
      .scaleLinear()
      .domain([bins[0]!, bins[n]!])
      .range([0, width]);
    const maxY = d3.max([...train, ...test])!;
    const y = d3.scaleLinear().domain([0, maxY * 1.05]).nice().range([height, 0]);

    const svg = d3
      .select(el)
      .attr('viewBox', `0 0 720 280`)
      .style('width', '100%')
      .style('height', 'auto');
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('g.bin')
      .data(d3.range(n))
      .join('g')
      .attr('class', 'bin')
      .each(function (di) {
        const i = di as number;
        const x0p = xLin(bins[i]!);
        const x1p = xLin(bins[i + 1]!);
        const bw = Math.max(4, (x1p - x0p) * 0.36);
        const cx = (x0p + x1p) / 2;
        const gg = d3.select(this);
        gg.append('rect')
          .attr('x', cx - bw - 2)
          .attr('y', y(train[i]!))
          .attr('width', bw)
          .attr('height', height - y(train[i]!))
          .attr('fill', '#38bdf8')
          .attr('opacity', 0.75);
        gg.append('rect')
          .attr('x', cx + 2)
          .attr('y', y(test[i]!))
          .attr('width', bw)
          .attr('height', height - y(test[i]!))
          .attr('fill', '#f97316')
          .attr('opacity', 0.75);
      });
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xLin).ticks(10).tickFormat(d3.format('d')))
      .call((s) => s.selectAll('text').attr('fill', '#a8a29e').attr('font-size', 9).attr('font-family', 'JetBrains Mono, ui-monospace, monospace'))
      .call((s) => s.selectAll('path,line').attr('stroke', '#57534e'));

    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 32)
      .attr('text-anchor', 'middle')
      .attr('fill', '#78716c')
      .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
      .attr('font-size', 10)
      .text('rougher.input.feed_size (daily mean, bin midpoints)');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .call((s) => s.selectAll('text').attr('fill', '#a8a29e').attr('font-size', 10).attr('font-family', 'JetBrains Mono, ui-monospace, monospace'))
      .call((s) => s.selectAll('path,line').attr('stroke', '#57534e'));

    const leg = g.append('g').attr('transform', `translate(${width - 160}, -6)`);
    leg.append('rect').attr('width', 12).attr('height', 12).attr('fill', '#38bdf8').attr('opacity', 0.75);
    leg.append('text').attr('x', 18).attr('y', 10).attr('fill', '#e7e5e4').attr('font-size', 10).attr('font-family', 'JetBrains Mono, ui-monospace, monospace').text('train');
    leg.append('rect').attr('y', 18).attr('width', 12).attr('height', 12).attr('fill', '#f97316').attr('opacity', 0.75);
    leg.append('text').attr('x', 18).attr('y', 28).attr('fill', '#e7e5e4').attr('font-size', 10).attr('font-family', 'JetBrains Mono, ui-monospace, monospace').text('test');
  }, []);

  return wrapChart(
    'Feed size — train vs test (binned daily means)',
    'Notebook compares distributions below 150µm; bars are illustrative counts per bin, not raw row histograms.',
    <svg ref={ref} className="mt-6 w-full" aria-label="Feed size train versus test histogram" />,
  );
};

type TotalPack = typeof TOTAL_CONC_BEFORE;

function TotalConcChart({ pack, title, subtitle }: { pack: TotalPack; title: string; subtitle: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const margin = { top: 12, right: 24, bottom: 44, left: 48 };
    const width = 720 - margin.left - margin.right;
    const height = 220 - margin.top - margin.bottom;
    const edges = pack.binEdges;
    const n = edges.length - 1;
    const x = d3
      .scaleLinear()
      .domain([edges[0]!, edges[n]!])
      .range([0, width]);
    const maxY = d3.max(pack.series.flatMap((s) => s.values))!;
    const y = d3.scaleLinear().domain([0, maxY * 1.08]).nice().range([height, 0]);

    const svg = d3
      .select(el)
      .attr('viewBox', `0 0 720 260`)
      .style('width', '100%')
      .style('height', 'auto');
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const colors = ['#94a3b8', '#38bdf8', '#fbbf24'];
    pack.series.forEach((s, si) => {
      const line = d3
        .line<number>()
        .x((_, i) => x((edges[i]! + edges[i + 1]!) / 2))
        .y((v) => y(v))
        .curve(d3.curveMonotoneX);
      g.append('path')
        .datum(s.values)
        .attr('fill', 'none')
        .attr('stroke', colors[si % colors.length]!)
        .attr('stroke-width', 2)
        .attr('d', line);

      g.append('text')
        .attr('x', width + 8)
        .attr('y', y(s.values[n - 1]!))
        .attr('dominant-baseline', 'middle')
        .attr('fill', colors[si % colors.length]!)
        .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
        .attr('font-size', 10)
        .text(s.name);
    });

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(8))
      .call((s) => s.selectAll('text').attr('fill', '#a8a29e').attr('font-size', 10).attr('font-family', 'JetBrains Mono, ui-monospace, monospace'))
      .call((s) => s.selectAll('path,line').attr('stroke', '#57534e'));

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .call((s) => s.selectAll('text').attr('fill', '#a8a29e').attr('font-size', 10).attr('font-family', 'JetBrains Mono, ui-monospace, monospace'))
      .call((s) => s.selectAll('path,line').attr('stroke', '#57534e'));

    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 32)
      .attr('text-anchor', 'middle')
      .attr('fill', '#78716c')
      .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
      .attr('font-size', 10)
      .text('Total element concentration (sum of Ag, Au, Pb, Sol) — arbitrary units');
  }, [pack]);

  return wrapChart(title, subtitle, <svg ref={ref} className="mt-6 w-full" aria-label={title} />);
}

export const ZyfraTotalConcentrationCharts: React.FC = () => (
  <div className="not-prose space-y-10">
    <TotalConcChart
      pack={TOTAL_CONC_BEFORE}
      title="Total concentration by stage — before aggressive row filters"
      subtitle="Zero-mass and low-sum rows show up as spikes near the origin; notebook trims them before modeling."
    />
    <TotalConcChart
      pack={TOTAL_CONC_AFTER}
      title="Total concentration by stage — after cleaning"
      subtitle="Distributions tighten once feed / rougher / final sums are bounded above 30 (same logic as notebook)."
    />
  </div>
);
