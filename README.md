<div align="center">
  <img src="public/readme/header.svg" alt="David Papp — AI Engineering Student · VU Amsterdam" width="100%"/>
</div>

<br/>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-pgvector-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Upstash](https://img.shields.io/badge/Upstash-Redis-dc2626?style=flat-square&logo=redis&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel)

[![Live Site](https://img.shields.io/badge/Live_Site-davidpapp.dev-22c55e?style=flat-square)](https://davidpapp.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-dávid--papp-0077b5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/dávid-papp)
[![Email](https://img.shields.io/badge/Email-contact%40davidpapp.dev-ea4335?style=flat-square&logo=gmail&logoColor=white)](mailto:contact@davidpapp.dev)

</div>

---

BSc AI student at VU Amsterdam. This repo is my personal portfolio platform — built as a project in its own right.

Looking for junior AI/automation or data science roles in the Netherlands.

---

## Architecture

<div align="center">
  <img src="public/readme/arch.svg" alt="Platform architecture: UI layer (Next.js, shadcn/ui, Tailwind v4, 6 themes) · Auth layer (Clerk, Dashboard, RBAC, Referrals) · Data layer (Supabase + pgvector, Upstash rate limiting, Vercel Edge)" width="100%"/>
</div>

---

## Projects

| Project | Description | Stack |
|---|---|---|
| [MCP Sentinel](https://davidpapp.dev/projects/mcp-sentinel) | Agent observability — rate limiting, injection detection, PII scanning | Next.js · Supabase · Upstash |
| [RAG + 3D Chat](https://davidpapp.dev/projects/rag-chat) | Retrieval-augmented chat with conditional Three.js rendering | OpenAI · pgvector · Supabase |
| [Training Pipeline](https://davidpapp.dev/projects/training) | Codebase → LoRA fine-tune dataset with AST-aware chunking | HuggingFace · JSONL · Supabase |
| [Portfolio Platform](https://davidpapp.dev/projects/portfolio) | This repo — auth, theming, referrals, rate limiting | Next.js · Clerk · Tailwind v4 |

---

## Tech Stack

**Core:** Next.js 16 · TypeScript 5.7 · Tailwind CSS v4 · shadcn/ui · Aceternity UI

**Auth & Data:** Clerk · Supabase (pgvector + RLS) · Upstash Redis

**Infra:** Vercel · Husky · ESLint · Prettier

---

## Getting Started

```bash
git clone https://github.com/pappdavid/portfolio-platform.git
cd portfolio-platform
cp env.example.txt .env.local   # fill in required keys — see env.example.txt
npm install
npm run dev                      # http://localhost:3000
```

See [`env.example.txt`](./env.example.txt) for all required environment variables (Clerk, Supabase, Upstash, OpenAI).

---

## Contact

[contact@davidpapp.dev](mailto:contact@davidpapp.dev) · [linkedin.com/in/dávid-papp](https://www.linkedin.com/in/dávid-papp) · [davidpapp.dev](https://davidpapp.dev)
