import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/shared/code-block';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';

export const metadata: Metadata = {
  title: 'Portfolio Platform — Project Detail'
};

const diagram = `graph TD
  A[Root Layout] --> B[ThemeProvider]
  B --> C[ClerkProvider]
  C --> D{Route Group}
  D -->|Public| E[Marketing Pages]
  D -->|Dashboard| F[Protected Shell]
  D -->|Auth| G[Sign In/Up]
  F --> H[Sidebar + Header]
  H --> I[Page Content]`;

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
          <Button asChild>
            <Link href='/dashboard/overview'>View dashboard</Link>
          </Button>
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
          <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
            <MermaidDiagram chart={diagram} />
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
