import { Glyph } from '@/components/landing/glyph';
import type { GlyphKind } from '@/components/landing/glyph';

const CHANNELS: { kind: GlyphKind; name: string; sub: string; href: string; cta: string; primary?: boolean }[] = [
  { kind: 'mail',     name: 'Email',       sub: 'contact@davidpapp.dev',     href: 'mailto:contact@davidpapp.dev',               cta: 'EMAIL →',    primary: true },
  { kind: 'cal',      name: '20-min call', sub: 'Calendly',                  href: 'https://calendly.com/david-webinform/30min', cta: 'BOOK →' },
  { kind: 'doc',      name: 'CV (1 page)', sub: 'PDF',                       href: '/cv.pdf',                                    cta: 'DOWNLOAD →' },
  { kind: 'github',   name: 'GitHub',      sub: 'github.com/pappdavid',      href: 'https://github.com/pappdavid',               cta: 'GITHUB →' },
  { kind: 'linkedin', name: 'LinkedIn',    sub: 'linkedin.com/in/pappdavid', href: 'https://www.linkedin.com/in/pappdavid',      cta: 'LINKEDIN →' },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-32" style={{ background: 'var(--bg-0)' }}>
      <div className="dp-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div>
            <div className="dp-eyebrow">// 06 — LET&apos;S CONNECT</div>
            <h2 className="t-h2" style={{ color: 'var(--ink-0)', marginBottom: 20 }}>
              Let&apos;s build<br /><span style={{ color: 'var(--accent-bright)' }}>something real.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--ink-1)', lineHeight: 1.55, maxWidth: 400, marginBottom: 32 }}>
              Open to junior AI / automation engineer or data science roles in the Netherlands.
            </p>
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-line)', fontFamily: 'var(--font-dp-mono)', fontSize: 11 }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
              <span style={{ color: 'var(--accent-bright)' }}>AVAILABLE</span>
              <span style={{ color: 'var(--ink-3)' }}>·</span>
              <span style={{ color: 'var(--ink-2)' }}>REPLIES WITHIN 24H</span>
            </div>
          </div>

          {/* Right — channel card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid var(--border-subtle)' }}
          >
            {CHANNELS.map((ch) => (
              <a
                key={ch.href}
                href={ch.href}
                target={ch.href.startsWith('http') ? '_blank' : undefined}
                rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{
                  textDecoration: 'none',
                  background: ch.primary ? 'var(--bg-3)' : 'var(--bg-2)',
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 24px',
                }}
              >
                <div style={{ color: ch.primary ? 'var(--accent)' : 'var(--ink-3)', flexShrink: 0 }}>
                  <Glyph kind={ch.kind} size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-0)' }}>{ch.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-dp-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.sub}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 11, color: ch.primary ? 'var(--accent-bright)' : 'var(--ink-3)', flexShrink: 0 }}>
                  {ch.cta}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
