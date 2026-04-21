import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/** Representative F1 scores from the learning project (validation / test). */
const METRICS: { label: string; f1: number; emphasis: boolean }[] = [
  { label: 'Decision tree (default, best depth)', f1: 0.521, emphasis: false },
  { label: 'Random forest (default, best n)', f1: 0.473, emphasis: false },
  { label: 'Random forest + class_weight (validation)', f1: 0.593, emphasis: false },
  { label: 'Random forest + class_weight (held-out test)', f1: 0.613, emphasis: true },
];

export const BankChurnMetricsViz: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgEl = ref.current;
    if (!svgEl) return;

    const margin = { top: 28, right: 80, bottom: 36, left: 8 };
    const width = 720 - margin.left - margin.right;
    const height = 260 - margin.top - margin.bottom;

    const svg = d3
      .select(svgEl)
      .attr('viewBox', `0 0 720 260`)
      .style('width', '100%')
      .style('height', 'auto');

    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, 0.75])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(METRICS.map((d) => d.label))
      .range([0, height])
      .padding(0.28);

    g.append('line')
      .attr('x1', x(0.59))
      .attr('x2', x(0.59))
      .attr('y1', -6)
      .attr('y2', height + 6)
      .attr('stroke', '#fbbf24')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6 4')
      .attr('opacity', 0.85);

    g.append('text')
      .attr('x', x(0.59) + 6)
      .attr('y', -10)
      .attr('fill', '#fcd34d')
      .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
      .attr('font-size', 10)
      .attr('font-weight', 600)
      .text('Course bar F1 = 0.59');

    const bars = g
      .selectAll('rect')
      .data(METRICS)
      .join('rect')
      .attr('y', (d) => y(d.label) ?? 0)
      .attr('height', y.bandwidth())
      .attr('rx', 5)
      .attr('fill', (d) => (d.emphasis ? '#38bdf8' : '#57534e'))
      .attr('opacity', (d) => (d.emphasis ? 0.95 : 0.55));

    bars
      .attr('x', 0)
      .attr('width', 0)
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('width', (d) => x(d.f1));

    g.selectAll('text.label')
      .data(METRICS)
      .join('text')
      .attr('class', 'label')
      .attr('x', 8)
      .attr('y', (d) => (y(d.label) ?? 0) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', '#fafaf9')
      .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .text((d) => d.label);

    g.selectAll('text.value')
      .data(METRICS)
      .join('text')
      .attr('class', 'value')
      .attr('x', (d) => x(d.f1) + 10)
      .attr('y', (d) => (y(d.label) ?? 0) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', '#d6d3d1')
      .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
      .attr('font-size', 12)
      .text((d) => d.f1.toFixed(3));

    const xAxis = d3.axisBottom(x).ticks(6).tickFormat(d3.format('.2f'));
    g.append('g')
      .attr('transform', `translate(0,${height + 6})`)
      .call(xAxis)
      .call((s) => s.selectAll('path,line').attr('stroke', '#57534e'))
      .call((s) => s.selectAll('text').attr('fill', '#a8a29e').attr('font-size', 10).attr('font-family', 'JetBrains Mono, ui-monospace, monospace'));
  }, []);

  return (
    <div className="my-12 not-prose">
      <div className="rounded-2xl border border-stone-700/80 bg-stone-900/60 p-6 md:p-8">
        <h3 className="font-serif text-xl font-semibold tracking-tight text-stone-50 md:text-2xl">
          F1 trajectory (summary)
        </h3>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-stone-400 md:text-[0.9375rem]">
          Horizontal bars show how far default tree/forest baselines were from the final class-weighted random forest on
          validation and test. The amber guide marks the project success threshold (F1 ≥ 0.59).
        </p>
        <svg ref={ref} className="mt-8 w-full" aria-label="F1 score bar chart for churn models" />
      </div>
    </div>
  );
};
