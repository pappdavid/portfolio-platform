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
  title: 'Custom Training Pipeline',
  description:
    'Automated pipeline converting codebases into LoRA fine-tuning datasets.',
  slug: 'training'
});

const nodes: ArchNode[] = [
  {
    id: 'repo',
    label: 'Git Repo',
    tooltip: 'Source codebase or documentation to train on',
    color: 'default',
    x: 0,
    y: 80
  },
  {
    id: 'scanner',
    label: 'File Scanner',
    tooltip: 'Walks the repo, filters by language and file type',
    color: 'cyan',
    x: 200,
    y: 80
  },
  {
    id: 'ast',
    label: 'AST Parser',
    tooltip: 'Builds abstract syntax tree per file to find semantic boundaries',
    color: 'cyan',
    x: 400,
    y: 80
  },
  {
    id: 'chunk',
    label: 'Semantic Chunker',
    tooltip: 'Splits by function/class boundaries with configurable overlap',
    color: 'cyan',
    x: 600,
    y: 80
  },
  {
    id: 'prompt',
    label: 'Prompt Generator',
    tooltip: 'Wraps each chunk in an instruction-response template',
    color: 'purple',
    x: 800,
    y: 80
  },
  {
    id: 'filter',
    label: 'Quality Filter',
    tooltip: 'Drops duplicates, short chunks, and low-signal examples',
    color: 'cyan',
    x: 1000,
    y: 80
  },
  {
    id: 'jsonl',
    label: 'JSONL Output',
    tooltip: 'OpenAI-compatible format ready for any LoRA framework',
    color: 'cyan',
    x: 1200,
    y: 80
  },
  {
    id: 'lora',
    label: 'LoRA Fine-tune',
    tooltip: 'Low-rank adapter training — works with Axolotl, unsloth, etc.',
    color: 'purple',
    x: 1400,
    y: 80
  },
  {
    id: 'eval',
    label: 'Eval',
    tooltip: 'Validation loss + sample generation to measure adapter quality',
    color: 'purple',
    x: 1600,
    y: 80
  }
];

const edges: ArchEdge[] = [
  { id: 'e1', from: 'repo', to: 'scanner' },
  { id: 'e2', from: 'scanner', to: 'ast' },
  { id: 'e3', from: 'ast', to: 'chunk' },
  { id: 'e4', from: 'chunk', to: 'prompt' },
  { id: 'e5', from: 'prompt', to: 'filter' },
  { id: 'e6', from: 'filter', to: 'jsonl' },
  { id: 'e7', from: 'jsonl', to: 'lora' },
  { id: 'e8', from: 'lora', to: 'eval' }
];

const codeSnippet = `# Semantic chunking with AST-aware boundaries
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

export default function TrainingDetailPage() {
  return (
    <div className='mx-auto max-w-4xl px-6 py-20 text-white'>
      {/* Hero */}
      <section className='mb-16'>
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
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Problem</h2>
        <p className='text-muted-foreground leading-relaxed'>
          Turning internal codebases into fine-tuned models requires careful
          chunking, deduplication, and prompt formatting. Manual dataset
          creation is error-prone and impossible to scale across multiple
          repositories or languages. Most off-the-shelf tools don&apos;t respect
          semantic boundaries — they split mid-function, degrading training
          signal.
        </p>
      </section>

      {/* What this demonstrates */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>What this demonstrates</h2>
        <ul className='text-muted-foreground list-inside list-disc space-y-3 leading-relaxed'>
          <li>
            AST-aware chunking strategy that respects function and class
            boundaries to preserve training signal
          </li>
          <li>
            Configurable instruction-response template system compatible with
            OpenAI fine-tuning format and Axolotl/unsloth
          </li>
          <li>
            Quality filtering pipeline that deduplicates and removes low-signal
            examples before training
          </li>
        </ul>
      </section>

      {/* Architecture */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Architecture</h2>
        <ArchDiagram nodes={nodes} edges={edges} height={200} />
      </section>

      {/* Tech stack */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Tech stack</h2>
        <ul className='text-muted-foreground space-y-3 leading-relaxed'>
          <li>
            <strong className='text-white'>Python:</strong> AST parsing via
            stdlib ast module; language-agnostic chunking for Python,
            TypeScript, and Go.
          </li>
          <li>
            <strong className='text-white'>LoRA / PEFT:</strong> Low-rank
            adapter training keeps base model weights frozen; adapters are
            &lt;100MB per fine-tune.
          </li>
          <li>
            <strong className='text-white'>Supabase:</strong> Dataset and job
            metadata storage; training jobs tracked with status and output
            paths.
          </li>
          <li>
            <strong className='text-white'>Next.js API routes:</strong> Job
            submission and status polling endpoints consumed by the dashboard.
          </li>
        </ul>
      </section>

      {/* Code */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Code</h2>
        <CodeBlock code={codeSnippet} language='python' filename='chunker.py' />
      </section>

      {/* Results */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Results</h2>
        <ul className='text-muted-foreground list-inside list-disc space-y-3 leading-relaxed'>
          <li>
            Reference implementation — training jobs run against external
            fine-tuning APIs, not self-hosted
          </li>
          <li>
            Demonstrates end-to-end dataset generation from a real TypeScript
            codebase to OpenAI-compatible JSONL
          </li>
          <li>
            Chunker produces ~3× more usable training pairs than naive
            line-split on the same source
          </li>
        </ul>
      </section>

      {/* Screenshots */}
      <section className='mb-16 border-t border-white/[0.07] pt-16'>
        <h2 className='mb-4 text-2xl font-bold'>Screenshots</h2>
        <div className='grid gap-4 md:grid-cols-2'>
          <Image
            src='/screenshots/training/desktop.png'
            alt='Training pipeline dashboard — desktop view'
            width={800}
            height={500}
            className='w-full rounded-lg border border-white/[0.07] object-cover'
          />
          <Image
            src='/screenshots/training/mobile.png'
            alt='Training pipeline dashboard — mobile view'
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
          Dataset schema, training job API routes, and the chunker are in this
          repo. Full Python pipeline available on request.
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
