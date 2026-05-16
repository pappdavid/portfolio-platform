'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { SceneHandle, ModuleId } from '@/lib/scene/types';

export interface ThreeCanvasRef {
  focusModule(id: ModuleId): void;
  clearFocus(): void;
}

const MODULE_LABELS: { id: ModuleId; label: string; tagline: string }[] = [
  { id: 'sentinel', label: 'MCP Sentinel', tagline: 'obs · guardrails' },
  { id: 'training', label: 'Custom Training', tagline: 'repo · LoRA' },
  { id: 'chat', label: 'RAG + 3D Chat', tagline: 'retrieve · render' }
];

interface ThreeCanvasProps {
  className?: string;
  // Pass false when the canvas is being used as a page-level ambient
  // background — floating module labels are useful when the scene is a
  // contained centerpiece, but they look out of place drifting over
  // scrolled-past content.
  showLabels?: boolean;
}

export const ThreeCanvas = forwardRef<ThreeCanvasRef, ThreeCanvasProps>(
  function ThreeCanvas({ className, showLabels = true }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const labelsRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<SceneHandle | null>(null);

    useImperativeHandle(ref, () => ({
      focusModule: (id) => sceneRef.current?.focusModule(id),
      clearFocus: () => sceneRef.current?.clearFocus()
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let cancelled = false;
      let sceneInstance: SceneHandle | null = null;
      let labelRaf: number;

      // Dynamic import keeps Three.js out of the SSR bundle
      import('@/lib/scene/scene').then(({ mountScene }) => {
        if (cancelled) return;
        const scene = mountScene(canvas);
        sceneInstance = scene;
        sceneRef.current = scene;

        if (showLabels) {
          const updateLabels = () => {
            const positions = scene.getModuleScreenPositions();
            const container = labelsRef.current;
            if (container) {
              MODULE_LABELS.forEach(({ id }) => {
                const el = container.querySelector<HTMLElement>(
                  `[data-module="${id}"]`
                );
                if (el && positions[id]) {
                  const p = positions[id];
                  el.style.transform = `translate(calc(${p.x}px - 50%), calc(${p.y}px - 50%))`;
                  el.style.opacity = String(0.55 + p.focus * 0.45);
                  el.style.display = p.inFront ? 'flex' : 'none';
                }
              });
            }
            labelRaf = requestAnimationFrame(updateLabels);
          };
          labelRaf = requestAnimationFrame(updateLabels);
        }
      });

      return () => {
        cancelled = true;
        cancelAnimationFrame(labelRaf);
        sceneInstance?.destroy();
        sceneRef.current = null;
      };
    }, []);

    return (
      <div
        className={`relative ${className ?? ''}`}
        style={{ width: '100%', height: '100%' }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
        {showLabels && (
          <div
            ref={labelsRef}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden'
            }}
          >
            {MODULE_LABELS.map(({ id, label, tagline }) => (
              <div
                key={id}
                data-module={id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  borderRadius: 8,
                  background: 'rgba(12,11,9,0.78)',
                  border: '1px solid var(--accent-line)',
                  backdropFilter: 'blur(6px)',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.2s ease'
                }}
              >
                {/* Tiny cube glyph mirroring the dossier badge */}
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  style={{ color: 'var(--accent)', flexShrink: 0 }}
                >
                  <path d='M12 2 L21 7 V17 L12 22 L3 17 V7 Z' />
                  <path d='M3 7 L12 12 L21 7' />
                  <path d='M12 12 V22' />
                </svg>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    lineHeight: 1.2
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        'var(--font-dp-sans), Inter Tight, sans-serif',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--ink-0)'
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dp-mono), monospace',
                      fontSize: 9.5,
                      letterSpacing: '0.08em',
                      color: 'var(--ink-3)'
                    }}
                  >
                    {tagline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
