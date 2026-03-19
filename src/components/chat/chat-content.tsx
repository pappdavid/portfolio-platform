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
  {
    role: 'user',
    content: 'What authentication pattern does this project use?'
  },
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
        <h1 className='mb-4 bg-gradient-to-br from-white to-white/50 bg-clip-text text-5xl leading-[1.07] font-extrabold tracking-[-0.04em] text-transparent'>
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
                  aria-label='Upload files'
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
                        <IconFile className='h-3 w-3' aria-hidden='true' />
                        {f.name}
                        <button
                          onClick={() =>
                            setFiles((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                          className='ml-1 hover:text-white'
                          aria-label={`Remove ${f.name}`}
                        >
                          <IconX className='h-3 w-3' aria-hidden='true' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div
                className='max-h-[480px] min-h-[320px] flex-1 space-y-4 overflow-y-auto rounded-xl border border-white/[0.07] bg-white/[0.03] p-4'
                aria-live='polite'
                aria-label='Chat messages'
              >
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
                          ? 'border border-[#22c55e]/20 bg-[#22c55e]/20 text-white'
                          : 'border border-white/[0.07] bg-white/[0.06] text-[#d1d5db]'
                      )}
                    >
                      <p className='whitespace-pre-wrap'>{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isStreaming &&
                  messages[messages.length - 1]?.content === '' && (
                    <div className='flex justify-start'>
                      <div className='rounded-lg border border-white/[0.07] bg-white/[0.06] px-4 py-3'>
                        <IconLoader2
                          className='h-4 w-4 animate-spin text-[#71717a]'
                          aria-label='Generating response'
                        />
                      </div>
                    </div>
                  )}
                {error && (
                  <p className='text-center text-xs text-red-400' role='alert'>
                    {error}
                  </p>
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
                  aria-label='Send message'
                >
                  {isStreaming ? (
                    <IconLoader2
                      className='h-4 w-4 animate-spin'
                      aria-hidden='true'
                    />
                  ) : (
                    <IconSend className='h-4 w-4' aria-hidden='true' />
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
              <div className='flex min-h-[300px] flex-1 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]'>
                <div className='text-center'>
                  <svg
                    viewBox='0 0 64 64'
                    className='mx-auto mb-3 h-16 w-16 opacity-20'
                    fill='none'
                    aria-hidden='true'
                  >
                    <polygon
                      points='32,4 60,18 60,46 32,60 4,46 4,18'
                      stroke='#f97316'
                      strokeWidth='2'
                    />
                    <line
                      x1='32'
                      y1='4'
                      x2='32'
                      y2='32'
                      stroke='#f97316'
                      strokeWidth='1'
                      opacity='0.5'
                    />
                    <line
                      x1='4'
                      y1='18'
                      x2='32'
                      y2='32'
                      stroke='#f97316'
                      strokeWidth='1'
                      opacity='0.5'
                    />
                    <line
                      x1='60'
                      y1='18'
                      x2='32'
                      y2='32'
                      stroke='#f97316'
                      strokeWidth='1'
                      opacity='0.5'
                    />
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
        <h2 className='mb-8 text-2xl font-bold tracking-[-0.02em]'>
          Architecture
        </h2>
        <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
          <MermaidDiagram chart={architectureChart} />
        </div>
      </section>
    </div>
  );
}
