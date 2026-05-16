'use client';

import { useState, useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import { Dossier } from '@/components/landing/dossier';
import { Glyph } from '@/components/landing/glyph';
import { GlyphKind } from '@/components/landing/glyph';
import type { ThreeCanvasRef } from '@/components/landing/three-canvas';
import type { ModuleId } from '@/lib/scene/types';

const MODULES = [
  {
    id: 'sentinel',
    n: '01',
    title: 'MCP Sentinel',
    tagline: 'Observability for agent tool calls',
    problem:
      'Agents call tools. You have no idea what they did, why, or whether they should have.',
    solution:
      'Wrap your MCP server. Sentinel logs every call, runs guards, and emits an audit-ready event stream.',
    outcome:
      'p99 overhead < 12ms. Blocks prompt-injection patterns. Full audit log keyed by session.',
    stack: [
      'Node.js',
      'TypeScript',
      'Supabase',
      'HMAC signing',
      'Upstash Redis'
    ],
    href: '/mcp'
  },
  {
    id: 'training',
    n: '02',
    title: 'Custom Training',
    tagline: 'Codebase → dataset → LoRA',
    problem:
      'Internal docs and codebases hold the knowledge that matters. Generic models do not know any of it.',
    solution:
      'Parse repos and docs, generate instruction-response pairs, validate JSONL, hand off to fine-tune API.',
    outcome:
      'A repo becomes a fine-tuned adapter in one pass. BYOK supported — no key, demo mode runs synthetic.',
    stack: ['Python', 'tree-sitter', 'OpenAI fine-tune', 'HuggingFace', 'BYOK'],
    href: '/training'
  },
  {
    id: 'chat',
    n: '03',
    title: 'RAG + 3D Chat',
    tagline: 'Chat with docs, render 3D outputs',
    problem:
      'RAG answers are walls of text. Spatial questions deserve spatial answers.',
    solution:
      'Upload docs, retrieve, rerank, generate — and render spatial answers in Three.js inline.',
    outcome:
      'Citations point to source chunks. 3D outputs are deterministic from the model trace.',
    stack: ['Three.js', 'pgvector', 'BAAI bge reranker', 'streaming SSE'],
    href: '/chat'
  }
];

const LAWS: {
  n: string;
  title: string;
  law: string;
  desc: string;
  glyph: GlyphKind;
}[] = [
  {
    n: '01',
    title: 'Cost-aware',
    law: 'Every API call has a price tag.',
    desc: 'Rate limiting, caching, and tiered routing keep costs predictable.',
    glyph: 'cost'
  },
  {
    n: '02',
    title: 'Security-first',
    law: 'The boundary is the only thing you control.',
    desc: 'Input validation, HMAC signing, RLS policies, and guardrails are built in.',
    glyph: 'shield-check'
  },
  {
    n: '03',
    title: 'Minimal surface',
    law: 'Ship the smallest thing that works.',
    desc: 'Three lines of code beats a premature framework. Delete more than you add.',
    glyph: 'terminal'
  }
];

interface SystemsSectionProps {
  canvasRef?: RefObject<ThreeCanvasRef | null>;
}

// Small decorative SVG that echoes the hero scene — central hex with three
// elliptical orbits and cube-glyph nodes. Sits in the section header on
// desktop and reinforces the "every dossier is a node on the same operator"
// metaphor without spinning up a second WebGL context.
function SystemsOrnament() {
  return (
    <svg
      viewBox='0 0 220 160'
      width='220'
      height='160'
      aria-hidden='true'
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id='sys-hex-glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#22c55e' stopOpacity='0.75' />
          <stop offset='100%' stopColor='#22c55e' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* Three elliptical orbits, sized + tilted distinctly */}
      <ellipse
        cx='110'
        cy='80'
        rx='100'
        ry='28'
        fill='none'
        stroke='#22c55e'
        strokeWidth='0.8'
        strokeOpacity='0.35'
        strokeDasharray='2 3'
      />
      <ellipse
        cx='110'
        cy='80'
        rx='86'
        ry='44'
        fill='none'
        stroke='#22c55e'
        strokeWidth='0.8'
        strokeOpacity='0.28'
        strokeDasharray='2 3'
        transform='rotate(20 110 80)'
      />
      <ellipse
        cx='110'
        cy='80'
        rx='74'
        ry='58'
        fill='none'
        stroke='#22c55e'
        strokeWidth='0.8'
        strokeOpacity='0.22'
        strokeDasharray='2 3'
        transform='rotate(-15 110 80)'
      />

      {/* Glow disc behind the hex */}
      <circle cx='110' cy='80' r='30' fill='url(#sys-hex-glow)' />

      {/* Central hexagon — outer outline + inner solid */}
      <polygon
        points='110,52 130,66 130,94 110,108 90,94 90,66'
        fill='none'
        stroke='#22c55e'
        strokeWidth='1.4'
        strokeOpacity='0.85'
      />
      <polygon
        points='110,62 124,72 124,88 110,98 96,88 96,72'
        fill='rgba(34,197,94,0.15)'
        stroke='#22c55e'
        strokeWidth='1'
        strokeOpacity='0.55'
      />
      <circle cx='110' cy='80' r='3' fill='#a8f5c4' />

      {/* Three orbiting nodes at varied positions */}
      {[
        { x: 200, y: 60 },
        { x: 18, y: 108 },
        { x: 178, y: 124 }
      ].map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r='9'
            fill='rgba(12,11,9,0.85)'
            stroke='#22c55e'
            strokeWidth='1'
            strokeOpacity='0.7'
          />
          <path
            d={`M${p.x} ${p.y - 4} L${p.x + 3.5} ${p.y - 1.5} L${p.x + 3.5} ${p.y + 2.5} L${p.x} ${p.y + 5} L${p.x - 3.5} ${p.y + 2.5} L${p.x - 3.5} ${p.y - 1.5} Z`}
            fill='none'
            stroke='#22c55e'
            strokeWidth='0.8'
            strokeOpacity='0.85'
          />
          <circle cx={p.x} cy={p.y} r='1.4' fill='#22c55e' />
        </g>
      ))}
    </svg>
  );
}

export function SystemsSection({ canvasRef }: SystemsSectionProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
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

  const handleHover = (id: string) => {
    setActiveModule(id);
    canvasRef?.current?.focusModule(id as ModuleId);
  };
  const handleLeave = () => {
    setActiveModule(null);
    canvasRef?.current?.clearFocus();
  };

  return (
    <section
      id='modules'
      className='py-32'
      style={{ background: 'var(--bg-0)' }}
    >
      <div ref={ref} className='dp-wrap dp-animate'>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: 32,
            alignItems: 'start',
            marginBottom: 56
          }}
        >
          <div>
            <div className='dp-eyebrow'>{'// 02 — SYSTEMS'}</div>
            <h2 className='t-h2' style={{ color: 'var(--ink-0)', margin: 0 }}>
              Three production
              <br />
              AI systems.
            </h2>
            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                fontFamily: 'var(--font-dp-mono), monospace',
                fontSize: 12,
                color: 'var(--ink-3)',
                maxWidth: 420,
                lineHeight: 1.6
              }}
            >
              Each module orbits the operator core.{' '}
              <span style={{ color: 'var(--ink-2)' }}>
                Hover a node or open a dossier to explore.
              </span>
            </p>
          </div>
          <div className='hidden md:block'>
            <SystemsOrnament />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-5 lg:grid-cols-3'>
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
          id='laws'
          className='cornermark mt-20 rounded-2xl p-10'
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <span className='cm-tl' />
          <span className='cm-tr' />
          <span className='cm-bl' />
          <span className='cm-br' />
          <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
            <div>
              <div className='dp-eyebrow'>● 04 — OPERATING LAWS</div>
              <h3
                className='t-h3'
                style={{ color: 'var(--ink-0)', margin: '0 0 8px' }}
              >
                The three laws
                <br />I build under.
              </h3>
              <p style={{ color: 'var(--ink-2)', fontSize: 14 }}>
                Cost-aware. Security-first.
                <br />
                Minimal surface.
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
              {LAWS.map((law) => (
                <div key={law.n}>
                  <div className='mb-3'>
                    <Glyph kind={law.glyph} size={20} color='var(--accent)' />
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-dp-mono)',
                      fontSize: 10,
                      color: 'var(--ink-3)',
                      marginBottom: 4
                    }}
                  >
                    {law.n}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: 'var(--ink-0)',
                      marginBottom: 6
                    }}
                  >
                    {law.title}
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--ink-2)',
                      lineHeight: 1.6,
                      margin: 0
                    }}
                  >
                    <em style={{ color: 'var(--ink-1)' }}>{law.law}</em>{' '}
                    {law.desc}
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
