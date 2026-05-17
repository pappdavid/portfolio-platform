'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const quickstartLines: Array<Array<{ cls?: string; text: string }>> = [
  [{ cls: 'tc', text: '// github.com/pappdavid/mcp-sentinel' }],
  [
    { cls: 'tk', text: 'import' },
    { text: ' { ' },
    { cls: 'tv', text: 'MCPSentinel' },
    { text: ' } ' },
    { cls: 'tk', text: 'from' },
    { text: ' ' },
    { cls: 'ts', text: "'./sentinel'" },
    { text: ';' }
  ],
  [{ text: '' }],
  [
    { cls: 'tk', text: 'const' },
    { text: ' ' },
    { cls: 'tv', text: 'sentinel' },
    { text: ' = ' },
    { cls: 'tk', text: 'new' },
    { text: ' ' },
    { cls: 'tf', text: 'MCPSentinel' },
    { text: '({ apiKey, guards: [' },
    { cls: 'ts', text: "'injection'" },
    { text: ', ' },
    { cls: 'ts', text: "'pii'" },
    { text: ', ' },
    { cls: 'ts', text: "'cost'" },
    { text: '] });' }
  ],
  [
    { cls: 'tk', text: 'const' },
    { text: ' ' },
    { cls: 'tv', text: 'server' },
    { text: ' = sentinel.' },
    { cls: 'tf', text: 'wrap' },
    { text: '(yourMCPServer);' }
  ],
  [{ text: 'server.' }, { cls: 'tf', text: 'listen' }, { text: '(3001);' }]
];

type MockEvent = {
  id: string;
  tool: string;
  status: 'allowed' | 'blocked' | 'warning';
  latency: string;
  timestamp: string;
};

// Hero icon — shield with check, from the reference module
function ShieldIcon() {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    >
      <path d='M12 2 L20 5 V12 C20 17 16 21 12 22 C8 21 4 17 4 12 V5 Z' />
      <path
        d='M9 12 L11 14 L15 10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function ArchitectureSvg() {
  return (
    <svg
      viewBox='0 0 980 320'
      width='100%'
      height='320'
      role='img'
      aria-label='MCP Sentinel architecture: agent calls flow through sentinel guards to tools; blocked calls and event log fan out to dashboard and supabase'
    >
      <defs>
        <linearGradient id='mcp-flow' x1='0' x2='1'>
          <stop offset='0%' stopColor='#22c55e' />
          <stop offset='100%' stopColor='#22c55e' stopOpacity='0.4' />
        </linearGradient>
      </defs>

      {/* Agent */}
      <rect
        x='40'
        y='130'
        width='120'
        height='60'
        rx='10'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.12)'
      />
      <text
        x='100'
        y='166'
        textAnchor='middle'
        fill='#a8a39a'
        fontFamily='JetBrains Mono'
        fontSize='12'
      >
        AGENT
      </text>

      <path
        d='M160 160 L240 160'
        stroke='#22c55e'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='240,156 248,160 240,164' fill='#22c55e' />

      {/* Sentinel */}
      <rect
        x='250'
        y='80'
        width='220'
        height='160'
        rx='14'
        fill='rgba(34,197,94,0.05)'
        stroke='rgba(34,197,94,0.3)'
      />
      <text
        x='360'
        y='106'
        textAnchor='middle'
        fill='#22c55e'
        fontFamily='JetBrains Mono'
        fontSize='12'
      >
        MCP SENTINEL
      </text>

      {/* Guards */}
      <rect
        x='270'
        y='120'
        width='180'
        height='26'
        rx='6'
        fill='rgba(255,255,255,0.03)'
        stroke='rgba(255,255,255,0.08)'
      />
      <text
        x='360'
        y='138'
        textAnchor='middle'
        fill='#a8a39a'
        fontFamily='JetBrains Mono'
        fontSize='10.5'
      >
        rate_limit · sliding window 100/m
      </text>
      <rect
        x='270'
        y='152'
        width='180'
        height='26'
        rx='6'
        fill='rgba(255,255,255,0.03)'
        stroke='rgba(255,255,255,0.08)'
      />
      <text
        x='360'
        y='170'
        textAnchor='middle'
        fill='#a8a39a'
        fontFamily='JetBrains Mono'
        fontSize='10.5'
      >
        injection_detector · regex + heur
      </text>
      <rect
        x='270'
        y='184'
        width='180'
        height='26'
        rx='6'
        fill='rgba(255,255,255,0.03)'
        stroke='rgba(255,255,255,0.08)'
      />
      <text
        x='360'
        y='202'
        textAnchor='middle'
        fill='#a8a39a'
        fontFamily='JetBrains Mono'
        fontSize='10.5'
      >
        pii_scanner · presidio
      </text>

      <path
        d='M470 160 L560 160'
        stroke='#22c55e'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='560,156 568,160 560,164' fill='#22c55e' />

      {/* Tools */}
      <rect
        x='570'
        y='130'
        width='120'
        height='60'
        rx='10'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.12)'
      />
      <text
        x='630'
        y='166'
        textAnchor='middle'
        fill='#a8a39a'
        fontFamily='JetBrains Mono'
        fontSize='12'
      >
        TOOLS
      </text>

      {/* Blocked path */}
      <path
        d='M360 240 L360 280'
        stroke='#ef4444'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <rect
        x='290'
        y='280'
        width='140'
        height='32'
        rx='8'
        fill='rgba(239,68,68,0.08)'
        stroke='rgba(239,68,68,0.3)'
      />
      <text
        x='360'
        y='300'
        textAnchor='middle'
        fill='#ef4444'
        fontFamily='JetBrains Mono'
        fontSize='11'
      >
        BLOCKED · alert
      </text>

      {/* Event log → Dashboard */}
      <path
        d='M470 160 Q540 60 720 60 L760 60'
        stroke='rgba(34,197,94,0.4)'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <rect
        x='760'
        y='40'
        width='180'
        height='40'
        rx='10'
        fill='rgba(6,182,212,0.06)'
        stroke='rgba(6,182,212,0.25)'
      />
      <text
        x='850'
        y='65'
        textAnchor='middle'
        fill='#06b6d4'
        fontFamily='JetBrains Mono'
        fontSize='12'
      >
        EVENT LOG → DASHBOARD
      </text>

      {/* Supabase audit */}
      <rect
        x='760'
        y='240'
        width='180'
        height='40'
        rx='10'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.12)'
      />
      <text
        x='850'
        y='265'
        textAnchor='middle'
        fill='#a8a39a'
        fontFamily='JetBrains Mono'
        fontSize='11.5'
      >
        SUPABASE · RLS
      </text>
      <path
        d='M850 80 L850 240'
        stroke='rgba(255,255,255,0.18)'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
    </svg>
  );
}

// Static seed events shown before the user clicks "Run sample" — matches the
// reference visual. Once the SSE stream fires, the live events replace these.
const SEED_EVENTS: MockEvent[] = [
  {
    id: 'evt_a4f1',
    tool: 'file_read',
    status: 'allowed',
    latency: '4ms',
    timestamp: '14:22:08'
  },
  {
    id: 'evt_b2c9',
    tool: 'web_search',
    status: 'allowed',
    latency: '11ms',
    timestamp: '14:22:06'
  },
  {
    id: 'evt_d8e3',
    tool: 'code_execute',
    status: 'allowed',
    latency: '7ms',
    timestamp: '14:22:04'
  },
  {
    id: 'evt_f1a6',
    tool: 'db_query',
    status: 'warning',
    latency: '9ms',
    timestamp: '14:22:02'
  },
  {
    id: 'evt_91be',
    tool: 'send_email',
    status: 'blocked',
    latency: '3ms',
    timestamp: '14:22:00'
  }
];

const DEMO_EVENTS: MockEvent[] = [
  {
    id: 'evt_a4f1',
    tool: 'file_read',
    status: 'allowed',
    latency: '4ms',
    timestamp: '14:22:08'
  },
  {
    id: 'evt_c7e2',
    tool: 'web_search',
    status: 'allowed',
    latency: '11ms',
    timestamp: '14:22:09'
  },
  {
    id: 'evt_5b90',
    tool: 'code_execute',
    status: 'allowed',
    latency: '7ms',
    timestamp: '14:22:10'
  },
  {
    id: 'evt_1f3c',
    tool: 'db_query',
    status: 'warning',
    latency: '9ms',
    timestamp: '14:22:11'
  },
  {
    id: 'evt_9d12',
    tool: 'send_email',
    status: 'blocked',
    latency: '3ms',
    timestamp: '14:22:12'
  }
];

const STREAM_STEP_MS = 450;
const STREAM_RESET_DELAY_MS = 900;

const TRADEOFFS = [
  {
    kind: 'CHOSE' as const,
    title: 'Wrapper, not a sidecar',
    body: '3 lines to install vs deploying a separate process. p99 stays low because everything is in-process.'
  },
  {
    kind: 'CHOSE' as const,
    title: 'Boundary guards, not LLM-based',
    body: "Pattern + Presidio. No LLM call to decide whether to allow the next LLM call — that's a cost loop."
  },
  {
    kind: 'SKIPPED' as const,
    title: 'Fancy ML detection',
    body: '90% of injection attempts are caught by 12 patterns. Ship that first; revisit when the data demands it.'
  }
];

export function McpContent() {
  const [events, setEvents] = useState<MockEvent[]>(SEED_EVENTS);
  const [loading, setLoading] = useState(false);
  const [demoActive, setDemoActive] = useState(false);

  useEffect(() => {
    if (!demoActive) return;

    setLoading(true);
    setEvents([]);

    const eventTimers = DEMO_EVENTS.map((event, index) =>
      window.setTimeout(() => {
        setEvents((prev) => [event, ...prev].slice(0, 8));
      }, index * STREAM_STEP_MS)
    );

    const resetTimer = window.setTimeout(
      () => {
        setEvents(SEED_EVENTS);
        setLoading(false);
        setDemoActive(false);
      },
      DEMO_EVENTS.length * STREAM_STEP_MS + STREAM_RESET_DELAY_MS
    );

    return () => {
      eventTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(resetTimer);
    };
  }, [demoActive]);

  const runDemo = () => {
    if (loading) return;
    setDemoActive(true);
  };

  return (
    <div style={{ background: 'var(--bg-0)' }}>
      <main className='mod-wrap' style={{ paddingTop: 24, paddingBottom: 0 }}>
        {/* Hero */}
        <section style={{ padding: '80px 0 64px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 24
            }}
          >
            <div className='mod-icon'>
              <ShieldIcon />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className='mod-eyebrow'>
                <span className='mod-dot' />
                <span className='mod-dash' />
                <span>MODULE 01 / SENTINEL</span>
              </span>
              <h1
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-dp-sans), Inter Tight, sans-serif',
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.96,
                  color: 'var(--ink-0)'
                }}
              >
                MCP Sentinel
              </h1>
            </div>
          </div>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--ink-2)',
              maxWidth: 720,
              margin: 0
            }}
          >
            Drop-in observability and guardrails for agent tool calls. Wrap your
            MCP server, get an audit-ready event stream and four guards
            (injection, PII, cost, rate limit) in front of every call. Reference
            implementation, ~700 LOC.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 28,
              flexWrap: 'wrap'
            }}
          >
            <span className='mod-status'>
              <span className='mod-status-dot' />
              p99 &lt; 12ms overhead
            </span>
            <span className='mod-status'>
              <span className='mod-status-dot' />0 incidents post-rollout
            </span>
            <span className='mod-status'>
              <span className='mod-status-dot' />
              github.com/pappdavid/mcp-sentinel
            </span>
          </div>
        </section>

        {/* // 01 Architecture */}
        <section style={{ paddingBottom: 80 }}>
          <div className='mod-section-meta'>
            <span className='mod-section-num'>{'// 01'}</span>
            <span className='mod-section-line' />
            <span className='mod-section-label'>Architecture</span>
          </div>
          <div
            className='mod-card'
            style={{
              padding: 24,
              background: 'var(--bg-1)',
              overflow: 'hidden'
            }}
          >
            <ArchitectureSvg />
          </div>
        </section>

        {/* // 02 Live event stream */}
        <section style={{ paddingBottom: 80 }}>
          <div className='mod-section-meta'>
            <span className='mod-section-num'>{'// 02'}</span>
            <span className='mod-section-line' />
            <span className='mod-section-label'>Live event stream</span>
          </div>

          <div className='mod-card' style={{ overflow: 'hidden' }}>
            <div
              className='mod-ev'
              style={{
                color: 'var(--ink-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: 10
              }}
            >
              <span>id</span>
              <span>tool</span>
              <span>status</span>
              <span>p50</span>
              <span>time</span>
            </div>
            {events.map((event) => (
              <div key={event.id} className='mod-ev'>
                <span className='mod-ev-id'>{event.id}</span>
                <span style={{ color: 'var(--ink-1)' }}>{event.tool}</span>
                <span className={`mod-stat-${event.status}`}>
                  {event.status === 'allowed' && '● allowed'}
                  {event.status === 'warning' && '▲ warning'}
                  {event.status === 'blocked' && '✕ blocked'}
                </span>
                <span style={{ color: 'var(--ink-2)' }}>{event.latency}</span>
                <span className='mod-ev-time'>{event.timestamp}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 20,
              flexWrap: 'wrap'
            }}
          >
            <button
              type='button'
              onClick={runDemo}
              disabled={loading}
              className='dp-btn dp-btn-primary'
              style={{
                padding: '10px 20px',
                fontSize: 13,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'wait' : 'pointer'
              }}
            >
              {loading ? 'Streaming…' : 'Run sample workflow'}
            </button>
            <span
              style={{
                fontFamily: 'var(--font-dp-mono), monospace',
                fontSize: 11.5,
                color: 'var(--ink-3)'
              }}
            >
              Mock telemetry, rate-limited to 100 events/min.
            </span>
          </div>
        </section>

        {/* // 03 Quickstart in 3 lines */}
        <section id='quickstart' style={{ paddingBottom: 80 }}>
          <div className='mod-section-meta'>
            <span className='mod-section-num'>{'// 03'}</span>
            <span className='mod-section-line' />
            <span className='mod-section-label'>Quickstart in 3 lines</span>
          </div>
          <pre className='mod-terminal'>
            {quickstartLines.map((line, i) => (
              <div key={i}>
                {line.map((tok, j) =>
                  tok.cls ? (
                    <span key={j} className={tok.cls}>
                      {tok.text}
                    </span>
                  ) : (
                    <span key={j}>{tok.text}</span>
                  )
                )}
                {line.length === 0 || (line.length === 1 && line[0].text === '')
                  ? ' '
                  : null}
              </div>
            ))}
          </pre>
        </section>

        {/* // 04 Trade-offs */}
        <section style={{ paddingBottom: 80 }}>
          <div className='mod-section-meta'>
            <span className='mod-section-num'>{'// 04'}</span>
            <span className='mod-section-line' />
            <span className='mod-section-label'>Trade-offs</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16
            }}
          >
            {TRADEOFFS.map((t) => (
              <div
                key={t.title}
                className={`mod-tradeoff ${t.kind === 'CHOSE' ? 'is-chose' : 'is-skipped'}`}
              >
                <div className='mod-tradeoff-tag'>{t.kind}</div>
                <div className='mod-tradeoff-title'>{t.title}</div>
                <p className='mod-tradeoff-body'>{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer: prev/next module */}
        <nav className='mod-foot'>
          <Link href='/training' className='is-next'>
            → Next module: Custom Training
          </Link>
          <Link href='/' className='is-back'>
            ← Back to homepage
          </Link>
        </nav>
      </main>
    </div>
  );
}
