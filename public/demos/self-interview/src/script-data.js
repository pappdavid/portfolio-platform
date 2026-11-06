/* Self-Interview — interview script.
   9 skeptical recruiter Q&As covering the honest angle, including the
   "what's still a prototype?" question. Honesty is the differentiator. */

export const INTERVIEW_SCRIPT = [
  {
    id: "experience",
    question: "Is he junior?",
    answer: "I joined WEBINFORM IT Ltd as an AI Solutions Developer in October 2024. My university studies began in 2024 in a different programme; I changed to Econometrics and Data Science at VU Amsterdam in September 2026 and expect to graduate in 2028. I also have prior study in artificial intelligence, machine learning, and statistics, and I flag what is production versus prototype so you're never guessing.",
    source: "WEBINFORM IT Ltd · VU Amsterdam",
    tags: ["experience"]
  },
  {
    id: "client-work-summary",
    question: "Has he shipped real things?",
    answer: "At WEBINFORM IT, I contribute to client work that includes ERP/AI integrations, internal systems, and user-facing software. I don't have a verified website or webshop count to quote.",
    source: "Delivery record at WEBINFORM IT Ltd",
    tags: ["experience"]
  },
  {
    id: "production-vs-prototype",
    question: "What's actually production vs prototype?",
    answer: "At WEBINFORM IT, I contribute to client ERP/AI integrations and related internal and user-facing systems. My personal projects — VoidArch Context, VoidArch Studio, AgentSec Suite, and saas-core — are prototypes. AgentSec Suite has a public live demo you can click through right now.",
    source: "Project inventory",
    tags: ["prototypes"]
  },
  {
    id: "cost-saving",
    question: "Can he actually save us money?",
    answer: "One candidate-reported professional result: I repaired an inherited AI-first service by reverse-engineering undocumented integrations, fixing architecture and security issues, and reducing LLM API costs. This is professional work, not a prototype; no quantified saving is claimed.",
    source: "Inherited AI service repair",
    tags: ["cost-saving"]
  },
  {
    id: "stack",
    question: "What does he build with?",
    answer: "My delivery stack is Next.js, TypeScript, Prisma, Clerk, Supabase, and Tailwind — the modern typed full-stack. It's what I use daily for shipped client work.",
    source: "Delivery stack",
    tags: ["stack"]
  },
  {
    id: "education",
    question: "Does he actually understand AI, or just glue APIs?",
    answer: "My university studies began in 2024 in a different programme. I changed to Econometrics and Data Science at VU Amsterdam in September 2026 and expect to graduate in 2028; I also have prior study in artificial intelligence, machine learning, and statistics. My client work includes ERP/AI integrations.",
    source: "VU Amsterdam · ERP/AI integrations",
    tags: ["education"]
  },
  {
    id: "demo",
    question: "Can I see something live right now?",
    answer: "Yes — AgentSec Suite is publicly reachable at promptshield-cyan.vercel.app. Click through it yourself; no sales call required. It's a personal project, so: prototype, proudly.",
    source: "promptshield-cyan.vercel.app",
    tags: ["demo"]
  },
  {
    id: "employer",
    question: "Where does he actually work?",
    answer: "AI Solutions Developer at WEBINFORM IT Ltd since October 2024. My client work includes ERP/AI integrations and related software systems.",
    source: "WEBINFORM IT Ltd (Oct 2024–)",
    tags: ["employer"]
  },
  {
    id: "trust",
    question: "Why should I trust any of this?",
    answer: "Because everything on this page comes from one verified fact list — no invented clients, no invented metrics, and anything simulated is labelled illustrative. The production/prototype line stays explicit, and 'roughly' stays roughly. Ask me anything else directly.",
    source: "Verified-fact policy of this demo",
    tags: ["trust"]
  }
]

/**
 * Look up a canned answer by script id.
 * @param {string} id
 */
export function getAnswerById(id) {
  return INTERVIEW_SCRIPT.find((q) => q.id === id)
}

export const SUGGESTED_QUESTIONS = [
  "Is he junior?",
  "Has he shipped real things?",
  "What's actually production vs prototype?",
  "Did fixing a service cut costs?",
  "What's his stack?"
]

export const FALLBACK_ANSWER =
  "Good question — I don't have a scripted answer for that one, and I won't improvise facts. Ask David directly and he'll give you a straight answer."
