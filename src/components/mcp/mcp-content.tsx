'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { CodeBlock } from '@/components/shared/code-block';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';
import {
  IconShield,
  IconPlayerPlay,
  IconCheck,
  IconClock,
  IconAlertTriangle,
  IconArrowRight
} from '@tabler/icons-react';

const quickstartCode = `import { MCPSentinel } from '@your-org/mcp-sentinel';

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

const faqItems = [
  {
    q: 'What protocols does Sentinel support?',
    a: 'Sentinel supports the Model Context Protocol (MCP) standard. It works with any MCP-compatible client including Claude Desktop, ChatGPT plugins, and custom agent frameworks.'
  },
  {
    q: 'Does it add latency?',
    a: 'Guard checks add ~5-15ms per request. Event logging is asynchronous and adds zero latency to the response path.'
  },
  {
    q: 'Can I self-host?',
    a: 'Yes. Sentinel is designed to run in your infrastructure. Deploy as a Docker container or serverless function alongside your MCP server.'
  },
  {
    q: 'What guards are available?',
    a: 'Built-in guards include injection detection, PII scanning, cost tracking, rate limiting, and output validation. Custom guards can be added via the plugin API.'
  },
  {
    q: 'How is data stored?',
    a: 'Event logs are stored in your Supabase instance with row-level security. No data leaves your infrastructure unless you explicitly configure external alerting.'
  }
];

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
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <Badge variant='secondary' className='mb-4'>
            Agent Observability
          </Badge>
          <h1 className='text-foreground text-4xl font-bold tracking-tight sm:text-5xl'>
            MCP Sentinel
          </h1>
          <p className='text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed'>
            Drop-in observability for agent tool calls. Every MCP interaction is
            logged, guarded, and auditable — without changing your tool
            implementations.
          </p>
          <div className='mt-8 flex gap-4'>
            <Button asChild size='lg'>
              <Link href='/dashboard/mcp'>
                Open Dashboard
                <IconArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button variant='outline' size='lg' asChild>
              <a href='#quickstart'>Quickstart</a>
            </Button>
          </div>
        </div>
      </section>

      {/* What / Who / Why */}
      <section className='bg-muted/30 py-16'>
        <div className='mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 md:grid-cols-3'>
          <div>
            <h3 className='text-foreground mb-2 font-semibold'>What</h3>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              A proxy layer between AI agents and their tools. Logs every call,
              applies guard rails, and surfaces anomalies in a real-time
              dashboard.
            </p>
          </div>
          <div>
            <h3 className='text-foreground mb-2 font-semibold'>Who</h3>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Teams deploying LLM agents in production who need visibility into
              tool usage, cost tracking, and security boundaries.
            </p>
          </div>
          <div>
            <h3 className='text-foreground mb-2 font-semibold'>Why</h3>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Agents call tools autonomously. Without observability, you cannot
              audit decisions, detect misuse, or enforce compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Quickstart */}
      <section id='quickstart' className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-8 text-2xl font-bold'>
            Quickstart
          </h2>
          <CodeBlock
            code={quickstartCode}
            language='typescript'
            filename='mcp-server.ts'
          />
        </div>
      </section>

      {/* Integration Guide */}
      <section className='bg-muted/30 py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-8 text-2xl font-bold'>
            Integration Guide
          </h2>
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
          <h2 className='text-foreground mb-2 text-2xl font-bold'>Live Demo</h2>
          <p className='text-muted-foreground mb-8'>
            Run a sample workflow to see how Sentinel logs and guards tool
            calls.
          </p>
          <Button onClick={runDemo} disabled={loading} size='lg'>
            <IconPlayerPlay className='mr-2 h-4 w-4' />
            {loading ? 'Running...' : 'Run Sample Workflow'}
          </Button>

          {events.length > 0 && (
            <div className='mt-8 space-y-3'>
              {events.map((event) => (
                <div
                  key={event.id}
                  className='animate-in fade-in slide-in-from-left-2 flex items-center gap-4 rounded-lg border p-4'
                >
                  <span className='text-muted-foreground font-mono text-xs'>
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
                    className='w-20 justify-center'
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
                  <span className='text-foreground font-mono text-sm'>
                    {event.tool}
                  </span>
                  <span className='text-muted-foreground ml-auto flex items-center text-xs'>
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
      <section className='bg-muted/30 py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-8 text-2xl font-bold'>
            Architecture
          </h2>
          <div className='bg-background rounded-xl border p-6'>
            <MermaidDiagram chart={architectureChart} />
          </div>
        </div>
      </section>

      {/* Guard Flow */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-8 text-2xl font-bold'>
            Guard Flow
          </h2>
          <div className='bg-background rounded-xl border p-6'>
            <MermaidDiagram chart={guardFlowChart} />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className='bg-muted/30 py-16'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-4 text-2xl font-bold'>
            Pricing &amp; Limits
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='bg-background rounded-xl border p-6'>
              <h3 className='text-foreground mb-2 font-semibold'>Free Tier</h3>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li>100 events/minute rate limit</li>
                <li>7-day event retention</li>
                <li>3 guard rules</li>
                <li>1 API key</li>
              </ul>
            </div>
            <div className='bg-background rounded-xl border p-6'>
              <h3 className='text-foreground mb-2 font-semibold'>Pro</h3>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li>Unlimited events</li>
                <li>90-day retention</li>
                <li>Unlimited guard rules</li>
                <li>Team API keys + webhooks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-8 text-2xl font-bold'>FAQ</h2>
          <Accordion type='single' collapsible className='w-full'>
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
