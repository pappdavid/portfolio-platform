'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const colorPalette = [
  {
    name: 'Primary',
    variable: '--primary',
    swatch: 'bg-primary',
    text: 'text-primary-foreground'
  },
  {
    name: 'Secondary',
    variable: '--secondary',
    swatch: 'bg-secondary',
    text: 'text-secondary-foreground'
  },
  {
    name: 'Accent',
    variable: '--accent',
    swatch: 'bg-accent',
    text: 'text-accent-foreground'
  },
  {
    name: 'Muted',
    variable: '--muted',
    swatch: 'bg-muted',
    text: 'text-muted-foreground'
  },
  {
    name: 'Destructive',
    variable: '--destructive',
    swatch: 'bg-destructive',
    text: 'text-destructive-foreground'
  },
  {
    name: 'Background',
    variable: '--background',
    swatch: 'bg-background',
    text: 'text-foreground'
  },
  {
    name: 'Card',
    variable: '--card',
    swatch: 'bg-card',
    text: 'text-card-foreground'
  },
  {
    name: 'Border',
    variable: '--border',
    swatch: 'bg-border',
    text: 'text-foreground'
  }
];

const typographySamples = [
  {
    label: 'H1',
    className: 'text-4xl font-bold tracking-tight',
    text: 'Heading One'
  },
  { label: 'H2', className: 'text-3xl font-bold', text: 'Heading Two' },
  { label: 'H3', className: 'text-2xl font-bold', text: 'Heading Three' },
  { label: 'H4', className: 'text-xl font-semibold', text: 'Heading Four' },
  {
    label: 'Body',
    className: 'text-base',
    text: 'Body text used for paragraphs and general content.'
  },
  {
    label: 'Small',
    className: 'text-sm text-muted-foreground',
    text: 'Small text for captions and metadata.'
  },
  {
    label: 'Mono',
    className: 'font-mono text-sm',
    text: 'Monospace for code and technical content.'
  }
];

export default function BrandPage() {
  return (
    <div className='flex flex-col'>
      {/* Header */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <Badge variant='secondary' className='mb-4'>
            Design System
          </Badge>
          <h1 className='text-foreground text-4xl font-bold tracking-tight sm:text-5xl'>
            Brand Guidelines
          </h1>
          <p className='text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed'>
            Color palette, typography, and component conventions used across the
            portfolio platform. All values are derived from CSS custom
            properties using OKLCH color format.
          </p>
        </div>
      </section>

      {/* Color Palette */}
      <section className='bg-muted/30 py-16'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-8 text-2xl font-bold'>
            Color Palette
          </h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {colorPalette.map((color) => (
              <div
                key={color.name}
                className='overflow-hidden rounded-xl border'
              >
                <div className={cn('flex h-24 items-end p-3', color.swatch)}>
                  <span className={cn('text-xs font-medium', color.text)}>
                    {color.name}
                  </span>
                </div>
                <div className='bg-background p-3'>
                  <p className='text-muted-foreground font-mono text-xs'>
                    var({color.variable})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className='py-16'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-8 text-2xl font-bold'>
            Typography
          </h2>
          <div className='space-y-6'>
            {typographySamples.map((sample) => (
              <div
                key={sample.label}
                className='flex items-baseline gap-6 border-b pb-4 last:border-0'
              >
                <span className='text-muted-foreground w-16 shrink-0 font-mono text-xs'>
                  {sample.label}
                </span>
                <span className={cn('text-foreground', sample.className)}>
                  {sample.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className='bg-muted/30 py-16'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-8 text-2xl font-bold'>
            Component Rules
          </h2>
          <div className='space-y-8'>
            {/* Buttons */}
            <div>
              <h3 className='text-foreground mb-4 font-semibold'>Buttons</h3>
              <div className='flex flex-wrap gap-3'>
                <Button>Primary</Button>
                <Button variant='secondary'>Secondary</Button>
                <Button variant='outline'>Outline</Button>
                <Button variant='ghost'>Ghost</Button>
                <Button variant='destructive'>Destructive</Button>
                <Button variant='link'>Link</Button>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className='text-foreground mb-4 font-semibold'>Badges</h3>
              <div className='flex flex-wrap gap-3'>
                <Badge>Default</Badge>
                <Badge variant='secondary'>Secondary</Badge>
                <Badge variant='outline'>Outline</Badge>
                <Badge variant='destructive'>Destructive</Badge>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className='text-foreground mb-4 font-semibold'>Cards</h3>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='bg-background rounded-xl border p-6 shadow-sm'>
                  <h4 className='text-foreground font-semibold'>
                    Default Card
                  </h4>
                  <p className='text-muted-foreground mt-2 text-sm'>
                    Standard card with border and subtle shadow.
                  </p>
                </div>
                <div className='bg-card rounded-xl border p-6'>
                  <h4 className='text-foreground font-semibold'>
                    Card Variant
                  </h4>
                  <p className='text-muted-foreground mt-2 text-sm'>
                    Using bg-card for elevated surfaces.
                  </p>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div>
              <h3 className='text-foreground mb-4 font-semibold'>
                Conventions
              </h3>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li>
                  Use{' '}
                  <code className='bg-muted rounded px-1 font-mono text-xs'>
                    cn()
                  </code>{' '}
                  for all className merging
                </li>
                <li>Prefer shadcn/ui primitives over custom implementations</li>
                <li>
                  Use CSS variables (OKLCH) for all colors — no hardcoded hex
                </li>
                <li>Icons from @tabler/icons-react, registered in icons.tsx</li>
                <li>Single quotes, no trailing commas, 2-space indent</li>
                <li>Server components by default, client only when needed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
