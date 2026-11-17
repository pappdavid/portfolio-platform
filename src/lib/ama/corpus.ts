export const amaCorpus: string = `
# About David Papp
AI Solutions Developer (contract/freelance) at WEBINFORM IT Ltd since October 2024, and studying Econometrics and Data Science at Vrije Universiteit Amsterdam. University studies began in 2024; changed to this programme in September 2026; graduation expected in 2028. Based in the Rotterdam area, Netherlands.

Open to: full-time AI engineering, AI solutions, integration, automation, agent infrastructure, and technically oriented product/project roles.
Contact: contact@davidpapp.dev
LinkedIn: https://www.linkedin.com/in/d%C3%A1vid-papp | GitHub: https://github.com/pappdavid

# Professional work at WEBINFORM
Builds internal AI tools and production LLM functionality for web applications and ERP-integrated systems: APIs, automation, backend logic, and user-facing AI interfaces. Professional delivery includes client websites and webshops, internal AI systems, user-facing AI functionality, and recovery work on an inherited AI-first service. David recovered that inherited service by reverse-engineering undocumented integrations, repairing architecture and security issues, and reducing LLM API costs. He addressed a prompt/context-injection vulnerability using deterministic validation and human review. Two ERP/AI integration projects with direct involvement in discovery, requirements, solution design, client coordination, proposals, and pricing.

# Earlier experience
Project Assistant at 4iG Nyrt. (Aug 2022 - Aug 2023): drafted a first operating procedure for sorting, tracking, and handoff on a warehouse line from engineer walkthroughs; helped trace process gaps and logged findings for engineers; supported sorting and distribution handoffs. Programming Instructor at Logiscool (Feb 2023 - Jun 2023): taught Python and Unity using pre-made curricula, and taught JavaScript through a visual block-based tool.

# Selected engineering projects (personal work, not commercial products)
Client Studio: Company assistant on a Supabase-backed workspace: answers questions from supplied text or Markdown with exact source excerpts. Splits sources into versions, filters internal sources from the customer view on the server, and goes live only after explicit review, approval and activation as a frozen snapshot. Writes are revision-checked and idempotent, and the database is closed to client roles so only the server can read or write. Retrieval is lexical and model calls are switched off in the hosted demo. Shown with fictional examples or user-provided material. Source is private. Live demo: https://client-studio-psi.vercel.app/
Active Companion: Meeting-assistant lab in Python: a sliding context window, heuristic intent classification and TF-IDF retrieval turn a transcript into evidence cards with named sources. An optional model step keeps only answer bullets that cite a retrieved source title. Includes a server-sent-events API lab and provider-free automated tests, with public MIT-licensed source. The hosted page is a scripted replay of the pipeline output for four fictional conversations, with no inference, microphone or uploads. It is not evaluated on real meetings. The model step runs only in the local lab and is tested with a stubbed model. Source: https://github.com/pappdavid/active-companion
Faultline: Executable browser model of retries and idempotency: lose the request before commit or the response after it, see the duplicate effect of a naive retry, then replay against an idempotent receiver. The receiver stores the operation key and payload fingerprint and rejects a changed payload under the same key. Events, receipts and assertions come from a tested in-memory engine with public source. Atomic effect-and-receipt storage is a model assumption. It is a teaching model in browser JavaScript, not a deployed service or a test of real distributed systems. Live: https://davidpapp.dev/faultline/index.html
VoidArch Context: local-first, agent-neutral repo memory and context engine using embedded SurrealDB, BM25 document retrieval, a Tree-sitter code graph, durable memories, optional local ONNX embeddings, and deterministic token-budgeted context packs. It runs locally; vector retrieval requires an explicit embedding pass and the embedded database is single-process.
VoidArch Studio: active-development local orchestration control room built on Context, with daemon-owned PTY sessions for Claude, Codex, and shell, worktrees, run management, transcripts, resume metadata, safety hooks, observability, and a thin Tauri desktop shell. It is not a released hosted service.

# Tech stack
TypeScript, Python, Rust, SQL/Postgres, Next.js, React, Tailwind CSS, Prisma, Clerk, Supabase, SurrealDB, LLM APIs, MCP protocol, Vercel, GitHub Actions, Tauri.

# Project scope
David has not fine-tuned production models - fine-tuning is coursework and personal experimentation. The personal projects are not commercial products and have no uptime SLAs or invented performance benchmarks. This portfolio site labels decorative terminal-style status values as SIM (simulated).
`;
