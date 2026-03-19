# Handoff: Phase 3 — Skills & About Overhaul

**Depends on:** Phase 1 complete (Phase 2 recommended first for evidence links)
**Estimated effort:** 1–2 days

---

## Goal

Replace the tag cloud with evidence-backed, grouped skills that link to proof.

---

## Current State (Phase 1 already fixes this partially)

Phase 1 replaces the badge tag cloud with 5 grouped sections. Phase 3 completes this by:
- Adding actual evidence links to each group (linking to project pages)
- Adding proficiency labels ("Daily use" / "Active" / "Familiar")
- Ensuring section order on About page is correct

---

## Final Skills Section Design

### Section order on About page:
1. Bio paragraph
2. "What I Do" role cards
3. _(Phase 2: Projects summary)_
4. **Skills** (grouped, with evidence)
5. CTA (Email / Calendly / CV)

---

## Skills Groups (final version with evidence links)

```
┌─────────────────────────────────────────────────────────┐
│ LLM Application Layer                    Daily use       │
│ Prompt engineering · Structured outputs · Tool calling   │
│ → Evidence: MCP Sentinel, RAG Chat                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ RAG & Retrieval                          Active          │
│ Chunking · Embeddings · Vector search · Reranking        │
│ → Evidence: RAG Chat                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Agentic Systems                          Daily use       │
│ MCP · Guard rails · Injection detection · Observability  │
│ → Evidence: MCP Sentinel                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Full-Stack Engineering                   Daily use       │
│ Next.js · TypeScript · Supabase · Clerk · Vercel         │
│ → Evidence: This portfolio platform                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Model Training & Infra                   Active          │
│ LoRA fine-tuning · JSONL prep · Evaluation · Docker      │
│ → Evidence: Training Pipeline                           │
└─────────────────────────────────────────────────────────┘
```

Each card:
- Group title (bold)
- Proficiency badge: "Daily use" (green) / "Active" (blue) / "Familiar" (gray)
- 1-sentence context: what you actually did with these skills
- Evidence link: "→ See [Project Name]" linking to project detail page
- Technology tags: small badges

---

## Component Design

Create `src/components/about/skills-section.tsx`:

```tsx
// Each skill group is a card with:
// - title + proficiency badge (top row)
// - context sentence (muted text)
// - evidence link (green, small)
// - tech tags (secondary badges)
```

Use the same card style as "What I Do" cards (`bg-background rounded-xl border p-6`).

Grid: `grid-cols-1 gap-4 sm:grid-cols-2` with the last card (Model Training) spanning full width or left-aligned.

---

## Context Sentences (write these)

Fill these in before implementing:

| Group | Context sentence |
|-------|-----------------|
| LLM Application Layer | "Built the tool-call evaluation pipeline in MCP Sentinel that routes inputs through configurable guard rules before execution." |
| RAG & Retrieval | "Implemented chunking, embedding, and hybrid reranking for the RAG Chat retrieval pipeline." |
| Agentic Systems | "Designed MCP Sentinel's guard rail architecture — injection detection, PII filtering, and cost guards as composable middleware." |
| Full-Stack Engineering | "Built this portfolio platform end-to-end: auth (Clerk), database (Supabase + RLS), rate limiting (Upstash), and deployment (Vercel)." |
| Model Training & Infra | "Built the dataset-to-LoRA pipeline in Custom Training: codebase ingestion, JSONL formatting, and fine-tune job management." |

---

## Notes

- Phase 1 already adds a simplified version of these groups to About page
- Phase 3 upgrades them with evidence links once project pages are complete (Phase 2)
- Don't add evidence links until the linked pages actually have the content to back them up
