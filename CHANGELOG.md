# Changelog

## [2026-08-19] — Referral personalization

### Added
- Referral visits persist their existing `/r/<token>` identity in an HTTP-only cookie after recording the visit.
- The public landing page resolves referral context server-side and shows the matched company plus optional role/focus metadata.
- Portfolio chat resolves the same server-side referral context and uses it only to prioritize already-supported factual evidence.
- Referral creation accepts an optional structured personalization snapshot while remaining compatible with legacy plain-text notes.

## [2026-05-31] — Portfolio P0: Clerk, Projects, CV

### Added
- Terminal-styled HTML CV at `/cv.html` matching the portfolio design (A4 print-ready)
- AgentSec platform project entry (private beta, request-access flow)
- JobLaunch Agent project entry with live deployment link
- Conditional Clerk: auth only activates when API keys are present

### Changed
- Title: "Junior AI Solution Developer" → "AI Solution Developer" (hero, metadata, chat)
- Location: "Rotterdam, NL" → "Amsterdam · Rotterdam, NL"
- Resume CTA: scroll button → direct PDF download (`/cv.pdf`)
- Projects: replaced stale set with 5 verified projects (AGENTSEC, AGENT_CLI, SKILL_INJ, THESYS_C1, JOBLAUNCH)
- Project expand rows: show [LIVE], [OPEN repo], or [REQUEST ACCESS] based on data
- Chat SYSTEM_PROMPT: replaced stale `saas-core` reference with `joblaunch-agent`
- Chat seed message + suggestions: updated to match new project set

### Fixed
- Clerk keyless "claim your application" banner removed when no keys configured
- Resume CTA no longer 404s (now downloads actual PDF)
