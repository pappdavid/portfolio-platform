export const VOIDARCH_MATURITY = [
  'WORKING',
  'ACTIVE',
  'PROTOTYPE',
  'PLANNED',
  'FUTURE',
  'EXTERNAL'
] as const;

export type VoidArchMaturity = (typeof VOIDARCH_MATURITY)[number];
export type VoidArchGroup = 'core' | 'input' | 'support' | 'output';
export type VoidArchNodeId =
  | 'context'
  | 'memory'
  | 'models'
  | 'router'
  | 'tools'
  | 'studio'
  | 'policy'
  | 'evidence';

export interface VoidArchPosition {
  x: number;
  y: number;
}

export interface VoidArchNode {
  id: VoidArchNodeId;
  title: string;
  group: VoidArchGroup;
  maturity: VoidArchMaturity;
  summary: string;
  position: VoidArchPosition;
  role: string;
  owns: string;
  connects: string;
  bullets: readonly string[];
}

export interface VoidArchEdge {
  id: string;
  source: VoidArchNodeId;
  target: VoidArchNodeId;
}

export interface VoidArchEvidenceItem {
  id: string;
  label: string;
  summary: string;
  maturity: VoidArchMaturity;
}

export interface VoidArchRouteStep {
  node: VoidArchNodeId;
  edge?: string;
  message: string;
}

export type VoidArchProjectVisibility = 'public' | 'private';
export type VoidArchProjectKind = 'core' | 'supporting';

export interface VoidArchProject {
  id: string;
  title: string;
  kind: VoidArchProjectKind;
  visibility: VoidArchProjectVisibility;
  maturity: VoidArchMaturity;
  role: string;
  repository?: string;
  summary: string;
  implemented: readonly string[];
  verification: readonly string[];
  contributes: readonly string[];
}

export interface VoidArchLabSignal {
  domain: string;
  experiment: string;
  recurringSystems: string;
  extractedPrimitive: string;
}

export const VOIDARCH_PROJECTS: readonly VoidArchProject[] = [
  {
    id: 'context',
    title: 'VoidArch Context',
    kind: 'core',
    visibility: 'public',
    maturity: 'WORKING',
    role: 'Local-first repository memory and context engine',
    repository: 'https://github.com/VoidArch-Labs/voidarch-context',
    summary:
      'Indexes source and documentation, stores durable project state, builds a lightweight code graph, and emits ranked context packs under an explicit token budget.',
    implemented: [
      'Embedded SurrealKV inside the target repository',
      'BM25 search plus deterministic ranking heuristics',
      'Local ONNX embeddings with all-MiniLM-L6-v2',
      'Tree-sitter code graph extraction for TypeScript, TSX, JavaScript, and Python',
      'Durable memories, tasks, blockers, run records, entities, episodes, and temporal facts',
      'Markdown or JSON context packs with estimated token budgets'
    ],
    verification: [
      'CI installs the packed package into a fresh temporary Git repository and exercises the shipped CLI',
      'Smoke path covers init, ingest, graph, remember, search, query, context, status, and machine-readable token metadata'
    ],
    contributes: ['Context', 'Memory Fabric', 'Evidence']
  },
  {
    id: 'router',
    title: 'VoidArch Router',
    kind: 'core',
    visibility: 'private',
    maturity: 'PROTOTYPE',
    role: 'Offline-testable workflow and capability routing',
    summary:
      'Compiles compact capability/workflow metadata, classifies a task, checks the declared environment, resolves trusted implementations, and emits an explainable route plan.',
    implemented: [
      'Workflow and capability registry compilation from checked-in metadata',
      'Task-family classification and declared-environment preflight',
      'Trust ordering: built-in → official → internal reviewed → audited external → fallback',
      'Blocked and indexed-unreviewed implementations are prevented from execution selection',
      'PreparedContextRequest progressive-loading contract for detailed instructions only after selection'
    ],
    verification: [
      'Offline fixtures cover complete and constrained environments without requiring Hermes, Studio, MCP, or remote inference',
      'pnpm test and pnpm typecheck verify the standalone routing package'
    ],
    contributes: ['Router', 'Models', 'Tools']
  },
  {
    id: 'studio',
    title: 'VoidArch Studio',
    kind: 'core',
    visibility: 'public',
    maturity: 'ACTIVE',
    role: 'Local orchestration, observability, and safety control room',
    repository: 'https://github.com/VoidArch-Labs/voidarch-studio',
    summary:
      'Runs and supervises coding-agent sessions across repositories, worktrees, and interactive terminals while keeping process ownership in a local daemon.',
    implemented: [
      'Daemon-owned PTY sessions for Claude Code, Codex CLI, and shell profiles',
      'Session input, resize, signal, kill, respawn, and WebSocket xterm.js attachment',
      'Git worktree creation, diff inspection, and guarded deletion',
      'Run records, transcripts, persisted orphan-session metadata, and repository-scoped state',
      'Fail-closed safety hooks for protected files, dangerous shell, and write-capable MCP operations',
      'Thin Tauri v2 desktop shell over the localhost daemon/dashboard'
    ],
    verification: [
      'CI starts the real daemon, loads the dashboard in headless Chromium, and verifies principal panels and API contracts',
      'Independent safety-hook fixture harness plus Rust tests and Linux Tauri compilation'
    ],
    contributes: ['Studio', 'Policy Gate', 'Evidence']
  },
  {
    id: 'agentsec',
    title: 'AgentSec Suite',
    kind: 'supporting',
    visibility: 'public',
    maturity: 'ACTIVE',
    role: 'Deterministic inspection, approval, and visibility for agent actions',
    repository: 'https://github.com/VoidArch-Labs/AgentSec',
    summary:
      'A deployed security reference that turns agent actions into deterministic allow, block, or requires_approval decisions and preserves the audit trail.',
    implemented: [
      'PromptShield deterministic prompt-pattern scanning',
      'MCP Guard Lite declared-capability and missing-control analysis',
      'AgentMap inventory and deterministic readiness/risk scoring',
      'ApproveOps human approval queue with persisted decision events',
      'Runtime inspection API with deterministic risk, policy, and audit engines'
    ],
    verification: [
      'Vitest, TypeScript, lint, production build, and deployed Chromium route smoke tests run in CI'
    ],
    contributes: ['Policy Gate', 'Evidence', 'Tool governance']
  },
  {
    id: 'saas-core',
    title: 'saas-core',
    kind: 'supporting',
    visibility: 'public',
    maturity: 'ACTIVE',
    role: 'Module contracts, presets, and product-scaffolding factory',
    repository: 'https://github.com/VoidArch-Labs/saas-core',
    summary:
      'Reusable engineering infrastructure that separates product selection from implementation with module metadata, dependency contracts, environment planning, dry-run generation, and machine-readable docs.',
    implemented: [
      'Module registry with dependencies, environment requirements, and generated contracts',
      'Preset-driven product selection and environment planning',
      'No-write product planning plus rendered scaffolds',
      'Machine-readable documentation contracts and stale-contract CI checks',
      'Reference Next.js application covering shared auth, DB, billing, jobs, file, AI, and security adapters'
    ],
    verification: [
      'CI validates contracts, registry consistency, mock environment planning, dry-run generation, tests, TypeScript, lint, and a production build'
    ],
    contributes: ['Capability metadata', 'Contracts', 'Reusable primitives']
  }
] as const;

export const VOIDARCH_LAB_SIGNALS: readonly VoidArchLabSignal[] = [
  {
    domain: 'Code review',
    experiment: 'AI PR review and feedback',
    recurringSystems:
      'GitHub events → repository context → structured analysis → review artifact',
    extractedPrimitive: 'Repository ingestion and evidence-backed output'
  },
  {
    domain: 'Documentation',
    experiment: 'Source-aware documentation generation',
    recurringSystems:
      'Repository scan → language-aware source extraction → generated docs → freshness loop',
    extractedPrimitive: 'Code graph and context assembly'
  },
  {
    domain: 'Scope verification',
    experiment: 'Ticket-versus-diff compliance',
    recurringSystems:
      'Intent source + implementation diff → comparison → score → merge signal',
    extractedPrimitive: 'Intent-to-execution verification'
  },
  {
    domain: 'Technical debt',
    experiment: 'Debt scanning and cost tracking',
    recurringSystems:
      'Scheduled scans → persistent findings → temporal trends → alerts',
    extractedPrimitive: 'Durable evidence and run history'
  },
  {
    domain: 'Meeting economics',
    experiment: 'Calendar-driven cost receipts',
    recurringSystems:
      'External events → enrichment → scheduled processing → delivered artifact',
    extractedPrimitive: 'Event-driven workflows and external state'
  },
  {
    domain: 'Cloud analysis',
    experiment: 'Multi-cloud waste classification',
    recurringSystems:
      'Heterogeneous inputs → normalization → prioritization → action guidance',
    extractedPrimitive: 'Capability normalization and routing'
  },
  {
    domain: 'Proposal analytics',
    experiment: 'Buyer-engagement telemetry',
    recurringSystems:
      'Event stream → persisted timeline → behavior signals → decision support',
    extractedPrimitive: 'Observability and evidence timelines'
  }
] as const;

export const VOIDARCH_NODES: readonly VoidArchNode[] = [
  {
    id: 'context',
    title: 'Context',
    group: 'core',
    maturity: 'WORKING',
    summary:
      'Persistent memory, retrieval, state, compression, and provenance for long-running work.',
    position: { x: 600, y: 225 },
    role: 'Continuity and working-context assembly',
    owns: 'memory retrieval, working state, compression, provenance',
    connects: 'Memory Fabric → Router',
    bullets: [
      'Composes the smallest useful working set for each execution.',
      'Separates durable memory from temporary task context.',
      'Keeps provenance attached so remembered state can be challenged.'
    ]
  },
  {
    id: 'memory',
    title: 'Memory Fabric',
    group: 'support',
    maturity: 'WORKING',
    summary:
      'Durable entities, episodic observations, tasks, blockers, and provenance behind Context.',
    position: { x: 560, y: 650 },
    role: 'Durable memory substrate',
    owns: 'entities, episodes, tasks, blockers, relations, provenance',
    connects: 'Memory Fabric → Context',
    bullets: [
      'Stores different memory kinds with different lifecycles.',
      'Represents relationships explicitly instead of flattening everything into transcripts.',
      'Preserves state independently of one model session.'
    ]
  },
  {
    id: 'models',
    title: 'Models',
    group: 'input',
    maturity: 'ACTIVE',
    summary:
      'Fast, reasoning, and specialist inference targets exposed as routable capabilities.',
    position: { x: 850, y: 145 },
    role: 'Inference capability pool',
    owns: 'latency, cost, reasoning, specialization profiles',
    connects: 'Models → Router / Studio',
    bullets: [
      'Keeps model choice outside hard-coded workflow logic.',
      'Allows cheap routers and specialists to coexist with frontier reasoning models.',
      'Exposes capability and cost tradeoffs to routing policy.'
    ]
  },
  {
    id: 'router',
    title: 'Router',
    group: 'core',
    maturity: 'PROTOTYPE',
    summary:
      'Intent-aware tool, model, and execution-path selection under capability, cost, latency, and policy constraints.',
    position: { x: 915, y: 430 },
    role: 'Intent and capability-aware decision layer',
    owns: 'tool/model selection, confidence, constraints, fallback policy',
    connects: 'Context + Models + Tools + Policy → Studio',
    bullets: [
      'Makes route choice inspectable instead of burying it in glue code.',
      'Can combine deterministic policy with narrow learned routing.',
      'Escalates or falls back when confidence is too low.'
    ]
  },
  {
    id: 'tools',
    title: 'Tools',
    group: 'input',
    maturity: 'ACTIVE',
    summary:
      'Search, code, files, APIs, and services presented as governed capabilities rather than prompt conventions.',
    position: { x: 820, y: 735 },
    role: 'External capability surface',
    owns: 'search, code, files, services, APIs',
    connects: 'Tools → Router / Studio',
    bullets: [
      'Keeps deterministic work deterministic when reasoning is unnecessary.',
      'Allows tool interfaces to be versioned, routed, and policy-gated.',
      'Supports equivalent capabilities from multiple providers.'
    ]
  },
  {
    id: 'studio',
    title: 'Studio',
    group: 'core',
    maturity: 'ACTIVE',
    summary:
      'Observable orchestration, execution traces, control surfaces, and operator intervention for agentic work.',
    position: { x: 1190, y: 235 },
    role: 'Observable execution and operation',
    owns: 'workflow runtime, traces, evaluation surfaces, operator control',
    connects: 'Router + Policy → Evidence',
    bullets: [
      'Runs and inspects agent and workflow execution.',
      'Surfaces failures, workers, traces, and control state.',
      'Uses Hermes only as an external testbed and integration surface.'
    ]
  },
  {
    id: 'policy',
    title: 'Policy Gate',
    group: 'support',
    maturity: 'PROTOTYPE',
    summary:
      'Approvals, risk thresholds, guardrails, and halt conditions informed by working Studio hooks and AgentSec policy primitives.',
    position: { x: 1200, y: 520 },
    role: 'Constraint and approval surface',
    owns: 'risk thresholds, approvals, guardrails, stop conditions',
    connects: 'Router → Policy → Studio / Evidence',
    bullets: [
      'Separates capability from permission.',
      'Can halt or escalate low-confidence side-effecting routes.',
      'Adds policy decisions to execution evidence.'
    ]
  },
  {
    id: 'evidence',
    title: 'Evidence',
    group: 'output',
    maturity: 'PROTOTYPE',
    summary:
      'Run records, transcripts, audit events, verification markers, artifacts, and state deltas moving toward one unified evidence layer.',
    position: { x: 1310, y: 700 },
    role: 'Durable proof of execution',
    owns: 'trace records, evaluations, artifacts, state deltas',
    connects: 'Studio + Policy → Evidence → Context',
    bullets: [
      'Links final output back to the route and context that produced it.',
      'Supports replay, debugging, and verification.',
      'Feeds useful state back into future work.'
    ]
  }
] as const;

export const VOIDARCH_EDGES: readonly VoidArchEdge[] = [
  { id: 'memory-context', source: 'memory', target: 'context' },
  { id: 'context-router', source: 'context', target: 'router' },
  { id: 'models-router', source: 'models', target: 'router' },
  { id: 'tools-router', source: 'tools', target: 'router' },
  { id: 'router-policy', source: 'router', target: 'policy' },
  { id: 'router-studio', source: 'router', target: 'studio' },
  { id: 'policy-studio', source: 'policy', target: 'studio' },
  { id: 'studio-evidence', source: 'studio', target: 'evidence' },
  { id: 'evidence-context', source: 'evidence', target: 'context' }
] as const;

export const VOIDARCH_RESEARCH_ROUTE: readonly VoidArchRouteStep[] = [
  {
    node: 'context',
    edge: 'context-router',
    message: 'context assembled — ranked repository state + token budget'
  },
  {
    node: 'router',
    edge: 'models-router',
    message: 'route selected — research workflow + prerequisite preflight'
  },
  {
    node: 'models',
    edge: 'models-router',
    message: 'model selected — capability target declared by route plan'
  },
  {
    node: 'tools',
    edge: 'tools-router',
    message: 'tools selected — search + source inspection capabilities'
  },
  {
    node: 'studio',
    edge: 'router-studio',
    message: 'studio executing — daemon session + transcript capture'
  },
  {
    node: 'evidence',
    edge: 'studio-evidence',
    message: 'evidence persisted — run record + verification markers'
  }
] as const;

export const VOIDARCH_EVIDENCE: Readonly<
  Record<'context' | 'router' | 'studio', readonly VoidArchEvidenceItem[]>
> = {
  context: [
    {
      id: 'consumer-smoke',
      label: 'Packed consumer smoke test',
      summary:
        'CI packs VoidArch Context, installs the tarball into a fresh temporary Git repository, and exercises the shipped CLI rather than only testing workspace source.',
      maturity: 'WORKING'
    },
    {
      id: 'retrieval-stack',
      label: 'SurrealKV + BM25 + code graph',
      summary:
        'Embedded SurrealKV, immediate BM25 retrieval, and Tree-sitter symbol/import relationships form the local-first retrieval stack.',
      maturity: 'WORKING'
    },
    {
      id: 'context-pack',
      label: 'Token-budgeted context packs',
      summary:
        'The CLI emits Markdown or machine-readable JSON context packs with estimated token-budget metadata.',
      maturity: 'WORKING'
    }
  ],
  router: [
    {
      id: 'offline-routing',
      label: 'Offline route fixtures',
      summary:
        'Complete and constrained environment fixtures exercise task classification, preflight, trusted implementation resolution, blocked routes, and required-input outcomes.',
      maturity: 'PROTOTYPE'
    },
    {
      id: 'trust-resolution',
      label: 'Trust-aware capability resolution',
      summary:
        'Resolution prefers built-in, official, reviewed internal, and audited external implementations; indexed-unreviewed entries remain discoverable but cannot execute.',
      maturity: 'PROTOTYPE'
    },
    {
      id: 'prepared-context',
      label: 'PreparedContextRequest',
      summary:
        'The progressive-loading contract moves from compact metadata to one selected workflow and only then requests detailed instructions for chosen implementations.',
      maturity: 'PROTOTYPE'
    }
  ],
  studio: [
    {
      id: 'daemon-browser-ci',
      label: 'Real daemon + Chromium CI',
      summary:
        'CI starts the actual localhost Studio server, waits for API state, loads the dashboard in headless Chromium, verifies panels and contracts, and retains visual artifacts.',
      maturity: 'ACTIVE'
    },
    {
      id: 'session-engine',
      label: 'PTY + worktree session engine',
      summary:
        'Daemon-owned PTYs, WebSocket terminal attachment, worktree lifecycle operations, transcripts, and orphan-session metadata are implemented.',
      maturity: 'ACTIVE'
    },
    {
      id: 'safety-hooks',
      label: 'Fail-closed hook harness',
      summary:
        'Deterministic hooks gate protected files, dangerous shell commands, write-capable MCP actions, approvals, and unverified changed work; Tauri shell compilation is verified independently.',
      maturity: 'ACTIVE'
    }
  ]
} as const;

export function getVoidArchNode(id: VoidArchNodeId): VoidArchNode {
  const node = VOIDARCH_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Unknown VoidArch node: ${id}`);
  return node;
}

export function getArchitectureManifest() {
  return {
    name: 'VoidArch',
    maturityLegend: [...VOIDARCH_MATURITY],
    nodes: VOIDARCH_NODES,
    edges: VOIDARCH_EDGES,
    routes: {
      research: VOIDARCH_RESEARCH_ROUTE
    },
    projects: VOIDARCH_PROJECTS,
    labSignals: VOIDARCH_LAB_SIGNALS
  } as const;
}

export function getEvidenceManifest() {
  return {
    name: 'VoidArch',
    evidence: VOIDARCH_EVIDENCE
  } as const;
}
