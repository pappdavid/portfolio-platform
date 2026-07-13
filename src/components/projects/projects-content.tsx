'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/shared/code-block';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';
import { cn } from '@/lib/utils';

type Project = {
  id: string;
  title: string;
  status: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  componentLinks?: { label: string; url: string }[];
  tabs: {
    overview: string;
    // Code snippets below are excerpts from the actual repository source.
    code: { snippet: string; language: string; filename: string };
    diagram: string;
  };
};

const projects: Project[] = [
  {
    id: 'voidarch-context',
    title: 'VoidArch Context',
    status: 'Active project · local-first CLI and engine',
    description: 'Persistent repo memory, document and code-graph retrieval, local embeddings, and deterministic token-budgeted context packs for coding agents.',
    tags: ['TypeScript', 'SurrealDB', 'Tree-sitter', 'ONNX', 'BM25'],
    tabs: {
      overview: 'VoidArch Context is a standalone, agent-neutral context engine. It indexes repository files and documentation into embedded SurrealDB, stores durable memories and task state, builds a Tree-sitter code graph, supports local ONNX embeddings, and fuses available channels into a token-budgeted Markdown or JSON context pack. It runs locally without Docker or Python. Current limitations include single-process database access and an explicit embed pass for vector retrieval.',
      code: {
        snippet: `voidarch-context init
voidarch-context ingest
voidarch-context graph build
voidarch-context models install
voidarch-context embed --approve
voidarch-context context "fix the auth token refresh bug"`,
        language: 'bash',
        filename: 'Verified CLI workflow'
      },
      diagram: `graph TD
  Repo[Repository files and docs] --> DB[(Embedded SurrealDB)]
  Repo --> Graph[Tree-sitter code graph]
  Repo --> Vector[Local ONNX embeddings]
  Memory[Decisions, lessons, tasks] --> DB
  DB --> Pack[Token-budgeted context pack]
  Graph --> Pack
  Vector --> Pack
  Pack --> Agent[Claude Code / Codex / other agents]`
    }
  },
  {
    id: 'voidarch-studio',
    title: 'VoidArch Studio',
    status: 'Active development · local orchestration control room',
    description: 'Daemon-owned agent sessions, worktrees, runs, routing, safety hooks, observability, and a Tauri desktop shell.',
    tags: ['TypeScript', 'Node.js', 'PTY', 'WebSocket', 'xterm.js', 'Tauri'],
    tabs: {
      overview: 'VoidArch Studio is the orchestration layer built on Context. The current repository includes a localhost dashboard, daemon-owned PTY sessions for Claude, Codex, and shell, worktree and run management, transcript and resume metadata, safety hooks, observability, and a thin Tauri v2 desktop shell. It is in active development and is not presented as a released hosted service.',
      code: {
        snippet: `pnpm dfc:dashboard --repo-root /path/to/repo
# localhost control room: sessions, worktrees, runs, memory, metrics
# daemon owns PTYs so sessions survive closing the desktop shell`,
        language: 'bash',
        filename: 'Local Studio launch'
      },
      diagram: `graph TD
  UI[Web dashboard / Tauri shell] --> Daemon[Local daemon]
  Daemon --> PTY[Claude, Codex, shell PTYs]
  Daemon --> Worktrees[Worktree and run manager]
  Daemon --> Hooks[Safety and observability hooks]
  Context[VoidArch Context] --> UI
  PTY --> Transcripts[Transcripts and resume metadata]`
    }
  },
  {
    id: 'agentsec-suite',
    title: 'AgentSec Suite',
    status: 'Working integrated suite · live demo',
    description: 'One integrated interface for prompt scanning, MCP manifest analysis, agent risk mapping, approval workflows, and local runtime hooks.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Clerk', 'Vitest', 'Node.js'],
    liveUrl: 'https://promptshield-cyan.vercel.app',
    componentLinks: [
        { label: 'PromptShield', url: 'https://github.com/pappdavid/PromptShield' },
        { label: 'Hook Pack', url: 'https://github.com/pappdavid/agentsec-hook-pack' },
        { label: 'MCPGuard', url: 'https://github.com/pappdavid/mcpguard-lite' },
        { label: 'AgentMap', url: 'https://github.com/pappdavid/agentmap' },
        { label: 'ApproveOps', url: 'https://github.com/pappdavid/approveops' }
      ],
    tabs: {
      overview: 'AgentSec Suite combines four web modules and one local enforcement package: PromptShield scans prompts and proposed actions; MCPGuard analyzes declared MCP tool manifests; AgentMap scores declared agent permissions and data access; ApproveOps manages owner-scoped approval decisions and audit writes; and the hook pack gates Claude Code and Codex tool calls. The integrated deployment is the public demo. Component repositories are linked as supporting evidence rather than presented as five separate products.',
      code: {
        snippet: `const modules = [
  { slug: 'promptshield', name: 'PromptShield' },
  { slug: 'mcpguard', name: 'MCP Guard Lite' },
  { slug: 'agentmap', name: 'AgentMap' },
  { slug: 'approveops', name: 'ApproveOps' }
];`,
        language: 'typescript',
        filename: 'VoidArch-Labs/AgentSec · src/app/page.tsx (excerpt)'
      },
      diagram: `graph TD
  Action[Prompt or agent action] --> PS[PromptShield]
  Manifest[MCP tools/list] --> MCP[MCPGuard]
  Agent[Declared agent metadata] --> AM[AgentMap]
  PS --> Decision{allow / block / review}
  MCP --> Decision
  AM --> Decision
  Decision --> AO[ApproveOps]
  Hook[Claude/Codex PreToolUse hook] --> Decision
  AO --> Audit[(Decision and audit records)]`
    }
  },
  {
    id: 'saas-core',
    title: 'saas-core',
    status: 'Private engineering infrastructure',
    description: 'Modular Next.js scaffold and product-factory tooling with typed presets, environment validation, rendering, and CI workflows.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Clerk', 'Stripe', 'GitHub Actions'],
    tabs: {
      overview: 'saas-core is a private engineering repository used as supporting infrastructure. The codebase contains a modular Next.js scaffold, typed module and preset planning, environment validation, product rendering scripts, CI workflows, and provider adapters. It is shown as an engineering system, not as a public product or live demo; no provisioning or integration claim is made beyond what the repository implements.',
      code: {
        snippet: `"factory:plan": "tsx scripts/factory/plan-product.ts",
"factory:render": "tsx scripts/factory/render-product.ts",
"env:validate": "tsx scripts/env-validate.ts",
"modules:check": "tsx scripts/modules/check.ts",
"readiness:check": "node --import tsx scripts/readiness.ts"`,
        language: 'json',
        filename: 'VoidArch-Labs/saas-core · package.json (excerpt)'
      },
      diagram: `graph TD
  Preset[Typed preset] --> Plan[Factory planner]
  Registry[Module registry] --> Plan
  Plan --> Validate[Environment and module validation]
  Validate --> Render[Template renderer]
  Render --> Product[Generated bounded product scaffold]
  Product --> CI[Typecheck, tests, build, readiness checks]`
    }
  }
];

export function ProjectsContent() {
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const project = projects.find((p) => p.id === activeProject)!;

  return (
    <div className='relative flex flex-col'>
      <div
        className='pointer-events-none absolute inset-0 z-0'
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,0.10) 0%, transparent 60%)'
        }}
      />
      {/* Hero */}
      <section className='relative z-10 py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <span className='mb-4 inline-block border border-[var(--dp-accent)] px-2 py-0.5 text-[11px] font-bold text-[var(--dp-accent)]'>
            SHOWCASE
          </span>
          <h1 className='text-4xl font-bold tracking-tight text-[var(--dp-text)] sm:text-5xl'>
            Selected engineering projects
          </h1>
          <p className='mt-4 max-w-2xl text-lg leading-relaxed text-[var(--dp-text-dim)]'>
            Four current systems spanning local-first context, agent orchestration,
            security controls, and reusable product infrastructure. Public links are
            shown only where a repository or working demo is actually accessible.
          </p>
        </div>
      </section>

      {/* Project Cards */}
      <section className='py-12'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {projects.map((p) => (
              <div key={p.id} className='group relative'>
                <button
                  onClick={() => setActiveProject(p.id)}
                  className={cn(
                    'w-full rounded-none border p-5 text-left transition-all',
                    activeProject === p.id
                      ? 'border-[var(--dp-accent)] bg-[var(--dp-accent-faint)]'
                      : 'border-[var(--dp-border)] bg-[var(--dp-bg-raised)] hover:border-[var(--dp-accent-muted)]'
                  )}
                >
                  <h3 className='font-semibold text-[var(--dp-text)]'>
                    {p.title}
                  </h3>
                  <p className='mt-1 text-xs text-[var(--dp-accent-muted)]'>
                    {p.status}
                  </p>
                  <p className='mt-2 text-sm leading-relaxed text-[var(--dp-text-dim)]'>
                    {p.description}
                  </p>
                  <div className='mt-3 flex flex-wrap gap-1'>
                    {p.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant='outline'
                        className='border-[var(--dp-border)] text-xs text-[var(--dp-text-dim)]'
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </button>
                <div className='mt-2 flex justify-center gap-4 text-xs'>
                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--dp-accent)] underline-offset-2 hover:underline'
                    >
                      Repository →
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--dp-accent)] underline-offset-2 hover:underline'
                    >
                      Live demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Project Detail */}
      <section className='border-t border-[var(--dp-border)] py-12'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-6 text-2xl font-bold text-[var(--dp-text)]'>
            {project.title}
          </h2>
          <Tabs defaultValue='overview'>
            <TabsList className='border border-[var(--dp-border)] bg-[var(--dp-bg-raised)]'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='code'>Code</TabsTrigger>
              <TabsTrigger value='diagram'>Architecture</TabsTrigger>
            </TabsList>
            <TabsContent value='overview' className='mt-4'>
              <div className='rounded-none border border-[var(--dp-border)] bg-[var(--dp-bg-raised)] p-6'>
                <p className='leading-relaxed text-[var(--dp-text-dim)]'>
                  {project.tabs.overview}
                </p>
                {project.componentLinks && (
                  <div className='mt-5 flex flex-wrap gap-2'>
                    {project.componentLinks.map((component) => (
                      <a
                        key={component.label}
                        href={component.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='border border-[var(--dp-border)] px-2 py-1 text-xs text-[var(--dp-accent-muted)] hover:border-[var(--dp-accent)] hover:text-[var(--dp-accent)]'
                      >
                        {component.label} repository →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value='code' className='mt-4'>
              <CodeBlock
                code={project.tabs.code.snippet}
                language={project.tabs.code.language}
                filename={project.tabs.code.filename}
              />
            </TabsContent>
            <TabsContent value='diagram' className='mt-4'>
              <div className='rounded-none border border-[var(--dp-border)] bg-[var(--dp-bg-raised)] p-6'>
                <MermaidDiagram chart={project.tabs.diagram} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h2 className='text-2xl font-bold tracking-tight text-[var(--dp-text)] sm:text-3xl'>
            Want to talk about any of these?
          </h2>
          <p className='mt-4 text-lg text-[var(--dp-text-dim)]'>
            Open to full-time AI engineering and AI solutions roles.
          </p>
          <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <a
              href='mailto:contact@davidpapp.dev'
              className='border border-[var(--dp-accent)] bg-[var(--dp-accent-faint)] px-6 py-3 font-semibold text-[var(--dp-accent)] hover:bg-[var(--dp-accent)] hover:text-black'
            >
              Email me
            </a>
            <a
              href='https://github.com/pappdavid'
              target='_blank'
              rel='noopener noreferrer'
              className='border border-[var(--dp-border)] px-6 py-3 font-semibold text-[var(--dp-text)] hover:border-[var(--dp-accent)] hover:text-[var(--dp-accent)]'
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
