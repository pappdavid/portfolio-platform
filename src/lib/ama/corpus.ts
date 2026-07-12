export const amaCorpus: string = `
# About David Papp
AI Solutions Developer (contract/freelance) at WEBINFORM IT Ltd since October 2024, and BSc Artificial Intelligence student at Vrije Universiteit Amsterdam (2024-2027 expected). Based in the Rotterdam area, Netherlands. Hungarian citizen with NL/EU work authorization - no sponsorship required.

Open to: full-time AI engineering, AI solutions, integration, automation, agent infrastructure, and technically oriented product/project roles.
Contact: contact@davidpapp.dev
LinkedIn: https://www.linkedin.com/in/d%C3%A1vid-papp | GitHub: https://github.com/pappdavid

# Professional work at WEBINFORM
Builds internal AI tools and production LLM functionality for web applications and ERP-integrated systems: APIs, automation, backend logic, and user-facing AI interfaces. Professional delivery includes more than 20 websites/webshops, three internal systems, one user-facing platform, and recovery work on an inherited AI-first service. That inherited service had serious architecture, security, compliance, prompt/context-injection, and cost problems; David reverse-engineered its undocumented integration behavior, repaired it, and reduced LLM API usage cost by approximately 40% (an approximate professional result, not a lab benchmark). Two ERP/AI integration projects with direct involvement in discovery, requirements, solution design, client coordination, proposals, and pricing.

# Earlier experience
Project Assistant at 4iG Nyrt. (Aug 2022 - Aug 2023): supported project managers, prepared and processed tickets, handled incoming client communication, performed cross-system checks and Playwright-based pre-tests, coordinated work, and escalated incidents. Programming Instructor at Logiscool (Feb 2023 - Jun 2023): taught Python, Scratch, game development, and programming fundamentals.

# Open-source projects (personal showcase prototypes, not commercial products)
PromptShield: rule-based prompt-injection scanner (six finding categories) plus runtime action inspector; unit-tested with CI that boots the production build and asserts live HTTP behavior; live demo at https://promptshield-cyan.vercel.app.
agentsec-hook-pack: zero-dependency local PreToolUse policy hook for Claude Code and Codex with observe/prompt/enforce modes, destructive-command blocking, fail-closed handling, and a 12-case test suite. A local hook pack, not a hosted platform.
mcpguard-lite: static risk analyzer for MCP tools/list manifests (declared capabilities and missing declared controls); live demo at https://mcpguard-lite.vercel.app. Static analysis does not prove runtime safety.
agentmap: agent inventory with explainable 0-100 risk scoring from declared metadata and readiness labels; live demo at https://agentmap-fawn.vercel.app. Reporting, not runtime enforcement.
approveops: human-in-the-loop approval-workflow prototype with transactional approval/audit writes and owner-scoped queues; live demo at https://approveops.vercel.app.
agent-cli-mcp-rust: Rust MCP server dispatching external AI coding CLIs with directory isolation and secret scrubbing; unit tests cover the policy and redaction modules, while third-party executor integrations do not yet have end-to-end CI coverage.
antigravity-skill-injector: proof-of-concept skill loader using Rust and Python; compilation and protocol initialization are checked in CI, but there is no desktop-app integration test or measured token-savings benchmark.
thesys-c1-dashboard: prototype dashboard whose panels are restructured by a Thesys C1 agent via a JSON command protocol; CI runs typecheck, lint, and build, but there is no test suite or public demo.

# Tech stack
TypeScript, Python, Rust, SQL/Postgres, Next.js, React, Tailwind CSS, Prisma, Clerk, Supabase, LLM APIs (OpenAI and others), MCP protocol, Vercel, GitHub Actions.

# Project scope
David has not fine-tuned production models - fine-tuning is coursework and personal experimentation. The personal projects have no uptime SLAs, no latency benchmarks, and no customer deployments; they are tested prototypes and developer tools. This portfolio site labels its decorative terminal-style status values as SIM (simulated).
`;
