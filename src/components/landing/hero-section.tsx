'use client';

import type { RefObject } from 'react';
import { ThreeCanvas } from '@/components/landing/three-canvas';
import type { ThreeCanvasRef } from '@/components/landing/three-canvas';
import { TeleRow } from '@/components/landing/tele-row';
import { HeroCTAs } from '@/components/landing/hero-ctas';
import { OperatorCard } from '@/components/landing/operator-card';

interface HeroSectionProps {
  canvasRef: RefObject<ThreeCanvasRef | null>;
}

export function HeroSection({ canvasRef }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center"
      style={{ paddingTop: 120, paddingBottom: 80, background: 'var(--bg-0)' }}
    >
      <div className="dp-wrap w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_340px] gap-12 items-center">
          {/* Column 1 — pitch */}
          <div>
            <TeleRow />
            <h1
              className="t-h1"
              style={{ color: 'var(--ink-0)', marginBottom: 24 }}
            >
              I build production-quality<br />
              <span style={{ color: 'var(--accent-bright)' }}>LLM tools.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--ink-1)', lineHeight: 1.6, maxWidth: 500, marginBottom: 0 }}>
              Agent observability, fine-tuning pipelines, and retrieval systems.
              Recently cut LLM API costs ~40% and hardened safety controls against prompt injection.
            </p>
            <HeroCTAs />
          </div>

          {/* Column 2 — Three.js canvas */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ height: 480, background: 'var(--bg-1)', border: '1px solid var(--border-subtle)' }}
          >
            <ThreeCanvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          </div>

          {/* Column 3 — operator card */}
          <div className="hidden lg:block">
            <OperatorCard />
          </div>
        </div>
      </div>
    </section>
  );
}
