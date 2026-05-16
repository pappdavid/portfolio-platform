'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconCheck
} from '@tabler/icons-react';

const STEPS = [
  { id: 'mode', label: 'Mode', detail: 'Repo · Docs · Paste' },
  { id: 'input', label: 'Input', detail: 'Source path or paste' },
  { id: 'config', label: 'Config', detail: 'Chunk size, prompt style' },
  { id: 'keys', label: 'Keys', detail: 'BYOK or demo mode' },
  { id: 'preview', label: 'Preview', detail: 'Inspect JSONL' },
  { id: 'train', label: 'Train', detail: 'Launch + monitor' }
];

const MODES = [
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

// 8-stage pipeline strip — reference modules/training.html line 41-50
const PIPELINE: Array<{ label: string; highlight: boolean }> = [
  { label: 'git_repo', highlight: false },
  { label: 'parser', highlight: true },
  { label: 'chunker', highlight: true },
  { label: 'prompt_gen', highlight: true },
  { label: 'jsonl', highlight: false },
  { label: 'validation', highlight: false },
  { label: 'fine_tune', highlight: false },
  { label: 'lora_adapter', highlight: true }
];

const WHY_LORA = [
  {
    tag: 'SMALL',
    body: 'Adapter weights are MBs, not GBs. Swap behaviors per request.'
  },
  {
    tag: 'CHEAP',
    body: 'Train on consumer GPUs or one A100 hour. No fleet required.'
  },
  {
    tag: 'REVERSIBLE',
    body: 'Bad fine-tune? Drop the adapter. The base model is untouched.'
  }
];

// Pipeline diagram — SVG with arrows between every adjacent stage so the
// data flow is explicit rather than just a row of labelled boxes. Highlighted
// stages (parser, chunker, prompt_gen, lora_adapter) wear the accent treatment.
function PipelineSvg() {
  const BOX_W = 116;
  const BOX_H = 38;
  const BOX_R = 8;
  const GAP = 18;
  const STEP = BOX_W + GAP;
  const Y = 36;
  const totalW = PIPELINE.length * STEP - GAP;

  return (
    <svg
      viewBox={`-4 0 ${totalW + 8} 90`}
      width='100%'
      role='img'
      aria-label={`Training pipeline: ${PIPELINE.map((p) => p.label).join(' → ')}`}
    >
      <defs>
        <marker
          id='train-arrow-accent'
          viewBox='0 0 10 10'
          refX='9'
          refY='5'
          markerWidth='6'
          markerHeight='6'
          orient='auto-start-reverse'
        >
          <path d='M0,1 L9,5 L0,9 z' fill='#22c55e' />
        </marker>
        <marker
          id='train-arrow-muted'
          viewBox='0 0 10 10'
          refX='9'
          refY='5'
          markerWidth='6'
          markerHeight='6'
          orient='auto-start-reverse'
        >
          <path d='M0,1 L9,5 L0,9 z' fill='rgba(255,255,255,0.35)' />
        </marker>
      </defs>

      {/* Arrows between adjacent stages */}
      {PIPELINE.slice(0, -1).map((_, i) => {
        const x1 = i * STEP + BOX_W;
        const x2 = (i + 1) * STEP;
        const accent = PIPELINE[i + 1].highlight;
        return (
          <line
            key={`p-arrow-${i}`}
            x1={x1 + 2}
            y1={Y + BOX_H / 2}
            x2={x2 - 2}
            y2={Y + BOX_H / 2}
            stroke={accent ? '#22c55e' : 'rgba(255,255,255,0.35)'}
            strokeWidth='1.25'
            strokeDasharray='3 3'
            markerEnd={
              accent ? 'url(#train-arrow-accent)' : 'url(#train-arrow-muted)'
            }
          />
        );
      })}

      {/* Stage boxes */}
      {PIPELINE.map((stage, i) => {
        const x = i * STEP;
        return (
          <g key={stage.label}>
            <rect
              x={x}
              y={Y}
              width={BOX_W}
              height={BOX_H}
              rx={BOX_R}
              fill={
                stage.highlight
                  ? 'rgba(34,197,94,0.06)'
                  : 'rgba(255,255,255,0.04)'
              }
              stroke={
                stage.highlight
                  ? 'rgba(34,197,94,0.28)'
                  : 'rgba(255,255,255,0.12)'
              }
            />
            <text
              x={x + BOX_W / 2}
              y={Y + BOX_H / 2 + 4}
              textAnchor='middle'
              fill={stage.highlight ? '#22c55e' : '#a8a39a'}
              fontFamily='JetBrains Mono'
              fontSize='11'
            >
              {stage.label}
            </text>
          </g>
        );
      })}

      {/* Pipeline label */}
      <text
        x={0}
        y={20}
        fill='#a8a39a'
        fontFamily='JetBrains Mono'
        fontSize='10.5'
        letterSpacing='0.18em'
      >
        DATASET PIPELINE
      </text>
    </svg>
  );
}

// Hero icon — stacked-layers from the reference (modules/training.html line 24)
function LayersIcon() {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    >
      <path d='M12 3 L21 8 L12 13 L3 8 Z' />
      <path d='M3 12 L12 17 L21 12' />
      <path d='M3 16 L12 21 L21 16' />
    </svg>
  );
}

// Sample JSONL — broken into tokens for syntax coloring in the .mod-terminal
const sampleJsonlLines: Array<Array<{ cls?: string; text: string }>> = [
  [{ cls: 'tc', text: '# output.jsonl · chat format' }],
  [{ text: '{' }, { cls: 'ts', text: '"messages"' }, { text: ': [' }],
  [
    { text: '  {' },
    { cls: 'ts', text: '"role"' },
    { text: ': ' },
    { cls: 'ts', text: '"system"' },
    { text: ', ' },
    { cls: 'ts', text: '"content"' },
    { text: ': ' },
    { cls: 'ts', text: '"You are a helpful code assistant."' },
    { text: '},' }
  ],
  [
    { text: '  {' },
    { cls: 'ts', text: '"role"' },
    { text: ': ' },
    { cls: 'ts', text: '"user"' },
    { text: ', ' },
    { cls: 'ts', text: '"content"' },
    { text: ': ' },
    { cls: 'ts', text: '"How do I create a Supabase client in Next.js?"' },
    { text: '},' }
  ],
  [
    { text: '  {' },
    { cls: 'ts', text: '"role"' },
    { text: ': ' },
    { cls: 'ts', text: '"assistant"' },
    { text: ', ' },
    { cls: 'ts', text: '"content"' },
    { text: ': ' },
    { cls: 'ts', text: '"Use createBrowserClient from @supabase/ssr…"' },
    { text: '}' }
  ],
  [{ text: ']}' }]
];

export function TrainingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState('repo');
  const [repoUrl, setRepoUrl] = useState('');
  const [startingTraining, setStartingTraining] = useState(false);

  const GITHUB_URL_RE = /^https:\/\/github\.com\/[^/]+\/[^/]+$/;
  const repoUrlValid = GITHUB_URL_RE.test(repoUrl.trim());

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

  const canAdvance =
    currentStep < STEPS.length - 1 && !(currentStep === 1 && !repoUrlValid);

  const handleStartTraining = async () => {
    setStartingTraining(true);
    try {
      const res = await fetch('/api/training/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed');
      setSubmittedWithKeys(!useDemoMode);
      toast.success(useDemoMode ? 'Demo job queued' : 'Training job submitted');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to start training'
      );
    } finally {
      setStartingTraining(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-0)' }}>
      <main className='mod-wrap' style={{ paddingBottom: 0 }}>
        {/* Hero */}
        <section style={{ padding: '80px 0 64px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 24
            }}
          >
            <div className='mod-icon'>
              <LayersIcon />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className='mod-eyebrow'>
                <span className='mod-dot' />
                <span className='mod-dash' />
                <span>MODULE 02 / TRAINING</span>
              </span>
              <h1
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-dp-sans), Inter Tight, sans-serif',
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.96,
                  color: 'var(--ink-0)'
                }}
              >
                Custom Training
              </h1>
            </div>
          </div>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--ink-2)',
              maxWidth: 720,
              margin: 0
            }}
          >
            Codebase → dataset → LoRA adapter, in your infra. Parse a repo,
            generate instruction-response pairs, validate JSONL, hand off to a
            fine-tune API. Bring your own keys, or run demo mode.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 28,
              flexWrap: 'wrap'
            }}
          >
            <span className='mod-status'>
              <span className='mod-status-dot' />
              847 examples / 45min A100
            </span>
            <span className='mod-status'>
              <span className='mod-status-dot' />
              BYOK · OpenAI / Anthropic / Google
            </span>
            <span className='mod-status'>
              <span className='mod-status-dot' />
              JSONL chat-format output
            </span>
          </div>
        </section>

        {/* // 01 Pipeline */}
        <section style={{ paddingBottom: 80 }}>
          <div className='mod-section-meta'>
            <span className='mod-section-num'>// 01</span>
            <span className='mod-section-line' />
            <span className='mod-section-label'>Pipeline</span>
          </div>
          <div
            className='mod-card'
            style={{
              background: 'var(--bg-1)',
              padding: 24,
              overflowX: 'auto'
            }}
          >
            <PipelineSvg />
          </div>
        </section>

        {/* // 02 Six-step wizard — interactive, preserved from prior impl */}
        <section style={{ paddingBottom: 80 }}>
          <div className='mod-section-meta'>
            <span className='mod-section-num'>// 02</span>
            <span className='mod-section-line' />
            <span className='mod-section-label'>Six-step wizard</span>
          </div>

          {/* Stepper with progress track behind the nodes */}
          <div
            role='tablist'
            aria-label='Training pipeline steps'
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))`,
              gap: 0,
              marginBottom: 24,
              paddingTop: 4,
              paddingBottom: 4
            }}
          >
            {/* Track: a full-width muted line that the accent track sits on
                top of, both centered on the node row. */}
            <div
              aria-hidden='true'
              style={{
                position: 'absolute',
                top: 20,
                left: `calc(100% / ${STEPS.length} / 2)`,
                right: `calc(100% / ${STEPS.length} / 2)`,
                height: 2,
                background: 'var(--border-subtle)',
                borderRadius: 1
              }}
            />
            <div
              aria-hidden='true'
              style={{
                position: 'absolute',
                top: 20,
                left: `calc(100% / ${STEPS.length} / 2)`,
                width:
                  currentStep === 0
                    ? 0
                    : `calc((100% - 100% / ${STEPS.length}) * ${currentStep} / ${STEPS.length - 1})`,
                height: 2,
                background: 'var(--accent)',
                borderRadius: 1,
                transition: 'width 0.25s ease'
              }}
            />

            {STEPS.map((step, i) => {
              const isDone = i < currentStep;
              const isCurrent = i === currentStep;
              const nodeBg = isCurrent
                ? 'var(--accent)'
                : isDone
                  ? 'var(--accent)'
                  : 'var(--bg-2)';
              const nodeBorder = isCurrent
                ? 'var(--accent)'
                : isDone
                  ? 'var(--accent)'
                  : 'var(--border-muted)';
              const nodeFg = isCurrent
                ? 'var(--bg-0)'
                : isDone
                  ? 'var(--bg-0)'
                  : 'var(--ink-3)';

              return (
                <button
                  key={step.id}
                  type='button'
                  role='tab'
                  aria-selected={isCurrent}
                  aria-current={isCurrent ? 'step' : undefined}
                  onClick={() => setCurrentStep(i)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer'
                  }}
                >
                  <span
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: nodeBg,
                      border: `1px solid ${nodeBorder}`,
                      fontFamily: 'var(--font-dp-mono), monospace',
                      fontSize: 12,
                      fontWeight: 500,
                      color: nodeFg,
                      transition:
                        'background 0.2s ease, border-color 0.2s ease, color 0.2s ease'
                    }}
                  >
                    {isDone ? <IconCheck className='h-4 w-4' /> : i + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dp-mono), monospace',
                      fontSize: 10.5,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: isCurrent
                        ? 'var(--ink-0)'
                        : isDone
                          ? 'var(--ink-1)'
                          : 'var(--ink-3)'
                    }}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active step panel */}
          <div className='mod-card' style={{ padding: 28 }}>
            <div
              style={{
                fontFamily: 'var(--font-dp-mono), monospace',
                fontSize: 11,
                letterSpacing: '0.16em',
                color: 'var(--accent)',
                marginBottom: 10
              }}
            >
              STEP {currentStep + 1} / {STEPS.length}
            </div>
            <h3
              style={{
                margin: '0 0 16px',
                fontFamily: 'var(--font-dp-sans), Inter Tight, sans-serif',
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: 'var(--ink-0)'
              }}
            >
              {STEPS[currentStep].label}
            </h3>

            {currentStep === 0 && (
              <div
                style={{
                  display: 'grid',
                  gap: 12,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
                }}
              >
                {MODES.map((mode) => {
                  const active = selectedMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type='button'
                      onClick={() => setSelectedMode(mode.id)}
                      style={{
                        textAlign: 'left',
                        padding: 16,
                        borderRadius: 10,
                        cursor: 'pointer',
                        background: active
                          ? 'var(--accent-soft)'
                          : 'var(--bg-3)',
                        border: `1px solid ${active ? 'var(--accent-line)' : 'var(--border-subtle)'}`
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'var(--ink-0)',
                          marginBottom: 4
                        }}
                      >
                        {mode.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: 'var(--ink-2)',
                          lineHeight: 1.5
                        }}
                      >
                        {mode.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 13,
                    color: 'var(--ink-1)'
                  }}
                >
                  GitHub repository URL
                </label>
                <input
                  type='url'
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder='https://github.com/user/repo'
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontFamily: 'var(--font-dp-mono), monospace',
                    fontSize: 13,
                    color: 'var(--ink-0)',
                    background: 'var(--bg-3)',
                    border: `1px solid ${
                      repoUrl && !repoUrlValid
                        ? '#ef4444'
                        : 'var(--border-muted)'
                    }`,
                    outline: 'none'
                  }}
                />
                {repoUrl && !repoUrlValid && (
                  <p
                    style={{
                      margin: '8px 0 0',
                      fontSize: 12,
                      color: '#ef4444'
                    }}
                  >
                    Must be a valid GitHub URL: https://github.com/user/repo
                  </p>
                )}
                {repoUrlValid && (
                  <p
                    style={{
                      margin: '8px 0 0',
                      fontSize: 12,
                      color: 'var(--accent-bright)'
                    }}
                  >
                    ✓ Valid URL
                  </p>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div
                style={{
                  display: 'grid',
                  gap: 12,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
                }}
              >
                {[
                  { label: 'Chunk size', value: '512 tokens' },
                  { label: 'Overlap', value: '64 tokens' },
                  { label: 'Prompt style', value: 'Q&A' },
                  { label: 'Target model', value: 'Llama 3.1 8B' },
                  { label: 'Max pairs/chunk', value: '3' },
                  { label: 'System prompt', value: 'Code assistant' }
                ].map((cfg) => (
                  <div
                    key={cfg.label}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-3)'
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-dp-mono), monospace',
                        fontSize: 10.5,
                        letterSpacing: '0.12em',
                        color: 'var(--ink-3)',
                        textTransform: 'uppercase',
                        marginBottom: 4
                      }}
                    >
                      {cfg.label}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--ink-0)' }}>
                      {cfg.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                {useDemoMode && (
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      border: '1px solid rgba(96,165,250,0.25)',
                      background: 'rgba(96,165,250,0.06)',
                      fontSize: 13,
                      color: '#93c5fd'
                    }}
                  >
                    Using demo mode — outputs are simulated. Provide a
                    HuggingFace token to run real training jobs.
                  </div>
                )}

                <KeyField
                  label='HuggingFace token'
                  value={huggingFaceToken}
                  onChange={setHuggingFaceToken}
                  show={showHfToken}
                  onToggle={() => setShowHfToken((v) => !v)}
                  placeholder='hf_…'
                />

                <label
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <button
                    type='button'
                    role='switch'
                    aria-checked={bringOwnKey}
                    onClick={() => setBringOwnKey((v) => !v)}
                    style={{
                      position: 'relative',
                      width: 36,
                      height: 20,
                      borderRadius: 999,
                      border: 'none',
                      cursor: 'pointer',
                      background: bringOwnKey
                        ? 'var(--accent)'
                        : 'var(--border-muted)'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        left: bringOwnKey ? 18 : 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#fff',
                        transition: 'left 0.15s'
                      }}
                    />
                  </button>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                    Bring your own LLM key
                  </span>
                </label>

                {bringOwnKey && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      padding: 16,
                      borderRadius: 10,
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-3)'
                    }}
                  >
                    <KeyField
                      label='OpenAI API key'
                      value={openaiKey}
                      onChange={setOpenaiKey}
                      show={showOpenai}
                      onToggle={() => setShowOpenai((v) => !v)}
                      placeholder='sk-…'
                    />
                    <KeyField
                      label='Anthropic API key'
                      value={anthropicKey}
                      onChange={setAnthropicKey}
                      show={showAnthropic}
                      onToggle={() => setShowAnthropic((v) => !v)}
                      placeholder='sk-ant-…'
                    />
                    <KeyField
                      label='Google API key'
                      value={googleKey}
                      onChange={setGoogleKey}
                      show={showGoogle}
                      onToggle={() => setShowGoogle((v) => !v)}
                      placeholder='AIza…'
                    />
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <pre className='mod-terminal'>
                {sampleJsonlLines.map((line, i) => (
                  <div key={i}>
                    {line.map((tok, j) =>
                      tok.cls ? (
                        <span key={j} className={tok.cls}>
                          {tok.text}
                        </span>
                      ) : (
                        <span key={j}>{tok.text}</span>
                      )
                    )}
                  </div>
                ))}
              </pre>
            )}

            {currentStep === 5 && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: 'var(--ink-1)',
                    lineHeight: 1.6
                  }}
                >
                  {useDemoMode
                    ? 'Running in demo mode — outputs will be simulated.'
                    : 'Dataset validated with 847 training examples. Estimated training time: ~45 minutes on A100.'}
                </div>
                <button
                  type='button'
                  className='dp-btn dp-btn-primary'
                  disabled={submittedWithKeys !== null || startingTraining}
                  onClick={handleStartTraining}
                  style={{
                    width: 'fit-content',
                    padding: '10px 24px',
                    fontSize: 13,
                    opacity:
                      startingTraining || submittedWithKeys !== null ? 0.7 : 1,
                    cursor:
                      startingTraining || submittedWithKeys !== null
                        ? 'not-allowed'
                        : 'pointer'
                  }}
                >
                  {startingTraining ? (
                    <>
                      <IconLoader2 className='h-4 w-4 animate-spin' />
                      Starting…
                    </>
                  ) : submittedWithKeys !== null ? (
                    useDemoMode ? (
                      'Demo job queued'
                    ) : (
                      'Training job submitted'
                    )
                  ) : useDemoMode ? (
                    'Start demo training'
                  ) : (
                    'Start training'
                  )}
                </button>
                {submittedWithKeys === true && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: 'var(--accent-bright)'
                    }}
                  >
                    Training job submitted using your keys.
                  </p>
                )}
                {submittedWithKeys === false && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: '#93c5fd'
                    }}
                  >
                    Demo job queued — outputs are simulated.
                  </p>
                )}
              </div>
            )}

            {/* Nav */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 28,
                paddingTop: 20,
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <button
                type='button'
                className='dp-btn dp-btn-ghost'
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                style={{
                  padding: '8px 16px',
                  fontSize: 13,
                  opacity: currentStep === 0 ? 0.4 : 1,
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                type='button'
                className='dp-btn dp-btn-ghost'
                onClick={() =>
                  setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))
                }
                disabled={!canAdvance}
                style={{
                  padding: '8px 16px',
                  fontSize: 13,
                  opacity: !canAdvance ? 0.4 : 1,
                  cursor: !canAdvance ? 'not-allowed' : 'pointer'
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </section>

        {/* // 03 Sample output (JSONL) */}
        <section style={{ paddingBottom: 80 }}>
          <div className='mod-section-meta'>
            <span className='mod-section-num'>// 03</span>
            <span className='mod-section-line' />
            <span className='mod-section-label'>Sample output (JSONL)</span>
          </div>
          <pre className='mod-terminal'>
            {sampleJsonlLines.map((line, i) => (
              <div key={i}>
                {line.map((tok, j) =>
                  tok.cls ? (
                    <span key={j} className={tok.cls}>
                      {tok.text}
                    </span>
                  ) : (
                    <span key={j}>{tok.text}</span>
                  )
                )}
              </div>
            ))}
          </pre>
        </section>

        {/* // 04 Why LoRA */}
        <section style={{ paddingBottom: 80 }}>
          <div className='mod-section-meta'>
            <span className='mod-section-num'>// 04</span>
            <span className='mod-section-line' />
            <span className='mod-section-label'>Why LoRA</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16
            }}
          >
            {WHY_LORA.map((item) => (
              <div key={item.tag} className='mod-tradeoff is-chose'>
                <div className='mod-tradeoff-tag'>{item.tag}</div>
                <p className='mod-tradeoff-body'>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer: prev/next module */}
        <nav className='mod-foot'>
          <a href='/chat' className='is-next'>
            → Next module: RAG + 3D Chat
          </a>
          <a href='/' className='is-back'>
            ← Back to homepage
          </a>
        </nav>
      </main>
    </div>
  );
}

function KeyField({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: 6,
          fontSize: 12.5,
          color: 'var(--ink-2)'
        }}
      >
        {label}
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 8,
            fontFamily: 'var(--font-dp-mono), monospace',
            fontSize: 13,
            color: 'var(--ink-0)',
            background: 'var(--bg-2)',
            border: '1px solid var(--border-muted)',
            outline: 'none'
          }}
        />
        <button
          type='button'
          onClick={onToggle}
          aria-label={`Toggle ${label} visibility`}
          className='dp-btn dp-btn-ghost'
          style={{
            padding: 10,
            minWidth: 40,
            justifyContent: 'center'
          }}
        >
          {show ? (
            <IconEyeOff className='h-4 w-4' />
          ) : (
            <IconEye className='h-4 w-4' />
          )}
        </button>
      </div>
    </div>
  );
}
