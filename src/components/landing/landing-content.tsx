'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconSend,
  IconLoader2
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

// ============================================================
// Types & Constant Data
// ============================================================

type Project = {
  name: string;
  size: string;
  mod: string;
  badge: 'live' | 'wip' | 'archive';
  desc: string;
  body: string;
  tech: string[];
};

const PROJECTS: Project[] = [
  {
    name: 'AGENTSEC.hook',
    size: '4.9kb',
    mod: '2026-05',
    badge: 'live',
    desc: 'Runtime security and policy enforcement hooks for AI agents',
    body: 'AgentSec Hook Pack intercepts and classifies risky tool calls before an AI agent (Claude Code / Codex) executes them — blocking destructive shell commands, secret exfiltration, unauthorized file edits, and unreviewed production deployments in real time. It uses a sequence of local fast-path checks and remote API policy validation with human-in-the-loop approvals.',
    tech: ['Node.js', 'JavaScript', 'JSON-RPC', 'PreToolUse', 'Enforce/Observe']
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
    ]
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
    ]
  },
  {
    name: 'SAAS_CORE.dir',
    size: '15.3kb',
    mod: '2026-05',
    badge: 'live',
    desc: 'Production-ready Next.js SaaS template with automatic bootstrapping',
    body: 'A production-ready SaaS template giving you authentication (Auth.js v5 / Clerk dual auth), billing (Stripe), background jobs (Trigger.dev), database (Prisma + Supabase Postgres), rate-limiting (Upstash Redis), Resend transactional email, and automated CI/CD bootstrap actions out of the box.',
    tech: ['Next.js 14+', 'Prisma', 'Stripe', 'Trigger.dev', 'Clerk', 'Upstash']
  },
  {
    name: 'THESYS_C1.wip',
    size: '2.8kb',
    mod: '2026-03',
    badge: 'wip',
    desc: 'Developer dashboard for Thesys C1 Generative UI integration',
    body: 'Production-ready developer dashboard for managing and analyzing AI agents running with Thesys C1 Generative UI. Built with Next.js, featuring real-time telemetry, session controls, and automated deployment pipelines via GitHub Actions and Vercel.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Generative UI']
  }
];

const SUGGESTIONS = [
  "what is David's tech stack?",
  'tell me about agent-cli-mcp-rust',
  'what does antigravity-skill-injector do?',
  'is David available for hire?'
];

// ============================================================
// Unified Landing Page Component
// ============================================================

export function LandingContent() {
  const [active, setActive] = useState('home');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Time & Live Ticker States
  const [uptime, setUptime] = useState('00:00:00');
  const [commitCount, setCommitCount] = useState(2548);

  useEffect(() => {
    // Uptime tick
    const start = Date.now();
    const tInterval = setInterval(() => {
      const diff = Date.now() - start;
      const hours = Math.floor(diff / 3600000)
        .toString()
        .padStart(2, '0');
      const mins = Math.floor((diff % 3600000) / 60000)
        .toString()
        .padStart(2, '0');
      const secs = Math.floor((diff % 60000) / 1000)
        .toString()
        .padStart(2, '0');
      setUptime(`${hours}:${mins}:${secs}`);
    }, 1000);

    // Commit ticks
    const cInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setCommitCount((c) => c + 1);
      }
    }, 4000);

    return () => {
      clearInterval(tInterval);
      clearInterval(cInterval);
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

  return (
    <div style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
      {/* 1. FIXED TOP STATUS BAR */}
      <div className='statusbar'>
        <div className='sb-scroll'>
          <span className='sb-accent'>SYS.OS v1.0.0</span>
          <span className='sb-sep'>|</span>
          <span className='sb-item'>
            <span className='sb-k'>UPTIME:</span>
            <span className='sb-v'>{uptime}</span>
          </span>
          <span className='sb-sep'>|</span>
          <span className='sb-item'>
            <span className='sb-k'>NODE:</span>
            <span className='sb-v'>davidpapp.dev</span>
          </span>
          <span className='sb-sep'>|</span>
          <span className='sb-item'>
            <span className='sb-k'>AUTH:</span>
            <span className='sb-v' style={{ color: 'var(--accent)' }}>
              GUEST_ACCESS_GRANTED
            </span>
          </span>
          <span className='sb-sep'>|</span>
          <span className='sb-item'>
            <span className='sb-k'>LATEST_COMMITS:</span>
            <span className='sb-commits'>#{commitCount}</span>
          </span>
        </div>
        <div className='sb-right'>
          <span className='sb-dot' />
          <span>PORTFOLIO_READY</span>
        </div>
      </div>

      {/* 2. MAIN SCROLL CONTAINER */}
      <div className='scroll-container' ref={scrollRef}>
        <div className='shell'>
          {/* ============ SECTION 1: HOME ============ */}
          <section className='block' id='home'>
            {/* JetBrains ASCII Wordmark */}
            <pre className='ascii' aria-hidden='true'>
              {`     _            _     _                              
    | |          (_)   | |                             
  __| | __ ___   ___  __| | _ __   __ _ _ __  _ __     
 / _\` |/ _\` \\ \\ / / |/ _\` || '_ \\ / _\` | '_ \\| '_ \\    
| (_| | (_| |\\ V /| | (_| || |_) | (_| | |_) | |_) |   
 \\__,_|\\__,_| \\_/ |_|\\__,_|| .__/ \\__,_| .__/| .__/    
                           | |        | |   | |        
                           |_|        |_|   |_|        `}
            </pre>

            <div className='hero-cmd'>
              <span className='prompt'>david@dev:~$ </span>whoami
            </div>

            <h1 className='hero-name'>David Papp</h1>
            <div className='hero-role'>Junior AI Solution Developer</div>
            <div className='hero-tag'>
              <span className='prompt'>&gt; </span>Building AI-first solutions.{' '}
              <span className='out'>One agent at a time.</span>
              <span className='cur' />
            </div>

            <div className='hero-pill'>
              <div
                className='pill'
                style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
              >
                <span
                  className='dot live'
                  style={{ background: 'var(--accent)' }}
                />
                <span>● OPEN TO WORK</span>
              </div>
              <span className='loc'>Based in Rotterdam, NL</span>
            </div>

            <div className='cta-row'>
              <button
                onClick={() => nav('contact')}
                className='cta cta-primary'
              >
                [contact_assistant]
              </button>
              <a
                href='https://github.com/pappdavid'
                target='_blank'
                rel='noopener noreferrer'
                className='cta'
              >
                [github_profile]
              </a>
              <a
                href='https://www.linkedin.com/in/d%C3%A1vid-papp'
                target='_blank'
                rel='noopener noreferrer'
                className='cta'
              >
                [linkedin_network]
              </a>
            </div>

            <div className='statustxt'>
              <div className='statustxt-cap'>status.txt</div>
              <table className='meta-table'>
                <tbody>
                  <tr>
                    <td className='mk'>STACK</td>
                    <td className='ms'>:</td>
                    <td className='mv'>
                      python, fastapi, langchain, openai, next.js, typescript,
                      mcp
                    </td>
                  </tr>
                  <tr>
                    <td className='mk'>FOCUS</td>
                    <td className='ms'>:</td>
                    <td className='mv'>
                      agentic pipelines, multi-agent frameworks, rag, custom
                      tools
                    </td>
                  </tr>
                  <tr>
                    <td className='mk'>MISSION</td>
                    <td className='ms'>:</td>
                    <td className='mv'>
                      automating complex developer workflows and scaling secure
                      AI layers
                    </td>
                  </tr>
                </tbody>
              </table>
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
        <div className='tab-prompt'>david@dev:~$</div>
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
    archive: 'var(--text-dim)'
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
                <Link
                  href={
                    p.name.includes('AGENTSEC')
                      ? 'https://github.com/pappdavid/agentsec-hook-pack'
                      : p.name.includes('AGENT_CLI')
                        ? 'https://github.com/pappdavid/agent-cli-mcp-rust'
                        : p.name.includes('SKILL_INJ')
                          ? 'https://github.com/pappdavid/antigravity-skill-injector'
                          : p.name.includes('THESYS_C1')
                            ? 'https://github.com/pappdavid/thesys-c1-dashboard'
                            : 'https://github.com/pappdavid/portfolio-platform'
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  className='open-btn inline-block'
                >
                  [OPEN] read repository source code →
                </Link>
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

        <div className='rs-divider'>// EXPERIENCE</div>

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

        <div className='rs-divider'>// CORE SKILLS</div>
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
      text: "Session active. Grounded in David's public GitHub projects. Ask me about AgentSec, agent-cli-mcp-rust, antigravity-skill-injector, saas-core, or thesys-c1-dashboard!"
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
