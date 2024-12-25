import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { parseCodeToAST } from './ast';

interface FlowChartProps {
  code: string;
}

const FlowChart: React.FC<FlowChartProps> = ({ code }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (chartRef.current && code) {
      const svg = d3.select(chartRef.current);
      svg.selectAll('*').remove();

      const ast = parseCodeToAST(code);
      if (ast) {
        visualizeAST(svg, ast);
      }
    }
  }, [code]);

  // 递归遍历 AST 并渲染节点
  const visualizeAST = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, ast: any) => {
    const nodes: any[] = [];
    const links: any[] = [];

    traverseAST(ast, nodes, links);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(400, 300));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', '#999');

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 8)
      .attr('fill', '#007acc');

    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d: any) => d.name)
      .attr('x', 10)
      .attr('y', 5);

    simulation.on('tick', () => {
      link.attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);

      label.attr('x', (d: any) => d.x + 10)
           .attr('y', (d: any) => d.y);
    });
  };

  const traverseAST = (node: any, nodes: any[], links: any[]) => {
    if (!node || typeof node !== 'object') return;

    const id = `${node.type}-${nodes.length}`;
    nodes.push({ id, name: node.type });

    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        const childId = `${node[key].type}-${nodes.length}`;
        links.push({ source: id, target: childId });
        traverseAST(node[key], nodes, links);
      }
    }
  };

  return <svg ref={chartRef} width="800" height="600"></svg>;
};

export default FlowChart;