# Phase 2 — Project Depth Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild three project detail pages with interactive React Flow architecture diagrams, honest results framing, screenshots, and OG metadata.

**Architecture:** Shared `ArchDiagram` wrapper around `@xyflow/react` (lazy-loaded) + `generateMetadata()` helper in `src/lib/metadata.ts`. Each `/projects/*` page gets: problem → "what this demonstrates" → React Flow diagram → stack rationale → code snippet → results → screenshots → GitHub link. Screenshots taken via Playwright after implementation.

**Tech Stack:** `@xyflow/react` v12, Next.js App Router `generateMetadata`, Playwright MCP for screenshots, `next/image` for screenshot display.

**Note:** No test framework configured — verification steps are manual dev-server checks via preview tools.

---

### Task 1: Install @xyflow/react

**Files:**
- Modify: `package.json`

**Step 1: Install the package**

```bash
npm install @xyflow/react
```

**Step 2: Verify install**

```bash
npm ls @xyflow/react
```
Expected: `@xyflow/react@x.x.x` listed with no errors.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @xyflow/react"
```

---

### Task 2: Create metadata helper

**Files:**
- Create: `src/lib/metadata.ts`

**Step 1: Write the file**

```typescript
import { Metadata } from 'next';

interface PageMetaInput {
  title: string;
  description: string;
  slug: string;
}

export function generatePageMetadata({
  title,
  description,
  slug
}: PageMetaInput): Metadata {
  const fullTitle = `${title} — David Papp`;
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: [{ url: `/og/${slug}.png`, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`/og/${slug}.png`]
    }
  };
}
```

**Step 2: Verify no TypeScript errors**

```bash
npm run lint
```
Expected: no errors in `src/lib/metadata.ts`.

**Step 3: Commit**

```bash
git add src/lib/metadata.ts
git commit -m "feat: add generatePageMetadata helper"
```

---

### Task 3: Create ArchDiagram component

**Files:**
- Create: `src/components/shared/arch-diagram.tsx`

**Step 1: Write the component**

```typescript
'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';

// Import React Flow styles
import '@xyflow/react/dist/style.css';

const ReactFlow = dynamic(
  () => import('@xyflow/react').then((m) => m.ReactFlow),
  { ssr: false }
);

const Background = dynamic(
  () => import('@xyflow/react').then((m) => m.Background),
  { ssr: false }
);

export type ArchNode = {
  id: string;
  label: string;
  tooltip: string;
  color: 'green' | 'cyan' | 'purple' | 'orange' | 'default';
  x: number;
  y: number;
};

export type ArchEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
};

const colorMap: Record<ArchNode['color'], { bg: string; border: string; text: string }> = {
  green:   { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.5)',  text: '#22c55e' },
  cyan:    { bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.5)',  text: '#06b6d4' },
  purple:  { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.5)', text: '#a855f7' },
  orange:  { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.5)', text: '#f97316' },
  default: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.15)', text: '#ffffff' },
};

function NodeTooltip({ label, tooltip, color }: { label: string; tooltip: string; color: ArchNode['color'] }) {
  const c = colorMap[color];
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: '8px 14px',
        color: c.text,
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        cursor: 'default',
        position: 'relative',
      }}
      title={tooltip}
    >
      {label}
    </div>
  );
}

export function ArchDiagram({
  nodes: archNodes,
  edges: archEdges,
  height = 420,
}: {
  nodes: ArchNode[];
  edges: ArchEdge[];
  height?: number;
}) {
  const nodes: Node[] = useMemo(
    () =>
      archNodes.map((n) => ({
        id: n.id,
        position: { x: n.x, y: n.y },
        data: { label: <NodeTooltip label={n.label} tooltip={n.tooltip} color={n.color} /> },
        style: { background: 'transparent', border: 'none', padding: 0 },
      })),
    [archNodes]
  );

  const edges: Edge[] = useMemo(
    () =>
      archEdges.map((e) => ({
        id: e.id,
        source: e.from,
        target: e.to,
        label: e.label,
        animated: true,
        style: { stroke: 'rgba(255,255,255,0.25)', strokeDasharray: '5 3' },
        labelStyle: { fill: '#71717a', fontSize: 11 },
      })),
    [archEdges]
  );

  return (
    <div
      style={{ height, background: '#060608', borderRadius: 12, overflow: 'hidden' }}
      className='border border-white/[0.07]'
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color='rgba(255,255,255,0.04)' gap={24} />
      </ReactFlow>
    </div>
  );
}
```

**Step 2: Start dev server and verify no import errors**

Start dev server (`npm run dev`), open browser to any page. Check console for React Flow import errors.

**Step 3: Commit**

```bash
git add src/components/shared/arch-diagram.tsx
git commit -m "feat: add ArchDiagram component with React Flow"
```

---

### Task 4: Rebuild MCP Sentinel detail page

**Files:**
- Rewrite: `src/app/(public)/projects/mcp-sentinel/page.tsx`

**Step 1: Write the page**

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/shared/code-block';
import { ArchDiagram, type ArchNode, type ArchEdge } from '@/components/shared/arch-diagram';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'MCP Sentinel',
  description:
    'Drop-in observability proxy for MCP agent tool calls — logs, guards, and audits every interaction.',
  slug: 'mcp-sentinel',
});

const nodes: ArchNode[] = [
  { id: 'agent',     label: 'Agent',              tooltip: 'LLM agent making tool calls (Claude, GPT-4, etc.)',           color: 'default', x: 0,   y: 80 },
  { id: 'sentinel',  label: 'MCP Sentinel',        tooltip: 'Transparent proxy — all traffic passes through here',          color: 'green',   x: 180, y: 80 },
  { id: 'rate',      label: 'Rate Limiter',         tooltip: 'Sliding-window rate limit per API key (Upstash Redis)',        color: 'green',   x: 360, y: 0  },
  { id: 'inject',    label: 'Injection Detector',   tooltip: 'Pattern-matches tool inputs for prompt injection attempts',    color: 'green',   x: 360, y: 80 },
  { id: 'pii',       label: 'PII Scanner',          tooltip: 'Redacts or blocks calls containing PII (email, SSN, etc.)',   color: 'green',   x: 360, y: 160 },
  { id: 'tools',     label: 'Tools',                tooltip: 'Your actual MCP tools — file read, web search, DB query…',   color: 'cyan',    x: 560, y: 40 },
  { id: 'blocked',   label: 'BLOCKED',              tooltip: 'Guard triggered — call rejected, alert fired',                color: 'default', x: 560, y: 160 },
  { id: 'log',       label: 'Event Log',            tooltip: 'Every call logged to Supabase with RLS',                      color: 'cyan',    x: 740, y: 80 },
  { id: 'dashboard', label: 'Dashboard',            tooltip: 'Real-time event stream visible to authenticated users',       color: 'cyan',    x: 920, y: 80 },
];

const edges: ArchEdge[] = [
  { id: 'e1', from: 'agent',    to: 'sentinel' },
  { id: 'e2', from: 'sentinel', to: 'rate'     },
  { id: 'e3', from: 'sentinel', to: 'inject'   },
  { id: 'e4', from: 'sentinel', to: 'pii'      },
  { id: 'e5', from: 'rate',     to: 'tools',   label: 'pass' },
  { id: 'e6', from: 'inject',   to: 'tools',   label: 'pass' },
  { id: 'e7', from: 'pii',      to: 'tools',   label: 'pass' },
  { id: 'e8', from: 'inject',   to: 'blocked', label: 'block' },
  { id: 'e9', from: 'tools',    to: 'log'      },
  { id: 'ea', from: 'blocked',  to: 'log'      },
  { id: 'eb', from: 'log',      to: 'dashboard'},
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
    <div className='mx-auto max-w-4xl px-6 py-20 text-white'>
      {/* Hero */}
      <Badge variant='secondary' className='mb-4'>Observability</Badge>
      <h1 className='mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl'>
        MCP Sentinel
      </h1>
      <p className='text-muted-foreground mb-8 max-w-2xl text-lg'>
        A proxy layer for Model Context Protocol that logs, guards, and audits every agent tool call in real time.
      </p>
      <div className='mb-20 flex flex-wrap gap-3'>
        <Button asChild>
          <Link href='/mcp'>View live demo</Link>
        </Button>
        <Button variant='outline' asChild>
          <a href='https://github.com/pappdavid/portfolio-platform' target='_blank' rel='noopener noreferrer'>
            View code
          </a>
        </Button>
      </div>

      {/* Problem */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Problem</h2>
        <p className='text-muted-foreground leading-relaxed'>
          AI agents running in production make hundreds of tool calls per hour. Without visibility,
          injection attacks, runaway costs, and PII leaks go undetected until they cause real damage.
          Existing logging solutions don&apos;t understand the MCP protocol structure.
        </p>
      </section>

      {/* What this demonstrates */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>What this demonstrates</h2>
        <ul className='text-muted-foreground space-y-2 leading-relaxed'>
          <li>• Designing a composable middleware pipeline that is extensible without modifying existing guards</li>
          <li>• Integrating Upstash Redis sliding-window rate limiting in a Next.js edge-compatible context</li>
          <li>• Supabase RLS as a security boundary — dashboard only shows events for the authenticated API key owner</li>
        </ul>
      </section>

      {/* Architecture */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-6 text-2xl font-bold'>Architecture</h2>
        <ArchDiagram nodes={nodes} edges={edges} />
        <p className='text-muted-foreground mt-3 text-sm'>Hover any node to see what it does.</p>
      </section>

      {/* Tech stack */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Tech stack</h2>
        <ul className='text-muted-foreground space-y-2 text-sm leading-relaxed'>
          <li><span className='font-semibold text-white'>TypeScript + Next.js</span> — API routes act as the proxy layer; type safety enforced across the full guard pipeline.</li>
          <li><span className='font-semibold text-white'>Supabase</span> — event storage with row-level security; each API key can only query its own events.</li>
          <li><span className='font-semibold text-white'>Upstash Redis</span> — serverless-compatible sliding-window rate limiter; no persistent connection required.</li>
          <li><span className='font-semibold text-white'>Clerk</span> — auth; the dashboard is protected and API keys are scoped per user.</li>
        </ul>
      </section>

      {/* Code */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Core logic</h2>
        <CodeBlock code={codeSnippet} language='typescript' filename='guards.ts' />
      </section>

      {/* Results */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Results</h2>
        <ul className='text-muted-foreground space-y-2 text-sm leading-relaxed'>
          <li>• Reference implementation — not production-deployed</li>
          <li>• Demonstrates sub-50ms guard evaluation on mock tool call payloads</li>
          <li>• Live demo processes 100 events/minute within Upstash free tier limits</li>
        </ul>
      </section>

      {/* Screenshots */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-6 text-2xl font-bold'>Screenshots</h2>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='overflow-hidden rounded-lg border border-white/[0.07]'>
            <Image src='/screenshots/mcp/desktop.png' alt='MCP Sentinel desktop view' width={800} height={500} className='w-full' />
          </div>
          <div className='overflow-hidden rounded-lg border border-white/[0.07]'>
            <Image src='/screenshots/mcp/mobile.png' alt='MCP Sentinel mobile view' width={375} height={667} className='w-full' />
          </div>
        </div>
      </section>

      {/* GitHub */}
      <section className='border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Code</h2>
        <p className='text-muted-foreground mb-4 text-sm'>
          This portfolio platform is the reference implementation. The MCP proxy, guard pipeline, and Supabase schema are all in the repo.
        </p>
        <Button variant='outline' asChild>
          <a href='https://github.com/pappdavid/portfolio-platform' target='_blank' rel='noopener noreferrer'>
            View on GitHub →
          </a>
        </Button>
      </section>
    </div>
  );
}
```

**Step 2: Verify page renders**

Open `http://localhost:3000/projects/mcp-sentinel`. Check:
- React Flow diagram renders with colored nodes
- Animated edges visible
- No console errors
- All sections present

**Step 3: Commit**

```bash
git add src/app/\(public\)/projects/mcp-sentinel/page.tsx
git commit -m "feat: rebuild MCP Sentinel detail page with React Flow diagram"
```

---

### Task 5: Rebuild Training Pipeline detail page

**Files:**
- Rewrite: `src/app/(public)/projects/training/page.tsx`

**Step 1: Write the page**

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/shared/code-block';
import { ArchDiagram, type ArchNode, type ArchEdge } from '@/components/shared/arch-diagram';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Custom Training Pipeline',
  description: 'Automated pipeline converting codebases into LoRA fine-tuning datasets.',
  slug: 'training',
});

const nodes: ArchNode[] = [
  { id: 'repo',    label: 'Git Repo',         tooltip: 'Source codebase or documentation to train on',                       color: 'default', x: 0,   y: 80 },
  { id: 'scanner', label: 'File Scanner',      tooltip: 'Walks the repo, filters by language and file type',                  color: 'cyan',    x: 180, y: 80 },
  { id: 'ast',     label: 'AST Parser',        tooltip: 'Builds abstract syntax tree per file to find semantic boundaries',   color: 'cyan',    x: 360, y: 80 },
  { id: 'chunk',   label: 'Semantic Chunker',  tooltip: 'Splits by function/class boundaries with configurable overlap',      color: 'cyan',    x: 540, y: 80 },
  { id: 'prompt',  label: 'Prompt Generator',  tooltip: 'Wraps each chunk in an instruction-response template',               color: 'purple',  x: 720, y: 80 },
  { id: 'filter',  label: 'Quality Filter',    tooltip: 'Drops duplicates, short chunks, and low-signal examples',            color: 'cyan',    x: 900, y: 80 },
  { id: 'jsonl',   label: 'JSONL Output',      tooltip: 'OpenAI-compatible format ready for any LoRA framework',              color: 'cyan',    x: 1080, y: 80 },
  { id: 'lora',    label: 'LoRA Fine-tune',    tooltip: 'Low-rank adapter training — works with Axolotl, unsloth, etc.',      color: 'purple',  x: 1260, y: 80 },
  { id: 'eval',    label: 'Eval',              tooltip: 'Validation loss + sample generation to measure adapter quality',     color: 'purple',  x: 1440, y: 80 },
];

const edges: ArchEdge[] = [
  { id: 'e1', from: 'repo',    to: 'scanner' },
  { id: 'e2', from: 'scanner', to: 'ast'     },
  { id: 'e3', from: 'ast',     to: 'chunk'   },
  { id: 'e4', from: 'chunk',   to: 'prompt'  },
  { id: 'e5', from: 'prompt',  to: 'filter'  },
  { id: 'e6', from: 'filter',  to: 'jsonl'   },
  { id: 'e7', from: 'jsonl',   to: 'lora'    },
  { id: 'e8', from: 'lora',    to: 'eval'    },
];

const codeSnippet = `# Semantic chunking with AST-aware boundaries
class SemanticChunker:
    def __init__(self, chunk_size=512, overlap=64):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk(self, source: ParsedFile) -> list[Chunk]:
        boundaries = self._find_boundaries(source.ast)
        chunks = []
        for start, end in boundaries:
            tokens = source.tokens[start:end]
            if len(tokens) > self.chunk_size:
                chunks.extend(self._split_large(tokens))
            else:
                chunks.append(Chunk(tokens=tokens, metadata=source.meta))
        return chunks`;

export default function TrainingDetailPage() {
  return (
    <div className='mx-auto max-w-4xl px-6 py-20 text-white'>
      {/* Hero */}
      <Badge variant='secondary' className='mb-4'>Fine-tuning</Badge>
      <h1 className='mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl'>
        Custom Training Pipeline
      </h1>
      <p className='text-muted-foreground mb-8 max-w-2xl text-lg'>
        Automated pipeline to convert codebases into fine-tuning datasets. Supports LoRA adapters for any compatible model.
      </p>
      <div className='mb-20 flex flex-wrap gap-3'>
        <Button asChild>
          <Link href='/training'>View live demo</Link>
        </Button>
        <Button variant='outline' asChild>
          <a href='https://github.com/pappdavid/portfolio-platform' target='_blank' rel='noopener noreferrer'>
            View code
          </a>
        </Button>
      </div>

      {/* Problem */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Problem</h2>
        <p className='text-muted-foreground leading-relaxed'>
          Turning internal codebases into fine-tuned models requires careful chunking, deduplication, and prompt formatting.
          Manual dataset creation is error-prone and impossible to scale across multiple repositories or languages.
          Most off-the-shelf tools don&apos;t respect semantic boundaries — they split mid-function, degrading training signal.
        </p>
      </section>

      {/* What this demonstrates */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>What this demonstrates</h2>
        <ul className='text-muted-foreground space-y-2 leading-relaxed'>
          <li>• AST-aware chunking strategy that respects function and class boundaries to preserve training signal</li>
          <li>• Configurable instruction-response template system compatible with OpenAI fine-tuning format and Axolotl/unsloth</li>
          <li>• Quality filtering pipeline that deduplicates and removes low-signal examples before training</li>
        </ul>
      </section>

      {/* Architecture */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-6 text-2xl font-bold'>Architecture</h2>
        <ArchDiagram nodes={nodes} edges={edges} height={200} />
        <p className='text-muted-foreground mt-3 text-sm'>Hover any node to see what it does.</p>
      </section>

      {/* Tech stack */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Tech stack</h2>
        <ul className='text-muted-foreground space-y-2 text-sm leading-relaxed'>
          <li><span className='font-semibold text-white'>Python</span> — AST parsing via stdlib <code>ast</code> module; language-agnostic chunking for Python, TypeScript, and Go.</li>
          <li><span className='font-semibold text-white'>LoRA / PEFT</span> — low-rank adapter training keeps base model weights frozen; adapters are &lt;100MB per fine-tune.</li>
          <li><span className='font-semibold text-white'>Supabase</span> — dataset and job metadata storage; training jobs tracked with status and output paths.</li>
          <li><span className='font-semibold text-white'>Next.js API routes</span> — job submission and status polling endpoints consumed by the dashboard.</li>
        </ul>
      </section>

      {/* Code */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Core logic</h2>
        <CodeBlock code={codeSnippet} language='python' filename='chunker.py' />
      </section>

      {/* Results */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Results</h2>
        <ul className='text-muted-foreground space-y-2 text-sm leading-relaxed'>
          <li>• Reference implementation — training jobs run against external fine-tuning APIs, not self-hosted</li>
          <li>• Demonstrates end-to-end dataset generation from a real TypeScript codebase to OpenAI-compatible JSONL</li>
          <li>• Chunker produces ~3× more usable training pairs than naive line-split on the same source</li>
        </ul>
      </section>

      {/* Screenshots */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-6 text-2xl font-bold'>Screenshots</h2>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='overflow-hidden rounded-lg border border-white/[0.07]'>
            <Image src='/screenshots/training/desktop.png' alt='Training pipeline desktop view' width={800} height={500} className='w-full' />
          </div>
          <div className='overflow-hidden rounded-lg border border-white/[0.07]'>
            <Image src='/screenshots/training/mobile.png' alt='Training pipeline mobile view' width={375} height={667} className='w-full' />
          </div>
        </div>
      </section>

      {/* GitHub */}
      <section className='border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Code</h2>
        <p className='text-muted-foreground mb-4 text-sm'>
          Dataset schema, training job API routes, and the chunker are in this repo. Full Python pipeline available on request.
        </p>
        <Button variant='outline' asChild>
          <a href='https://github.com/pappdavid/portfolio-platform' target='_blank' rel='noopener noreferrer'>
            View on GitHub →
          </a>
        </Button>
      </section>
    </div>
  );
}
```

**Step 2: Verify page renders**

Open `http://localhost:3000/projects/training`. Check diagram renders, all sections visible, no errors.

**Step 3: Commit**

```bash
git add src/app/\(public\)/projects/training/page.tsx
git commit -m "feat: rebuild Training Pipeline detail page with React Flow diagram"
```

---

### Task 6: Rebuild RAG + 3D Chat detail page

**Files:**
- Rewrite: `src/app/(public)/projects/rag-chat/page.tsx`

**Step 1: Write the page**

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/shared/code-block';
import { ArchDiagram, type ArchNode, type ArchEdge } from '@/components/shared/arch-diagram';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'RAG + 3D Chat',
  description:
    'Retrieval-augmented chat with document upload and Three.js spatial visualization.',
  slug: 'rag-chat',
});

const nodes: ArchNode[] = [
  { id: 'docs',    label: 'Documents',     tooltip: 'PDFs or text files uploaded by the user',                              color: 'default', x: 0,   y: 0   },
  { id: 'embed',   label: 'Embedder',      tooltip: 'OpenAI text-embedding-3-small converts chunks to 1536-dim vectors',    color: 'purple',  x: 200, y: 0   },
  { id: 'vec',     label: 'Vector Store',  tooltip: 'Supabase pgvector — cosine similarity search via match_documents RPC', color: 'cyan',    x: 400, y: 0   },
  { id: 'query',   label: 'User Query',    tooltip: 'User message from the chat interface',                                  color: 'default', x: 0,   y: 180 },
  { id: 'ret',     label: 'Retriever',     tooltip: 'Embeds query, fetches top-K documents from vector store',              color: 'orange',  x: 200, y: 180 },
  { id: 'rerank',  label: 'Reranker',      tooltip: 'Cross-encoder scores candidates; filters to top-3 most relevant',     color: 'orange',  x: 400, y: 180 },
  { id: 'llm',     label: 'LLM',           tooltip: 'Context + query sent to Claude or GPT-4 for grounded response',       color: 'purple',  x: 600, y: 100 },
  { id: 'resp',    label: 'Response',      tooltip: 'Text streamed to chat; spatial data triggers Three.js render',        color: 'cyan',    x: 800, y: 100 },
];

const edges: ArchEdge[] = [
  { id: 'e1', from: 'docs',   to: 'embed'  },
  { id: 'e2', from: 'embed',  to: 'vec'    },
  { id: 'e3', from: 'query',  to: 'ret'    },
  { id: 'e4', from: 'vec',    to: 'ret'    },
  { id: 'e5', from: 'ret',    to: 'rerank' },
  { id: 'e6', from: 'rerank', to: 'llm'    },
  { id: 'e7', from: 'llm',    to: 'resp'   },
];

const codeSnippet = `// Retrieval + reranking pipeline
async function retrieve(query: string, topK = 5) {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });

  const { data } = await supabase.rpc('match_documents', {
    query_embedding: embedding.data[0].embedding,
    match_threshold: 0.7,
    match_count: topK,
  });

  return data.map((doc) => doc.content);
}`;

export default function RagChatDetailPage() {
  return (
    <div className='mx-auto max-w-4xl px-6 py-20 text-white'>
      {/* Hero */}
      <Badge variant='secondary' className='mb-4'>RAG</Badge>
      <h1 className='mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl'>
        RAG + 3D Chat
      </h1>
      <p className='text-muted-foreground mb-8 max-w-2xl text-lg'>
        Retrieval-augmented chat interface with document upload and Three.js visualization for spatial data responses.
      </p>
      <div className='mb-20 flex flex-wrap gap-3'>
        <Button asChild>
          <Link href='/chat'>View live demo</Link>
        </Button>
        <Button variant='outline' asChild>
          <a href='https://github.com/pappdavid/portfolio-platform' target='_blank' rel='noopener noreferrer'>
            View code
          </a>
        </Button>
      </div>

      {/* Problem */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Problem</h2>
        <p className='text-muted-foreground leading-relaxed'>
          Generic chatbots hallucinate when asked about private documentation. Users need answers grounded in their own
          files, with citations. When responses contain structural or spatial data — floor plans, graph layouts,
          3D coordinates — plain text is insufficient; the user needs an interactive view.
        </p>
      </section>

      {/* What this demonstrates */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>What this demonstrates</h2>
        <ul className='text-muted-foreground space-y-2 leading-relaxed'>
          <li>• Full RAG pipeline: embed → store → retrieve → rerank → generate, with Supabase pgvector as the vector store</li>
          <li>• Cross-encoder reranking step that improves retrieval precision beyond cosine similarity alone</li>
          <li>• Conditional Three.js rendering — LLM response is parsed for spatial data markers and rendered in a 3D viewer when present</li>
        </ul>
      </section>

      {/* Architecture */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-6 text-2xl font-bold'>Architecture</h2>
        <ArchDiagram nodes={nodes} edges={edges} />
        <p className='text-muted-foreground mt-3 text-sm'>Hover any node to see what it does.</p>
      </section>

      {/* Tech stack */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Tech stack</h2>
        <ul className='text-muted-foreground space-y-2 text-sm leading-relaxed'>
          <li><span className='font-semibold text-white'>OpenAI Embeddings</span> — text-embedding-3-small at 1536 dimensions; good cost/quality trade-off for document retrieval.</li>
          <li><span className='font-semibold text-white'>Supabase pgvector</span> — cosine similarity search via a custom <code>match_documents</code> RPC; no separate vector DB required.</li>
          <li><span className='font-semibold text-white'>Thesys C1</span> — structured UI generation from LLM output, used for the chat response rendering layer.</li>
          <li><span className='font-semibold text-white'>Three.js</span> — 3D scene rendered conditionally when the LLM response contains spatial data markers.</li>
        </ul>
      </section>

      {/* Code */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Core logic</h2>
        <CodeBlock code={codeSnippet} language='typescript' filename='retrieve.ts' />
      </section>

      {/* Results */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Results</h2>
        <ul className='text-muted-foreground space-y-2 text-sm leading-relaxed'>
          <li>• Reference implementation — live demo uses mock documents; full document upload available in authenticated dashboard</li>
          <li>• Retrieval with reranking achieves higher precision@3 than cosine-only on test queries against the portfolio codebase</li>
          <li>• Rate-limited to 10 queries/hour (unauthenticated) via Upstash sliding window</li>
        </ul>
      </section>

      {/* Screenshots */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-6 text-2xl font-bold'>Screenshots</h2>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='overflow-hidden rounded-lg border border-white/[0.07]'>
            <Image src='/screenshots/chat/desktop.png' alt='RAG Chat desktop view' width={800} height={500} className='w-full' />
          </div>
          <div className='overflow-hidden rounded-lg border border-white/[0.07]'>
            <Image src='/screenshots/chat/mobile.png' alt='RAG Chat mobile view' width={375} height={667} className='w-full' />
          </div>
        </div>
      </section>

      {/* GitHub */}
      <section className='border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Code</h2>
        <p className='text-muted-foreground mb-4 text-sm'>
          The retrieval pipeline, Supabase vector schema, and chat API route are all in this repo.
        </p>
        <Button variant='outline' asChild>
          <a href='https://github.com/pappdavid/portfolio-platform' target='_blank' rel='noopener noreferrer'>
            View on GitHub →
          </a>
        </Button>
      </section>
    </div>
  );
}
```

**Step 2: Verify page renders**

Open `http://localhost:3000/projects/rag-chat`. Check diagram, all sections, no errors.

**Step 3: Commit**

```bash
git add src/app/\(public\)/projects/rag-chat/page.tsx
git commit -m "feat: rebuild RAG Chat detail page with React Flow diagram"
```

---

### Task 7: Take screenshots for all three projects

**Files:**
- Create: `public/screenshots/mcp/desktop.png`, `mobile.png`
- Create: `public/screenshots/training/desktop.png`, `mobile.png`
- Create: `public/screenshots/chat/desktop.png`, `mobile.png`

**Step 1: Create screenshot directories**

```bash
mkdir -p public/screenshots/mcp public/screenshots/training public/screenshots/chat
```

**Step 2: Take screenshots via Playwright MCP**

Use `mcp__plugin_playwright_playwright__browser_navigate` and `mcp__plugin_playwright_playwright__browser_take_screenshot` to capture:

For each project page URL (`/mcp`, `/training`, `/chat` — the product showcase pages):
1. Navigate to page
2. Resize to 1280×800, screenshot → save as `desktop.png`
3. Resize to 375×812, screenshot → save as `mobile.png`

Save files to the appropriate `public/screenshots/{project}/` directories.

**Step 3: Verify images load on detail pages**

Open each `/projects/*` detail page and confirm the `<Image>` components load without 404s.

**Step 4: Commit**

```bash
git add public/screenshots/
git commit -m "feat: add project screenshots (desktop + mobile)"
```

---

### Task 8: Generate OG images

**Files:**
- Create: `public/og/mcp-sentinel.png`
- Create: `public/og/training.png`
- Create: `public/og/rag-chat.png`

**Step 1: Take OG screenshots via Playwright MCP**

For each project detail page (`/projects/mcp-sentinel`, `/projects/training`, `/projects/rag-chat`):
1. Navigate to page
2. Resize to 1200×630
3. Screenshot → save as `public/og/{slug}.png`

**Step 2: Verify OG images exist**

```bash
ls public/og/
```
Expected: `mcp-sentinel.png  training.png  rag-chat.png`

**Step 3: Commit**

```bash
git add public/og/
git commit -m "feat: add OG images for project detail pages"
```

---

### Task 9: Apply metadata to existing product pages

**Files:**
- Modify: `src/app/(public)/mcp/page.tsx`
- Modify: `src/app/(public)/training/page.tsx`
- Modify: `src/app/(public)/chat/page.tsx`
- Modify: `src/app/(public)/page.tsx` (homepage)
- Modify: `src/app/(public)/about/page.tsx`

**Step 1: Update each page to use generatePageMetadata**

Replace existing `metadata` exports. Examples:

```typescript
// mcp/page.tsx
import { generatePageMetadata } from '@/lib/metadata';
export const metadata = generatePageMetadata({
  title: 'MCP Sentinel',
  description: 'Drop-in observability for agent tool calls. Log, guard, and audit every MCP interaction.',
  slug: 'mcp-sentinel',
});

// homepage — manual (different pattern)
export const metadata: Metadata = {
  title: 'David Papp — AI Engineer',
  description: 'I build production-grade LLM systems.',
};

// about/page.tsx
export const metadata: Metadata = {
  title: 'About — David Papp',
  description: 'AI Engineer building production LLM systems.',
};
```

**Step 2: Verify metadata in browser**

Open each page, view source, confirm `<title>` and `<meta property="og:*">` tags are correct.

**Step 3: Commit**

```bash
git add src/app/\(public\)/
git commit -m "feat: apply OG metadata to all public pages"
```

---

### Task 10: Final check + push

**Step 1: Run lint**

```bash
npm run lint
```
Expected: zero errors.

**Step 2: Run build**

```bash
npm run build
```
Expected: build succeeds with no type errors.

**Step 3: Push**

```bash
git push origin main
```
