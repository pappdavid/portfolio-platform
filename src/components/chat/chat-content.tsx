'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GridBackground } from '@/components/ui/grid-background';
import { MonoEyebrow } from '@/components/ui/mono-eyebrow';
import {
  IconUpload,
  IconSend,
  IconFile,
  IconX,
  IconLoader2,
  IconBrandGithub,
  IconCheck,
  IconCode
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export type CodeChunk = {
  id: string;
  filename: string;
  summary: string;
  tokens: number;
};

export type UploadedFile = {
  id: string;
  file: File;
  name: string;
  size: number;
  include: boolean;
  status: 'processing' | 'ready';
};

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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ChatArchSvg() {
  return (
    <svg
      viewBox='0 0 780 130'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='w-full'
      aria-label='Chat RAG architecture: upload and embed documents into vector store; user query retrieved, reranked, sent to LLM, response optionally rendered in Three.js'
    >
      {/* Ingestion row */}
      <rect
        x='0'
        y='5'
        width='100'
        height='36'
        rx='7'
        fill='rgba(249,115,22,0.06)'
        stroke='rgba(249,115,22,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='50'
        y='27'
        textAnchor='middle'
        fill='#f97316'
        fontSize='10'
        fontFamily='monospace'
      >
        Upload
      </text>
      <path
        d='M102 23 L112 23'
        stroke='rgba(249,115,22,0.5)'
        strokeWidth='1.5'
      />
      <polygon points='112,19.5 116,23 112,26.5' fill='rgba(249,115,22,0.7)' />
      <rect
        x='118'
        y='5'
        width='100'
        height='36'
        rx='7'
        fill='rgba(249,115,22,0.06)'
        stroke='rgba(249,115,22,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='168'
        y='27'
        textAnchor='middle'
        fill='#f97316'
        fontSize='10'
        fontFamily='monospace'
      >
        Chunker
      </text>
      <path
        d='M220 23 L230 23'
        stroke='rgba(249,115,22,0.5)'
        strokeWidth='1.5'
      />
      <polygon points='230,19.5 234,23 230,26.5' fill='rgba(249,115,22,0.7)' />
      <rect
        x='236'
        y='5'
        width='100'
        height='36'
        rx='7'
        fill='rgba(249,115,22,0.06)'
        stroke='rgba(249,115,22,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='286'
        y='27'
        textAnchor='middle'
        fill='#f97316'
        fontSize='10'
        fontFamily='monospace'
      >
        Embeddings
      </text>
      <path
        d='M338 23 L348 23'
        stroke='rgba(249,115,22,0.5)'
        strokeWidth='1.5'
      />
      <polygon points='348,19.5 352,23 348,26.5' fill='rgba(249,115,22,0.7)' />
      <rect
        x='354'
        y='5'
        width='100'
        height='36'
        rx='7'
        fill='rgba(6,182,212,0.06)'
        stroke='rgba(6,182,212,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='404'
        y='27'
        textAnchor='middle'
        fill='#06b6d4'
        fontSize='10'
        fontFamily='monospace'
      >
        Vector Store
      </text>
      {/* Query row */}
      <rect
        x='0'
        y='89'
        width='100'
        height='36'
        rx='7'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.09)'
        strokeWidth='1'
      />
      <text
        x='50'
        y='111'
        textAnchor='middle'
        fill='#a1a1aa'
        fontSize='10'
        fontFamily='monospace'
      >
        User Query
      </text>
      <path
        d='M102 107 L112 107'
        stroke='rgba(168,85,247,0.5)'
        strokeWidth='1.5'
      />
      <polygon
        points='112,103.5 116,107 112,110.5'
        fill='rgba(168,85,247,0.7)'
      />
      <rect
        x='118'
        y='89'
        width='100'
        height='36'
        rx='7'
        fill='rgba(249,115,22,0.06)'
        stroke='rgba(249,115,22,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='168'
        y='111'
        textAnchor='middle'
        fill='#f97316'
        fontSize='10'
        fontFamily='monospace'
      >
        Retriever
      </text>
      <path
        d='M220 107 L230 107'
        stroke='rgba(168,85,247,0.5)'
        strokeWidth='1.5'
      />
      <polygon
        points='230,103.5 234,107 230,110.5'
        fill='rgba(168,85,247,0.7)'
      />
      <rect
        x='236'
        y='89'
        width='110'
        height='36'
        rx='7'
        fill='rgba(168,85,247,0.06)'
        stroke='rgba(168,85,247,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='291'
        y='111'
        textAnchor='middle'
        fill='#a855f7'
        fontSize='10'
        fontFamily='monospace'
      >
        LLM + Context
      </text>
      <path
        d='M348 107 L358 107'
        stroke='rgba(168,85,247,0.5)'
        strokeWidth='1.5'
      />
      <polygon
        points='358,103.5 362,107 358,110.5'
        fill='rgba(168,85,247,0.7)'
      />
      <rect
        x='364'
        y='89'
        width='100'
        height='36'
        rx='7'
        fill='rgba(168,85,247,0.06)'
        stroke='rgba(168,85,247,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='414'
        y='111'
        textAnchor='middle'
        fill='#a855f7'
        fontSize='10'
        fontFamily='monospace'
      >
        Response
      </text>
      <path
        d='M466 107 L476 107'
        stroke='rgba(249,115,22,0.5)'
        strokeWidth='1.5'
        strokeDasharray='3 2'
      />
      <polygon
        points='476,103.5 480,107 476,110.5'
        fill='rgba(249,115,22,0.7)'
      />
      <rect
        x='482'
        y='89'
        width='130'
        height='36'
        rx='7'
        fill='rgba(249,115,22,0.06)'
        stroke='rgba(249,115,22,0.2)'
        strokeWidth='1.5'
      />
      <text
        x='547'
        y='104'
        textAnchor='middle'
        fill='#f97316'
        fontSize='10'
        fontFamily='monospace'
      >
        Three.js
      </text>
      <text
        x='547'
        y='118'
        textAnchor='middle'
        fill='#52525b'
        fontSize='8'
        fontFamily='monospace'
      >
        (if spatial data)
      </text>
      {/* Vector store feeds retriever */}
      <path
        d='M404 41 L404 65 L168 65 L168 89'
        stroke='rgba(6,182,212,0.3)'
        strokeWidth='1.5'
        strokeDasharray='4 3'
      />
    </svg>
  );
}

export function ChatContent() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Repo URL state
  const [repoUrl, setRepoUrl] = useState('');
  const [cloning, setCloning] = useState(false);
  const [cloneStatus, setCloneStatus] = useState<string | null>(null);
  const [codeChunks, setCodeChunks] = useState<CodeChunk[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );

  useEffect(() => {
    return () => {
      readerRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCloneRepo = useCallback(() => {
    const url = repoUrl.trim();
    if (!url || cloning) return;
    setCloning(true);
    setCloneStatus('Cloning repo…');
    setCodeChunks([]);

    setTimeout(() => {
      const repoName = url.split('/').slice(-1)[0] ?? 'repo';
      setCodeChunks([
        {
          id: '1',
          filename: `src/agent/pipeline.ts`,
          summary: 'Main agent execution pipeline with guard middleware',
          tokens: 512
        },
        {
          id: '2',
          filename: `src/guards/injection.ts`,
          summary: 'Prompt injection detection and sanitization',
          tokens: 348
        },
        {
          id: '3',
          filename: `${repoName}/README.md`,
          summary: 'Repository overview and setup instructions',
          tokens: 224
        }
      ]);
      setCloning(false);
      setCloneStatus('Repo loaded into context');
    }, 1500);
  }, [repoUrl, cloning]);

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
      const includedFiles = uploadedFiles
        .filter((f) => f.include && f.status === 'ready')
        .map((f) => f.name)
        .join(', ');

      const codeContext =
        codeChunks.length > 0
          ? `Code context from repo:\n${codeChunks.map((c) => `${c.filename}: ${c.summary}`).join('\n')}`
          : undefined;

      const fileContext = includedFiles
        ? `Uploaded files in context: ${includedFiles}`
        : undefined;

      const context =
        [codeContext, fileContext].filter(Boolean).join('\n\n') || undefined;

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

      if (res.status === 403) {
        const data = await res.json();
        const msg =
          data.code === 'DEMO_EXPIRED'
            ? 'Demo expired — contact David for full access.'
            : 'Demo quota exhausted — contact David for full access.';
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: msg };
          return updated;
        });
        return;
      }

      if (!res.ok || !res.body) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      readerRef.current = reader;
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
      readerRef.current = null;
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, uploadedFiles, codeChunks]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const newFiles: UploadedFile[] = Array.from(selected).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      include: true,
      status: 'processing' as const
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate processing
    newFiles.forEach((uf) => {
      setTimeout(
        () => {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === uf.id ? { ...f, status: 'ready' } : f))
          );
        },
        800 + Math.random() * 700
      );
    });

    e.target.value = '';
  };

  const toggleFileInclude = (id: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, include: !f.include } : f))
    );
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className='relative' style={{ color: 'var(--ink-0)' }}>
      <GridBackground />

      {/* Hero */}
      <section className='relative z-10 mx-auto max-w-4xl px-6 py-20'>
        <MonoEyebrow color='orange' className='mb-6'>
          Retrieval-Augmented Generation
        </MonoEyebrow>
        <h1
          className='mb-4 text-5xl leading-[1.07] font-extrabold tracking-[-0.04em]'
          style={{ color: 'var(--ink-0)', fontFamily: 'var(--font-dp-sans)' }}
        >
          RAG + 3D Chat
        </h1>
        <p
          className='max-w-2xl text-base leading-relaxed'
          style={{ color: 'var(--ink-2)' }}
        >
          Upload documents, ask questions, get answers grounded in your data.
          When responses include spatial data, they render in an interactive 3D
          viewer.
        </p>
      </section>

      {/* Chat Interface */}
      <section
        className='relative z-10 border-y py-12'
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'var(--bg-1)'
        }}
      >
        <div className='mx-auto max-w-6xl px-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Chat panel */}
            <div className='flex flex-col gap-4 lg:col-span-2'>
              {/* Repo URL Input */}
              <div className='flex gap-2'>
                <div className='relative flex-1'>
                  <IconBrandGithub
                    className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2'
                    style={{ color: 'var(--ink-3)' }}
                  />
                  <Input
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder='Paste a GitHub/GitLab repo URL…'
                    className='pl-9 focus-visible:ring-[#22c55e]/30'
                    style={{
                      background: 'var(--bg-2)',
                      color: 'var(--ink-0)',
                      borderColor: 'var(--border-muted)'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCloneRepo();
                    }}
                    disabled={cloning}
                  />
                </div>
                <Button
                  onClick={handleCloneRepo}
                  disabled={!repoUrl.trim() || cloning}
                  variant='outline'
                  size='sm'
                  className='shrink-0'
                  style={{
                    background: 'var(--bg-2)',
                    color: 'var(--ink-0)',
                    borderColor: 'var(--border-muted)'
                  }}
                >
                  {cloning ? (
                    <IconLoader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    'Load'
                  )}
                </Button>
              </div>

              {/* Clone status & code chunks */}
              {cloneStatus && (
                <div
                  className='rounded-lg p-3'
                  style={{
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-2)'
                  }}
                >
                  <div
                    className='mb-2 flex items-center gap-2 text-xs'
                    style={{
                      fontFamily: 'var(--font-dp-mono)',
                      color: 'var(--accent-bright)'
                    }}
                  >
                    {cloning ? (
                      <IconLoader2 className='h-3 w-3 animate-spin' />
                    ) : (
                      <IconCheck className='h-3 w-3' />
                    )}
                    {cloneStatus}
                  </div>
                  {codeChunks.length > 0 && (
                    <div className='flex flex-wrap gap-1.5'>
                      {codeChunks.map((chunk) => (
                        <Badge
                          key={chunk.id}
                          variant='outline'
                          className='gap-1 text-xs'
                          style={{
                            borderColor: 'var(--accent-line)',
                            background: 'var(--accent-soft)',
                            color: 'var(--accent-bright)'
                          }}
                        >
                          <IconCode className='h-3 w-3' />
                          {chunk.filename}
                          <span style={{ opacity: 0.6 }}>{chunk.tokens}t</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* File Upload */}
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
                  className='flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-sm transition-colors'
                  style={{
                    borderColor: 'var(--border-muted)',
                    color: 'var(--ink-2)'
                  }}
                >
                  <IconUpload className='h-4 w-4' />
                  Drop PDFs, text, or markdown here
                </button>

                {uploadedFiles.length > 0 && (
                  <div className='mt-2 flex flex-col gap-1.5'>
                    {uploadedFiles.map((f) => (
                      <div
                        key={f.id}
                        className='flex items-center gap-2 rounded-md px-3 py-2 text-xs'
                        style={{
                          border: '1px solid var(--border-subtle)',
                          background: 'var(--bg-2)'
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={f.include}
                          onChange={() => toggleFileInclude(f.id)}
                          className='accent-[#22c55e]'
                          aria-label={`Include ${f.name}`}
                        />
                        <IconFile
                          className='h-3.5 w-3.5 shrink-0'
                          style={{ color: 'var(--ink-3)' }}
                        />
                        <span
                          className='flex-1 truncate'
                          style={{ color: 'var(--ink-1)' }}
                        >
                          {f.name}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-dp-mono)',
                            color: 'var(--ink-3)'
                          }}
                        >
                          {formatBytes(f.size)}
                        </span>
                        <Badge
                          variant='outline'
                          className={cn(
                            'px-1.5 py-0 text-[10px]',
                            f.status === 'processing'
                              ? 'border-yellow-500/30 text-yellow-400'
                              : 'border-[#22c55e]/30 text-[#22c55e]'
                          )}
                        >
                          {f.status}
                        </Badge>
                        <button
                          onClick={() => removeFile(f.id)}
                          style={{ color: 'var(--ink-3)' }}
                          aria-label={`Remove ${f.name}`}
                        >
                          <IconX className='h-3.5 w-3.5' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div
                className='max-h-[480px] min-h-[320px] flex-1 space-y-4 overflow-y-auto rounded-xl p-4'
                style={{
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-2)'
                }}
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
                      className='max-w-[80%] rounded-lg px-4 py-3 text-sm'
                      style={
                        msg.role === 'user'
                          ? {
                              background: 'var(--accent-soft)',
                              border: '1px solid var(--accent-line)',
                              color: 'var(--ink-0)'
                            }
                          : {
                              background: 'var(--bg-3)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--ink-1)'
                            }
                      }
                    >
                      <p className='whitespace-pre-wrap'>{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isStreaming &&
                  messages[messages.length - 1]?.content === '' && (
                    <div className='flex justify-start'>
                      <div
                        className='rounded-lg px-4 py-3'
                        style={{
                          border: '1px solid var(--border-subtle)',
                          background: 'var(--bg-3)'
                        }}
                      >
                        <IconLoader2
                          className='h-4 w-4 animate-spin'
                          style={{ color: 'var(--ink-3)' }}
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
                  className='min-h-[44px] resize-none focus-visible:ring-[#22c55e]/30'
                  style={{
                    background: 'var(--bg-2)',
                    color: 'var(--ink-0)',
                    borderColor: 'var(--border-muted)'
                  }}
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
                  className='shrink-0 disabled:opacity-40'
                  style={{ background: 'var(--accent)', color: 'var(--bg-0)' }}
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

              <p
                style={{
                  fontFamily: 'var(--font-dp-mono)',
                  fontSize: 11,
                  color: 'var(--ink-3)'
                }}
              >
                Rate limited: 2 messages/hour (guest) · 50/hour (signed in)
              </p>
            </div>

            {/* 3D Viewer */}
            <div className='flex flex-col'>
              <h3
                className='mb-2 text-sm font-medium'
                style={{ color: 'var(--ink-0)' }}
              >
                3D Viewer
              </h3>
              <div
                className='flex min-h-[300px] flex-1 items-center justify-center rounded-xl'
                style={{
                  background: 'var(--bg-1)',
                  border: '1px solid var(--accent-line)'
                }}
              >
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
                  <p
                    style={{
                      fontFamily: 'var(--font-dp-mono)',
                      fontSize: 11,
                      color: 'var(--ink-3)'
                    }}
                  >
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
        <h2
          className='mb-8 text-2xl font-bold tracking-[-0.02em]'
          style={{ color: 'var(--ink-0)', fontFamily: 'var(--font-dp-sans)' }}
        >
          Architecture
        </h2>
        <div
          className='overflow-x-auto rounded-xl p-6'
          style={{
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-2)'
          }}
        >
          <ChatArchSvg />
        </div>
      </section>
    </div>
  );
}
