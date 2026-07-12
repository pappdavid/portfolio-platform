export type PortfolioAssistantLink = {
  label: string;
  url: string;
};

export type PortfolioAssistantAnswer = {
  answer: string;
  links: PortfolioAssistantLink[];
};

export const portfolioAssistantLinks: PortfolioAssistantLink[] = [
  { label: 'Projects', url: '/projects' },
  { label: 'PromptShield demo', url: 'https://promptshield-cyan.vercel.app' },
  { label: 'GitHub', url: 'https://github.com/pappdavid' },
  { label: 'Contact David', url: '/#contact' },
  { label: 'CV (PDF)', url: '/cv.pdf' }
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
        'David is open to full-time AI engineering, AI solutions, integration, automation, and agent-infrastructure roles. He is based in the Rotterdam area (NL), has NL/EU work authorization with no sponsorship required, and email is the fastest way to reach him.',
      links: [link('Contact David'), link('CV (PDF)')]
    };
  }

  if (hasAny(normalized, ['webinform', 'work', 'job', 'experience'])) {
    return {
      answer:
        'Since October 2024 David has worked as an AI Solutions Developer (contract) at WEBINFORM IT Ltd, building internal AI tools and production LLM functionality for web applications and ERP-integrated systems. Delivery includes 20+ websites/webshops, three internal systems, a user-facing platform, and repair of an inherited AI-first service where he cut LLM API costs by roughly 40%.',
      links: [link('CV (PDF)'), link('Contact David')]
    };
  }

  if (
    hasAny(normalized, [
      'promptshield',
      'injection',
      'agentsec',
      'mcpguard',
      'agentmap',
      'approveops',
      'security',
      'project'
    ])
  ) {
    return {
      answer:
        'David builds open-source agent-security prototypes: PromptShield (rule-based prompt-injection scanner with a live demo and CI-verified HTTP behavior), agentsec-hook-pack (tested PreToolUse policy hook for Claude Code/Codex), mcpguard-lite (static MCP manifest analyzer), agentmap (declared-metadata risk scoring), and approveops (approval-workflow prototype with transactional audit writes). All are showcase prototypes, not commercial products.',
      links: [link('Projects'), link('PromptShield demo'), link('GitHub')]
    };
  }

  if (hasAny(normalized, ['stack', 'technology', 'tools', 'prefer'])) {
    return {
      answer:
        "David's stack centers on TypeScript, Python, and Rust, with Next.js, Prisma, Clerk, Supabase/Postgres, LLM APIs, and the MCP protocol. Professionally he ships LLM features, APIs, and ERP integrations; personally he builds tested agent-security tooling.",
      links: [link('Projects'), link('GitHub')]
    };
  }

  return {
    answer:
      'David is an AI Solutions Developer at WEBINFORM and a BSc AI student at VU Amsterdam who builds open-source agent-security prototypes on the side. Ask about his professional work, a specific project, his stack, or his availability — or email contact@davidpapp.dev.',
    links: [link('Projects'), link('Contact David')]
  };
}
