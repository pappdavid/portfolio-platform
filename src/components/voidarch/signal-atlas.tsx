'use client';

import {
  VOIDARCH_EDGES,
  VOIDARCH_NODES,
  VOIDARCH_RESEARCH_ROUTE,
  getVoidArchNode,
  type VoidArchNode,
  type VoidArchNodeId
} from '@/lib/voidarch/architecture';
import { useMemo, useRef, useState } from 'react';
import styles from '@/app/voidarch/voidarch.module.css';

const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 900;

interface SignalAtlasProps {
  onFocusChange?: (focus: readonly [number, number]) => void;
  onRouteState?: (energy: number, phase: number) => void;
}

function edgePath(source: VoidArchNode, target: VoidArchNode) {
  const dx = target.position.x - source.position.x;
  const bend = Math.max(70, Math.abs(dx) * 0.42);
  const c1x = source.position.x + Math.sign(dx || 1) * bend;
  const c2x = target.position.x - Math.sign(dx || 1) * bend;
  return `M ${source.position.x} ${source.position.y} C ${c1x} ${source.position.y}, ${c2x} ${target.position.y}, ${target.position.x} ${target.position.y}`;
}

export function SignalAtlas({ onFocusChange, onRouteState }: SignalAtlasProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 110, y: 0 });
  const [selectedId, setSelectedId] = useState<VoidArchNodeId | null>(null);
  const [activeNode, setActiveNode] = useState<VoidArchNodeId | null>(null);
  const [activeEdge, setActiveEdge] = useState<string | null>(null);
  const [traceState, setTraceState] = useState<'idle' | 'running' | 'success'>(
    'idle'
  );
  const [traceMessage, setTraceMessage] = useState('ready');
  const dragRef = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);

  const selected = selectedId ? getVoidArchNode(selectedId) : null;
  const nodeById = useMemo(
    () => new Map(VOIDARCH_NODES.map((node) => [node.id, node])),
    []
  );

  const updateZoom = (next: number) => {
    setZoom(Math.max(0.68, Math.min(1.5, Number(next.toFixed(2)))));
  };

  const focusNode = (id: VoidArchNodeId) => {
    const node = getVoidArchNode(id);
    setSelectedId(id);
    onFocusChange?.([
      node.position.x / WORLD_WIDTH,
      1 - node.position.y / WORLD_HEIGHT
    ]);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 110, y: 0 });
    setSelectedId(null);
    onFocusChange?.([0.72, 0.42]);
  };

  const playRoute = async () => {
    if (traceState === 'running') return;
    setTraceState('running');
    for (let index = 0; index < VOIDARCH_RESEARCH_ROUTE.length; index += 1) {
      const step = VOIDARCH_RESEARCH_ROUTE[index];
      setActiveNode(step.node);
      setActiveEdge(step.edge ?? null);
      setTraceMessage(step.message);
      const node = getVoidArchNode(step.node);
      onFocusChange?.([
        node.position.x / WORLD_WIDTH,
        1 - node.position.y / WORLD_HEIGHT
      ]);
      onRouteState?.(
        1,
        index / Math.max(1, VOIDARCH_RESEARCH_ROUTE.length - 1)
      );
      await new Promise((resolve) => window.setTimeout(resolve, 220));
    }
    setActiveNode(null);
    setActiveEdge(null);
    setTraceState('success');
    setTraceMessage('evidence persisted — route complete');
    onRouteState?.(0, 1);
  };

  return (
    <div
      className={styles.atlasViewport}
      data-testid='voidarch-atlas'
      aria-label='VoidArch architecture atlas'
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest('button')) return;
        dragRef.current = {
          startX: event.clientX,
          startY: event.clientY,
          panX: pan.x,
          panY: pan.y
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current;
        if (!drag) return;
        setPan({
          x: drag.panX + event.clientX - drag.startX,
          y: drag.panY + event.clientY - drag.startY
        });
      }}
      onPointerUp={() => {
        dragRef.current = null;
      }}
      onWheel={(event) => {
        event.preventDefault();
        updateZoom(zoom * (event.deltaY > 0 ? 0.92 : 1.08));
      }}
    >
      <div className={styles.atlasControlBar}>
        <button
          type='button'
          onClick={() => updateZoom(zoom + 0.1)}
          aria-label='Zoom in'
        >
          +
        </button>
        <span>{zoom.toFixed(2)}×</span>
        <button
          type='button'
          onClick={() => updateZoom(zoom - 0.1)}
          aria-label='Zoom out'
        >
          −
        </button>
        <button type='button' onClick={resetView} aria-label='Reset atlas view'>
          RESET
        </button>
        <button
          type='button'
          onClick={playRoute}
          aria-label='Play request route'
        >
          PLAY ROUTE
        </button>
      </div>

      <div
        className={styles.atlasWorld}
        data-testid='voidarch-world'
        data-world-width={WORLD_WIDTH}
        data-world-height={WORLD_HEIGHT}
        data-zoom={zoom.toFixed(2)}
        style={{
          width: WORLD_WIDTH,
          height: WORLD_HEIGHT,
          transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        <svg
          className={styles.atlasEdges}
          data-testid='edge-context-router'
          viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
          aria-hidden='true'
        >
          {VOIDARCH_EDGES.map((edge) => {
            const source = nodeById.get(edge.source);
            const target = nodeById.get(edge.target);
            if (!source || !target) return null;
            return (
              <path
                key={edge.id}
                data-edge={edge.id}
                className={
                  activeEdge === edge.id ? styles.activeEdge : undefined
                }
                d={edgePath(source, target)}
              />
            );
          })}
        </svg>

        {VOIDARCH_NODES.map((node) => (
          <button
            type='button'
            key={node.id}
            aria-label={node.title}
            data-node={node.id}
            className={`${styles.atlasNode} ${node.group === 'core' ? styles.atlasNodeCore : ''} ${activeNode === node.id ? styles.routeNode : ''}`}
            style={{ left: node.position.x, top: node.position.y }}
            onClick={() => focusNode(node.id)}
          >
            <span className={styles.atlasAnchor} />
            <strong>{node.title}</strong>
            <small>{node.maturity}</small>
            <p>{node.summary}</p>
          </button>
        ))}
      </div>

      {selected ? (
        <aside
          className={styles.atlasInspector}
          data-testid='voidarch-inspector'
        >
          <div className={styles.inspectorTopline}>
            <span>SUBSYSTEM / {selected.id.toUpperCase()}</span>
            <button
              type='button'
              onClick={() => setSelectedId(null)}
              aria-label='Close subsystem inspector'
            >
              CLOSE
            </button>
          </div>
          <h2>{selected.title}</h2>
          <div className={styles.maturityBadge}>{selected.maturity}</div>
          <p>{selected.summary}</p>
          <dl className={styles.inspectorFacts}>
            <div>
              <dt>ROLE</dt>
              <dd>{selected.role}</dd>
            </div>
            <div>
              <dt>OWNS</dt>
              <dd>{selected.owns}</dd>
            </div>
            <div>
              <dt>CONNECTS</dt>
              <dd>{selected.connects}</dd>
            </div>
          </dl>
          <ul className={styles.inspectorBullets}>
            {selected.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </aside>
      ) : null}

      <div
        className={`${styles.routeTrace} ${traceState !== 'idle' ? styles.routeTraceVisible : ''}`}
        data-testid='voidarch-route-trace'
        data-state={traceState}
      >
        <span>ROUTE / RESEARCH_QUERY</span>
        <b>{traceMessage}</b>
      </div>
    </div>
  );
}
