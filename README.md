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

Personal portfolio site of **David Papp** — AI Solutions Developer at WEBINFORM IT Ltd and BSc Artificial Intelligence student at VU Amsterdam. The site presents professional experience, open-source projects, a downloadable CV, and a small RAG-grounded assistant, wrapped in a terminal-OS ("DavidOS") visual identity.

Project descriptions distinguish professional production work, public prototypes, local developer tools, and experiments. Decorative terminal status values are explicitly marked `SIM` (simulated), and CI checks recruiter-facing content for consistency.

The open-source projects shown on the site live in their own repositories:
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
- **SaaS catalogue** (`/saas-projects`) — screenshots and links for small prototype demos deployed on Vercel (synced by `scripts/sync-saas-projects.mjs` + a scheduled workflow).
- **Assistant APIs** — `/api/chat` (streaming chat grounded in `src/data/github-projects-rag.json` via keyword retrieval, OpenAI `gpt-4o-mini`) and `/api/ama` (JSON Q&A over `src/lib/ama/corpus.ts` with a deterministic no-API-key fallback).
- **CV** — `public/cv.html` is the source; `public/cv.pdf` is generated from it with headless Chrome (`npm run cv:pdf`).
- **Dashboard** (`/dashboard`, Clerk-protected) — starter-kit dashboard pages (overview charts, referrals, profile) retained from the upstream template; not part of the public portfolio.
- **Static pages** — `/brand`, `/security`, `/privacy-policy`, `/terms-of-service`.
- **Redirects** — previously shared routes (`/mcp`, `/training`, `/chat`, `/projects/mcp-sentinel`, `/projects/rag-chat`, `/projects/training`, `/projects/portfolio`, `/about`) redirect to current pages instead of 404ing (see `next.config.ts`).

The retrieval in `/api/chat` is deliberately simple: paragraph chunking plus keyword-overlap scoring (`src/lib/chat/rag.ts`). There is no vector database in this app.

---

## Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 server components |
| Language | TypeScript 5.7 (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui, OKLCH theme files in `src/styles/themes/` |
| Auth | Clerk (middleware in `src/proxy.ts` protects `/dashboard`) |
| Database | Supabase Postgres (migrations in `supabase/migrations/`, RLS enabled) |
| Rate limiting | Upstash Redis sliding windows (`src/lib/rate-limit.ts`) — disabled gracefully if env vars are absent |
| AI | OpenAI API (`gpt-4o-mini`) for the assistant endpoints |
| 3D | Three.js constellation background (`src/lib/scene/`, `@react-three/fiber`) |
| Deployment | Vercel |
| CI | GitHub Actions: install, lint, typecheck, build, content-regression checks |

---

## Getting started

```bash
git clone https://github.com/pappdavid/portfolio-platform.git
cd portfolio-platform
npm install
cp env.example.txt .env.local   # fill in the vars below
npm run dev                     # http://localhost:3000
```

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Yes (or Clerk keyless mode) | Auth |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Yes for dashboard/referrals | Database |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Optional | Rate limiting |
| `OPENAI_API_KEY` | Optional | Assistant endpoints (deterministic fallback without it) |

Apply `supabase/migrations/001_initial.sql` and `002_demo_quota.sql` in the Supabase SQL editor if you use the dashboard features.

---

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build (type-check + static generation)
npm run lint         # ESLint
npm run lint:strict  # Zero-warning ESLint
npm run format       # Prettier
npm run check:content# Content/claims regression checks (also run in CI)
npm run cv:pdf       # Regenerate public/cv.pdf from public/cv.html (needs Chrome)
```

---

## Contact

[contact@davidpapp.dev](mailto:contact@davidpapp.dev) · [linkedin.com/in/dávid-papp](https://www.linkedin.com/in/d%C3%A1vid-papp) · [davidpapp.dev](https://davidpapp.dev)
