'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { CodeBlock } from '@/components/shared/code-block';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';
import {
  IconBrain,
  IconArrowRight,
  IconArrowLeft,
  IconCheck
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { GridBackground } from '@/components/ui/grid-background';
import { MonoEyebrow } from '@/components/ui/mono-eyebrow';

const steps = [
  {
    id: 'mode',
    label: 'Mode',
    title: 'Select Training Mode',
    description: 'Choose how you want to generate your dataset.'
  },
  {
    id: 'input',
    label: 'Input',
    title: 'Provide Source Data',
    description: 'Point to your codebase, docs, or paste text.'
  },
  {
    id: 'config',
    label: 'Config',
    title: 'Configure Pipeline',
    description: 'Set chunk size, prompt style, and model target.'
  },
  {
    id: 'preview',
    label: 'Preview',
    title: 'Preview Output',
    description: 'Review generated JSONL before training.'
  },
  {
    id: 'train',
    label: 'Train',
    title: 'Start Training',
    description: 'Launch the fine-tuning job.'
  }
];

const modes = [
  {
    id: 'repo',
    title: 'Repository',
    description: 'Parse a Git repo into instruction-response pairs'
  },
  {
    id: 'docs',
    title: 'Documentation',
    description: 'Convert markdown/text docs into Q&A format'
  },
  {
    id: 'paste',
    title: 'Paste',
    description: 'Paste raw text or code for manual dataset creation'
  }
];

const sampleJsonl = `{"messages":[{"role":"system","content":"You are a helpful code assistant."},{"role":"user","content":"How do I create a Supabase client in Next.js?"},{"role":"assistant","content":"Use createBrowserClient from @supabase/ssr:\\n\\nimport { createBrowserClient } from '@supabase/ssr';\\nexport const supabase = createBrowserClient(URL, KEY);"}]}
{"messages":[{"role":"system","content":"You are a helpful code assistant."},{"role":"user","content":"How do I protect a route with Clerk?"},{"role":"assistant","content":"Use clerkMiddleware in proxy.ts:\\n\\nimport { clerkMiddleware } from '@clerk/nextjs/server';\\nexport default clerkMiddleware();"}]}
{"messages":[{"role":"system","content":"You are a helpful code assistant."},{"role":"user","content":"How do I add rate limiting?"},{"role":"assistant","content":"Use @upstash/ratelimit with a sliding window:\\n\\nimport { Ratelimit } from '@upstash/ratelimit';\\nconst limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1h') });"}]}`;

const architectureChart = `graph LR
  A[Repository] --> B[Parser]
  B --> C[Chunker]
  C --> D[Prompt Generator]
  D --> E[JSONL Dataset]
  E --> F[Validation]
  F --> G[Fine-tune API]
  G --> H[LoRA Adapter]`;

const parserCode = `# Parse a Python repository into chunks
from training_pipeline import RepoParser

parser = RepoParser(
    repo_path="./my-project",
    extensions=[".py", ".ts", ".tsx"],
    ignore=["node_modules", ".git", "__pycache__"],
    chunk_size=512,
    overlap=64,
)

chunks = parser.parse()
print(f"Generated {len(chunks)} chunks")`;

const promptGenCode = `# Generate instruction-response pairs
from training_pipeline import PromptGenerator

generator = PromptGenerator(
    style="qa",           # qa | completion | chat
    system_prompt="You are a helpful code assistant.",
    max_pairs_per_chunk=3,
    model="gpt-4o-mini",  # for synthetic generation
)

dataset = generator.generate(chunks)
dataset.save("output.jsonl")`;

const faqItems = [
  {
    q: 'What models can I fine-tune?',
    a: 'The pipeline generates OpenAI-compatible JSONL. You can use it with OpenAI fine-tuning, Hugging Face Transformers, or any LoRA-compatible framework like Unsloth or axolotl.'
  },
  {
    q: 'How much data do I need?',
    a: 'For LoRA fine-tuning, 500-2000 high-quality examples typically produce good results. The pipeline can generate synthetic pairs from even small codebases.'
  },
  {
    q: 'Does my code leave my infrastructure?',
    a: 'Parsing and chunking run locally. The prompt generation step can use a local model (Ollama) or a cloud API — your choice. Training runs wherever you configure it.'
  },
  {
    q: 'Can I customize the prompt format?',
    a: 'Yes. The prompt generator supports multiple styles (Q&A, completion, multi-turn chat) and accepts custom system prompts and templates.'
  }
];

export function TrainingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState('repo');

  return (
    <div className='flex flex-col'>
      {/* Hero */}
      <section className='relative z-10 mx-auto max-w-4xl px-6 py-20'>
        <GridBackground />
        <MonoEyebrow color='purple' className='mb-6'>
          Fine-Tuning Pipeline
        </MonoEyebrow>
        <h1
          className='mb-4 text-5xl leading-[1.07] font-extrabold tracking-[-0.04em]'
          style={{
            background:
              'linear-gradient(160deg,#fff 0%,rgba(255,255,255,0.5) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Custom Training
        </h1>
        <p className='mb-8 max-w-2xl text-base leading-relaxed text-[#71717a]'>
          Turn your codebase into a fine-tuned model. Automated parsing, dataset
          generation, and training — all in your infrastructure.
        </p>
      </section>

      {/* Stepper Wizard */}
      <section className='border-y border-white/[0.07] bg-white/[0.015] py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-8 text-2xl font-bold text-white'>
            Pipeline Walkthrough
          </h2>

          {/* Step indicators */}
          <div className='mb-8 flex items-center justify-between'>
            {steps.map((step, i) => (
              <div key={step.id} className='flex flex-1 items-center'>
                <button
                  onClick={() => setCurrentStep(i)}
                  className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                    i < currentStep
                      ? 'border-[#a855f7] bg-[#a855f7] text-black'
                      : i === currentStep
                        ? 'border-[#a855f7] text-[#a855f7]'
                        : 'border-white/20 text-[#52525b]'
                  )}
                >
                  {i < currentStep ? <IconCheck className='h-4 w-4' /> : i + 1}
                </button>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-0.5 flex-1',
                      i < currentStep ? 'bg-[#a855f7]' : 'bg-white/10'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-8 backdrop-blur-sm'>
            <p className='mb-1 text-sm text-[#71717a]'>
              Step {currentStep + 1} of {steps.length}
            </p>
            <h3 className='mb-2 text-xl font-semibold text-white'>
              {steps[currentStep].title}
            </h3>
            <p className='mb-6 text-[#71717a]'>
              {steps[currentStep].description}
            </p>

            {/* Mode selection (step 0) */}
            {currentStep === 0 && (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={cn(
                      'rounded-lg border p-4 text-left transition-colors',
                      selectedMode === mode.id
                        ? 'border-[#a855f7] bg-[#a855f7]/[0.05] text-white'
                        : 'border-white/[0.07] text-[#71717a] hover:border-white/20'
                    )}
                  >
                    <h4 className='font-medium text-white'>{mode.title}</h4>
                    <p className='mt-1 text-sm text-[#71717a]'>
                      {mode.description}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Input (step 1) */}
            {currentStep === 1 && (
              <div className='space-y-4'>
                <div className='rounded-lg border border-white/[0.07] p-4'>
                  <p className='text-sm font-medium text-white'>
                    Source:{' '}
                    <span className='text-[#a855f7]'>{selectedMode}</span>
                  </p>
                  <p className='mt-2 text-sm text-[#71717a]'>
                    {selectedMode === 'repo'
                      ? 'Enter a Git repository URL or local path. The parser will extract .py, .ts, .tsx, .md files.'
                      : selectedMode === 'docs'
                        ? 'Upload markdown files or point to a documentation directory.'
                        : 'Paste code or text directly into the input area.'}
                  </p>
                </div>
                <div className='flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-white/[0.015]'>
                  <span className='text-sm text-[#71717a]'>
                    Input area (configured in dashboard)
                  </span>
                </div>
              </div>
            )}

            {/* Config (step 2) */}
            {currentStep === 2 && (
              <div className='grid grid-cols-2 gap-4'>
                {[
                  { label: 'Chunk Size', value: '512 tokens' },
                  { label: 'Overlap', value: '64 tokens' },
                  { label: 'Prompt Style', value: 'Q&A' },
                  { label: 'Target Model', value: 'Llama 3.1 8B' },
                  { label: 'Max Pairs/Chunk', value: '3' },
                  { label: 'System Prompt', value: 'Code assistant' }
                ].map((config) => (
                  <div
                    key={config.label}
                    className='rounded-lg border border-white/[0.07] p-3'
                  >
                    <p className='text-xs text-[#52525b]'>{config.label}</p>
                    <p className='text-sm font-medium text-white'>
                      {config.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Preview (step 3) */}
            {currentStep === 3 && (
              <CodeBlock
                code={sampleJsonl}
                language='json'
                filename='output.jsonl'
              />
            )}

            {/* Train (step 4) */}
            {currentStep === 4 && (
              <div className='space-y-4 text-center'>
                <IconBrain className='mx-auto h-16 w-16 text-[#a855f7]' />
                <p className='font-medium text-white'>Ready to fine-tune</p>
                <p className='text-sm text-[#71717a]'>
                  Dataset validated with 847 training examples. Estimated
                  training time: ~45 minutes on A100.
                </p>
                <Button size='lg' disabled>
                  Start Training (Demo)
                </Button>
              </div>
            )}

            {/* Navigation */}
            <div className='mt-8 flex justify-between'>
              <Button
                variant='outline'
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                <IconArrowLeft className='mr-2 h-4 w-4' />
                Back
              </Button>
              <Button
                onClick={() =>
                  setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
                }
                disabled={currentStep === steps.length - 1}
              >
                Next
                <IconArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-8 text-2xl font-bold text-white'>Architecture</h2>
          <div className='rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
            <MermaidDiagram chart={architectureChart} />
          </div>
        </div>
      </section>

      {/* Code Snippets */}
      <section className='border-y border-white/[0.07] bg-white/[0.015] py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-8 text-2xl font-bold text-white'>Code Examples</h2>
          <Tabs defaultValue='parser'>
            <TabsList>
              <TabsTrigger value='parser'>Parser</TabsTrigger>
              <TabsTrigger value='generator'>Prompt Generator</TabsTrigger>
            </TabsList>
            <TabsContent value='parser' className='mt-4'>
              <CodeBlock
                code={parserCode}
                language='python'
                filename='parse_repo.py'
              />
            </TabsContent>
            <TabsContent value='generator' className='mt-4'>
              <CodeBlock
                code={promptGenCode}
                language='python'
                filename='generate_prompts.py'
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='mb-8 text-2xl font-bold text-white'>FAQ</h2>
          <Accordion type='single' collapsible className='w-full'>
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent className='text-[#71717a]'>
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
