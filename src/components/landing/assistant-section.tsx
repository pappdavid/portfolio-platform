'use client';

import { useRef, useEffect } from 'react';
import { Glyph } from '@/components/landing/glyph';
import type { GlyphKind } from '@/components/landing/glyph';

const BENEFITS: { glyph: GlyphKind; h: string; p: string }[] = [
  { glyph: 'target',       h: 'Relevant by design',     p: 'Answers are sourced only from the systems on this page.' },
  { glyph: 'link',         h: 'Jump to what matters',   p: 'Each answer links to the exact project or section.' },
  { glyph: 'shield-check', h: 'Engineer-first clarity', p: 'See the trade-offs, constraints, and outcomes behind each system.' },
];

const EXAMPLE_QS = [
  'What is MCP Sentinel and why did you build it?',
  'What stacks do you prefer for RAG?',
  'How do you implement guardrails for LLM tools?',
  'What roles are you open to?',
];

export function AssistantSection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { ref.current?.classList.add('is-visible'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="assistant" className="py-32" style={{ background: 'var(--bg-1)' }}>
      <div ref={ref} className="dp-wrap dp-animate">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div>
            <div className="dp-eyebrow">// 05 PORTFOLIO ASSISTANT</div>
            <h2 className="t-h2" style={{ color: 'var(--ink-0)', marginBottom: 24 }}>
              The assistant<br />helps you{' '}
              <span style={{ color: 'var(--accent-bright)' }}>navigate<br />the portfolio faster.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--ink-1)', lineHeight: 1.6, marginBottom: 32, maxWidth: 420 }}>
              Portfolio-local. Grounded in the projects on this page. Ask a question and get a concise answer.
            </p>
            <div className="flex flex-col gap-5">
              {BENEFITS.map(({ glyph, h, p }) => (
                <div key={h} className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0"><Glyph kind={glyph} size={18} color="var(--accent)" /></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-0)', marginBottom: 4 }}>{h}</div>
                    <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>{p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — mock panel */}
          <div
            className="cornermark rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border-subtle)' }}
          >
            <span className="cm-tl" /><span className="cm-tr" /><span className="cm-bl" /><span className="cm-br" />
            <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-dp-mono)', fontSize: 11, color: 'var(--accent-bright)' }}>{'>'}_</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-0)' }}>Assistant</div>
                <div style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 10, color: 'var(--ink-3)' }}>Portfolio-local</div>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.08em' }}>EXAMPLE QUERIES</div>
            {EXAMPLE_QS.map((q) => (
              <a key={q} href="/chat" style={{ fontSize: 13, color: 'var(--ink-1)', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>{q}</span>
                <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
              </a>
            ))}
            <a href="/chat" className="dp-btn dp-btn-primary" style={{ marginTop: 8, justifyContent: 'center' }}>
              Open assistant
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
