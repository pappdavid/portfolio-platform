'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/shared/code-block';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';
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

const claudeDesktopConfig = `{
  "mcpServers": {
    "my-tools": {
      "command": "node",
      "args": ["./mcp-server.js"],
      "env": {
        "MCP_SENTINEL_KEY": "sk_live_..."
      }
    }
  }
}`;

const chatgptConfig = `# ChatGPT Plugin manifest
# Point your action server through Sentinel proxy

openapi: 3.0.0
info:
  title: My Tools (via Sentinel)
  version: 1.0.0
servers:
  - url: https://sentinel.yourdomain.com/proxy`;

const genericConfig = `# Any MCP-compatible agent
# Set the proxy URL as your MCP endpoint

MCP_ENDPOINT=https://sentinel.yourdomain.com/v1
MCP_API_KEY=sk_live_...

# Sentinel sits between agent and tools,
# logging every call and applying guards.`;

const architectureChart = `graph LR
  A[Agent] --> B[MCP Sentinel]
  B --> C{Guards}
  C -->|Pass| D[Tools]
  C -->|Block| E[Alert]
  D --> F[Response]
  F --> G[Event Log]
  G --> H[Dashboard]`;

const guardFlowChart = `graph TD
  A[Incoming Request] --> B[Rate Limiter]
  B --> C[Input Validator]
  C --> D{Injection Check}
  D -->|Clean| E[PII Scanner]
  D -->|Threat| F[Block + Alert]
  E --> G{PII Found?}
  G -->|No| H[Forward to Tool]
  G -->|Yes| I[Redact + Forward]
  H --> J[Log Event]
  I --> J`;

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

      {/* Integration Guide */}
      <section className='border-y border-white/[0.07] bg-white/[0.015] py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-8 text-2xl font-bold text-white'>How It Works</h2>
          <Tabs defaultValue='claude'>
            <TabsList>
              <TabsTrigger value='claude'>Claude Desktop</TabsTrigger>
              <TabsTrigger value='chatgpt'>ChatGPT</TabsTrigger>
              <TabsTrigger value='generic'>Generic Agent</TabsTrigger>
            </TabsList>
            <TabsContent value='claude' className='mt-4'>
              <CodeBlock
                code={claudeDesktopConfig}
                language='json'
                filename='claude_desktop_config.json'
              />
            </TabsContent>
            <TabsContent value='chatgpt' className='mt-4'>
              <CodeBlock
                code={chatgptConfig}
                language='yaml'
                filename='openapi.yaml'
              />
            </TabsContent>
            <TabsContent value='generic' className='mt-4'>
              <CodeBlock code={genericConfig} language='bash' filename='.env' />
            </TabsContent>
          </Tabs>
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
          <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
            <MermaidDiagram chart={architectureChart} />
          </div>
        </div>
      </section>

      {/* Guard Flow */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-8 text-2xl font-bold text-white'>Guard Flow</h2>
          <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
            <MermaidDiagram chart={guardFlowChart} />
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
