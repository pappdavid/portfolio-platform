# Design: Phase 1 — Portfolio Narrative Fix

**Date:** 2026-03-19
**Status:** Approved
**Scope:** Phase 1 only — narrative, links, nav, background, SaaS cleanup

---

## Goal

Pass the 90-second recruiter test. Remove all "product site" signals, establish identity-first copy, fix broken/wrong links, implement MeshWave background on homepage, clean up nav.

---

## Decisions Made

| Decision | Choice |
|----------|--------|
| Diagrams (Phase 2) | Custom React interactive components |
| Nav restructure | Keep detail pages, remove from top nav |
| Inner page background | Subtle radial gradient (MeshWave homepage-only) |
| CV | Placeholder button → `/cv.pdf` |

---

## Changes by File

### `src/components/layout/public-header.tsx`
- Capitalize logo: `david_papp` → `David_Papp`
- Remove `Dashboard →` button (both desktop and mobile)
- Remove MCP Sentinel, Training, Chat from nav items
- Add `Contact` as a `mailto:contact@davidpapp.dev` link

### `src/config/nav-config.ts`
- `publicNavItems`: keep only Home, Projects, About

### `src/components/landing/landing-content.tsx`
- Replace `BackgroundBeams` with `MeshWave` (per `docs/handoff-mesh-wave-background.md`)
- Hero headline: `"Build AI products that ship."` → `"I build production-grade\nLLM systems."`
- Hero subtext: update to identity-first copy
- Remove `"View Dashboard →"` CTA
- Update email → `contact@davidpapp.dev`
- Update Calendly → `https://calendly.com/david-webinform/30min`
- Remove entire stats strip (`40%`, `Zero`, `3×`)
- Update quickstart comment: `@your-org/mcp-sentinel` → add `// Reference implementation — github.com/pappdavid/mcp-sentinel`

### `src/components/ui/mesh-wave.tsx` (new file)
- Canvas-based animated mesh wave per handoff doc
- `fixed inset-0 pointer-events-none z-0`
- Parameters: COLS=28, ROWS=18, AMP=22, FREQ=0.0038, SPEED=0.00055
- Green horizontal lines, cyan vertical, nodes at intersections
- RAF loop with cleanup on unmount

### `src/app/(public)/layout.tsx`
- Add subtle radial gradient to inner pages background div

### `src/components/layout/footer.tsx`
- GitHub → `https://github.com/pappdavid`
- LinkedIn → `https://linkedin.com/in/d%C3%A1vid-papp` (canonical encoded form)
- Remove Privacy, Terms, Security links
- Keep About link

### `src/app/(public)/about/page.tsx`
- GitHub → `https://github.com/pappdavid`
- LinkedIn → `https://www.linkedin.com/in/dávid-papp`
- Email → `contact@davidpapp.dev`
- Calendly → `https://calendly.com/david-webinform/30min`
- Add CV download button (links to `/cv.pdf`)
- Replace badge tag cloud with 5 grouped skill sections (see below)
- Move skills section after "What I Do" cards

**Skills groups:**
1. **LLM Application Layer** — Daily use — "Prompt engineering, structured outputs, tool calling"
2. **RAG & Retrieval** — Active — "Chunking, embeddings, vector search, reranking"
3. **Agentic Systems** — Daily use — "MCP, guard rails, injection detection, observability"
4. **Full-Stack Engineering** — Daily use — "Next.js, TypeScript, Supabase, Clerk, Vercel"
5. **Model Training & Infra** — Active — "LoRA fine-tuning, JSONL prep, evaluation, Docker"

### `src/components/mcp/mcp-content.tsx`
- Remove pricing table section entirely
- Rename "Integration Guide" tab/heading → "How It Works"
- Replace `@your-org/mcp-sentinel` with a comment pointing to GitHub
- Remove or collapse FAQ accordion into architecture section

---

## Contact Values (canonical)

| Field | Value |
|-------|-------|
| Email | `contact@davidpapp.dev` |
| GitHub | `https://github.com/pappdavid` |
| LinkedIn | `https://www.linkedin.com/in/dávid-papp` |
| Calendly | `https://calendly.com/david-webinform/30min` |
| CV | `/cv.pdf` (placeholder — drop file in `public/`) |

---

## Out of Scope (Phase 2/3)

- Architecture diagrams (custom React interactive)
- Per-project problem statements, code snippets, results
- GitHub links on project pages
- "What this demonstrates" demo context
- OG metadata and title tags audit
- Lighthouse/performance audit
