'use client';

import Link from 'next/link';
import { type MouseEvent, useEffect, useState } from 'react';
import { IconMenu2 } from '@tabler/icons-react';

import { Glyph } from '@/components/landing/glyph';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { publicNavItems } from '@/config/nav-config';

const SECTION_LINKS = [
  { label: 'Proof', href: '#proof', id: 'proof' },
  { label: 'Systems', href: '#systems', id: 'systems' },
  { label: 'Principles', href: '#principles', id: 'principles' },
  { label: 'Assistant', href: '#assistant', id: 'assistant' },
  { label: 'Contact', href: '#contact', id: 'contact' }
];

export function Chrome2() {
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSectionLinkClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    event.preventDefault();
    setMenuOpen(false);

    window.requestAnimationFrame(() => {
      const target = document.querySelector(href);
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      target?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      window.history.pushState(null, '', href);
    });
  }

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
      className='fixed top-0 right-0 left-0 z-50'
      style={{
        background: 'rgba(12,11,9,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        height: 56
      }}
    >
      <div
        className='flex h-full items-center justify-between'
        style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}
      >
        <Link href='/' className='flex items-center gap-2.5 no-underline'>
          <Glyph kind='hex' size={28} color='var(--accent)' />
          <span
            style={{
              fontFamily: 'var(--font-dp-sans)',
              fontWeight: 600,
              fontSize: 15,
              color: 'var(--ink-0)',
              letterSpacing: 0
            }}
          >
            DavidOS{' '}
            <span
              className='hidden sm:inline'
              style={{
                fontFamily: 'var(--font-dp-mono)',
                fontWeight: 400,
                fontSize: 11,
                color: 'var(--ink-3)',
                letterSpacing: '0.08em'
              }}
            >
              Control Room
            </span>
          </span>
        </Link>

        <div
          className='hidden items-center gap-1 md:flex'
          style={{
            background: 'rgba(243,239,229,0.04)',
            borderRadius: 999,
            padding: '4px 8px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {SECTION_LINKS.map(({ label, href, id }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={label}
                href={href}
                style={{
                  padding: '5px 14px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontFamily: 'var(--font-dp-sans)',
                  color: isActive ? 'var(--ink-0)' : 'var(--ink-2)',
                  background: isActive
                    ? 'rgba(243,239,229,0.07)'
                    : 'transparent',
                  textDecoration: 'none',
                  transition: 'color 0.15s, background 0.15s'
                }}
              >
                {label}
              </a>
            );
          })}
        </div>

        <div className='flex items-center gap-2'>
          <Link
            href='/#contact'
            className='dp-btn dp-btn-ghost hidden md:inline-flex'
            style={{ padding: '7px 16px', fontSize: 13 }}
          >
            Let&apos;s connect <span aria-hidden>→</span>
          </Link>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild className='md:hidden'>
              <button
                aria-label='Open menu'
                className='flex h-11 w-11 items-center justify-center rounded-md'
                style={{ color: 'var(--ink-2)' }}
              >
                <IconMenu2 className='h-5 w-5' />
              </button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='w-72 border-white/[0.07] bg-[#0a0a0c]'
            >
              <SheetTitle className='sr-only'>Landing navigation</SheetTitle>
              <SheetDescription className='sr-only'>
                Jump to page sections or public pages.
              </SheetDescription>
              <nav className='mt-8 flex flex-col gap-1'>
                <div className='dp-eyebrow' style={{ marginBottom: 8 }}>
                  {'// SECTIONS'}
                </div>
                {SECTION_LINKS.map(({ label, href, id }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={(event) => handleSectionLinkClick(event, href)}
                    style={{
                      padding: '10px 12px',
                      minHeight: 44,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 8,
                      fontSize: 14,
                      color:
                        activeSection === id ? 'var(--ink-0)' : 'var(--ink-2)',
                      textDecoration: 'none'
                    }}
                  >
                    {label}
                  </a>
                ))}

                <div
                  className='dp-eyebrow'
                  style={{ marginTop: 16, marginBottom: 8 }}
                >
                  {'// MORE'}
                </div>
                {publicNavItems.map((item) => (
                  <Link
                    key={item.url}
                    href={item.url}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      padding: '10px 12px',
                      minHeight: 44,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 8,
                      fontSize: 14,
                      color: 'var(--ink-2)',
                      textDecoration: 'none'
                    }}
                  >
                    {item.title}
                  </Link>
                ))}

                <Link
                  href='/#contact'
                  onClick={() => setMenuOpen(false)}
                  className='dp-btn dp-btn-primary'
                  style={{ marginTop: 16, justifyContent: 'center' }}
                >
                  Let&apos;s connect →
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
