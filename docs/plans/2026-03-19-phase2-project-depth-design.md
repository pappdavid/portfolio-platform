# Design: Phase 2 — Project Depth

**Date:** 2026-03-19
**Status:** Approved
**Depends on:** Phase 1 complete

---

## Goal

Give a hiring manager enough to spend 8 minutes on each project page. Three detail pages rebuilt end-to-end with interactive architecture diagrams, honest results framing, screenshots, and OG metadata.

---

## Approach

Bottom-up: build shared infrastructure once, apply to all three project pages.

---

## Section 1: Shared Infrastructure

### React Flow Diagram Component

- Install `@xyflow/react` (React Flow v12)
- Lazy-loaded via `next/dynamic` to avoid bundle bloat
- **`src/components/shared/arch-diagram.tsx`** — wrapper accepting `nodes` + `edges` config
  - Dark theme: `#060608` background, custom node styles
  - Animated dashed edges (built-in React Flow `animated` prop)
  - Hover tooltip panel showing what each node does
  - Non-interactive except hover (no drag, no pan)
  - Mobile-responsive (scales down, min-height 300px)

### Node color coding

| Color | Role |
|-------|------|
| Green `#22c55e` | Guard / security |
| Cyan `#06b6d4` | Data flow / pipeline steps |
| Purple `#a855f7` | Model / ML |
| Orange `#f97316` | Retrieval |

### Metadata Helper

- **`src/lib/metadata.ts`** — `generateMetadata({ title, description, slug })` returns Next.js `Metadata`
- Title pattern: `"[Project Name] — David Papp"`
- OG image: `/og/[slug].png` (static 1200×630)

### Screenshot Pipeline

- Start dev server
- Use Playwright MCP to capture each page at 1280px (desktop) and 375px (mobile)
- Save to `public/screenshots/{project}/desktop.png` and `mobile.png`
- OG images: Playwright screenshot of a minimal dark HTML template per project, saved to `public/og/`

---

## Section 2: Project Page Structure

Each `/projects/*` detail page rebuilt with this section order:

1. **Hero** — title, badge, 1-sentence summary, "View demo" + "View code" buttons
2. **Problem statement** — 2–3 sentences. Real-world pain, who has it
3. **"What this demonstrates"** — 3 bullets (engineering signals for recruiters)
4. **Architecture diagram** — React Flow, full-width, ~400px tall
5. **Tech stack rationale** — 1 sentence per major choice (not just tags)
6. **Code snippet** — existing `CodeBlock`, keep current snippets
7. **Results / Impact** — honest framing ("demonstrates X", no fake metrics)
8. **Screenshots** — desktop + mobile, `next/image`
9. **GitHub link** — links to `github.com/pappdavid/portfolio-platform` with note: "Private implementation — code samples available on request"

### React Flow Node Configs

**MCP Sentinel**
```
[Agent] → [MCP Sentinel Proxy] → [Rate Limiter] → [Injection Detector] → [PII Scanner] → [Cost Tracker] → {All Pass?} → [Tools] / [BLOCKED]
                                                                                                                        ↓
                                                                                                                  [Event Log] → [Dashboard]
```
Colors: Sentinel = green, guards = green, tools = cyan, log/dashboard = cyan

**Training Pipeline**
```
[Git Repo] → [File Scanner] → [AST Parser] → [Semantic Chunker] → [Prompt Generator] → [Quality Filter] → [JSONL] → [LoRA Fine-tune] → [Eval]
```
Colors: pipeline steps = cyan, model = purple

**RAG Chat**
```
[Documents] → [Embedder] → [Vector Store]
                                  ↓
[User Query] → [Retriever] → [Reranker] → [LLM] → [Response]
```
Colors: retrieval = orange, model = purple, data flow = cyan

---

## Section 3: OG Metadata + Routing

### Metadata per page

| Page | Title | Description |
|------|-------|-------------|
| `/projects/mcp-sentinel` | MCP Sentinel — David Papp | Drop-in observability proxy for MCP agent tool calls — logs, guards, and audits every interaction. |
| `/projects/training` | Custom Training Pipeline — David Papp | Automated pipeline converting codebases into LoRA fine-tuning datasets. |
| `/projects/rag-chat` | RAG + 3D Chat — David Papp | Retrieval-augmented chat with document upload and Three.js spatial visualization. |

### Routing

No changes. Existing routes stay:
- `/mcp`, `/training`, `/chat` — product showcase pages, untouched
- `/projects/mcp-sentinel`, `/projects/training`, `/projects/rag-chat` — rebuilt detail pages
- `/projects` — listing page linking to the three detail pages

---

## File Changes Summary

| Action | File |
|--------|------|
| Create | `src/lib/metadata.ts` |
| Create | `src/components/shared/arch-diagram.tsx` |
| Rewrite | `src/app/(public)/projects/mcp-sentinel/page.tsx` |
| Rewrite | `src/app/(public)/projects/training/page.tsx` |
| Rewrite | `src/app/(public)/projects/rag-chat/page.tsx` |
| Add OG images | `public/og/mcp-sentinel.png`, `training.png`, `rag-chat.png` |
| Add screenshots | `public/screenshots/{project}/desktop.png`, `mobile.png` |
| Install | `@xyflow/react` |
