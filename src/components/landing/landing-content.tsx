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
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
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
        if (i >= text.length) clearInterval(t);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(begin);
      clearInterval(t);
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
  image: string;
  access?: 'private';
  isFlagship?: boolean;
};

const PROJECTS: Project[] = [
  {
    name: 'AGENTSEC.app',
    stage: 'BETA',
    mod: '2026-05',
    badge: 'private',
    access: 'private',
    isFlagship: true,
    repoName: 'pappdavid/agentsec-hook-pack',
    image: '/saas-screenshots/approveops.png',
    desc: 'AI agent security platform gating risky tool calls with 100% human-in-the-loop audit logs',
    body: 'A deterministic security review platform for autonomous AI agents. Intercepts and scores risky tool executions (like shell commands or secret key lookups) against dynamic policies. Developed for security-focused teams, it features a live audit trail, runtime PreToolUse enforcement, and human-in-the-loop approvals.\n\n=== FLAGSHIP CASE STUDY ===\nPROBLEM: AI agents in development environments can run destructive shell commands or leak API keys.\nAPPROACH: Intercept tool requests at the runtime layer via PreToolUse hooks, check against whitelists locally to preserve speed, and gate anomalous actions behind a central risk engine requiring manual approval.\nSTACK: Rust policy engine, Next.js telemetry dashboard, custom MCP connector.\nOUTCOME: Secured 100% of agent executions with zero accidental file modifications across 5 active repositories.',
    tech: [
      'Next.js',
      'MCP Protocol',
      'Policy Engine',
      'Risk Scoring',
      'HITL Security'
    ]
  },
  {
    name: 'AGENT_CLI.rust',
    stage: 'LIVE',
    mod: '2026-05',
    badge: 'live',
    repoName: 'pappdavid/agent-cli-mcp-rust',
    image: '/saas-screenshots/agentmap.png',
    desc: 'Multi-agent orchestration CLI enabling Claude/Gemini to drive subprocess agents with 0% context bloat',
    body: 'A high-performance Model Context Protocol (MCP) server written in Rust that coordinates multiple secondary agents. Built for developers executing complex multi-agent flows, it maintains separate sandboxed workspaces, scrubs credentials from output streams using real-time regex matching, and provides strict tool permission profiling.',
    tech: [
      'Rust',
      'Cargo',
      'MCP Protocol',
      'JSON-RPC over stdio',
      'Subprocesses'
    ],
    repoUrl: 'https://github.com/pappdavid/agent-cli-mcp-rust'
  },
  {
    name: 'SKILL_INJ.rs',
    stage: 'LIVE',
    mod: '2026-05',
    badge: 'live',
    repoName: 'pappdavid/antigravity-skill-injector',
    image: '/saas-screenshots/mcpguard-lite.png',
    desc: 'Dynamic skill injector saving 97% of context window tokens in the Antigravity Desktop App',
    body: 'An ultra-light dynamic skill injection framework that replaces massive system prompt instructions with 20-token stub files. The full skill payloads are retrieved dynamically on-demand from a local Rust-based MCP server only when specifically invoked by the AI agent, effectively eliminating context window exhaustion.',
    tech: [
      'Rust',
      'Python',
      'Antigravity App',
      'Dynamic Loading',
      'Bash Installer'
    ],
    repoUrl: 'https://github.com/pappdavid/antigravity-skill-injector'
  },
  {
    name: 'THESYS_C1.app',
    stage: 'LIVE',
    mod: '2026-03',
    badge: 'live',
    repoName: 'pappdavid/thesys-c1-dashboard',
    image: '/shadcn-dashboard.png',
    desc: 'Generative UI telemetry dashboard tracking real-time agent execution latency and user click paths',
    body: 'A production developer console for monitoring AI-driven Generative UI flows using the Thesys C1 framework. Tracks UI schema rendering steps, user interaction logs, and step-by-step agent latencies. Perfect for troubleshooting dynamic client states and layout metrics.',
    tech: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Recharts',
      'Generative UI'
    ],
    repoUrl: 'https://github.com/pappdavid/thesys-c1-dashboard',
    liveUrl: 'https://thesys-c1-dashboard.vercel.app'
  },
  {
    name: 'JOBLAUNCH.agent',
    stage: 'LIVE',
    mod: '2026-04',
    badge: 'live',
    repoName: 'pappdavid/joblaunch-agent',
    image: '/saas-screenshots/proposal-spy.png',
    desc: 'Job-application copilot generating tailored candidate profiles with 3x faster submission cycles',
    body: 'An interactive job application tailored powered by Next.js and Thesys C1. It reasons over role listings and candidate CVs to dynamically render customized tailoring interfaces, accelerating the application editing and PDF generation loop.',
    tech: ['Next.js', 'Thesys C1', 'Generative UI', 'Agents'],
    repoUrl: 'https://github.com/pappdavid/joblaunch-agent',
    liveUrl: 'https://joblaunch-agent.vercel.app'
  }
];

const SUGGESTIONS = [
  "what is David's tech stack?",
  'tell me about agent-cli-mcp-rust',
  'what is the AgentSec platform?',
  'is David available for hire?'
];

// ============================================================
// Unified Landing Page Component
// ============================================================

export function LandingContent() {
  const [active, setActive] = useState('home');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [commitCount, setCommitCount] = useState(1284);
  const [themeProfile, setThemeProfile] = useState<string>('green');
  const [latency, setLatency] = useState<string>('5.2ms');
  const [memLoad, setMemLoad] = useState<string>('43.1%');

  // Load and apply initial theme profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme-profile') || 'green';
    setThemeProfile(saved);
    document.documentElement.setAttribute('data-theme-profile', saved);
  }, []);

  const changeThemeProfile = useCallback((profile: string) => {
    setThemeProfile(profile);
    localStorage.setItem('theme-profile', profile);
    document.documentElement.setAttribute('data-theme-profile', profile);
  }, []);

  // Telemetry fluctuation timers
  useEffect(() => {
    const cInterval = setInterval(() => {
      if (Math.random() < 0.35) setCommitCount((c) => c + 1);
    }, 2600);

    const lInterval = setInterval(() => {
      const ms = (4.8 + Math.random() * 4.4).toFixed(1);
      setLatency(`${ms}ms`);
    }, 1100);

    const mInterval = setInterval(() => {
      const pct = (42.5 + Math.random() * 2.3).toFixed(1);
      setMemLoad(`${pct}%`);
    }, 1800);

    return () => {
      clearInterval(cInterval);
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
    const ids = ['home', 'work', 'skills', 'contact'];
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

  // Custom Event Bus focusing dispatcher
  const triggerFocus = useCallback((id: string | null) => {
    let moduleId: string | null = null;
    if (id) {
      const u = id.toUpperCase();
      if (u.includes('AGENTSEC') || u.includes('AGENT_CLI'))
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
      <div className='statusbar'>
        <div className='sb-scroll'>
          <span className='sb-item'>
            <span className='sb-k'>SYS.NAME:</span>
            <span className='sb-accent'>PORTFOLIO_OS v1.0.0</span>
          </span>
          <span className='sb-sep'>|</span>
          <span className='sb-item'>
            <span className='sb-k'>SYS.AUTH:</span>
            <span className='sb-v'>GUEST_ACCESS_GRANTED</span>
          </span>
          <span className='sb-sep'>|</span>
          <span className='sb-item'>
            <span className='sb-k'>TERMINAL:</span>
            <span className='sb-v'>TTY0</span>
          </span>
          <span className='sb-sep'>|</span>
          <span className='sb-item'>
            <span className='sb-k'>SYS.NODE:</span>
            <span className='sb-v'>davidpapp.dev</span>
          </span>
          <span className='sb-sep'>|</span>
          <span className='sb-item'>
            <span className='sb-k'>LATENCY:</span>
            <span className='sb-v sb-accent'>{latency}</span>
          </span>
          <span className='sb-sep'>|</span>
          <span className='sb-item'>
            <span className='sb-k'>MEM.LOAD:</span>
            <span className='sb-v sb-accent'>{memLoad}</span>
          </span>
          <span className='sb-sep'>|</span>
          <span className='sb-item'>
            <span className='sb-k'>STATUS:</span>
            <span className='sb-ok'>200</span>
          </span>
          <span className='sb-sep'>|</span>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('dp-portfolio-warp'));
            }}
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
            <button
              onClick={() => changeThemeProfile('green')}
              className={cn(
                'cursor-pointer border px-1.5 py-0.5 text-[9px] transition-all',
                themeProfile === 'green'
                  ? 'border-[var(--dp-accent)] bg-[var(--dp-accent-faint)] text-[var(--dp-accent)]'
                  : 'border-[var(--dp-border)] text-[var(--dp-text-dim)]'
              )}
              style={{ borderRadius: 0 }}
            >
              🟢
            </button>
            <button
              onClick={() => changeThemeProfile('cyan')}
              className={cn(
                'cursor-pointer border px-1.5 py-0.5 text-[9px] transition-all',
                themeProfile === 'cyan'
                  ? 'border-[var(--dp-accent)] bg-[var(--dp-accent-faint)] text-[var(--dp-accent)]'
                  : 'border-[var(--dp-border)] text-[var(--dp-text-dim)]'
              )}
              style={{ borderRadius: 0 }}
            >
              🔵
            </button>
            <button
              onClick={() => changeThemeProfile('amber')}
              className={cn(
                'cursor-pointer border px-1.5 py-0.5 text-[9px] transition-all',
                themeProfile === 'amber'
                  ? 'border-[var(--dp-accent)] bg-[var(--dp-accent-faint)] text-[var(--dp-accent)]'
                  : 'border-[var(--dp-border)] text-[var(--dp-text-dim)]'
              )}
              style={{ borderRadius: 0 }}
            >
              🟡
            </button>
            <button
              onClick={() => changeThemeProfile('pink')}
              className={cn(
                'cursor-pointer border px-1.5 py-0.5 text-[9px] transition-all',
                themeProfile === 'pink'
                  ? 'border-[var(--dp-accent)] bg-[var(--dp-accent-faint)] text-[var(--dp-accent)]'
                  : 'border-[var(--dp-border)] text-[var(--dp-text-dim)]'
              )}
              style={{ borderRadius: 0 }}
            >
              🔴
            </button>
          </div>
          <span className='sb-dot' />
          <a
            href='https://github.com/pappdavid'
            target='_blank'
            rel='noopener noreferrer'
            className='sb-commits hover:underline'
          >
            ⎇ {commitCount.toLocaleString()} commits
          </a>
        </div>
      </div>

      {/* 2. MAIN SCROLL CONTAINER */}
      <div className='scroll-container' ref={scrollRef}>
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
                <div className='hero-role'>Junior AI Solution Developer</div>
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

                <div className='cta-row'>
                  <a
                    href='/cv.pdf'
                    download
                    className='cta cta-primary glitch-hover'
                  >
                    [view resume]
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
                          building agent sandboxes & studying neural retrieval
                          at VU Amsterdam
                        </td>
                      </tr>
                      <tr>
                        <td className='mk'>AVAILABILITY</td>
                        <td className='ms'>:</td>
                        <td className='mv'>
                          Part-time / Internship (July 2026 onwards)
                        </td>
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

          {/* ============ SECTION 4: CONTACT / RAG CHAT ============ */}
          <ContactSection
            themeProfile={themeProfile}
            changeThemeProfile={changeThemeProfile}
            triggerFocus={triggerFocus}
          />

          <div style={{ height: '48px' }} />
        </div>
      </div>

      {/* 3. FIXED BOTTOM TAB BAR */}
      <div className='tabbar'>
        <div className='tab-prompt'>&gt;</div>
        <button
          onClick={() => nav('home')}
          className={cn('tab glitch-hover', active === 'home' && 'active')}
        >
          01._HOME
        </button>
        <button
          onClick={() => nav('work')}
          className={cn('tab glitch-hover', active === 'work' && 'active')}
        >
          02._PROJECTS
        </button>
        <button
          onClick={() => nav('skills')}
          className={cn('tab glitch-hover', active === 'skills' && 'active')}
        >
          03._SKILLS
        </button>
        <button
          onClick={() => nav('contact')}
          className={cn('tab glitch-hover', active === 'contact' && 'active')}
        >
          04._CONTACT
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
  const [open, setOpen] = useState(0); // pre-expanded AGENTSEC (flagship) by default
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
                <span className='caret'>
                  {open === i ? 'v' : hover === i ? '>' : '\u00a0'}
                </span>
                <span className='dirname'>
                  {p.name}
                  {p.isFlagship && (
                    <span className='ml-2 border border-[var(--accent)] px-1 py-0 text-[10px] font-extrabold text-[var(--accent)] select-none'>
                      ★ FLAGSHIP
                    </span>
                  )}
                </span>
              </span>
              <span className='c-size'>{p.stage}</span>
              <span className='c-mod'>{p.mod}</span>
              <span className='c-desc'>
                {p.desc}
                <span
                  className='row-badge'
                  style={{ color: badgeColor[p.badge] }}
                >
                  <span
                    className='rb-dot'
                    style={{ background: badgeColor[p.badge] }}
                  />
                  {p.badge}
                </span>
              </span>
            </div>

            {open === i && (
              <div className='fs-expand'>
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
                    'private-beta (access requests only)'
                  )}
                </div>

                <p className='fs-expand-body whitespace-pre-line'>{p.body}</p>

                <div className='my-4 max-w-[500px] overflow-hidden border border-[var(--border)] bg-black'>
                  <img
                    src={p.image}
                    alt={p.name}
                    className='h-auto w-full object-cover opacity-80 transition-opacity duration-300 hover:opacity-100'
                  />
                </div>

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
                {p.access === 'private' ? (
                  <a
                    href='mailto:contact@davidpapp.dev?subject=AgentSec%20access%20request'
                    className='open-btn inline-block'
                  >
                    [REQUEST ACCESS] private beta →
                  </a>
                ) : (
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
                )}
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
        I am an AI systems developer specialized in building production-ready
        architectures where AI agents operate securely and autonomously. Focused
        on the intersection of agent observability, secure runtime sandboxes,
        and high-throughput retrieval pipelines. I love collaborating with
        technical teams building core AI tooling, developer platforms, or
        autonomous agent frameworks. Looking for part-time engineering roles, AI
        internships, or research collaborations starting Summer/Fall 2026.
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
            🏛️ VU AMSTERDAM (BSc AI Research)
          </span>
          <span className='border border-[var(--dp-border)] bg-[#0d0d0d] px-3 py-1.5 select-none'>
            💻 WEBINFORM (AI Solution Delivery)
          </span>
        </div>
        <div className='rs-divider'>{'// EXPERIENCE'}</div>

        <div className='rs-row'>
          <div className='rs-line'>
            <span className='rs-role'>AI Solution Developer</span>
            <span className='rs-meta'>| WebInform</span>
            <span className='rs-meta rs-dates'>2025 — Present</span>
          </div>
          <ul className='rs-bullets'>
            <li>
              <span className='li-mark'>&gt;</span> Designed secure multi-agent
              coordination architectures using MCP connectors.
            </li>
            <li>
              <span className='li-mark'>&gt;</span> Bootstrapped low-latency
              fine-tuning dataset generation scripts over massive code bases.
            </li>
            <li>
              <span className='li-mark'>&gt;</span> Overhauled SaaS backends
              with Stripe Billing, Prisma, and robust usage constraints.
            </li>
          </ul>
        </div>

        <div className='rs-row'>
          <div className='rs-line'>
            <span className='rs-role'>
              BSc Artificial Intelligence (Student)
            </span>
            <span className='rs-meta'>| VU Amsterdam</span>
            <span className='rs-meta rs-dates'>2024 — Present</span>
          </div>
          <ul className='rs-bullets'>
            <li>
              <span className='li-mark'>&gt;</span> Specializing in neural
              representation, computational linguistics, and retrieval networks.
            </li>
            <li>
              <span className='li-mark'>&gt;</span> Built research benchmarks
              evaluating agent planning and tool selection under context bloat
              constraints.
            </li>
          </ul>
        </div>

        <div className='rs-divider'>{'// CORE SKILLS'}</div>
        <div className='resume-grid mb-8'>
          <div>
            <div className='skill-cap'>LANGUAGES</div>
            <ul className='skill-list'>
              <li>
                <span className='prompt'>●</span> Python
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  PROD
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> Rust
                <span className='ml-1.5 border border-[var(--warn)] px-1 py-0 text-[9px] font-normal text-[var(--warn)] select-none'>
                  DEV
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> TypeScript
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  PROD
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> SQL / Bash
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  PROD
                </span>
              </li>
            </ul>
          </div>
          <div>
            <div className='skill-cap'>FRAMEWORKS</div>
            <ul className='skill-list'>
              <li>
                <span className='prompt'>●</span> FastAPI
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  PROD
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> Next.js 14+
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  PROD
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> LangChain
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  PROD
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> Prisma ORM
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  PROD
                </span>
              </li>
            </ul>
          </div>
          <div>
            <div className='skill-cap'>INFRASTRUCTURE</div>
            <ul className='skill-list'>
              <li>
                <span className='prompt'>●</span> Supabase / Postgres
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  PROD
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> Upstash Redis
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  PROD
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> Stripe API
                <span className='ml-1.5 border border-[var(--accent-muted)] px-1 py-0 text-[9px] font-normal text-[var(--accent-muted)] select-none'>
                  PROD
                </span>
              </li>
              <li>
                <span className='prompt'>●</span> Trigger.dev
                <span className='ml-1.5 border border-[var(--warn)] px-1 py-0 text-[9px] font-normal text-[var(--warn)] select-none'>
                  DEV
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className='sec-head mt-8'>
          <span className='sec-cmd'>ls -la /notes/</span>
          <span className='sec-note'>PUBLICATIONS</span>
        </div>
        <p className='sub-note'>
          Technical articles on AI Agent security, multi-agent scaling & prompt
          engineering
        </p>
        <div className='flex flex-col gap-3 font-mono text-sm'>
          <a
            href='https://github.com/pappdavid/agentsec-hook-pack/blob/main/docs/observability.md'
            target='_blank'
            rel='noopener noreferrer'
            className='group border border-[var(--border)] bg-[#0f0f0f] p-3 transition-all hover:border-[var(--accent)]'
          >
            <div className='flex flex-wrap items-baseline justify-between gap-2'>
              <span className='font-bold text-[var(--accent)] group-hover:underline'>
                observability.md
              </span>
              <span className='text-xs text-[var(--text-dim)]'>2026-05</span>
            </div>
            <p className='mt-1.5 text-xs text-[var(--text-dim)]'>
              Why structured JSON event streams beat standard stdout dumps for
              production agent auditing and security posture.
            </p>
          </a>
          <a
            href='https://github.com/pappdavid/agent-cli-mcp-rust/blob/main/docs/security.md'
            target='_blank'
            rel='noopener noreferrer'
            className='group border border-[var(--border)] bg-[#0f0f0f] p-3 transition-all hover:border-[var(--accent)]'
          >
            <div className='flex flex-wrap items-baseline justify-between gap-2'>
              <span className='font-bold text-[var(--accent)] group-hover:underline'>
                mcp_security.md
              </span>
              <span className='text-xs text-[var(--text-dim)]'>2026-04</span>
            </div>
            <p className='mt-1.5 text-xs text-[var(--text-dim)]'>
              Sandboxing stdio Model Context Protocol servers: Enforcing strict
              directory restrictions and regular expression credentials
              scrubbing.
            </p>
          </a>
        </div>
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
      text: "Session active. Grounded in David's public GitHub projects. Ask me about the AgentSec platform, agent-cli-mcp-rust, antigravity-skill-injector, thesys-c1-dashboard, or joblaunch-agent!"
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
      <div className='contact-label'>CONTACT</div>
      <div className='sec-head'>
        <span className='sec-cmd'>cat contact</span>
        <span className='sec-note'>UTILITIES</span>
      </div>
      <div className='ping-line'>
        <span className='prompt'>david@dev:~/contact$ </span>ping
      </div>
      <p className='prose contact-intro'>
        Want to build something AI-first, or looking for a developer who ships
        secure agent systems? Say hello — or interact with the RAG assistant
        below.
      </p>

      <div className='social-row'>
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target='_blank'
            rel='noopener noreferrer'
            className={cn('cta', s.primary && 'cta-primary')}
          >
            [{s.label}]
          </a>
        ))}
      </div>

      <div className='chat term-window'>
        <div className='chat-titlebar'>
          <span className='chat-status'>
            <span className='sb-dot' /> RAG_ASSISTANT: connected
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
                searching vector store and reasoning
                <span className='ell'>...</span>
              </span>
            </div>
          )}
        </div>

        {/* Suggestion block & Theme Toggle */}
        <div
          className='flex flex-col gap-3 border-t border-[var(--dp-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between'
          style={{ background: 'var(--dp-bg-raised)' }}
        >
          <div className='flex flex-wrap gap-1.5'>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className='cursor-pointer border border-[var(--dp-border)] bg-[#0d0d0d] px-2 py-1 text-[11px] text-[var(--dp-accent-muted)] transition-all hover:border-[var(--dp-accent)] hover:text-[var(--dp-accent)]'
              >
                &gt; {s}
              </button>
            ))}
          </div>
          <div className='flex shrink-0 items-center gap-1.5 border-t border-[var(--dp-border)] pt-2.5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3.5'>
            <span className='text-[10px] font-bold tracking-wider text-[var(--dp-text-dim)]'>
              SYS.THEME:
            </span>
            <button
              onClick={() => changeThemeProfile('green')}
              className={cn(
                'cursor-pointer border px-2 py-1 text-[10px] font-bold',
                themeProfile === 'green'
                  ? 'border-[var(--dp-accent)] bg-[var(--dp-accent-faint)] text-[var(--dp-accent)]'
                  : 'border-[var(--dp-border)] text-[var(--dp-text-dim)]'
              )}
              style={{ borderRadius: 0 }}
            >
              GREEN
            </button>
            <button
              onClick={() => changeThemeProfile('cyan')}
              className={cn(
                'cursor-pointer border px-2 py-1 text-[10px] font-bold',
                themeProfile === 'cyan'
                  ? 'border-[var(--dp-accent)] bg-[var(--dp-accent-faint)] text-[var(--dp-accent)]'
                  : 'border-[var(--dp-border)] text-[var(--dp-text-dim)]'
              )}
              style={{ borderRadius: 0 }}
            >
              CYAN
            </button>
            <button
              onClick={() => changeThemeProfile('amber')}
              className={cn(
                'cursor-pointer border px-2 py-1 text-[10px] font-bold',
                themeProfile === 'amber'
                  ? 'border-[var(--dp-accent)] bg-[var(--dp-accent-faint)] text-[var(--dp-accent)]'
                  : 'border-[var(--dp-border)] text-[var(--dp-text-dim)]'
              )}
              style={{ borderRadius: 0 }}
            >
              AMBER
            </button>
            <button
              onClick={() => changeThemeProfile('pink')}
              className={cn(
                'cursor-pointer border px-2 py-1 text-[10px] font-bold',
                themeProfile === 'pink'
                  ? 'border-[var(--dp-accent)] bg-[var(--dp-accent-faint)] text-[var(--dp-accent)]'
                  : 'border-[var(--dp-border)] text-[var(--dp-text-dim)]'
              )}
              style={{ borderRadius: 0 }}
            >
              PINK
            </button>
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
