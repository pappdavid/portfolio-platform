# VoidArch Site Design

Date: 2026-08-19
Branch: `dev/voidarch-site-20260819`
Target repo: `pappdavid/portfolio-platform`
Deployment target: Vercel Preview only

## Goal

Implement a dedicated `/voidarch` public surface that presents VoidArch as a living technical instrument rather than a conventional product landing page. The page must communicate the architecture, current maturity, evidence paths, and future direction while staying clear about what is working, active, prototype, planned, future, or external.

The current portfolio homepage remains unchanged. This work is isolated to a development branch and must not be deployed to production or merged to `main` during this task.

## Core narrative

VoidArch is presented as the systems layer extracted from repeated AI projects:

1. **Context** keeps persistent memory, task state, provenance, retrieval, and working context coherent.
2. **Router** chooses tools, models, skills, and execution paths under capability, cost, latency, reliability, and policy constraints.
3. **Studio** exposes orchestration, traces, operator control, quality signals, and runtime state.
4. **Memory, Policy, Models, Tools, and Evidence** support those three core layers.
5. **Void-Arch** is the future operating-environment destination enabled by these primitives.

Hermes is explicitly labeled as an external integration/testbed, not a VoidArch-owned core system.

## Visual system

### Default state

The default palette is a restrained near-black / warm graphite system with editorial typography and sparse instrumentation. The page should not inherit the existing public CRT/constellation treatment.

### Active computation state

Purple, electric blue, cyan, and restrained magenta appear only during active subsystem focus, route playback, and deep inspection. This gives color semantic meaning instead of coating the entire site in permanent neon.

### WebGL2 field

The atlas hero includes a raw WebGL2 background effect with:

- domain-warped liquid motion rather than zebra/wave striping;
- sparse caustic shimmer and subtle luminous flow;
- focus halos that react to selected nodes;
- route-reactive energy and sweep states;
- pointer-reactive distortion kept subtle enough not to compete with labels;
- reduced-motion handling;
- graceful fallback to static CSS atmosphere if WebGL2 is unavailable.

No new 3D dependency is required. The repository already contains Three.js / React Three Fiber, but the atlas background should remain a focused raw WebGL2 component unless the implementation proves materially simpler using the existing renderer.

## Page structure

### 1. Signal Atlas hero

The first viewport is an explorable architecture map. It contains:

- Context
- Router
- Studio
- Memory Fabric
- Models
- Tools
- Policy Gate
- Evidence

Interactions:

- drag to pan;
- wheel / buttons to zoom;
- click a node to focus it;
- focus opens an inspector drawer;
- selected node reframes the atlas;
- route playback highlights actual graph paths;
- shader reacts to focus and route state;
- reset returns to the system-wide view.

The atlas is implemented in one coherent coordinate system. Node geometry and edges must not use independent positioning logic that can drift apart.

### 2. Architecture

A concise editorial section explains the three primary layers once. It must not repeat the same visual card pattern used elsewhere.

### 3. Evidence

Every major architectural claim gets one-click evidence paths such as:

- repository;
- implementation path;
- graph/demo;
- trace;
- tests;
- evaluation;
- artifact.

Evidence data is centralized rather than repeated across components.

### 4. Lineage

A directional journey shows:

`experiments → recurring problems → extracted primitives → VoidArch → Void-Arch`

This section is not a repository gallery. Projects appear only as evidence of the architectural primitives they produced.

### 5. System horizon

A staged visual timeline shows current, near-term, later, and future architectural scope. Planned systems include:

- transactional context;
- context budget scheduling;
- memory consolidation;
- capability graph routing;
- specialist router model;
- verification fabric;
- policy / approval graph;
- constrained self-improvement loop.

All items must carry explicit maturity labels.

### 6. Memory model

An interactive topology shows distinct memory categories and lifecycle:

- semantic / durable entity memory;
- episodic memory;
- operational task/blocker state;
- consolidated / derived concepts;
- failure memory;
- temporary working context.

Clicking memory classes changes explanatory text and status.

### 7. Routing model

A dedicated flow visualization shows:

`request → intent → candidate assembly → scoring → policy/cost filtering → execution → fallback/outcome learning`

The router explicitly considers capability, reliability, latency, token cost, provider quota, cache state, and policy constraints.

### 8. Studio

Studio is rendered as an operational run surface rather than a generic graph panel. It contains:

- mission state;
- execution topology;
- live trace preview;
- cost / latency / quality telemetry;
- operator actions.

The execution topology is owned by one SVG renderer so lines and nodes cannot become misaligned.

### 9. Adaptation loop

A controlled self-improvement loop shows:

`observe → propose → sandbox → promote`

The copy explicitly rejects unconstrained self-modification. Improvements must be validated, versioned, attributable, and reversible.

### 10. Integration boundary

A boundary map distinguishes core ownership from ecosystem integrations:

Core:
- Context
- Router
- Studio

External / integration surfaces:
- Hermes
- MCP
- model pools
- storage adapters
- observability exporters
- Void-Arch future surface

The boundary graph is also owned by one SVG coordinate system.

## Content model

The page uses a centralized typed content model. Each subsystem contains:

- `id`
- `title`
- `group`
- `summary`
- `role`
- `owns`
- `connects`
- `maturity`
- `bullets`
- `evidence[]`

Maturity values are restricted to:

- `working`
- `active`
- `prototype`
- `planned`
- `future`
- `external`

This same model powers the page, inspector, and machine-readable outputs so wording cannot drift between surfaces.

## Machine-readable surfaces

Expose the public architecture content as lightweight machine-readable data at:

- `/voidarch/architecture.json`
- `/voidarch/evidence.json`

These should be static or route-generated JSON using the same source data as the UI. They do not expose private implementation data or secrets.

## Implementation isolation

The `/voidarch` route gets its own layout or route-local shell so it does not inherit the public CRT scanline / constellation background.

The existing portfolio homepage, referral flow, chat, projects, and other public routes must remain behaviorally unchanged.

## Accessibility and resilience

Required behavior:

- keyboard-focusable atlas nodes;
- semantic buttons and headings;
- reduced-motion mode;
- WebGL2 fallback;
- readable content with JavaScript-disabled graceful degradation where practical;
- no critical information encoded by color alone;
- mobile layout where the atlas remains navigable and the inspector becomes a full-width drawer/sheet.

## Testing requirements

The task is not complete until all applicable checks pass:

1. `npm run typecheck`
2. `npm run lint:strict`
3. `npm run check:content`
4. `npm run build`
5. route/content tests for VoidArch content and JSON endpoints
6. WebGL fallback test or deterministic feature-detection test
7. reduced-motion path test
8. responsive smoke test for desktop and mobile
9. interaction smoke test for:
   - node focus;
   - zoom/pan reset;
   - route playback;
   - inspector content;
   - memory model interaction;
10. graph geometry verification for Studio and integration map
11. Vercel Preview build succeeds
12. live preview route `/voidarch` loads successfully
13. no preview runtime errors for the new route during verification

Any failed check must be fixed and rerun before completion is claimed.

## Deployment rules

- Branch only: `dev/voidarch-site-20260819`
- Vercel environment: Preview
- Do not merge to `main`
- Do not promote preview to production
- Do not change production domains
- Do not alter production environment variables unless required for read-only compatibility; this implementation should not require new secrets

## Expected file boundaries

Exact filenames may follow existing repository conventions, but the design should stay near these boundaries:

- `src/app/(voidarch)/voidarch/page.tsx` or an equivalent isolated route
- `src/app/(voidarch)/layout.tsx`
- `src/components/voidarch/voidarch-page.tsx`
- `src/components/voidarch/signal-atlas.tsx`
- `src/components/voidarch/liquid-field.tsx`
- `src/components/voidarch/studio-topology.tsx`
- `src/components/voidarch/integration-boundary.tsx`
- `src/components/voidarch/memory-model.tsx`
- `src/components/voidarch/routing-flow.tsx`
- `src/data/voidarch.ts`
- JSON route handlers or static assets for architecture/evidence
- focused tests near the new code

Avoid unrelated refactors.

## Success criteria

A successful result is a working Vercel Preview where `/voidarch` feels like a distinctive technical instrument, not a generic AI landing page; communicates substantial architecture and roadmap content without falsely presenting planned work as shipped; keeps the graph geometry and WebGL interaction reliable; and leaves the existing production portfolio untouched.
