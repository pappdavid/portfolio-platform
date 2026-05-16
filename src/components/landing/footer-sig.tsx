'use client';

import { Glyph } from '@/components/landing/glyph';

export function FooterSig() {
  return (
    <footer style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="dp-wrap py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Lockup */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Glyph kind="hex" size={28} color="var(--ink-3)" />
              <div>
                <div style={{ fontFamily: 'var(--font-dp-sans)', fontWeight: 600, fontSize: 15, color: 'var(--ink-0)' }}>DavidOS</div>
                <div style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.08em' }}>Control Room</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>
              AI Engineering student at VU Amsterdam. Available for junior AI / automation engineer roles in the Netherlands.
            </p>
            <div style={{ marginTop: 12, fontFamily: 'var(--font-dp-mono)', fontSize: 11, color: 'var(--ink-3)' }}>© 2026 · DavidOS Control Room</div>
          </div>

          {/* Systems */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 11, color: 'var(--ink-2)', letterSpacing: '0.1em', marginBottom: 16 }}>SYSTEMS</h4>
            {[['MCP Sentinel', '/mcp'], ['Custom Training', '/training'], ['RAG + 3D Chat', '/chat']].map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{ display: 'block', fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none', marginBottom: 8, transition: 'color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink-1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-3)'; }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 11, color: 'var(--ink-2)', letterSpacing: '0.1em', marginBottom: 16 }}>CONTACT</h4>
            {[['contact@davidpapp.dev', 'mailto:contact@davidpapp.dev'], ['20-min call', 'https://calendly.com/david-webinform/30min'], ['CV.pdf', '/cv.pdf']].map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{ display: 'block', fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none', marginBottom: 8 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink-1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-3)'; }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Elsewhere */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 11, color: 'var(--ink-2)', letterSpacing: '0.1em', marginBottom: 16 }}>ELSEWHERE</h4>
            {[['github.com/pappdavid', 'https://github.com/pappdavid'], ['linkedin.com/in/pappdavid', 'https://www.linkedin.com/in/pappdavid']].map(([label, href]) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none', marginBottom: 8 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink-1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-3)'; }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 11, color: 'var(--ink-3)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Glyph kind="hex" size={12} color="var(--ink-3)" />
          <span>Built with Three.js · React · portfolio-local assistant</span>
        </div>
        <span style={{ fontFamily: 'var(--font-dp-mono)', fontSize: 11, color: 'var(--accent-bright)' }}>All systems online</span>
      </div>
    </footer>
  );
}
