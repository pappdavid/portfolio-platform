'use client';

import { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';
import {
  IconMessageCircle,
  IconUpload,
  IconSend,
  IconCube,
  IconFile,
  IconX
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

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

const demoMessages: ChatMessage[] = [
  {
    role: 'user',
    content: 'What authentication pattern does this project use?'
  },
  {
    role: 'assistant',
    content:
      'Based on the codebase, this project uses **Clerk** for authentication. The middleware is configured in `proxy.ts` (Next.js 16 pattern) which protects `/dashboard(.*)` routes via `clerkMiddleware`. The root layout wraps the app with `ClerkProvider` for client-side auth state.\n\nKey files:\n- `src/proxy.ts` — middleware configuration\n- `src/components/layout/providers.tsx` — ClerkProvider wrapper\n- `src/app/auth/` — sign-in/sign-up routes'
  }
];

function ThreeViewer() {
  return (
    <div className='bg-muted/30 flex h-full min-h-[300px] flex-col items-center justify-center rounded-lg border'>
      <IconCube className='text-muted-foreground mb-4 h-16 w-16 animate-pulse' />
      <p className='text-muted-foreground text-sm font-medium'>3D Viewer</p>
      <p className='text-muted-foreground mt-1 text-xs'>
        Three.js canvas renders here when content includes 3D data
      </p>
    </div>
  );
}

export function ChatContent() {
  const [messages, setMessages] = useState<ChatMessage[]>(demoMessages);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [showViewer, setShowViewer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');
    // Simulate response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'This is a demo response. In production, this would query your vector store for relevant context and generate a response using the LLM.'
        }
      ]);
    }, 1000);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected) {
      setFiles((prev) => [...prev, ...Array.from(selected).map((f) => f.name)]);
    }
  };

  return (
    <div className='flex flex-col'>
      {/* Hero */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <Badge variant='secondary' className='mb-4'>
            Retrieval-Augmented Generation
          </Badge>
          <h1 className='text-foreground text-4xl font-bold tracking-tight sm:text-5xl'>
            RAG + 3D Chat
          </h1>
          <p className='text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed'>
            Upload documents, ask questions, and get answers grounded in your
            data. When responses include spatial data, they render in an
            interactive 3D viewer.
          </p>
        </div>
      </section>

      {/* Chat Interface */}
      <section className='bg-muted/30 py-12'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Chat Panel */}
            <div className='flex flex-col lg:col-span-2'>
              {/* Upload Area */}
              <div className='mb-4'>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept='.pdf,.txt,.md,.csv'
                  className='hidden'
                  onChange={handleFileChange}
                />
                <button
                  onClick={handleFileSelect}
                  className='hover:border-foreground/20 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors'
                >
                  <IconUpload className='text-muted-foreground h-5 w-5' />
                  <span className='text-muted-foreground text-sm'>
                    Drop PDFs, text, or markdown here
                  </span>
                </button>
                {files.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {files.map((f, i) => (
                      <Badge key={i} variant='secondary' className='gap-1'>
                        <IconFile className='h-3 w-3' />
                        {f}
                        <button
                          onClick={() =>
                            setFiles((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                        >
                          <IconX className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className='bg-background flex-1 space-y-4 overflow-y-auto rounded-xl border p-4'>
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
                        'max-w-[80%] rounded-lg px-4 py-3',
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className='text-sm whitespace-pre-wrap'>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className='mt-4 flex gap-2'>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Ask about your documents...'
                  className='min-h-[44px] resize-none'
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button onClick={handleSend} size='icon' className='shrink-0'>
                  <IconSend className='h-4 w-4' />
                </Button>
              </div>

              {/* Rate limit notice */}
              <p className='text-muted-foreground mt-2 text-xs'>
                Rate limited: 10 messages/hour (unauthenticated), 50/hour
                (signed in).
              </p>
            </div>

            {/* 3D Viewer Panel */}
            <div className='flex flex-col'>
              <div className='mb-2 flex items-center justify-between'>
                <h3 className='text-foreground text-sm font-medium'>
                  3D Viewer
                </h3>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowViewer(!showViewer)}
                >
                  {showViewer ? 'Hide' : 'Show'}
                </Button>
              </div>
              {showViewer ? (
                <ThreeViewer />
              ) : (
                <div className='bg-muted/30 flex h-[300px] items-center justify-center rounded-lg border'>
                  <p className='text-muted-foreground text-sm'>
                    Click &ldquo;Show&rdquo; to activate 3D viewer
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-8 text-2xl font-bold'>
            Architecture
          </h2>
          <div className='bg-background rounded-xl border p-6'>
            <MermaidDiagram chart={architectureChart} />
          </div>
        </div>
      </section>
    </div>
  );
}
