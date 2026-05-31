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
  size: string;
  mod: string;
  badge: 'live' | 'wip' | 'archive' | 'private';
  desc: string;
  body: string;
  tech: string[];
  repoUrl?: string;
  liveUrl?: string;
  access?: 'private';
};

const PROJECTS: Project[] = [
  {
    name: 'AGENTSEC.app',
    size: '15.3kb',
    mod: '2026-05',
    badge: 'private',
    access: 'private',
    desc: 'AI agent security platform — register agents, score risk, enforce production readiness',
    body: 'A hosted platform that puts AI agents through deterministic security review before they reach production. Agents are registered, scored against a risk policy engine, and gated by human-in-the-loop approvals. Built on top of my AgentSec hook pack (runtime PreToolUse enforcement) with a dashboard, audit trail, and MCP integration on top. Currently in private beta.',
    tech: ['Next.js', 'MCP', 'Policy Engine', 'Risk Scoring', 'HITL']
  },
  {
    name: 'AGENT_CLI.rust',
    size: '6.8kb',
    mod: '2026-05',
    badge: 'live',
    desc: 'High-performance multi-agent orchestration server in Rust',
    body: 'An MCP server (agent-cli-mcp-rust) that lets any MCP-capable orchestrator (Claude Code, Cursor, Gemini) drive multiple AI coding agents (Copilot CLI, Google Jules, Gemini CLI, etc.) through a single unified interface with directory isolation, secret scrubbing, and tool permission profiles.',
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
    size: '4.0kb',
    mod: '2026-05',
    badge: 'live',
    desc: 'Zero-context-bloat dynamic skill loader for Antigravity',
    body: 'A dynamic skill injection system for the Antigravity Desktop App. Replaces heavy SKILL.md files with 20-token stub files in the UI, and fetches the full payload on demand from a local Rust MCP server only when requested by the agent. Reduces conversation context window bloat by 97%.',
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
    size: '2.8kb',
    mod: '2026-03',
    badge: 'live',
    desc: 'Developer dashboard for Thesys C1 Generative UI integration',
    body: 'Production-ready developer dashboard for managing and analyzing AI agents running with Thesys C1 Generative UI. Built with Next.js, featuring real-time telemetry, session controls, and automated deployment pipelines via GitHub Actions and Vercel.',
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
    size: '9.4kb',
    mod: '2026-04',
    badge: 'live',
    desc: 'AI job-application agent powered by Thesys C1 Generative UI',
    body: 'An AI agent that helps job seekers move faster — it reasons over a role and a candidate profile and renders an interactive, generative UI experience for tailoring applications. Built with Next.js and Thesys C1 Generative UI.',
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

  useEffect(() => {
    const cInterval = setInterval(() => {
      if (Math.random() < 0.35) setCommitCount((c) => c + 1);
    }, 2600);
    return () => clearInterval(cInterval);
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

  return (
    <div style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
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
            <span className='sb-k'>STATUS:</span>
            <span className='sb-ok'>200</span>
          </span>
        </div>
        <div className='sb-right'>
          <span className='sb-dot' />
          <span className='sb-commits'>
            ⎇ {commitCount.toLocaleString()} commits
          </span>
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
                <div className='hero-role'>AI Solution Developer</div>
                <div className='hero-tag'>
                  <span className='prompt'>&gt; </span>
                  <Typewriter text='Building AI-first solutions. One agent at a time.' />
                </div>

                <div className='hero-pill'>
                  <div
                    className='pill'
                    style={{
                      color: 'var(--accent)',
                      borderColor: 'var(--accent)'
                    }}
                  >
                    <span
                      className='dot live'
                      style={{ background: 'var(--accent)' }}
                    />
                    OPEN TO WORK
                  </div>
                  <span className='loc'>{'// Amsterdam · Rotterdam, NL'}</span>
                </div>

                <div className='cta-row'>
                  <a href='/cv.pdf' download className='cta cta-primary'>
                    [view resume]
                  </a>
                  <button onClick={() => nav('work')} className='cta'>
                    [projects]
                  </button>
                  <button onClick={() => nav('skills')} className='cta'>
                    [skills]
                  </button>
                  <button onClick={() => nav('contact')} className='cta'>
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
          <WorkSection />

          <div className='divider' />

          {/* ============ SECTION 3: SKILLS ============ */}
          <SkillsSection />

          <div className='divider' />

          {/* ============ SECTION 4: CONTACT / RAG CHAT ============ */}
          <ContactSection nav={nav} />

          <div style={{ height: '48px' }} />
        </div>
      </div>

      {/* 3. FIXED BOTTOM TAB BAR */}
      <div className='tabbar'>
        <div className='tab-prompt'>&gt;</div>
        <button
          onClick={() => nav('home')}
          className={cn('tab', active === 'home' && 'active')}
        >
          01._HOME
        </button>
        <button
          onClick={() => nav('work')}
          className={cn('tab', active === 'work' && 'active')}
        >
          02._PROJECTS
        </button>
        <button
          onClick={() => nav('skills')}
          className={cn('tab', active === 'skills' && 'active')}
        >
          03._SKILLS
        </button>
        <button
          onClick={() => nav('contact')}
          className={cn('tab', active === 'contact' && 'active')}
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

function WorkSection() {
  const [hover, setHover] = useState(-1);
  const [open, setOpen] = useState(-1);
  const badgeColor = {
    live: 'var(--accent)',
    wip: 'var(--warn)',
    archive: 'var(--text-dim)',
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
          <span className='c-size'>SIZE</span>
          <span className='c-mod'>MODIFIED</span>
          <span className='c-desc'>DESCRIPTION</span>
        </div>

        {PROJECTS.map((p, i) => (
          <div key={p.name} className='fs-cell'>
            <div
              className='fs-row'
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <span className='c-name'>
                <span className='caret'>
                  {open === i ? 'v' : hover === i ? '>' : '\u00a0'}
                </span>
                <span className='dirname'>{p.name}</span>
              </span>
              <span className='c-size'>{p.size}</span>
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
                <p className='fs-expand-body'>{p.body}</p>
                <div className='mb-4 flex flex-wrap gap-1.5'>
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className='border border-[var(--border)] px-2 py-0.5 text-[11px] text-[var(--accent-muted)]'
                      style={{ background: 'var(--accent-faint)' }}
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
        I am a developer focused on building systems where AI agents collaborate
        safely and efficiently. I write structured microservices, dynamic
        orchestration interfaces, and secure runtime hooks to enable LLM-driven
        actions in production. Let&apos;s build robust, production-grade agent
        networks.
      </p>

      <div className='resume'>
        <div className='sec-head'>
          <span className='sec-cmd'>cat resume.txt</span>
          <span className='sec-note'>HISTORY</span>
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
        <div className='resume-grid'>
          <div>
            <div className='skill-cap'>LANGUAGES</div>
            <ul className='skill-list'>
              <li>
                <span className='prompt'>●</span> Python
              </li>
              <li>
                <span className='prompt'>●</span> Rust
              </li>
              <li>
                <span className='prompt'>●</span> TypeScript
              </li>
              <li>
                <span className='prompt'>●</span> SQL / Bash
              </li>
            </ul>
          </div>
          <div>
            <div className='skill-cap'>FRAMEWORKS</div>
            <ul className='skill-list'>
              <li>
                <span className='prompt'>●</span> FastAPI
              </li>
              <li>
                <span className='prompt'>●</span> Next.js 14+
              </li>
              <li>
                <span className='prompt'>●</span> LangChain
              </li>
              <li>
                <span className='prompt'>●</span> Prisma ORM
              </li>
            </ul>
          </div>
          <div>
            <div className='skill-cap'>INFRASTRUCTURE</div>
            <ul className='skill-list'>
              <li>
                <span className='prompt'>●</span> Supabase / Postgres
              </li>
              <li>
                <span className='prompt'>●</span> Upstash Redis
              </li>
              <li>
                <span className='prompt'>●</span> Stripe API
              </li>
              <li>
                <span className='prompt'>●</span> Trigger.dev
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ContactSectionProps {
  nav: (id: string) => void;
}

type ChatMsg = {
  role: 'bot' | 'user';
  text: string;
  isCustomCard?: boolean;
  projectData?: Project;
};

function ContactSection({ nav }: ContactSectionProps) {
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

        {/* Suggestion block */}
        <div
          className='flex flex-wrap gap-1.5 border-t border-[var(--border)] px-4 py-2'
          style={{ background: 'var(--bg-raised)' }}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className='border border-[var(--border)] bg-[#0d0d0d] px-2 py-1 text-[11px] text-[var(--accent-muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]'
            >
              &gt; {s}
            </button>
          ))}
        </div>

        <div className='chat-input'>
          <span className='chat-pre'>david@dev:~/assistant$</span>
          <input
            className='chat-field'
            placeholder='Ask me a technical question about David...'
            value={val}
            maxLength={500}
            onChange={(e) => setVal(e.target.value)}
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
