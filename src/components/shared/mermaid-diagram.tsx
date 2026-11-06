'use client';

import { useEffect, useId, useState } from 'react';
import { cn } from '@/lib/utils';

export function MermaidDiagram({
  chart,
  className
}: {
  chart: string;
  className?: string;
}) {
  const [svg, setSvg] = useState('');
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    let cancelled = false;
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        // The public surface is always dark (#0a0a0a) regardless of the
        // system theme, so lines/arrowheads must stay light to be visible.
        theme: 'dark',
        themeVariables: {
          lineColor: '#9ca3af',
          arrowheadColor: '#9ca3af'
        },
        securityLevel: 'loose',
        fontFamily: 'inherit'
      });
      mermaid
        .render(`mermaid-${id}`, chart)
        .then(({ svg }) => {
          if (!cancelled) setSvg(svg);
        })
        .catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (!svg) {
    return (
      <div
        className={cn(
          'bg-muted flex h-48 items-center justify-center rounded-lg',
          className
        )}
      >
        <span className='text-muted-foreground text-sm'>
          Loading diagram...
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex justify-center overflow-x-auto rounded-lg',
        className
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
