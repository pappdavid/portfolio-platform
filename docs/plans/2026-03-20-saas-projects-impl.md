# SaaS Projects Page + Showcase Rename — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/saas-projects` public page auto-populated daily from Vercel projects (team `team_ZhpfIRsiAC6e9byWX1PtUELx`) via GitHub Actions, and rename the existing `/projects` page title to "Showcase".

**Architecture:** GitHub Actions cron fetches Vercel project list + GitHub descriptions, screenshots each live URL with Playwright, commits JSON data + PNG assets. The Next.js page is a static server component that reads the committed JSON.

**Tech Stack:** Next.js 16 App Router (server component), Playwright (screenshots in CI), Vercel REST API v9, GitHub REST API, GitHub Actions

---

## Task 1: Rename Projects → Showcase + add SaaS Projects nav entry

**Files:**
- Modify: `src/config/nav-config.ts`
- Modify: `src/app/(public)/projects/page.tsx`
- Modify: `src/components/projects/projects-content.tsx`

**Step 1: Update nav-config.ts**

In `src/config/nav-config.ts`, change `publicNavItems` to:

```ts
export const publicNavItems: NavItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: 'home',
    isActive: false,
    items: []
  },
  {
    title: 'Showcase',
    url: '/projects',
    icon: 'folder',
    isActive: false,
    items: []
  },
  {
    title: 'SaaS Projects',
    url: '/saas-projects',
    icon: 'folder',
    isActive: false,
    items: []
  },
  {
    title: 'About',
    url: '/about',
    icon: 'user',
    isActive: false,
    items: []
  }
];
```

**Step 2: Update projects page metadata**

In `src/app/(public)/projects/page.tsx`:

```tsx
import { Metadata } from 'next';
import { ProjectsContent } from '@/components/projects/projects-content';

export const metadata: Metadata = {
  title: 'Showcase — David Papp',
  description:
    'A showcase of AI engineering work across observability, training, and retrieval systems.'
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
```

**Step 3: Update projects-content.tsx hero**

In `src/components/projects/projects-content.tsx`, change the hero section's `<Badge>` and `<h1>`:

```tsx
<Badge variant='secondary' className='mb-4'>
  Showcase
</Badge>
<h1 className='text-foreground text-4xl font-bold tracking-tight sm:text-5xl'>
  Showcase
</h1>
<p className='text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed'>
  A selection of AI engineering projects spanning observability,
  fine-tuning, and retrieval-augmented systems.
</p>
```

**Step 4: Verify in browser**

Run `npm run dev`, visit `http://localhost:3000/projects` — header nav should show "Showcase" and "SaaS Projects", page title should read "Showcase".

**Step 5: Commit**

```bash
git add src/config/nav-config.ts src/app/(public)/projects/page.tsx src/components/projects/projects-content.tsx
git commit -m "feat: rename Projects to Showcase, add SaaS Projects nav entry"
```

---

## Task 2: Create data file and screenshot directory

**Files:**
- Create: `src/data/saas-projects.json`
- Create: `public/saas-screenshots/.gitkeep`

**Step 1: Create the initial data file**

`src/data/saas-projects.json`:
```json
[]
```

**Step 2: Create screenshot directory placeholder**

```bash
mkdir -p public/saas-screenshots
touch public/saas-screenshots/.gitkeep
```

**Step 3: Commit**

```bash
git add src/data/saas-projects.json public/saas-screenshots/.gitkeep
git commit -m "chore: add saas-projects data file and screenshot directory"
```

---

## Task 3: Create the SaaS Projects page

**Files:**
- Create: `src/app/(public)/saas-projects/page.tsx`
- Create: `src/components/saas-projects/saas-projects-content.tsx`

**Step 1: Create the page route**

`src/app/(public)/saas-projects/page.tsx`:

```tsx
import { Metadata } from 'next';
import { SaasProjectsContent } from '@/components/saas-projects/saas-projects-content';

export const metadata: Metadata = {
  title: 'SaaS Projects — David Papp',
  description:
    'Side projects from the Code Shame org — a Vercel + Supabase + Clerk + Redis stack, updated daily.'
};

export default function SaasProjectsPage() {
  return <SaasProjectsContent />;
}
```

**Step 2: Create the content component**

`src/components/saas-projects/saas-projects-content.tsx`:

```tsx
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import projectsData from '@/data/saas-projects.json';

type SaasProject = {
  slug: string;
  name: string;
  description: string;
  url: string;
  screenshotPath: string;
  updatedAt: string;
};

const projects = projectsData as SaasProject[];

function formatUpdatedAt(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function SaasProjectsContent() {
  const lastUpdated =
    projects.length > 0 ? formatUpdatedAt(projects[0].updatedAt) : null;

  return (
    <div className='flex flex-col'>
      {/* Hero */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <Badge variant='secondary' className='mb-4'>
            SaaS Projects
          </Badge>
          <h1 className='text-foreground text-4xl font-bold tracking-tight sm:text-5xl'>
            SaaS Projects
          </h1>
          <p className='text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed'>
            These projects serve the purpose of making a few bucks to recoup
            the money spent on RunPod, AI tools, and hosting bills — and my
            crippling domain hoarding. The projects are pulled daily from my
            GitHub org automatically, so some of them are not listed anywhere
            and cannot be subscribed to yet. They are built from a very
            extensive template and use a Vercel + Supabase + Clerk + Redis
            stack with my custom shadcn element library. It was first
            AWS-based, but it ended up being easier to use a fixed stack with
            optional components.
          </p>
          {lastUpdated && (
            <p className='text-muted-foreground mt-3 text-sm'>
              Last synced: {lastUpdated}
            </p>
          )}
        </div>
      </section>

      {/* Project Grid */}
      <section className='bg-muted/30 py-12'>
        <div className='mx-auto max-w-6xl px-4'>
          {projects.length === 0 ? (
            <p className='text-muted-foreground text-center text-sm'>
              No projects synced yet — check back after the first daily run.
            </p>
          ) : (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {projects.map((project) => (
                <div
                  key={project.slug}
                  className='bg-background overflow-hidden rounded-xl border'
                >
                  {/* Screenshot */}
                  <div className='relative aspect-video w-full overflow-hidden bg-muted'>
                    <Image
                      src={project.screenshotPath}
                      alt={`${project.name} screenshot`}
                      fill
                      className='object-cover object-top'
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    />
                  </div>

                  {/* Body */}
                  <div className='p-5'>
                    <h3 className='text-foreground font-semibold'>
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                        {project.description}
                      </p>
                    )}
                    <a
                      href={project.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary mt-3 block text-sm underline-offset-2 hover:underline'
                    >
                      Visit →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h2 className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'>
            Interested in something similar?
          </h2>
          <p className='text-muted-foreground mt-4 text-lg'>
            Available for AI engineering roles and short consulting
            engagements.
          </p>
          <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button size='lg' asChild>
              <a href='mailto:hello@davidpapp.dev'>Email me</a>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <a
                href='https://cal.com/davidpapp/intro'
                target='_blank'
                rel='noopener noreferrer'
              >
                Book a call
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
```

**Step 3: Verify in browser**

Run `npm run dev`, visit `http://localhost:3000/saas-projects` — should show the hero with description and "No projects synced yet" message in the grid.

**Step 4: Commit**

```bash
git add src/app/(public)/saas-projects/page.tsx src/components/saas-projects/saas-projects-content.tsx
git commit -m "feat: add SaaS Projects page (empty state)"
```

---

## Task 4: Write the sync script

**Files:**
- Create: `scripts/sync-saas-projects.mjs`

This script runs in GitHub Actions. It has no npm dependencies beyond `playwright` (installed by the workflow).

**Step 1: Create the script**

`scripts/sync-saas-projects.mjs`:

```js
#!/usr/bin/env node
/**
 * Syncs SaaS projects from Vercel team into:
 *   - src/data/saas-projects.json  (metadata)
 *   - public/saas-screenshots/     (PNG screenshots)
 *
 * Required env:
 *   VERCEL_TOKEN   — Vercel API token
 *   VERCEL_TEAM_ID — Vercel team ID
 *   GH_PAT         — GitHub PAT with repo scope (for private repo descriptions)
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_ZhpfIRsiAC6e9byWX1PtUELx';
const GH_PAT = process.env.GH_PAT;

if (!VERCEL_TOKEN) throw new Error('VERCEL_TOKEN is required');

// --- Vercel API helpers ---

async function vercelGet(path) {
  const sep = path.includes('?') ? '&' : '?';
  const url = `https://api.vercel.com${path}${sep}teamId=${VERCEL_TEAM_ID}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
  });
  if (!res.ok) throw new Error(`Vercel API ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function fetchAllProjects() {
  const projects = [];
  let until = null;

  while (true) {
    const qs = until ? `?limit=100&until=${until}` : '?limit=100';
    const data = await vercelGet(`/v9/projects${qs}`);
    projects.push(...data.projects);
    if (!data.pagination?.next) break;
    until = data.pagination.next;
  }

  return projects;
}

// --- GitHub API helper ---

async function fetchGithubRepoDescription(repoId) {
  if (!GH_PAT || !repoId) return '';
  try {
    const res = await fetch(`https://api.github.com/repositories/${repoId}`, {
      headers: {
        Authorization: `Bearer ${GH_PAT}`,
        Accept: 'application/vnd.github+json'
      }
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.description || '';
  } catch {
    return '';
  }
}

// --- Production URL from Vercel project ---

function getProductionUrl(project) {
  // Prefer aliases with target === 'production', else first alias
  const aliases = project.alias || [];
  const prod = aliases.find((a) => a.target === 'production');
  const domain = prod?.domain || aliases[0]?.domain;
  if (!domain) return null;
  return `https://${domain}`;
}

// --- Main ---

async function main() {
  console.log('Fetching Vercel projects…');
  const allProjects = await fetchAllProjects();
  console.log(`Found ${allProjects.length} projects`);

  const screenshotsDir = join(ROOT, 'public', 'saas-screenshots');
  mkdirSync(screenshotsDir, { recursive: true });

  const browser = await chromium.launch();
  const results = [];

  for (const project of allProjects) {
    const url = getProductionUrl(project);
    if (!url) {
      console.log(`  [skip] ${project.name} — no production alias`);
      continue;
    }

    const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const screenshotFile = `${slug}.png`;
    const screenshotPath = `/saas-screenshots/${screenshotFile}`;
    const screenshotDisk = join(screenshotsDir, screenshotFile);

    console.log(`  [screenshot] ${project.name} → ${url}`);
    try {
      const page = await browser.newPage();
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.screenshot({ path: screenshotDisk, type: 'png' });
      await page.close();
    } catch (err) {
      console.warn(`    screenshot failed: ${err.message}`);
      // Skip this project if screenshot fails
      continue;
    }

    const repoId = project.link?.repoId;
    const description = await fetchGithubRepoDescription(repoId);

    results.push({
      slug,
      name: project.name,
      description,
      url,
      screenshotPath,
      updatedAt: new Date().toISOString()
    });
  }

  await browser.close();

  const outPath = join(ROOT, 'src', 'data', 'saas-projects.json');
  writeFileSync(outPath, JSON.stringify(results, null, 2) + '\n');
  console.log(`Wrote ${results.length} projects to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**Step 2: Commit**

```bash
git add scripts/sync-saas-projects.mjs
git commit -m "feat: add Vercel+GitHub sync script for SaaS projects"
```

---

## Task 5: Write the GitHub Actions workflow

**Files:**
- Create: `.github/workflows/sync-saas-projects.yml`

**Step 1: Create the workflow**

`.github/workflows/sync-saas-projects.yml`:

```yaml
name: Sync SaaS Projects

on:
  schedule:
    - cron: '0 3 * * *'   # 3 AM UTC daily
  workflow_dispatch:        # manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    permissions:
      contents: write       # allow committing back

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GH_PAT }}   # PAT needed to push to main

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Playwright
        run: |
          npm install playwright
          npx playwright install chromium --with-deps

      - name: Run sync script
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_TEAM_ID: team_ZhpfIRsiAC6e9byWX1PtUELx
          GH_PAT: ${{ secrets.GH_PAT }}
        run: node scripts/sync-saas-projects.mjs

      - name: Commit updated data
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add src/data/saas-projects.json public/saas-screenshots/
          git diff --staged --quiet || git commit -m "chore: sync saas projects [skip ci]"
          git push
```

**Step 2: Commit**

```bash
git add .github/workflows/sync-saas-projects.yml
git commit -m "ci: add daily SaaS projects sync workflow"
```

---

## Task 6: Configure GitHub Actions secrets

**This is a manual step — no code to write.**

In the GitHub repo settings (`Settings → Secrets and variables → Actions`), add:

| Secret name | Value |
|---|---|
| `VERCEL_TOKEN` | Vercel API token (create at vercel.com/account/tokens) |
| `GH_PAT` | GitHub PAT with `repo` + `read:org` scopes (create at github.com/settings/tokens) |

Then test by running the workflow manually:
`Actions → Sync SaaS Projects → Run workflow`

Check that `src/data/saas-projects.json` is populated and screenshots appear in `public/saas-screenshots/` in the next commit.

---

## Task 7: Handle Next.js Image domain allowlist

**Files:**
- Modify: `next.config.ts` (or `next.config.js`)

**Step 1: Check current next.config**

Read `next.config.ts`. Screenshots are served from `/saas-screenshots/` which is a local `public/` path — no remote domain needed. However confirm `images.domains` or `remotePatterns` doesn't need updating.

Since screenshots are committed to `public/`, they're served as static files. `<Image src="/saas-screenshots/foo.png" ...>` works with no config changes needed. **Skip this task if confirmed.**

---

## Task 8: Final verification

**Step 1:** Run `npm run build` — confirm no TypeScript errors (especially the JSON import in `saas-projects-content.tsx`).

If you see `TS2322` on the JSON import, add `resolveJsonModule: true` to `tsconfig.json` under `compilerOptions`. Check if it's already there first.

**Step 2:** Run `npm run lint` — confirm no lint errors.

**Step 3:** Visit `http://localhost:3000/saas-projects` in dev — confirm the empty state renders correctly.

**Step 4:** Manually run the sync script locally to test it:

```bash
VERCEL_TOKEN=your_token GH_PAT=your_pat node scripts/sync-saas-projects.mjs
```

Confirm `src/data/saas-projects.json` is populated and `/saas-projects` shows project cards.

**Step 5:** Commit any fixes, then push.
