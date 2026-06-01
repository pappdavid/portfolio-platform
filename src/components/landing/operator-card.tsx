import { Glyph } from '@/components/landing/glyph';
import { GlyphKind } from '@/components/landing/glyph';

const ROWS: { kind: GlyphKind; k: string; v: string; avail?: boolean }[] = [
  { kind: 'role', k: 'Role', v: 'AI Engineering student' },
  { kind: 'edu', k: 'Education', v: 'VU Amsterdam · BSc AI' },
  { kind: 'pin', k: 'Location', v: 'Netherlands' },
  { kind: 'code', k: 'Stack', v: 'Python · TypeScript · Three.js · pgvector' },
  {
    kind: 'briefcase',
    k: 'Availability',
    v: 'Full-time',
    avail: true
  }
];

export function OperatorCard() {
  return (
    <div
      className='flex flex-col gap-4 rounded-2xl p-6'
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <div className='flex items-center gap-3'>
        <div
          className='flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold'
          style={{
            background: 'var(--accent-soft)',
            color: 'var(--accent-bright)',
            fontFamily: 'var(--font-dp-mono)'
          }}
        >
          DP
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-dp-sans)',
              fontWeight: 600,
              fontSize: 15,
              color: 'var(--ink-0)'
            }}
          >
            David Papp
          </div>
          <div
            style={{
              fontFamily: 'var(--font-dp-mono)',
              fontSize: 11,
              color: 'var(--ink-3)'
            }}
          >
            VU Amsterdam
          </div>
        </div>
      </div>
      {ROWS.map(({ kind, k, v, avail }) => (
        <div
          key={k}
          className='flex items-start gap-3'
          style={{ color: avail ? 'var(--accent-bright)' : 'var(--ink-2)' }}
        >
          <Glyph
            kind={kind}
            size={16}
            color={avail ? 'var(--accent)' : 'var(--ink-3)'}
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-dp-mono)',
                fontSize: 10,
                color: 'var(--ink-3)',
                letterSpacing: '0.08em',
                marginBottom: 2
              }}
            >
              {k}
            </div>
            <div
              style={{
                fontSize: 13,
                fontFamily: 'var(--font-dp-sans)',
                color: avail ? 'var(--accent-bright)' : 'var(--ink-1)'
              }}
            >
              {v}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
