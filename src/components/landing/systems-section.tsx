'use client';

import { useState } from 'react';
import type { RefObject } from 'react';
import { Dossier } from '@/components/landing/dossier';
import { Glyph } from '@/components/landing/glyph';
import { GlyphKind } from '@/components/landing/glyph';
import type { ThreeCanvasRef } from '@/components/landing/three-canvas';
import type { ModuleId } from '@/lib/scene/types';

const MODULES = [
  {
    id: 'sentinel', n: '01', title: 'MCP Sentinel', tagline: 'Observability for agent tool calls',
    problem: 'Agents call tools. You have no idea what they did, why, or whether they should have.',
    solution: 'Wrap your MCP server. Sentinel logs every call, runs guards, and emits an audit-ready event stream.',
    outcome: 'p99 overhead < 12ms. Blocks prompt-injection patterns. Full audit log keyed by session.',
    stack: ['Node.js', 'TypeScript', 'Supabase', 'HMAC signing', 'Upstash Redis'],
    href: '/mcp',
  },
  {
    id: 'training', n: '02', title: 'Custom Training', tagline: 'Codebase → dataset → LoRA',
    problem: 'Internal docs and codebases hold the knowledge that matters. Generic models do not know any of it.',
    solution: 'Parse repos and docs, generate instruction-response pairs, validate JSONL, hand off to fine-tune API.',
    outcome: 'A repo becomes a fine-tuned adapter in one pass. BYOK supported — no key, demo mode runs synthetic.',
    stack: ['Python', 'tree-sitter', 'OpenAI fine-tune', 'HuggingFace', 'BYOK'],
    href: '/training',
  },
  {
    id: 'chat', n: '03', title: 'RAG + 3D Chat', tagline: 'Chat with docs, render 3D outputs',
    problem: 'RAG answers are walls of text. Spatial questions deserve spatial answers.',
    solution: 'Upload docs, retrieve, rerank, generate — and render spatial answers in Three.js inline.',
    outcome: 'Citations point to source chunks. 3D outputs are deterministic from the model trace.',
    stack: ['Three.js', 'pgvector', 'BAAI bge reranker', 'streaming SSE'],
    href: '/chat',
  },
];

const LAWS: { n: string; title: string; law: string; desc: string; glyph: GlyphKind }[] = [
  { n: '01', title: 'Cost-aware',     law: 'Every API call has a price tag.',                desc: 'Rate limiting, caching, and tiered routing keep costs predictable.',                      glyph: 'cost' },
  { n: '02', title: 'Security-first', law: 'The boundary is the only thing you control.',    desc: 'Input validation, HMAC signing, RLS policies, and guardrails are built in.',             glyph: 'shield-check' },
  { n: '03', title: 'Minimal surface', law: 'Ship the smallest thing that works.',           desc: 'Three lines of code beats a premature framework. Delete more than you add.',             glyph: 'terminal' },
];

interface SystemsSectionProps {
  canvasRef?: RefObject<ThreeCanvasRef | null>;
}

export function SystemsSection({ canvasRef }: SystemsSectionProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const handleHover = (id: string) => {
    setActiveModule(id);
    canvasRef?.current?.focusModule(id as ModuleId);
  };
  const handleLeave = () => {
    setActiveModule(null);
    canvasRef?.current?.clearFocus();
  };

  return (
    <section id="modules" className="py-32" style={{ background: 'var(--bg-0)' }}>
      <div className="dp-wrap">
        <div className="dp-eyebrow">// 02 — SYSTEMS</div>
        <h2 className="t-h2" style={{ color: 'var(--ink-0)', marginBottom: 56 }}>
          Three production<br />AI systems.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {MODULES.map((m) => (
            <Dossier
              key={m.id}
              m={m}
              isActive={activeModule === m.id}
              onHover={handleHover}
              onLeave={handleLeave}
            />
          ))}
        </div>

        {/* Laws panel */}
        <div
          id="laws"
          className="cornermark mt-20 rounded-2xl p-10"
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border-subtle)' }}
        >
          <span className="cm-tl" /><span className="cm-tr" /><span className="cm-bl" /><span className="cm-br" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="dp-eyebrow">● 04 — OPERATING LAWS</div>
              <h3 className="t-h3" style={{ color: 'var(--ink-0)', margin: '0 0 8px' }}>The three laws<br />I build under.</h3>
              <p style={{ color: 'var(--ink-2)', fontSize: 14 }}>Cost-aware. Security-first.<br />Minimal surface.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {LAWS.map((law) => (
                <div key={law.n}>
                  <div className="mb-3"><Glyph kind={law.glyph} size={20} color="var(--accent)" /></div>
                  <div style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 10, color: 'var(--ink-3)', marginBottom: 4 }}>{law.n}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-0)', marginBottom: 6 }}>{law.title}</div>
                  <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
                    <em style={{ color: 'var(--ink-1)' }}>{law.law}</em> {law.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
