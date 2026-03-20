import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/shared/code-block';
import {
  ArchDiagram,
  type ArchNode,
  type ArchEdge
} from '@/components/shared/arch-diagram';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'MCP Sentinel',
  description:
    'Drop-in observability proxy for MCP agent tool calls — logs, guards, and audits every interaction.',
  slug: 'mcp-sentinel'
});

const nodes: ArchNode[] = [
  {
    id: 'agent',
    label: 'Agent',
    tooltip: 'LLM agent making tool calls (Claude, GPT-4, etc.)',
    color: 'default',
    x: 0,
    y: 80
  },
  {
    id: 'sentinel',
    label: 'MCP Sentinel',
    tooltip: 'Transparent proxy — all traffic passes through here',
    color: 'green',
    x: 180,
    y: 80
  },
  {
    id: 'rate',
    label: 'Rate Limiter',
    tooltip: 'Sliding-window rate limit per API key (Upstash Redis)',
    color: 'green',
    x: 360,
    y: 0
  },
  {
    id: 'inject',
    label: 'Injection Detector',
    tooltip: 'Pattern-matches tool inputs for prompt injection attempts',
    color: 'green',
    x: 360,
    y: 80
  },
  {
    id: 'pii',
    label: 'PII Scanner',
    tooltip: 'Redacts or blocks calls containing PII (email, SSN, etc.)',
    color: 'green',
    x: 360,
    y: 160
  },
  {
    id: 'tools',
    label: 'Tools',
    tooltip: 'Your actual MCP tools — file read, web search, DB query…',
    color: 'cyan',
    x: 560,
    y: 40
  },
  {
    id: 'blocked',
    label: 'BLOCKED',
    tooltip: 'Guard triggered — call rejected, alert fired',
    color: 'default',
    x: 560,
    y: 160
  },
  {
    id: 'log',
    label: 'Event Log',
    tooltip: 'Every call logged to Supabase with RLS',
    color: 'cyan',
    x: 740,
    y: 80
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    tooltip: 'Real-time event stream visible to authenticated users',
    color: 'cyan',
    x: 920,
    y: 80
  }
];

const edges: ArchEdge[] = [
  { id: 'e1', from: 'agent', to: 'sentinel' },
  { id: 'e2', from: 'sentinel', to: 'rate' },
  { id: 'e3', from: 'sentinel', to: 'inject' },
  { id: 'e4', from: 'sentinel', to: 'pii' },
  { id: 'e5', from: 'rate', to: 'tools', label: 'pass' },
  { id: 'e6', from: 'inject', to: 'tools', label: 'pass' },
  { id: 'e7', from: 'pii', to: 'tools', label: 'pass' },
  { id: 'e8', from: 'inject', to: 'blocked', label: 'block' },
  { id: 'e9', from: 'tools', to: 'log' },
  { id: 'ea', from: 'blocked', to: 'log' },
  { id: 'eb', from: 'log', to: 'dashboard' }
];

const codeSnippet = `// Guard middleware pipeline
async function runGuards(event: MCPEvent): Promise<GuardResult> {
  const guards = [rateLimiter, injectionDetector, piiScanner];
  for (const guard of guards) {
    const result = await guard.check(event);
    if (result.action === 'block') {
      await logEvent({ ...event, status: 'blocked', guard: guard.name });
      return result;
    }
  }
  return { action: 'allow' };
}`;

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
        <p className='text-muted-foreground mb-4 text-sm'>
          <span className='text-foreground font-medium'>My role:</span> Solo
          project — designed and built to explore agent observability patterns.
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
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Problem</h2>
          <p className='text-muted-foreground leading-relaxed'>
            AI agents running in production make hundreds of tool calls per
            hour. Without visibility, injection attacks, runaway costs, and PII
            leaks go undetected until they cause real damage. Existing logging
            solutions don&apos;t understand the MCP protocol structure.
          </p>
        </div>
      </section>

      {/* What this demonstrates */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>What this demonstrates</h2>
          <ul className='text-muted-foreground list-inside list-disc space-y-2 leading-relaxed'>
            <li>
              Designing a composable middleware pipeline that is extensible
              without modifying existing guards
            </li>
            <li>
              Integrating Upstash Redis sliding-window rate limiting in a
              Next.js edge-compatible context
            </li>
            <li>
              Supabase RLS as a security boundary — dashboard only shows events
              for the authenticated API key owner
            </li>
          </ul>
        </div>
      </section>

      {/* Architecture diagram */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Architecture</h2>
          <ArchDiagram nodes={nodes} edges={edges} height={280} />
        </div>
      </section>

      {/* Tech stack rationale */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Tech stack rationale</h2>
          <ul className='text-muted-foreground space-y-2 leading-relaxed'>
            <li>
              <span className='font-semibold text-white'>
                TypeScript + Next.js:
              </span>{' '}
              API routes act as the proxy layer; type safety enforced across the
              full guard pipeline.
            </li>
            <li>
              <span className='font-semibold text-white'>Supabase:</span> Event
              storage with row-level security; each API key can only query its
              own events.
            </li>
            <li>
              <span className='font-semibold text-white'>Upstash Redis:</span>{' '}
              Serverless-compatible sliding-window rate limiter; no persistent
              connection required.
            </li>
            <li>
              <span className='font-semibold text-white'>Clerk:</span> Auth; the
              dashboard is protected and API keys are scoped per user.
            </li>
          </ul>
        </div>
      </section>

      {/* Code snippet */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Code</h2>
          <CodeBlock
            code={codeSnippet}
            language='typescript'
            filename='guards.ts'
          />
        </div>
      </section>

      {/* Results / Impact */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Results</h2>
          <ul className='text-muted-foreground list-inside list-disc space-y-2 leading-relaxed'>
            <li>Reference implementation — not production-deployed</li>
            <li>
              Demonstrates sub-50ms guard evaluation on mock tool call payloads
            </li>
            <li>
              Live demo processes 100 events/minute within Upstash free tier
              limits
            </li>
          </ul>
        </div>
      </section>

      {/* Screenshots */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Screenshots</h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Image
              src='/screenshots/mcp/desktop.png'
              alt='MCP Sentinel desktop view'
              width={800}
              height={500}
              className='w-full rounded-xl border border-white/[0.07]'
            />
            <Image
              src='/screenshots/mcp/mobile.png'
              alt='MCP Sentinel mobile view'
              width={375}
              height={667}
              className='w-full rounded-xl border border-white/[0.07]'
            />
          </div>
        </div>
      </section>

      {/* GitHub link */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Source</h2>
          <p className='text-muted-foreground leading-relaxed'>
            Private implementation — code samples available on request.{' '}
            <a
              href='https://github.com/pappdavid/portfolio-platform'
              target='_blank'
              rel='noopener noreferrer'
              className='text-white underline underline-offset-4 hover:opacity-80'
            >
              View on GitHub
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
