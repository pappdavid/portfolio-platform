'use client';

import { TeleRow } from '@/components/landing/tele-row';
import { HeroCTAs } from '@/components/landing/hero-ctas';
import { OperatorCard } from '@/components/landing/operator-card';

// The hero used to host the ThreeCanvas as its centerpiece column. Now that
// the same scene is mounted page-wide as a background wrapper, the hero
// drops the canvas slot and lets the scene show through behind the pitch
// + operator-card lockup. Foreground content still sits in front; the
// living orbital scene reads through the gaps as ambient depth.
export function HeroSection() {
  return (
    <section
      id='hero'
      className='relative flex min-h-screen items-center'
      style={{ paddingTop: 120, paddingBottom: 80 }}
    >
      <div className='dp-wrap w-full'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_360px]'>
          {/* Column 1 — pitch */}
          <div>
            <TeleRow />
            <h1
              className='t-h1'
              style={{ color: 'var(--ink-0)', marginBottom: 24 }}
            >
              I build production-quality
              <br />
              <span style={{ color: 'var(--accent-bright)' }}>LLM tools.</span>
            </h1>
            <p
              style={{
                fontSize: 17,
                color: 'var(--ink-1)',
                lineHeight: 1.6,
                maxWidth: 500,
                marginBottom: 0
              }}
            >
              Agent observability, fine-tuning pipelines, and retrieval systems.
              Recently cut LLM API costs ~40% and hardened safety controls
              against prompt injection.
            </p>
            <HeroCTAs />
          </div>

          {/* Column 2 — operator card */}
          <div className='hidden lg:block'>
            <OperatorCard />
          </div>
        </div>
      </div>
    </section>
  );
}
