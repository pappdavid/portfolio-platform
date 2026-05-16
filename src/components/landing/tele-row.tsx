import { Glyph } from '@/components/landing/glyph';
import { GlyphKind } from '@/components/landing/glyph';

const CHIPS: { kind: GlyphKind; num: string; lab: string }[] = [
  { kind: 'cube',         num: '3',         lab: 'systems shipped' },
  { kind: 'trend-down',  num: '~40%',      lab: 'API cost reduction' },
  { kind: 'shield-check', num: '0',        lab: 'injection incidents' },
  { kind: 'gauge',        num: 'p99 <12ms', lab: '' },
];

export function TeleRow() {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {CHIPS.map(({ kind, num, lab }) => (
        <span
          key={kind}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
          style={{ background: 'rgba(243,239,229,0.05)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-dp-mono)', color: 'var(--ink-2)' }}
        >
          <Glyph kind={kind} size={13} color="var(--accent)" />
          <span style={{ color: 'var(--ink-0)', fontWeight: 600 }}>{num}</span>
          {lab && <span>{lab}</span>}
        </span>
      ))}
    </div>
  );
}
