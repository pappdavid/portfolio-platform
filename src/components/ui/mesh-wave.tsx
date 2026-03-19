'use client';

import { useEffect, useRef } from 'react';

const MESH_COLS = 28;
const MESH_ROWS = 18;
const AMP = 22;
const FREQ = 0.0038;
const SPEED = 0.00055;

export function MeshWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let cancelled = false;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (t: number) => {
      if (cancelled) return;
      const W = canvas.width / (window.devicePixelRatio || 1);
      const H = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, W, H);

      // Build vertex grid
      const pts: { x: number; y: number; bx: number; by: number }[][] = [];
      for (let r = 0; r <= MESH_ROWS; r++) {
        pts[r] = [];
        for (let c = 0; c <= MESH_COLS; c++) {
          const bx = (c / MESH_COLS) * W;
          const by = (r / MESH_ROWS) * H;
          const wave =
            Math.sin(bx * FREQ + t * SPEED) *
              Math.cos(by * FREQ * 1.3 + t * SPEED * 0.7) +
            Math.sin(bx * FREQ * 0.6 - by * FREQ * 0.8 + t * SPEED * 1.1) * 0.5;
          pts[r][c] = {
            x: bx + wave * AMP * 0.5,
            y: by + wave * AMP,
            bx,
            by
          };
        }
      }

      // Horizontal lines
      for (let r = 0; r <= MESH_ROWS; r++) {
        const midY = pts[r][Math.floor(MESH_COLS / 2)].y;
        const norm = Math.min(1, Math.abs(midY / H - 0.5) * 2);
        const alpha = 0.06 + norm * 0.12;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(34,197,94,${alpha})`;
        ctx.lineWidth = 1;
        ctx.moveTo(pts[r][0].x, pts[r][0].y);
        for (let c = 1; c <= MESH_COLS; c++) {
          ctx.lineTo(pts[r][c].x, pts[r][c].y);
        }
        ctx.stroke();
      }

      // Vertical lines
      for (let c = 0; c <= MESH_COLS; c++) {
        const alpha = 0.05 + 0.08 * Math.abs(Math.sin(c * 0.4 + t * SPEED * 2));
        ctx.beginPath();
        ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
        ctx.lineWidth = 1;
        ctx.moveTo(pts[0][c].x, pts[0][c].y);
        for (let r = 1; r <= MESH_ROWS; r++) {
          ctx.lineTo(pts[r][c].x, pts[r][c].y);
        }
        ctx.stroke();
      }

      // Nodes at intersections
      for (let r = 0; r <= MESH_ROWS; r++) {
        for (let c = 0; c <= MESH_COLS; c++) {
          const { x, y, bx, by } = pts[r][c];
          const disp = Math.sqrt((x - bx) ** 2 + (y - by) ** 2) / AMP;
          const radius = 0.9 + disp * 1.5;
          const alpha = 0.12 + disp * 0.35;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34,197,94,${alpha})`;
          ctx.fill();
        }
      }

      // Vignette
      const grad = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.7
      );
      grad.addColorStop(0, 'rgba(4,4,8,0)');
      grad.addColorStop(1, 'rgba(4,4,8,0.78)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className='pointer-events-none fixed inset-0 z-0'
      style={{ willChange: 'contents' }}
      aria-hidden='true'
    />
  );
}
