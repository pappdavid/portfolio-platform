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

export const VOIDARCH_NODES: readonly VoidArchNode[] = [
  {
    id: 'context',
    title: 'Context',
    group: 'core',
    maturity: 'WORKING',
    summary:
      'Persistent memory, retrieval, state, compression, and provenance for long-running work.',
    position: { x: 380, y: 220 },
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
    position: { x: 300, y: 660 },
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
    position: { x: 760, y: 150 },
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
    position: { x: 790, y: 430 },
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
    position: { x: 730, y: 735 },
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
    position: { x: 1180, y: 240 },
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
    maturity: 'PLANNED',
    summary:
      'Approvals, risk thresholds, guardrails, and halt conditions separated from raw capability.',
    position: { x: 1240, y: 525 },
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
    maturity: 'PLANNED',
    summary:
      'Traces, evaluations, artifacts, and state deltas that make execution inspectable and replayable.',
    position: { x: 1450, y: 720 },
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
    message: 'context assembled — relevant memory + constraints'
  },
  {
    node: 'router',
    edge: 'models-router',
    message: 'route selected — research_query / low side-effect risk'
  },
  {
    node: 'models',
    edge: 'models-router',
    message: 'model selected — reasoning-capable target'
  },
  {
    node: 'tools',
    edge: 'tools-router',
    message: 'tools selected — search + source inspection'
  },
  {
    node: 'studio',
    edge: 'router-studio',
    message: 'studio executing — trace capture enabled'
  },
  {
    node: 'evidence',
    edge: 'studio-evidence',
    message: 'evidence persisted — grounded / state delta +2'
  }
] as const;

export const VOIDARCH_EVIDENCE: Readonly<
  Record<'context' | 'router' | 'studio', readonly VoidArchEvidenceItem[]>
> = {
  context: [
    {
      id: 'memory-graph',
      label: 'Memory graph',
      summary:
        'Multi-level memory entities and relationships exposed as an inspectable systems view.',
      maturity: 'WORKING'
    },
    {
      id: 'context-engine',
      label: 'Context engine',
      summary:
        'Retrieval and working-context assembly that avoids replaying the full history on every turn.',
      maturity: 'WORKING'
    },
    {
      id: 'persistence-checks',
      label: 'Persistence checks',
      summary:
        'Verification that useful state survives individual sessions and executions.',
      maturity: 'WORKING'
    }
  ],
  router: [
    {
      id: 'capability-routing',
      label: 'Capability routing',
      summary:
        'Explicit model/tool selection informed by capability, cost, latency, and policy.',
      maturity: 'PROTOTYPE'
    },
    {
      id: 'router-model',
      label: 'Specialist router model',
      summary:
        'Planned narrow model specialization for high-volume tool and model selection.',
      maturity: 'PLANNED'
    },
    {
      id: 'route-evaluation',
      label: 'Route evaluation',
      summary:
        'Planned held-out evaluation of valid-route rate, accuracy, fallback rate, and effective cost.',
      maturity: 'PLANNED'
    }
  ],
  studio: [
    {
      id: 'control-plane',
      label: 'Control plane',
      summary:
        'Operational surface for workers, task state, traces, and system control.',
      maturity: 'ACTIVE'
    },
    {
      id: 'execution-traces',
      label: 'Execution traces',
      summary:
        'Run-level evidence covering tool calls, fallbacks, verification results, and state changes.',
      maturity: 'PROTOTYPE'
    },
    {
      id: 'hermes-testbed',
      label: 'Hermes external testbed',
      summary:
        'Hermes is an external testbed and integration surface used to pressure-test VoidArch behavior; it is not VoidArch core ownership.',
      maturity: 'EXTERNAL'
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
    }
  } as const;
}

export function getEvidenceManifest() {
  return {
    name: 'VoidArch',
    evidence: VOIDARCH_EVIDENCE
  } as const;
}
