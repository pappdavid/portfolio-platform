'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Glyph } from '@/components/landing/glyph';
import type { GlyphKind } from '@/components/landing/glyph';

const BENEFITS: { glyph: GlyphKind; h: string; p: string }[] = [
  {
    glyph: 'target',
    h: 'Relevant by design',
    p: 'Answers are sourced only from the systems on this page.'
  },
  {
    glyph: 'link',
    h: 'Jump to what matters',
    p: 'Each answer links to the exact project or section.'
  },
  {
    glyph: 'shield-check',
    h: 'Engineer-first clarity',
    p: 'See the trade-offs, constraints, and outcomes behind each system.'
  }
];

const EXAMPLE_QS = [
  'What is MCP Sentinel and why did you build it?',
  'What stacks do you prefer for RAG?',
  'How do you implement guardrails for LLM tools?',
  'What roles are you open to?'
];

type AssistantResult = {
  answer: string;
  links: Array<{ label: string; url: string }>;
};

const EMPTY_RESULT: AssistantResult = {
  answer:
    'Ask about David’s systems, stack, guardrails, or role fit and the assistant will answer from the portfolio dossier.',
  links: [{ label: 'Proof of work', url: '/#proof' }]
};

export function AssistantSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [question, setQuestion] = useState(EXAMPLE_QS[0]);
  const [result, setResult] = useState<AssistantResult>(EMPTY_RESULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          ref.current?.classList.add('is-visible');
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  async function ask(nextQuestion: string) {
    const trimmed = nextQuestion.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed })
      });
      const data = (await response.json()) as Partial<AssistantResult> & {
        error?: string;
      };

      if (data.error) {
        setError(data.error ?? 'Assistant unavailable');
        return;
      }

      if (!response.ok || !data.answer || !Array.isArray(data.links)) {
        setError('Assistant unavailable');
        return;
      }

      setResult({ answer: data.answer, links: data.links });
    } catch {
      setError('Assistant unavailable');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }

  function handleExample(nextQuestion: string) {
    setQuestion(nextQuestion);
    inputRef.current?.focus();
    void ask(nextQuestion);
  }

  return (
    <section
      id='assistant'
      className='py-32'
      style={{ background: 'var(--bg-1)' }}
    >
      <div ref={ref} className='dp-wrap dp-animate'>
        <div className='grid grid-cols-1 items-start gap-20 lg:grid-cols-2'>
          {/* Left */}
          <div>
            <div className='dp-eyebrow'>{'// 05 PORTFOLIO ASSISTANT'}</div>
            <h2
              className='t-h2'
              style={{ color: 'var(--ink-0)', marginBottom: 24 }}
            >
              The assistant
              <br />
              helps you{' '}
              <span style={{ color: 'var(--accent-bright)' }}>
                navigate
                <br />
                the portfolio faster.
              </span>
            </h2>
            <p
              style={{
                fontSize: 16,
                color: 'var(--ink-1)',
                lineHeight: 1.6,
                marginBottom: 32,
                maxWidth: 420
              }}
            >
              Portfolio-local. Grounded in the projects on this page. Ask a
              question and get a concise answer.
            </p>
            <div className='flex flex-col gap-5'>
              {BENEFITS.map(({ glyph, h, p }) => (
                <div key={h} className='flex items-start gap-4'>
                  <div className='mt-0.5 flex-shrink-0'>
                    <Glyph kind={glyph} size={18} color='var(--accent)' />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: 'var(--ink-0)',
                        marginBottom: 4
                      }}
                    >
                      {h}
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: 'var(--ink-2)',
                        margin: 0,
                        lineHeight: 1.5
                      }}
                    >
                      {p}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — live assistant panel */}
          <div
            className='cornermark flex flex-col gap-4 rounded-2xl p-6'
            style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <span className='cm-tl' />
            <span className='cm-tr' />
            <span className='cm-bl' />
            <span className='cm-br' />
            <div
              className='flex items-center gap-3 pb-4'
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--accent-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-dp-mono)',
                  fontSize: 11,
                  color: 'var(--accent-bright)'
                }}
              >
                {'>'}_
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: 'var(--ink-0)'
                  }}
                >
                  Assistant
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-dp-mono)',
                    fontSize: 10,
                    color: 'var(--ink-3)'
                  }}
                >
                  Portfolio-local
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dp-mono)',
                fontSize: 10,
                color: 'var(--ink-3)',
                letterSpacing: '0.08em'
              }}
            >
              EXAMPLE QUERIES
            </div>
            <div className='flex flex-col gap-1'>
              {EXAMPLE_QS.map((q) => (
                <button
                  key={q}
                  type='button'
                  onClick={() => handleExample(q)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    fontSize: 13,
                    color: 'var(--ink-1)',
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 0',
                    border: 0,
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: loading ? 'wait' : 'pointer',
                    opacity: loading ? 0.65 : 1
                  }}
                >
                  <span>{q}</span>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>
                    →
                  </span>
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
              <input
                ref={inputRef}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                aria-label='Portfolio assistant question'
                disabled={loading}
                style={{
                  width: '100%',
                  minHeight: 42,
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-1)',
                  color: 'var(--ink-0)',
                  fontSize: 13,
                  padding: '0 12px',
                  outline: 'none',
                  opacity: loading ? 0.7 : 1
                }}
              />
              <button
                type='submit'
                className='dp-btn dp-btn-primary'
                disabled={loading || !question.trim()}
                style={{
                  justifyContent: 'center',
                  opacity: loading || !question.trim() ? 0.65 : 1,
                  cursor: loading ? 'wait' : 'pointer'
                }}
              >
                {loading ? 'Answering…' : 'Ask assistant'}
              </button>
            </form>
            <div
              style={{
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-1)',
                borderRadius: 12,
                padding: 16
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: 'var(--ink-1)'
                }}
              >
                {error ?? result.answer}
              </p>
              {!error && result.links.length > 0 && (
                <div className='mt-4 flex flex-wrap gap-2'>
                  {result.links.map((item) => (
                    <a
                      key={item.url}
                      href={item.url}
                      className='rounded-full px-3 py-1'
                      style={{
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--accent-bright)',
                        fontFamily: 'var(--font-dp-mono)',
                        fontSize: 10,
                        textDecoration: 'none'
                      }}
                    >
                      {item.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
