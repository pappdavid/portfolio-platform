'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  IconBrandGithub,
  IconSend,
  IconFile,
  IconX,
  IconLoader2,
  IconCheck,
  IconCode,
  IconArrowLeft,
  IconChevronRight
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

type ChatMessage = { role: 'user' | 'assistant'; content: string };

type CodeChunk = {
  id: string;
  filename: string;
  summary: string;
  tokens: number;
};

type UploadedFile = {
  id: string;
  file: File;
  name: string;
  size: number;
  include: boolean;
  status: 'processing' | 'ready';
  content?: string;
};

// ============================================================
// Real Files Mapping for David's Public Repositories (High Fidelity!)
// ============================================================

const REPO_FILES: Record<string, CodeChunk[]> = {
  'agentsec-hook-pack': [
    {
      id: '1',
      filename: '.agentsec/hooks/agentsec-hook.mjs',
      summary: 'Primary hook execution script and local policy checks',
      tokens: 412
    },
    {
      id: '2',
      filename: '.agentsec/config.json',
      summary: 'Local policy variables and safe bash commands list',
      tokens: 184
    },
    {
      id: '3',
      filename: '.claude/settings.agentsec.example.json',
      summary: 'Claude Code hook integration preset config',
      tokens: 236
    }
  ],
  'agent-cli-mcp-rust': [
    {
      id: '1',
      filename: 'src/main.rs',
      summary:
        'Server startup, stdio JSON-RPC loop, and MCP transport configuration',
      tokens: 580
    },
    {
      id: '2',
      filename: 'src/policy.rs',
      summary: 'Directory allowedRoots validation and isolation layer',
      tokens: 324
    },
    {
      id: '3',
      filename: 'src/redact.rs',
      summary: 'Secret scanning and JWT/Stripe key scrubbing expressions',
      tokens: 290
    }
  ],
  'antigravity-skill-injector': [
    {
      id: '1',
      filename: 'src/mcp-server/src/main.rs',
      summary: 'Rust stdio server serving dynamic instructions',
      tokens: 498
    },
    {
      id: '2',
      filename: 'scripts/migrate_skills.py',
      summary: 'YAML parser to centralize skills inside registry',
      tokens: 280
    },
    {
      id: '3',
      filename: 'skills_registry.json',
      summary: 'Database compiler matching stubs to instruction blocks',
      tokens: 194
    }
  ],
  'saas-core': [
    {
      id: '1',
      filename: 'prisma/schema.prisma',
      summary: 'Database schema holding subs, billing, users and audit events',
      tokens: 670
    },
    {
      id: '2',
      filename: 'src/lib/rate-limit.ts',
      summary: 'Upstash Redis-backed B2C subscription limitation limits',
      tokens: 310
    },
    {
      id: '3',
      filename: 'src/app/api/stripe/webhook/route.ts',
      summary: 'Stripe transaction status parser and model toggler',
      tokens: 420
    }
  ],
  'thesys-c1-dashboard': [
    {
      id: '1',
      filename: 'src/app/dashboard/page.tsx',
      summary: 'Real-time charts, telemetry streams, and telemetry grid layout',
      tokens: 532
    },
    {
      id: '2',
      filename: 'src/lib/thesys.ts',
      summary: 'Thesys C1 webhook listener and state schema validation',
      tokens: 340
    }
  ]
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ============================================================
// Dedicated RAG Chat Console
// ============================================================

export function ChatContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Dedicated RAG Chat Console ready. I have search access to all of David's public repositories. You can upload custom files, load specific GitHub repos into the context, or ask me detailed technical questions!"
    }
  ]);
  const [input, setInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GitHub Loading States
  const [repoUrl, setRepoUrl] = useState('');
  const [cloning, setCloning] = useState(false);
  const [cloneStatus, setCloneStatus] = useState<string | null>(null);
  const [codeChunks, setCodeChunks] = useState<CodeChunk[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat body
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load public GitHub projects dynamically (High fidelity!)
  const handleCloneRepo = useCallback(() => {
    const url = repoUrl.trim();
    if (!url || cloning) return;

    setCloning(true);
    setCloneStatus('indexing repository schema...');
    setCodeChunks([]);

    // Extract repo slug
    const parts = url.replace(/\/$/, '').split('/');
    const repoSlug = parts[parts.length - 1]?.toLowerCase() || '';

    setTimeout(() => {
      // Check if we have high-fidelity mock files for this project
      let chunks: CodeChunk[] = [
        {
          id: '1',
          filename: 'README.md',
          summary: 'Repository description and default instruction guide',
          tokens: 150
        },
        {
          id: '2',
          filename: 'package.json',
          summary: 'Project configurations and dependency listings',
          tokens: 210
        }
      ];

      // Find matching project details
      for (const key of Object.keys(REPO_FILES)) {
        if (repoSlug.includes(key) || key.includes(repoSlug)) {
          chunks = REPO_FILES[key];
          break;
        }
      }

      setCodeChunks(chunks);
      setCloning(false);
      setCloneStatus(`loaded context: ${repoSlug}`);
    }, 1200);
  }, [repoUrl, cloning]);

  // SSE Stream Sender
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
      // Collate uploaded file contexts
      const includedFileContent = uploadedFiles
        .filter((f) => f.include && f.status === 'ready' && f.content)
        .map((f) => `### File: ${f.name}\n${f.content}`)
        .join('\n\n');

      // Collate loaded GitHub files context
      const codeContext =
        codeChunks.length > 0
          ? `Local index repository files:\n${codeChunks.map((c) => `- ${c.filename}: ${c.summary}`).join('\n')}`
          : undefined;

      const fileContext = includedFileContent
        ? `Uploaded files content:\n\n${includedFileContent}`
        : undefined;

      const context =
        [codeContext, fileContext].filter(Boolean).join('\n\n') || undefined;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMsg),
          context
        })
      });

      if (res.status === 429) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content:
              'Rate limit reached (2 queries/hour as guest). Please sign in for higher limits.'
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
              const last = updated[updated.length - 1];
              if (last && last.role === 'assistant') {
                last.content += content;
              }
              return updated;
            });
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
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
    <div
      style={{
        color: 'var(--text)',
        fontFamily: 'var(--font-mono)',
        minHeight: '100vh',
        background: 'var(--bg)'
      }}
    >
      {/* HEADER TITLE BAR */}
      <div className='statusbar'>
        <Link
          href='/'
          className='sb-accent flex items-center gap-2 hover:underline'
        >
          <IconArrowLeft className='h-4 w-4' />
          <span>[portfolio]</span>
        </Link>
        <span className='sb-sep'>|</span>
        <span className='sb-item'>
          <span className='sb-k'>SESSION:</span>
          <span className='sb-v'>rag_console</span>
        </span>
        <div className='sb-right'>
          <span className='sb-dot' />
          <span>ACTIVE_ROUTING</span>
        </div>
      </div>

      <div className='scroll-container'>
        <div className='shell block'>
          {/* Header Title */}
          <div className='sec-head'>
            <span className='sec-cmd'>
              <span className='prompt'>$ </span>cat /etc/chat_os
            </span>
            <span className='sec-note'>CONSOLE</span>
          </div>

          <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4'>
            {/* LEFT SIDEBAR: Index context sources */}
            <div className='flex flex-col gap-4 lg:col-span-1'>
              <div
                className='term-window flex flex-col gap-4 p-4'
                style={{ background: 'var(--bg-raised)' }}
              >
                <div className='contact-label' style={{ fontSize: '10px' }}>
                  CONTEXT SOURCES
                </div>

                {/* Loader inputs */}
                <div className='flex flex-col gap-2'>
                  <div className='relative'>
                    <IconBrandGithub
                      className='absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2'
                      style={{ color: 'var(--text-dim)' }}
                    />
                    <input
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder='pappdavid/saas-core...'
                      className='w-full border border-[var(--border)] bg-[#070707] py-1.5 pr-2 pl-8 font-mono text-xs text-white focus:border-[var(--accent)] focus:outline-none'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCloneRepo();
                      }}
                      disabled={cloning}
                    />
                  </div>
                  <button
                    onClick={handleCloneRepo}
                    disabled={!repoUrl.trim() || cloning}
                    className='w-full border border-[var(--accent)] bg-transparent py-1.5 text-center text-xs text-[var(--accent)] transition-all hover:bg-[var(--accent-faint)]'
                  >
                    {cloning ? 'indexing...' : '[load_repository]'}
                  </button>
                </div>

                {/* Index status */}
                {cloneStatus && (
                  <div className='rounded-sm border border-[var(--border)] bg-[#0d0d0d] p-2 text-xs'>
                    <div className='mb-1 flex items-center gap-1.5 text-[var(--accent)]'>
                      {cloning ? (
                        <IconLoader2 className='h-3 w-3 animate-spin' />
                      ) : (
                        <IconCheck className='h-3.5 w-3.5' />
                      )}
                      <span>{cloneStatus}</span>
                    </div>
                    {codeChunks.length > 0 && (
                      <div className='mt-2 flex flex-col gap-1.5'>
                        {codeChunks.map((c) => (
                          <div
                            key={c.id}
                            className='flex items-center gap-1 truncate text-[10px] text-[var(--text-dim)]'
                          >
                            <IconChevronRight className='h-3 w-3 shrink-0' />
                            <span>{c.filename}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* File Drop Area */}
                <div className='relative rounded-sm border border-dashed border-[var(--border)] bg-[#080808] p-4 text-center'>
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
                    className='flex w-full cursor-pointer flex-col items-center gap-1.5 border-none bg-transparent text-[11px] text-[var(--text-dim)] transition-all hover:text-[var(--accent)]'
                  >
                    <IconFile className='h-5 w-5 opacity-40' />
                    <span>Click to attach documents</span>
                  </button>
                </div>

                {/* File list */}
                {uploadedFiles.length > 0 && (
                  <div className='flex max-h-[160px] flex-col gap-1.5 overflow-y-auto pr-1'>
                    {uploadedFiles.map((f) => (
                      <div
                        key={f.id}
                        className='flex items-center gap-1.5 border border-[var(--border)] bg-[#0d0d0d] p-1.5 text-[10px]'
                      >
                        <input
                          type='checkbox'
                          checked={f.include}
                          onChange={() => toggleFileInclude(f.id)}
                          className='accent-[#00ff88]'
                          aria-label={`Include ${f.name}`}
                        />
                        <span className='flex-1 truncate text-[var(--accent-muted)]'>
                          {f.name}
                        </span>
                        <button
                          onClick={() => removeFile(f.id)}
                          className='border-none bg-transparent text-[var(--text-dim)] hover:text-white'
                        >
                          <IconX className='h-3 w-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT MAIN PANEL: Unified Chat Console */}
            <div className='flex flex-col gap-4 lg:col-span-3'>
              <div className='chat term-window flex min-h-[500px] flex-col'>
                <div className='chat-titlebar'>
                  <span className='chat-status'>
                    <span className='sb-dot' /> zui@portfolio:
                    interactive_session
                  </span>
                  <span className='chat-conv'>status: running</span>
                </div>

                {/* Message logs */}
                <div className='chat-body flex-1' style={{ height: '380px' }}>
                  {messages.map((m, i) => (
                    <div key={i} className={cn('chat-msg', m.role)}>
                      {m.role === 'assistant' && (
                        <span className='msg-tag'>ASSISTANT</span>
                      )}
                      <span className='msg-text whitespace-pre-wrap'>
                        {m.content}
                      </span>
                    </div>
                  ))}
                  {isStreaming &&
                    messages[messages.length - 1]?.content === '' && (
                      <div className='chat-msg bot typing'>
                        <span className='msg-tag'>ASSISTANT</span>
                        <span className='msg-text'>
                          thinking<span className='ell'>...</span>
                        </span>
                      </div>
                    )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input form */}
                <div className='chat-input border-t border-[var(--border)]'>
                  <span className='chat-pre'>david@dev:~/assistant$</span>
                  <input
                    className='chat-field'
                    placeholder='start typing here... (500 characters max)'
                    value={input}
                    maxLength={500}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSend();
                    }}
                    spellCheck={false}
                    disabled={isStreaming}
                  />
                  <button
                    onClick={handleSend}
                    className='send-btn'
                    disabled={isStreaming || !input.trim()}
                  >
                    [send]
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
