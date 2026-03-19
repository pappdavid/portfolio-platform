'use client';

import Link from 'next/link';
import { GridBackground } from '@/components/ui/grid-background';
import { MonoEyebrow } from '@/components/ui/mono-eyebrow';
import { AMASection } from '@/components/ama/AMASection';

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
      <rect
        x='10'
        y='10'
        width='460'
        height='300'
        rx='16'
        fill='rgba(255,255,255,0.03)'
        stroke='rgba(255,255,255,0.07)'
        strokeWidth='1'
      />
      {/* Agent */}
      <rect
        x='28'
        y='110'
        width='88'
        height='80'
        rx='10'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.09)'
        strokeWidth='1'
      />
      <text
        x='72'
        y='138'
        textAnchor='middle'
        fill='#52525b'
        fontSize='9'
        fontFamily='monospace'
        letterSpacing='1'
      >
        AGENT
      </text>
      <rect
        x='52'
        y='146'
        width='40'
        height='28'
        rx='5'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.07)'
        strokeWidth='1'
      />
      <circle cx='64' cy='158' r='3' fill='#4b5563' />
      <circle cx='80' cy='158' r='3' fill='#4b5563' />
      <path
        d='M61 165 Q72 170 83 165'
        stroke='#4b5563'
        strokeWidth='1.5'
        fill='none'
        strokeLinecap='round'
      />
      {/* Arrow A→S */}
      <path
        d='M118 150 L160 150'
        stroke='url(#flowGrad)'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='160,146.5 167,150 160,153.5' fill='#22c55e' />
      {/* Sentinel */}
      <rect
        x='168'
        y='90'
        width='144'
        height='120'
        rx='14'
        fill='rgba(34,197,94,0.07)'
        stroke='rgba(34,197,94,0.22)'
        strokeWidth='1.5'
      />
      <text
        x='240'
        y='116'
        textAnchor='middle'
        fill='#22c55e'
        fontSize='9'
        fontFamily='monospace'
        letterSpacing='1'
      >
        MCP SENTINEL
      </text>
      <path
        d='M240 128 l17 8v11c0 7.5-6 14-17 16-11-2-17-8.5-17-16v-11l17-8z'
        fill='rgba(34,197,94,0.14)'
        stroke='#22c55e'
        strokeWidth='1.75'
      />
      <path
        d='M234 148 l3.5 3.5 8-8'
        stroke='#22c55e'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <text
        x='240'
        y='198'
        textAnchor='middle'
        fill='#3f3f46'
        fontSize='8.5'
        fontFamily='monospace'
      >
        guard · log · audit
      </text>
      {/* Arrow S→T */}
      <path
        d='M314 150 L356 150'
        stroke='url(#flowGrad)'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <polygon points='356,146.5 363,150 356,153.5' fill='#06b6d4' />
      {/* Tools */}
      <rect
        x='364'
        y='110'
        width='88'
        height='80'
        rx='10'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.09)'
        strokeWidth='1'
      />
      <text
        x='408'
        y='138'
        textAnchor='middle'
        fill='#52525b'
        fontSize='9'
        fontFamily='monospace'
        letterSpacing='1'
      >
        TOOLS
      </text>
      <rect
        x='382'
        y='148'
        width='14'
        height='14'
        rx='3'
        fill='#1c1c1e'
        stroke='rgba(255,255,255,0.08)'
        strokeWidth='1'
      />
      <rect
        x='400'
        y='148'
        width='14'
        height='14'
        rx='3'
        fill='#1c1c1e'
        stroke='rgba(255,255,255,0.08)'
        strokeWidth='1'
      />
      <rect x='382' y='166' width='14' height='8' rx='2' fill='#161618' />
      <rect x='400' y='166' width='14' height='8' rx='2' fill='#161618' />
      {/* Blocked path */}
      <path
        d='M240 210 L240 248'
        stroke='#ef4444'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <rect
        x='200'
        y='248'
        width='80'
        height='34'
        rx='8'
        fill='rgba(239,68,68,0.09)'
        stroke='rgba(239,68,68,0.25)'
        strokeWidth='1'
      />
      <text
        x='240'
        y='264'
        textAnchor='middle'
        fill='#ef4444'
        fontSize='8.5'
        fontFamily='monospace'
      >
        BLOCKED
      </text>
      <text
        x='240'
        y='276'
        textAnchor='middle'
        fill='#52525b'
        fontSize='8'
        fontFamily='monospace'
      >
        + alert sent
      </text>
      {/* Event log */}
      <path
        d='M240 90 L240 60'
        stroke='rgba(255,255,255,0.12)'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
      <rect
        x='192'
        y='34'
        width='96'
        height='24'
        rx='6'
        fill='rgba(255,255,255,0.03)'
        stroke='rgba(255,255,255,0.07)'
        strokeWidth='1'
      />
      <text
        x='240'
        y='50'
        textAnchor='middle'
        fill='#52525b'
        fontSize='8.5'
        fontFamily='monospace'
      >
        EVENT LOG
      </text>
    </svg>
  );
}

/* ── SVG: Pillar card illustrations ──────────────────── */
function SentinelIllus() {
  return (
    <svg
      viewBox='0 0 200 80'
      fill='none'
      className='max-h-[80px] w-full'
      aria-hidden='true'
    >
      <rect
        x='0'
        y='8'
        width='200'
        height='64'
        rx='8'
        fill='rgba(34,197,94,0.04)'
      />
      <rect
        x='6'
        y='22'
        width='36'
        height='40'
        rx='6'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.08)'
        strokeWidth='1'
      />
      <line
        x1='13'
        y1='32'
        x2='35'
        y2='32'
        stroke='#374151'
        strokeWidth='1.5'
      />
      <line
        x1='13'
        y1='38'
        x2='29'
        y2='38'
        stroke='#374151'
        strokeWidth='1.5'
      />
      <line
        x1='13'
        y1='44'
        x2='33'
        y2='44'
        stroke='#374151'
        strokeWidth='1.5'
      />
      <path
        d='M44 42 L60 42'
        stroke='rgba(34,197,94,0.4)'
        strokeWidth='1.5'
        strokeDasharray='3 2'
      />
      <polygon points='60,39 65,42 60,45' fill='#22c55e' />
      <path
        d='M82 22 l12 6v8c0 5.5-4 10-12 11-8-1-12-5.5-12-11v-8l12-6z'
        fill='rgba(34,197,94,0.14)'
        stroke='#22c55e'
        strokeWidth='1.75'
      />
      <path
        d='M77 37 l3 3 6-6'
        stroke='#22c55e'
        strokeWidth='1.75'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M96 42 L112 42'
        stroke='rgba(34,197,94,0.4)'
        strokeWidth='1.5'
        strokeDasharray='3 2'
      />
      <polygon points='112,39 117,42 112,45' fill='#22c55e' />
      <rect
        x='119'
        y='22'
        width='73'
        height='40'
        rx='6'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.08)'
        strokeWidth='1'
      />
      <circle
        cx='133'
        cy='36'
        r='3.5'
        fill='#1f2937'
        stroke='rgba(255,255,255,0.06)'
      />
      <circle
        cx='147'
        cy='34'
        r='3.5'
        fill='#1f2937'
        stroke='rgba(255,255,255,0.06)'
      />
      <circle
        cx='161'
        cy='38'
        r='3.5'
        fill='#1f2937'
        stroke='rgba(255,255,255,0.06)'
      />
      <circle
        cx='175'
        cy='33'
        r='3.5'
        fill='#1f2937'
        stroke='rgba(255,255,255,0.06)'
      />
      <path
        d='M133 36 L147 34 L161 38 L175 33'
        stroke='#22c55e'
        strokeWidth='1.5'
        fill='none'
        opacity='0.7'
      />
    </svg>
  );
}

function TrainingIllus() {
  return (
    <svg
      viewBox='0 0 200 80'
      fill='none'
      className='max-h-[80px] w-full'
      aria-hidden='true'
    >
      <rect
        x='0'
        y='8'
        width='200'
        height='64'
        rx='8'
        fill='rgba(168,85,247,0.04)'
      />
      <rect
        x='6'
        y='20'
        width='32'
        height='44'
        rx='4'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.08)'
        strokeWidth='1'
      />
      <line
        x1='12'
        y1='30'
        x2='31'
        y2='30'
        stroke='#374151'
        strokeWidth='1.5'
      />
      <line
        x1='12'
        y1='36'
        x2='27'
        y2='36'
        stroke='#4b1d96'
        strokeWidth='1.5'
        opacity='0.6'
      />
      <line
        x1='12'
        y1='42'
        x2='30'
        y2='42'
        stroke='#374151'
        strokeWidth='1.5'
      />
      <line
        x1='12'
        y1='48'
        x2='25'
        y2='48'
        stroke='#4b1d96'
        strokeWidth='1.5'
        opacity='0.6'
      />
      <line
        x1='12'
        y1='54'
        x2='28'
        y2='54'
        stroke='#374151'
        strokeWidth='1.5'
      />
      <path
        d='M40 42 L52 42'
        stroke='rgba(168,85,247,0.4)'
        strokeWidth='1.5'
        strokeDasharray='3 2'
      />
      <polygon points='52,39 57,42 52,45' fill='#a855f7' />
      <rect
        x='58'
        y='26'
        width='30'
        height='30'
        rx='6'
        fill='rgba(168,85,247,0.1)'
        stroke='rgba(168,85,247,0.3)'
        strokeWidth='1.5'
      />
      <rect
        x='64'
        y='32'
        width='8'
        height='8'
        rx='2'
        fill='rgba(168,85,247,0.5)'
      />
      <rect
        x='74'
        y='32'
        width='8'
        height='8'
        rx='2'
        fill='rgba(168,85,247,0.5)'
      />
      <rect
        x='64'
        y='42'
        width='8'
        height='8'
        rx='2'
        fill='rgba(168,85,247,0.28)'
      />
      <rect
        x='74'
        y='42'
        width='8'
        height='8'
        rx='2'
        fill='rgba(168,85,247,0.28)'
      />
      <path
        d='M90 42 L102 42'
        stroke='rgba(168,85,247,0.4)'
        strokeWidth='1.5'
        strokeDasharray='3 2'
      />
      <polygon points='102,39 107,42 102,45' fill='#a855f7' />
      <rect
        x='108'
        y='26'
        width='36'
        height='30'
        rx='5'
        fill='rgba(168,85,247,0.08)'
        stroke='rgba(168,85,247,0.2)'
        strokeWidth='1'
      />
      <text
        x='126'
        y='45'
        textAnchor='middle'
        fill='#a855f7'
        fontSize='8'
        fontFamily='monospace'
      >
        .jsonl
      </text>
      <path
        d='M146 42 L158 42'
        stroke='rgba(168,85,247,0.4)'
        strokeWidth='1.5'
        strokeDasharray='3 2'
      />
      <polygon points='158,39 163,42 158,45' fill='#a855f7' />
      <rect
        x='164'
        y='20'
        width='28'
        height='44'
        rx='5'
        fill='rgba(124,58,237,0.85)'
      />
      <text
        x='178'
        y='46'
        textAnchor='middle'
        fill='#fff'
        fontSize='7.5'
        fontFamily='monospace'
        transform='rotate(-90,178,46)'
      >
        LoRA
      </text>
    </svg>
  );
}

function ChatIllus() {
  return (
    <svg
      viewBox='0 0 200 80'
      fill='none'
      className='max-h-[80px] w-full'
      aria-hidden='true'
    >
      <rect
        x='0'
        y='8'
        width='200'
        height='64'
        rx='8'
        fill='rgba(249,115,22,0.04)'
      />
      {/* Doc */}
      <rect
        x='6'
        y='22'
        width='26'
        height='36'
        rx='4'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.08)'
        strokeWidth='1'
      />
      <line
        x1='11'
        y1='30'
        x2='25'
        y2='30'
        stroke='#374151'
        strokeWidth='1.5'
      />
      <line
        x1='11'
        y1='36'
        x2='22'
        y2='36'
        stroke='#374151'
        strokeWidth='1.5'
      />
      <line
        x1='11'
        y1='42'
        x2='24'
        y2='42'
        stroke='#374151'
        strokeWidth='1.5'
      />
      <line
        x1='11'
        y1='48'
        x2='20'
        y2='48'
        stroke='#374151'
        strokeWidth='1.5'
      />
      <path
        d='M34 40 L46 40'
        stroke='rgba(249,115,22,0.4)'
        strokeWidth='1.5'
        strokeDasharray='3 2'
      />
      <polygon points='46,37 51,40 46,43' fill='#f97316' />
      {/* Vector store */}
      <rect
        x='52'
        y='24'
        width='38'
        height='32'
        rx='6'
        fill='rgba(249,115,22,0.08)'
        stroke='rgba(249,115,22,0.22)'
        strokeWidth='1.5'
      />
      <circle cx='64' cy='36' r='2.5' fill='#f97316' opacity='0.9' />
      <circle cx='76' cy='33' r='2.5' fill='#f97316' opacity='0.6' />
      <circle cx='70' cy='43' r='2.5' fill='#f97316' opacity='0.8' />
      <circle cx='60' cy='46' r='2.5' fill='#f97316' opacity='0.4' />
      <circle cx='82' cy='44' r='2.5' fill='#f97316' opacity='0.7' />
      <path
        d='M60 36 Q70 28 76 33'
        stroke='#f97316'
        strokeWidth='1'
        fill='none'
        opacity='0.5'
      />
      <path
        d='M94 40 L106 40'
        stroke='rgba(249,115,22,0.4)'
        strokeWidth='1.5'
        strokeDasharray='3 2'
      />
      <polygon points='106,37 111,40 106,43' fill='#f97316' />
      {/* LLM */}
      <rect
        x='112'
        y='24'
        width='36'
        height='32'
        rx='6'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.09)'
        strokeWidth='1'
      />
      <text
        x='130'
        y='43'
        textAnchor='middle'
        fill='#52525b'
        fontSize='8.5'
        fontFamily='monospace'
      >
        LLM
      </text>
      <path
        d='M150 40 L162 40'
        stroke='rgba(249,115,22,0.4)'
        strokeWidth='1.5'
        strokeDasharray='3 2'
      />
      <polygon points='162,37 167,40 162,43' fill='#f97316' />
      {/* 3D cube */}
      <g transform='translate(168,24)'>
        <polygon
          points='16,0 30,8 30,24 16,32 2,24 2,8'
          fill='rgba(249,115,22,0.1)'
          stroke='#f97316'
          strokeWidth='1.5'
        />
        <line
          x1='16'
          y1='0'
          x2='16'
          y2='16'
          stroke='#f97316'
          strokeWidth='1'
          opacity='0.4'
        />
        <line
          x1='2'
          y1='8'
          x2='16'
          y2='16'
          stroke='#f97316'
          strokeWidth='1'
          opacity='0.4'
        />
        <line
          x1='30'
          y1='8'
          x2='16'
          y2='16'
          stroke='#f97316'
          strokeWidth='1'
          opacity='0.4'
        />
      </g>
    </svg>
  );
}

/* ── Data ───────────────────────────────────────────── */
const stats = [
  {
    metric: '40%',
    label: 'fewer support calls',
    detail: 'via structured guard rails'
  },
  {
    metric: 'Zero',
    label: 'injection incidents',
    detail: 'with input validation layer'
  },
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
          <h1 className='mb-5 bg-gradient-to-br from-white to-white/50 bg-clip-text text-5xl leading-[1.07] font-extrabold tracking-[-0.04em] text-transparent md:text-6xl'>
            Build AI products
            <br />
            that ship.
          </h1>
          <p className='mb-10 max-w-md text-base leading-relaxed text-[#71717a]'>
            Agent observability, fine-tuning pipelines, and RAG chat — built
            with cost discipline, security-first, and zero over-engineering.
          </p>
          <div className='flex flex-wrap gap-3'>
            <a
              href='mailto:hello@davidpapp.dev'
              className='inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_0_32px_rgba(34,197,94,0.5)]'
            >
              Email me about your AI role
            </a>
            <a
              href='https://cal.com/davidpapp/intro'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/[0.08]'
            >
              Book a 20-min call
            </a>
            <Link
              href='/dashboard/overview'
              className='inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-medium text-[#71717a] backdrop-blur-sm transition-colors hover:bg-white/[0.08] hover:text-white'
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
              <p className='bg-gradient-to-r from-[#22c55e] to-[#06b6d4] bg-clip-text font-mono text-4xl font-bold text-transparent'>
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
        <h2 className='mb-2 text-center text-3xl font-bold tracking-[-0.025em]'>
          Three Pillars
        </h2>
        <p className='mb-12 text-center text-[#71717a]'>
          Each product solves a real problem in the AI engineering stack.
        </p>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
          {pillars.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              aria-label={`${p.title} — ${p.link}`}
              className='group relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/[0.14]'
            >
              <div className='mb-5'>
                <p.Illus />
              </div>
              <h3 className='mb-2 text-base font-semibold text-white'>
                {p.title}
              </h3>
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
        <h2 className='mb-5 text-xl font-bold tracking-[-0.02em]'>
          Quickstart in 3 lines
        </h2>
        <div className='overflow-hidden rounded-xl border border-white/[0.09] bg-[#0a0a0c] shadow-[0_0_60px_rgba(0,0,0,0.7)]'>
          <div className='flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-4 py-3'>
            <span className='h-2.5 w-2.5 rounded-full bg-[#ff5f57]' />
            <span className='h-2.5 w-2.5 rounded-full bg-[#febc2e]' />
            <span className='h-2.5 w-2.5 rounded-full bg-[#28c840]' />
            <span className='ml-2 font-mono text-[11px] text-[#52525b]'>
              mcp-server.ts
            </span>
          </div>
          <pre className='overflow-x-auto px-6 py-5 font-mono text-[13px] leading-[1.9]'>
            <span className='text-[#c084fc]'>import</span>
            <span className='text-[#d1d5db]'>{' { MCPSentinel } '}</span>
            <span className='text-[#c084fc]'>from</span>
            <span className='text-[#86efac]'>
              {" '@your-org/mcp-sentinel'"}
            </span>
            <span className='text-[#d1d5db]'>{';'}</span>
            {'\n\n'}
            <span className='text-[#c084fc]'>const</span>
            <span className='text-[#f9a8d4]'>{' sentinel '}</span>
            <span className='text-[#fb923c]'>{'='}</span>
            <span className='text-[#c084fc]'>{' new'}</span>
            <span className='text-[#60a5fa]'>{' MCPSentinel'}</span>
            <span className='text-[#d1d5db]'>{'({ apiKey, guards: ['}</span>
            <span className='text-[#86efac]'>{"'injection'"}</span>
            <span className='text-[#d1d5db]'>{', '}</span>
            <span className='text-[#86efac]'>{"'pii'"}</span>
            <span className='text-[#d1d5db]'>{', '}</span>
            <span className='text-[#86efac]'>{"'cost'"}</span>
            <span className='text-[#d1d5db]'>{'] });'}</span>
            {'\n\n'}
            <span className='text-[#4b5563]'>
              {'// Zero changes to your existing tools'}
            </span>
            {'\n'}
            <span className='text-[#c084fc]'>const</span>
            <span className='text-[#f9a8d4]'>{' server '}</span>
            <span className='text-[#fb923c]'>{'='}</span>
            <span className='text-[#f9a8d4]'>{' sentinel'}</span>
            <span className='text-[#d1d5db]'>{'.'}</span>
            <span className='text-[#60a5fa]'>{'wrap'}</span>
            <span className='text-[#d1d5db]'>{'(yourMCPServer);'}</span>
            {'\n'}
            <span className='text-[#f9a8d4]'>{'server'}</span>
            <span className='text-[#d1d5db]'>{'.'}</span>
            <span className='text-[#60a5fa]'>{'listen'}</span>
            <span className='text-[#d1d5db]'>{'(3001);'}</span>
          </pre>
        </div>
      </div>

      {/* Philosophy */}
      <div className='relative z-10 border-t border-white/[0.07] bg-white/[0.015]'>
        <div className='mx-auto max-w-6xl px-6 py-20'>
          <h2 className='mb-2 text-center text-3xl font-bold tracking-[-0.025em]'>
            Build Philosophy
          </h2>
          <p className='mb-14 text-center text-[#71717a]'>
            Engineering principles that ship reliable AI products.
          </p>
          <div className='grid grid-cols-1 gap-10 md:grid-cols-3'>
            {philosophy.map((p) => (
              <div key={p.n}>
                <p className='mb-3 font-mono text-5xl font-bold text-white/[0.05]'>
                  {p.n}
                </p>
                <h3 className='mb-2 text-base font-semibold text-white'>
                  {p.title}
                </h3>
                <p className='text-sm leading-[1.75] text-[#71717a]'>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AMASection />
    </div>
  );
}
