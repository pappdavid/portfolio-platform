import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/shared/code-block';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';

export const metadata: Metadata = {
  title: 'RAG + 3D Chat — Project Detail'
};

const diagram = `graph TD
  A[User Query] --> B[Embed Query]
  B --> C[Vector Search]
  C --> D[Top-K Documents]
  D --> E[Build Prompt]
  E --> F[LLM Response]
  F --> G{Contains 3D?}
  G -->|Yes| H[Render Three.js]
  G -->|No| I[Display Text]`;

const codeSnippet = `// Retrieval pipeline
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

const stack = ['Next.js', 'Three.js', 'OpenAI', 'Supabase', 'Thesys C1'];

export default function RagChatDetailPage() {
  return (
    <div className='relative text-white'>
      {/* Hero */}
      <section className='mx-auto max-w-4xl px-6 py-20'>
        <Badge variant='secondary' className='mb-4'>
          RAG
        </Badge>
        <h1 className='mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl'>
          RAG + 3D Chat
        </h1>
        <p className='text-muted-foreground mb-8 max-w-2xl text-lg'>
          Retrieval-augmented chat interface with document upload and Three.js
          visualization for spatial data.
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
      <section className='border-t border-white/[0.07] py-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Problem</h2>
          <p className='text-muted-foreground leading-relaxed'>
            Generic chatbots hallucinate when asked about private documentation.
            Users need answers grounded in their own files, with the ability to
            visualize structural or spatial outputs interactively.
          </p>
        </div>
      </section>

      {/* Solution + diagram */}
      <section className='border-t border-white/[0.07] py-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Solution</h2>
          <p className='text-muted-foreground mb-8 leading-relaxed'>
            Users upload PDFs or text, which are chunked and embedded into a
            Supabase vector store. Queries retrieve relevant context and feed it
            to the LLM along with the conversation. When responses contain
            spatial data, they render in an interactive Three.js viewer.
          </p>
          <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
            <MermaidDiagram chart={diagram} />
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className='border-t border-white/[0.07] py-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Tech Stack</h2>
          <div className='flex flex-wrap gap-2'>
            {stack.map((t) => (
              <Badge key={t} variant='outline'>
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Code snippet */}
      <section className='border-t border-white/[0.07] py-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Code</h2>
          <CodeBlock
            code={codeSnippet}
            language='typescript'
            filename='retrieve.ts'
          />
        </div>
      </section>
    </div>
  );
}
