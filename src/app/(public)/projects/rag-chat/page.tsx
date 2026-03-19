import Image from 'next/image';
import Link from 'next/link';

import {
  ArchDiagram,
  ArchEdge,
  ArchNode
} from '@/components/shared/arch-diagram';
import { CodeBlock } from '@/components/shared/code-block';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'RAG + 3D Chat',
  description:
    'Retrieval-augmented chat with document upload and Three.js spatial visualization.',
  slug: 'rag-chat'
});

const nodes: ArchNode[] = [
  {
    id: 'docs',
    label: 'Documents',
    tooltip: 'PDFs or text files uploaded by the user',
    color: 'default',
    x: 0,
    y: 0
  },
  {
    id: 'embed',
    label: 'Embedder',
    tooltip:
      'OpenAI text-embedding-3-small converts chunks to 1536-dim vectors',
    color: 'purple',
    x: 220,
    y: 0
  },
  {
    id: 'vec',
    label: 'Vector Store',
    tooltip:
      'Supabase pgvector — cosine similarity search via match_documents RPC',
    color: 'cyan',
    x: 440,
    y: 0
  },
  {
    id: 'query',
    label: 'User Query',
    tooltip: 'User message from the chat interface',
    color: 'default',
    x: 0,
    y: 180
  },
  {
    id: 'ret',
    label: 'Retriever',
    tooltip: 'Embeds query, fetches top-K documents from vector store',
    color: 'orange',
    x: 220,
    y: 180
  },
  {
    id: 'rerank',
    label: 'Reranker',
    tooltip: 'Cross-encoder scores candidates; filters to top-3 most relevant',
    color: 'orange',
    x: 440,
    y: 180
  },
  {
    id: 'llm',
    label: 'LLM',
    tooltip: 'Context + query sent to Claude or GPT-4 for grounded response',
    color: 'purple',
    x: 660,
    y: 90
  },
  {
    id: 'resp',
    label: 'Response',
    tooltip: 'Text streamed to chat; spatial data triggers Three.js render',
    color: 'cyan',
    x: 880,
    y: 90
  }
];

const edges: ArchEdge[] = [
  { id: 'e1', from: 'docs', to: 'embed' },
  { id: 'e2', from: 'embed', to: 'vec' },
  { id: 'e3', from: 'query', to: 'ret' },
  { id: 'e4', from: 'vec', to: 'ret' },
  { id: 'e5', from: 'ret', to: 'rerank' },
  { id: 'e6', from: 'rerank', to: 'llm' },
  { id: 'e7', from: 'llm', to: 'resp' }
];

const codeSnippet = `// Retrieval + reranking pipeline
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
}`;

export default function RagChatDetailPage() {
  return (
    <div className='mx-auto max-w-4xl px-6 py-20 text-white'>
      {/* Hero */}
      <section className='mb-16'>
        <Badge variant='secondary' className='mb-4'>
          RAG
        </Badge>
        <h1 className='mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl'>
          RAG + 3D Chat
        </h1>
        <p className='text-muted-foreground mb-8 max-w-2xl text-lg'>
          Retrieval-augmented chat interface with document upload and Three.js
          visualization for spatial data responses.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button asChild>
            <Link href='/chat'>View live demo</Link>
          </Button>
          <Button variant='outline' asChild>
            <a
              href='https://github.com/pappdavid/portfolio-platform'
              target='_blank'
              rel='noopener noreferrer'
            >
              View code
            </a>
          </Button>
        </div>
      </section>

      {/* Problem */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Problem</h2>
        <p className='text-muted-foreground leading-relaxed'>
          Generic chatbots hallucinate when asked about private documentation.
          Users need answers grounded in their own files, with citations. When
          responses contain structural or spatial data — floor plans, graph
          layouts, 3D coordinates — plain text is insufficient; the user needs
          an interactive view.
        </p>
      </section>

      {/* What this demonstrates */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>What this demonstrates</h2>
        <ul className='text-muted-foreground list-inside list-disc space-y-3 leading-relaxed'>
          <li>
            Full RAG pipeline: embed → store → retrieve → rerank → generate,
            with Supabase pgvector as the vector store
          </li>
          <li>
            Cross-encoder reranking step that improves retrieval precision
            beyond cosine similarity alone
          </li>
          <li>
            Conditional Three.js rendering — LLM response is parsed for spatial
            data markers and rendered in a 3D viewer when present
          </li>
        </ul>
      </section>

      {/* Architecture */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Architecture</h2>
        <ArchDiagram nodes={nodes} edges={edges} height={420} />
      </section>

      {/* Tech stack */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Tech stack</h2>
        <ul className='text-muted-foreground space-y-3 leading-relaxed'>
          <li>
            <strong className='text-white'>OpenAI Embeddings:</strong>{' '}
            text-embedding-3-small at 1536 dimensions; good cost/quality
            trade-off for document retrieval.
          </li>
          <li>
            <strong className='text-white'>Supabase pgvector:</strong> Cosine
            similarity search via a custom match_documents RPC; no separate
            vector DB required.
          </li>
          <li>
            <strong className='text-white'>Thesys C1:</strong> Structured UI
            generation from LLM output, used for the chat response rendering
            layer.
          </li>
          <li>
            <strong className='text-white'>Three.js:</strong> 3D scene rendered
            conditionally when the LLM response contains spatial data markers.
          </li>
        </ul>
      </section>

      {/* Code */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Code</h2>
        <CodeBlock
          code={codeSnippet}
          language='typescript'
          filename='retrieve.ts'
        />
      </section>

      {/* Results */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Results</h2>
        <ul className='text-muted-foreground list-inside list-disc space-y-3 leading-relaxed'>
          <li>
            Reference implementation — live demo uses mock documents; full
            document upload available in authenticated dashboard
          </li>
          <li>
            Retrieval with reranking achieves higher precision@3 than
            cosine-only on test queries against the portfolio codebase
          </li>
          <li>
            Rate-limited to 10 queries/hour (unauthenticated) via Upstash
            sliding window
          </li>
        </ul>
      </section>

      {/* Screenshots */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Screenshots</h2>
        <div className='grid gap-4 md:grid-cols-2'>
          <Image
            src='/screenshots/chat/desktop.png'
            alt='RAG + 3D Chat — desktop view'
            width={800}
            height={500}
            className='w-full rounded-lg border border-white/[0.07] object-cover'
          />
          <Image
            src='/screenshots/chat/mobile.png'
            alt='RAG + 3D Chat — mobile view'
            width={375}
            height={667}
            className='w-full rounded-lg border border-white/[0.07] object-cover'
          />
        </div>
      </section>

      {/* GitHub */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>GitHub</h2>
        <p className='text-muted-foreground mb-4 leading-relaxed'>
          The retrieval pipeline, Supabase vector schema, and chat API route are
          all in this repo.
        </p>
        <Button variant='outline' asChild>
          <a
            href='https://github.com/pappdavid/portfolio-platform'
            target='_blank'
            rel='noopener noreferrer'
          >
            View on GitHub
          </a>
        </Button>
      </section>
    </div>
  );
}
