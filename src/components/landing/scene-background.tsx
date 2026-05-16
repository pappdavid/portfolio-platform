'use client';

import { forwardRef } from 'react';
import { ThreeCanvas } from '@/components/landing/three-canvas';
import type { ThreeCanvasRef } from '@/components/landing/three-canvas';

/**
 * Page-wide ambient Three.js background. Mounted once at the page root via
 * `LandingContent`, the same operator scene that used to live in the hero
 * column now wraps the entire scrollable surface as a "Control Room" wallpaper.
 *
 * - Fixed full-viewport, z-index 0, pointer-events: none so it never blocks
 *   scroll or clicks.
 * - Canvas opacity is held low so the orbital geometry reads as ambient
 *   rather than competing with content above it.
 * - Labels are disabled (they were useful when the scene was a contained
 *   centerpiece; as a wallpaper they'd float over scrolled-past content).
 * - Mouse parallax inside the scene still responds, which gives the page
 *   its "alive" feel as the cursor moves across content.
 * - canvasRef from `LandingContent` is forwarded so the dossier hover-focus
 *   wiring on `/` still drives module highlighting.
 */
export const SceneBackground = forwardRef<ThreeCanvasRef>(
  function SceneBackground(_, ref) {
    return (
      <div
        aria-hidden='true'
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          // Push the scene visually back so foreground content reads cleanly.
          opacity: 0.55
        }}
      >
        <ThreeCanvas ref={ref} showLabels={false} />
      </div>
    );
  }
);
