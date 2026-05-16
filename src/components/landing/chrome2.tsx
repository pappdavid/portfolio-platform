'use client';

import { useState, useEffect } from 'react';
import { Glyph } from '@/components/landing/glyph';

export function Chrome2() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(12,11,9,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        height: 56,
      }}
    >
      <div
        className="h-full flex items-center justify-between"
        style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}
      >
        {/* Mark */}
        <div className="flex items-center gap-2.5">
          <Glyph kind="hex" size={28} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-dp-sans)', fontWeight: 600, fontSize: 15, color: 'var(--ink-0)', letterSpacing: '-0.02em' }}>
            DavidOS{' '}
            <span style={{ fontFamily: 'var(--font-dp-mono)', fontWeight: 400, fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.08em' }}>
              Control Room
            </span>
          </span>
        </div>

        {/* Center nav */}
        <div
          className="hidden md:flex items-center gap-1"
          style={{ background: 'rgba(243,239,229,0.04)', borderRadius: 999, padding: '4px 8px', border: '1px solid var(--border-subtle)' }}
        >
          {['Proof', 'Systems', 'Principles', 'Assistant', 'Contact'].map((label, i) => {
            const hrefs = ['#proof', '#modules', '#laws', '#assistant', '#contact'];
            const sectionId = hrefs[i].slice(1);
            const isActive = activeSection === sectionId;
            return (
              <a
                key={label}
                href={hrefs[i]}
                style={{
                  padding: '5px 14px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontFamily: 'var(--font-dp-sans)',
                  color: isActive ? 'var(--ink-0)' : 'var(--ink-2)',
                  background: isActive ? 'rgba(243,239,229,0.07)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'color 0.15s, background 0.15s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink-0)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = isActive ? 'var(--ink-0)' : 'var(--ink-2)'; }}
              >
                {label}
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <a
          href="mailto:contact@davidpapp.dev"
          className="dp-btn dp-btn-ghost"
          style={{ padding: '7px 16px', fontSize: 13 }}
        >
          Let&apos;s connect <span aria-hidden>→</span>
        </a>
      </div>
    </nav>
  );
}
