# Dark Terminal UI + Chat Wiring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the Dark Terminal visual system (Style A) across all public pages and wire the public Chat page to the real streaming Thesys C1 API with a 2 req/hr public rate limit.

**Architecture:** All public pages share a dark `#060608` background set at the layout level. Shared atomic components (`GridBackground`, `MonoEyebrow`) are created in `src/components/ui/`. Each product page is a full rewrite of its content component only — routing, auth, and API layers are untouched except for the chat rate limit change.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4 (arbitrary values with `bg-[#060608]`), shadcn/ui, Geist Mono (`font-mono` class, already loaded), Tabler Icons, SSE streaming via `fetch` + `ReadableStream`.

---

### Task 1: Tighten public chat rate limit

**Files:**
- Modify: `src/lib/rate-limit.ts`
- Modify: `src/app/api/chat/route.ts`

**Step 1: Add `chatPublicRateLimit` (2/hr) to rate-limit.ts**

Replace line 38:
```ts
export const chatRateLimit = createLimiter(10, '1 h', 'ratelimit:chat');
```
With:
```ts
export const chatRateLimit = createLimiter(10, '1 h', 'ratelimit:chat');
export const chatPublicRateLimit = createLimiter(2, '1 h', 'ratelimit:chat:public');
```

**Step 2: Update `/api/chat/route.ts` to use the new limit**

Change line 4 import to include the new export:
```ts
import { chatPublicRateLimit, chatAuthRateLimit } from '@/lib/rate-limit';
```

Change line 21:
```ts
const limiter = userId ? chatAuthRateLimit : chatPublicRateLimit;
```

**Step 3: Verify build**
```bash
npm run build 2>&1 | tail -20
```
Expected: no TypeScript errors.

**Step 4: Commit**
```bash
git add src/lib/rate-limit.ts src/app/api/chat/route.ts
git commit -m "feat: tighten public chat rate limit to 2/hr"
```

---

### Task 2: Create `GridBackground` component

**Files:**
- Create: `src/components/ui/grid-background.tsx`

**Step 1: Create the component**

```tsx
export function GridBackground() {
  return (
    <div
      className='pointer-events-none fixed inset-0 z-0'
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '52px 52px'
      }}
    />
  );
}
```

**Step 2: Verify lint**
```bash
npm run lint 2>&1 | grep -E "grid-background|error" | head -10
```
Expected: no errors.

**Step 3: Commit**
```bash
git add src/components/ui/grid-background.tsx
git commit -m "feat: add GridBackground UI component"
```

---

### Task 3: Create `MonoEyebrow` component

**Files:**
- Create: `src/components/ui/mono-eyebrow.tsx`

**Step 1: Create the component**

```tsx
import { cn } from '@/lib/utils';

interface MonoEyebrowProps {
  children: React.ReactNode;
  color?: 'green' | 'purple' | 'orange';
  className?: string;
}

const colorMap = {
  green: 'border-[#22c55e]/30 bg-[#22c55e]/08 text-[#22c55e]',
  purple: 'border-[#a855f7]/30 bg-[#a855f7]/08 text-[#a855f7]',
  orange: 'border-[#f97316]/30 bg-[#f97316]/08 text-[#f97316]'
};

export function MonoEyebrow({
  children,
  color = 'green',
  className
}: MonoEyebrowProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1',
        'font-mono text-[11px] tracking-[0.06em] uppercase',
        colorMap[color],
        className
      )}
    >
      {children}
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/ui/mono-eyebrow.tsx
git commit -m "feat: add MonoEyebrow UI component"
```

---

### Task 4: Dark-theme public layout + nav + footer

**Files:**
- Modify: `src/app/(public)/layout.tsx`
- Modify: `src/components/layout/public-header.tsx`
- Modify: `src/components/layout/footer.tsx`

**Step 1: Update `src/app/(public)/layout.tsx`**

```tsx
import { PublicHeader } from '@/components/layout/public-header';
import { Footer } from '@/components/layout/footer';

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='bg-[#060608]'>
      <PublicHeader />
      <main className='relative min-h-[calc(100dvh-3.5rem)]'>{children}</main>
      <Footer />
    </div>
  );
}
```

**Step 2: Rewrite `src/components/layout/public-header.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { IconMenu2 } from '@tabler/icons-react';
import { publicNavItems } from '@/config/nav-config';

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-50 border-b border-white/[0.07] bg-[#060608]/90 backdrop-blur-sm'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-6'>
        <Link
          href='/'
          className='font-mono text-sm font-medium text-white tracking-tight'
        >
          david<span className='text-[#22c55e]'>_</span>papp
        </Link>

        {/* Desktop nav */}
        <nav className='hidden items-center gap-1 md:flex'>
          {publicNavItems.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors text-[#71717a] hover:text-white',
                pathname === item.url && 'text-white'
              )}
            >
              {item.title}
            </Link>
          ))}
          <Link
            href='/dashboard/overview'
            className='ml-2 rounded-lg border border-white/10 bg-white/08 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/12'
          >
            Dashboard →
          </Link>
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className='md:hidden'>
            <button className='rounded-md p-2 text-[#71717a] hover:text-white'>
              <IconMenu2 className='h-5 w-5' />
            </button>
          </SheetTrigger>
          <SheetContent
            side='right'
            className='w-72 border-white/[0.07] bg-[#0a0a0c]'
          >
            <nav className='mt-8 flex flex-col gap-2'>
              {publicNavItems.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors text-[#71717a] hover:text-white',
                    pathname === item.url && 'text-white'
                  )}
                >
                  {item.title}
                </Link>
              ))}
              <Link
                href='/dashboard/overview'
                onClick={() => setOpen(false)}
                className='mt-4 rounded-lg bg-[#22c55e] px-4 py-2 text-sm font-semibold text-black text-center'
              >
                Dashboard →
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
```

**Step 3: Rewrite `src/components/layout/footer.tsx`**

```tsx
import Link from 'next/link';

const footerLinks = [
  { title: 'Privacy', href: '/privacy-policy' },
  { title: 'Terms', href: '/terms-of-service' },
  { title: 'Security', href: '/security' },
  { title: 'About', href: '/about' }
];

const socialLinks = [
  { title: 'GitHub', href: 'https://github.com/davidpapp' },
  { title: 'LinkedIn', href: 'https://linkedin.com/in/davidpapp' }
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

**Step 4: Run build**
```bash
npm run build 2>&1 | tail -20
```

**Step 5: Commit**
```bash
git add src/app/(public)/layout.tsx src/components/layout/public-header.tsx src/components/layout/footer.tsx
git commit -m "feat: dark terminal theme for public nav, footer, and layout"
```

---

### Task 5: Rewrite landing page

**Files:**
- Modify: `src/components/landing/landing-content.tsx`

**Step 1: Full rewrite**

```tsx
'use client';

import Link from 'next/link';
import { GridBackground } from '@/components/ui/grid-background';
import { MonoEyebrow } from '@/components/ui/mono-eyebrow';

/* ── SVG: Hero architecture diagram ─────────────────── */
function HeroDiagram() {
  return (
    <svg
      viewBox='0 0 480 320'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='w-full max-w-[480px]'
      aria-hidden='true'
    >
      <defs>
        <linearGradient id='flowGrad' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stopColor='#22c55e' />
          <stop offset='100%' stopColor='#06b6d4' />
        </linearGradient>
      </defs>
      {/* Card bg */}
      <rect x='10' y='10' width='460' height='300' rx='16' fill='rgba(255,255,255,0.03)' stroke='rgba(255,255,255,0.07)' strokeWidth='1' />
      {/* Agent */}
      <rect x='28' y='110' width='88' height='80' rx='10' fill='rgba(255,255,255,0.04)' stroke='rgba(255,255,255,0.09)' strokeWidth='1' />
      <text x='72' y='138' textAnchor='middle' fill='#52525b' fontSize='9' fontFamily='monospace' letterSpacing='1'>AGENT</text>
      <rect x='52' y='146' width='40' height='28' rx='5' fill='rgba(255,255,255,0.04)' stroke='rgba(255,255,255,0.07)' strokeWidth='1' />
      <circle cx='64' cy='158' r='3' fill='#4b5563' />
      <circle cx='80' cy='158' r='3' fill='#4b5563' />
      <path d='M61 165 Q72 170 83 165' stroke='#4b5563' strokeWidth='1.5' fill='none' strokeLinecap='round' />
      {/* Arrow A→S */}
      <path d='M118 150 L160 150' stroke='url(#flowGrad)' strokeWidth='1.5' strokeDasharray='4 3' />
      <polygon points='160,146.5 167,150 160,153.5' fill='#22c55e' />
      {/* Sentinel */}
      <rect x='168' y='90' width='144' height='120' rx='14' fill='rgba(34,197,94,0.07)' stroke='rgba(34,197,94,0.22)' strokeWidth='1.5' />
      <text x='240' y='116' textAnchor='middle' fill='#22c55e' fontSize='9' fontFamily='monospace' letterSpacing='1'>MCP SENTINEL</text>
      <path d='M240 128 l17 8v11c0 7.5-6 14-17 16-11-2-17-8.5-17-16v-11l17-8z' fill='rgba(34,197,94,0.14)' stroke='#22c55e' strokeWidth='1.75' />
      <path d='M234 148 l3.5 3.5 8-8' stroke='#22c55e' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <text x='240' y='198' textAnchor='middle' fill='#3f3f46' fontSize='8.5' fontFamily='monospace'>guard · log · audit</text>
      {/* Arrow S→T */}
      <path d='M314 150 L356 150' stroke='url(#flowGrad)' strokeWidth='1.5' strokeDasharray='4 3' />
      <polygon points='356,146.5 363,150 356,153.5' fill='#06b6d4' />
      {/* Tools */}
      <rect x='364' y='110' width='88' height='80' rx='10' fill='rgba(255,255,255,0.04)' stroke='rgba(255,255,255,0.09)' strokeWidth='1' />
      <text x='408' y='138' textAnchor='middle' fill='#52525b' fontSize='9' fontFamily='monospace' letterSpacing='1'>TOOLS</text>
      <rect x='382' y='148' width='14' height='14' rx='3' fill='#1c1c1e' stroke='rgba(255,255,255,0.08)' strokeWidth='1' />
      <rect x='400' y='148' width='14' height='14' rx='3' fill='#1c1c1e' stroke='rgba(255,255,255,0.08)' strokeWidth='1' />
      <rect x='382' y='166' width='14' height='8' rx='2' fill='#161618' />
      <rect x='400' y='166' width='14' height='8' rx='2' fill='#161618' />
      {/* Blocked path */}
      <path d='M240 210 L240 248' stroke='#ef4444' strokeWidth='1.5' strokeDasharray='4 3' />
      <rect x='200' y='248' width='80' height='34' rx='8' fill='rgba(239,68,68,0.09)' stroke='rgba(239,68,68,0.25)' strokeWidth='1' />
      <text x='240' y='264' textAnchor='middle' fill='#ef4444' fontSize='8.5' fontFamily='monospace'>BLOCKED</text>
      <text x='240' y='276' textAnchor='middle' fill='#52525b' fontSize='8' fontFamily='monospace'>+ alert sent</text>
      {/* Event log */}
      <path d='M240 90 L240 60' stroke='rgba(255,255,255,0.12)' strokeWidth='1.5' strokeDasharray='4 3' />
      <rect x='192' y='34' width='96' height='24' rx='6' fill='rgba(255,255,255,0.03)' stroke='rgba(255,255,255,0.07)' strokeWidth='1' />
      <text x='240' y='50' textAnchor='middle' fill='#52525b' fontSize='8.5' fontFamily='monospace'>EVENT LOG</text>
    </svg>
  );
}

/* ── SVG: Pillar card illustrations ──────────────────── */
function SentinelIllus() {
  return (
    <svg viewBox='0 0 200 80' fill='none' className='w-full max-h-[80px]' aria-hidden='true'>
      <rect x='0' y='8' width='200' height='64' rx='8' fill='rgba(34,197,94,0.04)' />
      <rect x='6' y='22' width='36' height='40' rx='6' fill='rgba(255,255,255,0.04)' stroke='rgba(255,255,255,0.08)' strokeWidth='1' />
      <line x1='13' y1='32' x2='35' y2='32' stroke='#374151' strokeWidth='1.5' />
      <line x1='13' y1='38' x2='29' y2='38' stroke='#374151' strokeWidth='1.5' />
      <line x1='13' y1='44' x2='33' y2='44' stroke='#374151' strokeWidth='1.5' />
      <path d='M44 42 L60 42' stroke='rgba(34,197,94,0.4)' strokeWidth='1.5' strokeDasharray='3 2' />
      <polygon points='60,39 65,42 60,45' fill='#22c55e' />
      <path d='M82 22 l12 6v8c0 5.5-4 10-12 11-8-1-12-5.5-12-11v-8l12-6z' fill='rgba(34,197,94,0.14)' stroke='#22c55e' strokeWidth='1.75' />
      <path d='M77 37 l3 3 6-6' stroke='#22c55e' strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M96 42 L112 42' stroke='rgba(34,197,94,0.4)' strokeWidth='1.5' strokeDasharray='3 2' />
      <polygon points='112,39 117,42 112,45' fill='#22c55e' />
      <rect x='119' y='22' width='73' height='40' rx='6' fill='rgba(255,255,255,0.04)' stroke='rgba(255,255,255,0.08)' strokeWidth='1' />
      <circle cx='133' cy='36' r='3.5' fill='#1f2937' stroke='rgba(255,255,255,0.06)' />
      <circle cx='147' cy='34' r='3.5' fill='#1f2937' stroke='rgba(255,255,255,0.06)' />
      <circle cx='161' cy='38' r='3.5' fill='#1f2937' stroke='rgba(255,255,255,0.06)' />
      <circle cx='175' cy='33' r='3.5' fill='#1f2937' stroke='rgba(255,255,255,0.06)' />
      <path d='M133 36 L147 34 L161 38 L175 33' stroke='#22c55e' strokeWidth='1.5' fill='none' opacity='0.7' />
    </svg>
  );
}

function TrainingIllus() {
  return (
    <svg viewBox='0 0 200 80' fill='none' className='w-full max-h-[80px]' aria-hidden='true'>
      <rect x='0' y='8' width='200' height='64' rx='8' fill='rgba(168,85,247,0.04)' />
      <rect x='6' y='20' width='32' height='44' rx='4' fill='rgba(255,255,255,0.04)' stroke='rgba(255,255,255,0.08)' strokeWidth='1' />
      <line x1='12' y1='30' x2='31' y2='30' stroke='#374151' strokeWidth='1.5' />
      <line x1='12' y1='36' x2='27' y2='36' stroke='#4b1d96' strokeWidth='1.5' opacity='0.6' />
      <line x1='12' y1='42' x2='30' y2='42' stroke='#374151' strokeWidth='1.5' />
      <line x1='12' y1='48' x2='25' y2='48' stroke='#4b1d96' strokeWidth='1.5' opacity='0.6' />
      <line x1='12' y1='54' x2='28' y2='54' stroke='#374151' strokeWidth='1.5' />
      <path d='M40 42 L52 42' stroke='rgba(168,85,247,0.4)' strokeWidth='1.5' strokeDasharray='3 2' />
      <polygon points='52,39 57,42 52,45' fill='#a855f7' />
      <rect x='58' y='26' width='30' height='30' rx='6' fill='rgba(168,85,247,0.1)' stroke='rgba(168,85,247,0.3)' strokeWidth='1.5' />
      <rect x='64' y='32' width='8' height='8' rx='2' fill='rgba(168,85,247,0.5)' />
      <rect x='74' y='32' width='8' height='8' rx='2' fill='rgba(168,85,247,0.5)' />
      <rect x='64' y='42' width='8' height='8' rx='2' fill='rgba(168,85,247,0.28)' />
      <rect x='74' y='42' width='8' height='8' rx='2' fill='rgba(168,85,247,0.28)' />
      <path d='M90 42 L102 42' stroke='rgba(168,85,247,0.4)' strokeWidth='1.5' strokeDasharray='3 2' />
      <polygon points='102,39 107,42 102,45' fill='#a855f7' />
      <rect x='108' y='26' width='36' height='30' rx='5' fill='rgba(168,85,247,0.08)' stroke='rgba(168,85,247,0.2)' strokeWidth='1' />
      <text x='126' y='45' textAnchor='middle' fill='#a855f7' fontSize='8' fontFamily='monospace'>.jsonl</text>
      <path d='M146 42 L158 42' stroke='rgba(168,85,247,0.4)' strokeWidth='1.5' strokeDasharray='3 2' />
      <polygon points='158,39 163,42 158,45' fill='#a855f7' />
      <rect x='164' y='20' width='28' height='44' rx='5' fill='rgba(124,58,237,0.85)' />
      <text x='178' y='46' textAnchor='middle' fill='#fff' fontSize='7.5' fontFamily='monospace' transform='rotate(-90,178,46)'>LoRA</text>
    </svg>
  );
}

function ChatIllus() {
  return (
    <svg viewBox='0 0 200 80' fill='none' className='w-full max-h-[80px]' aria-hidden='true'>
      <rect x='0' y='8' width='200' height='64' rx='8' fill='rgba(249,115,22,0.04)' />
      {/* Doc */}
      <rect x='6' y='22' width='26' height='36' rx='4' fill='rgba(255,255,255,0.04)' stroke='rgba(255,255,255,0.08)' strokeWidth='1' />
      <line x1='11' y1='30' x2='25' y2='30' stroke='#374151' strokeWidth='1.5' />
      <line x1='11' y1='36' x2='22' y2='36' stroke='#374151' strokeWidth='1.5' />
      <line x1='11' y1='42' x2='24' y2='42' stroke='#374151' strokeWidth='1.5' />
      <line x1='11' y1='48' x2='20' y2='48' stroke='#374151' strokeWidth='1.5' />
      <path d='M34 40 L46 40' stroke='rgba(249,115,22,0.4)' strokeWidth='1.5' strokeDasharray='3 2' />
      <polygon points='46,37 51,40 46,43' fill='#f97316' />
      {/* Vector store */}
      <rect x='52' y='24' width='38' height='32' rx='6' fill='rgba(249,115,22,0.08)' stroke='rgba(249,115,22,0.22)' strokeWidth='1.5' />
      <circle cx='64' cy='36' r='2.5' fill='#f97316' opacity='0.9' />
      <circle cx='76' cy='33' r='2.5' fill='#f97316' opacity='0.6' />
      <circle cx='70' cy='43' r='2.5' fill='#f97316' opacity='0.8' />
      <circle cx='60' cy='46' r='2.5' fill='#f97316' opacity='0.4' />
      <circle cx='82' cy='44' r='2.5' fill='#f97316' opacity='0.7' />
      <path d='M60 36 Q70 28 76 33' stroke='#f97316' strokeWidth='1' fill='none' opacity='0.5' />
      <path d='M94 40 L106 40' stroke='rgba(249,115,22,0.4)' strokeWidth='1.5' strokeDasharray='3 2' />
      <polygon points='106,37 111,40 106,43' fill='#f97316' />
      {/* LLM */}
      <rect x='112' y='24' width='36' height='32' rx='6' fill='rgba(255,255,255,0.04)' stroke='rgba(255,255,255,0.09)' strokeWidth='1' />
      <text x='130' y='43' textAnchor='middle' fill='#52525b' fontSize='8.5' fontFamily='monospace'>LLM</text>
      <path d='M150 40 L162 40' stroke='rgba(249,115,22,0.4)' strokeWidth='1.5' strokeDasharray='3 2' />
      <polygon points='162,37 167,40 162,43' fill='#f97316' />
      {/* 3D cube */}
      <g transform='translate(168,24)'>
        <polygon points='16,0 30,8 30,24 16,32 2,24 2,8' fill='rgba(249,115,22,0.1)' stroke='#f97316' strokeWidth='1.5' />
        <line x1='16' y1='0' x2='16' y2='16' stroke='#f97316' strokeWidth='1' opacity='0.4' />
        <line x1='2' y1='8' x2='16' y2='16' stroke='#f97316' strokeWidth='1' opacity='0.4' />
        <line x1='30' y1='8' x2='16' y2='16' stroke='#f97316' strokeWidth='1' opacity='0.4' />
      </g>
    </svg>
  );
}

/* ── Data ───────────────────────────────────────────── */
const stats = [
  { metric: '40%', label: 'fewer support calls', detail: 'via structured guard rails' },
  { metric: 'Zero', label: 'injection incidents', detail: 'with input validation layer' },
  { metric: '3×', label: 'product launches led', detail: 'end-to-end delivery' }
];

const pillars = [
  {
    title: 'MCP Sentinel',
    desc: 'Drop-in observability for agent tool calls. Log, guard, and audit every MCP interaction without changing your tools.',
    href: '/mcp',
    Illus: SentinelIllus,
    link: 'Explore Sentinel →'
  },
  {
    title: 'Custom Training',
    desc: 'Codebase to dataset to LoRA in your infra. Turn internal knowledge into fine-tuned models automatically.',
    href: '/training',
    Illus: TrainingIllus,
    link: 'Explore Training →'
  },
  {
    title: 'RAG + 3D Chat',
    desc: 'Chat with your docs, render 3D outputs. Retrieval-augmented generation with interactive visual context.',
    href: '/chat',
    Illus: ChatIllus,
    link: 'Explore Chat →'
  }
];

const philosophy = [
  {
    n: '01',
    title: 'Cost-Aware',
    desc: 'Every API call has a price tag. Rate limiting, caching, and tiered routing keep costs predictable.'
  },
  {
    n: '02',
    title: 'Security-First',
    desc: 'Input validation, HMAC signing, RLS policies, and guard rails are built in — not bolted on.'
  },
  {
    n: '03',
    title: 'Minimal Surface',
    desc: 'Ship the smallest thing that works. Three lines of code beats a premature framework.'
  }
];

/* ── Component ──────────────────────────────────────── */
export function LandingContent() {
  return (
    <div className='relative text-white'>
      <GridBackground />

      {/* Hero */}
      <section className='relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28'>
        <div>
          <MonoEyebrow color='green' className='mb-7'>
            AI Engineering · Production-Grade
          </MonoEyebrow>
          <h1 className='mb-5 text-5xl font-extrabold leading-[1.07] tracking-[-0.04em] md:text-6xl'
            style={{ background: 'linear-gradient(160deg,#fff 0%,rgba(255,255,255,0.5) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Build AI products<br />that ship.
          </h1>
          <p className='mb-10 max-w-md text-base leading-relaxed text-[#71717a]'>
            Agent observability, fine-tuning pipelines, and RAG chat — built with cost discipline, security-first, and zero over-engineering.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Link
              href='/mcp'
              className='inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:shadow-[0_0_32px_rgba(34,197,94,0.5)] hover:-translate-y-px'
            >
              Explore MCP Sentinel →
            </Link>
            <Link
              href='/dashboard/overview'
              className='inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/[0.08]'
            >
              View Dashboard
            </Link>
          </div>
        </div>
        <div className='flex justify-center'>
          <HeroDiagram />
        </div>
      </section>

      {/* Stats */}
      <div className='relative z-10 border-y border-white/[0.07] bg-white/[0.015]'>
        <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-3'>
          {stats.map((s) => (
            <div key={s.label} className='text-center'>
              <p className='font-mono text-4xl font-bold'
                style={{ background: 'linear-gradient(90deg,#22c55e,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.metric}
              </p>
              <p className='mt-1.5 text-sm font-medium text-white'>{s.label}</p>
              <p className='mt-0.5 text-xs text-[#52525b]'>{s.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pillars */}
      <section className='relative z-10 mx-auto max-w-6xl px-6 py-20'>
        <h2 className='mb-2 text-center text-3xl font-bold tracking-[-0.025em]'>Three Pillars</h2>
        <p className='mb-12 text-center text-[#71717a]'>Each product solves a real problem in the AI engineering stack.</p>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
          {pillars.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className='group relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:border-white/[0.14] hover:-translate-y-0.5'
            >
              <div className='mb-5'>
                <p.Illus />
              </div>
              <h3 className='mb-2 text-base font-semibold text-white'>{p.title}</h3>
              <p className='text-sm leading-relaxed text-[#71717a]'>{p.desc}</p>
              <span className='mt-4 inline-flex font-mono text-xs text-[#22c55e] group-hover:underline'>
                {p.link}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Terminal quickstart */}
      <div className='relative z-10 mx-auto max-w-6xl px-6 pb-20'>
        <h2 className='mb-5 text-xl font-bold tracking-[-0.02em]'>Quickstart in 3 lines</h2>
        <div className='overflow-hidden rounded-xl border border-white/[0.09] bg-[#0a0a0c] shadow-[0_0_60px_rgba(0,0,0,0.7)]'>
          <div className='flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-4 py-3'>
            <span className='h-2.5 w-2.5 rounded-full bg-[#ff5f57]' />
            <span className='h-2.5 w-2.5 rounded-full bg-[#febc2e]' />
            <span className='h-2.5 w-2.5 rounded-full bg-[#28c840]' />
            <span className='ml-2 font-mono text-[11px] text-[#52525b]'>mcp-server.ts</span>
          </div>
          <pre className='px-6 py-5 font-mono text-[13px] leading-[1.9] overflow-x-auto'>
            <span className='text-[#c084fc]'>import</span>
            <span className='text-[#d1d5db]'> {'{ MCPSentinel }'} </span>
            <span className='text-[#c084fc]'>from</span>
            <span className='text-[#86efac]'> &apos;@your-org/mcp-sentinel&apos;</span>
            <span className='text-[#d1d5db]'>;{'\n'}</span>
            {'\n'}
            <span className='text-[#c084fc]'>const</span>
            <span className='text-[#f9a8d4]'> sentinel </span>
            <span className='text-[#fb923c]'>=</span>
            <span className='text-[#c084fc]'> new</span>
            <span className='text-[#60a5fa]'> MCPSentinel</span>
            <span className='text-[#d1d5db]'>{'({ apiKey, guards: ['}</span>
            <span className='text-[#86efac]'>&apos;injection&apos;</span>
            <span className='text-[#d1d5db]'>, </span>
            <span className='text-[#86efac]'>&apos;pii&apos;</span>
            <span className='text-[#d1d5db]'>, </span>
            <span className='text-[#86efac]'>&apos;cost&apos;</span>
            <span className='text-[#d1d5db]'>{'] });'}</span>
            {'\n\n'}
            <span className='text-[#4b5563]'>{'// Zero changes to your existing tools'}</span>
            {'\n'}
            <span className='text-[#c084fc]'>const</span>
            <span className='text-[#f9a8d4]'> server </span>
            <span className='text-[#fb923c]'>=</span>
            <span className='text-[#f9a8d4]'> sentinel</span>
            <span className='text-[#d1d5db]'>.</span>
            <span className='text-[#60a5fa]'>wrap</span>
            <span className='text-[#d1d5db]'>(yourMCPServer);</span>
            {'\n'}
            <span className='text-[#f9a8d4]'>server</span>
            <span className='text-[#d1d5db]'>.</span>
            <span className='text-[#60a5fa]'>listen</span>
            <span className='text-[#d1d5db]'>(3001);</span>
          </pre>
        </div>
      </div>

      {/* Philosophy */}
      <div className='relative z-10 border-t border-white/[0.07] bg-white/[0.015]'>
        <div className='mx-auto max-w-6xl px-6 py-20'>
          <h2 className='mb-2 text-center text-3xl font-bold tracking-[-0.025em]'>Build Philosophy</h2>
          <p className='mb-14 text-center text-[#71717a]'>Engineering principles that ship reliable AI products.</p>
          <div className='grid grid-cols-1 gap-10 md:grid-cols-3'>
            {philosophy.map((p) => (
              <div key={p.n}>
                <p className='mb-3 font-mono text-5xl font-bold text-white/[0.05]'>{p.n}</p>
                <h3 className='mb-2 text-base font-semibold text-white'>{p.title}</h3>
                <p className='text-sm leading-[1.75] text-[#71717a]'>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Build**
```bash
npm run build 2>&1 | tail -30
```
Expected: no errors.

**Step 3: Commit**
```bash
git add src/components/landing/landing-content.tsx
git commit -m "feat: dark terminal landing page with split hero and SVG illustrations"
```

---

### Task 6: Dark MCP public page

**Files:**
- Modify: `src/components/mcp/mcp-content.tsx`

**Step 1: Update hero section and general dark styling**

The file is large. Apply these targeted changes throughout:

1. **Hero section** — replace the opening `<section className='py-20'>` block with:
```tsx
{/* Hero */}
<section className='relative z-10 mx-auto max-w-4xl px-6 py-20'>
  <GridBackground />
  <MonoEyebrow color='green' className='mb-6'>Agent Observability</MonoEyebrow>
  <h1
    className='mb-4 text-5xl font-extrabold tracking-[-0.04em] leading-[1.07]'
    style={{ background: 'linear-gradient(160deg,#fff 0%,rgba(255,255,255,0.5) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
  >
    MCP Sentinel
  </h1>
  <p className='mb-8 max-w-2xl text-base leading-relaxed text-[#71717a]'>
    Drop-in observability for agent tool calls. Every MCP interaction is
    logged, guarded, and auditable — without changing your tool implementations.
  </p>
  <div className='flex gap-3'>
    <Button asChild size='lg' className='bg-[#22c55e] text-black hover:bg-[#16a34a] shadow-[0_0_20px_rgba(34,197,94,0.3)]'>
      <Link href='/dashboard/mcp'>Open Dashboard <IconArrowRight className='ml-2 h-4 w-4' /></Link>
    </Button>
    <Button variant='outline' size='lg' asChild className='border-white/[0.08] bg-white/[0.04] text-white hover:bg-white/[0.08]'>
      <a href='#quickstart'>Quickstart</a>
    </Button>
  </div>
</section>
```

2. **Add imports** at top of file:
```tsx
import { GridBackground } from '@/components/ui/grid-background';
import { MonoEyebrow } from '@/components/ui/mono-eyebrow';
```

3. **What/Who/Why section** — change outer `className`:
```tsx
<section className='border-y border-white/[0.07] bg-white/[0.015] py-14'>
```
And inner divs: `className='text-white'`, headings `className='mb-2 font-semibold text-white'`, body `className='text-sm leading-relaxed text-[#71717a]'`

4. **All `<section className='bg-muted/30 ...'>` sections** → `border-y border-white/[0.07] bg-white/[0.015]`

5. **All `<section className='py-20'>` sections** → `relative z-10 py-20`

6. **Live demo event rows** — change the event row div:
```tsx
className='animate-in fade-in slide-in-from-left-2 flex items-center gap-4 rounded-lg border border-white/[0.07] bg-white/[0.04] p-4 font-mono'
```

7. **Architecture/guard flow diagram cards** — change wrapping div:
```tsx
<div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
```

8. **Pricing cards** — change outer section and card backgrounds:
```tsx
<div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
```

**Step 2: Build**
```bash
npm run build 2>&1 | tail -20
```

**Step 3: Commit**
```bash
git add src/components/mcp/mcp-content.tsx
git commit -m "feat: dark terminal MCP product page"
```

---

### Task 7: Dark Training public page

**Files:**
- Modify: `src/components/training/training-content.tsx`

**Step 1: Apply same pattern as Task 6**

1. **Add imports:**
```tsx
import { GridBackground } from '@/components/ui/grid-background';
import { MonoEyebrow } from '@/components/ui/mono-eyebrow';
```

2. **Hero section:**
```tsx
<section className='relative z-10 mx-auto max-w-4xl px-6 py-20'>
  <GridBackground />
  <MonoEyebrow color='purple' className='mb-6'>Fine-Tuning Pipeline</MonoEyebrow>
  <h1
    className='mb-4 text-5xl font-extrabold tracking-[-0.04em] leading-[1.07]'
    style={{ background: 'linear-gradient(160deg,#fff 0%,rgba(255,255,255,0.5) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
  >
    Custom Training
  </h1>
  <p className='mb-8 max-w-2xl text-base leading-relaxed text-[#71717a]'>
    Turn your codebase into a fine-tuned model. Automated parsing, dataset
    generation, and training — all in your infrastructure.
  </p>
</section>
```

3. **Stepper section** — outer:
```tsx
<section className='border-y border-white/[0.07] bg-white/[0.015] py-20'>
```

4. **Step indicator active circle** — `className` for active step:
```tsx
'border-[#a855f7] text-[#a855f7]'
```
Completed: `'border-[#a855f7] bg-[#a855f7] text-black'`
Inactive: `'border-white/20 text-[#52525b]'`

5. **Step connector line** — active: `'bg-[#a855f7]'`, inactive: `'bg-white/10'`

6. **Step content card:**
```tsx
<div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-8 backdrop-blur-sm'>
```

7. **Mode selection buttons** — selected:
```tsx
'border-[#a855f7] bg-[#a855f7]/05 text-white'
```
Unselected: `'border-white/[0.07] text-[#71717a] hover:border-white/20'`

8. **Config items:**
```tsx
<div className='rounded-lg border border-white/[0.07] p-3'>
  <p className='text-xs text-[#52525b]'>{config.label}</p>
  <p className='text-sm font-medium text-white'>{config.value}</p>
</div>
```

9. **All `bg-muted/30` sections** → `border-y border-white/[0.07] bg-white/[0.015]`

**Step 2: Build**
```bash
npm run build 2>&1 | tail -20
```

**Step 3: Commit**
```bash
git add src/components/training/training-content.tsx
git commit -m "feat: dark terminal Training product page"
```

---

### Task 8: Wire Chat page to real API + dark UI

**Files:**
- Modify: `src/components/chat/chat-content.tsx`

**Step 1: Full rewrite**

```tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';
import { GridBackground } from '@/components/ui/grid-background';
import { MonoEyebrow } from '@/components/ui/mono-eyebrow';
import {
  IconUpload,
  IconSend,
  IconFile,
  IconX,
  IconLoader2
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const architectureChart = `graph LR
  A[Upload PDF/Text] --> B[Chunker]
  B --> C[Embeddings]
  C --> D[Vector Store]
  E[User Query] --> F[Retriever]
  D --> F
  F --> G[LLM + Context]
  G --> H[Response]
  H --> I{3D Content?}
  I -->|Yes| J[Three.js Viewer]
  I -->|No| K[Text Response]`;

const INITIAL_MESSAGES: ChatMessage[] = [
  { role: 'user', content: 'What authentication pattern does this project use?' },
  {
    role: 'assistant',
    content:
      'Based on the codebase, this project uses **Clerk** for authentication. The middleware is configured in `proxy.ts` (Next.js 16 pattern) which protects `/dashboard(.*)` routes via `clerkMiddleware`.\n\nKey files:\n- `src/proxy.ts` — middleware configuration\n- `src/components/layout/providers.tsx` — ClerkProvider wrapper\n- `src/app/auth/` — sign-in/sign-up routes'
  }
];

export function ChatContent() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    const assistantMsg: ChatMessage = { role: 'assistant', content: '' };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsStreaming(true);
    setError(null);

    try {
      const context = files.map((f) => f.content).join('\n---\n') || undefined;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context
        })
      });

      if (res.status === 429) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content:
              'Rate limit reached (2 requests/hour for guests). Sign in for 50/hour.'
          };
          return updated;
        });
        return;
      }

      if (!res.ok || !res.body) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        for (const line of text.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') break;
          try {
            const { content } = JSON.parse(payload) as { content: string };
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: 'assistant',
                content: updated[updated.length - 1].content + content
              };
              return updated;
            });
          } catch {
            // malformed SSE chunk — skip
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    Array.from(selected).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFiles((prev) => [
          ...prev,
          { name: file.name, content: ev.target?.result as string }
        ]);
      };
      reader.readAsText(file);
    });
    e.target.value = '';
  };

  return (
    <div className='relative text-white'>
      <GridBackground />

      {/* Hero */}
      <section className='relative z-10 mx-auto max-w-4xl px-6 py-20'>
        <MonoEyebrow color='orange' className='mb-6'>
          Retrieval-Augmented Generation
        </MonoEyebrow>
        <h1
          className='mb-4 text-5xl font-extrabold tracking-[-0.04em] leading-[1.07]'
          style={{
            background:
              'linear-gradient(160deg,#fff 0%,rgba(255,255,255,0.5) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          RAG + 3D Chat
        </h1>
        <p className='max-w-2xl text-base leading-relaxed text-[#71717a]'>
          Upload documents, ask questions, get answers grounded in your data.
          When responses include spatial data, they render in an interactive 3D
          viewer.
        </p>
      </section>

      {/* Chat Interface */}
      <section className='relative z-10 border-y border-white/[0.07] bg-white/[0.015] py-12'>
        <div className='mx-auto max-w-6xl px-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Chat panel */}
            <div className='flex flex-col gap-4 lg:col-span-2'>
              {/* Upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept='.pdf,.txt,.md,.csv'
                  className='hidden'
                  onChange={handleFileChange}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/[0.1] p-4 text-sm text-[#71717a] transition-colors hover:border-white/20 hover:text-white'
                >
                  <IconUpload className='h-4 w-4' />
                  Drop PDFs, text, or markdown here
                </button>
                {files.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {files.map((f, i) => (
                      <Badge
                        key={i}
                        variant='outline'
                        className='gap-1 border-white/[0.1] bg-white/[0.04] text-[#a1a1aa]'
                      >
                        <IconFile className='h-3 w-3' />
                        {f.name}
                        <button
                          onClick={() =>
                            setFiles((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          className='ml-1 hover:text-white'
                        >
                          <IconX className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className='flex-1 space-y-4 overflow-y-auto rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 min-h-[320px] max-h-[480px]'>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg px-4 py-3 text-sm',
                        msg.role === 'user'
                          ? 'bg-[#22c55e]/20 text-white border border-[#22c55e]/20'
                          : 'bg-white/[0.06] text-[#d1d5db] border border-white/[0.07]'
                      )}
                    >
                      <p className='whitespace-pre-wrap'>{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isStreaming && messages[messages.length - 1]?.content === '' && (
                  <div className='flex justify-start'>
                    <div className='rounded-lg border border-white/[0.07] bg-white/[0.06] px-4 py-3'>
                      <IconLoader2 className='h-4 w-4 animate-spin text-[#71717a]' />
                    </div>
                  </div>
                )}
                {error && (
                  <p className='text-center text-xs text-red-400'>{error}</p>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className='flex gap-2'>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Ask about your documents...'
                  className='min-h-[44px] resize-none border-white/[0.08] bg-white/[0.04] text-white placeholder:text-[#52525b] focus-visible:ring-[#22c55e]/30'
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  disabled={isStreaming || !input.trim()}
                  size='icon'
                  className='shrink-0 bg-[#22c55e] text-black hover:bg-[#16a34a] disabled:opacity-40'
                >
                  {isStreaming ? (
                    <IconLoader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <IconSend className='h-4 w-4' />
                  )}
                </Button>
              </div>

              <p className='text-xs text-[#52525b]'>
                Rate limited: 2 messages/hour (guest) · 50/hour (signed in)
              </p>
            </div>

            {/* 3D Viewer */}
            <div className='flex flex-col'>
              <h3 className='mb-2 text-sm font-medium text-white'>3D Viewer</h3>
              <div className='flex flex-1 min-h-[300px] items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]'>
                <div className='text-center'>
                  <svg viewBox='0 0 64 64' className='mx-auto mb-3 h-16 w-16 opacity-20' fill='none'>
                    <polygon points='32,4 60,18 60,46 32,60 4,46 4,18' stroke='#f97316' strokeWidth='2' />
                    <line x1='32' y1='4' x2='32' y2='32' stroke='#f97316' strokeWidth='1' opacity='0.5' />
                    <line x1='4' y1='18' x2='32' y2='32' stroke='#f97316' strokeWidth='1' opacity='0.5' />
                    <line x1='60' y1='18' x2='32' y2='32' stroke='#f97316' strokeWidth='1' opacity='0.5' />
                  </svg>
                  <p className='text-xs text-[#52525b]'>
                    Renders when response includes 3D data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className='relative z-10 mx-auto max-w-4xl px-6 py-20'>
        <h2 className='mb-8 text-2xl font-bold tracking-[-0.02em]'>Architecture</h2>
        <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
          <MermaidDiagram chart={architectureChart} />
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Build**
```bash
npm run build 2>&1 | tail -30
```
Expected: no TypeScript errors.

**Step 3: Commit**
```bash
git add src/components/chat/chat-content.tsx
git commit -m "feat: wire chat page to real SSE API, dark terminal UI, 2/hr rate limit"
```

---

### Task 9: Final build verification

**Step 1: Full build + lint**
```bash
npm run lint:strict 2>&1 | tail -30
npm run build 2>&1 | tail -30
```
Expected: zero warnings, zero errors, successful build.

**Step 2: Start dev server and smoke-test**
```bash
npm run dev &
sleep 5
curl -s http://localhost:3000 | grep -o 'david_papp\|MCP Sentinel\|Custom Training' | head -5
```
Expected: site responds, key text present.

**Step 3: Final commit if any lint fixes needed**
```bash
npm run lint:fix
git add -A
git commit -m "fix: lint cleanup after dark terminal implementation"
```

**Step 4: Kill dev server**
```bash
kill %1
```

---

## Summary

| Task | Files | Type |
|------|-------|------|
| 1 | `rate-limit.ts`, `api/chat/route.ts` | Rate limit |
| 2 | `ui/grid-background.tsx` | New component |
| 3 | `ui/mono-eyebrow.tsx` | New component |
| 4 | `layout.tsx`, `public-header.tsx`, `footer.tsx` | Dark layout |
| 5 | `landing-content.tsx` | Full rewrite |
| 6 | `mcp-content.tsx` | Dark restyling |
| 7 | `training-content.tsx` | Dark restyling |
| 8 | `chat-content.tsx` | SSE wiring + dark |
| 9 | All | Verification |
