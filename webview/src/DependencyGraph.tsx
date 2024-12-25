import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GraphProps {
  graphData: any;
}

const DependencyGraph: React.FC<GraphProps> = ({ graphData }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (graphData && ref.current) {
      const svg = d3.select(ref.current);
      svg.selectAll('*').remove();

      const simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.links).distance(100))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(400, 300));

      svg.append('g')
        .selectAll('line')
        .data(graphData.links)
        .enter()
        .append('line')
        .style('stroke', '#aaa');

      svg.append('g')
        .selectAll('circle')
        .data(graphData.nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', '#007acc');

      simulation.on('tick', () => {
        svg.selectAll('circle')
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
      });
    }
  }, [graphData]);

  return <svg ref={ref} width="800" height="600"></svg>;
};

export default DependencyGraph;