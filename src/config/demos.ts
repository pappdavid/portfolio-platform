// Demo integration registry.
//
// Maps each job-type profile to the vendored portfolio demos embedded as
// static iframes under public/demos/<slug>/ (see demos.lock.json at the repo
// root for the exact vendored commit of each bundle). Every profile gets ALL
// THREE demos; order here is display order and the first entry is the
// featured demo for that profile.
//
// Honesty guardrails apply: demo descriptions state what the demo IS, never
// invented clients or metrics. Anything simulated inside a demo is labelled
// illustrative by the demo itself.

export interface DemoEntry {
  /** Directory name under public/demos/ and slug in demos.lock.json. */
  slug: 'self-interview' | 'task-to-flow' | 'rolefit-quiz';
  title: string;
  /** One honest line about what the demo shows. */
  description: string;
}

export const DEMOS: Record<DemoEntry['slug'], DemoEntry> = {
  'self-interview': {
    slug: 'self-interview',
    title: 'Self-Interview',
    description:
      'An interactive chat where the site interviews David — deterministic answers over verified facts only.'
  },
  'task-to-flow': {
    slug: 'task-to-flow',
    title: 'Task-to-Flow',
    description:
      'Describe a task and watch an illustrative automation workflow assemble, with assumption-based effort estimates.'
  },
  'rolefit-quiz': {
    slug: 'rolefit-quiz',
    title: 'Fit-Finder',
    description:
      'A short quiz that maps your context to an industry lens and suggests which work fits — illustrative, not a scored assessment.'
  }
};

const CANONICAL_ORDER: DemoEntry['slug'][] = [
  'self-interview',
  'task-to-flow',
  'rolefit-quiz'
];

/** Ordered demos per rolegroup id (first entry = featured). */
export const DEMOS_BY_ROLE: Record<string, DemoEntry['slug'][]> = {
  'ai-engineering': ['self-interview', 'task-to-flow', 'rolefit-quiz'],
  'ai-integration': ['task-to-flow', 'self-interview', 'rolefit-quiz'],
  automation: ['task-to-flow', 'self-interview', 'rolefit-quiz'],
  'product-engineering': ['rolefit-quiz', 'self-interview', 'task-to-flow']
};

/**
 * Ordered demo entries for a rolegroup id. Unknown ids fall back to the
 * canonical order so the strip degrades gracefully instead of disappearing.
 */
export function getDemosForRole(
  roleId: string | null | undefined
): DemoEntry[] {
  const slugs = (roleId && DEMOS_BY_ROLE[roleId]) || CANONICAL_ORDER;
  return slugs.map((slug) => DEMOS[slug]);
}
