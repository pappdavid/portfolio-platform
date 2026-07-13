'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

function Typewriter({
  text,
  speed = 26,
  startDelay = 400
}: {
  text: string;
  speed?: number;
  startDelay?: number;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const isVisited =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('dp_visited') === 'true';
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (isVisited || mediaQuery.matches) {
      setN(text.length);
      return;
    }
    setN(0);
    let i = 0;
    let t: ReturnType<typeof setInterval>;
    const begin = setTimeout(() => {
      t = setInterval(() => {
        i++;
        setN(i);
        if (i >= text.length) {
          clearInterval(t);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('dp_visited', 'true');
          }
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(begin);
      if (t) clearInterval(t);
    };
  }, [text, speed, startDelay]);
  return (
    <span>
      {text.slice(0, n)}
      <span
        className='cur'
        style={{ opacity: n < text.length ? 1 : undefined }}
      />
    </span>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      CSS.supports('animation-timeline', 'scroll()')
    ) {
      return;
    }
    const cont = document.querySelector('.scroll-container');
    if (!cont) return;

    const onScroll = () => {
      const scrollable = cont.scrollHeight - cont.clientHeight;
      if (scrollable <= 0) return;
      const scrolled = cont.scrollTop;
      setProgress(scrolled / scrollable);
    };

    cont.addEventListener('scroll', onScroll, { passive: true });
    return () => cont.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      id='scroll-progress'
      aria-hidden='true'
      className='scroll-progress'
      style={{
        transform: progress > 0 ? `scaleY(${progress})` : undefined
      }}
    />
  );
}

// ============================================================
// Types & Constant Data
// ============================================================

type Project = {
  name: string;
  stage: 'LIVE' | 'BETA' | 'WIP';
  mod: string;
  badge: 'live' | 'wip' | 'archive' | 'private';
  desc: string;
  body: string;
  tech: string[];
  repoUrl?: string;
  liveUrl?: string;
  repoName?: string;
  image?: string;
  componentLinks?: { label: string; url: string }[];
  isFlagship?: boolean;
};

const PROJECTS: Project[] = [
  {
    name: 'VoidArch Context',
    stage: 'BETA',
    mod: '2026-07',
    badge: 'live',
    isFlagship: true,
    desc: 'Local-first memory, repo-query, code-graph, vector retrieval, and token-budgeted context packs for coding agents',
    body: 'A standalone, agent-neutral context engine for Claude Code, Codex, and other coding agents. It indexes repository files and documentation into embedded SurrealDB, builds a Tree-sitter code graph, stores durable decisions and lessons, supports local ONNX embeddings, and fuses the available channels into a deterministic token-budgeted context pack. It runs locally without Docker or Python; semantic retrieval requires an explicit embedding pass and the embedded database is single-process.',
    tech: ['TypeScript', 'SurrealDB', 'Tree-sitter', 'ONNX', 'BM25', 'Claude Code', 'Codex']
  },
  {
    name: 'VoidArch Studio',
    stage: 'WIP',
    mod: '2026-07',
    badge: 'wip',
    desc: 'Local orchestration control room for agent sessions, worktrees, runs, routing, hooks, and observability',
    body: 'The active orchestration layer built on VoidArch Context. The current implementation includes a localhost web dashboard, daemon-owned PTY sessions for Claude, Codex, and shell, worktree and run management, session transcripts and resume metadata, safety hooks, and a thin Tauri desktop shell. Studio is in active development and is not presented as a released hosted product.',
    tech: ['TypeScript', 'Node.js', 'PTY', 'WebSocket', 'xterm.js', 'Tauri', 'Rust']
  },
  {
    name: 'AgentSec Suite',
    stage: 'LIVE',
    mod: '2026-07',
    badge: 'live',
    desc: 'Integrated agent-security suite with prompt scanning, MCP analysis, agent risk mapping, approval workflows, and runtime hooks',
    body: 'A working integrated security dashboard combining PromptShield, MCPGuard, AgentMap, ApproveOps, and the AgentSec hook pack. The deployed suite exposes the four web modules through one interface, while the local hook package gates Claude Code and Codex tool calls. The public component repositories remain linked as independently inspectable evidence; the suite is a portfolio-grade working system, not a claim of universal production protection.',
    tech: ['Next.js', 'TypeScript', 'Prisma', 'Clerk', 'Vitest', 'Node.js', 'Vercel'],
    liveUrl: 'https://promptshield-cyan.vercel.app',
    image: '/saas-screenshots/promptshield.png',
    componentLinks: [
        { label: 'PromptShield', url: 'https://github.com/pappdavid/PromptShield' },
        { label: 'Hook Pack', url: 'https://github.com/pappdavid/agentsec-hook-pack' },
        { label: 'MCPGuard', url: 'https://github.com/pappdavid/mcpguard-lite' },
        { label: 'AgentMap', url: 'https://github.com/pappdavid/agentmap' },
        { label: 'ApproveOps', url: 'https://github.com/pappdavid/approveops' }
      ]
  },
  {
    name: 'saas-core',
    stage: 'BETA',
    mod: '2026-06',
    badge: 'private',
    desc: 'Private modular Next.js product scaffold and factory infrastructure used to generate and validate bounded SaaS builds',
    body: 'A private engineering repository containing a modular Next.js scaffold, typed module and preset planning, environment validation, product rendering scripts, CI workflows, and provider adapters. It is presented as supporting infrastructure rather than a public product or live demo; provider provisioning and generated integrations are described only where the repository implements them.',
    tech: ['Next.js', 'TypeScript', 'Prisma', 'Clerk', 'Stripe', 'GitHub Actions', 'Vercel']
  }
];

const SUGGESTIONS = [
  'is David available to start?',
  "what is David's tech stack?",
  'what did David build at WEBINFORM?',
  'tell me about AgentSec Suite'
];

// ============================================================
// Unified Landing Page Component
// ============================================================

export function LandingContent() {
  const [active, setActive] = useState('home');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [repoCount, setRepoCount] = useState<number | null>(null);
  const [themeProfile, setThemeProfile] = useState<string>('green');
  // Decorative terminal-UI values. Labelled SIM in the status bar — not
  // real telemetry.
  const [latency, setLatency] = useState<string>('5.2ms');
  const [memLoad, setMemLoad] = useState<string>('43.1%');

  // Load and apply initial theme profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme-profile') || 'green';
    setThemeProfile(saved);
    document.documentElement.setAttribute('data-theme-profile', saved);
  }, []);

  // Fetch the real public repository count from GitHub
  useEffect(() => {
    async function fetchRepoCount() {
      try {
        const userRes = await fetch('https://api.github.com/users/pappdavid');
        if (userRes.ok) {
          const userData = await userRes.json();
          const total = userData.public_repos;
          if (typeof total === 'number' && !isNaN(total) && total > 0) {
            setRepoCount(total);
          }
        }
      } catch (err) {
        // On failure the counter is simply not rendered
      }
    }
    fetchRepoCount();
  }, []);

  const changeThemeProfile = useCallback((profile: string) => {
    setThemeProfile(profile);
    localStorage.setItem('theme-profile', profile);
    document.documentElement.setAttribute('data-theme-profile', profile);
  }, []);

  // Decorative status-bar animation timers (labelled SIM in the UI)
  useEffect(() => {
    const lInterval = setInterval(() => {
      const ms = (4.8 + Math.random() * 4.4).toFixed(1);
      setLatency(`${ms}ms`);
    }, 1100);

    const mInterval = setInterval(() => {
      const pct = (42.5 + Math.random() * 2.3).toFixed(1);
      setMemLoad(`${pct}%`);
    }, 1800);

    return () => {
      clearInterval(lInterval);
      clearInterval(mInterval);
    };
  }, []);

  // Handle smooth nav scroll
  const nav = useCallback((id: string) => {
    const el = document.getElementById(id);
    const cont = scrollRef.current;
    if (el && cont) {
      cont.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' });
    }
    setActive(id);
  }, []);

  // Track active scroll section
  useEffect(() => {
    const cont = scrollRef.current;
    if (!cont) return;
    const ids = ['home', 'work', 'skills', 'notes', 'contact'];
    const onScroll = () => {
      const top = cont.scrollTop + 120;
      let cur = 'home';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= top) cur = id;
      }
      setActive(cur);
    };
    cont.addEventListener('scroll', onScroll, { passive: true });
    return () => cont.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard navigation (J/K or ArrowUp/ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      const sections = ['home', 'work', 'skills', 'notes', 'contact'];
      const currentIndex = sections.indexOf(active);
      if (e.key === 'j' || e.key === 'ArrowDown') {
        const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
        nav(sections[nextIndex]);
        e.preventDefault();
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        const prevIndex = Math.max(currentIndex - 1, 0);
        nav(sections[prevIndex]);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, nav]);

  // Custom Event Bus focusing dispatcher
  const triggerFocus = useCallback((id: string | null) => {
    let moduleId: string | null = null;
    if (id) {
      const u = id.toUpperCase();
      if (
        u.includes('PROMPTSHIELD') ||
        u.includes('AGENTSEC') ||
        u.includes('AGENT_CLI')
      )
        moduleId = 'sentinel';
      else if (u.includes('SKILL_INJ')) moduleId = 'training';
      else if (u.includes('CHAT') || u.includes('CONTACT')) moduleId = 'chat';
    }
    const event = new CustomEvent('dp-portfolio-focus-module', {
      detail: { moduleId }
    });
    window.dispatchEvent(event);
  }, []);

  return (
    <div
      style={{ color: 'var(--dp-text)', fontFamily: 'var(--font-hud-mono)' }}
    >
      {/* 1. FIXED TOP STATUS BAR */}
      <div className='statusbar' aria-hidden='true'>
        <div className='sb-scroll'>
          <span className='sb-item sb-item-sysname'>
            <span className='sb-k'>SYS.NAME:</span>
            <span className='sb-accent'>PORTFOLIO_OS v1.0.0</span>
          </span>
          <span className='sb-sep sb-item-sysname'>|</span>
          <span className='sb-item sb-item-auth'>
            <span className='sb-k'>SYS.AUTH:</span>
            <span className='sb-v'>GUEST_ACCESS_GRANTED</span>
          </span>
          <span className='sb-sep sb-item-auth'>|</span>
          <span className='sb-item sb-item-terminal'>
            <span className='sb-k'>TERMINAL:</span>
            <span className='sb-v'>TTY0</span>
          </span>
          <span className='sb-sep sb-item-terminal'>|</span>
          <span className='sb-item sb-item-node'>
            <span className='sb-k'>SYS.NODE:</span>
            <span className='sb-v'>davidpapp.dev</span>
          </span>
          <span className='sb-sep sb-item-node'>|</span>
          <span
            className='sb-item'
            title='Decorative UI animation, not real telemetry'
          >
            <span className='sb-k'>SIM.LATENCY:</span>
            <span className='sb-v sb-accent'>{latency}</span>
          </span>
          <span className='sb-sep'>|</span>
          <span
            className='sb-item'
            title='Decorative UI animation, not real telemetry'
          >
            <span className='sb-k'>SIM.MEM:</span>
            <span className='sb-v sb-accent'>{memLoad}</span>
          </span>
          <span className='sb-sep'>|</span>
          <span className='sb-item sb-item-status'>
            <span className='sb-k'>STATUS:</span>
            <span className='sb-v sb-ok'>200</span>
          </span>
          <span className='sb-sep sb-item-status'>|</span>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('dp-portfolio-warp'));
            }}
            title='Easter egg: Toggle hyper-speed performance animations'
            className='shrink-0 cursor-pointer border border-[var(--dp-accent)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--dp-accent)] hover:bg-[var(--dp-accent-faint)]'
            style={{ borderRadius: 0 }}
          >
            🚀 HYPERDRIVE
          </button>
        </div>
        <div
          className='sb-right'
          style={{ display: 'flex', alignItems: 'center', gap: 14 }}
        >
          {/* Dashboard Theme Selectors */}
          <div
            className='hidden items-center gap-1.5 sm:flex'
            style={{
              borderRight: '1px solid var(--dp-border)',
              paddingRight: 12,
              marginRight: 2
            }}
          >
            <span className='sb-k' style={{ marginRight: 4 }}>
              THEME:
            </span>
            {[
              { key: 'green', emoji: '🟢', label: 'Green theme' },
              { key: 'cyan', emoji: '🔵', label: 'Cyan theme' },
              { key: 'amber', emoji: '🟡', label: 'Amber theme' },
              { key: 'pink', emoji: '🔴', label: 'Pink theme' }
            ].map(({ key, emoji, label }) => (
              <button
                key={key}
                aria-label={label}
                aria-pressed={themeProfile === key}
                title={label}
                onClick={() => changeThemeProfile(key)}
                className={cn(
                  'cursor-pointer border px-1.5 py-0.5 text-[9px] transition-all',
                  themeProfile === key
                    ? 'border-[var(--dp-accent)] bg-[var(--dp-accent-faint)] text-[var(--dp-accent)]'
                    : 'border-[var(--dp-border)] text-[var(--dp-text-dim)]'
                )}
                style={{ borderRadius: 0 }}
              >
                {emoji}
              </button>
            ))}
          </div>
          <span className='sb-dot' />
          <a
            href='https://github.com/pappdavid'
            target='_blank'
            rel='noopener noreferrer'
            className='sb-commits hover:underline'
          >
            ⎇ github.com/pappdavid
            {repoCount !== null ? ` · ${repoCount} public repos` : ''}
          </a>
        </div>
      </div>

      {/* 2. MAIN SCROLL CONTAINER */}
      <div className='scroll-container' ref={scrollRef}>
        <ScrollProgress />
        <div className='shell'>
          {/* ============ SECTION 1: HOME ============ */}
          <section className='block' id='home'>
            <div className='term-window'>
              <div className='term-titlebar'>
                <span className='d r' />
                <span className='d y' />
                <span className='d g' />
                <span className='term-title'>david@portfolio — ~/home</span>
                <div className='float-widgets'>
                  <span className='fw'>
                    david@:~/auth$ <b>guest_access</b>
                  </span>
                  <span className='fw'>
                    david@:~/build$ <b>shipping →</b>
                  </span>
                </div>
              </div>

              <div className='term-body'>
                <pre
                  className='ascii'
                  aria-hidden='true'
                >{`██████╗  █████╗ ██╗   ██╗██╗██████╗
██╔══██╗██╔══██╗██║   ██║██║██╔══██╗
██║  ██║███████║██║   ██║██║██║  ██║
██║  ██║██╔══██║╚██╗ ██╔╝██║██║  ██║
██████╔╝██║  ██║ ╚████╔╝ ██║██████╔╝
╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═════╝ `}</pre>

                <div className='hero-cmd'>
                  <span className='prompt'>david@dev:~$ </span>whoami
                </div>

                <h1 className='hero-name'>David&nbsp;Papp</h1>
                <p className='hero-role'>AI solution developer</p>
                <div className='hero-tag'>
                  <span className='prompt'>&gt; </span>
                  <Typewriter text='Building AI-first solutions. One agent at a time.' />
                </div>

                <div className='hero-pill'>
                  <div
                    className='pill'
                    style={{
                      color: 'var(--dp-accent)',
                      borderColor: 'var(--dp-accent)'
                    }}
                  >
                    <span
                      className='dot live'
                      style={{ background: 'var(--dp-accent)' }}
                    />
                    OPEN TO WORK
                  </div>
                  <span className='loc'>{'// Rotterdam, NL'}</span>
                </div>

                <p className='hero-availability'>
                  <span className='avail-label'>AVAIL</span>
                  {' // '}
                  Full-time
                </p>

                <div className='cta-row'>
                  <a
                    href='/cv.pdf'
                    target='_blank'
                    rel='noopener'
                    className='cta cta-resume glitch-hover'
                  >
                    [view resume — Jul 2026]
                  </a>
                  <button
                    onClick={() => nav('work')}
                    className='cta glitch-hover'
                  >
                    [projects]
                  </button>
                  <button
                    onClick={() => nav('skills')}
                    className='cta glitch-hover'
                  >
                    [skills]
                  </button>
                  <button
                    onClick={() => nav('contact')}
                    className='cta glitch-hover'
                  >
                    [contact]
                  </button>
                </div>

                <div className='statustxt'>
                  <div className='statustxt-cap'>
                    <span className='prompt'>david@dev:~$ </span>cat status.txt
                  </div>
                  <table className='meta-table'>
                    <tbody>
                      <tr>
                        <td className='mk'>LOCATION</td>
                        <td className='ms'>:</td>
                        <td className='mv'>
                          Amsterdam · Rotterdam, NL · remote
                        </td>
                      </tr>
                      <tr>
                        <td className='mk'>FOCUS</td>
                        <td className='ms'>:</td>
                        <td className='mv'>ai agents · rag · solution dev</td>
                      </tr>
                      <tr>
                        <td className='mk'>CURRENTLY</td>
                        <td className='ms'>:</td>
                        <td className='mv'>
                          building AI solutions at WEBINFORM & studying AI at VU
                          Amsterdam
                        </td>
                      </tr>
                      <tr>
                        <td className='mk'>AVAILABILITY</td>
                        <td className='ms'>:</td>
                        <td className='mv'>Full-time</td>
                      </tr>
                      <tr>
                        <td className='mk'>WORK AUTH</td>
                        <td className='ms'>:</td>
                        <td className='mv'>
                          NL / EU Work Authorization (No sponsorship required)
                        </td>
                      </tr>
                      <tr>
                        <td className='mk'>WORK MODE</td>
                        <td className='ms'>:</td>
                        <td className='mv'>Remote / Hybrid / On-site</td>
                      </tr>
                      <tr>
                        <td className='mk'>LANGUAGES</td>
                        <td className='ms'>:</td>
                        <td className='mv'>
                          English (Fluent), Hungarian (Native)
                        </td>
                      </tr>
                      <tr>
                        <td className='mk'>CONTACT</td>
                        <td className='ms'>:</td>
                        <td className='mv'>contact@davidpapp.dev</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <div className='divider' />

          {/* ============ SECTION 2: WORK ============ */}
          <WorkSection triggerFocus={triggerFocus} />

          <div className='divider' />

          {/* ============ SECTION 3: SKILLS ============ */}
          <SkillsSection />

          <div className='divider' />

          {/* ============ SECTION 4: TECH NOTES ============ */}
          <NotesSection />

          <div className='divider' />

          {/* ============ SECTION 5: CONTACT / RAG CHAT ============ */}
          <ContactSection
            themeProfile={themeProfile}
            changeThemeProfile={changeThemeProfile}
            triggerFocus={triggerFocus}
          />

          <div style={{ height: '48px' }} />
        </div>
      </div>

      {/* 3. FIXED BOTTOM/TOP TAB BAR */}
      <div className='tabbar'>
        <div
          className='tab-prompt'
          title='Use J/K keys or Arrow Up/Down to navigate sections'
          style={{ cursor: 'help' }}
        >
          [J/K: nav] &gt;
        </div>
        <button
          onClick={() => nav('home')}
          aria-label='Navigate to Home section'
          aria-current={active === 'home' ? 'page' : undefined}
          className={cn('tab glitch-hover', active === 'home' && 'active')}
        >
          01._HOME
        </button>
        <button
          onClick={() => nav('work')}
          aria-label='Navigate to Projects section'
          aria-current={active === 'work' ? 'page' : undefined}
          className={cn('tab glitch-hover', active === 'work' && 'active')}
        >
          02._PROJECTS
        </button>
        <button
          onClick={() => nav('skills')}
          aria-label='Navigate to Skills and Experience section'
          aria-current={active === 'skills' ? 'page' : undefined}
          className={cn('tab glitch-hover', active === 'skills' && 'active')}
        >
          03._SKILLS
        </button>
        <button
          onClick={() => nav('notes')}
          aria-label='Navigate to Technical Notes section'
          aria-current={active === 'notes' ? 'page' : undefined}
          className={cn('tab glitch-hover', active === 'notes' && 'active')}
        >
          04._NOTES
        </button>
        <button
          onClick={() => nav('contact')}
          aria-label='Navigate to Contact and Assistant section'
          aria-current={active === 'contact' ? 'page' : undefined}
          className={cn('tab glitch-hover', active === 'contact' && 'active')}
        >
          05._CONTACT
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Subcomponents
// ============================================================

interface WorkSectionProps {
  triggerFocus: (id: string | null) => void;
}

function WorkSection({ triggerFocus }: WorkSectionProps) {
  const [hover, setHover] = useState(-1);
  const [open, setOpen] = useState(-1); // all closed by default
  const badgeColor = {
    live: 'var(--dp-accent)',
    wip: 'var(--warn)',
    archive: 'var(--dp-text-dim)',
    private: 'var(--warn)'
  };

  return (
    <section className='block' id='work'>
      <div className='sec-head'>
        <span className='sec-cmd'>ls -la /projects/</span>
        <span className='sec-note'>FILESYSTEM</span>
      </div>
      <p className='sub-note'>
        {PROJECTS.length} active nodes found — click row to expand case study
      </p>

      <div className='fs-table'>
        <div className='fs-head'>
          <span className='c-name'>NAME</span>
          <span className='c-size'>STAGE</span>
          <span className='c-mod'>MODIFIED</span>
          <span className='c-desc'>DESCRIPTION</span>
        </div>

        {PROJECTS.map((p, i) => (
          <div key={p.name} className='fs-cell'>
            <div
              className='fs-row'
              aria-expanded={open === i}
              aria-controls={`expand-${p.name}`}
              onMouseEnter={() => {
                setHover(i);
                triggerFocus(p.name);
              }}
              onMouseLeave={() => {
                setHover(-1);
                triggerFocus(null);
              }}
              onClick={() => {
                const nextOpen = open === i ? -1 : i;
                setOpen(nextOpen);
                triggerFocus(nextOpen !== -1 ? p.name : null);
              }}
            >
              <span className='c-name'>
                <span className={cn('caret', open === i && 'open')}>▶</span>
                <span className='dirname'>
                  {p.name}
                  {p.isFlagship && (
                    <span className='ml-2 border border-[var(--accent)] px-1 py-0 text-[10px] font-extrabold text-[var(--accent)] select-none'>
                      ★ FLAGSHIP
                    </span>
                  )}
                </span>
                <span className='ml-3 hidden shrink-0 items-center gap-1.5 text-xs text-[var(--dp-text-dim)] sm:flex'>
                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='opacity-60 hover:text-[var(--dp-accent)] hover:underline hover:opacity-100'
                      onClick={(e) => e.stopPropagation()}
                    >
                      [repo]
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='opacity-60 hover:text-[var(--dp-accent)] hover:underline hover:opacity-100'
                      onClick={(e) => e.stopPropagation()}
                    >
                      [live]
                    </a>
                  )}
                </span>
              </span>
              <span className='c-size'>{p.stage}</span>
              <span className='c-mod'>{p.mod}</span>
              <span className='c-desc'>
                {p.desc}
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='row-link'
                    aria-label={`View live demo: ${p.name}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    [live →]
                  </a>
                )}
                {!p.liveUrl && p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='row-link'
                    aria-label={`View repository: ${p.name}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    [repo →]
                  </a>
                )}
              </span>
            </div>

            {open === i && (
              <div className='fs-expand' id={`expand-${p.name}`} role='region'>
                <div className='mb-3 text-[12px] text-[var(--text-dim)]'>
                  <span className='font-bold text-[var(--text)]'>
                    GITHUB REPO:
                  </span>{' '}
                  {p.repoName ? (
                    <a
                      href={p.repoUrl || `https://github.com/${p.repoName}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--accent)] hover:underline'
                    >
                      {p.repoName}
                    </a>
                  ) : (
                    'private source / technical case study'
                  )}
                </div>

                <p className='fs-expand-body whitespace-pre-line'>{p.body}</p>
                {p.image && (
                  <div className='my-4 max-w-[500px] overflow-hidden border border-[var(--border)] bg-black'>
                    <img
                      src={p.image}
                      alt={p.name}
                      className='h-auto w-full object-cover opacity-80 transition-opacity duration-300 hover:opacity-100'
                    />
                  </div>
                )}

                {p.componentLinks && (
                  <div className='mb-4 flex flex-wrap gap-2 text-[11px]'>
                    {p.componentLinks.map((component) => (
                      <a
                        key={component.label}
                        href={component.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='border border-[var(--dp-border)] px-2 py-1 text-[var(--dp-accent-muted)] hover:border-[var(--dp-accent)] hover:text-[var(--dp-accent)]'
                      >
                        {component.label} repo →
                      </a>
                    ))}
                  </div>
                )}

                <div className='mb-4 flex flex-wrap gap-1.5'>
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className='border border-[var(--dp-border)] px-2 py-0.5 text-[11px] text-[var(--dp-accent-muted)]'
                      style={{ background: 'var(--dp-accent-faint)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className='flex flex-wrap gap-3'>
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='open-btn inline-block'
                    >
                      [LIVE] open deployment →
                    </a>
                  )}
                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='open-btn inline-block'
                    >
                      [OPEN] read repository source →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section className='block' id='skills'>
      <div className='sec-head'>
        <span className='sec-cmd'>cat about.md</span>
        <span className='sec-note'>PROSE</span>
      </div>
      <p className='prose'>
        I build AI solutions professionally at WEBINFORM — production LLM
        features, APIs, and automation for web applications and ERP-integrated
        systems — and, on my own time, local-first context infrastructure, agent
        orchestration tooling, and the integrated AgentSec security suite. I&apos;m a BSc AI student at VU Amsterdam and
        I&apos;m looking for full-time AI engineering, AI solutions,
        integration, automation, or agent-infrastructure roles.
      </p>

      <div className='resume'>
        <div className='sec-head'>
          <span className='sec-cmd'>cat resume.txt</span>
          <span className='sec-note'>HISTORY</span>
        </div>

        <div className='rs-divider'>
          {'// ACADEMIC & INDUSTRY TRUST ANCHORS'}
        </div>
        <div className='mb-6 flex flex-wrap gap-4 text-xs font-semibold text-[var(--dp-accent-muted)]'>
          <span className='border border-[var(--dp-border)] bg-[#0d0d0d] px-3 py-1.5 select-none'>
            🏛️ VU AMSTERDAM (BSc Artificial Intelligence)
          </span>
          <span className='border border-[var(--dp-border)] bg-[#0d0d0d] px-3 py-1.5 select-none'>
            💻 WEBINFORM (AI Solution Delivery)
          </span>
        </div>
        <div className='rs-divider'>{'// EXPERIENCE'}</div>

        <div className='rs-row'>
          <div className='rs-line'>
            <span className='rs-role'>AI Solutions Developer</span>
            <span className='rs-meta'>| WEBINFORM IT Ltd (contract)</span>
            <span className='rs-meta rs-dates'>Oct 2024 — present</span>
          </div>
          <ul className='rs-bullets'>
            <li>
              <span className='li-mark'>&gt;</span> Build internal AI tools and
              production LLM functionality for web applications and
              ERP-integrated systems: APIs, automation, backend logic, and
              user-facing AI interfaces.
            </li>
            <li>
              <span className='li-mark'>&gt;</span> Took over an inherited
              AI-first service with architecture, security, compliance, and
              prompt-injection problems — reverse-engineered its undocumented
              integrations, repaired it, and cut LLM API costs by roughly 40%.
            </li>
            <li>
              <span className='li-mark'>&gt;</span> Delivered 20+
              websites/webshops, three internal systems, and a user-facing
              platform; two ERP/AI integration projects with direct involvement
              in discovery, solution design, client coordination, and pricing.
            </li>
          </ul>
        </div>

        <div className='rs-row'>
          <div className='rs-line'>
            <span className='rs-role'>BSc Artificial Intelligence</span>
            <span className='rs-meta'>| VU Amsterdam</span>
            <span className='rs-meta rs-dates'>2024 — 2027 (Expected)</span>
          </div>
          <div className='rs-meta mt-1' style={{ textTransform: 'none' }}>
            Expected grad: 2027
          </div>
          <ul className='rs-bullets'>
            <li>
              <span className='li-mark'>&gt;</span> Coursework includes machine
              learning, computational linguistics, multi-agent systems, and the
              mathematics underneath them.
            </li>
          </ul>
        </div>

        <div className='rs-row'>
          <div className='rs-line'>
            <span className='rs-role'>Programming Instructor</span>
            <span className='rs-meta'>| Logiscool</span>
            <span className='rs-meta rs-dates'>Feb 2023 — Jun 2023</span>
          </div>
          <ul className='rs-bullets'>
            <li>
              <span className='li-mark'>&gt;</span> Taught programming
              fundamentals and game development to students aged 10–16.
            </li>
            <li>
              <span className='li-mark'>&gt;</span> Developed custom curricula
              and lessons for introductory Python and Scratch courses.
            </li>
          </ul>
        </div>

        <div className='rs-row'>
          <div className='rs-line'>
            <span className='rs-role'>Project Assistant</span>
            <span className='rs-meta'>| 4iG Nyrt.</span>
            <span className='rs-meta rs-dates'>Aug 2022 — Aug 2023</span>
          </div>
          <ul className='rs-bullets'>
            <li>
              <span className='li-mark'>&gt;</span> Supported project managers:
              ticket preparation and processing, incoming client communication,
              work coordination, and incident escalation.
            </li>
            <li>
              <span className='li-mark'>&gt;</span> Performed cross-system
              checks and Playwright-based pre-tests before releases.
            </li>
          </ul>
        </div>

        <div className='rs-divider'>{'// CORE SKILLS'}</div>
        <p className='mb-3 text-[10px] text-[var(--dp-text-dim)]'>
          WORK = used in professional client delivery · LAB = personal
          open-source projects · UNI = university coursework
        </p>
        <div className='resume-grid mb-8'>
          <div>
            <div className='skill-cap'>AGENTIC & AI</div>
            <ul className='skill-list'>
              <li>
                <span className='prompt'>●</span> LLM API Integration
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  WORK
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> Prompt & Context Engineering
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  WORK
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> Agent Hooks & Policy Tooling
                <span className='ml-1.5 border border-[var(--warn)] px-1 py-0 text-[9px] font-normal text-[var(--warn)] select-none'>
                  LAB
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> RAG Prototypes
                <span className='ml-1.5 border border-[var(--warn)] px-1 py-0 text-[9px] font-normal text-[var(--warn)] select-none'>
                  LAB
                </span>
              </li>
            </ul>
          </div>
          <div>
            <div className='skill-cap'>MODELS & DATA</div>
            <ul className='skill-list'>
              <li>
                <span className='prompt'>●</span> Python
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  WORK
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> SQL / Postgres
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  WORK
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> Machine Learning Foundations
                <span className='ml-1.5 border border-[var(--dp-border)] px-1 py-0 text-[9px] font-normal text-[var(--dp-text-dim)] select-none'>
                  UNI
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> Vector & Semantic Search
                <span className='ml-1.5 border border-[var(--warn)] px-1 py-0 text-[9px] font-normal text-[var(--warn)] select-none'>
                  LAB
                </span>
              </li>
            </ul>
          </div>
          <div>
            <div className='skill-cap'>SYSTEMS & INFRA</div>
            <ul className='skill-list'>
              <li>
                <span className='prompt'>●</span> Next.js / TypeScript
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  WORK
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> APIs & Backend Logic
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  WORK
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> ERP Integrations
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  WORK
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> Rust
                <span className='ml-1.5 border border-[var(--warn)] px-1 py-0 text-[9px] font-normal text-[var(--warn)] select-none'>
                  LAB
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotesSection() {
  return (
    <section className='block' id='notes'>
      <div className='sec-head'>
        <span className='sec-cmd'>ls -la /notes/</span>
        <span className='sec-note'>FIELD NOTES</span>
      </div>
      <p className='sub-note'>
        Engineering notes from building the projects above — each links to the
        repository where the pattern is implemented
      </p>
      <div className='flex flex-col gap-3 font-mono text-sm'>
        <a
          href='https://github.com/pappdavid/agentsec-hook-pack'
          target='_blank'
          rel='noopener noreferrer'
          className='group border border-[var(--border)] bg-[#0f0f0f] p-3 transition-all hover:border-[var(--accent)]'
        >
          <div className='flex flex-wrap items-baseline justify-between gap-2'>
            <span className='text-left font-bold text-[var(--accent)] group-hover:underline'>
              Gating agent tool calls with PreToolUse hooks
            </span>
            <span className='shrink-0 text-xs text-[var(--text-dim)]'>
              agentsec-hook-pack
            </span>
          </div>
          <p className='mt-1.5 text-xs text-[var(--text-dim)]'>
            Fail-closed decision hooks for Claude Code and Codex: safe-command
            fast paths, chained-command bypass protection, and
            observe/prompt/enforce modes. Implemented and tested in the repo.
          </p>
        </a>
        <a
          href='https://github.com/pappdavid/agent-cli-mcp-rust'
          target='_blank'
          rel='noopener noreferrer'
          className='group border border-[var(--border)] bg-[#0f0f0f] p-3 transition-all hover:border-[var(--accent)]'
        >
          <div className='flex flex-wrap items-baseline justify-between gap-2'>
            <span className='text-left font-bold text-[var(--accent)] group-hover:underline'>
              Directory guarding & secret scrubbing for stdio MCP servers
            </span>
            <span className='shrink-0 text-xs text-[var(--text-dim)]'>
              agent-cli-mcp-rust
            </span>
          </div>
          <p className='mt-1.5 text-xs text-[var(--text-dim)]'>
            Allowed-roots path validation, destructive-command deny patterns,
            and regex credential redaction of subprocess output — the policy and
            redaction modules carry the unit tests.
          </p>
        </a>
      </div>
    </section>
  );
}

interface ContactSectionProps {
  themeProfile: string;
  changeThemeProfile: (profile: string) => void;
  triggerFocus: (id: string | null) => void;
}

type ChatMsg = {
  role: 'bot' | 'user';
  text: string;
  isCustomCard?: boolean;
  projectData?: Project;
};

function ContactSection({
  themeProfile,
  changeThemeProfile,
  triggerFocus
}: ContactSectionProps) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      role: 'bot',
      text: "Session active. Grounded in David's public GitHub projects. Ask me about PromptShield, agentsec-hook-pack, mcpguard-lite, agentmap, approveops, or agent-cli-mcp-rust!"
    }
  ]);
  const [val, setVal] = useState('');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat body
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [msgs, typing]);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim().slice(0, 500);
      if (!q || typing) return;

      // Add user message
      setMsgs((m) => [...m, { role: 'user', text: q }]);
      setVal('');
      setTyping(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: msgs
              .filter((m) => !m.isCustomCard)
              .map((m) => ({
                role: m.role === 'bot' ? 'assistant' : 'user',
                content: m.text
              }))
              .concat({ role: 'user', content: q })
          })
        });

        if (!res.ok) throw new Error('API query error');

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        setTyping(false);

        // Seed empty assistant bubble
        setMsgs((m) => [...m, { role: 'bot', text: '' }]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const textChunk = decoder.decode(value, { stream: true });
            for (const line of textChunk.split('\n')) {
              if (line.startsWith('data: ')) {
                const payload = line.slice(6).trim();
                if (payload === '[DONE]') break;
                try {
                  const { content } = JSON.parse(payload) as {
                    content: string;
                  };
                  setMsgs((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.role === 'bot') {
                      last.text += content;
                    }
                    return updated;
                  });
                } catch {
                  // Skip parse failures
                }
              }
            }
          }
        }
      } catch {
        setTyping(false);
        setMsgs((m) => [
          ...m,
          {
            role: 'bot',
            text: 'Error establishing chat streaming. Please try again.'
          }
        ]);
      }
    },
    [msgs, typing]
  );

  const handleSuggestion = (s: string) => {
    send(s);
  };

  const socials = [
    {
      label: 'contact@davidpapp.dev',
      href: 'mailto:contact@davidpapp.dev',
      primary: true
    },
    { label: 'github', href: 'https://github.com/pappdavid' },
    { label: 'linkedin', href: 'https://www.linkedin.com/in/d%C3%A1vid-papp' }
  ];

  return (
    <section className='block' id='contact'>
      <div className='sec-head'>
        <span className='sec-cmd'>cat contact</span>
        <span className='sec-note'>UTILITIES</span>
      </div>
      <div className='ping-line'>
        <span className='prompt'>david@dev:~/contact$ </span>ping
      </div>
      <p className='prose contact-intro whitespace-pre-line'>
        {`I'm open to full-time engineering and AI roles.
Based in Rotterdam, NL — remote / hybrid. No sponsorship required.
Email is fastest.`}
      </p>

      <div className='social-row'>
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target='_blank'
            rel='noopener noreferrer'
            className={cn('cta', s.primary ? 'cta-resume' : 'glitch-hover')}
          >
            [{s.label}]
          </a>
        ))}
      </div>

      <div className='chat term-window'>
        <div className='chat-titlebar'>
          <span className='chat-status'>
            <span className='sb-dot' /> PORTFOLIO_ASSISTANT: ready
          </span>
          <span className='chat-conv'>context: github_public</span>
        </div>

        <div className='chat-body' ref={bodyRef}>
          {msgs.map((m, i) => (
            <div key={i} className={cn('chat-msg', m.role)}>
              {m.role === 'bot' && <span className='msg-tag'>ASSISTANT</span>}
              <span className='msg-text whitespace-pre-wrap'>{m.text}</span>
            </div>
          ))}
          {typing && (
            <div className='chat-msg bot typing'>
              <span className='msg-tag'>ASSISTANT</span>
              <span className='msg-text'>
                searching project corpus
                <span className='ell'>...</span>
              </span>
            </div>
          )}
        </div>

        {/* Suggestion block */}
        <div
          className='flex flex-col gap-3 border-t border-b border-[var(--dp-border)] px-4 py-3'
          style={{ background: 'var(--dp-bg-raised)' }}
        >
          <div className='flex flex-wrap gap-1.5'>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className='max-w-full cursor-pointer truncate border border-[var(--dp-border)] bg-[#0d0d0d] px-2 py-1 text-left text-[11px] text-[var(--dp-accent-muted)] transition-all hover:border-[var(--dp-accent)] hover:text-[var(--dp-accent)]'
              >
                &gt; {s}
              </button>
            ))}
          </div>
        </div>

        <div className='chat-input'>
          <span className='chat-pre'>david@dev:~/assistant$</span>
          <input
            className='chat-field'
            placeholder='Ask me a technical question about David...'
            value={val}
            maxLength={500}
            onChange={(e) => setVal(e.target.value)}
            onFocus={() => triggerFocus('chat')}
            onBlur={() => triggerFocus(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send(val);
            }}
            spellCheck={false}
          />
          <button className='send-btn' onClick={() => send(val)}>
            [send]
          </button>
        </div>
      </div>
    </section>
  );
}
