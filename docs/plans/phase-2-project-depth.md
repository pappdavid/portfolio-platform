# Handoff: Phase 2 — Project Depth

**Depends on:** Phase 1 complete
**Estimated effort:** 3–5 days

---

## Goal

Give a hiring manager enough to spend 8 minutes on each project page.

---

## Per-Project Checklist (all 3 projects)

For each of `/mcp`, `/training`, `/chat`:

- [ ] **Problem statement** — 2–3 sentences. What real-world pain? Who has it?
- [ ] **Architecture diagram** — Custom interactive React component (decided in Phase 1 brainstorm). See spec below.
- [ ] **Tech stack rationale** — 1 sentence per major choice (not just tags)
- [ ] **Code snippet** — One non-trivial, well-commented block showing core logic
- [ ] **Results / Impact** — Honest framing: "Demonstrates X" or "Reference implementation"
- [ ] **Screenshots / GIFs** — At least 2–3 per project showing UI in action
- [ ] **"What this demonstrates"** — 2–3 bullets before every interactive demo
- [ ] **GitHub link** — Public repo link OR "Private repo — code samples available on request"

---

## Architecture Diagram Spec

**Technology decision:** Custom React interactive components (not Mermaid, not static SVG)

**Requirements per diagram:**
- Dark background matching site theme (`#060608` / `#0a0a0c`)
- Hover states on nodes — tooltip or highlight showing what that component does
- Animated flow lines (dashed, directional) showing data moving between components
- Color coding: green = guard/security, cyan = data flow, purple = model/ML, orange = retrieval
- Mobile-responsive (stacks or scales down gracefully)

**MCP Sentinel diagram nodes:**
```
[Agent] → [MCP Sentinel] → [Tools]
               ↓
          [Event Log]
               ↓
         [BLOCKED] (on violation)
```

**Training Pipeline diagram nodes:**
```
[Codebase / Docs] → [Chunker] → [JSONL Dataset] → [LoRA Fine-tune] → [Eval]
```

**RAG Chat diagram nodes:**
```
[Documents] → [Embedder] → [Vector Store]
                                  ↓
[User Query] → [Retriever] → [LLM] → [Response]
                    ↑
              [Reranker]
```

---

## GitHub Link Strategy

For each project, decide:
1. **Public repo** → link directly with `View on GitHub →` button
2. **Private repo** → "Private repo — code samples available on request" with email CTA
3. **Single file** → link to the most illustrative file (e.g. `guard-evaluator.ts`)

Even a single well-documented file > nothing.

---

## Suggested Code Snippets

**MCP Sentinel:** The guard evaluation loop — show how a tool call input is evaluated against injection/PII/cost rules

**Training Pipeline:** The chunking strategy — how documents are split and formatted into JSONL

**RAG Chat:** The retrieval + reranking step — how query embedding matches against stored vectors

---

## Results Framing Guide

Be honest. Recruiters respect honest framing over unverifiable claims.

Good:
- "Demonstrates sub-200ms guard evaluation on 95th percentile of test inputs"
- "Reference implementation — not production-deployed"
- "Retrieval precision@5: X% on [dataset name]"

Bad:
- "40% fewer support calls" (unverifiable)
- "Zero injection incidents" (unverifiable)

---

## File Locations

| Project | Detail page | Component |
|---------|-------------|-----------|
| MCP Sentinel | `src/app/(public)/mcp/page.tsx` | `src/components/mcp/mcp-content.tsx` |
| Training | `src/app/(public)/training/page.tsx` | `src/components/training/training-content.tsx` |
| RAG Chat | `src/app/(public)/chat/page.tsx` | `src/components/chat/chat-content.tsx` |

Project detail pages also exist at:
- `src/app/(public)/projects/mcp-sentinel/page.tsx`
- `src/app/(public)/projects/training/page.tsx`
- `src/app/(public)/projects/rag-chat/page.tsx`

Decide whether to consolidate or keep both routes.

---

## OG Metadata (do in Phase 2)

Set on every page:
- `og:title` — e.g. "MCP Sentinel — David Papp"
- `og:description` — 1-sentence project summary
- `og:image` — 1200×630 branded image (dark theme, name + title)

Create a shared `generateMetadata()` helper in `src/lib/metadata.ts`.

Title tag pattern:
- Homepage: `David Papp — AI Engineer`
- Project pages: `[Project Name] — David Papp`
- About: `About — David Papp`
