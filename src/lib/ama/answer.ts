export type PortfolioAssistantLink = {
  label: string;
  url: string;
};

export type PortfolioAssistantAnswer = {
  answer: string;
  links: PortfolioAssistantLink[];
};

export const portfolioAssistantLinks: PortfolioAssistantLink[] = [
  { label: 'MCP Sentinel demo', url: '/mcp' },
  { label: 'Training Pipeline demo', url: '/training' },
  { label: 'RAG + 3D Chat demo', url: '/chat' },
  { label: 'Projects overview', url: '/projects' },
  { label: 'Proof of work', url: '/#proof' },
  { label: 'Contact David', url: '/#contact' },
  { label: 'MCP dashboard', url: '/dashboard/mcp' },
  { label: 'Training dashboard', url: '/dashboard/training' }
];

function hasAny(query: string, terms: string[]) {
  return terms.some((term) => query.includes(term));
}

function link(label: string) {
  const target = portfolioAssistantLinks.find((item) => item.label === label);
  if (!target) {
    throw new Error(`Unknown portfolio assistant link: ${label}`);
  }
  return target;
}

export function answerPortfolioQuestion(
  question: string
): PortfolioAssistantAnswer {
  const normalized = question.toLowerCase();

  if (hasAny(normalized, ['role', 'roles', 'open to', 'available'])) {
    return {
      answer:
        'David is open to AI / automation engineer, full-stack AI, and data science roles in the Netherlands. He is based around Rotterdam, studies AI at VU Amsterdam, and highlights a 24-hour response window for recruiting conversations.',
      links: [link('Contact David'), link('Proof of work')]
    };
  }

  if (hasAny(normalized, ['mcp', 'sentinel', 'guardrail', 'guardrails'])) {
    return {
      answer:
        'MCP Sentinel is David’s guardrail and observability layer for agent tool calls. It wraps an MCP server, logs each call, applies injection, PII, cost, and rate-limit checks, and keeps p99 overhead under 12ms in the portfolio case study.',
      links: [link('MCP Sentinel demo'), link('MCP dashboard')]
    };
  }

  if (hasAny(normalized, ['rag', 'retrieval', 'vector', 'embedding'])) {
    return {
      answer:
        'For RAG work, David prefers a pragmatic TypeScript/Python stack: Next.js for the interface, PostgreSQL or Supabase with vector search for retrieval, reranking where it improves precision, and citation-focused answer generation.',
      links: [link('RAG + 3D Chat demo'), link('Projects overview')]
    };
  }

  if (hasAny(normalized, ['training', 'fine-tune', 'finetune', 'lora'])) {
    return {
      answer:
        'David’s custom training pipeline turns repos and docs into validated fine-tuning datasets. The flow parses source material, chunks it by useful boundaries, generates instruction pairs, validates JSONL, and prepares the handoff for LoRA-style training.',
      links: [link('Training Pipeline demo'), link('Training dashboard')]
    };
  }

  if (hasAny(normalized, ['stack', 'technology', 'tools', 'prefer'])) {
    return {
      answer:
        'David’s current stack centers on TypeScript, Python, Next.js, React, Supabase/Postgres, Clerk, Upstash, OpenAI APIs, Tailwind CSS, Three.js, and Vercel. The portfolio case studies emphasize cost control, guardrails, retrieval, and production UX.',
      links: [link('Projects overview'), link('Proof of work')]
    };
  }

  return {
    answer:
      'David builds production-focused AI systems: agent observability, guardrails, fine-tuning automation, and RAG interfaces. The fastest way to evaluate the work is to start with the proof metrics and then open the three system dossiers.',
    links: [
      link('Proof of work'),
      link('MCP Sentinel demo'),
      link('Training Pipeline demo')
    ]
  };
}
