# Phase 1 — Portfolio Narrative Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all "product site" signals, establish identity-first copy, fix all broken/wrong links, implement MeshWave background on homepage, and trim nav to 3 items.

**Architecture:** Pure frontend changes — no API routes, no DB changes, no new dependencies. All changes are in React/TSX components and config files. MeshWave uses a canvas RAF loop with zero external deps.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui. Dev server: `npm run dev` at `http://localhost:3000`.

---

## Canonical Values (reference throughout)

| Field | Value |
|-------|-------|
| Email | `contact@davidpapp.dev` |
| GitHub | `https://github.com/pappdavid` |
| LinkedIn | `https://www.linkedin.com/in/dávid-papp` |
| Calendly | `https://calendly.com/david-webinform/30min` |
| CV | `/cv.pdf` (placeholder — file dropped in `public/` manually) |

---

## Task 1: Create MeshWave background component

**Files:**
- Create: `src/components/ui/mesh-wave.tsx`

**Step 1: Create the file**

```tsx
'use client';

import { useEffect, useRef } from 'react';

const MESH_COLS = 28;
const MESH_ROWS = 18;
const AMP = 22;
const FREQ = 0.0038;
const SPEED = 0.00055;

export function MeshWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (t: number) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Build vertex grid
      const pts: { x: number; y: number; bx: number; by: number }[][] = [];
      for (let r = 0; r <= MESH_ROWS; r++) {
        pts[r] = [];
        for (let c = 0; c <= MESH_COLS; c++) {
          const bx = (c / MESH_COLS) * W;
          const by = (r / MESH_ROWS) * H;
          const wave =
            Math.sin(bx * FREQ + t * SPEED) *
              Math.cos(by * FREQ * 1.3 + t * SPEED * 0.7) +
            Math.sin(bx * FREQ * 0.6 - by * FREQ * 0.8 + t * SPEED * 1.1) *
              0.5;
          pts[r][c] = {
            x: bx + wave * AMP * 0.5,
            y: by + wave * AMP,
            bx,
            by,
          };
        }
      }

      // Horizontal lines
      for (let r = 0; r <= MESH_ROWS; r++) {
        const midY = pts[r][Math.floor(MESH_COLS / 2)].y;
        const norm = Math.min(1, Math.abs(midY / H - 0.5) * 2);
        const alpha = 0.06 + norm * 0.12;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(34,197,94,${alpha})`;
        ctx.lineWidth = 1;
        ctx.moveTo(pts[r][0].x, pts[r][0].y);
        for (let c = 1; c <= MESH_COLS; c++) {
          ctx.lineTo(pts[r][c].x, pts[r][c].y);
        }
        ctx.stroke();
      }

      // Vertical lines
      for (let c = 0; c <= MESH_COLS; c++) {
        const alpha = 0.05 + 0.08 * Math.abs(Math.sin(c * 0.4 + t * SPEED * 2));
        ctx.beginPath();
        ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
        ctx.lineWidth = 1;
        ctx.moveTo(pts[0][c].x, pts[0][c].y);
        for (let r = 1; r <= MESH_ROWS; r++) {
          ctx.lineTo(pts[r][c].x, pts[r][c].y);
        }
        ctx.stroke();
      }

      // Nodes at intersections
      for (let r = 0; r <= MESH_ROWS; r++) {
        for (let c = 0; c <= MESH_COLS; c++) {
          const { x, y, bx, by } = pts[r][c];
          const disp = Math.sqrt((x - bx) ** 2 + (y - by) ** 2) / AMP;
          const radius = 0.9 + disp * 1.5;
          const alpha = 0.12 + disp * 0.35;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34,197,94,${alpha})`;
          ctx.fill();
        }
      }

      // Vignette
      const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      grad.addColorStop(0, 'rgba(4,4,8,0)');
      grad.addColorStop(1, 'rgba(4,4,8,0.78)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className='pointer-events-none fixed inset-0 z-0'
      style={{ willChange: 'transform' }}
      aria-hidden='true'
    />
  );
}
```

**Step 2: Verify dev server starts cleanly**

Run: `npm run dev`
Expected: No TypeScript errors. Visit `http://localhost:3000` — BackgroundBeams still showing (MeshWave not wired yet).

**Step 3: Commit**

```bash
git add src/components/ui/mesh-wave.tsx
git commit -m "feat: add MeshWave canvas background component"
```

---

## Task 2: Wire MeshWave into landing page + fix hero copy + remove stats

**Files:**
- Modify: `src/components/landing/landing-content.tsx`

**Step 1: Replace BackgroundBeams import with MeshWave**

In `landing-content.tsx`, change:
```tsx
// Remove this:
import { BackgroundBeams } from '@/components/ui/background-beams';

// Add this:
import { MeshWave } from '@/components/ui/mesh-wave';
```

**Step 2: Replace the background div**

Find:
```tsx
<div className='pointer-events-none fixed inset-0 z-0'>
  <BackgroundBeams className='opacity-50' />
</div>
```

Replace with:
```tsx
<MeshWave />
```

**Step 3: Rewrite hero headline and subtext**

Find:
```tsx
<h1 className='mb-5 bg-gradient-to-br from-white to-white/50 bg-clip-text text-5xl leading-[1.07] font-extrabold tracking-[-0.04em] text-transparent md:text-6xl'>
  Build AI products
  <br />
  that ship.
</h1>
<p className='mb-10 max-w-md text-base leading-relaxed text-[#71717a]'>
  Agent observability, fine-tuning pipelines, and RAG chat — built
  with cost discipline, security-first, and zero over-engineering.
</p>
```

Replace with:
```tsx
<h1 className='mb-5 bg-gradient-to-br from-white to-white/50 bg-clip-text text-5xl leading-[1.07] font-extrabold tracking-[-0.04em] text-transparent md:text-6xl'>
  I build production-grade
  <br />
  LLM systems.
</h1>
<p className='mb-10 max-w-md text-base leading-relaxed text-[#71717a]'>
  Agent observability, fine-tuning pipelines, and retrieval
  infrastructure — built cost-aware, security-first, and without
  over-engineering.
</p>
```

**Step 4: Remove "View Dashboard" CTA**

Find and remove this entire `<Link>` block in the hero CTAs:
```tsx
<Link
  href='/dashboard/overview'
  className='inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-medium text-[#71717a] backdrop-blur-sm transition-colors hover:bg-white/[0.08] hover:text-white'
>
  View Dashboard
</Link>
```

**Step 5: Update email and Calendly links in hero**

Find `mailto:hello@davidpapp.dev` → replace with `mailto:contact@davidpapp.dev`

Find `https://cal.com/davidpapp/intro` → replace with `https://calendly.com/david-webinform/30min`

**Step 6: Remove the entire stats strip**

Find and remove this entire block (the `<div>` wrapping the stats grid):
```tsx
{/* Stats */}
<div className='relative z-10 border-y border-white/[0.07] bg-white/[0.015]'>
  <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-3'>
    {stats.map((s) => (
      ...
    ))}
  </div>
</div>
```

Also remove the `stats` array declaration near the top of the file:
```tsx
const stats = [
  { metric: '40%', label: 'fewer support calls', detail: 'via structured guard rails' },
  { metric: 'Zero', label: 'injection incidents', detail: 'with input validation layer' },
  { metric: '3×', label: 'product launches led', detail: 'end-to-end delivery' }
];
```

**Step 7: Fix quickstart import comment**

Find:
```tsx
<span className='text-[#86efac]'>
  {" '@your-org/mcp-sentinel'"}
</span>
```

Replace with:
```tsx
<span className='text-[#86efac]'>
  {"'./sentinel'"}
</span>
```

And update the inline comment line from:
```tsx
<span className='text-[#4b5563]'>
  {'// Zero changes to your existing tools'}
</span>
```
to:
```tsx
<span className='text-[#4b5563]'>
  {'// Reference impl — github.com/pappdavid/mcp-sentinel'}
</span>
```

**Step 8: Verify**

Visit `http://localhost:3000`. Check:
- MeshWave animated grid visible behind hero
- Headline reads "I build production-grade LLM systems."
- Only 2 CTA buttons (Email + Calendly)
- No stats strip between hero and "Three Pillars"
- Quickstart shows `'./sentinel'` not `@your-org`

**Step 9: Commit**

```bash
git add src/components/landing/landing-content.tsx
git commit -m "feat: rewrite hero copy, add MeshWave, remove stats strip and Dashboard CTA"
```

---

## Task 3: Trim public nav to 3 items

**Files:**
- Modify: `src/config/nav-config.ts`

**Step 1: Update publicNavItems**

Replace the entire `publicNavItems` array:
```tsx
export const publicNavItems: NavItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: 'home',
    isActive: false,
    items: []
  },
  {
    title: 'Projects',
    url: '/projects',
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

**Step 2: Commit**

```bash
git add src/config/nav-config.ts
git commit -m "feat: trim public nav to Home, Projects, About"
```

---

## Task 4: Update public header — capitalize logo, remove Dashboard button, add Contact

**Files:**
- Modify: `src/components/layout/public-header.tsx`

**Step 1: Capitalize logo**

Find:
```tsx
david<span className='text-[#22c55e]'>_</span>papp
```

Replace with:
```tsx
David<span className='text-[#22c55e]'>_</span>Papp
```

**Step 2: Remove Dashboard → button (desktop)**

Find and remove:
```tsx
<Link
  href='/dashboard/overview'
  className='ml-2 rounded-lg border border-white/10 bg-white/[0.08] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.12]'
>
  Dashboard →
</Link>
```

Replace with a Contact link:
```tsx
<a
  href='mailto:contact@davidpapp.dev'
  className='ml-2 rounded-lg border border-white/10 bg-white/[0.08] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.12]'
>
  Contact
</a>
```

**Step 3: Remove Dashboard → button (mobile sheet)**

Find and remove:
```tsx
<Link
  href='/dashboard/overview'
  onClick={() => setOpen(false)}
  className='mt-4 rounded-lg bg-[#22c55e] px-4 py-2 text-center text-sm font-semibold text-black'
>
  Dashboard →
</Link>
```

Replace with:
```tsx
<a
  href='mailto:contact@davidpapp.dev'
  onClick={() => setOpen(false)}
  className='mt-4 rounded-lg bg-[#22c55e] px-4 py-2 text-center text-sm font-semibold text-black'
>
  Contact
</a>
```

**Step 4: Verify**

Visit `http://localhost:3000`. Check:
- Logo shows `David_Papp`
- Nav shows Home · Projects · About
- No "Dashboard →" button anywhere
- "Contact" button visible

**Step 5: Commit**

```bash
git add src/components/layout/public-header.tsx
git commit -m "feat: capitalize logo, remove Dashboard CTA from header, add Contact"
```

---

## Task 5: Add inner-page background gradient to public layout

**Files:**
- Modify: `src/app/(public)/layout.tsx`

**Step 1: Update the layout**

Current content:
```tsx
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-[#060608]'>
      <PublicHeader />
      <main className='relative min-h-[calc(100dvh-3.5rem)]'>{children}</main>
      <Footer />
    </div>
  );
}
```

Replace with:
```tsx
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className='bg-[#060608]'
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,197,94,0.06) 0%, transparent 60%)'
      }}
    >
      <PublicHeader />
      <main className='relative min-h-[calc(100dvh-3.5rem)]'>{children}</main>
      <Footer />
    </div>
  );
}
```

Note: This applies to all public pages including the homepage. The MeshWave canvas is `fixed` and renders on top of this on the homepage only, so there's no conflict.

**Step 2: Verify**

Visit `/about` and `/projects`. Both should have a subtle green radial glow at the top.

**Step 3: Commit**

```bash
git add src/app/(public)/layout.tsx
git commit -m "feat: add subtle radial gradient to inner public pages"
```

---

## Task 6: Fix footer links, remove legal links

**Files:**
- Modify: `src/components/layout/footer.tsx`

**Step 1: Replace the entire file content**

```tsx
import Link from 'next/link';

const footerLinks = [{ title: 'About', href: '/about' }];

const socialLinks = [
  { title: 'GitHub', href: 'https://github.com/pappdavid' },
  { title: 'LinkedIn', href: 'https://www.linkedin.com/in/dávid-papp' }
];

export function Footer() {
  return (
    <footer className='border-t border-white/[0.07] bg-[#060608]'>
      <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row'>
        <p className='font-mono text-xs text-[#3f3f46]'>
          &copy; {new Date().getFullYear()} David Papp
        </p>
        <nav className='flex items-center gap-5'>
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-xs text-[#52525b] transition-colors hover:text-white'
            >
              {link.title}
            </Link>
          ))}
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className='font-mono text-xs text-[#52525b] transition-colors hover:text-[#22c55e]'
            >
              {link.title} ↗
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
```

**Step 2: Verify**

Check footer on any page. Should show: `© 2026 David Papp` | `About` · `GitHub ↗` · `LinkedIn ↗`

**Step 3: Commit**

```bash
git add src/components/layout/footer.tsx
git commit -m "fix: correct GitHub/LinkedIn links in footer, remove SaaS legal links"
```

---

## Task 7: Fix About page — links, CV button, restructure skills

**Files:**
- Modify: `src/app/(public)/about/page.tsx`

**Step 1: Fix all contact links**

Update every href in the file:
- `https://github.com/davidpapp` → `https://github.com/pappdavid`
- `https://linkedin.com/in/davidpapp` → `https://www.linkedin.com/in/dávid-papp`
- `mailto:hello@davidpapp.dev` → `mailto:contact@davidpapp.dev`
- `https://cal.com/davidpapp/intro` → `https://calendly.com/david-webinform/30min`

**Step 2: Add CV download button to the CTA row**

In the `<div className='flex flex-wrap gap-4'>` block (containing Email + Calendly buttons), add after the Calendly button:
```tsx
<Button asChild variant='outline' size='lg'>
  <a href='/cv.pdf' target='_blank' rel='noopener noreferrer'>
    <IconFileText className='mr-2 h-5 w-5' />
    Download CV
  </a>
</Button>
```

`IconFileText` is already imported.

**Step 3: Replace tag cloud with grouped skills**

Find and replace the entire `{/* Tech Stack */}` section:

```tsx
{/* Skills */}
<section className='py-16'>
  <div className='mx-auto max-w-3xl px-4'>
    <h2 className='text-foreground mb-6 text-2xl font-bold'>Skills</h2>
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      {[
        {
          group: 'LLM Application Layer',
          level: 'Daily use',
          levelColor: 'text-[#22c55e]',
          context:
            'Prompt engineering, structured outputs, tool calling, and guard rail design.',
          tags: ['OpenAI API', 'Anthropic API', 'LangChain', 'Structured Outputs']
        },
        {
          group: 'RAG & Retrieval',
          level: 'Active',
          levelColor: 'text-[#06b6d4]',
          context:
            'Document chunking, embedding pipelines, vector search, and reranking.',
          tags: ['pgvector', 'Supabase', 'OpenAI Embeddings', 'Hybrid Search']
        },
        {
          group: 'Agentic Systems',
          level: 'Daily use',
          levelColor: 'text-[#22c55e]',
          context:
            'MCP protocol, injection detection, observability middleware, and cost guards.',
          tags: ['MCP', 'Guard Rails', 'Event Logging', 'HMAC Signing']
        },
        {
          group: 'Full-Stack Engineering',
          level: 'Daily use',
          levelColor: 'text-[#22c55e]',
          context:
            'End-to-end TypeScript/Python products with auth, DB, and deployment.',
          tags: ['Next.js', 'TypeScript', 'Supabase', 'Clerk', 'Vercel']
        },
        {
          group: 'Model Training & Infra',
          level: 'Active',
          levelColor: 'text-[#06b6d4]',
          context: 'LoRA fine-tuning, JSONL dataset prep, eval loops, and job management.',
          tags: ['LoRA', 'JSONL', 'Python', 'Docker', 'HuggingFace']
        }
      ].map((item) => (
        <div key={item.group} className='bg-background rounded-xl border p-5'>
          <div className='mb-2 flex items-center justify-between'>
            <h3 className='text-foreground text-sm font-semibold'>{item.group}</h3>
            <span className={`font-mono text-xs ${item.levelColor}`}>
              {item.level}
            </span>
          </div>
          <p className='text-muted-foreground mb-3 text-xs leading-relaxed'>
            {item.context}
          </p>
          <div className='flex flex-wrap gap-1.5'>
            {item.tags.map((tag) => (
              <Badge key={tag} variant='secondary' className='text-xs'>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Step 4: Move skills section after "What I Do"**

Current order in file:
1. Bio
2. What I Do (role cards)
3. Tech Stack (old tag cloud) ← replace this with Skills above
4. Get in Touch

After replacement, order should be:
1. Bio
2. What I Do
3. Skills (new grouped)
4. Get in Touch

The replacement in Step 3 already puts it in the right position.

**Step 5: Verify**

Visit `/about`. Check:
- All links use correct URLs
- CV download button visible
- Skills section shows 5 grouped cards with proficiency labels
- No raw tag cloud anywhere

**Step 6: Commit**

```bash
git add src/app/(public)/about/page.tsx
git commit -m "feat: fix contact links, add CV button, restructure skills on About page"
```

---

## Task 8: Clean up MCP page — remove pricing, fix heading, fix quickstart

**Files:**
- Modify: `src/components/mcp/mcp-content.tsx`

**Step 1: Fix quickstart code string**

Find at top of file:
```tsx
const quickstartCode = `import { MCPSentinel } from '@your-org/mcp-sentinel';
```

Replace with:
```tsx
const quickstartCode = `// Reference implementation — github.com/pappdavid/mcp-sentinel
import { MCPSentinel } from './sentinel';
```

**Step 2: Rename "Integration Guide" to "How It Works"**

Find:
```tsx
<h2 className='mb-8 text-2xl font-bold text-white'>
  Integration Guide
</h2>
```

Replace with:
```tsx
<h2 className='mb-8 text-2xl font-bold text-white'>
  How It Works
</h2>
```

**Step 3: Remove the entire Pricing section**

Find and delete this entire section block:
```tsx
{/* Pricing */}
<section className='border-y border-white/[0.07] bg-white/[0.015] py-16'>
  <div className='mx-auto max-w-4xl px-4'>
    <h2 className='mb-4 text-2xl font-bold text-white'>
      Pricing &amp; Limits
    </h2>
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
        <h3 className='mb-2 font-semibold text-white'>Free Tier</h3>
        <ul className='space-y-2 text-sm text-[#71717a]'>
          <li>100 events/minute rate limit</li>
          <li>7-day event retention</li>
          <li>3 guard rules</li>
          <li>1 API key</li>
        </ul>
      </div>
      <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
        <h3 className='mb-2 font-semibold text-white'>Pro</h3>
        <ul className='space-y-2 text-sm text-[#71717a]'>
          <li>Unlimited events</li>
          <li>90-day retention</li>
          <li>Unlimited guard rules</li>
          <li>Team API keys + webhooks</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

**Step 4: Replace FAQ accordion with a "Demo Limits" note**

Find and replace the entire FAQ section:
```tsx
{/* FAQ */}
<section className='py-20'>
  <div className='mx-auto max-w-4xl px-4'>
    <h2 className='mb-8 text-2xl font-bold text-white'>FAQ</h2>
    <Accordion type='single' collapsible className='w-full'>
      {faqItems.map((item, i) => (
        ...
      ))}
    </Accordion>
  </div>
</section>
```

Replace with:
```tsx
{/* Demo limits */}
<section className='py-16'>
  <div className='mx-auto max-w-4xl px-4'>
    <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
      <p className='font-mono text-xs text-[#52525b]'>
        Demo is rate-limited to 100 events/minute with mock data.{' '}
        <a
          href='mailto:contact@davidpapp.dev'
          className='text-[#22c55e] hover:underline'
        >
          Contact me
        </a>{' '}
        for a full walkthrough or to discuss deployment.
      </p>
    </div>
  </div>
</section>
```

**Step 5: Remove unused imports**

Remove from imports (if now unused after FAQ removal):
- `Accordion, AccordionContent, AccordionItem, AccordionTrigger` from `@/components/ui/accordion`
- `faqItems` constant declaration (lines 98–119)

**Step 6: Remove "Open Dashboard" hero button**

In the hero section of `mcp-content.tsx`, find and remove the green "Open Dashboard" button:
```tsx
<Button
  asChild
  size='lg'
  className='bg-[#22c55e] text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-[#16a34a]'
>
  <Link href='/dashboard/mcp'>
    Open Dashboard
    <IconArrowRight className='ml-2 h-4 w-4' />
  </Link>
</Button>
```

Keep only the "Quickstart" anchor button. Also remove `IconArrowRight` from imports if unused after this.

**Step 7: Verify**

Visit `/mcp`. Check:
- No pricing table
- Section heading reads "How It Works" not "Integration Guide"
- Quickstart shows `// Reference implementation — github.com/pappdavid/mcp-sentinel`
- No FAQ accordion
- Small "Demo is rate-limited" note at bottom
- No "Open Dashboard" button in hero

**Step 8: Commit**

```bash
git add src/components/mcp/mcp-content.tsx
git commit -m "feat: remove pricing table and FAQ from MCP page, rename Integration Guide, fix quickstart"
```

---

## Task 9: Final verification pass

**Step 1: Run lint**

```bash
npm run lint
```

Expected: No errors. Fix any unused import warnings surfaced.

**Step 2: Visual check — all pages**

Visit each page and confirm:
- `/` — MeshWave visible, "I build production-grade LLM systems.", no stats, 2 CTAs, nav shows Home/Projects/About, logo is `David_Papp`
- `/about` — correct links, CV button, grouped skills, no tag cloud
- `/mcp` — no pricing, "How It Works", no FAQ, no Dashboard button
- `/projects` — loads without error
- Footer on all pages: GitHub/LinkedIn correct, no Privacy/Terms/Security

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: phase 1 complete — narrative fix, MeshWave, nav trim, link corrections"
```
