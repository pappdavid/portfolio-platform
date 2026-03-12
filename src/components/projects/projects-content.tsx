'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  IconBrandGithub,
  IconExternalLink,
  IconLock
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/shared/code-block';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';
import { cn } from '@/lib/utils';

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  privateRepo?: boolean;
  tabs: {
    overview: string;
    code: { snippet: string; language: string; filename: string };
    diagram: string;
  };
};

const projects: Project[] = [
  {
    id: 'mcp-sentinel',
    title: 'MCP Sentinel',
    description:
      'A proxy layer for Model Context Protocol that logs, guards, and audits every agent tool call in real time.',
    tags: ['TypeScript', 'MCP', 'Supabase', 'Security'],
    privateRepo: true,
    liveUrl: '/mcp',
    tabs: {
      overview:
        'MCP Sentinel sits between AI agents and their tools. It validates inputs against guard rules (injection detection, PII scanning, cost limits), logs every event to Supabase with RLS, and surfaces anomalies in a dashboard. Designed for teams running LLM agents in production who need compliance and visibility.',
      code: {
        snippet: `// Guard middleware pipeline
async function runGuards(event: MCPEvent): Promise<GuardResult> {
  const guards = [
    rateLimiter,
    injectionDetector,
    piiScanner,
    costTracker,
  ];

  for (const guard of guards) {
    const result = await guard.check(event);
    if (result.action === 'block') {
      await logEvent({ ...event, status: 'blocked', guard: guard.name });
      return result;
    }
  }

  return { action: 'allow' };
}`,
        language: 'typescript',
        filename: 'guards.ts'
      },
      diagram: `graph TD
  A[Agent Request] --> B[MCP Sentinel Proxy]
  B --> C[Rate Limiter]
  C --> D[Injection Detector]
  D --> E[PII Scanner]
  E --> F[Cost Tracker]
  F --> G{All Pass?}
  G -->|Yes| H[Forward to Tool]
  G -->|No| I[Block + Alert]
  H --> J[Log Event]
  I --> J
  J --> K[Dashboard]`
    }
  },
  {
    id: 'training-pipeline',
    title: 'Custom Training Pipeline',
    description:
      'Automated pipeline to convert codebases into fine-tuning datasets. Supports LoRA adapters for any compatible model.',
    tags: ['Python', 'LLM', 'Fine-tuning', 'LoRA'],
    privateRepo: true,
    liveUrl: '/training',
    tabs: {
      overview:
        'The training pipeline parses Git repositories, chunks code by semantic boundaries, and generates instruction-response pairs using a configurable prompt template. Output is OpenAI-compatible JSONL ready for fine-tuning with any LoRA framework. Includes validation, deduplication, and quality scoring.',
      code: {
        snippet: `# Semantic chunking with overlap
class SemanticChunker:
    def __init__(self, chunk_size=512, overlap=64):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk(self, source: ParsedFile) -> list[Chunk]:
        boundaries = self._find_boundaries(source.ast)
        chunks = []
        for start, end in boundaries:
            tokens = source.tokens[start:end]
            if len(tokens) > self.chunk_size:
                chunks.extend(self._split_large(tokens))
            else:
                chunks.append(Chunk(tokens=tokens, metadata=source.meta))
        return chunks`,
        language: 'python',
        filename: 'chunker.py'
      },
      diagram: `graph LR
  A[Git Repo] --> B[File Scanner]
  B --> C[AST Parser]
  C --> D[Semantic Chunker]
  D --> E[Prompt Generator]
  E --> F[Quality Filter]
  F --> G[JSONL Output]
  G --> H[Fine-tune API]`
    }
  },
  {
    id: 'rag-chat',
    title: 'RAG + 3D Chat',
    description:
      'Retrieval-augmented chat interface with document upload and Three.js visualization for spatial data.',
    tags: ['Next.js', 'Three.js', 'OpenAI', 'Supabase'],
    privateRepo: true,
    liveUrl: '/chat',
    tabs: {
      overview:
        'Users upload PDFs or text, which are chunked and embedded into a Supabase vector store. Queries retrieve relevant context and feed it to the LLM along with the conversation. When responses contain spatial or structural data, they render in an interactive Three.js viewer alongside the chat.',
      code: {
        snippet: `// Retrieval pipeline
async function retrieve(query: string, topK = 5) {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });

  const { data } = await supabase.rpc('match_documents', {
    query_embedding: embedding.data[0].embedding,
    match_threshold: 0.7,
    match_count: topK,
  });

  return data.map((doc) => doc.content);
}`,
        language: 'typescript',
        filename: 'retrieve.ts'
      },
      diagram: `graph TD
  A[User Query] --> B[Embed Query]
  B --> C[Vector Search]
  C --> D[Top-K Documents]
  D --> E[Build Prompt]
  E --> F[LLM Response]
  F --> G{Contains 3D?}
  G -->|Yes| H[Render Three.js]
  G -->|No| I[Display Text]`
    }
  },
  {
    id: 'portfolio-platform',
    title: 'Portfolio Platform',
    description:
      'This site itself. A Next.js 16 dashboard with multi-theme system, RBAC navigation, and Clerk auth.',
    tags: ['Next.js 16', 'shadcn/ui', 'Clerk', 'Tailwind v4'],
    githubUrl: 'https://github.com/pappdavid/portfolio-platform',
    liveUrl: '/',
    tabs: {
      overview:
        'Forked from next-shadcn-dashboard-starter and reconfigured as a portfolio platform. Features six OKLCH themes, client-side RBAC navigation filtering, parallel dashboard routes, and Supabase backend. The public-facing pages use Aceternity effects for visual polish.',
      code: {
        snippet: `// Theme-aware Clerk provider
'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export function Providers({ children }) {
  const { resolvedTheme } = useTheme();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}`,
        language: 'tsx',
        filename: 'providers.tsx'
      },
      diagram: `graph TD
  A[Root Layout] --> B[ThemeProvider]
  B --> C[ClerkProvider]
  C --> D{Route Group}
  D -->|Public| E[Marketing Pages]
  D -->|Dashboard| F[Protected Shell]
  D -->|Auth| G[Sign In/Up]
  F --> H[Sidebar + Header]
  H --> I[Page Content]`
    }
  }
];

export function ProjectsContent() {
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const project = projects.find((p) => p.id === activeProject)!;

  return (
    <div className='flex flex-col'>
      {/* Hero */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <Badge variant='secondary' className='mb-4'>
            Engineering Portfolio
          </Badge>
          <h1 className='text-foreground text-4xl font-bold tracking-tight sm:text-5xl'>
            Projects
          </h1>
          <p className='text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed'>
            A selection of AI engineering projects spanning observability,
            fine-tuning, and retrieval-augmented systems.
          </p>
        </div>
      </section>

      {/* Project Cards */}
      <section className='py-12'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProject(p.id)}
                className={cn(
                  'rounded-xl border p-5 text-left transition-all',
                  activeProject === p.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'hover:border-foreground/20'
                )}
              >
                <h3 className='text-foreground font-semibold'>{p.title}</h3>
                <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                  {p.description}
                </p>
                <div className='mt-3 flex flex-wrap gap-1'>
                  {p.tags.map((tag) => (
                    <Badge key={tag} variant='outline' className='text-xs'>
                      {tag}
                    </Badge>
                  ))}
                </div>
                {/* Links row */}
                <div className='mt-4 flex flex-wrap items-center gap-2'>
                  {p.githubUrl ? (
                    <Link
                      href={p.githubUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                      className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors'
                    >
                      <IconBrandGithub
                        className='h-3.5 w-3.5'
                        aria-hidden='true'
                      />
                      GitHub
                    </Link>
                  ) : p.privateRepo ? (
                    <span className='text-muted-foreground inline-flex items-center gap-1 text-xs'>
                      <IconLock className='h-3.5 w-3.5' aria-hidden='true' />
                      Private repo — available on request
                    </span>
                  ) : null}
                  {p.liveUrl && (
                    <Button
                      asChild
                      size='sm'
                      variant='outline'
                      className='h-6 gap-1 px-2 text-xs'
                    >
                      <Link
                        href={p.liveUrl}
                        target={
                          p.liveUrl.startsWith('http') ? '_blank' : undefined
                        }
                        rel={
                          p.liveUrl.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconExternalLink
                          className='h-3 w-3'
                          aria-hidden='true'
                        />
                        Live Demo
                      </Link>
                    </Button>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Project Detail */}
      <section className='bg-muted/30 py-12'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-6 text-2xl font-bold'>
            {project.title}
          </h2>
          <Tabs defaultValue='overview'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='code'>Code</TabsTrigger>
              <TabsTrigger value='diagram'>Architecture</TabsTrigger>
            </TabsList>
            <TabsContent value='overview' className='mt-4'>
              <div className='bg-background rounded-xl border p-6'>
                <p className='text-muted-foreground leading-relaxed'>
                  {project.tabs.overview}
                </p>
              </div>
            </TabsContent>
            <TabsContent value='code' className='mt-4'>
              <CodeBlock
                code={project.tabs.code.snippet}
                language={project.tabs.code.language}
                filename={project.tabs.code.filename}
              />
            </TabsContent>
            <TabsContent value='diagram' className='mt-4'>
              <div className='bg-background rounded-xl border p-6'>
                <MermaidDiagram chart={project.tabs.diagram} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
