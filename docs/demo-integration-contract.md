# Demo integration contract — standalone repos → portfolio chat surface

This document specifies how the three standalone demo repos map onto the
`portfolio-platform` assistant chat surface. It is the porting spec for the
later work that wires `self-interview`, `rolefit-quiz`, and `task-to-flow`
into the existing `ContactSection` chat component in
`src/components/landing/landing-content.tsx`.

The contract assumes the existing architecture is not rewritten — the demos
drop in as new chip paths / custom-card types inside the current streaming
SSE envelope.

## Canonical shapes

### Message envelope

`src/components/landing/landing-content.tsx` defines `ChatMsg`:

```ts
type ChatMsg = {
  role: 'bot' | 'user';
  text: string;
  isCustomCard?: boolean;
  evidence?: ChatEvidence[];
};
```

All ported features must express their output as either:
- a streaming text delta appended to the last `bot` bubble (`parsed.type === 'delta'`), or
- a custom card inserted before the last bubble (`parsed.type === 'evidence'` / future `isCustomCard: true`).

**Rule:** never append a new `bot` bubble for a sub-feature response — the last
streaming bubble is the one the user sees "in progress."

### SSE frame contract (client side)

The client reads `event: message` frames shaped as:

```json
{ "type": "delta",   "content": "partial answer text" }
{ "type": "evidence", "items": [{ "id", "kind", "title", "summary", "href?" }] }
{ "type": "card",     "card": "<kind>", ...payload }
```

New card types (`card` frames) must be added to the `parsed` union in the
streaming reducer (around line 1338–1360 of `landing-content.tsx`) and a
dedicated renderer component. The `card` type is the extension point for
all three demos.

### API surface

`/api/chat` (`src/app/api/chat/route.ts`) accepts:

```ts
POST /api/chat
{ messages: { role: 'user' | 'assistant'; content: string }[] }
```

It streams SSE frames. The route already injects recruiter-chip answers via
`findRecruiterChipAnswer()` before the BM25 retrieval pass — any new
deterministic intent coverage (quiz step, interview step, flow step) should
follow the same pattern: detect intent at the top of `POST`, inject the
canonical answer into `augmentedContent`, then let streaming proceed.

**Rule:** no new LLM providers. All deterministic coverage must use existing
`corpus.ts`-grounded facts; anything requiring live LLM synthesis uses the
existing `PORTFOLIO_CHAT_MODEL` OpenRouter path.

### View-object extension points

`getJobTypeSiteView()` in `src/lib/job-type.ts` returns `JobTypeSiteView`,
which already carries the two new fields added by the polish pass:

```ts
recruiterChips: string[];        // non-technical chip questions
recruiterGreeting: string | null; // warmer greeting (null on general site)
```

To add demo-specific content to a role page, extend `JobTypeSiteView` with a
new optional field (e.g. `demoChips: { id: string; label: string }[]`) and
populate it from `JOB_TYPES[id].demoChips` in `getJobTypeSiteView`. The
default site view (no profile) must keep every new field empty/null so the
general `/` page stays byte-identical — this is asserted by
`src/lib/job-type.test.ts::general site reproduces today's copy exactly`.

## Per-repo mapping

### self-interview (`pappdavid/self-interview`)

A 9-question autoplay interview with typewriter answers, typing dots, and
receipt chips.

**Integration shape:** new `card` frame type `"interview"` carrying
`{ step, question, answer, receipt: { label }[] }`. The chat reducer inserts
an `isCustomCard: true` message rendered by an `InterviewCard` component
(two-column: question transcript left, receipt chips right).

**Entry point:** add an "Interview me" `recruiterChip` per role page
(question: `"Run me through a quick self-interview"`). `findRecruiterChipAnswer`
returns a stub answer for that question; the actual step-by-step flow is
driven by a follow-up `"next"` chip that posts `"interview:next"` to
`/api/chat`, which detects the token and emits `"interview"` card frames
instead of delta text.

**File contract:**
- new renderer: `src/components/landing/cards/interview-card.tsx`
- new chip question + answer: `src/lib/recruiter-chips.ts`
- new intent detection in `src/app/api/chat/route.ts` (token match on
  `"interview:next"` / `"interview:start"`)

### rolefit-quiz (`pappdavid/rolefit-quiz`)

A short multiple-choice quiz that maps answers to role-fit scores.

**Integration shape:** new `card` frame `"quiz"` with
`{ question, choices: { id, label }[], selectedId, result? }`. Rendered as an
in-chat poll the user can tap. Tapping a choice posts `"quiz:answer"` with
the choice id; the server computes the running fit scores and streams a new
`"quiz"` frame (or a final `"quiz-result"` frame).

**Entry point:** `recruiterChip` question `"Which role fits him best?"`.

**File contract:**
- `src/components/landing/cards/quiz-card.tsx`
- quiz corpus/answer key: `src/lib/rolefit-quiz-data.ts`
- intent + scoring in `src/app/api/chat/route.ts`

### task-to-flow (`pappdavid/task-to-flow`)

Describe a task, get a workflow diagram assembled from typed nodes.

**Integration shape:** new `card` frame `"flow"` with
`{ nodes: { id, label, type }[], edges: { from, to }[], summary: string }`.
Rendered as a compact SVG/DAG inside the chat bubble (inline SVG keeps it
dependency-free).

**Entry point:** `recruiterChip` question `"Turn a task into a flow for me"`.

**File contract:**
- `src/components/landing/cards/flow-card.tsx`
- layout helper: `src/lib/flow-layout.ts`
- intent detection + node assembly in `src/app/api/chat/route.ts`

## Byte-identical general site constraint

Every `JOB_TYPES` extension and every new optional field on `JobTypeSiteView`
must leave the default site view (`getJobTypeSiteView(null, null)`) unchanged:
`profile === null`, `recruiterChips === []`, `recruiterGreeting === null`,
and any new demo arrays empty. This is mechanically asserted by the existing
parity test in `src/lib/job-type.test.ts` (and must be kept green).

## Honesty constraint

All answers injected via `findRecruiterChipAnswer()` and any new deterministic
intent coverage must stay grounded in `src/lib/ama/corpus.ts` facts:
"roughly 40%", "20+ deliveries", prototypes never "production-ready", no
invented metrics or clients. Every new recruiter-facing string file must be
registered in `RECRUITER_FACING` in `scripts/portfolio-regression-checks.mjs`
in the same change.

## Suggested porting order

1. Extend `JobTypeSiteView` with `demoChips` (and the matching field on
   `JobTypeProfile`). Default = `[]`.
2. Add the three new `recruiterChip` questions + corpus-grounded answers in
   `src/lib/recruiter-chips.ts`.
3. Port `self-interview` (simplest card → reducer pattern) and prove the
   `card` frame extension works end-to-end.
4. Port `rolefit-quiz` on the same reducer pattern.
5. Port `task-to-flow` last — SVG layout is the most novel surface.

Each port must keep the four verification commands green before landing:
`npm run check:content`, `npm run typecheck`, `npm run lint:strict`, and the
recruiter-chip/job-type test files.
