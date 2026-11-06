<div align="center">

# davidpapp.dev — portfolio platform

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

[![Live Site](https://img.shields.io/badge/Live_Site-davidpapp.dev-22c55e?style=flat-square)](https://davidpapp.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-dávid--papp-0077b5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/d%C3%A1vid-papp)
[![Email](https://img.shields.io/badge/Email-contact%40davidpapp.dev-ea4335?style=flat-square&logo=gmail&logoColor=white)](mailto:contact@davidpapp.dev)

</div>

---

## About

Personal portfolio site of **David Papp** — AI Solutions Developer at WEBINFORM IT Ltd and studying Econometrics and Data Science at Vrije Universiteit Amsterdam. University studies began in 2024; he changed to this programme in September 2026 and expects to graduate in 2028. The site presents professional experience, open-source projects, a downloadable CV, and a small RAG-grounded assistant, wrapped in a terminal-OS ("DavidOS") visual identity.

Project descriptions distinguish professional production work, public prototypes, local developer tools, and experiments. Decorative terminal status values are explicitly marked `SIM` (simulated), and CI checks recruiter-facing content for consistency.

The four linked case studies are **Active Companion** (public source, scripted fictional retrieval replay), **VoidArch Context** (public source, active development v0.1, not a stable npm release), **VoidArch Router** (private source, no public repository) and **Client Studio** (private source, fictional source-excerpt demo with no AI backend). VoidArch Studio, AgentSec Suite and saas-core remain listed with their actual local/private/demo scope on the projects page. The existing hosted product samples are listed separately. Public AgentSec component repositories and supporting tooling include:
[PromptShield](https://github.com/pappdavid/promptshield) ·
[agentsec-hook-pack](https://github.com/pappdavid/agentsec-hook-pack) ·
[mcpguard-lite](https://github.com/pappdavid/mcpguard-lite) ·
[agentmap](https://github.com/pappdavid/agentmap) ·
[approveops](https://github.com/pappdavid/approveops) ·
[agent-cli-mcp-rust](https://github.com/pappdavid/agent-cli-mcp-rust)

---

## What this repo actually contains

- **Landing page** (`/`) — terminal-OS single-page experience: hero, project filesystem table with expandable case studies, work history, skills, field notes, contact section with a streaming assistant chat.
- **Projects** (`/projects`) — project cards with overview / real-source-code-excerpt / architecture-diagram tabs.
- **Legacy catalogue** (`/saas-projects`) — redirects to `/projects`; hosted samples appear in the current project case study. The older catalogue data sync remains separate from the public route.
- **Assistant APIs** — `/api/chat` streams answers plus retrieved-evidence cards from a reviewed portfolio KB; `/api/ama` shares the same KB while retaining deterministic answers for hiring/project identity. On Vercel they default to AI Gateway `deepseek/deepseek-v4-flash-0731` using deployment OIDC; when `OPENROUTER_API_KEY` is present they prefer OpenRouter `openrouter/free`. `PORTFOLIO_CHAT_MODEL` and `PORTFOLIO_OPENROUTER_MODEL` override those defaults.
- **CV** — `public/cv.html` is the source; `public/cv.pdf` is generated from it with headless Chrome (`npm run cv:pdf`).
- **Dashboard** (`/dashboard`, Clerk-protected) — starter-kit dashboard pages (overview charts, referrals, profile) retained from the upstream template; not part of the public portfolio.
- **Static pages** — `/brand`, `/security`, `/privacy-policy`, `/terms-of-service`.
- **Redirects** — previously shared routes (`/mcp`, `/training`, `/chat`, `/projects/mcp-sentinel`, `/projects/rag-chat`, `/projects/training`, `/projects/portfolio`, `/about`) redirect to current pages instead of 404ing (see `next.config.ts`).

The assistant KB is built from the reviewed factual profile (`src/lib/ama/corpus.ts`) plus structured project records (`src/data/github-projects-rag.json`). Retrieval uses weighted BM25-style ranking with exact referral-project boosts in `src/lib/chat/knowledge-base.ts`; the corpus is small enough that a vector database would add machinery without improving exact-entity retrieval.

---

## Executable browser studies

- [Faultline](https://davidpapp.dev/faultline/index.html) runs a fictional booking through lost-response retries and compares naive and idempotent in-memory receivers. Inspect the trace, completion/uniqueness assertions, and conflicting-payload behavior. It makes no real booking or network request. Atomic effect-and-receipt storage is a stated model assumption.
- [Mercury Renderer Study](https://davidpapp.dev/demos/mercury/index.html) plays bundled synthetic full-state snapshots through schema validation and SVG reconciliation. It supports scrubbing, malformed-frame recovery, interruption, and bounded trace export. It does not call a Mercury model or claim measured inference performance.
- Six engineering field notes explain implementation choices and limits from the public security-tool repositories, with links pinned to reviewed source revisions.

Run `npm run test:showcases` for the demo engine and field-note checks. These are executable portfolio studies, not evidence of customer use or production reliability.

## Stack

| Category      | Technology                                                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router), React 19 server components                                                                                                        |
| Language      | TypeScript 5.7 (strict)                                                                                                                                    |
| Styling       | Tailwind CSS v4 + shadcn/ui, OKLCH theme files in `src/styles/themes/`                                                                                     |
| Auth          | Clerk (middleware in `src/proxy.ts` protects `/dashboard`)                                                                                                 |
| Database      | Supabase Postgres (migrations in `supabase/migrations/`, RLS enabled)                                                                                      |
| Rate limiting | Upstash Redis sliding windows (`src/lib/rate-limit.ts`) — disabled gracefully if env vars are absent                                                       |
| AI            | Vercel AI SDK + AI Gateway on Vercel OIDC; OpenRouter preferred when configured; reviewed BM25-style portfolio KB; Crayon Markdown/evidence-card rendering |
| 3D            | Three.js constellation background (`src/lib/scene/`, `@react-three/fiber`)                                                                                 |
| Deployment    | Vercel                                                                                                                                                     |
| CI            | GitHub Actions: install, lint, typecheck, build, content-regression checks                                                                                 |

---

## Getting started

```bash
git clone https://github.com/pappdavid/portfolio-platform.git
cd portfolio-platform
npm install
cp env.example.txt .env.local   # fill in the vars below
npm run dev                     # http://localhost:3000
```

| Variable                                                                                   | Required                            | Purpose                                                                 |
| ------------------------------------------------------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`                                   | Only for account/dashboard features | Auth; public pages work without these keys                              |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Yes for dashboard/referrals         | Database                                                                |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`                                      | Optional                            | Rate limiting                                                           |
| `OPENROUTER_API_KEY`                                                                       | Optional                            | Prefer OpenRouter; Vercel deployments otherwise use AI Gateway via OIDC |
| `PORTFOLIO_CHAT_MODEL`                                                                     | Optional                            | Override the AI Gateway model                                           |
| `PORTFOLIO_OPENROUTER_MODEL`                                                               | Optional                            | Override the OpenRouter model                                           |

Apply `supabase/migrations/001_initial.sql` and `002_demo_quota.sql` in the Supabase SQL editor if you use the dashboard features.

---

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build (type-check + static generation)
npm run lint         # ESLint
npm run lint:strict  # Zero-warning ESLint
npm run format       # Prettier
npm run check:content # Content/claims regression checks (also run in CI)
npm run test:chat     # Stream framing, Unicode, empty/error reply regression tests
npm run format:check  # Check formatting without changing files
npm run verify:deployed -- https://deployment.vercel.app FULL_COMMIT_SHA # Read-only release verification
npm run cv:pdf       # Regenerate public/cv.pdf from public/cv.html (needs Chrome)
```

For a CLI build, pass `PORTFOLIO_COMMIT_SHA` with the exact source commit; Git deployments use `VERCEL_GIT_COMMIT_SHA`. Only that public revision identifier is embedded in page metadata. The manual **Verify selected deployment** workflow checks an explicit deployment URL and expected revision, then public routes and the PDF; it does not deploy or alter access. An unrecorded or mismatched build fails the revision check.

---

## Contact

[contact@davidpapp.dev](mailto:contact@davidpapp.dev) · [linkedin.com/in/dávid-papp](https://www.linkedin.com/in/d%C3%A1vid-papp) · [davidpapp.dev](https://davidpapp.dev)

### Vendored demo source

`demos.lock.json` records upstream source revisions and build provenance; it does not promise public access to upstream repositories. When a hosted sample needs a portfolio-specific correction, `source_patch` records the in-repository patch and its SHA256. With authorized upstream source access, apply that patch to the recorded revision, install its locked dependencies and run `npm run build -- --base=./` to reproduce the vendored source changes. Generated JavaScript and source maps retain their build output bytes and are excluded from Prettier.

### Visual layout regression

Run `npm run test:visual -- https://EXACT-DEPLOYMENT /tmp/portfolio-visual-evidence` with an existing Playwright installation (`PLAYWRIGHT_MODULE` may name its absolute module path). The check measures opaque reading surfaces, foreground/background contrast, text sizes, viewport overflow, project-panel geometry, demo open/close states and transcript/composer/footer separation at390/768/1180/1366px plus683px reflow. It saves actual screenshots and a JSON receipt outside source. The portfolio-owned `public/demos/self-interview/layout.css` fixes embedding geometry without rewriting upstream demo content or generated bundles.

### Hosted UI refinements

The self-interview entry now uses readable ES modules under public/demos/self-interview/src/, recovered from the previously checked-in source map, with opt-in guided playback and a separate transcript/composer layout. Fit-Finder's hosted progress/back/focus changes are retained in patches/demos/rolefit-quiz-ux.patch; this is a host patch, not evidence of a clean upstream rebuild. Task-to-Flow's unbundled source includes an empty state, wrapped examples and result-start anchoring. Public AgentSec entry links target its simulated /demo walkthrough. Active Companion links target the scripted retrieval replay over fictional scenarios; no live microphone or hosted inference is claimed.

### Runtime verification and guided playback

The existing Vercel project uses Node 24.x. The local .nvmrc and CI configuration use Node 22; this repair was verified on Node 24 and is not evidence of a fresh Node 22 CI run. These version settings were not changed as part of the UI repair.
The guided self-interview is optional. Typing a question pauses playback, and Resume guided interview continues from the next scripted turn. Clear conversation and restart returns to the paused welcome state. Public demo labels distinguish hosted illustrative workflows and simulated walkthroughs from live provider execution.

### CV project links

Direct case-study anchors: `/projects#active-companion`, `/projects#voidarch-context`, `/projects#voidarch-router`, and `/projects#client-studio`. The home `#projects` alias reaches the visible project list. VoidArch Router descriptions are grounded in its private repository README and package manifest; no public repository, live adapter integration, or hosted execution is claimed.
