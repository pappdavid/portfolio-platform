'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type GraphNode = {
  id: string;
  label: string;
  type: 'component' | 'service' | 'route' | 'model' | 'external';
};

export type GraphEdge = {
  source: string;
  target: string;
  label?: string;
};

export type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const NODE_COLORS: Record<GraphNode['type'], string> = {
  component: 'hsl(220 70% 55%)',
  service: 'hsl(160 60% 45%)',
  route: 'hsl(280 60% 55%)',
  model: 'hsl(35 80% 50%)',
  external: 'hsl(0 60% 55%)'
};

const NODE_RADIUS = 20;

export function D3IntegrationGraph({
  data,
  className
}: {
  data: GraphData;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;
    const container = containerRef.current;
    const svgEl = svgRef.current;
    let cancelled = false;

    import('d3').then((d3) => {
      if (cancelled) return;

      const width = container.clientWidth || 600;
      const height = 420;

      // Clear previous
      d3.select(svgEl).selectAll('*').remove();

      const svg = d3
        .select(svgEl)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('overflow', 'hidden');

      // Arrow marker
      svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', NODE_RADIUS + 10)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', 'hsl(215 20% 55%)');

      const zoomGroup = svg.append('g');

      // Pan + zoom
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 4])
        .on('zoom', (event) => {
          zoomGroup.attr('transform', event.transform);
        });
      svg.call(zoom);

      // Build simulation
      const nodes: (GraphNode & d3.SimulationNodeDatum)[] = data.nodes.map(
        (n) => ({ ...n })
      );
      const nodeById = new Map(nodes.map((n) => [n.id, n]));

      type SimLink = d3.SimulationLinkDatum<typeof nodes[0]> & {
        label?: string;
      };
      const links: SimLink[] = data.edges.map((e) => ({
        source: nodeById.get(e.source) ?? e.source,
        target: nodeById.get(e.target) ?? e.target,
        label: e.label
      }));

      const simulation = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3
            .forceLink<typeof nodes[0], SimLink>(links)
            .id((d) => d.id)
            .distance(100)
        )
        .force('charge', d3.forceManyBody().strength(-220))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide(NODE_RADIUS + 8));

      // Links
      const link = zoomGroup
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', 'hsl(215 20% 55%)')
        .attr('stroke-opacity', 0.5)
        .attr('stroke-width', 1.5)
        .attr('marker-end', 'url(#arrow)');

      // Node groups
      const node = zoomGroup
        .append('g')
        .attr('class', 'nodes')
        .selectAll<SVGGElement, typeof nodes[0]>('g')
        .data(nodes)
        .join('g')
        .attr('cursor', 'pointer')
        .call(
          d3
            .drag<SVGGElement, typeof nodes[0]>()
            .on('start', (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on('drag', (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on('end', (event, d) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
        )
        .on('click', (_event, d) => {
          setHighlighted((prev) => (prev === d.id ? null : d.id));
        });

      node
        .append('circle')
        .attr('r', NODE_RADIUS)
        .attr('fill', (d) => NODE_COLORS[d.type])
        .attr('stroke', 'hsl(215 15% 80%)')
        .attr('stroke-width', 1.5);

      node
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', NODE_RADIUS + 14)
        .attr('font-size', '10px')
        .attr('fill', 'hsl(215 15% 70%)')
        .text((d) => d.label);

      node
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', '8px')
        .attr('fill', '#fff')
        .attr('pointer-events', 'none')
        .text((d) => d.type.slice(0, 3).toUpperCase());

      simulation.on('tick', () => {
        link
          .attr('x1', (d) => (d.source as typeof nodes[0]).x ?? 0)
          .attr('y1', (d) => (d.source as typeof nodes[0]).y ?? 0)
          .attr('x2', (d) => (d.target as typeof nodes[0]).x ?? 0)
          .attr('y2', (d) => (d.target as typeof nodes[0]).y ?? 0);

        node.attr(
          'transform',
          (d) => `translate(${d.x ?? 0},${d.y ?? 0})`
        );
      });

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  // NOTE: `highlighted` is intentionally excluded from this effect's deps.
  // The D3 simulation setup (expensive) only reruns when `data` changes.
  // Highlight updates are handled by the separate effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Highlight effect (runs after D3 renders)
  useEffect(() => {
    if (!svgRef.current) return;
    import('d3').then((d3) => {
      const svg = d3.select(svgRef.current);

      // Build adjacency for highlight
      const neighborIds = new Set<string>();
      if (highlighted) {
        neighborIds.add(highlighted);
        data.edges.forEach((e) => {
          if (e.source === highlighted) neighborIds.add(e.target);
          if (e.target === highlighted) neighborIds.add(e.source);
        });
      }

      svg
        .selectAll<SVGGElement, GraphNode>('.nodes g')
        .selectAll<SVGCircleElement, GraphNode>('circle')
        .attr('opacity', (d: GraphNode) =>
          !highlighted || neighborIds.has(d.id) ? 1 : 0.2
        )
        .attr('stroke', (d: GraphNode) =>
          highlighted && d.id === highlighted
            ? 'white'
            : 'hsl(215 15% 80%)'
        )
        .attr('stroke-width', (d: GraphNode) =>
          highlighted && d.id === highlighted ? 3 : 1.5
        );

      svg
        .selectAll<SVGLineElement, { source: GraphNode; target: GraphNode }>(
          '.links line'
        )
        .attr('stroke-opacity', (d) => {
          if (!highlighted) return 0.5;
          return neighborIds.has((d.source as GraphNode).id) &&
            neighborIds.has((d.target as GraphNode).id)
            ? 0.9
            : 0.1;
        });
    });
  }, [highlighted, data]);

  return (
    <div className={cn('relative flex flex-col gap-3', className)}>
      {/* Legend */}
      <div className='flex flex-wrap gap-3 text-xs'>
        {(
          Object.entries(NODE_COLORS) as [GraphNode['type'], string][]
        ).map(([type, color]) => (
          <span key={type} className='flex items-center gap-1.5'>
            <span
              className='inline-block h-3 w-3 rounded-full'
              style={{ background: color }}
            />
            <span className='text-muted-foreground capitalize'>{type}</span>
          </span>
        ))}
        <span className='text-muted-foreground ml-auto hidden sm:inline'>
          Drag nodes · Scroll to zoom · Click to highlight
        </span>
      </div>

      {/* Graph canvas */}
      <div
        ref={containerRef}
        className='bg-muted/20 relative w-full overflow-hidden rounded-lg border'
        style={{ height: 420 }}
      >
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='text-muted-foreground text-sm'>
              Loading graph…
            </span>
          </div>
        )}
        <svg ref={svgRef} className='w-full' />
      </div>

      {highlighted && (
        <p className='text-muted-foreground text-center text-xs'>
          Click the highlighted node again to deselect.
        </p>
      )}
    </div>
  );
}
