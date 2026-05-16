'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  content?: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: 'user',
    content: 'What auth pattern does this project use?'
  },
  {
    role: 'assistant',
    content:
      'This project uses **Clerk**. The middleware is configured in `proxy.ts` (Next.js 16 pattern), protecting `/dashboard(.*)` via `clerkMiddleware`.\n\nsrc/proxy.ts:12  ·  providers.tsx:8'
  }
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Hero icon — orbit/atom (reference modules/chat.html line 25)
function OrbitIcon() {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    >
      <ellipse cx='12' cy='12' rx='9' ry='4' />
      <ellipse cx='12' cy='12' rx='9' ry='4' transform='rotate(60 12 12)' />
      <circle cx='12' cy='12' r='2' fill='currentColor' />
    </svg>
  );
}

// Two-row architecture SVG, matches reference modules/chat.html
function ArchitectureSvg() {
  return (
    <svg
      viewBox='0 0 980 200'
      width='100%'
      height='200'
      role='img'
      aria-label='RAG architecture: ingestion pipeline (upload, chunker, embeddings into pgvector store) and query pipeline (user query, top-k, rerank, LLM, streaming, optional 3D renderer)'
    >
      {/* Ingestion lane */}
      <text
        x='0'
        y='20'
        fill='#a8a39a'
        fontFamily='JetBrains Mono'
        fontSize='11'
      >
        INGESTION →
      </text>
      {[
        { x: 0, label: 'Upload' },
        { x: 140, label: 'Chunker' },
        { x: 280, label: 'Embeddings' }
      ].map((node) => (
        <g key={node.label}>
          <rect
            x={node.x}
            y='34'
            width='120'
            height='36'
            rx='6'
            fill='rgba(34,197,94,0.06)'
            stroke='rgba(34,197,94,0.25)'
          />
          <text
            x={node.x + 60}
            y='56'
            textAnchor='middle'
            fill='#22c55e'
            fontFamily='JetBrains Mono'
            fontSize='11'
          >
            {node.label}
          </text>
        </g>
      ))}
      <rect
        x='420'
        y='34'
        width='160'
        height='36'
        rx='6'
        fill='rgba(255,255,255,0.04)'
        stroke='rgba(255,255,255,0.12)'
      />
      <text
        x='500'
        y='56'
        textAnchor='middle'
        fill='#a8a39a'
        fontFamily='JetBrains Mono'
        fontSize='11'
      >
        pgvector store
      </text>

      {/* Query lane */}
      <text
        x='0'
        y='110'
        fill='#a8a39a'
        fontFamily='JetBrains Mono'
        fontSize='11'
      >
        QUERY →
      </text>
      {[
        { x: 0, label: 'User query', highlight: false },
        { x: 140, label: 'Top-k', highlight: false },
        { x: 280, label: 'Rerank (bge)', highlight: false },
        { x: 420, label: 'LLM', highlight: false },
        { x: 560, label: 'Streaming', highlight: true }
      ].map((node) => (
        <g key={node.label}>
          <rect
            x={node.x}
            y='124'
            width='120'
            height='36'
            rx='6'
            fill={
              node.highlight ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.04)'
            }
            stroke={
              node.highlight ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.12)'
            }
          />
          <text
            x={node.x + 60}
            y='146'
            textAnchor='middle'
            fill={node.highlight ? '#22c55e' : '#a8a39a'}
            fontFamily='JetBrains Mono'
            fontSize='11'
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* 3D Renderer block */}
      <rect
        x='700'
        y='104'
        width='160'
        height='76'
        rx='10'
        fill='rgba(34,197,94,0.05)'
        stroke='rgba(34,197,94,0.3)'
      />
      <text
        x='780'
        y='138'
        textAnchor='middle'
        fill='#22c55e'
        fontFamily='JetBrains Mono'
        fontSize='11'
      >
        3D Renderer
      </text>
      <text
        x='780'
        y='156'
        textAnchor='middle'
        fill='#a8a39a'
        fontFamily='JetBrains Mono'
        fontSize='9.5'
      >
        Three.js · deterministic
      </text>
    </svg>
  );
}

function DodecahedronPreview() {
  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        aspectRatio: '16/10',
        background:
          'radial-gradient(ellipse at 50% 60%, rgba(34,197,94,0.10), transparent 60%), var(--bg-1)',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden'
      }}
    >
      <svg viewBox='0 0 200 120' width='60%' aria-hidden='true'>
        <polygon
          points='100,16 156,46 156,90 100,120 44,90 44,46'
          fill='rgba(34,197,94,0.08)'
          stroke='#22c55e'
          strokeWidth='1.5'
        />
        <line
          x1='100'
          y1='16'
          x2='100'
          y2='68'
          stroke='#22c55e'
          strokeWidth='1'
          opacity='0.5'
        />
        <line
          x1='44'
          y1='46'
          x2='100'
          y2='68'
          stroke='#22c55e'
          strokeWidth='1'
          opacity='0.5'
        />
        <line
          x1='156'
          y1='46'
          x2='100'
          y2='68'
          stroke='#22c55e'
          strokeWidth='1'
          opacity='0.5'
        />
        <circle cx='100' cy='68' r='3' fill='#22c55e' />
      </svg>
      <span
        style={{
          position: 'absolute',
          bottom: 12,
          left: 14,
          fontFamily: 'var(--font-dp-mono), monospace',
          fontSize: 11,
          letterSpacing: '0.08em',
          color: 'var(--accent)'
        }}
      >
        RENDERED · 3D PAYLOAD v0.3
      </span>
    </div>
  );
}

export function ChatContent() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          filename: 'src/agent/pipeline.ts',
          summary: 'Main agent execution pipeline with guard middleware',
          tokens: 512
        },
        {
          id: '2',
          filename: 'src/guards/injection.ts',
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
      const includedFileContent = uploadedFiles
        .filter((f) => f.include && f.status === 'ready' && f.content)
        .map((f) => `### ${f.name}\n${f.content}`)
        .join('\n\n');

      const codeContext =
        codeChunks.length > 0
          ? `Code context from repo:\n${codeChunks.map((c) => `${c.filename}: ${c.summary}`).join('\n')}`
          : undefined;

      const fileContext = includedFileContent
        ? `Uploaded file contents:\n\n${includedFileContent}`
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

    newFiles.forEach((uf) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content =
          typeof event.target?.result === 'string'
            ? event.target.result.slice(0, 8000)
            : undefined;
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === uf.id ? { ...f, status: 'ready', content } : f
          )
        );
      };
      reader.onerror = () => {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === uf.id ? { ...f, status: 'ready' } : f))
        );
      };
      reader.readAsText(uf.file);
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
    <div style={{ background: 'var(--bg-0)' }}>
      <main className='mod-wrap' style={{ paddingBottom: 0 }}>
        {/* Hero */}
        <section style={{ padding: '80px 0 64px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 24
            }}
          >
            <div className='mod-icon'>
              <OrbitIcon />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className='mod-eyebrow'>
                <span className='mod-dot' />
                <span className='mod-dash' />
                <span>MODULE 03 / RETRIEVAL</span>
              </span>
              <h1
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-dp-sans), Inter Tight, sans-serif',
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.96,
                  color: 'var(--ink-0)'
                }}
              >
                RAG + 3D Chat
              </h1>
            </div>
          </div>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--ink-2)',
              maxWidth: 720,
              margin: 0
            }}
          >
            Chat with your docs. When the answer is a structure, render it
            inline in Three.js with citations pointing back to source chunks.
            Top-k → rerank → cite, kept stupid-simple.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 28,
              flexWrap: 'wrap'
            }}
          >
            <span className='mod-status'>
              <span className='mod-status-dot' />
              pgvector + bge-reranker
            </span>
            <span className='mod-status'>
              <span className='mod-status-dot' />
              Streaming SSE
            </span>
            <span className='mod-status'>
              <span className='mod-status-dot' />
              3D outputs deterministic from trace
            </span>
          </div>
        </section>

        {/* // 01 Architecture */}
        <section style={{ paddingBottom: 80 }}>
          <div className='mod-section-meta'>
            <span className='mod-section-num'>// 01</span>
            <span className='mod-section-line' />
            <span className='mod-section-label'>Architecture</span>
          </div>
          <div className='mod-card' style={{ padding: 24 }}>
            <ArchitectureSvg />
          </div>
        </section>

        {/* // 02 Try it — interactive chat, preserved */}
        <section style={{ paddingBottom: 80 }}>
          <div className='mod-section-meta'>
            <span className='mod-section-num'>// 02</span>
            <span className='mod-section-line' />
            <span className='mod-section-label'>Try it</span>
          </div>

          {/* Repo + upload toolbar */}
          <div
            style={{
              display: 'grid',
              gap: 12,
              gridTemplateColumns: '1fr',
              marginBottom: 16
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <IconBrandGithub
                  className='h-4 w-4'
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 12,
                    transform: 'translateY(-50%)',
                    color: 'var(--ink-3)'
                  }}
                />
                <input
                  type='url'
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCloneRepo();
                  }}
                  placeholder='Paste a GitHub/GitLab repo URL…'
                  disabled={cloning}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: 8,
                    fontFamily: 'var(--font-dp-mono), monospace',
                    fontSize: 13,
                    color: 'var(--ink-0)',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border-muted)',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                type='button'
                onClick={handleCloneRepo}
                disabled={!repoUrl.trim() || cloning}
                className='dp-btn dp-btn-ghost'
                style={{
                  padding: '8px 16px',
                  fontSize: 13,
                  opacity: !repoUrl.trim() || cloning ? 0.5 : 1,
                  cursor: !repoUrl.trim() || cloning ? 'not-allowed' : 'pointer'
                }}
              >
                {cloning ? (
                  <IconLoader2 className='h-4 w-4 animate-spin' />
                ) : (
                  'Load'
                )}
              </button>
            </div>

            {cloneStatus && (
              <div
                className='mod-card'
                style={{ padding: 12, background: 'var(--bg-2)' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: 'var(--font-dp-mono), monospace',
                    fontSize: 11,
                    color: 'var(--accent-bright)',
                    marginBottom: codeChunks.length > 0 ? 10 : 0
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
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6
                    }}
                  >
                    {codeChunks.map((chunk) => (
                      <span
                        key={chunk.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 999,
                          background: 'var(--accent-soft)',
                          border: '1px solid var(--accent-line)',
                          fontFamily: 'var(--font-dp-mono), monospace',
                          fontSize: 11,
                          color: 'var(--accent-bright)'
                        }}
                      >
                        <IconCode className='h-3 w-3' />
                        {chunk.filename}
                        <span style={{ opacity: 0.6 }}>{chunk.tokens}t</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='.pdf,.txt,.md,.csv'
                onChange={handleFileChange}
                style={{ display: 'none' }}
                aria-label='Upload files'
              />
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: 14,
                  borderRadius: 10,
                  border: '1px dashed var(--border-muted)',
                  background: 'transparent',
                  fontSize: 13,
                  color: 'var(--ink-2)',
                  cursor: 'pointer'
                }}
              >
                <IconUpload className='h-4 w-4' />
                Drop PDFs, text, or markdown here
              </button>

              {uploadedFiles.length > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  {uploadedFiles.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-2)',
                        fontSize: 12
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={f.include}
                        onChange={() => toggleFileInclude(f.id)}
                        aria-label={`Include ${f.name}`}
                        style={{ accentColor: 'var(--accent)' }}
                      />
                      <IconFile
                        className='h-3.5 w-3.5'
                        style={{ color: 'var(--ink-3)', flexShrink: 0 }}
                      />
                      <span
                        style={{
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: 'var(--ink-1)'
                        }}
                      >
                        {f.name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-dp-mono), monospace',
                          color: 'var(--ink-3)'
                        }}
                      >
                        {formatBytes(f.size)}
                      </span>
                      <span
                        style={{
                          padding: '1px 6px',
                          borderRadius: 4,
                          border: `1px solid ${f.status === 'processing' ? 'rgba(245,158,11,0.3)' : 'var(--accent-line)'}`,
                          fontSize: 10,
                          color:
                            f.status === 'processing'
                              ? '#f59e0b'
                              : 'var(--accent-bright)'
                        }}
                      >
                        {f.status}
                      </span>
                      <button
                        type='button'
                        onClick={() => removeFile(f.id)}
                        aria-label={`Remove ${f.name}`}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 4,
                          cursor: 'pointer',
                          color: 'var(--ink-3)'
                        }}
                      >
                        <IconX className='h-3.5 w-3.5' />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat + retrieval trace 2-pane */}
          <div
            style={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
              background: 'var(--border-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 14,
              overflow: 'hidden'
            }}
          >
            {/* Chat pane */}
            <div style={{ background: 'var(--bg-1)', padding: 22 }}>
              <div
                style={{
                  fontFamily: 'var(--font-dp-mono), monospace',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  color: 'var(--ink-3)',
                  textTransform: 'uppercase',
                  marginBottom: 14
                }}
              >
                CHAT
              </div>
              <div
                aria-live='polite'
                aria-label='Chat messages'
                style={{
                  maxHeight: 360,
                  minHeight: 240,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  marginBottom: 14
                }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 10,
                      fontSize: 13.5,
                      lineHeight: 1.55,
                      whiteSpace: 'pre-wrap',
                      color: 'var(--ink-1)',
                      background:
                        msg.role === 'user'
                          ? 'rgba(255,255,255,0.04)'
                          : 'rgba(34,197,94,0.05)',
                      border:
                        msg.role === 'user'
                          ? '1px solid var(--border-subtle)'
                          : '1px solid var(--accent-line)'
                    }}
                  >
                    {msg.content}
                  </div>
                ))}
                {isStreaming &&
                  messages[messages.length - 1]?.content === '' && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: 'rgba(34,197,94,0.05)',
                        border: '1px solid var(--accent-line)',
                        width: 'fit-content'
                      }}
                    >
                      <IconLoader2
                        className='h-4 w-4 animate-spin'
                        style={{ color: 'var(--accent)' }}
                        aria-label='Generating response'
                      />
                    </div>
                  )}
                {error && (
                  <p
                    role='alert'
                    style={{
                      margin: 0,
                      textAlign: 'center',
                      fontSize: 12,
                      color: '#ef4444'
                    }}
                  >
                    {error}
                  </p>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder='Ask about your documents…'
                  rows={1}
                  style={{
                    flex: 1,
                    minHeight: 44,
                    resize: 'none',
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontFamily: 'var(--font-dp-sans), Inter Tight, sans-serif',
                    fontSize: 13.5,
                    color: 'var(--ink-0)',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border-muted)',
                    outline: 'none'
                  }}
                />
                <button
                  type='button'
                  onClick={handleSend}
                  disabled={isStreaming || !input.trim()}
                  aria-label='Send message'
                  className='dp-btn dp-btn-primary'
                  style={{
                    padding: 12,
                    minWidth: 44,
                    justifyContent: 'center',
                    opacity: isStreaming || !input.trim() ? 0.5 : 1,
                    cursor:
                      isStreaming || !input.trim() ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isStreaming ? (
                    <IconLoader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <IconSend className='h-4 w-4' />
                  )}
                </button>
              </div>
              <p
                style={{
                  margin: '10px 0 0',
                  fontFamily: 'var(--font-dp-mono), monospace',
                  fontSize: 11,
                  color: 'var(--ink-3)'
                }}
              >
                Rate limited: 2 messages/hour (guest) · 50/hour (signed in)
              </p>
            </div>

            {/* Retrieval trace pane */}
            <div style={{ background: 'var(--bg-1)', padding: 22 }}>
              <div
                style={{
                  fontFamily: 'var(--font-dp-mono), monospace',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  color: 'var(--ink-3)',
                  textTransform: 'uppercase',
                  marginBottom: 14
                }}
              >
                RETRIEVAL TRACE
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-dp-mono), monospace',
                  fontSize: 11.5,
                  lineHeight: 1.85,
                  color: 'var(--ink-2)'
                }}
              >
                <div>● top_k=8 · 23ms</div>
                <div>● rerank → 3 chunks kept</div>
                <div style={{ paddingLeft: 14, color: 'var(--ink-3)' }}>
                  ↳ src/proxy.ts:1-22 (0.91)
                </div>
                <div style={{ paddingLeft: 14, color: 'var(--ink-3)' }}>
                  ↳ providers.tsx:1-18 (0.84)
                </div>
                <div style={{ paddingLeft: 14, color: 'var(--ink-3)' }}>
                  ↳ auth/layout.tsx:1-30 (0.71)
                </div>
                <div>● gen → 412 tokens · 1.2s</div>
                <div style={{ color: 'var(--accent)' }}>● streamed · cited</div>
              </div>

              <div style={{ marginTop: 22 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-dp-mono), monospace',
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    color: 'var(--ink-3)',
                    textTransform: 'uppercase',
                    marginBottom: 10
                  }}
                >
                  3D VIEWER
                </div>
                <DodecahedronPreview />
              </div>
            </div>
          </div>
        </section>

        {/* // 03 3D outputs */}
        <section style={{ paddingBottom: 80 }}>
          <div className='mod-section-meta'>
            <span className='mod-section-num'>// 03</span>
            <span className='mod-section-line' />
            <span className='mod-section-label'>3D outputs</span>
          </div>
          <div
            className='mod-card'
            style={{
              padding: 28,
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)',
              gap: 28,
              alignItems: 'center'
            }}
          >
            <div>
              <p
                style={{
                  margin: '0 0 14px',
                  color: 'var(--ink-1)',
                  fontSize: 16,
                  lineHeight: 1.6
                }}
              >
                When a question implies structure — an org graph, a network, a
                3D scene — the model emits a typed payload alongside the prose.
                The renderer is deterministic from that payload, so the same
                trace renders the same scene.
              </p>
              <p
                style={{
                  margin: 0,
                  color: 'var(--ink-3)',
                  fontSize: 13.5,
                  lineHeight: 1.6
                }}
              >
                No image hallucination. No prompt-to-Three.js gymnastics. Just a
                small schema and a viewer.
              </p>
            </div>
            <DodecahedronPreview />
          </div>
        </section>

        {/* Footer: prev/next module */}
        <nav className='mod-foot'>
          <a href='/mcp' className='is-next'>
            → First module: MCP Sentinel
          </a>
          <a href='/' className='is-back'>
            ← Back to homepage
          </a>
        </nav>
      </main>
    </div>
  );
}
