import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

export const BankChurnViz: React.FC = () => {
  const sankeyRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Stylized Sankey: illustrative cohort routing (not a literal row-level aggregate).
    const data = {
      nodes: [
        // Geography (0-2)
        { name: "France" },
        { name: "Germany" },
        { name: "Spain" },
        // Age Groups (3-5)
        { name: "< 40 Years" },
        { name: "40-50 Years" },
        { name: "> 50 Years" },
        // Balance (6-7)
        { name: "Low/Zero Balance" },
        { name: "High Balance" },
        // Status (8-9)
        { name: "Retained" },
        { name: "Churned" }
      ],
      links: [
        // Geography -> Age
        { source: 0, target: 3, value: 3000 },
        { source: 0, target: 4, value: 1500 },
        { source: 0, target: 5, value: 514 },
        { source: 1, target: 3, value: 1500 },
        { source: 1, target: 4, value: 700 },
        { source: 1, target: 5, value: 309 },
        { source: 2, target: 3, value: 1500 },
        { source: 2, target: 4, value: 700 },
        { source: 2, target: 5, value: 277 },
        
        // Age -> Balance
        { source: 3, target: 6, value: 3000 },
        { source: 3, target: 7, value: 3000 },
        { source: 4, target: 6, value: 1000 },
        { source: 4, target: 7, value: 1900 },
        { source: 5, target: 6, value: 300 },
        { source: 5, target: 7, value: 800 },

        // Balance -> Status
        { source: 6, target: 8, value: 3800 },
        { source: 6, target: 9, value: 500 },
        { source: 7, target: 8, value: 4163 },
        { source: 7, target: 9, value: 1537 }
      ]
    };

    // Render Sankey
    if (sankeyRef.current) {
      d3.select(sankeyRef.current).selectAll("*").remove();
      d3.select(sankeyRef.current).append('title').text('Sankey diagram showing stylized customer churn paths by geography, age band, and balance tier');
      
      const width = 900;
      const height = 500;
      
      const svg = d3.select(sankeyRef.current)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("width", "100%")
        .style("height", "auto");

      // Set up sankey generator
      const sankeyGenerator = sankey<any, any>()
        .nodeWidth(24)
        .nodePadding(25)
        .extent([[10, 10], [width - 10, height - 10]]);

      const { nodes, links } = sankeyGenerator({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d))
      });

      // Draw links
      const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.25)
        .selectAll("g")
        .data(links)
        .join("g")
        .style("mix-blend-mode", "screen");

      link.append("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", d => d.target.name === "Churned" ? "#ef4444" : "#10b981")
        .attr("stroke-width", d => Math.max(1, d.width || 0))
        .style("transition", "stroke-opacity 0.3s")
        .on("mouseover", function() { d3.select(this).attr("stroke-opacity", 0.6); })
        .on("mouseout", function() { d3.select(this).attr("stroke-opacity", 0.25); });

      // Draw nodes
      const node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g");

      node.append("rect")
        .attr("x", d => d.x0 || 0)
        .attr("y", d => d.y0 || 0)
        .attr("height", d => (d.y1 || 0) - (d.y0 || 0))
        .attr("width", d => (d.x1 || 0) - (d.x0 || 0))
        .attr("fill", d => {
          if (d.name === "Churned") return "#ef4444";
          if (d.name === "Retained") return "#10b981";
          return "#3f3f46";
        })
        .attr("rx", 4);

      node.append("text")
        .attr("x", d => ((d.x0 || 0) < width / 2) ? (d.x1 || 0) + 12 : (d.x0 || 0) - 12)
        .attr("y", d => ((d.y1 || 0) + (d.y0 || 0)) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => ((d.x0 || 0) < width / 2) ? "start" : "end")
        .text(d => d.name)
        .attr("fill", "#fafafa")
        .attr("font-size", "14px")
        .attr("font-family", "JetBrains Mono, ui-monospace, monospace")
        .attr("font-weight", "600");
        
      node.append("text")
        .attr("x", d => ((d.x0 || 0) < width / 2) ? (d.x1 || 0) + 12 : (d.x0 || 0) - 12)
        .attr("y", d => ((d.y1 || 0) + (d.y0 || 0)) / 2 + 18)
        .attr("text-anchor", d => ((d.x0 || 0) < width / 2) ? "start" : "end")
        .text((d: { value?: number }) => (d.value != null ? d.value.toLocaleString() : ""))
        .attr("fill", "#a8a29e")
        .attr("font-size", "12px")
        .attr("font-family", "JetBrains Mono, ui-monospace, monospace");
    }
  }, []);

  return (
    <div className="my-12 not-prose">
      <div className="rounded-2xl border border-stone-700/80 bg-stone-900/60 p-6 md:p-8">
        <h3 className="font-serif text-xl font-semibold tracking-tight text-stone-50 md:text-2xl">
          Stylized churn paths (D3 Sankey)
        </h3>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-stone-400 md:text-[0.9375rem]">
          Illustrative flow across geography → age band → balance tier → outcome. Link widths are{' '}
          <strong className="text-stone-200">not</strong> a literal aggregation of all 10k rows from the notebook; they
          communicate the <em className="text-stone-300">shape</em> of the story (older, higher-balance cohorts feeding
          churn) for portfolio reading. For exact tables and plots, use the GitHub notebook.
        </p>
        <svg ref={sankeyRef} role="img" className="mt-8 w-full" aria-label="Sankey diagram of stylized customer paths" />
      </div>
    </div>
  );
};
