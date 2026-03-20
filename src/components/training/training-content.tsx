'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/shared/code-block';
import {
  IconBrain,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconInfoCircle,
  IconEye,
  IconEyeOff
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
    id: 'keys',
    label: 'API Keys',
    title: 'Credentials',
    description: 'Provide API keys or run in demo mode.'
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

function TrainingArchSvg() {
  const nodes = [
    {
      label: 'Git Repo',
      color: 'rgba(255,255,255,0.04)',
      stroke: 'rgba(255,255,255,0.09)',
      text: '#a1a1aa'
    },
    {
      label: 'Parser',
      color: 'rgba(168,85,247,0.06)',
      stroke: 'rgba(168,85,247,0.2)',
      text: '#a855f7'
    },
    {
      label: 'Chunker',
      color: 'rgba(168,85,247,0.06)',
      stroke: 'rgba(168,85,247,0.2)',
      text: '#a855f7'
    },
    {
      label: 'Prompt Gen',
      color: 'rgba(168,85,247,0.06)',
      stroke: 'rgba(168,85,247,0.2)',
      text: '#a855f7'
    },
    {
      label: 'JSONL',
      color: 'rgba(6,182,212,0.06)',
      stroke: 'rgba(6,182,212,0.2)',
      text: '#06b6d4'
    },
    {
      label: 'Validation',
      color: 'rgba(6,182,212,0.06)',
      stroke: 'rgba(6,182,212,0.2)',
      text: '#06b6d4'
    },
    {
      label: 'Fine-tune API',
      color: 'rgba(6,182,212,0.06)',
      stroke: 'rgba(6,182,212,0.2)',
      text: '#06b6d4'
    },
    {
      label: 'LoRA Adapter',
      color: 'rgba(6,182,212,0.06)',
      stroke: 'rgba(6,182,212,0.2)',
      text: '#06b6d4'
    }
  ];
  return (
    <svg
      viewBox='0 0 880 80'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='w-full'
      aria-label='Training pipeline: Git Repo to Parser to Chunker to Prompt Generator to JSONL to Validation to Fine-tune API to LoRA Adapter'
    >
      {nodes.map((node, i) => (
        <g key={node.label}>
          <rect
            x={i * 110}
            y='20'
            width='100'
            height='40'
            rx='7'
            fill={node.color}
            stroke={node.stroke}
            strokeWidth='1.5'
          />
          <text
            x={i * 110 + 50}
            y='45'
            textAnchor='middle'
            fill={node.text}
            fontSize='10'
            fontFamily='monospace'
          >
            {node.label}
          </text>
          {i < nodes.length - 1 && (
            <>
              <path
                d={`M${i * 110 + 102} 40 L${i * 110 + 108} 40`}
                stroke='rgba(255,255,255,0.15)'
                strokeWidth='1.5'
              />
              <polygon
                points={`${i * 110 + 108},36.5 ${i * 110 + 112},40 ${i * 110 + 108},43.5`}
                fill='rgba(255,255,255,0.2)'
              />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

export function TrainingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState('repo');

  // API keys state
  const [huggingFaceToken, setHuggingFaceToken] = useState('');
  const [bringOwnKey, setBringOwnKey] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [showHfToken, setShowHfToken] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [showGoogle, setShowGoogle] = useState(false);
  const [submittedWithKeys, setSubmittedWithKeys] = useState<boolean | null>(
    null
  );

  const useDemoMode =
    !huggingFaceToken && !openaiKey && !anthropicKey && !googleKey;

  return (
    <div className='flex flex-col'>
      <GridBackground />
      {/* Hero */}
      <section className='relative z-10 mx-auto max-w-4xl px-6 py-20'>
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
                  aria-label={`Go to step ${i + 1}`}
                  aria-current={i === currentStep ? 'step' : undefined}
                  className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                    i < currentStep
                      ? 'border-[#a855f7] bg-[#a855f7] text-black'
                      : i === currentStep
                        ? 'border-[#a855f7] text-[#a855f7]'
                        : 'border-white/20 text-[#52525b]'
                  )}
                >
                  {i < currentStep ? (
                    <IconCheck aria-hidden='true' className='h-4 w-4' />
                  ) : (
                    i + 1
                  )}
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
                        ? 'border-[#a855f7] bg-[rgba(168,85,247,0.05)] text-white'
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

            {/* API Keys (step 3) */}
            {currentStep === 3 && (
              <div className='space-y-4'>
                {useDemoMode && (
                  <div className='flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-sm text-blue-300'>
                    <IconInfoCircle className='mt-0.5 h-4 w-4 shrink-0' />
                    <span>
                      Using demo mode — outputs are simulated. Provide a
                      HuggingFace token to run real training jobs.
                    </span>
                  </div>
                )}

                {/* HuggingFace token */}
                <div className='space-y-1.5'>
                  <label className='text-sm font-medium text-white'>
                    HuggingFace Token
                  </label>
                  <div className='flex gap-2'>
                    <Input
                      type={showHfToken ? 'text' : 'password'}
                      value={huggingFaceToken}
                      onChange={(e) => setHuggingFaceToken(e.target.value)}
                      placeholder='hf_…'
                      className='border-white/[0.08] bg-white/[0.04] text-white placeholder:text-[#52525b]'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => setShowHfToken((v) => !v)}
                      className='shrink-0 text-[#71717a] hover:text-white'
                      aria-label='Toggle token visibility'
                    >
                      {showHfToken ? (
                        <IconEyeOff className='h-4 w-4' />
                      ) : (
                        <IconEye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Bring your own key toggle */}
                <div className='flex items-center gap-3'>
                  <button
                    type='button'
                    onClick={() => setBringOwnKey((v) => !v)}
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                      bringOwnKey ? 'bg-[#a855f7]' : 'bg-white/10'
                    )}
                    aria-checked={bringOwnKey}
                    role='switch'
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        bringOwnKey ? 'translate-x-4' : 'translate-x-0'
                      )}
                    />
                  </button>
                  <span className='text-sm text-[#71717a]'>
                    Bring your own LLM key
                  </span>
                </div>

                {bringOwnKey && (
                  <div className='space-y-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-4'>
                    {[
                      {
                        label: 'OpenAI API Key',
                        value: openaiKey,
                        setter: setOpenaiKey,
                        show: showOpenai,
                        setShow: setShowOpenai,
                        placeholder: 'sk-…'
                      },
                      {
                        label: 'Anthropic API Key',
                        value: anthropicKey,
                        setter: setAnthropicKey,
                        show: showAnthropic,
                        setShow: setShowAnthropic,
                        placeholder: 'sk-ant-…'
                      },
                      {
                        label: 'Google API Key',
                        value: googleKey,
                        setter: setGoogleKey,
                        show: showGoogle,
                        setShow: setShowGoogle,
                        placeholder: 'AIza…'
                      }
                    ].map((field) => (
                      <div key={field.label} className='space-y-1'>
                        <label className='text-xs text-[#71717a]'>
                          {field.label}
                        </label>
                        <div className='flex gap-2'>
                          <Input
                            type={field.show ? 'text' : 'password'}
                            value={field.value}
                            onChange={(e) => field.setter(e.target.value)}
                            placeholder={field.placeholder}
                            className='border-white/[0.08] bg-white/[0.04] text-white placeholder:text-[#52525b]'
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => field.setShow((v) => !v)}
                            className='shrink-0 text-[#71717a] hover:text-white'
                            aria-label={`Toggle ${field.label} visibility`}
                          >
                            {field.show ? (
                              <IconEyeOff className='h-4 w-4' />
                            ) : (
                              <IconEye className='h-4 w-4' />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Preview (step 4) */}
            {currentStep === 4 && (
              <CodeBlock
                code={sampleJsonl}
                language='json'
                filename='output.jsonl'
              />
            )}

            {/* Train (step 5) */}
            {currentStep === 5 && (
              <div className='space-y-4 text-center'>
                <IconBrain className='mx-auto h-16 w-16 text-[#a855f7]' />
                <p className='font-medium text-white'>Ready to fine-tune</p>
                {useDemoMode ? (
                  <p className='text-sm text-[#71717a]'>
                    Running in demo mode — outputs will be simulated.
                  </p>
                ) : (
                  <p className='text-sm text-[#71717a]'>
                    Dataset validated with 847 training examples. Estimated
                    training time: ~45 minutes on A100.
                  </p>
                )}
                <Button
                  size='lg'
                  disabled={submittedWithKeys !== null}
                  onClick={() => {
                    setSubmittedWithKeys(!useDemoMode);
                  }}
                >
                  {submittedWithKeys !== null
                    ? useDemoMode
                      ? 'Demo job queued'
                      : 'Training job submitted'
                    : useDemoMode
                      ? 'Start Demo Training'
                      : 'Start Training'}
                </Button>
                {submittedWithKeys === true && (
                  <p className='text-sm text-[#22c55e]'>
                    Training job submitted using your keys.
                  </p>
                )}
                {submittedWithKeys === false && (
                  <p className='text-sm text-blue-300'>
                    Demo job queued — outputs are simulated.
                  </p>
                )}
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
          <div className='overflow-x-auto rounded-xl border border-white/[0.07] bg-white/[0.04] p-6'>
            <TrainingArchSvg />
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
    </div>
  );
}
