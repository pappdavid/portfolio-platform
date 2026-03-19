import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/shared/code-block';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';

export const metadata: Metadata = {
  title: 'MCP Sentinel — Project Detail'
};

const diagram = `graph TD
  A[Agent Request] --> B[MCP Sentinel Proxy]
  B --> C[Rate Limiter]
  C --> D[Injection Detector]
  D --> E[PII Scanner]
  E --> F[Cost Tracker]
  F --> G{All Pass?}
  G -->|Yes| H[Forward to Tool]
  G -->|No| I[Block + Alert]
  H --> J[Log Event]
  I --> J
  J --> K[Dashboard]`;

const codeSnippet = `// Guard middleware pipeline
async function runGuards(event: MCPEvent): Promise<GuardResult> {
  const guards = [rateLimiter, injectionDetector, piiScanner, costTracker];
  for (const guard of guards) {
    const result = await guard.check(event);
    if (result.action === 'block') {
      await logEvent({ ...event, status: 'blocked', guard: guard.name });
      return result;
    }
  }
  return { action: 'allow' };
}`;

const stack = ['TypeScript', 'Next.js', 'Supabase', 'Clerk', 'MCP Protocol'];

export default function McpSentinelDetailPage() {
  return (
    <div className='relative text-white'>
      {/* Hero */}
      <section className='mx-auto max-w-4xl px-6 py-20'>
        <Badge variant='secondary' className='mb-4'>
          Observability
        </Badge>
        <h1 className='mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl'>
          MCP Sentinel
        </h1>
        <p className='text-muted-foreground mb-8 max-w-2xl text-lg'>
          A proxy layer for Model Context Protocol that logs, guards, and audits
          every agent tool call in real time.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button asChild>
            <Link href='/mcp'>View live demo</Link>
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
            AI agents running in production make hundreds of tool calls per
            hour. Without visibility, injection attacks, runaway costs, and PII
            leaks go undetected. Existing logging solutions don&apos;t
            understand the MCP protocol.
          </p>
        </div>
      </section>

      {/* Solution + diagram */}
      <section className='border-t border-white/[0.07] py-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Solution</h2>
          <p className='text-muted-foreground mb-8 leading-relaxed'>
            MCP Sentinel inserts a transparent proxy between agents and their
            tools. Every call passes through a configurable guard pipeline
            before being forwarded (or blocked), and every event is logged to
            Supabase with row-level security.
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
            language='typescript'
            filename='guards.ts'
          />
        </div>
      </section>
    </div>
  );
}
