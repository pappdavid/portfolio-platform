import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/shared/code-block';

export const metadata: Metadata = {
  title: 'Portfolio Platform — Project Detail'
};

const codeSnippet = `// Theme-aware Clerk provider
'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export function Providers({ children }) {
  const { resolvedTheme } = useTheme();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}`;

const stack = [
  'Next.js 16',
  'shadcn/ui',
  'Clerk',
  'Tailwind CSS v4',
  'TypeScript'
];

function PortfolioArchSvg() {
  return (
    <svg
      viewBox='0 0 600 190'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='mx-auto w-full max-w-lg'
      aria-label='Portfolio platform architecture: Root Layout wraps ThemeProvider, which wraps ClerkProvider, which splits into Public Routes, Dashboard (auth protected), and Auth sign-in'
    >
      {/* Root Layout */}
      <rect
        x='200'
        y='0'
        width='120'
        height='36'
        rx='7'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.09)'
        strokeWidth='1'
      />
      <text
        x='260'
        y='22'
        textAnchor='middle'
        fill='#a1a1aa'
        fontSize='10'
        fontFamily='monospace'
      >
        Root Layout
      </text>
      {/* connector */}
      <path
        d='M260 36 L260 52'
        stroke='rgba(255,255,255,0.15)'
        strokeWidth='1.5'
      />
      <polygon points='256.5,52 260,58 263.5,52' fill='rgba(255,255,255,0.2)' />
      {/* ThemeProvider */}
      <rect
        x='200'
        y='58'
        width='120'
        height='36'
        rx='7'
        fill='rgba(168,85,247,0.06)'
        stroke='rgba(168,85,247,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='260'
        y='80'
        textAnchor='middle'
        fill='#a855f7'
        fontSize='10'
        fontFamily='monospace'
      >
        ThemeProvider
      </text>
      {/* connector */}
      <path
        d='M260 94 L260 110'
        stroke='rgba(255,255,255,0.15)'
        strokeWidth='1.5'
      />
      <polygon
        points='256.5,110 260,116 263.5,110'
        fill='rgba(255,255,255,0.2)'
      />
      {/* ClerkProvider */}
      <rect
        x='200'
        y='116'
        width='120'
        height='36'
        rx='7'
        fill='rgba(34,197,94,0.06)'
        stroke='rgba(34,197,94,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='260'
        y='138'
        textAnchor='middle'
        fill='#22c55e'
        fontSize='10'
        fontFamily='monospace'
      >
        ClerkProvider
      </text>
      {/* fan out to three route groups */}
      <path
        d='M200 134 L80 154 L80 162'
        stroke='rgba(255,255,255,0.12)'
        strokeWidth='1.5'
      />
      <path
        d='M260 152 L260 162'
        stroke='rgba(255,255,255,0.12)'
        strokeWidth='1.5'
      />
      <path
        d='M320 134 L440 154 L440 162'
        stroke='rgba(255,255,255,0.12)'
        strokeWidth='1.5'
      />
      {/* Route group boxes */}
      <rect
        x='20'
        y='162'
        width='120'
        height='26'
        rx='5'
        fill='rgba(255,255,255,0.03)'
        stroke='rgba(255,255,255,0.07)'
        strokeWidth='1'
      />
      <text
        x='80'
        y='179'
        textAnchor='middle'
        fill='#52525b'
        fontSize='9'
        fontFamily='monospace'
      >
        Public Routes
      </text>
      <rect
        x='200'
        y='162'
        width='120'
        height='26'
        rx='5'
        fill='rgba(34,197,94,0.05)'
        stroke='rgba(34,197,94,0.15)'
        strokeWidth='1'
      />
      <text
        x='260'
        y='179'
        textAnchor='middle'
        fill='#22c55e'
        fontSize='9'
        fontFamily='monospace'
      >
        Dashboard (auth)
      </text>
      <rect
        x='380'
        y='162'
        width='120'
        height='26'
        rx='5'
        fill='rgba(255,255,255,0.03)'
        stroke='rgba(255,255,255,0.07)'
        strokeWidth='1'
      />
      <text
        x='440'
        y='179'
        textAnchor='middle'
        fill='#52525b'
        fontSize='9'
        fontFamily='monospace'
      >
        Auth (sign-in)
      </text>
    </svg>
  );
}

export default function PortfolioDetailPage() {
  return (
    <div className='relative text-white'>
      {/* Hero */}
      <section className='mx-auto max-w-4xl px-6 py-20'>
        <Badge variant='secondary' className='mb-4'>
          Platform
        </Badge>
        <h1 className='mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl'>
          Portfolio Platform
        </h1>
        <p className='text-muted-foreground mb-8 max-w-2xl text-lg'>
          This site itself. A Next.js 16 dashboard with multi-theme system, RBAC
          navigation, and Clerk auth.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button variant='outline' asChild>
            <a
              href='https://github.com/pappdavid/portfolio-platform'
              target='_blank'
              rel='noopener noreferrer'
            >
              View code
            </a>
          </Button>
        </div>
      </section>

      {/* Problem */}
      <section className='border-t border-white/[0.07] py-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Problem</h2>
          <p className='text-muted-foreground leading-relaxed'>
            Most portfolio sites are static HTML pages. Building a fully
            interactive platform that demonstrates real engineering skill —
            authentication, protected routes, data persistence, themeing —
            requires a full-stack approach.
          </p>
        </div>
      </section>

      {/* Solution + diagram */}
      <section className='border-t border-white/[0.07] py-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Solution</h2>
          <p className='text-muted-foreground mb-8 leading-relaxed'>
            Forked from next-shadcn-dashboard-starter and reconfigured as a
            portfolio platform. Features six OKLCH themes, client-side RBAC
            navigation filtering, parallel dashboard routes, and Supabase
            backend.
          </p>
          <div className='overflow-x-auto rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
            <PortfolioArchSvg />
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className='border-t border-white/[0.07] py-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Tech Stack</h2>
          <div className='flex flex-wrap gap-2'>
            {stack.map((t) => (
              <Badge key={t} variant='outline'>
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Code snippet */}
      <section className='border-t border-white/[0.07] py-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Code</h2>
          <CodeBlock
            code={codeSnippet}
            language='tsx'
            filename='providers.tsx'
          />
        </div>
      </section>
    </div>
  );
}
