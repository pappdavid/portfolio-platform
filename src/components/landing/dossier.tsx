'use client';

import { Glyph } from '@/components/landing/glyph';
import { GlyphKind } from '@/components/landing/glyph';

interface DossierModule {
  id: string;
  n: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  outcome: string;
  stack: string[];
  href: string;
}

interface DossierProps {
  m: DossierModule;
  isActive?: boolean;
  onHover?: (id: string) => void;
  onLeave?: () => void;
}

type StringDossierField = 'problem' | 'solution' | 'outcome';

const GRID_CELLS: { key: string; field: StringDossierField; glyph: GlyphKind }[] = [
  { key: 'Problem', field: 'problem',  glyph: 'role' },
  { key: 'Built',   field: 'solution', glyph: 'cal' },
  { key: 'Outcome', field: 'outcome',  glyph: 'wave' },
];

export function Dossier({ m, isActive, onHover, onLeave }: DossierProps) {
  return (
    <div
      className={`cornermark rounded-2xl p-6 flex flex-col gap-4 transition-all cursor-default h-full${isActive ? ' ring-1 ring-[var(--accent)]' : ''}`}
      style={{ background: isActive ? 'var(--bg-3)' : 'var(--bg-2)', border: '1px solid var(--border-subtle)' }}
      onMouseEnter={() => onHover?.(m.id)}
      onMouseLeave={() => onLeave?.()}
    >
      <span className="cm-tl" /><span className="cm-tr" /><span className="cm-bl" /><span className="cm-br" />

      {/* Head */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 11, color: 'var(--ink-3)', marginBottom: 4 }}>
            {m.n} · {m.title}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{m.tagline}</div>
        </div>
        <span
          className="flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{ background: 'var(--accent-soft)', fontFamily: 'var(--font-dp-mono)', fontSize: 10, color: 'var(--accent-bright)', whiteSpace: 'nowrap' }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          Shipped
        </span>
      </div>

      {/* Grid cells */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {GRID_CELLS.map(({ key, field, glyph }) => (
          <div key={key} className={key === 'Outcome' ? 'col-span-2' : ''}>
            <div className="flex items-center gap-1.5 mb-1" style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 10, color: 'var(--ink-3)' }}>
              <Glyph kind={glyph} size={11} color="var(--ink-3)" /> {key}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-1)', lineHeight: 1.5 }}>{m[field]}</div>
          </div>
        ))}
        <div className="col-span-2">
          <div className="flex items-center gap-1.5 mb-1.5" style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 10, color: 'var(--ink-3)' }}>
            <Glyph kind="code" size={11} color="var(--ink-3)" /> Stack
          </div>
          <div className="flex flex-wrap gap-1.5">
            {m.stack.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-3)', fontFamily: 'var(--font-dp-mono)', fontSize: 10, color: 'var(--ink-2)', border: '1px solid var(--border-subtle)' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <a href={m.href} style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--font-dp-mono)' }}>
        Open dossier →
      </a>
    </div>
  );
}
