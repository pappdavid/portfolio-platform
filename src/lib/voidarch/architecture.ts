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

export interface VoidArchNode {
  id: VoidArchNodeId;
  title: string;
  group: VoidArchGroup;
  maturity: VoidArchMaturity;
  summary: string;
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

export const VOIDARCH_NODES: readonly VoidArchNode[] = [
  {
    id: 'context',
    title: 'Context',
    group: 'core',
    maturity: 'WORKING',
    summary:
      'Persistent memory, retrieval, state, compression, and provenance for long-running work.'
  },
  {
    id: 'memory',
    title: 'Memory Fabric',
    group: 'support',
    maturity: 'WORKING',
    summary:
      'Durable entities, episodic observations, tasks, blockers, and provenance behind Context.'
  },
  {
    id: 'models',
    title: 'Models',
    group: 'input',
    maturity: 'ACTIVE',
    summary:
      'Fast, reasoning, and specialist inference targets exposed as routable capabilities.'
  },
  {
    id: 'router',
    title: 'Router',
    group: 'core',
    maturity: 'PROTOTYPE',
    summary:
      'Intent-aware tool, model, and execution-path selection under capability, cost, latency, and policy constraints.'
  },
  {
    id: 'tools',
    title: 'Tools',
    group: 'input',
    maturity: 'ACTIVE',
    summary:
      'Search, code, files, APIs, and services presented as governed capabilities rather than prompt conventions.'
  },
  {
    id: 'studio',
    title: 'Studio',
    group: 'core',
    maturity: 'ACTIVE',
    summary:
      'Observable orchestration, execution traces, control surfaces, and operator intervention for agentic work.'
  },
  {
    id: 'policy',
    title: 'Policy Gate',
    group: 'support',
    maturity: 'PLANNED',
    summary:
      'Approvals, risk thresholds, guardrails, and halt conditions separated from raw capability.'
  },
  {
    id: 'evidence',
    title: 'Evidence',
    group: 'output',
    maturity: 'PLANNED',
    summary:
      'Traces, evaluations, artifacts, and state deltas that make execution inspectable and replayable.'
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
    edges: VOIDARCH_EDGES
  } as const;
}

export function getEvidenceManifest() {
  return {
    name: 'VoidArch',
    evidence: VOIDARCH_EVIDENCE
  } as const;
}
