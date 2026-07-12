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
  repoUrl: string;
  liveUrl?: string;
  tabs: {
    overview: string;
    // Code snippets below are excerpts from the actual repository source.
    code: { snippet: string; language: string; filename: string };
    diagram: string;
  };
};

const projects: Project[] = [
  {
    id: 'promptshield',
    title: 'PromptShield',
    status: 'Prototype · live demo · CI-verified',
    description:
      'Rule-based prompt-injection scanner plus runtime action inspector, with unit tests and CI that asserts live HTTP behavior.',
    tags: ['TypeScript', 'Next.js', 'Prisma', 'Vitest'],
    repoUrl: 'https://github.com/pappdavid/promptshield',
    liveUrl: 'https://promptshield-cyan.vercel.app',
    tabs: {
      overview:
        'PromptShield scans prompts with deterministic regex/heuristic rules across six categories (instruction override, role hijacking, jailbreak markers, system-prompt exfiltration, data exfiltration, unsafe tool use) and classifies proposed agent actions as allow, block, or requires-approval. Unit tests cover benign and malicious classification and false-positive regressions; CI boots the production build, asserts real HTTP responses, and fails if the public demo is down. Detection is heuristic by design — false positives and negatives are possible.',
      code: {
        snippet: `// Excerpt from src/lib/prompt-report.ts — the actual rule table
const RULES = [
  {
    category: "instruction_override",
    title: "Instruction override attempt",
    severity: "high",
    patterns: [
      /ignore ((all|previous|above)\\s+){0,2}instructions?/i,
      /disregard ((all|previous|above)\\s+){0,2}instructions?/i,
      /forget (everything|your instructions|your system prompt)/i,
    ],
    remediation:
      "Reject or quarantine prompts that ask the model to ignore or replace trusted instructions.",
  },
  {
    category: "system_prompt_exfiltration",
    title: "System prompt exfiltration",
    severity: "critical",
    patterns: [/system prompt/i, /hidden instructions?/i],
    remediation:
      "Remove requests to reveal system prompts, hidden instructions, policies, or private chain-of-thought.",
  },
  // ...4 more categories in the repo
];`,
        language: 'typescript',
        filename: 'src/lib/prompt-report.ts (excerpt)'
      },
      diagram: `graph TD
  A[Prompt or agent action] --> B[Bearer-auth HTTP API]
  B --> C[Rule-based scanner - 6 categories]
  B --> D[Runtime inspector]
  C --> E[(Scan history - Prisma/Postgres)]
  D --> F{allow / block / requires_approval}
  E --> G[Clerk-authenticated dashboard]`
    }
  },
  {
    id: 'agentsec-hook-pack',
    title: 'agentsec-hook-pack',
    status: 'Tested local tool · 12-case suite',
    description:
      'Zero-dependency PreToolUse policy hook for Claude Code and Codex: safe-command fast paths, destructive-command blocking, fail-closed handling.',
    tags: ['Node.js', 'Hooks', 'node:test'],
    repoUrl: 'https://github.com/pappdavid/agentsec-hook-pack',
    tabs: {
      overview:
        'A single dependency-free Node script that gates AI coding-agent tool calls before execution. It reads the tool-use event from stdin, applies a safe-command allowlist with chained-command and find-exec bypass protection, blocks destructive patterns, optionally consults a remote policy API, and fails closed on malformed input or API outage. Supports observe/prompt/enforce modes and emits Claude-style JSON decisions or Codex-style exit codes. The remote policy service is exercised against a mock server in tests — this is a local hook pack, not a hosted approval platform.',
      code: {
        snippet: `// Excerpt from .agentsec/hooks/agentsec-hook.mjs
const SHELL_CONTROL_PATTERN = /(?:&&|\\|\\||[;|\`]|>\\s*|<\\s*|\\$\\(|\\r|\\n)/;
const FIND_MUTATION_PATTERN =
  /\\s-(?:exec|execdir|ok|okdir|delete|fprint|fprintf|fls)\\b/i;

function isConfiguredSafeCommand(command, safeCommands) {
  // A "safe" command chained to anything else is not safe
  if (SHELL_CONTROL_PATTERN.test(command)) return false;
  // find is only safe without mutating flags
  if (/^find(?:\\s|$)/i.test(command) && FIND_MUTATION_PATTERN.test(command))
    return false;

  return safeCommands.some(
    (safeCommand) =>
      command === safeCommand || command.startsWith(\`\${safeCommand} \`)
  );
}`,
        language: 'javascript',
        filename: '.agentsec/hooks/agentsec-hook.mjs (excerpt)'
      },
      diagram: `sequenceDiagram
  participant Agent as AI Agent (Claude/Codex)
  participant Hook as agentsec-hook.mjs
  Agent->>Hook: PreToolUse event via stdin
  Hook->>Hook: safe-command fast path
  Hook->>Hook: destructive-pattern check
  Hook-->>Agent: allow / deny / ask (fail-closed on errors)`
    }
  },
  {
    id: 'mcpguard-lite',
    title: 'mcpguard-lite',
    status: 'Prototype · live demo',
    description:
      'Static risk analyzer for MCP tools/list manifests: capability risks by severity plus missing-declared-control gaps.',
    tags: ['TypeScript', 'Next.js', 'MCP', 'Vitest'],
    repoUrl: 'https://github.com/pappdavid/mcpguard-lite',
    liveUrl: 'https://mcpguard-lite.vercel.app',
    tabs: {
      overview:
        'Paste a raw MCP tools/list JSON manifest and get a deterministic static analysis: seven capability categories ranked by severity and detection of missing declared controls (approval, audit logging, sandboxing, egress limits). It distinguishes genuine control declarations from wording like "without approval" and handles malformed input. Static analysis of declared manifests only — it does not probe running servers, and a clean manifest does not prove runtime safety.',
      code: {
        snippet: `// Behavior covered by the repo's unit tests:
// - risky manifest -> capability findings by severity
// - read-only manifest -> low risk, no control gaps flagged
// - "runs without approval" -> NOT counted as an approval control
// - invalid JSON -> handled error, not a crash
// See src/lib/tools-list-report.ts (200 lines) for the engine.`,
        language: 'typescript',
        filename: 'src/lib/tools-list-report.ts (summary)'
      },
      diagram: `graph TD
  A[Pasted tools/list JSON] --> B[Deterministic static analyzer]
  B --> C[Capability risks by severity]
  B --> D[Missing declared controls]
  C --> E[Scan dashboard]
  D --> E`
    }
  },
  {
    id: 'agentmap',
    title: 'agentmap',
    status: 'Prototype · live demo',
    description:
      'Agent inventory with explainable 0–100 risk scoring from declared permissions, data access, and tool surface.',
    tags: ['TypeScript', 'Next.js', 'Prisma', 'Vitest'],
    repoUrl: 'https://github.com/pappdavid/agentmap',
    liveUrl: 'https://agentmap-fawn.vercel.app',
    tabs: {
      overview:
        'Register AI agents with their declared metadata and get a deterministic 0–100 risk score with readiness labels (ready / needs-review / blocked). Command execution, secret access, sensitive data, and broad permissions raise the score, and every factor is listed so the score is explainable. Scoring is based on declared metadata, not runtime observation — it reports readiness rather than enforcing it. The scoring logic is unit-tested and CI exercises the API against the production build.',
      code: {
        snippet: `// Excerpt from src/lib/agent-risk.ts — the actual rules
const riskRules = [
  { pattern: /\\b(shell|exec|command|terminal|bash|script)\\b/i,
    points: 35, factor: "command execution capability" },
  { pattern: /\\b(write|delete|remove|drop|deploy|production|prod)\\b/i,
    points: 25, factor: "destructive or production change capability" },
  { pattern: /\\b(secrets?|tokens?|credentials?|passwords?|api keys?|env)\\b/i,
    points: 25, factor: "secret access" },
  { pattern: /\\b(customer data|personal data|pii|phi|billing|financial)\\b/i,
    points: 40, factor: "sensitive data access" },
];

function readinessFor(score) {
  if (score >= 75) return "blocked";
  if (score >= 40) return "needs_review";
  return "ready";
}`,
        language: 'typescript',
        filename: 'src/lib/agent-risk.ts (excerpt)'
      },
      diagram: `graph TD
  A[Agent registration - declared metadata] --> B[Deterministic scoring 0-100]
  B --> C{Readiness}
  C -->|score < 40| D[ready]
  C -->|40 - 74| E[needs_review]
  C -->|75+| F[blocked]`
    }
  },
  {
    id: 'approveops',
    title: 'approveops',
    status: 'Prototype · live demo · mocked-DB tests',
    description:
      'Human-in-the-loop approval queue: risk classification, owner-scoped pending decisions, transactional approval + audit writes.',
    tags: ['TypeScript', 'Next.js', 'Prisma', 'Vitest'],
    repoUrl: 'https://github.com/pappdavid/approveops',
    liveUrl: 'https://approveops.vercel.app',
    tabs: {
      overview:
        'An approval-workflow prototype for risky agent actions. A deliberately small keyword classifier assigns low/medium/high/critical risk; submissions and decisions are each written in a single database transaction together with their audit events, guarded by owner-only and pending-only checks. This behavior is covered by mocked-database unit tests. The caller is responsible for enforcing decisions — submitting an action does not itself stop an external agent.',
      code: {
        snippet: `// Excerpt from src/lib/approvals.ts — transactional write
return prisma.$transaction(async (tx) => {
  const approval = await tx.approvalRequest.create({
    data: {
      title: input.title,
      description: input.description,
      riskLevel: risk.riskLevel,
      riskReasons: risk.reasons,
      createdById: user.id,
    },
  });

  await recordApprovalAuditEvent(tx, {
    type: "approval_submitted",
    userId: user.id,
    severity: auditSeverityForRisk(risk.riskLevel),
    details: { approvalRequestId: approval.id, status: approval.status },
  });

  return approval;
});`,
        language: 'typescript',
        filename: 'src/lib/approvals.ts (excerpt)'
      },
      diagram: `graph TD
  A[Action submitted] --> B[Keyword risk classifier]
  B --> C[Owner-scoped pending queue]
  C --> D[Approve / reject]
  D --> E[(Transactional write: decision + audit event)]`
    }
  },
  {
    id: 'agent-cli-mcp-rust',
    title: 'agent-cli-mcp-rust',
    status: 'Developer tool · unit-tested core modules',
    description:
      'Rust MCP server dispatching and supervising multiple AI coding CLIs with directory isolation and secret scrubbing.',
    tags: ['Rust', 'MCP', 'JSON-RPC'],
    repoUrl: 'https://github.com/pappdavid/agent-cli-mcp-rust',
    tabs: {
      overview:
        'A Model Context Protocol server in Rust that coordinates external coding agents (GitHub Copilot CLI, Google Jules, generic executors) over JSON-RPC/stdio: session management, allowed-roots directory isolation, destructive-command deny patterns, and regex-based secret scrubbing of subprocess output. Unit tests cover the policy and redaction modules. The external executor integrations do not yet have end-to-end CI coverage, and no performance benchmarks have been published.',
      code: {
        snippet: `// Excerpt from src/redaction.rs — real secret patterns (unit-tested)
const REDACTED: &str = "[REDACTED_SECRET]";

let raw_patterns = vec![
    // Database connection strings
    (r#"postgres(?:ql)?://[^\\s"',)]+"#, "DB_URL"),
    (r#"mongodb(?:\\+srv)?://[^\\s"',)]+"#, "MONGO_URL"),
    // GitHub tokens
    (r"ghp_[A-Za-z0-9_]{36,}", "GITHUB_PAT"),
    (r"github_pat_[A-Za-z0-9_]{82,}", "GITHUB_PAT_FINE"),
    // Slack / Stripe
    (r"xox[baprs]-[A-Za-z0-9-]{10,}", "SLACK_TOKEN"),
    (r"sk_live_[A-Za-z0-9]{24,}", "STRIPE_LIVE_KEY"),
    // ...more patterns in the repo
];`,
        language: 'rust',
        filename: 'src/redaction.rs (excerpt)'
      },
      diagram: `graph TD
  CC[Claude Code] -->|JSON-RPC over stdio| MCP[MCP Transport]
  MCP --> POL[Directory policy - allowed roots]
  MCP --> RED[Secret scrubber]
  MCP --> SES[Session manager]
  SES -->|pipes| EX[Copilot CLI / Jules / generic executors]`
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
            Open-source projects
          </h1>
          <p className='mt-4 max-w-2xl text-lg leading-relaxed text-[var(--dp-text-dim)]'>
            Personal prototypes and developer tools around AI-agent security —
            each card states its real status, and every code tab shows actual
            source from the repository.
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
                  <a
                    href={p.repoUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--dp-accent)] underline-offset-2 hover:underline'
                  >
                    Repository →
                  </a>
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
