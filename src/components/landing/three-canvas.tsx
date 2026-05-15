'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { SceneHandle, ModuleId } from '@/lib/scene/types';

export interface ThreeCanvasRef {
  focusModule(id: ModuleId): void;
  clearFocus(): void;
}

const MODULE_LABELS: { id: ModuleId; label: string }[] = [
  { id: 'sentinel', label: 'MCP Sentinel' },
  { id: 'training', label: 'Custom Training' },
  { id: 'chat',     label: 'RAG + 3D Chat' },
];

export const ThreeCanvas = forwardRef<ThreeCanvasRef, { className?: string }>(
  function ThreeCanvas({ className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const labelsRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<SceneHandle | null>(null);

    useImperativeHandle(ref, () => ({
      focusModule: (id) => sceneRef.current?.focusModule(id),
      clearFocus: () => sceneRef.current?.clearFocus(),
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Dynamic import keeps Three.js out of the SSR bundle
      import('@/lib/scene/scene').then(({ mountScene }) => {
        const scene = mountScene(canvas);
        sceneRef.current = scene;

        let raf: number;
        const updateLabels = () => {
          const positions = scene.getModuleScreenPositions();
          const container = labelsRef.current;
          if (container) {
            MODULE_LABELS.forEach(({ id }) => {
              const el = container.querySelector<HTMLElement>(`[data-module="${id}"]`);
              if (el && positions[id]) {
                const p = positions[id];
                el.style.transform = `translate(${p.x}px, ${p.y}px)`;
                el.style.opacity = String(0.5 + p.focus * 0.5);
                el.style.display = p.inFront ? 'block' : 'none';
              }
            });
          }
          raf = requestAnimationFrame(updateLabels);
        };
        raf = requestAnimationFrame(updateLabels);

        return () => {
          cancelAnimationFrame(raf);
          scene.destroy();
        };
      });
    }, []);

    return (
      <div className={`relative ${className ?? ''}`} style={{ width: '100%', height: '100%' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        <div
          ref={labelsRef}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
        >
          {MODULE_LABELS.map(({ id, label }) => (
            <div
              key={id}
              data-module={id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: 'translate(-50%, -50%)',
                fontFamily: 'var(--font-dp-mono), monospace',
                fontSize: 10,
                color: 'var(--accent)',
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
