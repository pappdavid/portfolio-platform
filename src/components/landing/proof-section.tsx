'use client';

import { useRef, useEffect } from 'react';
import { Glyph } from '@/components/landing/glyph';
import type { GlyphKind } from '@/components/landing/glyph';

const PROOF: {
  metric: string;
  label: string;
  context: string;
  glyph: GlyphKind;
  sys: string;
  tags: string;
}[] = [
  {
    metric: '~40%',
    label: 'LLM API cost reduction',
    context: 'AI-first startup consulting engagement',
    glyph: 'cube',
    sys: 'MCP Sentinel',
    tags: 'obs · guardrails'
  },
  {
    metric: '0',
    label: 'Prompt-injection incidents',
    context: 'after Sentinel guardrails went live',
    glyph: 'shield',
    sys: 'Sentinel Guardrails',
    tags: 'safety · policy'
  },
  {
    metric: '3',
    label: 'Production AI systems',
    context: 'shipped solo in the last 12 months',
    glyph: 'cube',
    sys: 'Custom Training',
    tags: 'repo · LoRA'
  },
  {
    metric: 'p99 <12ms',
    label: 'Sentinel overhead',
    context: 'measured in production traffic',
    glyph: 'wave',
    sys: 'Sentinel Runtime',
    tags: 'perf · telemetry'
  }
];

export function ProofSection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          ref.current?.classList.add('is-visible');
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id='proof'
      className='py-32'
      style={{ background: 'rgba(19, 18, 16, 0.72)' }}
    >
      <div ref={ref} className='dp-wrap dp-animate'>
        <div className='dp-eyebrow'>{'// 01 — PROOF OF WORK'}</div>
        <h2
          className='t-h2'
          style={{ color: 'var(--ink-0)', marginBottom: 48 }}
        >
          The numbers
          <br />
          behind the build.
        </h2>

        <div
          className='grid grid-cols-1 gap-4 sm:grid-cols-2'
          style={{ maxWidth: 720 }}
        >
          {PROOF.map((p) => (
            <div
              key={p.label}
              className='cornermark flex flex-col gap-2 rounded-2xl p-6'
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span className='cm-tl' />
              <span className='cm-tr' />
              <span className='cm-bl' />
              <span className='cm-br' />
              <div
                style={{
                  fontFamily: 'var(--font-dp-sans)',
                  fontSize: 'clamp(36px, 5vw, 52px)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  color: 'var(--ink-0)',
                  lineHeight: 1
                }}
              >
                {p.metric}
              </div>
              <div
                style={{ fontSize: 14, color: 'var(--ink-1)', fontWeight: 500 }}
              >
                {p.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                {p.context}
              </div>
              <div
                className='mt-2 flex items-center gap-2'
                style={{
                  fontFamily: 'var(--font-dp-mono)',
                  fontSize: 10,
                  color: 'var(--ink-3)'
                }}
              >
                <Glyph kind={p.glyph} size={12} color='var(--ink-3)' />
                <span style={{ color: 'var(--ink-2)' }}>{p.sys}</span>
                <span>{p.tags}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          className='mt-6 flex items-center justify-between'
          style={{
            fontFamily: 'var(--font-dp-mono)',
            fontSize: 11,
            color: 'var(--ink-3)',
            maxWidth: 720
          }}
        >
          <span>
            Data verified.{' '}
            <span style={{ color: 'var(--ink-2)' }}>
              All metrics sourced from production telemetry.
            </span>
          </span>
          <span>
            Updated <em>May 2026</em>
          </span>
        </div>
      </div>
    </section>
  );
}
