// Per-job-type site variants.
//
// Each profile re-presents the SAME verified portfolio facts through a
// different lens for a class of roles. Nothing here may introduce claims that
// are not already grounded in src/lib/ama/corpus.ts — this file is scanned by
// scripts/portfolio-regression-checks.mjs as recruiter-facing content.
//
// Usage: davidpapp.dev/?role=ai-engineering (&role=ai-integration|automation|
// product-engineering). An unknown or missing ?role= renders the general site.

import { buildReferralPresentation } from '@/lib/referral-personalization';
import type { ReferralPersonalizationSnapshot } from '@/lib/referral-personalization';

export const JOB_TYPE_QUERY_PARAM = 'role';

export type JobTypeId =
  | 'ai-engineering'
  | 'ai-integration'
  | 'automation'
  | 'product-engineering';

export interface JobTypeProfile {
  id: JobTypeId;
  /** Short human label, e.g. "AI Engineering". */
  label: string;
  /** Used in the <title> of the personalized page. */
  metaTitle: string;
  /** Replaces the hero role line ("AI solution developer" by default). */
  heroRole: string;
  /** Hero tagline shown when no referral override exists. */
  heroTag: string;
  /** Replaces the FOCUS row in the status table. */
  focusLine: string;
  /** Extra skills-section paragraph framing the profile. */
  pitch: string;
  /** Label of the projects CTA button. */
  projectsCta: string;
  /** Assistant greeting and status chip for this profile. */
  chatGreeting: string;
  chatContextLabel: string;
  /** Chat suggestion chips. */
  suggestions: string[];
  /** Canonical project names moved to the top of the filesystem table. */
  featuredProjects: string[];
}

/** The only project names a profile may feature (regression-guarded). */
export const CANONICAL_PROJECT_NAMES = [
  'VoidArch Context',
  'VoidArch Studio',
  'AgentSec Suite',
  'saas-core'
] as const;

export const JOB_TYPES: Record<JobTypeId, JobTypeProfile> = {
  'ai-engineering': {
    id: 'ai-engineering',
    label: 'AI Engineering',
    metaTitle: 'AI Engineering — David Papp',
    heroRole: 'AI engineer',
    heroTag:
      'Engineering AI systems end to end — professional LLM delivery backed by hands-on agent infrastructure.',
    focusLine: 'llm systems · agents · rag · typescript',
    pitch:
      'Tuned for AI engineering roles: professional delivery covers LLM API integration, prompt and context engineering, and backend logic for ERP-integrated systems, while personal lab work goes deep on local-first context infrastructure (VoidArch Context), agent orchestration (VoidArch Studio), and fail-closed security hooks (AgentSec). VU Amsterdam coursework adds machine learning, computational linguistics, and multi-agent systems underneath.',
    projectsCta: '[engineering projects]',
    chatGreeting:
      "Session active. Tuned for AI engineering roles — ask about David's professional LLM delivery, the retrieval design behind this assistant, or the VoidArch agent stack.",
    chatContextLabel: 'context: reviewed_kb + ai-engineering profile',
    suggestions: [
      'what LLM work has David done professionally?',
      'how does the retrieval in this assistant work?',
      'tell me about VoidArch Context',
      "what ML fundamentals does David study at VU?"
    ],
    featuredProjects: ['VoidArch Context', 'VoidArch Studio', 'AgentSec Suite']
  },
  'ai-integration': {
    id: 'ai-integration',
    label: 'AI Solutions & Integration',
    metaTitle: 'AI Solutions & Integration — David Papp',
    heroRole: 'AI solutions & integration developer',
    heroTag:
      'Taking AI into ERP-integrated business systems — discovery, solution design, delivery.',
    focusLine: 'erp integrations · llm apis · solution design · delivery',
    pitch:
      "Tuned for solutions and integration roles: at WEBINFORM IT Ltd David builds internal AI tools and production LLM functionality for web applications and ERP-integrated systems — 20+ delivered websites/webshops, three internal systems, one user-facing platform, and two ERP/AI integration projects with direct involvement in discovery, requirements, solution design, client coordination, proposals, and pricing. Repairing an inherited AI-first service cut its LLM API costs by roughly 40%.",
    projectsCta: '[delivery case studies]',
    chatGreeting:
      'Session active. Tuned for solutions and integration roles — ask how David runs an ERP + AI integration project or what he delivered at WEBINFORM.',
    chatContextLabel: 'context: reviewed_kb + solutions profile',
    suggestions: [
      'what did David build at WEBINFORM?',
      'how does David run an ERP + AI integration project?',
      'which stack does David deliver with?',
      'is David available for full-time work?'
    ],
    featuredProjects: ['saas-core', 'VoidArch Context', 'AgentSec Suite']
  },
  automation: {
    id: 'automation',
    label: 'Workflow Automation',
    metaTitle: 'Workflow Automation — David Papp',
    heroRole: 'AI automation developer',
    heroTag:
      'Automating real workflows with LLM APIs, event glue, and fail-closed guardrails.',
    focusLine: 'workflow automation · llm apis · policy hooks',
    pitch:
      'Tuned for automation roles: professional work spans APIs, backend logic, and automation for web applications and ERP-integrated systems, plus Playwright-based pre-release testing at 4iG. In the lab, the AgentSec hook pack gates Claude Code and Codex tool calls with safe-command fast paths and observe/prompt/enforce modes, and saas-core turns typed presets into validated builds through scripted CI workflows.',
    projectsCta: '[automation work]',
    chatGreeting:
      "Session active. Tuned for automation roles — ask what David has automated in client delivery or how his hook pack gates agent tool calls.",
    chatContextLabel: 'context: reviewed_kb + automation profile',
    suggestions: [
      'what has David automated in client delivery?',
      'how does the hook pack gate agent tool calls?',
      "what's in David's automation stack?",
      'tell me about ApproveOps'
    ],
    featuredProjects: ['AgentSec Suite', 'saas-core', 'VoidArch Studio']
  },
  'product-engineering': {
    id: 'product-engineering',
    label: 'Product Engineering',
    metaTitle: 'Product Engineering — David Papp',
    heroRole: 'product-minded AI developer',
    heroTag:
      'Shipping user-facing AI products end to end — data, APIs, interface.',
    focusLine: 'user-facing ai · next.js · end-to-end delivery',
    pitch:
      'Tuned for product engineering roles: David ships user-facing AI interfaces and platforms — 20+ delivered websites/webshops and a user-facing platform at WEBINFORM, plus public prototypes like the integrated AgentSec suite. Delivery stack: Next.js, TypeScript, Prisma, Clerk, Supabase, Tailwind. Personal projects are presented honestly as prototypes; production experience comes from client delivery.',
    projectsCta: '[shipped products]',
    chatGreeting:
      'Session active. Tuned for product engineering roles — ask which products David has shipped or open the live AgentSec demo.',
    chatContextLabel: 'context: reviewed_kb + product profile',
    suggestions: [
      'which products has David shipped?',
      'is there a live demo I can open?',
      'what does the delivery stack look like?',
      'what did David build at WEBINFORM?'
    ],
    featuredProjects: ['AgentSec Suite', 'saas-core', 'VoidArch Context']
  }
};

const JOB_TYPE_ALIASES: Record<JobTypeId, string[]> = {
  'ai-engineering': [
    'ai engineering',
    'ai engineer',
    'ml engineer',
    'machine learning',
    'llm',
    'ai development',
    'applied ai'
  ],
  'ai-integration': [
    'ai integration',
    'ai solutions',
    'ai solutions and integration',
    'solutions',
    'solution engineer',
    'solutions architect',
    'integration',
    'erp',
    'consultant'
  ],
  automation: [
    'automation',
    'workflow automation',
    'rpa',
    'ops automation',
    'business automation'
  ],
  'product-engineering': [
    'product engineering',
    'product engineer',
    'product',
    'fullstack',
    'full-stack',
    'frontend'
  ]
};

function normalizeJobTypeInput(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\/+$/, '');
}

/**
 * Resolve a free-form job-type identifier (URL param, query, label) to a
 * profile. Returns null when nothing matches — callers must fall back to the
 * general site, never guess.
 */
export function resolveJobType(input: unknown): JobTypeProfile | null {
  if (typeof input !== 'string') return null;
  const normalized = normalizeJobTypeInput(input);
  if (!normalized) return null;

  const direct = normalized.replace(/ /g, '-') as JobTypeId;
  if (direct in JOB_TYPES) return JOB_TYPES[direct];

  for (const [id, aliases] of Object.entries(JOB_TYPE_ALIASES) as [
    JobTypeId,
    string[]
  ][]) {
    const candidates = [id.replace(/-/g, ' '), ...aliases];
    if (candidates.some((alias) => alias === normalized)) {
      return JOB_TYPES[id];
    }
  }
  return null;
}

export function resolveJobTypeFromSearchParams(
  searchParams: Record<
    string,
    string | readonly string[] | undefined
  > | null | undefined
): JobTypeProfile | null {
  if (!searchParams) return null;
  const raw = searchParams[JOB_TYPE_QUERY_PARAM];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === 'string' ? resolveJobType(value) : null;
}

/** Baseline strings that keep the no-profile site identical to today's. */
export const DEFAULT_HERO_ROLE = 'AI solution developer';
export const DEFAULT_FOCUS_LINE = 'ai agents · rag · solution dev';
export const DEFAULT_SUGGESTIONS = [
  'is David available to start?',
  "what is David's tech stack?",
  'what did David build at WEBINFORM?',
  'tell me about AgentSec Suite'
];

export interface JobTypeSiteView {
  profile: JobTypeProfile | null;
  heroRole: string;
  heroTag: string;
  focusLine: string;
  projectsCta: string;
  target?: string;
  roleFocus?: string;
  chatGreeting: string;
  chatContextLabel: string;
  suggestions: string[];
}

/**
 * Merge a job-type profile with the referral snapshot (when a recruiter
 * arrived through a tracked link) into the single presentation object the
 * landing page consumes. Referral copy stays the most specific override;
 * otherwise the job-type profile shapes hero, focus, chat, and CTAs. With
 * neither, every value equals the current general-site output.
 */
export function getJobTypeSiteView(
  jobType: JobTypeProfile | null | undefined,
  referral: ReferralPersonalizationSnapshot | null | undefined
): JobTypeSiteView {
  const base = buildReferralPresentation(referral ?? null);

  if (!jobType) {
    return {
      profile: null,
      heroRole: DEFAULT_HERO_ROLE,
      heroTag: base.heroTag,
      focusLine: DEFAULT_FOCUS_LINE,
      projectsCta: base.projectsCta,
      target: base.target,
      roleFocus: base.roleFocus,
      chatGreeting: base.chatGreeting,
      chatContextLabel: base.chatContextLabel,
      suggestions: DEFAULT_SUGGESTIONS
    };
  }

  const fromReferral = referral ? base : null;
  return {
    profile: jobType,
    heroRole: jobType.heroRole,
    heroTag: fromReferral?.heroTag ?? jobType.heroTag,
    focusLine: jobType.focusLine,
    projectsCta: fromReferral?.projectsCta ?? jobType.projectsCta,
    target: base.target,
    roleFocus: base.roleFocus,
    chatGreeting: fromReferral?.chatGreeting ?? jobType.chatGreeting,
    chatContextLabel:
      fromReferral?.chatContextLabel ?? jobType.chatContextLabel,
    suggestions: jobType.suggestions
  };
}

/**
 * Order projects so referral-featured names come first, then job-type
 * featured names, then everything else in original order. Unknown names are
 * ignored, and ties never reorder the curated list.
 */
export function prioritizeProjects<T extends { name: string }>(
  projects: readonly T[],
  options: {
    jobType?: JobTypeProfile | null;
    referral?: ReferralPersonalizationSnapshot | null;
  } = {}
): T[] {
  const { jobType, referral } = options;

  const tierOf = (item: T): number => {
    const name = item.name.toLowerCase();
    const referralIndex =
      referral?.featuredProjects?.findIndex(
        (n) => n.toLowerCase() === name
      ) ?? -1;
    if (referralIndex !== -1) return referralIndex;
    const jobTypeIndex = jobType
      ? jobType.featuredProjects.findIndex((n) => n.toLowerCase() === name)
      : -1;
    if (jobTypeIndex !== -1) return 100 + jobTypeIndex;
    return Number.MAX_SAFE_INTEGER;
  };

  return [...projects]
    .map((project, index) => ({ project, index }))
    .sort(
      (a, b) => tierOf(a.project) - tierOf(b.project) || a.index - b.index
    )
    .map(({ project }) => project);
}
