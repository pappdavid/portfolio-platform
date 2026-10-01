'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { type DemoEntry, getDemosForRole } from '@/config/demos';
import { demoIframeSrc } from '@/config/demo-urls';

interface DemoStripProps {
  roleId: string | null | undefined;
  /** Optional override: "See it in action" label already set by caller. */
  label?: string;
}

/**
 * Lazy, expand-on-tap iframe strip of the three portfolio demos for a
 * rolegroup. Demos receive ?role=<rolegroup> as a deep link. Iframes start
 * collapsed (thumb-friendly open control) and only load when the user opens
 * one — never autoplay on page load. Sizing is 375px-first to stay usable at
 * mobile width.
 */
export function DemoStrip({ roleId }: DemoStripProps) {
  const [search, setSearch] = useState('');
  useEffect(() => setSearch(window.location.search), []);
  const demos = getDemosForRole(roleId);
  const featured = demos[0];
  const [openId, setOpenId] = useState<string | null>(
    roleId && demos[0] ? demos[0].slug : null
  );

  return (
    <section
      className='demo-strip block'
      aria-label='Portfolio demos'
      data-role={roleId ?? 'general'}
    >
      <div className='sec-head'>
        <span className='sec-cmd'>ls -la /demos/</span>
        <span className='sec-note'>LIVE DEMOS</span>
      </div>

      <p className='sub-note'>
        Interactive portfolio demos — illustrative by design, hosted as
        independent static bundles.
      </p>

      <div className='demo-grid'>
        {demos.map((demo, index) => {
          const isOpen = openId === demo.slug;
          const src = demoIframeSrc(demo.slug, roleId, search);
          return (
            <DemoCard
              key={demo.slug}
              demo={demo}
              index={index}
              featured={featured?.slug === demo.slug}
              isOpen={isOpen}
              src={src}
              onToggle={() => setOpenId(isOpen ? null : demo.slug)}
            />
          );
        })}
      </div>
    </section>
  );
}

interface DemoCardProps {
  demo: DemoEntry;
  index: number;
  featured: boolean;
  isOpen: boolean;
  src: string;
  onToggle: () => void;
}

function DemoCard({
  demo,
  index,
  featured,
  isOpen,
  src,
  onToggle
}: DemoCardProps) {
  return (
    <div
      className={cn(
        'demo-card',
        isOpen && 'demo-card-open',
        featured && 'demo-card-featured',
        'border border-[var(--dp-border)] bg-[var(--dp-bg-raised)]'
      )}
      style={{
        // 375px-first: mobile-friendly width, grows on wider viewports.
        aspectRatio: isOpen ? undefined : '16 / 9'
      }}
    >
      <button
        type='button'
        className='demo-card-head w-full cursor-pointer text-left'
        title={demo.slug}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`demo-iframe-${demo.slug}`}
      >
        <span className='dirname'>
          <span className={cn('caret', isOpen && 'open')}>▶</span>
          <span
            className='demo-badge'
            style={{
              color: featured ? 'var(--dp-accent)' : 'var(--dp-text-dim)',
              borderColor: featured ? 'var(--dp-accent)' : 'var(--dp-border)'
            }}
          >
            #{index + 1} {featured && 'featured'}
          </span>
          {demo.title}
        </span>
      </button>

      <p className='demo-desc text-[11px] leading-relaxed text-[var(--dp-text-dim)]'>
        {demo.description}
      </p>

      <button
        type='button'
        className='open-btn inline-block'
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`demo-iframe-${demo.slug}`}
      >
        {isOpen ? '[hide]' : '[open]'} See it in action →
      </button>

      <a
        href={src}
        target='_blank'
        rel='noopener noreferrer'
        className='ml-4 inline-block py-2 text-xs underline underline-offset-4'
      >
        Open {demo.title} in a full page
      </a>

      {isOpen && (
        <iframe
          id={`demo-iframe-${demo.slug}`}
          className='demo-iframe'
          src={src}
          title={`Portfolio demo: ${demo.title}`}
          loading='lazy'
          // 375px-first sizing; never autoplay on page load — iframe is only
          // mounted when the user opens the card.
          style={{
            width: '100%',
            height: 'min(720px, 75vh)',
            minHeight: '480px'
          }}
        />
      )}
    </div>
  );
}
