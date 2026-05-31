'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
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
      <span className='cur' style={{ opacity: n < text.length ? 1 : undefined }} />
    </span>
  );
}

type Project = {
  name: string;
  size: string;
  mod: string;
  badge: 'live' | 'wip' | 'archive';
  desc: string;
  body: string;
  tech: string[];
  href: string;
};

const PROJECTS: Project[] = [
  {
    name: 'AGENT_ORCH.connector',
    size: '12.4kb',
    mod: '2025-04',
    badge: 'live',
    desc: 'Multi-agent orchestration tool living inside Claude via MCP',
    body: 'A Model Context Protocol connector that lets Claude orchestrate multiple specialised sub-agents from inside a single conversation. Implements a structured task-dispatch protocol with worktree isolation, secret scrubbing, and scoped tool permissions — so each agent only touches what it is allowed to.',
    tech: ['TypeScript', 'MCP Protocol', 'JSON-RPC', 'Claude SDK', 'Node.js'],
    href: 'https://github.com/pappdavid'
  },
  {
    name: 'RAG_DESK.case',
    size: '38.1kb',
    mod: '2025-02',
    badge: 'live',
    desc: 'Retrieval chatbot over private docs — trust UX for AI actors',
    body: 'Production retrieval-augmented generation system built on Supabase pgvector + OpenAI embeddings. Features a multi-turn conversational interface, chunk-level source citations, and a trust-first UX that clearly attributes every statement to its source document — reducing hallucination confidence in end users.',
    tech: ['Next.js', 'Supabase', 'pgvector', 'OpenAI API', 'TypeScript'],
    href: 'https://github.com/pappdavid'
  },
  {
    name: 'PROMPT_LAB.log',
    size: '94.7kb',
    mod: '2024-2025',
    badge: 'wip',
    desc: 'Prompt eval + regression harness — 40+ test suites',
    body: 'A comprehensive prompt evaluation framework with 40+ regression test suites across task families (summarisation, extraction, tool-calling, instruction-following). Tracks score drift across model versions, surfaces prompt-brittleness hotspots, and integrates with CI to gate model upgrades.',
    tech: ['Python', 'FastAPI', 'pytest', 'OpenAI API', 'Anthropic API'],
    href: 'https://github.com/pappdavid'
  },
  {
    name: 'VECTOR_CLI.dir',
    size: '6.5kb',
    mod: '2024',
    badge: 'live',
    desc: 'Local embeddings search over your filesystem — TypeScript',
    body: 'A zero-dependency CLI that indexes a local directory with OpenAI text-embedding-3-small, stores vectors in a flat JSON file, and answers natural-language queries with cosine similarity search — all without a database or internet connection after the initial embed step.',
    tech: ['TypeScript', 'Node.js', 'OpenAI Embeddings', 'CLI'],
    href: 'https://github.com/pappdavid'
  },
  {
    name: 'TINYFORMER.wip',
    size: '--',
    mod: '2024',
    badge: 'archive',
    desc: 'From-scratch transformer — learning project',
    body: 'A minimal transformer implementation in pure Python / NumPy — no frameworks. Built to understand attention mechanisms, positional encoding, and layer normalisation at the arithmetic level. Trained on a small character-level dataset to produce coherent short sequences.',
    tech: ['Python', 'NumPy', 'Transformer', 'Attention Mechanism'],
    href: 'https://github.com/pappdavid'
  }
];

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

  const nav = useCallback((id: string) => {
    const el = document.getElementById(id);
    const cont = scrollRef.current;
    if (el && cont) {
      cont.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' });
    }
    setActive(id);
  }, []);

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
            <span className='sb-sep'>|</span>
          </span>
          <span className='sb-item'>
            <span className='sb-k'>SYS.AUTH:</span>
            <span className='sb-v'>GUEST_ACCESS_GRANTED</span>
            <span className='sb-sep'>|</span>
          </span>
          <span className='sb-item'>
            <span className='sb-k'>TERMINAL:</span>
            <span className='sb-v'>TTY0</span>
            <span className='sb-sep'>|</span>
          </span>
          <span className='sb-item'>
            <span className='sb-k'>SYS.NODE:</span>
            <span className='sb-v'>davidpapp.dev</span>
            <span className='sb-sep'>|</span>
          </span>
          <span className='sb-item'>
            <span className='sb-k'>STATUS:</span>
            <span className='sb-ok'>200</span>
          </span>
        </div>
        <span className='sb-right'>
          <span className='sb-dot' />
          <span className='sb-commits'>⎇ {commitCount.toLocaleString()} commits</span>
        </span>
      </div>

      {/* 2. MAIN SCROLL CONTAINER */}
      <div className='scroll' ref={scrollRef}>
        <div className='shell'>
          {/* ============ SECTION 1: HOME ============ */}
          <section className='block' id='home'>
            <div className='term-window hero-window'>
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

              <div className='term-body hero-body'>
                <pre className='ascii' aria-hidden='true'>{`██████╗  █████╗ ██╗   ██╗██╗██████╗
██╔══██╗██╔══██╗██║   ██║██║██╔══██╗
██║  ██║███████║██║   ██║██║██║  ██║
██║  ██║██╔══██║╚██╗ ██╔╝██║██║  ██║
██████╔╝██║  ██║ ╚████╔╝ ██║██████╔╝
╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═════╝ `}</pre>

                <div className='hero-cmd'>
                  <span className='prompt'>david@dev:~$ </span>whoami
                </div>

                <h1 className='hero-name'>David&nbsp;Papp</h1>
                <p className='hero-role'>Junior AI Solution Developer</p>
                <p className='hero-tag'>
                  <span className='out'>&gt;</span>{' '}
                  <Typewriter text='Building AI-first solutions. One agent at a time.' />
                </p>

                <div className='hero-pill'>
                  <div
                    className='pill'
                    style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
                  >
                    <span className='dot live' style={{ background: 'var(--accent)' }} />
                    OPEN TO WORK
                  </div>
                  <span className='loc'>// Rotterdam, NL</span>
                </div>

                <div className='cta-row'>
                  <button onClick={() => nav('skills')} className='cta cta-primary'>
                    [view resume]
                  </button>
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
                        <td className='mv'>Rotterdam, NL · remote</td>
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
          <ContactSection />

          <div style={{ height: '32px' }} />
        </div>
      </div>

      {/* 3. FIXED BOTTOM TAB BAR */}
      <nav className='tabbar'>
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
      </nav>
    </div>
  );
}

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
        <span className='sec-cmd'>
          <span className='prompt'>$ </span>ls -la /projects/
        </span>
      </div>
      <p className='sub-note'>
        5 entries — click filename to expand — click [OPEN] to read case study
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
                  {open === i ? 'v' : hover === i ? '>' : ' '}
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
                  href={p.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='open-btn inline-block'
                >
                  [OPEN] read case study →
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
        <span className='sec-cmd'>
          <span className='prompt'>$ </span>cat about.md
        </span>
      </div>
      <p className='prose'>
        Junior AI Solution Developer based in Rotterdam. I turn fuzzy problems
        into small, sharp systems — retrieval pipelines, tool-calling agents, and
        the unglamorous glue that makes them reliable in production. Low ego,
        fast learner, biased toward shipping.
      </p>

      <div className='resume'>
        <div className='sec-head'>
          <span className='sec-cmd'>
            <span className='prompt'>$ </span>cat resume.txt
          </span>
        </div>

        <div className='rs-divider'>// EXPERIENCE</div>

        <div className='rs-row'>
          <div className='rs-line'>
            <span className='rs-role'>ROLE · AI Solution Developer</span>
            <span className='rs-meta'>COMPANY: WebInform</span>
            <span className='rs-meta rs-dates'>DATES: 2025 — present</span>
          </div>
          <ul className='rs-bullets'>
            <li>
              <span className='li-mark'>-</span> build rag pipelines +
              tool-calling agents for client products
            </li>
            <li>
              <span className='li-mark'>-</span> ship eval harnesses so model
              changes don&apos;t regress silently
            </li>
            <li>
              <span className='li-mark'>-</span> own the python/fastapi backend
              and the thin typescript frontend
            </li>
          </ul>
        </div>

        <div className='rs-row'>
          <div className='rs-line'>
            <span className='rs-role'>ROLE · Freelance Developer</span>
            <span className='rs-meta'>COMPANY: self-employed</span>
            <span className='rs-meta rs-dates'>DATES: 2024 — 2025</span>
          </div>
          <ul className='rs-bullets'>
            <li>
              <span className='li-mark'>-</span> automation scripts, scraping,
              and small llm-powered tools
            </li>
            <li>
              <span className='li-mark'>-</span> first paid llm integration: a
              support-ticket triage bot
            </li>
          </ul>
        </div>

        <div className='rs-divider'>// EDUCATION</div>

        <div className='rs-row'>
          <div className='rs-line'>
            <span className='rs-role'>ROLE · BSc Software Engineering</span>
            <span className='rs-meta'>COMPANY: Rotterdam UAS</span>
            <span className='rs-meta rs-dates'>DATES: 2021 — 2025</span>
          </div>
        </div>

        <div className='rs-divider'>// SKILLS</div>
        <div className='resume-grid'>
          <div className='skill-col'>
            <div className='skill-cap'>// LANGUAGES</div>
            <ul className='skill-list'>
              <li>
                <span className='li-mark'>-</span> python
              </li>
              <li>
                <span className='li-mark'>-</span> typescript
              </li>
              <li>
                <span className='li-mark'>-</span> sql
              </li>
              <li>
                <span className='li-mark'>-</span> bash
              </li>
            </ul>
          </div>
          <div className='skill-col'>
            <div className='skill-cap'>// AI / ML</div>
            <ul className='skill-list'>
              <li>
                <span className='li-mark'>-</span> openai api
              </li>
              <li>
                <span className='li-mark'>-</span> anthropic api
              </li>
              <li>
                <span className='li-mark'>-</span> mcp
              </li>
              <li>
                <span className='li-mark'>-</span> rag / embeddings
              </li>
              <li>
                <span className='li-mark'>-</span> pytorch (basics)
              </li>
            </ul>
          </div>
          <div className='skill-col'>
            <div className='skill-cap'>// BACKEND</div>
            <ul className='skill-list'>
              <li>
                <span className='li-mark'>-</span> fastapi
              </li>
              <li>
                <span className='li-mark'>-</span> postgres
              </li>
              <li>
                <span className='li-mark'>-</span> pgvector
              </li>
              <li>
                <span className='li-mark'>-</span> docker
              </li>
              <li>
                <span className='li-mark'>-</span> redis
              </li>
            </ul>
          </div>
          <div className='skill-col'>
            <div className='skill-cap'>// TOOLING</div>
            <ul className='skill-list'>
              <li>
                <span className='li-mark'>-</span> git
              </li>
              <li>
                <span className='li-mark'>-</span> linux
              </li>
              <li>
                <span className='li-mark'>-</span> github actions
              </li>
              <li>
                <span className='li-mark'>-</span> vercel
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

type ChatMsg = {
  role: 'bot' | 'user';
  text: string;
};

function ContactSection() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      role: 'bot',
      text: "Session ready. Ask me about David's work, projects, or availability."
    }
  ]);
  const [val, setVal] = useState('');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [msgs, typing]);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim().slice(0, 500);
      if (!q || typing) return;

      setMsgs((m) => [...m, { role: 'user', text: q }]);
      setVal('');
      setTyping(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: msgs
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
                  // skip parse failures
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
        <span className='sec-cmd'>
          <span className='prompt'>$ </span>cat contact
        </span>
      </div>
      <div className='ping-line'>
        <span className='prompt'>david@dev:~/contact$ </span>ping
      </div>
      <p className='prose contact-intro'>
        Want to build something AI-native, or hiring a junior who ships? Say
        hello — or ask the assistant below.
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
            <span className='sb-dot' /> assistant: ready
          </span>
          <span className='chat-conv'>conversation: new</span>
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

        <div className='chat-input'>
          <span className='chat-pre'>david@dev:~/assistant$</span>
          <input
            className='chat-field'
            placeholder='start typing here… (500 characters max)'
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
