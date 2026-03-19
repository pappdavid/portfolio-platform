import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/shared/code-block';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';

export const metadata: Metadata = {
  title: 'Custom Training — Project Detail'
};

const diagram = `graph LR
  A[Git Repo] --> B[File Scanner]
  B --> C[AST Parser]
  C --> D[Semantic Chunker]
  D --> E[Prompt Generator]
  E --> F[Quality Filter]
  F --> G[JSONL Output]
  G --> H[Fine-tune API]`;

const codeSnippet = `# Semantic chunking with overlap
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
        return chunks`;

const stack = ['Python', 'LLM Fine-tuning', 'LoRA', 'Supabase', 'Next.js'];

export default function TrainingDetailPage() {
  return (
    <div className='relative text-white'>
      {/* Hero */}
      <section className='mx-auto max-w-4xl px-6 py-20'>
        <Badge variant='secondary' className='mb-4'>
          Fine-tuning
        </Badge>
        <h1 className='mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl'>
          Custom Training Pipeline
        </h1>
        <p className='text-muted-foreground mb-8 max-w-2xl text-lg'>
          Automated pipeline to convert codebases into fine-tuning datasets.
          Supports LoRA adapters for any compatible model.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button asChild>
            <Link href='/training'>View live demo</Link>
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
            Turning internal codebases into fine-tuned models requires careful
            chunking, deduplication, and prompt formatting. Manual dataset
            creation is error-prone and hard to scale across multiple repos.
          </p>
        </div>
      </section>

      {/* Solution + diagram */}
      <section className='border-t border-white/[0.07] py-16'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='mb-4 text-2xl font-bold'>Solution</h2>
          <p className='text-muted-foreground mb-8 leading-relaxed'>
            The pipeline parses Git repositories, chunks code by semantic
            boundaries, and generates instruction-response pairs using a
            configurable prompt template. Output is OpenAI-compatible JSONL
            ready for fine-tuning with any LoRA framework.
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
            language='python'
            filename='chunker.py'
          />
        </div>
      </section>
    </div>
  );
}
