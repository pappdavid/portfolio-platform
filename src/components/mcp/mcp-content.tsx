'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/shared/code-block';
import {
  IconShield,
  IconPlayerPlay,
  IconCheck,
  IconClock,
  IconAlertTriangle
} from '@tabler/icons-react';
import { GridBackground } from '@/components/ui/grid-background';
import { MonoEyebrow } from '@/components/ui/mono-eyebrow';

const quickstartCode = `// Reference implementation — github.com/pappdavid/mcp-sentinel
import { MCPSentinel } from './sentinel';

const sentinel = new MCPSentinel({
  apiKey: process.env.MCP_API_KEY,
  guards: ['injection', 'pii', 'cost'],
});

// Wrap your MCP server
const server = sentinel.wrap(yourMCPServer);
server.listen(3001);`;

type MockEvent = {
  id: string;
  tool: string;
  status: 'allowed' | 'blocked' | 'warning';
  latency: string;
  timestamp: string;
};

function generateMockEvents(): MockEvent[] {
  const tools = [
    'file_read',
    'web_search',
    'code_execute',
    'db_query',
    'send_email'
  ];
  const statuses: MockEvent['status'][] = [
    'allowed',
    'allowed',
    'allowed',
    'warning',
    'blocked'
  ];
  return tools.map((tool, i) => ({
    id: `evt_${Math.random().toString(36).slice(2, 8)}`,
    tool,
    status: statuses[i],
    latency: `${Math.floor(Math.random() * 20 + 3)}ms`,
    timestamp: new Date(Date.now() - i * 2000).toISOString().slice(11, 19)
  }));
}

function McpArchSvg() {
  return (
    <svg
      viewBox='0 0 780 120'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='w-full'
      aria-label='MCP Sentinel architecture: Agent to MCP Sentinel to Guards to Tools or Blocked to Event Log to Dashboard'
    >
      <rect
        x='0'
        y='30'
        width='90'
        height='60'
        rx='8'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.1)'
        strokeWidth='1'
      />
      <text
        x='45'
        y='65'
        textAnchor='middle'
        fill='#a1a1aa'
        fontSize='11'
        fontFamily='monospace'
      >
        Agent
      </text>
      <path
        d='M92 60 L118 60'
        stroke='#22c55e'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='118,56.5 125,60 118,63.5' fill='#22c55e' />
      <rect
        x='127'
        y='30'
        width='110'
        height='60'
        rx='8'
        fill='rgba(34,197,94,0.07)'
        stroke='rgba(34,197,94,0.25)'
        strokeWidth='1.5'
      />
      <text
        x='182'
        y='65'
        textAnchor='middle'
        fill='#22c55e'
        fontSize='11'
        fontFamily='monospace'
      >
        MCP Sentinel
      </text>
      <path
        d='M239 60 L265 60'
        stroke='#22c55e'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='265,56.5 272,60 265,63.5' fill='#22c55e' />
      <rect
        x='274'
        y='0'
        width='90'
        height='36'
        rx='6'
        fill='rgba(255,255,255,0.03)'
        stroke='rgba(255,255,255,0.08)'
        strokeWidth='1'
      />
      <text
        x='319'
        y='22'
        textAnchor='middle'
        fill='#a1a1aa'
        fontSize='10'
        fontFamily='monospace'
      >
        Rate Limiter
      </text>
      <rect
        x='274'
        y='42'
        width='90'
        height='36'
        rx='6'
        fill='rgba(255,255,255,0.03)'
        stroke='rgba(255,255,255,0.08)'
        strokeWidth='1'
      />
      <text
        x='319'
        y='64'
        textAnchor='middle'
        fill='#a1a1aa'
        fontSize='10'
        fontFamily='monospace'
      >
        Inj. Detector
      </text>
      <rect
        x='274'
        y='84'
        width='90'
        height='36'
        rx='6'
        fill='rgba(255,255,255,0.03)'
        stroke='rgba(255,255,255,0.08)'
        strokeWidth='1'
      />
      <text
        x='319'
        y='106'
        textAnchor='middle'
        fill='#a1a1aa'
        fontSize='10'
        fontFamily='monospace'
      >
        PII Scanner
      </text>
      <path
        d='M366 60 L392 60'
        stroke='#22c55e'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='392,56.5 399,60 392,63.5' fill='#22c55e' />
      <rect
        x='401'
        y='30'
        width='90'
        height='60'
        rx='8'
        fill='rgba(6,182,212,0.06)'
        stroke='rgba(6,182,212,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='446'
        y='60'
        textAnchor='middle'
        fill='#06b6d4'
        fontSize='11'
        fontFamily='monospace'
      >
        Tools
      </text>
      <text
        x='446'
        y='75'
        textAnchor='middle'
        fill='#52525b'
        fontSize='9'
        fontFamily='monospace'
      >
        pass →
      </text>
      <path
        d='M493 60 L519 60'
        stroke='#06b6d4'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='519,56.5 526,60 519,63.5' fill='#06b6d4' />
      <rect
        x='528'
        y='30'
        width='90'
        height='60'
        rx='8'
        fill='rgba(6,182,212,0.06)'
        stroke='rgba(6,182,212,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='573'
        y='65'
        textAnchor='middle'
        fill='#06b6d4'
        fontSize='11'
        fontFamily='monospace'
      >
        Event Log
      </text>
      <path
        d='M620 60 L646 60'
        stroke='#06b6d4'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='646,56.5 653,60 646,63.5' fill='#06b6d4' />
      <rect
        x='655'
        y='30'
        width='90'
        height='60'
        rx='8'
        fill='rgba(6,182,212,0.06)'
        stroke='rgba(6,182,212,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='700'
        y='65'
        textAnchor='middle'
        fill='#06b6d4'
        fontSize='11'
        fontFamily='monospace'
      >
        Dashboard
      </text>
    </svg>
  );
}

function GuardFlowSvg() {
  return (
    <svg
      viewBox='0 0 680 200'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='w-full'
      aria-label='Guard flow: Request through Rate Limiter, Injection Check, PII Scanner, then Forward to Tool or Block with alert, both logged'
    >
      <rect
        x='0'
        y='60'
        width='100'
        height='40'
        rx='7'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.09)'
        strokeWidth='1'
      />
      <text
        x='50'
        y='85'
        textAnchor='middle'
        fill='#a1a1aa'
        fontSize='10'
        fontFamily='monospace'
      >
        Request
      </text>
      <path
        d='M102 80 L122 80'
        stroke='#22c55e'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='122,76.5 129,80 122,83.5' fill='#22c55e' />
      <rect
        x='131'
        y='60'
        width='100'
        height='40'
        rx='7'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.09)'
        strokeWidth='1'
      />
      <text
        x='181'
        y='85'
        textAnchor='middle'
        fill='#a1a1aa'
        fontSize='10'
        fontFamily='monospace'
      >
        Rate Limiter
      </text>
      <path
        d='M233 80 L253 80'
        stroke='#22c55e'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='253,76.5 260,80 253,83.5' fill='#22c55e' />
      <rect
        x='262'
        y='60'
        width='100'
        height='40'
        rx='7'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.09)'
        strokeWidth='1'
      />
      <text
        x='312'
        y='85'
        textAnchor='middle'
        fill='#a1a1aa'
        fontSize='10'
        fontFamily='monospace'
      >
        Inj. Check
      </text>
      <path
        d='M364 80 L384 80'
        stroke='#22c55e'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='384,76.5 391,80 384,83.5' fill='#22c55e' />
      <rect
        x='393'
        y='60'
        width='100'
        height='40'
        rx='7'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.09)'
        strokeWidth='1'
      />
      <text
        x='443'
        y='85'
        textAnchor='middle'
        fill='#a1a1aa'
        fontSize='10'
        fontFamily='monospace'
      >
        PII Scanner
      </text>
      <path
        d='M495 80 L515 80'
        stroke='#22c55e'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='515,76.5 522,80 515,83.5' fill='#22c55e' />
      <rect
        x='524'
        y='60'
        width='90'
        height='40'
        rx='7'
        fill='rgba(34,197,94,0.07)'
        stroke='rgba(34,197,94,0.25)'
        strokeWidth='1.5'
      />
      <text
        x='569'
        y='82'
        textAnchor='middle'
        fill='#22c55e'
        fontSize='10'
        fontFamily='monospace'
      >
        Forward
      </text>
      <text
        x='569'
        y='95'
        textAnchor='middle'
        fill='#22c55e'
        fontSize='8'
        fontFamily='monospace'
      >
        to Tool
      </text>
      <path
        d='M312 102 L312 148'
        stroke='#ef4444'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='308.5,148 312,155 315.5,148' fill='#ef4444' />
      <rect
        x='262'
        y='155'
        width='100'
        height='40'
        rx='7'
        fill='rgba(239,68,68,0.07)'
        stroke='rgba(239,68,68,0.25)'
        strokeWidth='1.5'
      />
      <text
        x='312'
        y='175'
        textAnchor='middle'
        fill='#ef4444'
        fontSize='10'
        fontFamily='monospace'
      >
        Block
      </text>
      <text
        x='312'
        y='188'
        textAnchor='middle'
        fill='#52525b'
        fontSize='8'
        fontFamily='monospace'
      >
        + alert
      </text>
      <path
        d='M569 102 L569 130 L622 130 L622 155'
        stroke='#06b6d4'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <rect
        x='580'
        y='155'
        width='90'
        height='40'
        rx='7'
        fill='rgba(6,182,212,0.06)'
        stroke='rgba(6,182,212,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='625'
        y='180'
        textAnchor='middle'
        fill='#06b6d4'
        fontSize='10'
        fontFamily='monospace'
      >
        Log Event
      </text>
      <path
        d='M362 175 L580 175'
        stroke='#ef4444'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
    </svg>
  );
}

export function McpContent() {
  const [events, setEvents] = useState<MockEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const runDemo = () => {
    setLoading(true);
    setEvents([]);
    const mockEvents = generateMockEvents();
    mockEvents.forEach((event, i) => {
      setTimeout(
        () => {
          setEvents((prev) => [...prev, event]);
          if (i === mockEvents.length - 1) setLoading(false);
        },
        (i + 1) * 600
      );
    });
  };

  return (
    <div className='flex flex-col'>
      {/* Hero */}
      <section className='relative z-10 mx-auto max-w-4xl px-6 py-20'>
        <GridBackground />
        <MonoEyebrow color='green' className='mb-6'>
          Agent Observability
        </MonoEyebrow>
        <h1
          className='mb-4 text-5xl leading-[1.07] font-extrabold tracking-[-0.04em]'
          style={{
            background:
              'linear-gradient(160deg,#fff 0%,rgba(255,255,255,0.5) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          MCP Sentinel
        </h1>
        <p className='mb-8 max-w-2xl text-base leading-relaxed text-[#71717a]'>
          Drop-in observability for agent tool calls. Every MCP interaction is
          logged, guarded, and auditable — without changing your tool
          implementations.
        </p>
        <div className='flex gap-4'>
          <Button
            variant='outline'
            size='lg'
            asChild
            className='border-white/[0.08] bg-white/[0.04] text-white hover:bg-white/[0.08]'
          >
            <a href='#quickstart'>Quickstart</a>
          </Button>
        </div>
      </section>

      {/* What / Who / Why */}
      <section className='border-y border-white/[0.07] bg-white/[0.015] py-16'>
        <div className='mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 md:grid-cols-3'>
          <div>
            <h3 className='mb-2 font-semibold text-white'>What</h3>
            <p className='text-sm leading-relaxed text-[#71717a]'>
              A proxy layer between AI agents and their tools. Logs every call,
              applies guard rails, and surfaces anomalies in a real-time
              dashboard.
            </p>
          </div>
          <div>
            <h3 className='mb-2 font-semibold text-white'>Who</h3>
            <p className='text-sm leading-relaxed text-[#71717a]'>
              Teams deploying LLM agents in production who need visibility into
              tool usage, cost tracking, and security boundaries.
            </p>
          </div>
          <div>
            <h3 className='mb-2 font-semibold text-white'>Why</h3>
            <p className='text-sm leading-relaxed text-[#71717a]'>
              Agents call tools autonomously. Without observability, you cannot
              audit decisions, detect misuse, or enforce compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Quickstart */}
      <section id='quickstart' className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-8 text-2xl font-bold text-white'>Quickstart</h2>
          <CodeBlock
            code={quickstartCode}
            language='typescript'
            filename='mcp-server.ts'
          />
        </div>
      </section>

      {/* Live Demo */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-2 text-2xl font-bold text-white'>Live Demo</h2>
          <p className='mb-8 text-[#71717a]'>
            Run a sample workflow to see how Sentinel logs and guards tool
            calls.
          </p>
          <Button
            onClick={runDemo}
            disabled={loading}
            size='lg'
            className='bg-[#22c55e] text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-[#16a34a]'
          >
            <IconPlayerPlay className='mr-2 h-4 w-4' />
            {loading ? 'Running...' : 'Run Sample Workflow'}
          </Button>

          {events.length > 0 && (
            <div className='mt-8 space-y-3'>
              {events.map((event) => (
                <div
                  key={event.id}
                  className='animate-in fade-in slide-in-from-left-2 flex items-center gap-4 rounded-lg border border-white/[0.07] bg-white/[0.04] p-4 font-mono'
                >
                  <span className='font-mono text-xs text-[#52525b]'>
                    {event.timestamp}
                  </span>
                  <Badge
                    variant={
                      event.status === 'allowed'
                        ? 'default'
                        : event.status === 'warning'
                          ? 'secondary'
                          : 'destructive'
                    }
                    className={
                      event.status === 'allowed'
                        ? 'w-20 justify-center border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.08)] text-[#22c55e]'
                        : event.status === 'blocked'
                          ? 'w-20 justify-center border-red-500/30 bg-red-500/[0.08] text-red-400'
                          : 'w-20 justify-center'
                    }
                  >
                    {event.status === 'allowed' && (
                      <IconCheck className='mr-1 h-3 w-3' />
                    )}
                    {event.status === 'warning' && (
                      <IconAlertTriangle className='mr-1 h-3 w-3' />
                    )}
                    {event.status === 'blocked' && (
                      <IconShield className='mr-1 h-3 w-3' />
                    )}
                    {event.status}
                  </Badge>
                  <span className='font-mono text-sm text-white'>
                    {event.tool}
                  </span>
                  <span className='ml-auto flex items-center text-xs text-[#52525b]'>
                    <IconClock className='mr-1 h-3 w-3' />
                    {event.latency}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Architecture */}
      <section className='border-y border-white/[0.07] bg-white/[0.015] py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-8 text-2xl font-bold text-white'>Architecture</h2>
          <div className='overflow-x-auto rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
            <McpArchSvg />
          </div>
        </div>
      </section>

      {/* Guard Flow */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-8 text-2xl font-bold text-white'>Guard Flow</h2>
          <div className='overflow-x-auto rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
            <GuardFlowSvg />
          </div>
        </div>
      </section>

      {/* Demo limits */}
      <section className='py-16'>
        <div className='mx-auto max-w-4xl px-4'>
          <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
            <p className='font-mono text-xs text-[#52525b]'>
              Demo is rate-limited to 100 events/minute with mock data.{' '}
              <a
                href='mailto:contact@davidpapp.dev'
                className='text-[#22c55e] hover:underline'
              >
                Contact me
              </a>{' '}
              for a full walkthrough or to discuss deployment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
