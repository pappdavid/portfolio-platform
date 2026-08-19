# VoidArch Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-quality `/voidarch` preview surface with an interactive architecture atlas, route-reactive liquid WebGL2 field, evidence-first architecture content, machine-readable endpoints, and unique lower-page visualizations.

**Architecture:** The route lives outside the existing `(public)` layout so it does not inherit the portfolio CRT/constellation treatment. A typed architecture data module is the single source of truth for the atlas, evidence, maturity labels, and JSON endpoints. A client-side atlas component owns pan/zoom/focus/route playback and the WebGL2 shader; lower sections consume the same data but deliberately use different visual grammars.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.7, CSS Modules, raw WebGL2, SVG, Node 24 test runner, Playwright for browser verification.

**Spec:** `docs/superpowers/specs/2026-08-19-voidarch-site-design.md`

## Global Constraints

- Work only on branch `dev/voidarch-site-20260819`; do not update `main`.
- Deploy only to Vercel Preview; do not create or promote a production deployment.
- Maturity labels are limited to `WORKING`, `ACTIVE`, `PROTOTYPE`, `PLANNED`, `FUTURE`, and `EXTERNAL`.
- Hermes is an external testbed/integration surface, never represented as VoidArch-owned core technology.
- WebGL2 is progressive enhancement: the page and atlas must remain usable when WebGL2 is unavailable or reduced motion is requested.
- Studio topology and ecosystem boundary graphics must each use one coordinate system so nodes and connectors cannot drift independently.
- No repeated generic card/table visualization for successive sections; each major section gets a distinct representation.
- Existing portfolio content checks and TypeScript checks must continue to pass. The pre-existing strict-lint error in `src/components/landing/referral-banner.tsx` is baseline debt and must not be worsened.

---

### Task 1: Test Infrastructure and Typed Architecture Model

**Files:**
- Modify: `package.json`
- Create: `src/lib/voidarch/architecture.ts`
- Create: `src/lib/voidarch/architecture.test.ts`

**Interfaces:**
- Produces: `VOIDARCH_NODES`, `VOIDARCH_EDGES`, `VOIDARCH_EVIDENCE`, `VOIDARCH_MATURITY`, `getVoidArchNode(id)`.
- Node IDs: `context | memory | models | router | tools | studio | policy | evidence`.

- [ ] **Step 1: Write failing Node tests** asserting eight unique nodes, exactly three core nodes, allowed maturity labels only, Hermes external-only wording, valid edge endpoints, and evidence for Context/Router/Studio.
- [ ] **Step 2: Run `node --test --experimental-strip-types src/lib/voidarch/architecture.test.ts`** and confirm assertions fail because the model is absent.
- [ ] **Step 3: Implement the minimal typed architecture model** with factual current/planned content and explicit maturity labels.
- [ ] **Step 4: Re-run the architecture tests** and confirm they pass.
- [ ] **Step 5: Commit** `test/feat: add VoidArch architecture model`.

### Task 2: Machine-Readable Architecture and Evidence Endpoints

**Files:**
- Create: `src/app/voidarch/architecture.json/route.ts`
- Create: `src/app/voidarch/evidence.json/route.ts`
- Extend: `src/lib/voidarch/architecture.test.ts`

**Interfaces:**
- `GET /voidarch/architecture.json` returns `{ name, maturityLegend, nodes, edges }`.
- `GET /voidarch/evidence.json` returns `{ name, evidence }`.

- [ ] **Step 1: Add failing tests** for serializable endpoint payload builders exported from the architecture module.
- [ ] **Step 2: Run tests and verify the new assertions fail.**
- [ ] **Step 3: Add `getArchitectureManifest()` and `getEvidenceManifest()`** and route handlers returning `Response.json(...)`.
- [ ] **Step 4: Re-run tests and TypeScript.**
- [ ] **Step 5: Commit** `feat: expose VoidArch machine-readable manifests`.

### Task 3: Route Shell, Theme, and WebGL2 Field

**Files:**
- Create: `src/app/voidarch/page.tsx`
- Create: `src/app/voidarch/voidarch.module.css`
- Create: `src/components/voidarch/voidarch-experience.tsx`
- Create: `src/components/voidarch/liquid-field.tsx`
- Create: `tests/voidarch/voidarch.spec.mjs`
- Modify: `package.json` (browser-test script / Playwright dev dependency)

**Interfaces:**
- `<VoidArchExperience />` renders the full route.
- `<LiquidField focus routeEnergy routePhase enabled />` is decorative and never required for navigation/content.

- [ ] **Step 1: Add Playwright test tooling and write a failing browser test** that expects `/voidarch` to render the hero thesis, the atlas, and `WORKING/PROTOTYPE/ACTIVE` maturity text.
- [ ] **Step 2: Start local Next dev server and run the browser test; verify it fails with `/voidarch` missing.**
- [ ] **Step 3: Implement the route shell and CSS Module**, isolated from `(public)` CRT styling.
- [ ] **Step 4: Implement raw WebGL2 liquid field** with violet/cyan caustic shimmer, focus attraction, route-reactive sweep, resize handling, context-loss fallback, and reduced-motion disablement.
- [ ] **Step 5: Re-run browser test and verify the static route passes.**
- [ ] **Step 6: Commit** `feat: add VoidArch route shell and liquid field`.

### Task 4: Interactive Atlas and Route Playback

**Files:**
- Create: `src/components/voidarch/signal-atlas.tsx`
- Extend: `src/app/voidarch/voidarch.module.css`
- Extend: `tests/voidarch/voidarch.spec.mjs`

**Interfaces:**
- Atlas receives typed nodes/edges from `architecture.ts`.
- Interactions: pan, wheel zoom, reset, node focus drawer, route playback, close drawer.
- Route playback sequence: Context → Router → Models/Tools → Studio → Evidence.

- [ ] **Step 1: Add failing browser tests** for clicking Router, opening its inspector, zoom/reset, route playback reaching Evidence, and no node/edge drift after viewport resize.
- [ ] **Step 2: Run the tests and verify failures.**
- [ ] **Step 3: Implement atlas camera state and SVG edges in one coordinate system.**
- [ ] **Step 4: Implement inspector drawer and route playback, wiring focus/energy/phase into the shader.**
- [ ] **Step 5: Run browser tests until all atlas interactions pass.**
- [ ] **Step 6: Commit** `feat: make VoidArch atlas interactive`.

### Task 5: Distinct Architecture, Evidence, Memory, Routing, Studio, Adaptation, Boundary, and Lineage Views

**Files:**
- Create: `src/components/voidarch/architecture-sections.tsx`
- Extend: `src/app/voidarch/voidarch.module.css`
- Extend: `tests/voidarch/voidarch.spec.mjs`

**Interfaces:**
- Architecture: responsibility rows (used once).
- Evidence: proof cards (used once).
- Memory: interactive orbit / lifecycle visualization.
- Routing: narrowing SVG route path.
- Studio: single-SVG execution topology + trace/control workspace.
- Adaptation: observe → propose → sandbox → promote loop.
- Boundary: single-SVG core/ecosystem map.
- Lineage: directional extraction rail.

- [ ] **Step 1: Add failing browser tests** for section headings, memory-type interaction, fixed Studio graph labels, ecosystem boundary labels, and explicit `PLANNED/FUTURE/EXTERNAL` content.
- [ ] **Step 2: Run and verify failures.**
- [ ] **Step 3: Implement each section with its unique visual grammar**, consuming the typed architecture content where applicable.
- [ ] **Step 4: Re-run browser tests and verify all section behaviors.**
- [ ] **Step 5: Commit** `feat: add VoidArch architecture evidence views`.

### Task 6: Accessibility, Responsive Behavior, and Fallbacks

**Files:**
- Extend: `src/components/voidarch/*.tsx`
- Extend: `src/app/voidarch/voidarch.module.css`
- Extend: `tests/voidarch/voidarch.spec.mjs`

**Interfaces:**
- Keyboard-focusable atlas nodes and controls.
- Reduced motion disables route animation timing and shader animation without hiding content.
- Mobile route remains navigable without drag interaction.

- [ ] **Step 1: Add failing browser tests** for keyboard focus, 390px viewport layout, reduced-motion mode, and shader-off fallback.
- [ ] **Step 2: Run and verify failures.**
- [ ] **Step 3: Implement responsive/fallback behavior and accessible names.**
- [ ] **Step 4: Re-run browser tests.**
- [ ] **Step 5: Commit** `fix: harden VoidArch accessibility and fallbacks`.

### Task 7: Full Verification and Preview Deployment

**Files:**
- Modify only if verification exposes branch-local defects.

**Interfaces:**
- Preview-only Vercel deployment from `dev/voidarch-site-20260819`.

- [ ] **Step 1: Run `npm run check:content`.** Expected PASS.
- [ ] **Step 2: Run `npm run typecheck`.** Expected PASS.
- [ ] **Step 3: Run `npm run lint:strict`.** Expected only the documented pre-existing `referral-banner.tsx:14` baseline error; no VoidArch errors.
- [ ] **Step 4: Run VoidArch Node tests.** Expected PASS.
- [ ] **Step 5: Run production `npm run build`.** Expected PASS.
- [ ] **Step 6: Start production server and run full Playwright suite against it.** Expected PASS.
- [ ] **Step 7: Push branch and confirm Vercel Preview deployment succeeds.**
- [ ] **Step 8: Verify preview `/voidarch`, JSON manifests, interactions, responsive viewport, WebGL fallback, and runtime logs.**
- [ ] **Step 9: Do not merge, promote, alias, or deploy to production.**
