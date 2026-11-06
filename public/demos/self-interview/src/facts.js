/* Self-Interview — curated facts + deterministic intent map.
   HARD CONSTRAINT: only these verified facts may appear anywhere in the UI.
   No live LLM, no API keys, fully static. */

export const FACTS = {
  name: "David Papp",
  role: "AI Solutions Developer",
  employer: "WEBINFORM IT Ltd",
  since: "October 2024",
  education: {
    degree: "Econometrics and Data Science",
    previousProgrammeStart: "2024",
    programmeChanged: "September 2026",
    expectedGraduation: "2028",
    prior: "prior study in artificial intelligence, machine learning, and statistics",
    school: "VU Amsterdam"
  },
  costSaving: {
    fact: "Candidate-reported professional result: repairing an inherited AI-first service included reducing LLM API costs; professional work, not a prototype",
    qualifier: "no quantified result claimed",
    candidateReported: true,
    context: "professional work, not a prototype",
    neverInflate: true
  },
  stack: ["Next.js", "TypeScript", "Prisma", "Clerk", "Supabase", "Tailwind"],
  liveDemo: {
    name: "AgentSec Suite",
    url: "https://promptshield-cyan.vercel.app/demo"
  },
  prototypes: ["VoidArch Context", "VoidArch Studio", "AgentSec Suite", "saas-core"]
}

/* Source-link map for receipts / fact chips. Each fact that is claimable gets a
   stable anchor so the UI can surface a visible receipt. */
export const SOURCES = {
  profile: "Personal portfolio profile (verified facts only)",
  linkedin: "linkedin.com/in/d%C3%A1vid-papp",
  github: "github.com/pappdavid",
  resume: "Resume — WEBINFORM IT Ltd (Oct 2024)"
}

/* Intent map — deterministic keyword matching over the fact DB above.
   Order matters: more specific patterns first. Each intent maps to a fixed
   answer key in the interview script. */
export const INTENT_RULES = [
  {
    name: "junior",
    patterns: ["junior", "jr", "entry", "entry-level", "beginner"],
    answer: "experience"
  },
  {
    name: "production",
    patterns: ["production", "live", "real product", "real thing", "real customer"],
    answer: "production-vs-prototype"
  },
  {
    name: "prototype",
    patterns: ["prototype", "personal project", "side project", "portfolio project", "toy"],
    answer: "prototypes"
  },
  {
    name: "cost_saving",
    patterns: ["cost", "save money", "budget", "reduce spend", "cheaper", "llm cost"],
    answer: "cost-saving"
  },
  {
    name: "client_work_summary",
    patterns: [
      "how many", "number of", "count", "websites", "webshops", "built",
      "erp", "erp integration", "erp integrations", "ai integration", "ai integrations",
    ],
    answer: "client-work-summary"
  },
  {
    name: "stack",
    patterns: ["stack", "tech stack", "technology", "tools", "framework", "languages"],
    answer: "stack"
  },
  {
    name: "demo",
    patterns: ["demo", "live demo", "example", "see it in action", "agent"],
    answer: "demo"
  },
  {
    name: "education",
    patterns: ["education", "degree", "university", "school", "student", "studying"],
    answer: "education"
  },
  {
    name: "employer",
    patterns: ["employer", "company", "who do", "work for", "current job"],
    answer: "employer"
  }
]

/**
 * Classify a free-text question against the intent map.
 * Returns the answer key, or null if unknown.
 * @param {string} text
 * @returns {string|null}
 */
export function classifyIntent(text) {
  const lower = (text || "").toLowerCase()
  for (const rule of INTENT_RULES) {
    if (rule.patterns.some((pattern) => {
      const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")
      return new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i").test(lower)
    })) {
      return rule.answer
    }
  }
  return null
}
