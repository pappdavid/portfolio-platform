'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/shared/code-block';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';
import {
  D3IntegrationGraph,
  type GraphData
} from '@/components/shared/d3-integration-graph';
import { cn } from '@/lib/utils';

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  detailUrl: string;
  tabs: {
    overview: string;
    code: { snippet: string; language: string; filename: string };
    diagram: string;
    graph: GraphData;
  };
};

const projects: Project[] = [
  {
    id: 'mcp-sentinel',
    title: 'MCP Sentinel',
    description:
      'A proxy layer for Model Context Protocol that logs, guards, and audits every agent tool call in real time.',
    tags: ['TypeScript', 'MCP', 'Supabase', 'Security'],
    detailUrl: '/projects/mcp-sentinel',
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
  J --> K[Dashboard]`,
      graph: {
        nodes: [
          { id: 'agent', label: 'AI Agent', type: 'external' },
          { id: 'proxy', label: 'MCP Proxy', type: 'service' },
          { id: 'rate', label: 'Rate Limiter', type: 'service' },
          { id: 'injection', label: 'Injection Detector', type: 'service' },
          { id: 'pii', label: 'PII Scanner', type: 'service' },
          { id: 'cost', label: 'Cost Tracker', type: 'service' },
          { id: 'tool', label: 'MCP Tool', type: 'external' },
          { id: 'supabase', label: 'Supabase', type: 'model' },
          { id: 'dashboard', label: 'Dashboard UI', type: 'component' },
          { id: 'alerts', label: 'Alert System', type: 'route' }
        ],
        edges: [
          { source: 'agent', target: 'proxy' },
          { source: 'proxy', target: 'rate' },
          { source: 'rate', target: 'injection' },
          { source: 'injection', target: 'pii' },
          { source: 'pii', target: 'cost' },
          { source: 'cost', target: 'tool', label: 'allow' },
          { source: 'cost', target: 'alerts', label: 'block' },
          { source: 'tool', target: 'supabase' },
          { source: 'alerts', target: 'supabase' },
          { source: 'supabase', target: 'dashboard' }
        ]
      }
    }
  },
  {
    id: 'training-pipeline',
    title: 'Custom Training Pipeline',
    description:
      'Automated pipeline to convert codebases into fine-tuning datasets. Supports LoRA adapters for any compatible model.',
    tags: ['Python', 'LLM', 'Fine-tuning', 'LoRA'],
    detailUrl: '/projects/training',
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
  G --> H[Fine-tune API]`,
      graph: {
        nodes: [
          { id: 'git', label: 'Git Repo', type: 'external' },
          { id: 'scanner', label: 'File Scanner', type: 'service' },
          { id: 'ast', label: 'AST Parser', type: 'service' },
          { id: 'chunker', label: 'Semantic Chunker', type: 'service' },
          { id: 'prompt', label: 'Prompt Generator', type: 'service' },
          { id: 'filter', label: 'Quality Filter', type: 'service' },
          { id: 'jsonl', label: 'JSONL Output', type: 'model' },
          { id: 'api', label: 'Fine-tune API', type: 'route' },
          { id: 'lora', label: 'LoRA Adapter', type: 'external' },
          { id: 'eval', label: 'Eval Suite', type: 'component' }
        ],
        edges: [
          { source: 'git', target: 'scanner' },
          { source: 'scanner', target: 'ast' },
          { source: 'ast', target: 'chunker' },
          { source: 'chunker', target: 'prompt' },
          { source: 'prompt', target: 'filter' },
          { source: 'filter', target: 'jsonl' },
          { source: 'jsonl', target: 'api' },
          { source: 'api', target: 'lora' },
          { source: 'lora', target: 'eval' },
          { source: 'eval', target: 'filter', label: 'feedback' }
        ]
      }
    }
  },
  {
    id: 'rag-chat',
    title: 'RAG + 3D Chat',
    description:
      'Retrieval-augmented chat interface with document upload and Three.js visualization for spatial data.',
    tags: ['Next.js', 'Three.js', 'OpenAI', 'Supabase'],
    detailUrl: '/projects/rag-chat',
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
  G -->|No| I[Display Text]`,
      graph: {
        nodes: [
          { id: 'user', label: 'User', type: 'external' },
          { id: 'chat', label: 'Chat UI', type: 'component' },
          { id: 'embed', label: 'Embed Service', type: 'service' },
          { id: 'vector', label: 'Vector Store', type: 'model' },
          { id: 'openai', label: 'OpenAI API', type: 'external' },
          { id: 'supabase', label: 'Supabase', type: 'model' },
          { id: 'three', label: 'Three.js Viewer', type: 'component' },
          { id: 'upload', label: 'Upload Route', type: 'route' },
          { id: 'ingest', label: 'Doc Ingest', type: 'service' },
          { id: 'ratelimit', label: 'Rate Limiter', type: 'service' }
        ],
        edges: [
          { source: 'user', target: 'chat' },
          { source: 'user', target: 'upload' },
          { source: 'upload', target: 'ingest' },
          { source: 'ingest', target: 'embed' },
          { source: 'ingest', target: 'supabase' },
          { source: 'chat', target: 'ratelimit' },
          { source: 'ratelimit', target: 'embed' },
          { source: 'embed', target: 'openai' },
          { source: 'embed', target: 'vector' },
          { source: 'vector', target: 'supabase' },
          { source: 'supabase', target: 'chat' },
          { source: 'openai', target: 'chat' },
          { source: 'chat', target: 'three', label: '3D data' }
        ]
      }
    }
  },
  {
    id: 'portfolio-platform',
    title: 'Portfolio Platform',
    description:
      'This site itself. A Next.js 16 dashboard with multi-theme system, RBAC navigation, and Clerk auth.',
    tags: ['Next.js 16', 'shadcn/ui', 'Clerk', 'Tailwind v4'],
    detailUrl: '/projects/portfolio',
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
  H --> I[Page Content]`,
      graph: {
        nodes: [
          { id: 'clerk', label: 'Clerk Auth', type: 'external' },
          { id: 'proxy', label: 'Middleware', type: 'service' },
          { id: 'layout', label: 'Root Layout', type: 'component' },
          { id: 'theme', label: 'Theme System', type: 'service' },
          { id: 'dashboard', label: 'Dashboard Shell', type: 'component' },
          { id: 'public', label: 'Public Pages', type: 'component' },
          { id: 'supabase', label: 'Supabase', type: 'model' },
          { id: 'sidebar', label: 'App Sidebar', type: 'component' },
          { id: 'kbar', label: 'KBar (CMD+K)', type: 'component' },
          { id: 'api', label: 'API Routes', type: 'route' }
        ],
        edges: [
          { source: 'clerk', target: 'proxy' },
          { source: 'proxy', target: 'layout' },
          { source: 'layout', target: 'theme' },
          { source: 'layout', target: 'dashboard' },
          { source: 'layout', target: 'public' },
          { source: 'dashboard', target: 'sidebar' },
          { source: 'dashboard', target: 'kbar' },
          { source: 'dashboard', target: 'api' },
          { source: 'api', target: 'supabase' },
          { source: 'clerk', target: 'api', label: 'auth' }
        ]
      }
    }
  }
];

export function ProjectsContent() {
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const [diagramView, setDiagramView] = useState<'flowchart' | 'graph'>('flowchart');
  const project = projects.find((p) => p.id === activeProject)!;

  return (
    <div className='relative flex flex-col'>
      <div
        className='pointer-events-none absolute inset-0 z-0'
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,0.10) 0%, transparent 60%)'
        }}
      />
      {/* Hero */}
      <section className='relative z-10 py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <Badge variant='secondary' className='mb-4'>
            Showcase
          </Badge>
          <h1 className='text-foreground text-4xl font-bold tracking-tight sm:text-5xl'>
            Showcase
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
              <div key={p.id} className='group relative'>
                <button
                  onClick={() => setActiveProject(p.id)}
                  className={cn(
                    'w-full rounded-xl border p-5 text-left transition-all',
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
                </button>
                <Link
                  href={p.detailUrl}
                  className='text-primary mt-2 block text-center text-xs underline-offset-2 hover:underline'
                >
                  View detail →
                </Link>
              </div>
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
                {/* View toggle */}
                <div className='mb-4 flex items-center gap-2'>
                  <Button
                    variant={diagramView === 'flowchart' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setDiagramView('flowchart')}
                  >
                    Flowchart
                  </Button>
                  <Button
                    variant={diagramView === 'graph' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setDiagramView('graph')}
                  >
                    Integration Graph
                  </Button>
                </div>

                {diagramView === 'flowchart' ? (
                  <MermaidDiagram chart={project.tabs.diagram} />
                ) : (
                  <D3IntegrationGraph data={project.tabs.graph} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h2 className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'>
            Interested in something similar?
          </h2>
          <p className='text-muted-foreground mt-4 text-lg'>
            Available for AI engineering roles and short consulting engagements.
          </p>
          <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button size='lg' asChild>
              <a href='mailto:contact@davidpapp.dev'>Email me</a>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <a
                href='https://calendly.com/david-webinform/30min'
                target='_blank'
                rel='noopener noreferrer'
              >
                Book a call
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
