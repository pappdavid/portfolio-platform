'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  componentLinksLabel?: string;
  tabs: {
    overview: string;
    // Examples are labeled as source excerpts or public workflow descriptions.
    code: { snippet: string; language: string; filename: string };
    diagram: string;
  };
};

const projects: Project[] = [
  {
    id: 'client-studio',
    title: 'Client Studio',
    status: 'Personal project: hosted source-excerpt prototype · no AI calls',
    description:
      'Company assistant on a Supabase-backed workspace: answers questions from supplied text or Markdown with exact source excerpts. Splits sources into versions, filters internal sources from the customer view on the server, and goes live only after explicit review, approval and activation as a frozen snapshot. Writes are revision-checked and idempotent, and the database is closed to client roles so only the server can read or write.',
    tags: [
      'TypeScript',
      'Next.js',
      'Supabase',
      'PostgreSQL',
      'Lexical retrieval',
      'Approval workflow'
    ],
    liveUrl: 'https://client-studio-psi.vercel.app',
    tabs: {
      overview:
        'Retrieval is lexical and model calls are switched off in the hosted demo. Shown with fictional examples or user-provided material. Source is private.',
      code: {
        snippet:
          'Fictional intake → source-excerpt review → unresolved questions → activation → runtime demo',
        language: 'text',
        filename: 'Public source-excerpt workflow'
      },
      diagram:
        'graph TD\n  Intake[Fictional intake] --> Excerpts[Source-excerpt review]\n  Excerpts --> Questions[Unresolved questions]\n  Questions --> Activate[Activate reviewed profile]\n  Activate --> Runtime[Runtime demonstration]'
    }
  },
  {
    id: 'active-companion',
    title: 'Active Companion',
    status: 'Personal project: scripted-replay lab with public source',
    description:
      'Meeting-assistant lab in Python: a sliding context window, heuristic intent classification and TF-IDF retrieval turn a transcript into evidence cards with named sources. An optional model step keeps only answer bullets that cite a retrieved source title. Includes a server-sent-events API lab and provider-free automated tests, with public MIT-licensed source.',
    tags: [
      'Python',
      'TF-IDF',
      'Retrieval',
      'Intent classification',
      'Server-Sent Events',
      'GitHub Actions'
    ],
    liveUrl: 'https://active-companion-replay.vercel.app',
    repoUrl: 'https://github.com/pappdavid/active-companion',
    tabs: {
      overview:
        'The hosted page is a scripted replay of the pipeline output for four fictional conversations, with no inference, microphone or uploads. It is not evaluated on real meetings. The model step runs only in the local lab and is tested with a stubbed model.',
      code: {
        snippet:
          'Bundled fictional conversation → next utterance → retrieval evidence cards',
        language: 'text',
        filename: 'Public replay workflow'
      },
      diagram:
        'graph TD\n  Conversation[Bundled fictional conversation] --> Step[Next utterance]\n  Step --> Retrieval[Retrieval output]\n  Retrieval --> Evidence[Evidence cards]'
    }
  },
  {
    id: 'faultline',
    title: 'Faultline',
    status:
      'Personal project: executable browser simulation with public source',
    description:
      'Executable browser model of retries and idempotency: lose the request before commit or the response after it, see the duplicate effect of a naive retry, then replay against an idempotent receiver. The receiver stores the operation key and payload fingerprint and rejects a changed payload under the same key. Events, receipts and assertions come from a tested in-memory engine with public source.',
    tags: [
      'JavaScript',
      'Idempotency keys',
      'Retries',
      'Simulated network faults',
      'Reliability patterns'
    ],
    liveUrl: '/faultline/index.html',
    repoUrl: 'https://github.com/pappdavid/faultline',
    tabs: {
      overview:
        'Atomic effect-and-receipt storage is a model assumption. It is a teaching model in browser JavaScript, not a deployed service or a test of real distributed systems.',
      code: {
        snippet: `const fingerprint = JSON.stringify([
  payload.operation,
  payload.service,
  payload.slot,
  payload.location
]);
const receipt = run.receipts[key];`,
        language: 'javascript',
        filename: 'public/faultline/engine.mjs · receiver excerpt'
      },
      diagram:
        'graph TD\n  Request[Fictional booking request] --> Receiver[In-memory receiver]\n  Receiver --> Commit[Visit and optional receipt]\n  Commit --> Lost[Response lost]\n  Lost --> Retry[Retry with operation key]\n  Retry --> Receiver\n  Receiver --> Assertions[Completion and uniqueness assertions]'
    }
  },
  {
    id: 'mercury-renderer',
    title: 'Mercury Renderer Study',
    status: 'Synthetic replay · no model calls · no performance benchmark',
    description:
      'Validate full-state snapshots, retain the last valid SVG composition, and inspect malformed-frame recovery in a local rendering study.',
    tags: ['JavaScript', 'SVG', 'Validation', 'Synthetic fixtures'],
    liveUrl: '/demos/mercury/index.html',
    repoUrl:
      'https://github.com/pappdavid/portfolio-platform/tree/main/public/demos/mercury',
    tabs: {
      overview:
        'Bundled synthetic snapshots refine text and graph connections over three sequences. Visitors play, pause, scrub, interrupt, reject malformed frames, and export the bounded event trace. The renderer preserves the last valid composition and reconciles SVG nodes by identity. It is inspired by diffusion-style full-state updates, but does not connect to a Mercury model or perform inference. Frame counts and playback timing describe the fixture, not model measurements.',
      code: {
        snippet: `export function pruneStaleNodes(children, ids) {
  for (const existing of [...children]) {
    if (!ids.has(existing.getAttribute("data-node"))) existing.remove();
  }
}`,
        language: 'javascript',
        filename:
          'public/demos/mercury/engine.mjs · live-collection reconciliation'
      },
      diagram:
        'graph TD\n  Fixtures[Synthetic full-state snapshots] --> Validate[Schema validation]\n  Validate -->|valid| Render[Reconcile SVG nodes and text]\n  Validate -->|invalid| Retain[Retain last valid composition]\n  Render --> Trace[Bounded exportable trace]\n  Retain --> Trace'
    }
  },
  {
    id: 'voidarch-context',
    title: 'VoidArch Context',
    status:
      'Active development · v0.1 local-first CLI · not a stable npm release',
    description:
      'Persistent repo memory, document and code-graph retrieval, local embeddings, and deterministic token-budgeted context packs for coding agents.',
    tags: ['TypeScript', 'SurrealDB', 'Tree-sitter', 'ONNX', 'BM25'],
    repoUrl: 'https://github.com/VoidArch-Labs/voidarch-context',
    tabs: {
      overview:
        'VoidArch Context is a standalone, agent-neutral context engine. It indexes repository files and documentation into embedded SurrealDB, stores durable memories and task state, builds a Tree-sitter code graph, supports local ONNX embeddings, and fuses available channels into a token-budgeted Markdown or JSON context pack. It runs locally without Docker or Python. Current limitations include single-process database access and an explicit embed pass for vector retrieval.',
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
    description:
      'Daemon-owned agent sessions, worktrees, runs, routing, safety hooks, observability, and a Tauri desktop shell.',
    tags: ['TypeScript', 'Node.js', 'PTY', 'WebSocket', 'xterm.js', 'Tauri'],
    tabs: {
      overview:
        'VoidArch Studio is the orchestration layer built on Context. The current repository includes a localhost dashboard, daemon-owned PTY sessions for Claude, Codex, and shell, worktree and run management, transcript and resume metadata, safety hooks, observability, and a thin Tauri v2 desktop shell. It is in active development and is not presented as a released hosted service.',
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
    id: 'voidarch-router',
    title: 'VoidArch Router',
    status: 'Personal tool · offline-testable · private source',
    description:
      'Deterministic capability and workflow routing with prerequisite checks and explainable route plans.',
    tags: ['TypeScript', 'Offline fixtures', 'Workflow routing'],
    tabs: {
      overview:
        'A standalone personal TypeScript tool that compiles capability and workflow metadata, classifies tasks, checks declared prerequisites, and emits explainable route plans. The private repository includes offline fixtures and test commands. It does not execute workflows, read credentials, call models, or provide a hosted service. Hermes and Studio adapters remain deferred interfaces.',
      code: {
        snippet:
          'Compact metadata → workflow candidates → prerequisite checks → trusted implementation selection → explainable route plan',
        language: 'text',
        filename: 'README-grounded workflow summary · not a source excerpt'
      },
      diagram:
        'graph TD\n  Task[Task and declared environment] --> Candidates[Rank workflow candidates]\n  Candidates --> Checks[Check prerequisites and trust]\n  Checks --> Plan[Explainable route plan]'
    }
  }
];

export function ProjectsContent() {
  const [activeProject, setActiveProject] = useState(projects[0].id);
  useEffect(() => {
    const selectHash = () => {
      const id = window.location.hash.slice(1);
      if (projects.some((p) => p.id === id)) setActiveProject(id);
    };
    selectHash();
    window.addEventListener('hashchange', selectHash);
    return () => window.removeEventListener('hashchange', selectHash);
  }, []);
  const project = projects.find((p) => p.id === activeProject)!;

  return (
    <div className='projects-surface relative mx-auto flex w-full max-w-6xl flex-col'>
      <div
        className='pointer-events-none absolute inset-0 z-0'
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,0.10) 0%, transparent 60%)'
        }}
      />
      <nav
        aria-label='Portfolio'
        className='relative z-10 mx-auto flex w-full max-w-6xl gap-6 px-4 pt-6 text-sm'
      >
        <Link
          href='/'
          className='text-[var(--dp-text-dim)] underline-offset-4 hover:text-[var(--dp-accent)] hover:underline'
        >
          Home
        </Link>
        <a
          href='/projects'
          aria-current='page'
          className='font-bold text-[var(--dp-accent)] underline decoration-2 underline-offset-4'
        >
          Projects
        </a>
        <Link
          href='/#contact'
          className='text-[var(--dp-text-dim)] underline-offset-4 hover:text-[var(--dp-accent)] hover:underline'
        >
          Contact
        </Link>
      </nav>
      {/* Hero */}
      <section className='relative z-10 py-20'>
        <div className='mx-auto max-w-4xl border border-[var(--dp-border)] bg-[#0a0a0a] px-6 py-8 sm:px-8'>
          <span className='mb-4 inline-block border border-[var(--dp-accent)] px-2 py-0.5 text-[11px] font-bold text-[var(--dp-accent)]'>
            SHOWCASE
          </span>
          <h1 className='text-4xl font-bold tracking-tight text-[var(--dp-text)] sm:text-5xl'>
            Selected engineering projects
          </h1>
          <p className='mt-4 max-w-2xl text-lg leading-relaxed text-[var(--dp-text-dim)]'>
            Personal engineering projects: a source-excerpt company assistant, a
            scripted-replay retrieval lab, an executable idempotency model, and
            local-first context and orchestration tooling for coding agents.
            Public links are shown where repositories or live demos are
            available.
          </p>
        </div>
      </section>

      {/* Project Cards */}
      <section className='py-12'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {projects.map((p) => (
              <div key={p.id} id={p.id} className='group relative scroll-mt-6'>
                <button
                  onClick={() => setActiveProject(p.id)}
                  aria-pressed={activeProject === p.id}
                  aria-controls='project-case-study'
                  className={cn(
                    'w-full rounded-none border p-5 text-left transition-all',
                    activeProject === p.id
                      ? 'border-[var(--dp-accent)] bg-[var(--dp-bg-selected)]'
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
                  <a
                    href='#project-case-study'
                    onClick={() => setActiveProject(p.id)}
                    className='text-[var(--dp-accent)] underline-offset-2 hover:underline'
                  >
                    Case study ↓
                  </a>
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
                      Open demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Project Detail */}
      <section
        id='project-case-study'
        className='border-t border-[var(--dp-border)] py-12'
      >
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-6 text-2xl font-bold text-[var(--dp-text)]'>
            {project.title}
          </h2>
          <Tabs key={project.id} defaultValue='overview'>
            <TabsList className='border border-[var(--dp-border)] bg-[var(--dp-bg-raised)]'>
              <TabsTrigger
                value='overview'
                className='text-[var(--dp-text-dim)] data-[state=active]:bg-[var(--dp-bg-selected)] data-[state=active]:text-[var(--dp-accent-muted)]'
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value='code'
                className='text-[var(--dp-text-dim)] data-[state=active]:bg-[var(--dp-bg-selected)] data-[state=active]:text-[var(--dp-accent-muted)]'
              >
                Code
              </TabsTrigger>
              <TabsTrigger
                value='diagram'
                className='text-[var(--dp-text-dim)] data-[state=active]:bg-[var(--dp-bg-selected)] data-[state=active]:text-[var(--dp-accent-muted)]'
              >
                Architecture
              </TabsTrigger>
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
                        {component.label}{' '}
                        {project.componentLinksLabel ?? 'repository →'}
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
