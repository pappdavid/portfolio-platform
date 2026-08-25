/**
 * Deterministic assistant intents for the demo merge: the Self-Interview,
 * RoleFit quiz, and Task-to-Flow experiences ported into the site chat as
 * SSE `card` frames. Everything here is static and corpus-grounded — no
 * network calls, no keys, no LLM synthesis. The `/api/chat` route resolves
 * these tokens BEFORE any retrieval or model call happens.
 *
 * Honesty rules inherited from the repo contract:
 * - only facts present in src/lib/ama/corpus.ts
 * - "roughly 40%" stays approximate; prototypes never "production systems"
 * - the flow diagram below is an illustrative example, labelled as such
 */

export type CardKind = 'interview' | 'quiz' | 'flow';

export type RoleGroupId =
  | 'ai-engineering'
  | 'ai-integration'
  | 'automation'
  | 'product-engineering';

/* ------------------------------------------------------------------ */
/* Self-Interview: nine deterministic steps                            */
/* ------------------------------------------------------------------ */

export interface InterviewStep {
  question: string;
  answer: string;
  receipt: string[];
}

export const INTERVIEW_SCRIPT: InterviewStep[] = [
  {
    question: 'Who are you, in one minute?',
    answer:
      "I'm Dávid Papp — a software engineer based in Rotterdam, NL, with a BSc from VU Amsterdam. Since October 2024 I've worked at WEBINFORM on ERP and AI integration projects, coordinating work from discovery through pricing.",
    receipt: ['Rotterdam, NL', 'VU Amsterdam BSc', 'WEBINFORM since Oct 2024']
  },
  {
    question: 'What does your day job actually look like?',
    answer:
      'At WEBINFORM I move between discovery, requirements, solution design, client communication, proposals, and pricing on ERP/AI integration projects. I translate between non-technical stakeholders and the engineering that follows.',
    receipt: ['Discovery → pricing', 'Client-facing', 'ERP/AI integration']
  },
  {
    question: 'What have you shipped professionally?',
    answer:
      'At WEBINFORM: 20+ delivered websites/webshops, three internal systems, one user-facing platform, and two ERP/AI integration projects. Earlier at 4iG I coordinated cross-team incident handling.',
    receipt: ['20+ deliveries', '2 ERP/AI integrations', '4iG incidents']
  },
  {
    question: 'Tell me about the AI cost-fix story.',
    answer:
      'I inherited an AI-first service that had drifted out of control and repaired it, cutting its LLM API costs by roughly 40%. It is an approximate professional result on a production service at WEBINFORM — not a lab benchmark.',
    receipt: ['~40% LLM cost cut', 'Inherited service repaired']
  },
  {
    question: "What's real versus prototype in your portfolio?",
    answer:
      'Professional WEBINFORM work is production client delivery. My personal projects — VoidArch Context, VoidArch Studio, AgentSec Suite, saas-core — are engineering prototypes and showcases: tested, documented, but not commercial products and not production systems with customers.',
    receipt: ['Job = production', 'Personal = prototypes']
  },
  {
    question: 'How do you think about safety and guardrails?',
    answer:
      'My AgentSec hook pack implements fail-closed guardrails with observe, prompt, and enforce modes. At 4iG I ran Playwright-based pre-release testing. Safety mechanisms default to blocking, never to hoping.',
    receipt: ['Fail-closed by default', 'Playwright pre-release']
  },
  {
    question: 'Can you work with non-technical people?',
    answer:
      'Most of my week is exactly that: WEBINFORM client coordination, requirements, proposals and pricing — plus teaching programming fundamentals to students aged 10–16 at Logiscool earlier on.',
    receipt: ['Client coordination', 'Taught ages 10–16']
  },
  {
    question: "What's your stack?",
    answer:
      'TypeScript end to end: Next.js, React, Tailwind on the front; Node.js services and Python tooling behind. Personal agent infrastructure is built on the same TypeScript core.',
    receipt: ['Next.js / TS / Tailwind', 'Node.js + Python']
  },
  {
    question: 'Are you available?',
    answer:
      'Yes — available full-time, NL/EU work authorization with no sponsorship required, based in the Rotterdam area, remote/hybrid/on-site. Fastest channel is mailto:contact@davidpapp.dev.',
    receipt: ['Full-time', 'No sponsorship needed', 'contact@davidpapp.dev']
  }
];

/* ------------------------------------------------------------------ */
/* RoleFit quiz: four questions, deterministic scoring                 */
/* ------------------------------------------------------------------ */

export interface QuizChoice {
  id: string;
  label: string;
}

export interface QuizQuestion {
  question: string;
  choices: QuizChoice[];
  /** choice id -> weights per rolegroup */
  weights: Record<string, Partial<Record<RoleGroupId, number>>>;
}

export const QUIZ_SCRIPT: QuizQuestion[] = [
  {
    question: 'What kind of problem should David solve first?',
    choices: [
      { id: 'models', label: 'Wire a product to AI models' },
      { id: 'connect', label: 'Connect AI to our business tools' },
      { id: 'manual', label: 'Kill repetitive manual work' },
      { id: 'product', label: 'Ship and iterate on a web product' }
    ],
    weights: {
      models: { 'ai-engineering': 2 },
      connect: { 'ai-integration': 2 },
      manual: { automation: 2 },
      product: { 'product-engineering': 2 }
    }
  },
  {
    question: 'Where does he create the most value?',
    choices: [
      { id: 'quality', label: 'Making model behaviour reliable' },
      { id: 'adoption', label: 'Getting people to actually use it' },
      { id: 'time', label: 'Giving hours back to the team' },
      { id: 'velocity', label: 'Shortening the build-measure loop' }
    ],
    weights: {
      quality: { 'ai-engineering': 2 },
      adoption: { 'ai-integration': 1, 'product-engineering': 1 },
      time: { automation: 2 },
      velocity: { 'product-engineering': 2 }
    }
  },
  {
    question: 'Which proof point lands best with your stakeholders?',
    choices: [
      { id: 'costfix', label: 'Cut an AI service’s costs by roughly 40%' },
      { id: 'erp', label: 'Two ERP/AI integrations delivered' },
      { id: 'volume', label: '20+ sites and shops shipped' },
      { id: 'safety', label: 'Fail-closed safety hooks by default' }
    ],
    weights: {
      costfix: { 'ai-engineering': 2 },
      erp: { 'ai-integration': 2 },
      volume: { 'product-engineering': 1, automation: 1 },
      safety: { automation: 2 }
    }
  },
  {
    question: 'How does your team prefer to work with him?',
    choices: [
      { id: 'deep', label: 'Deep technical partner' },
      { id: 'bridge', label: 'Bridge to clients and vendors' },
      { id: 'process', label: 'Process and workflow designer' },
      { id: 'build', label: 'Hands-on product builder' }
    ],
    weights: {
      deep: { 'ai-engineering': 2 },
      bridge: { 'ai-integration': 2 },
      process: { automation: 2 },
      build: { 'product-engineering': 2 }
    }
  }
];

export const ROLE_GROUP_LABELS: Record<RoleGroupId, string> = {
  'ai-engineering': 'AI Engineering',
  'ai-integration': 'AI Integration',
  automation: 'Automation',
  'product-engineering': 'Product Engineering'
};

/** Deterministic tally: highest total wins, ties resolve in ROLEGROUP order. */
export function scoreQuiz(answers: string[]): RoleGroupId {
  const totals: Record<RoleGroupId, number> = {
    'ai-engineering': 0,
    'ai-integration': 0,
    automation: 0,
    'product-engineering': 0
  };
  QUIZ_SCRIPT.forEach((q, i) => {
    const picked = answers[i];
    if (!picked) return;
    const w = q.weights[picked];
    if (!w) return;
    for (const [group, weight] of Object.entries(w)) {
      totals[group as RoleGroupId] += weight ?? 0;
    }
  });
  let best: RoleGroupId = 'ai-engineering';
  for (const group of Object.keys(totals) as RoleGroupId[]) {
    if (totals[group] > totals[best]) best = group;
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* Task-to-Flow: one illustrative, deterministic example               */
/* ------------------------------------------------------------------ */

export interface FlowNode {
  id: string;
  label: string;
  type: 'input' | 'work' | 'decision' | 'output';
}

export interface FlowExample {
  nodes: FlowNode[];
  edges: { from: string; to: string }[];
  summary: string;
}

/**
 * Illustrative example mirroring the standalone task-to-flow demo's
 * "client request to delivery" pattern. Static on purpose: the in-chat
 * assistant never generates flows from free text — that lives in the
 * interactive demo at /demos/task-to-flow/.
 */
export const FLOW_EXAMPLE: FlowExample = {
  nodes: [
    { id: 'req', label: 'Collect requirements', type: 'input' },
    { id: 'scope', label: 'Scope + proposal', type: 'work' },
    { id: 'ok', label: 'Client sign-off?', type: 'decision' },
    { id: 'build', label: 'Build + integrate', type: 'work' },
    { id: 'test', label: 'Pre-release testing', type: 'work' },
    { id: 'ship', label: 'Deliver + hand over', type: 'output' }
  ],
  edges: [
    { from: 'req', to: 'scope' },
    { from: 'scope', to: 'ok' },
    { from: 'ok', to: 'build' },
    { from: 'ok', to: 'scope' },
    { from: 'build', to: 'test' },
    { from: 'test', to: 'ship' }
  ],
  summary:
    'Illustrative example of how a client request becomes a delivery at WEBINFORM: discovery feeds scoping and pricing, sign-off gates the build, pre-release testing gates the hand-over.'
};

/* ------------------------------------------------------------------ */
/* Token resolution                                                    */
/* ------------------------------------------------------------------ */

export type DemoIntent =
  | { kind: 'interview'; step: number }
  | { kind: 'quiz'; answered: string[] }
  | { kind: 'flow' };

/** Payload shapes emitted in SSE `card` frames and rendered client-side. */
export type DemoCard =
  | {
      kind: 'interview';
      step: number;
      totalSteps: number;
      question: string;
      answer: string;
      receipt: { label: string }[];
      done: boolean;
    }
  | {
      kind: 'quiz';
      questionIndex: number;
      totalQuestions: number;
      question: string | null;
      choices: QuizChoice[];
      answered: string[];
      result: { roleGroup: RoleGroupId; label: string } | null;
    }
  | {
      kind: 'flow';
      nodes: FlowNode[];
      edges: { from: string; to: string }[];
      summary: string;
    };

const INTERVIEW_RE = /^interview:(start|step:(\d{1,2}))$/;
const FLOW_RE = /^flow:example$/;

/**
 * Resolve an inbound chat message to a deterministic demo intent, or null
 * when the message should go down the normal retrieval path. Quiz progress
 * rides in the token itself (`quiz:answer:<id>[:<id>…]` keeps this handler
 * stateless), interview progress is an explicit step number.
 */
export function resolveDemoIntent(rawMessage: string): DemoIntent | null {
  const message = rawMessage.trim().toLowerCase();

  const interview = INTERVIEW_RE.exec(message);
  if (interview) {
    if (!interview[2]) return { kind: 'interview', step: 0 };
    const step = Number.parseInt(interview[2], 10);
    if (Number.isNaN(step) || step < 0 || step >= INTERVIEW_SCRIPT.length) {
      return null;
    }
    return { kind: 'interview', step };
  }

  if (FLOW_RE.test(message)) return { kind: 'flow' };

  // quiz:start | quiz:next | quiz:answer:<id>[:<id>…]
  if (message === 'quiz:start' || message === 'quiz:next') {
    return { kind: 'quiz', answered: [] };
  }
  if (message.startsWith('quiz:answer:')) {
    const ids = message.split(':').slice(2); // ['answer', id…]
    const answered = ids.filter((id) =>
      QUIZ_SCRIPT.some((q) => q.choices.some((c) => c.id === id))
    );
    if (answered.length === 0) {
      return { kind: 'quiz', answered: [] };
    }
    // Complete lists are returned as-is: the caller emits the result card.
    return { kind: 'quiz', answered };
  }

  return null;
}
