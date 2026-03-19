'use client';

import '@xyflow/react/dist/style.css';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const ReactFlow = dynamic(
  () => import('@xyflow/react').then((m) => ({ default: m.ReactFlow })),
  { ssr: false }
);

const Background = dynamic(
  () => import('@xyflow/react').then((m) => ({ default: m.Background })),
  { ssr: false }
);

export type ArchNode = {
  id: string;
  label: string;
  tooltip?: string;
  color?: 'green' | 'cyan' | 'purple' | 'orange' | 'default';
  x: number;
  y: number;
};

export type ArchEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
};

const colorMap = {
  green: {
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.5)',
    text: '#22c55e'
  },
  cyan: {
    bg: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.5)',
    text: '#06b6d4'
  },
  purple: {
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.5)',
    text: '#a855f7'
  },
  orange: {
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.5)',
    text: '#f97316'
  },
  default: {
    bg: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.15)',
    text: '#ffffff'
  }
};

const PRO_OPTIONS = { hideAttribution: true };

type ArchDiagramProps = {
  nodes: ArchNode[];
  edges: ArchEdge[];
  height?: number;
};

export function ArchDiagram({ nodes, edges, height = 420 }: ArchDiagramProps) {
  const flowNodes = useMemo(
    () =>
      nodes.map((n) => {
        const scheme = colorMap[n.color ?? 'default'];
        return {
          id: n.id,
          position: { x: n.x, y: n.y },
          data: {
            label: (
              <div
                title={n.tooltip}
                style={{
                  background: scheme.bg,
                  border: `1px solid ${scheme.border}`,
                  color: scheme.text,
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: 'nowrap' as const
                }}
              >
                {n.label}
              </div>
            )
          },
          style: { background: 'transparent', border: 'none', padding: 0 }
        };
      }),
    [nodes]
  );

  const flowEdges = useMemo(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.from,
        target: e.to,
        label: e.label,
        animated: true,
        style: { stroke: 'rgba(255,255,255,0.25)' }
      })),
    [edges]
  );

  return (
    <div
      style={{
        height,
        background: '#060608',
        borderRadius: 12,
        overflow: 'hidden'
      }}
      className='border border-white/[0.07]'
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        fitView
        proOptions={PRO_OPTIONS}
      >
        <Background color='rgba(255,255,255,0.04)' gap={24} />
      </ReactFlow>
    </div>
  );
}
