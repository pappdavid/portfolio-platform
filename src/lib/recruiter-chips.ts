// Non-technical recruiter-language suggestion chips per job-type profile.
//
// Each chip is a question a non-technical recruiter might ask, paired with a
// deterministic answer grounded in src/lib/ama/corpus.ts. These answers are
// injected into the chat context when a chip is tapped, so the assistant's
// response stays factual even when BM25 retrieval is weak for concern-type
// questions (e.g. "Will he fit our team?").
//
// This file is recruiter-facing content — scanned by
// scripts/portfolio-regression-checks.mjs. Every answer here must be
// supportable from corpus.ts. No invented metrics, clients, or production
// claims.

import type { JobTypeId } from './job-type';

export interface RecruiterChip {
  question: string;
  answer: string;
}

export const RECRUITER_CHIPS: Record<JobTypeId, RecruiterChip[]> = {
  'ai-engineering': [
    {
      question: 'Will he fit our team?',
      answer:
        'David works directly with clients and cross-functional teams. At WEBINFORM he coordinated discovery, requirements, solution design, and client communication, and earlier at 4iG he coordinated work across teams and escalated incidents. He is used to collaborating with non-technical stakeholders.'
    },
    {
      question: "Show me proof he's shipped",
      answer:
        '20+ websites/webshops delivered, three internal systems, one user-facing platform, and two ERP/AI integration projects at WEBINFORM. He also repaired an inherited AI-first service, cutting its LLM API costs by roughly 40%.'
    },
    {
      question: "What's real vs prototype?",
      answer:
        'Professional work at WEBINFORM is production client delivery. Personal projects — VoidArch Context, VoidArch Studio, AgentSec Suite, saas-core — are engineering prototypes and showcases, not commercial products and not production systems with customers.'
    },
    {
      question: 'Can he work with non-technical stakeholders?',
      answer:
        'Yes. At WEBINFORM he handles client coordination, requirements gathering, solution design, proposals, and pricing. He also taught programming fundamentals to students aged 10-16 at Logiscool.'
    }
  ],
  'ai-integration': [
    {
      question: 'Will he fit our team?',
      answer:
        'David works directly with clients and cross-functional teams. At WEBINFORM he coordinated discovery, requirements, solution design, and client communication, and earlier at 4iG he coordinated work across teams and escalated incidents. He is used to collaborating with non-technical stakeholders.'
    },
    {
      question: "Show me proof he's shipped",
      answer:
        '20+ websites/webshops delivered, three internal systems, one user-facing platform, and two ERP/AI integration projects at WEBINFORM. He also repaired an inherited AI-first service, cutting its LLM API costs by roughly 40%.'
    },
    {
      question: "What's real vs prototype?",
      answer:
        'Professional work at WEBINFORM is production client delivery. Personal projects — VoidArch Context, VoidArch Studio, AgentSec Suite, saas-core — are engineering prototypes and showcases, not commercial products and not production systems with customers.'
    },
    {
      question: 'Can he explain technical trade-offs to clients?',
      answer:
        'Yes. At WEBINFORM he is involved in discovery, requirements, solution design, client coordination, proposals, and pricing for ERP/AI integration projects. He translates technical work into client-facing deliverables.'
    }
  ],
  automation: [
    {
      question: 'Will he fit our team?',
      answer:
        'David works directly with clients and cross-functional teams. At WEBINFORM he coordinated discovery, requirements, solution design, and client communication, and earlier at 4iG he coordinated work across teams and escalated incidents. He is used to collaborating with non-technical stakeholders.'
    },
    {
      question: "Show me proof he's shipped",
      answer:
        '20+ websites/webshops delivered, three internal systems, one user-facing platform, and two ERP/AI integration projects at WEBINFORM. He also repaired an inherited AI-first service, cutting its LLM API costs by roughly 40%.'
    },
    {
      question: "What's real vs prototype?",
      answer:
        'Professional work at WEBINFORM is production client delivery. Personal projects — VoidArch Context, VoidArch Studio, AgentSec Suite, saas-core — are engineering prototypes and showcases, not commercial products and not production systems with customers.'
    },
    {
      question: 'Does he understand production safety?',
      answer:
        'Yes. His AgentSec hook pack implements fail-closed guardrails with observe/prompt/enforce modes, and his professional work includes Playwright-based pre-release testing at 4iG. He treats safety as a first-class concern.'
    }
  ],
  'product-engineering': [
    {
      question: 'Will he fit our team?',
      answer:
        'David works directly with clients and cross-functional teams. At WEBINFORM he coordinated discovery, requirements, solution design, and client communication, and earlier at 4iG he coordinated work across teams and escalated incidents. He is used to collaborating with non-technical stakeholders.'
    },
    {
      question: "Show me proof he's shipped",
      answer:
        '20+ websites/webshops delivered, three internal systems, one user-facing platform, and two ERP/AI integration projects at WEBINFORM. He also repaired an inherited AI-first service, cutting its LLM API costs by roughly 40%.'
    },
    {
      question: "What's real vs prototype?",
      answer:
        'Professional work at WEBINFORM is production client delivery. Personal projects — VoidArch Context, VoidArch Studio, AgentSec Suite, saas-core — are engineering prototypes and showcases, not commercial products and not production systems with customers.'
    },
    {
      question: 'Can he ship user-facing features end to end?',
      answer:
        'Yes. 20+ websites/webshops and a user-facing platform at WEBINFORM, built with Next.js, TypeScript, Prisma, Clerk, Supabase, Tailwind. He ships complete user-facing AI interfaces and has delivery experience across the full stack.'
    }
  ]
};

const CHIP_INDEX = new Map<string, string>();
for (const chips of Object.values(RECRUITER_CHIPS)) {
  for (const chip of chips) {
    CHIP_INDEX.set(chip.question.toLowerCase().trim(), chip.answer);
  }
}

/**
 * Return the deterministic, corpus-grounded answer for a known recruiter chip
 * question, or null when the question is not a recognized chip. Matching is
 * case-insensitive and trims surrounding whitespace.
 */
export function findRecruiterChipAnswer(question: string): string | null {
  const normalized = question.toLowerCase().trim();
  return CHIP_INDEX.get(normalized) ?? null;
}

/** The chip questions for a profile id, in display order. */
export function getRecruiterChipQuestions(profileId: JobTypeId): string[] {
  return (RECRUITER_CHIPS[profileId] || []).map((chip) => chip.question);
}
