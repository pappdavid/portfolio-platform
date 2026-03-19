'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const EXAMPLE_PROMPTS = [
  'What is MCP Sentinel and why did you build it?',
  'What stacks do you prefer for RAG?',
  'How do you implement guardrails for LLM tools?',
  'What roles are you open to?'
];

type AMAResult = {
  answer: string;
  links: Array<{ label: string; url: string }>;
};

export function AMASection() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<AMAResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ask = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/ama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
      } else {
        setResult(data as AMAResult);
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(question);
  };

  const handleExample = (prompt: string) => {
    setQuestion(prompt);
    ask(prompt);
    inputRef.current?.focus();
  };

  return (
    <section className='relative z-10 border-t border-white/[0.07] bg-white/[0.015]'>
      <div className='mx-auto max-w-3xl px-6 py-20'>
        {/* Header */}
        <p className='mb-2 font-mono text-xs tracking-widest text-[#71717a] uppercase'>
          Portfolio Assistant
        </p>
        <h2 className='mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl'>
          Ask me anything about my work
        </h2>
        <p className='mb-8 text-[#71717a]'>
          Ask about my projects, experience, or stack — answers come from my
          portfolio content.
        </p>

        {/* Example prompts */}
        <div className='mb-6 flex flex-wrap gap-2'>
          {EXAMPLE_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handleExample(p)}
              className='rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs text-[#a1a1aa] transition-colors hover:border-white/[0.2] hover:text-white'
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className='flex gap-3'>
          <input
            ref={inputRef}
            type='text'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='Ask about my projects, stack, or experience…'
            disabled={loading}
            className='flex-1 rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-[#52525b] transition outline-none focus:border-white/[0.25] focus:bg-white/[0.06] disabled:opacity-50'
          />
          <Button
            type='submit'
            disabled={loading || !question.trim()}
            size='lg'
          >
            {loading ? 'Thinking…' : 'Ask'}
          </Button>
        </form>

        {/* Error */}
        {error && <p className='mt-4 text-sm text-red-400'>{error}</p>}

        {/* Answer */}
        {result && (
          <div className='mt-6 rounded-xl border border-white/[0.08] bg-white/[0.03] p-6'>
            <p className='text-sm leading-relaxed text-[#d4d4d8]'>
              {result.answer}
            </p>
            {result.links.length > 0 && (
              <div className='mt-4 flex flex-wrap gap-2'>
                {result.links.map((link) => (
                  <Link
                    key={link.url}
                    href={link.url}
                    className='inline-flex items-center gap-1 rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-1 text-xs text-[#a1a1aa] transition-colors hover:border-white/[0.2] hover:text-white'
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer badge */}
        <p className='mt-6 text-xs text-[#52525b]'>
          Powered by portfolio-local RAG · Not a general-purpose AI
        </p>
      </div>
    </section>
  );
}
