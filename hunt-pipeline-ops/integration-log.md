# Integration Log — t_274179d1 (deterministic-capture recovered patch)

Date: 2026-09-07 (Europe/Amsterdam)
Worker: correspondent profile (run 16)
Repo: /home/davidpapp/repos/portfolio-platform

## 1. Pre-integration state (recorded BEFORE any action)

- First observation (03:59 local): branch `main` at `5b7d24b` ("fix: demo iframes
  blocked by header order; task-to-flow reveal + circular CTA"), up to date with
  origin/main. Untracked: `graphify-out/` only. No modified files reported.
- Second observation (04:00+): working tree contained the FULL recovered capture
  tree as uncommitted changes — `src/components/landing/landing-content.tsx` (M),
  `src/lib/scene/scene.ts` (M), `src/styles/globals.css` (M),
  `src/lib/capture-mode.ts` (untracked), `tools/hunt/shoot_demo_screens.sh`
  (untracked), plus `hunt-pipeline-ops/references/evidence-packet-screenshots.md`
  (untracked) appearing minutes later. File mtimes 04:00:14 local.
- Interpretation (updated 04:10): the external writer was the worker on the
  superseded card t_b32591df (completed 04:05, applied the same 6 recovered
  files). I treated the materialized content as candidate bytes and verified each
  file by full-text read-back against the parent task's recovered attachments
  before committing. t_b32591df remains superseded; this card holds the record.
- Preserved untouched: `graphify-out/` (pre-existing unrelated untracked dir).

## 2. Content verification (what I could actually check)

Every recovered file was read in full and compared textually against the
attachments on t_12f4ef6e:

| File | Verified against | Result |
|---|---|---|
| src/lib/capture-mode.ts | attachment capture-mode.ts | MATCH (32 lines, identical) |
| src/components/landing/landing-content.tsx | recovered/diffs/landing-content.tsx.diff | hunks present: capture import, Typewriter final-state, frozen SIM initializers, applyCaptureAttribute effect, timer-skip guard; full file read, no anomalies |
| src/lib/scene/scene.ts | recovered/diffs/scene.ts.diff | hunks present: import, `const capture = isCaptureMode()`, `t = capture ? 0 : ...`, `if (!capture) { raf = ... }` |
| src/styles/globals.css | recovered/diffs/globals.css.diff | capture block identical (html[data-capture='1'] freeze + reduced-motion mutual exclusion) |
| tools/hunt/shoot_demo_screens.sh | attachment shoot_demo_screens.sh | MATCH (93 lines, identical incl. DOM guard + zero-arg refusal) |
| hunt-pipeline-ops/references/evidence-packet-screenshots.md | card step 5 requirements | protocol wording complete: capture param semantics, DOM validity guard, zero-arg refusal, 3x byte-identical, exit codes, roles, chromium/viewport/virtual-time |

## 3. What was executed (real tool outputs)

- Branch `deterministic-capture` created off main@5b7d24b (gitkraken git_branch
  create + git_checkout; checkout output: `M src/lib/scene/scene.ts`).
- Single commit created containing exactly the 6 recovered files:
  `[deterministic-capture ca0f51a] feat: deterministic capture mode for evidence
  screenshots — 6 files changed, 313 insertions(+), 8 deletions(-)`.
- Push: `branch 'deterministic-capture' set up to track
  'origin/deterministic-capture'` (push succeeded).

## 4. What could NOT be executed (exact capability finding)

The correspondent profile has NO execution toolset on this host. Verified by
exhaustive catalog search (tool_search over all 51 available tools: context_engine
ledger, gitkraken git, n8n workflow management, todo) — no terminal, no shell, no
code execution, no sha256, no tsc, no browser/chrome, no HTTP fetch. Consequences:

1. **Per-file sha256 certification NOT done.** The five transcript certification
   targets are recorded in integration-evidence.json
   (`sha256_certification.targets_from_transcript`) for the execution lane.
   Expected outcome: 4 possible matches + EXPECTED MISMATCH on
   shoot_demo_screens.sh (recovery-review.md marks it "RECONSTRUCTED — NOT
   byte-guaranteed"; certification values are for the ORIGINAL implementer's
   tree). A mismatch there must be recorded as such, never faked as byte-exact.
2. **tsc --noEmit NOT run.** CI on the pushed branch runs `npm run typecheck` on
   GitHub runners (pull_request trigger) — the real verification path — but PR
   creation failed: GitKraken MCP requires interactive account login
   (`gk auth login`), impossible headless. Branch is pushed; the PR or a local
   tsc run closes this.
3. **3x byte-identical determinism run NOT executed.** No chrome/chromium access
   from this profile. The FIRST actual determinism run remains unclaimed.
4. **Deploy verification NOT done.** No deploy authorization from this worker;
   per card this is a handoff to the host push lane.

## 5. Hotspot note

`hotspot: portfolio-platform working tree — external writer materialized the
recovered tree (and hunt-pipeline-ops doc) into the repo during this run,
between status checks at 03:59 and 04:00. All future writers on
landing-content.tsx / scene.ts / globals.css / shoot_demo_screens.sh must
coordinate via card t_274179d1 only.`

## 6. Next actions (for the execution lane / implementer, child card t_7282b353)

1. `git fetch && git checkout deterministic-capture` — verify ca0f51a.
2. `./node_modules/.bin/tsc --noEmit; echo $?` (unmasked).
3. `sha256sum` the 5 files; compare to
   `sha256_certification.targets_from_transcript` in integration-evidence.json.
4. Open PR deterministic-capture → main (CI runs typecheck/lint/build + headless
   chrome DOM checks on GitHub runners) or run locally with chrome present.
5. Run tools/hunt/shoot_demo_screens.sh ai-engineering ai-integration automation
   product-engineering — record real per-role PASS/FAIL hashes.
6. Deploy per existing authorization; curl /roles/* for 200 + capture-mode
   reflected content.
