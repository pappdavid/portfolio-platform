'use client';

import { useEffect, useRef } from 'react';

export function WorldBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        const drift = Math.min(window.scrollY * 0.06, 80);
        el.style.setProperty('--world-shift', drift + 'px');
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Hex-grid SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-100">
        <defs>
          <pattern id="hexPattern" x="0" y="0" width="56" height="48.5" patternUnits="userSpaceOnUse">
            <path
              d="M14 0 L42 0 L56 24.25 L42 48.5 L14 48.5 L0 24.25 Z"
              fill="none"
              stroke="rgba(245,240,225,0.05)"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      </svg>

      {/* Orbital arcs SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <ellipse cx="800" cy="500" rx="1200" ry="380" fill="none" stroke="rgba(34,197,94,0.10)" strokeWidth="0.8" strokeDasharray="2 6" />
        <ellipse cx="800" cy="500" rx="980" ry="540" fill="none" stroke="rgba(34,197,94,0.07)" strokeWidth="0.8" strokeDasharray="2 8" transform="rotate(18 800 500)" />
        <ellipse cx="800" cy="500" rx="760" ry="700" fill="none" stroke="rgba(34,197,94,0.05)" strokeWidth="0.8" strokeDasharray="1 10" transform="rotate(-22 800 500)" />
      </svg>

      {/* Dust particles */}
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37 + 7) % 100}%`,
            width: 2,
            height: 2,
            borderRadius: '50%',
            background: 'rgba(243,239,229,0.3)',
            animation: `floatDust ${14 + (i % 5) * 3}s ${-(i * 1.7) % 16}s infinite`,
          }}
        />
      ))}

      {/* Scroll parallax spotlight */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
          top: 'calc(30% + var(--world-shift, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />

    </div>
  );
}
