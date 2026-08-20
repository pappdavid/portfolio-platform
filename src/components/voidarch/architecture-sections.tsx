'use client';

import { useState } from 'react';
import {
  VOIDARCH_LAB_SIGNALS,
  VOIDARCH_PROJECTS
} from '@/lib/voidarch/architecture';
import styles from '@/app/voidarch/voidarch.module.css';

const contextSystems = {
  index: {
    label: 'Index',
    status: 'WORKING',
    title: 'Repository ingestion',
    text: 'Source and documentation are chunked into embedded SurrealKV records. BM25 is available immediately, so a fresh repository can retrieve useful context before vectors exist.',
    command: 'voidarch-context ingest',
    facts: ['embedded SurrealKV', 'BM25 ranking', 'secret-shaped files skipped']
  },
  graph: {
    label: 'Code graph',
    status: 'WORKING',
    title: 'Symbols and relationships',
    text: 'Tree-sitter extracts files, symbols, imports, and neighborhoods for TypeScript, TSX, JavaScript, and Python, with lighter fallbacks for other languages.',
    command: 'voidarch-context graph build',
    facts: [
      'Tree-sitter extraction',
      'file + symbol nodes',
      'import edges + neighborhood query'
    ]
  },
  vectors: {
    label: 'Vectors',
    status: 'OPTIONAL',
    title: 'Local semantic retrieval',
    text: 'Local ONNX embeddings use all-MiniLM-L6-v2. Remote OpenAI-compatible embeddings are opt-in and approval-gated rather than silently becoming a bill.',
    command:
      'voidarch-context models install && voidarch-context embed --approve',
    facts: [
      'all-MiniLM-L6-v2',
      'ONNX local inference',
      'explicit remote approval'
    ]
  },
  memory: {
    label: 'Durable memory',
    status: 'WORKING',
    title: 'Project decisions that survive sessions',
    text: 'Decisions, observations, run records, and context-pack history persist inside the repository instead of depending on one conversation transcript.',
    command: 'voidarch-context remember --kind decision "..."',
    facts: ['durable memories', 'run records', 'context-pack history']
  },
  knowledge: {
    label: 'Knowledge',
    status: 'WORKING',
    title: 'Entities, episodes, and temporal facts',
    text: 'Scoped entities, immutable source episodes, and temporal facts retain provenance and review state so derived knowledge stays attributable.',
    command: 'voidarch-context knowledge ...',
    facts: [
      'scoped entities',
      'immutable episodes',
      'temporal facts + provenance'
    ]
  },
  tasks: {
    label: 'Task state',
    status: 'WORKING',
    title: 'Operational continuity',
    text: 'Tasks and blockers persist beside repository knowledge, giving future sessions a compact continuation surface rather than a forensic transcript-reading exercise.',
    command: 'voidarch-context task ... / blocker ...',
    facts: ['persistent tasks', 'blockers', 'status + health inspection']
  }
} as const;

type ContextSystem = keyof typeof contextSystems;

function SectionHeading({
  index,
  title,
  lead
}: {
  index: string;
  title: string;
  lead: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <div className={styles.sectionIndex}>{index}</div>
      <div>
        <h2>{title}</h2>
        <p>{lead}</p>
      </div>
    </div>
  );
}

function ProjectSpine() {
  const core = VOIDARCH_PROJECTS.filter((project) => project.kind === 'core');
  const supporting = VOIDARCH_PROJECTS.filter(
    (project) => project.kind === 'supporting'
  );
  return (
    <section className={styles.longSection} id='systems'>
      <SectionHeading
        index='01 / PROJECT SPINE'
        title='The architecture is already split into real projects.'
        lead='Context, Router, and Studio are independently bounded implementations. AgentSec and saas-core are supporting systems whose lessons feed policy, contracts, and reusable infrastructure.'
      />
      <div className={styles.projectSpine}>
        <div className={styles.projectSpineRail} aria-hidden='true' />
        <div className={styles.projectGroupLabel}>CORE</div>
        {core.map((project, index) => (
          <article className={styles.projectRow} key={project.id}>
            <div className={styles.projectIndex}>0{index + 1}</div>
            <div className={styles.projectIdentity}>
              <div className={styles.projectTitleLine}>
                <h3>{project.title}</h3>
                <span>{project.maturity}</span>
              </div>
              <p>{project.role}</p>
              {project.repository ? (
                <a href={project.repository} target='_blank' rel='noreferrer'>
                  REPOSITORY ↗
                </a>
              ) : (
                <em>PRIVATE REPOSITORY</em>
              )}
            </div>
            <div className={styles.projectImplementation}>
              {project.implemented.slice(0, 4).map((fact) => (
                <span key={fact}>{fact}</span>
              ))}
            </div>
            <div className={styles.projectProof}>
              <b>VERIFICATION</b>
              <p>{project.verification[0]}</p>
            </div>
          </article>
        ))}
        <div
          className={`${styles.projectGroupLabel} ${styles.projectSupportingLabel}`}
        >
          SUPPORTING
        </div>
        {supporting.map((project, index) => (
          <article
            className={`${styles.projectRow} ${styles.projectRowSupporting}`}
            key={project.id}
          >
            <div className={styles.projectIndex}>S{index + 1}</div>
            <div className={styles.projectIdentity}>
              <div className={styles.projectTitleLine}>
                <h3>{project.title}</h3>
                <span>{project.maturity}</span>
              </div>
              <p>{project.role}</p>
              {project.repository && (
                <a href={project.repository} target='_blank' rel='noreferrer'>
                  REPOSITORY ↗
                </a>
              )}
            </div>
            <div className={styles.projectImplementation}>
              {project.implemented.slice(0, 3).map((fact) => (
                <span key={fact}>{fact}</span>
              ))}
            </div>
            <div className={styles.projectProof}>
              <b>CONTRIBUTES</b>
              <p>{project.contributes.join(' · ')}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExecutionPath() {
  const stages = [
    ['01', 'TASK', 'Repository task + current state', 'input'],
    ['02', 'CONTEXT', 'Ranked context pack + token budget', 'context'],
    ['03', 'ROUTER', 'Explainable plan + PreparedContextRequest', 'router'],
    ['04', 'STUDIO', 'Daemon-owned PTY / workflow execution', 'studio'],
    ['05', 'POLICY', 'Hooks + risk / approval decision', 'policy'],
    [
      '06',
      'EVIDENCE',
      'Run record · transcript · verification · state delta',
      'evidence'
    ]
  ] as const;
  return (
    <section className={styles.longSection} id='flow'>
      <SectionHeading
        index='02 / EXECUTION PATH'
        title='A task crosses six concrete boundaries.'
        lead='The architecture is useful only if the handoffs are explicit. Each boundary produces a typed or persisted artifact instead of hoping the next model infers what happened.'
      />
      <div className={styles.executionPath}>
        <svg
          viewBox='0 0 1320 320'
          aria-label='VoidArch concrete execution path'
        >
          <path className={styles.executionSpine} d='M85 158 H1235' />
          {stages.map(([n, title, copy, kind], index) => {
            const x = 95 + index * 226;
            return (
              <g
                key={title}
                className={
                  styles[
                    `executionStage${kind[0].toUpperCase()}${kind.slice(1)}` as keyof typeof styles
                  ]
                }
              >
                <circle cx={x} cy='158' r='13' />
                <text className={styles.executionNum} x={x} y='95'>
                  {n}
                </text>
                <text className={styles.executionTitle} x={x} y='124'>
                  {title}
                </text>
                <foreignObject x={x - 86} y='188' width='172' height='78'>
                  <div className={styles.executionCopy}>{copy}</div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
        <div className={styles.executionContracts}>
          <span>
            <b>Context output</b> Markdown / JSON context pack with estimated
            token metadata.
          </span>
          <span>
            <b>Router output</b> Stable route plan plus progressive-loading
            PreparedContextRequest.
          </span>
          <span>
            <b>Studio output</b> Run transcript, process state, tool activity,
            verification markers.
          </span>
        </div>
      </div>
    </section>
  );
}

function ContextDeepDive() {
  const [selected, setSelected] = useState<ContextSystem>('index');
  const current = contextSystems[selected];
  return (
    <section className={styles.longSection} id='context'>
      <SectionHeading
        index='03 / CONTEXT'
        title='Context is six systems before it is a prompt.'
        lead='The useful output is a small ranked context pack. Getting there requires repository storage, lexical retrieval, code structure, optional vectors, durable knowledge, and task continuity.'
      />
      <div className={styles.contextWorkbench}>
        <div className={styles.contextSystems}>
          {(Object.keys(contextSystems) as ContextSystem[]).map((id, index) => (
            <button
              type='button'
              key={id}
              aria-label={contextSystems[id].label}
              onClick={() => setSelected(id)}
              className={
                selected === id ? styles.contextSystemActive : undefined
              }
            >
              <span>0{index + 1}</span>
              <strong>{contextSystems[id].label}</strong>
              <small>{contextSystems[id].status}</small>
            </button>
          ))}
        </div>
        <div className={styles.contextAssembly} aria-hidden='true'>
          <svg viewBox='0 0 420 430'>
            <path d='M70 60 C160 75 174 132 210 196' />
            <path d='M350 60 C260 75 246 132 210 196' />
            <path d='M70 210 C140 210 160 210 210 210' />
            <path d='M350 210 C280 210 260 210 210 210' />
            <path d='M70 360 C155 345 178 290 210 224' />
            <path d='M350 360 C265 345 242 290 210 224' />
            <circle cx='210' cy='210' r='78' />
            <text x='210' y='202'>
              RANK + ASSEMBLE
            </text>
            <text x='210' y='222'>
              TOKEN BUDGET
            </text>
            <path className={styles.contextOutputPath} d='M210 288 L210 380' />
            <rect x='126' y='380' width='168' height='38' rx='3' />
            <text x='210' y='404'>
              CONTEXT PACK
            </text>
          </svg>
        </div>
        <div className={styles.contextDetail} data-testid='context-detail'>
          <div className={styles.contextDetailTopline}>
            <span>{current.status}</span>
            <b>{current.label}</b>
          </div>
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          <code>{current.command}</code>
          <ul>
            {current.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <a
            href='https://github.com/VoidArch-Labs/voidarch-context'
            target='_blank'
            rel='noreferrer'
          >
            OPEN VOIDARCH CONTEXT ↗
          </a>
        </div>
      </div>
      <div className={styles.contextVerification}>
        <b>CONSUMER VERIFICATION</b>
        <p>
          CI packs the package, installs it into a fresh temporary Git
          repository, then exercises init → ingest → graph → remember → search →
          query → context → status through the shipped binary.
        </p>
      </div>
    </section>
  );
}

function StudioDeepDive() {
  return (
    <section className={styles.longSection} id='studio'>
      <SectionHeading
        index='04 / STUDIO'
        title='Studio is a daemon before it is a dashboard.'
        lead='The browser is only a control surface. A localhost daemon owns sessions so PTYs, transcripts, worktrees, and run state survive independently of a tab or native window.'
      />
      <div className={styles.studioDeepDive}>
        <svg
          className={styles.studioTopologyV2}
          data-testid='studio-topology'
          viewBox='0 0 900 520'
          aria-label='VoidArch Studio daemon architecture'
        >
          <path d='M450 96 L450 150' />
          <path d='M450 226 C340 246 275 272 215 314' />
          <path d='M450 226 L450 314' />
          <path d='M450 226 C560 246 625 272 685 314' />
          <path d='M215 382 C300 402 355 412 450 430' />
          <path d='M450 382 L450 430' />
          <path d='M685 382 C600 402 545 412 450 430' />
          <path
            className={styles.studioDesktopLink}
            d='M720 150 C765 150 785 150 820 150'
          />

          <g className={styles.studioDaemonNode}>
            <rect x='320' y='150' width='260' height='76' rx='4' />
            <text x='450' y='181'>
              DAEMON
            </text>
            <text x='450' y='203'>
              127.0.0.1 · repository-scoped state
            </text>
          </g>
          <g>
            <rect x='318' y='32' width='264' height='64' rx='4' />
            <text x='450' y='59'>
              DASHBOARD
            </text>
            <text x='450' y='79'>
              WebSocket terminal + control APIs
            </text>
          </g>
          <g>
            <rect x='105' y='314' width='220' height='68' rx='4' />
            <text x='215' y='342'>
              PTY SESSIONS
            </text>
            <text x='215' y='362'>
              Claude · Codex · shell
            </text>
          </g>
          <g>
            <rect x='340' y='314' width='220' height='68' rx='4' />
            <text x='450' y='342'>
              WORKTREES
            </text>
            <text x='450' y='362'>
              create · diff · guarded delete
            </text>
          </g>
          <g>
            <rect x='575' y='314' width='220' height='68' rx='4' />
            <text x='685' y='342'>
              RUN RECORDS
            </text>
            <text x='685' y='362'>
              transcripts · orphan metadata
            </text>
          </g>
          <g className={styles.studioEvidenceNode}>
            <rect x='328' y='430' width='244' height='58' rx='4' />
            <text x='450' y='456'>
              OBSERVABILITY
            </text>
            <text x='450' y='475'>
              tools · verification · tokens · health
            </text>
          </g>
          <g className={styles.studioTauriNode}>
            <rect x='720' y='118' width='160' height='64' rx='4' />
            <text x='800' y='145'>
              TAURI SHELL
            </text>
            <text x='800' y='165'>
              thin native window
            </text>
          </g>
        </svg>
        <div className={styles.studioFactRail}>
          <div>
            <b>SESSION ENGINE</b>
            <span>input · resize · signal · kill · respawn APIs</span>
          </div>
          <div>
            <b>TERMINAL</b>
            <span>vendored xterm.js attached by WebSocket</span>
          </div>
          <div>
            <b>SAFETY</b>
            <span>
              fail-closed hooks before dangerous shell, protected files, or
              write-capable MCP
            </span>
          </div>
          <div>
            <b>CI</b>
            <span>
              real daemon + headless Chromium + API contract checks + Tauri
              compile
            </span>
          </div>
        </div>
      </div>
      <a
        className={styles.inlineRepoLink}
        href='https://github.com/VoidArch-Labs/voidarch-studio'
        target='_blank'
        rel='noreferrer'
      >
        OPEN VOIDARCH STUDIO ↗
      </a>
    </section>
  );
}

function PolicyLineage() {
  return (
    <section className={styles.longSection} id='policy'>
      <SectionHeading
        index='05 / POLICY'
        title='Security work became policy primitives.'
        lead='AgentSec proved the useful boundary: risk and approval decisions stay deterministic, while generated explanations remain presentation. Studio carries the same idea into local execution hooks.'
      />
      <div className={styles.policyLayout}>
        <svg
          className={styles.policyFlow}
          data-testid='policy-flow'
          viewBox='0 0 1000 360'
          aria-label='Agent action policy and approval flow'
        >
          <path d='M140 180 H310' />
          <path d='M450 180 H585' />
          <path d='M725 180 H850' />
          <path d='M655 215 V290 H810' />
          <path d='M655 145 V70 H810' />
          <g>
            <rect x='40' y='145' width='200' height='70' rx='4' />
            <text x='140' y='174'>
              AGENT ACTION
            </text>
            <text x='140' y='195'>
              shell · file · MCP · deploy
            </text>
          </g>
          <g className={styles.policyGateNode}>
            <rect x='310' y='135' width='140' height='90' rx='4' />
            <text x='380' y='169'>
              POLICY
            </text>
            <text x='380' y='190'>
              deterministic risk
            </text>
            <text x='380' y='207'>
              + rule match
            </text>
          </g>
          <g className={styles.policyApprovalNode}>
            <rect x='585' y='135' width='140' height='90' rx='4' />
            <text x='655' y='167'>
              REQUIRES_APPROVAL
            </text>
            <text x='655' y='190'>
              APPROVEOPS
            </text>
            <text x='655' y='207'>
              approve / reject
            </text>
          </g>
          <g className={styles.policyAllowNode}>
            <rect x='810' y='38' width='150' height='66' rx='4' />
            <text x='885' y='68'>
              ALLOW
            </text>
            <text x='885' y='87'>
              continue + audit
            </text>
          </g>
          <g className={styles.policyBlockNode}>
            <rect x='810' y='257' width='150' height='66' rx='4' />
            <text x='885' y='287'>
              BLOCK
            </text>
            <text x='885' y='306'>
              abort + audit
            </text>
          </g>
          <text className={styles.policyBranchLabel} x='748' y='64'>
            LOW / PERMITTED
          </text>
          <text className={styles.policyBranchLabel} x='750' y='311'>
            REJECT / FORBIDDEN
          </text>
        </svg>
        <div className={styles.policyModules}>
          <div>
            <b>PromptShield</b>
            <span>deterministic prompt-pattern findings</span>
          </div>
          <div>
            <b>MCP Guard Lite</b>
            <span>declared tool capability + missing-control analysis</span>
          </div>
          <div>
            <b>AgentMap</b>
            <span>agent inventory + explainable readiness/risk scoring</span>
          </div>
          <div>
            <b>ApproveOps</b>
            <span>
              pending request → human decision → SecurityEvent audit trail
            </span>
          </div>
          <div>
            <b>Studio hooks</b>
            <span>
              protected files · dangerous shell · write-capable MCP ·
              verification gates
            </span>
          </div>
        </div>
      </div>
      <a
        className={styles.inlineRepoLink}
        href='https://github.com/VoidArch-Labs/AgentSec'
        target='_blank'
        rel='noreferrer'
      >
        OPEN AGENTSEC SUITE ↗
      </a>
    </section>
  );
}

function LabSignals() {
  return (
    <section className={styles.longSection} id='labs'>
      <SectionHeading
        index='06 / APPLIED LAB'
        title='Product experiments exposed the same infrastructure problems.'
        lead='The important part of the earlier products is not the product catalogue. It is the repeated shape underneath them. That repetition is what justified extracting reusable infrastructure.'
      />
      <div className={styles.labLedger}>
        <div className={styles.labLedgerHead}>
          <span>DOMAIN</span>
          <span>EXPERIMENT</span>
          <span>RECURRING SYSTEM</span>
          <span>EXTRACTED PRIMITIVE</span>
        </div>
        {VOIDARCH_LAB_SIGNALS.map((signal, index) => (
          <article key={signal.domain}>
            <span className={styles.labNum}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <b>{signal.domain}</b>
            <p>{signal.experiment}</p>
            <p>{signal.recurringSystems}</p>
            <strong>{signal.extractedPrimitive}</strong>
          </article>
        ))}
      </div>
      <p className={styles.labNote}>
        These experiments are lineage evidence, not claims that every historical
        product is a maintained VoidArch module.
      </p>
    </section>
  );
}

function Missing() {
  const columns = [
    {
      label: 'NOW',
      items: [
        'Wire Router adapters into real Studio and Hermes execution surfaces.',
        'Persist route outcomes and reliability signals back into Context.',
        'Unify Studio verification markers and AgentSec audit events into one evidence contract.',
        'Finish stable package / release paths for Context and Studio.'
      ]
    },
    {
      label: 'NEXT',
      items: [
        'Context budget scheduler over memory, code graph, docs, tool results, and task state.',
        'Held-out route evaluation and optional specialist router model.',
        'Execution replay and stronger operator intervention surfaces.',
        'Cross-project capability registry sourced from real implementations.'
      ]
    },
    {
      label: 'LATER',
      items: [
        'Evidence-gated primitive promotion and constrained self-improvement.',
        'OS-level context, routing, and control surfaces inside Void-Arch.',
        'Long-horizon adaptation that remains reversible and inspectable.'
      ]
    }
  ];
  return (
    <section className={styles.longSection} id='missing'>
      <SectionHeading
        index='07 / GAPS'
        title='What is still missing.'
        lead='The roadmap is narrower than the old horizon diagram suggested. The immediate work is integration and evidence, not inventing another dozen boxes.'
      />
      <div className={styles.gapColumns}>
        {columns.map((column) => (
          <article key={column.label}>
            <span>{column.label}</span>
            <ol>
              {column.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
        ))}
      </div>
      <div className={styles.voidArchFuture}>
        <span>FUTURE / VOID-ARCH</span>
        <p>
          The destination is still an AI-native operating environment, but the
          credible path runs through working repository context, explicit
          routing, local execution ownership, policy, and evidence first.
        </p>
      </div>
    </section>
  );
}

export function ArchitectureSections() {
  return (
    <>
      <ProjectSpine />
      <ExecutionPath />
      <ContextDeepDive />
      <StudioDeepDive />
      <PolicyLineage />
      <LabSignals />
      <Missing />
    </>
  );
}
