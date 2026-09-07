# Evidence Packet Screenshots — Deterministic Capture Protocol

> Source: Deterministic capture mode integration (t_a8baea5c → recover t_12f4ef6e →
> integrate t_274179d1). This document records the protocol that screenshot
> evidence of davidpapp.dev must satisfy to count as byte-stable proof.

## When capture mode is active

Capture mode is active when **either** condition holds:

1. The URL carries an explicit truthy `capture` query parameter — i.e.
   `?capture=1` (or any value other than `0` / `false`). `?capture=0` is OFF.
   A bare `?capture` (empty string) is ON. Implemented in
   `src/lib/capture-mode.ts` → `isCaptureMode()`.
2. The visitor's OS/browser prefers reduced motion
   (`prefers-reduced-motion: reduce`).

In capture mode every decorative animation renders in its **final state
immediately**:

- The Three.js background scene renders exactly one frame at the fixed `t=0`
  pose instead of a continuous `requestAnimationFrame` loop.
  (`src/lib/scene/scene.ts` — the `if (!capture) { raf = requestAnimationFrame(tick); }`
  guard.)
- The Typewriter component shows full text immediately (no character-by-character
  race).
  (`src/components/landing/landing-content.tsx` — `isCaptureMode()` in the
  Typewriter mount effect.)
- The SIM status-bar values (latency, memLoad) are frozen to their initial
  fixed values; the randomizing interval timers are skipped entirely via
  `if (isCaptureMode()) return;`.
- All CSS animations and transitions are disabled at the final state via the
  `html[data-capture='1']` selector in `src/styles/globals.css`.
- The `@media (prefers-reduced-motion: reduce)` rule provides the same freeze
  for visitors without the capture URL param, using
  `html:not([data-capture])` for mutual exclusion.

Role-based content variation (`heroRole`, demo order via `job-type.ts`) is
**intentionally NOT frozen** — that variation is by design and reflects
real personalization, not animation nondeterminism.

## The 3× byte-identical protocol

Screenshots are produced by `tools/hunt/shoot_demo_screens.sh`. A screenshot
counts as deterministic evidence only if it passes **all** of the following:

### 1. Capture URL parameter

Every capture URL includes `?capture=1`. This freezes all animations at their
final state (see above).

### 2. DOM validity guard (no error/404 pages)

Before any PNG is accepted into the hash comparison, the page DOM is dumped
via `--dump-dom` and checked:

- The DOM **must** contain the `hero-role` class (the hero terminal marker of
  a real role page).
- The DOM **must not** contain the text "This page could not be found"
  (the Next.js 404 marker).

If either check fails, the role is reported as `FAIL` with
`page DOM is not a valid role page (error/404 capture guard)` and the role
does not proceed to hash comparison.

### 3. Zero-argument refusal

Running the script with no role arguments is refused:
```
Usage: ./shoot_demo_screens.sh <role> [<role> ...] — refusing a zero-argument vacuous run
```
Exit code 2. A vacuously-empty run that exits 0 is never acceptable evidence.

### 4. 3× independent captures per role, sha256-identical

For each role, the script performs **3 consecutive captures**, each with an
**independent temp profile** (separate `--user-data-dir`) to eliminate
session/localStorage carryover. The sha256 of each PNG is computed.

The role **passes** only if all three hashes are identical:
```
${hashes[0]} == ${hashes[1]} && ${hashes[1]} == ${hashes[2]}
```

If all three match, the PNG is copied to the output directory as
`$role-rolepage.png` and the role is reported:
```
PASS <role>  sha256=<hash>
```

If they differ, the role **fails** with the three hashes printed:
```
FAIL <role>  hashes: <hash1> <hash2> <hash3>
```

### 5. Exit code

The script exits 0 **only if every role passed** the 3× byte-identical check.
If any role failed, the exit code is 1 (or 2 for missing chromium / zero args).

## Server-side personalization proof

Screenshots are **layout evidence**, not personalization proof. Server-side
personalization (referral context, job-type variants) is verified separately via
`curl` with `REFERRAL_CONTEXT` checks against the live `/roles/*` pages. This
separation is intentional: the deterministic screenshot protocol proves rendering
stability, while curl checks prove the server returns role-correct content.

## Roles covered

- `ai-engineering`
- `ai-integration`
- `automation`
- `product-engineering`

## Chromium requirements

The script auto-detects `chromium`, `chromium-browser`, or
`google-chrome-stable` via `command -v`. A custom binary can be supplied via
the `$CHROME` environment variable. If no binary is found, the script exits 2
with:
```
ERROR: no chrome/chromium binary found (set $CHROME)
```

## Viewport

Default viewport is `1280,900` (`--window-size`). `1:1 device scale factor` is
forced (`--force-device-scale-factor=1`) for deterministic pixel dimensions.

## Virtual time budget

Each capture uses `--virtual-time-budget=15000` (15 seconds of virtual time)
to allow animations and resource loads to settle before the screenshot is taken.
