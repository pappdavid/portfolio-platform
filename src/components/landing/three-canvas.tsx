'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { SceneHandle, ModuleId } from '@/lib/scene/types';

export interface ThreeCanvasRef {
  focusModule(id: ModuleId): void;
  clearFocus(): void;
}

const MODULE_LABELS: { id: ModuleId; label: string }[] = [
  { id: 'sentinel', label: 'Security Lab' },
  { id: 'training', label: 'Custom Training' },
  { id: 'chat', label: 'RAG + 3D Chat' }
];

export const ThreeCanvas = forwardRef<
  ThreeCanvasRef,
  { className?: string; showLabels?: boolean }
>(function ThreeCanvas({ className, showLabels = false }, ref) {
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

    const handleFocusEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ moduleId: ModuleId | null }>;
      const id = customEvent.detail.moduleId;
      if (id) {
        sceneInstance?.focusModule(id);
      } else {
        sceneInstance?.clearFocus();
      }
    };
    window.addEventListener('dp-portfolio-focus-module', handleFocusEvent);

    // Dynamic import keeps Three.js out of the SSR bundle
    import('@/lib/scene/scene').then(({ mountScene }) => {
      if (cancelled) return;
      const scene = mountScene(canvas);
      sceneInstance = scene;
      sceneRef.current = scene;

      const updateLabels = () => {
        if (!showLabels) return;
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
              el.style.opacity = String(0.5 + p.focus * 0.5);
              el.style.display = p.inFront ? 'block' : 'none';
            }
          });
        }
        labelRaf = requestAnimationFrame(updateLabels);
      };
      if (showLabels) {
        labelRaf = requestAnimationFrame(updateLabels);
      }
    });

    return () => {
      cancelled = true;
      if (labelRaf) cancelAnimationFrame(labelRaf);
      window.removeEventListener('dp-portfolio-focus-module', handleFocusEvent);
      sceneInstance?.destroy();
      sceneRef.current = null;
    };
  }, [showLabels]);

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
          {MODULE_LABELS.map(({ id, label }) => (
            <div
              key={id}
              data-module={id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                fontFamily: 'var(--font-dp-mono), monospace',
                fontSize: 10,
                color: 'var(--dp-accent)',
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap'
              }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
