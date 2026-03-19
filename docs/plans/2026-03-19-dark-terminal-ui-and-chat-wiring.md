# Design: Dark Terminal UI + Chat Service Wiring

**Date:** 2026-03-19
**Status:** Approved

## Summary

Apply the "Dark Terminal" visual system (Style A) across all public pages and wire the public Chat page to the real streaming API with a tighter rate limit.

## Visual System

| Token | Value |
|-------|-------|
| Background | `#060608` |
| Grid overlay | 52px, `rgba(255,255,255,0.022)` lines |
| Card bg | `rgba(255,255,255,0.04)` + backdrop-blur |
| Card border | `rgba(255,255,255,0.07)` |
| Accent green | `#22c55e` — MCP Sentinel |
| Accent purple | `#a855f7` — Custom Training |
| Accent orange | `#f97316` — RAG + 3D Chat |
| Heading font | Inter 800, gradient `#fff → rgba(255,255,255,0.55)` |
| Mono font | JetBrains Mono — eyebrows, code, metrics |
| Button primary | `bg-[#22c55e] text-black` + green glow shadow |
| Button ghost | glass bg + `rgba(255,255,255,0.08)` border |

### Shared Layout Components

- **`GridBackground`** — fixed full-bleed grid overlay, z-index 0
- **`GlassCard`** — wrapper with glass bg, border, backdrop-blur, optional colored glow
- **`DarkSection`** — full-width section with `bg-[rgba(255,255,255,0.015)]` + border-y for alternating sections
- **`MonoEyebrow`** — uppercase JetBrains Mono pill badge with accent color border

## Pages

### `/` Landing (`landing-content.tsx`)
- Split hero: text left, architecture SVG diagram right
- SVG diagram: Agent → MCP Sentinel (shield) → Tools, blocked path down, event log up
- Stats bar: mono numbers with green/cyan gradient text
- Pillar cards: GlassCard with per-product SVG illustration + colored glow
- Terminal quickstart block: styled `<pre>` with syntax token spans
- Philosophy: numbered 01/02/03 in large faded mono

### `/mcp` (`mcp-content.tsx`)
- Dark hero matching landing style (MonoEyebrow, gradient H1)
- What/Who/Why: glass cards instead of plain divs
- Live demo: keep mock events, restyle event rows as terminal log lines
- Mermaid diagrams: dark background card
- Pricing: GlassCard pair

### `/training` (`training-content.tsx`)
- Dark hero
- Stepper: dark step circles, glass content card
- Mode selection: glass cards with accent border on selected
- Code blocks: match terminal style

### `/chat` (`chat-content.tsx`)
- Dark hero
- **Wire to `/api/chat`**: SSE streaming, replaces setTimeout simulation
- Upload area: dark dashed border
- Chat bubbles: user = green-tinted, assistant = glass card
- 3D viewer placeholder: dark with subtle cube wireframe SVG

### Public nav/footer
- Dark background, glass border-bottom on nav
- Footer: minimal, mono font, dark

## Chat API Wiring

### Rate limit change (`src/lib/rate-limit.ts`)
- Add `chatPublicRateLimit`: **2 req/hr** sliding window (down from 10)
- `chatAuthRateLimit` stays at 50/hr

### `/api/chat/route.ts`
- Switch unauthenticated users to `chatPublicRateLimit` (2/hr)
- No other changes needed — streaming SSE already implemented

### `chat-content.tsx`
- `handleSend` calls `POST /api/chat` with `{ messages, context }`
- Reads SSE stream: `data: {"content": "..."}` chunks appended to last assistant message
- `data: [DONE]` closes the stream
- Context: concatenate uploaded file content (already stored in state as names; upgrade to content reading via FileReader)
- Show typing indicator while streaming

## What Stays the Same
- Dashboard pages (already connected to real APIs, no UI changes)
- MCP demo: mock events (no real API call from public page)
- Training stepper: no real API call from public page
- All API routes except rate-limit change in `/api/chat`

## Shared Components to Create
- `src/components/ui/glass-card.tsx`
- `src/components/ui/grid-background.tsx`
- `src/components/ui/mono-eyebrow.tsx`
- `src/components/ui/dark-section.tsx`

## Out of Scope
- Dashboard UI (already functional)
- Domain name (purchased separately)
- Three.js integration (3D viewer stays as placeholder)
- Authentication flows
