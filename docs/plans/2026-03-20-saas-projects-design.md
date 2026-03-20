# Design: SaaS Projects Page + Showcase Rename

**Date:** 2026-03-20
**Status:** Approved

## Summary

Add a new public `/saas-projects` page that auto-populates from Vercel projects (team `team_ZhpfIRsiAC6e9byWX1PtUELx`) via a daily GitHub Actions workflow. Rename the existing `/projects` page title from "Projects" to "Showcase". Both pages match the existing public page style exactly.

---

## 1. Nav & Routing

- `src/config/nav-config.ts`: rename `"Projects"` → `"Showcase"` (URL `/projects` unchanged)
- Add `"SaaS Projects"` nav item → `/saas-projects`
- New route: `src/app/(public)/saas-projects/page.tsx`
- New component: `src/components/saas-projects/saas-projects-content.tsx`

---

## 2. Data Pipeline (GitHub Actions)

### Workflow file
`.github/workflows/sync-saas-projects.yml`

- **Cron:** `0 3 * * *` (3 AM UTC daily)
- **Trigger:** also `workflow_dispatch` for manual runs
- **Steps:**
  1. Checkout repo
  2. Setup Node.js
  3. Install Playwright Chromium
  4. Run `scripts/sync-saas-projects.mjs`
  5. Commit changed files with message `chore: sync saas projects [skip ci]`

### Script: `scripts/sync-saas-projects.mjs`

1. `GET https://api.vercel.com/v9/projects?teamId=team_ZhpfIRsiAC6e9byWX1PtUELx&limit=100` with `Authorization: Bearer $VERCEL_TOKEN`
2. For each project:
   - Extract production alias (first alias or `alias[0]`)
   - `GET https://api.vercel.com/v9/projects/{id}?teamId=...` to get `link.repoId` and description if available
   - If repo linked: `GET https://api.github.com/repositories/{repoId}` with `Authorization: Bearer $GH_PAT` to get `description`
   - Launch Playwright Chromium, navigate to `https://{alias}`, wait for `networkidle`, screenshot at 1280×800, save to `public/saas-screenshots/{slug}.png`
3. Write `src/data/saas-projects.json`:
   ```json
   [
     {
       "slug": "project-slug",
       "name": "Project Name",
       "description": "Repo description or empty string",
       "url": "https://project.vercel.app",
       "screenshotPath": "/saas-screenshots/project-slug.png",
       "updatedAt": "2026-03-20T03:00:00Z"
     }
   ]
   ```

### Required secrets (GitHub Actions)
- `VERCEL_TOKEN` — Vercel API token with team read access
- `GH_PAT` — GitHub PAT with `repo` scope (to read private repo descriptions + push commit)

---

## 3. SaaS Projects Page

### File: `src/app/(public)/saas-projects/page.tsx`

```tsx
export const metadata = {
  title: 'SaaS Projects — David Papp',
  description: 'SaaS projects from the Code Shame org...'
}
export default function SaasProjectsPage() {
  return <SaasProjectsContent />
}
```

### Component: `src/components/saas-projects/saas-projects-content.tsx`

Server component (static import of JSON — no `'use client'` needed).

**Sections (matching existing page style):**

1. **Hero** (`py-20`, `max-w-4xl`):
   - `<Badge variant="secondary">SaaS Projects</Badge>`
   - `<h1>SaaS Projects</h1>`
   - Description paragraph (from user, typo-corrected):
     > "These projects serve the purpose of making a few bucks to recoup the money spent on RunPod, AI tools, and hosting bills — and my crippling domain hoarding. The projects are pulled daily from my GitHub org automatically, so some of them are not listed anywhere and cannot be subscribed to yet. They are built from a very extensive template and use a Vercel + Supabase + Clerk + Redis stack with my custom shadcn element library. It was first AWS-based, but it ended up being easier to use a fixed stack with optional components."
   - Small note: `Updated {relative date from updatedAt of first entry}`

2. **Project Grid** (`py-12`, `max-w-6xl`, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`):
   - Each card: `bg-background rounded-xl border overflow-hidden`
     - Screenshot: `<Image>` with `aspect-video object-cover object-top`
     - Body: `p-5`
       - `<h3>` project name
       - `<p className="text-muted-foreground text-sm">` description
       - `<a href={url}>` "Visit →" link in `text-primary`

3. **CTA** (`py-20`): identical to existing pages — "Interested in something similar?" with email + cal.com buttons

---

## 4. Existing Projects Page Rename

- `src/components/projects/projects-content.tsx`: change `h1` text `"Projects"` → `"Showcase"`, update subheading copy
- `src/app/(public)/projects/page.tsx`: update metadata title/description to reflect "Showcase"
- `src/config/nav-config.ts`: rename nav item title `"Projects"` → `"Showcase"`

---

## Files to Create/Modify

| Action | Path |
|--------|------|
| Create | `src/app/(public)/saas-projects/page.tsx` |
| Create | `src/components/saas-projects/saas-projects-content.tsx` |
| Create | `scripts/sync-saas-projects.mjs` |
| Create | `.github/workflows/sync-saas-projects.yml` |
| Create | `src/data/saas-projects.json` (initial empty array `[]`) |
| Create | `public/saas-screenshots/.gitkeep` |
| Modify | `src/config/nav-config.ts` |
| Modify | `src/components/projects/projects-content.tsx` |
| Modify | `src/app/(public)/projects/page.tsx` |
