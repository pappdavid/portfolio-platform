'use client';

import { useState } from 'react';
import { VOIDARCH_EVIDENCE, VOIDARCH_NODES } from '@/lib/voidarch/architecture';
import styles from '@/app/voidarch/voidarch.module.css';

const memoryKinds = {
  semantic: {
    label: 'Semantic',
    kicker: 'SEMANTIC MEMORY',
    title: 'Durable entities and facts',
    text: 'Stable facts, entities, preferences, capabilities, and relationships that remain useful across many tasks.',
    meta: 'LIFETIME: LONG · PROVENANCE: REQUIRED · STATUS: WORKING'
  },
  episodic: {
    label: 'Episodic',
    kicker: 'EPISODIC MEMORY',
    title: 'What happened during a run',
    text: 'Decisions, failures, outcomes, artifacts, and observed context tied to specific executions.',
    meta: 'LIFETIME: MEDIUM · TRACE-LINKED · STATUS: WORKING'
  },
  operational: {
    label: 'Operational',
    kicker: 'OPERATIONAL MEMORY',
    title: 'State required to continue work',
    text: 'Tasks, blockers, goals, dependencies, deadlines, and handoff state used by long-running workflows.',
    meta: 'LIFETIME: TASK-BOUND · STATUS: WORKING'
  },
  derived: {
    label: 'Derived',
    kicker: 'CONSOLIDATED MEMORY',
    title: 'Patterns extracted from repetition',
    text: 'Higher-level concepts inferred from multiple episodes while retaining links back to their evidence.',
    meta: 'LIFETIME: LONG · STATUS: PLANNED'
  },
  failure: {
    label: 'Failure',
    kicker: 'FAILURE MEMORY',
    title: 'What not to rediscover',
    text: 'Known bad approaches, invalid assumptions, broken tools, and recovery procedures.',
    meta: 'LIFETIME: LONG · STATUS: PLANNED'
  },
  temporary: {
    label: 'Temporary',
    kicker: 'WORKING CONTEXT',
    title: 'Short-lived execution state',
    text: 'Task-specific scratch state assembled from durable memory and discarded or summarized afterward.',
    meta: 'LIFETIME: SHORT · STATUS: PROTOTYPE'
  }
} as const;

type MemoryKind = keyof typeof memoryKinds;

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

export function ArchitectureSections() {
  const [memoryKind, setMemoryKind] = useState<MemoryKind>('semantic');
  const memory = memoryKinds[memoryKind];
  const coreNodes = VOIDARCH_NODES.filter((node) => node.group === 'core');

  return (
    <>
      <section className={styles.longSection} id='architecture'>
        <SectionHeading
          index='01 / ARCHITECTURE'
          title='Three layers, one shared trace.'
          lead='Context remembers. Router decides. Studio executes. Each layer owns a different class of failure while evidence crosses all three.'
        />
        <div className={styles.responsibilityTable}>
          {coreNodes.map((node, index) => (
            <div className={styles.responsibilityRow} key={node.id}>
              <span>0{index + 1}</span>
              <h3>{node.title}</h3>
              <p>{node.summary}</p>
              <b>{node.maturity}</b>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.longSection} id='evidence'>
        <SectionHeading
          index='02 / EVIDENCE'
          title='One click beneath every major claim.'
          lead='The public story stays concise because implementation, evaluation, and provenance sit directly underneath the architecture.'
        />
        <div className={styles.evidenceGrid}>
          {Object.entries(VOIDARCH_EVIDENCE).flatMap(([system, items]) =>
            items.map((item) => (
              <article className={styles.evidenceCard} key={item.id}>
                <span>
                  {system.toUpperCase()} / {item.maturity}
                </span>
                <h3>{item.label}</h3>
                <p>{item.summary}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className={styles.longSection} id='horizon'>
        <SectionHeading
          index='03 / SYSTEM HORIZON'
          title='The architecture expands in layers, not feature lists.'
          lead='Current capability sits closest to the core. Experimental and planned systems live further out so ambition stays visible without being confused for shipped functionality.'
        />
        <div className={styles.horizon}>
          <div className={styles.horizonAxis}>
            <span>NOW</span>
            <span>NEAR</span>
            <span>LATER</span>
            <span>FUTURE</span>
          </div>
          <div className={styles.horizonLane}>
            <b>CONTEXT</b>
            <i style={{ left: '6%', width: '30%' }}>
              Transactional state · WORKING
            </i>
            <i style={{ left: '39%', width: '25%' }}>
              Context budget scheduler · PROTOTYPE
            </i>
            <i style={{ left: '68%', width: '25%' }}>Consolidation · PLANNED</i>
          </div>
          <div className={styles.horizonLane}>
            <b>ROUTING</b>
            <i style={{ left: '10%', width: '28%' }}>
              Capability graph · PROTOTYPE
            </i>
            <i style={{ left: '43%', width: '22%' }}>
              Specialist router · PLANNED
            </i>
            <i style={{ left: '70%', width: '22%' }}>
              Adaptive policy · PLANNED
            </i>
          </div>
          <div className={styles.horizonLane}>
            <b>EXECUTION</b>
            <i style={{ left: '6%', width: '30%' }}>
              Execution ledger · ACTIVE
            </i>
            <i style={{ left: '42%', width: '25%' }}>
              Verification fabric · PLANNED
            </i>
            <i style={{ left: '73%', width: '20%' }}>Void-Arch · FUTURE</i>
          </div>
        </div>
      </section>

      <section className={styles.longSection} id='memory'>
        <SectionHeading
          index='04 / MEMORY MODEL'
          title='Memory has topology, lifecycle, and weight.'
          lead='Different kinds of state should behave differently. Working context is assembled from durable memory instead of becoming one infinite vector bucket.'
        />
        <div className={styles.memoryOrbit}>
          <div className={styles.orbitStage}>
            <span className={`${styles.orbitRing} ${styles.ringOne}`} />
            <span className={`${styles.orbitRing} ${styles.ringTwo}`} />
            <span className={`${styles.orbitRing} ${styles.ringThree}`} />
            <div className={styles.memoryCore}>
              <small>WORKING</small>
              <b>CONTEXT</b>
            </div>
            {(Object.keys(memoryKinds) as MemoryKind[]).map((id, index) => (
              <button
                type='button'
                key={id}
                aria-label={memoryKinds[id].label}
                className={`${styles.memoryNode} ${styles[`memoryNode${index + 1}` as keyof typeof styles]} ${memoryKind === id ? styles.memoryNodeActive : ''}`}
                onClick={() => setMemoryKind(id)}
              >
                <small>{memoryKinds[id].kicker}</small>
                <b>{memoryKinds[id].label}</b>
              </button>
            ))}
          </div>
          <div className={styles.memoryDetail} data-testid='memory-detail'>
            <span>{memory.kicker}</span>
            <h3>{memory.title}</h3>
            <p>{memory.text}</p>
            <b>{memory.meta}</b>
          </div>
        </div>
      </section>

      <section className={styles.longSection} id='routing'>
        <SectionHeading
          index='05 / ROUTING MODEL'
          title='A request becomes a route through constraints.'
          lead='The router narrows intent into the cheapest reliable path that still satisfies capability, latency, cost, and policy requirements.'
        />
        <div className={styles.routingFigure}>
          <svg
            viewBox='0 0 1200 420'
            aria-label='VoidArch routing decision flow'
          >
            <defs>
              <linearGradient id='routeGradient' x1='0' x2='1'>
                <stop offset='0' stopColor='#d6ff68' />
                <stop offset='.55' stopColor='#5ee6ff' />
                <stop offset='1' stopColor='#9d7dff' />
              </linearGradient>
            </defs>
            <path
              className={styles.routeRibbon}
              d='M90 210 C230 210 230 110 360 110 C500 110 515 175 645 175 C800 175 825 92 955 92 C1080 92 1080 210 1140 210'
            />
            <path
              className={styles.routeRibbonFaint}
              d='M90 210 C230 210 245 310 360 310 C500 310 525 250 645 250 C790 250 840 320 955 320 C1080 320 1085 250 1140 210'
            />
            {[
              [90, 210, 'REQUEST'],
              [360, 110, 'INTENT'],
              [645, 175, 'CANDIDATES'],
              [955, 92, 'SCORE'],
              [1140, 210, 'EXECUTE']
            ].map(([x, y, label]) => (
              <g key={String(label)}>
                <circle cx={Number(x)} cy={Number(y)} r='20' />
                <text x={Number(x)} y={Number(y) - 34}>
                  {label}
                </text>
              </g>
            ))}
            {[
              [360, 310, 'POLICY FILTER'],
              [645, 250, 'COST / LATENCY'],
              [955, 320, 'FALLBACK']
            ].map(([x, y, label]) => (
              <g key={String(label)}>
                <rect
                  x={Number(x) - 70}
                  y={Number(y) - 22}
                  width='140'
                  height='44'
                  rx='2'
                />
                <text x={Number(x)} y={Number(y) + 4}>
                  {label}
                </text>
              </g>
            ))}
          </svg>
          <div className={styles.routeNotes}>
            <div>
              <b>INTENT</b>
              <span>task type · risk · latency · reasoning depth</span>
            </div>
            <div>
              <b>CANDIDATES</b>
              <span>models · tools · skills · agents</span>
            </div>
            <div>
              <b>SCORE</b>
              <span>capability · cost · quota · reliability</span>
            </div>
            <div>
              <b>OUTCOME</b>
              <span>verification feeds future decisions</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.longSection} id='studio'>
        <SectionHeading
          index='06 / STUDIO'
          title='An operational runway for live work.'
          lead='Mission state, execution topology, live trace, and intervention controls form a working surface rather than another chat window.'
        />
        <div className={styles.studioSurface}>
          <div className={styles.studioRibbon}>
            <span>RUN / RESEARCH_PIPELINE_04</span>
            <span>QUEUE 12</span>
            <span>WORKERS 06</span>
            <span>GROUNDING 93%</span>
          </div>
          <div className={styles.studioColumns}>
            <div className={styles.missionPanel}>
              <small>MISSION STATE</small>
              <h3>Collect → synthesize → verify → persist.</h3>
              <dl>
                <div>
                  <dt>STATUS</dt>
                  <dd>RUNNING</dd>
                </div>
                <div>
                  <dt>COST</dt>
                  <dd>€0.18 / run</dd>
                </div>
                <div>
                  <dt>LATENCY</dt>
                  <dd>14.2 s avg</dd>
                </div>
              </dl>
            </div>
            <svg
              className={styles.studioTopology}
              data-testid='studio-topology'
              viewBox='0 0 720 430'
              aria-label='Studio execution topology'
            >
              <path d='M360 72 L360 116' />
              <path d='M360 116 C270 126 205 145 150 177' />
              <path d='M360 116 L360 177' />
              <path d='M360 116 C450 126 515 145 570 177' />
              <path d='M150 237 C215 254 275 272 360 295' />
              <path d='M360 237 L360 295' />
              <path d='M570 237 C505 254 445 272 360 295' />
              <path d='M360 345 L360 378' />
              <g className={styles.topologyMain}>
                <rect x='265' y='28' width='190' height='60' rx='3' />
                <text x='360' y='55'>
                  ORCHESTRATOR
                </text>
                <text x='360' y='72'>
                  plan · coordinate · adapt
                </text>
              </g>
              <g>
                <rect x='75' y='177' width='150' height='60' rx='3' />
                <text x='150' y='203'>
                  SEARCH
                </text>
                <text x='150' y='220'>
                  discover sources
                </text>
              </g>
              <g>
                <rect x='285' y='177' width='150' height='60' rx='3' />
                <text x='360' y='203'>
                  RETRIEVAL
                </text>
                <text x='360' y='220'>
                  rank context
                </text>
              </g>
              <g>
                <rect x='495' y='177' width='150' height='60' rx='3' />
                <text x='570' y='203'>
                  REASONING
                </text>
                <text x='570' y='220'>
                  synthesize
                </text>
              </g>
              <g className={styles.topologyVerify}>
                <rect x='280' y='295' width='160' height='50' rx='3' />
                <text x='360' y='319'>
                  VERIFY
                </text>
                <text x='360' y='335'>
                  check · score · validate
                </text>
              </g>
              <g className={styles.topologyOutput}>
                <rect x='225' y='378' width='270' height='42' rx='3' />
                <text x='360' y='403'>
                  ARTIFACT / STATE DELTA
                </text>
              </g>
            </svg>
            <div className={styles.tracePanel}>
              <small>TRACE + CONTROLS</small>
              <pre>{`18:42:09 context assembled\n18:42:10 route selected\n18:42:13 14 sources retrieved\n18:42:18 verify: grounded\n18:42:19 memory delta +2`}</pre>
              <button type='button'>PAUSE WORKFLOW</button>
              <button type='button'>REROUTE TASK</button>
              <button type='button'>REQUIRE APPROVAL</button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.longSection} id='adaptation'>
        <SectionHeading
          index='07 / ADAPTATION'
          title='Self-improvement as a controlled loop.'
          lead='The useful form of adaptation is narrow and inspectable: observe failure, propose a primitive, sandbox it, and promote only after evidence.'
        />
        <div className={styles.adaptationLoop}>
          <div className={styles.loopCore}>
            <small>REUSABLE</small>
            <b>PRIMITIVE</b>
          </div>
          {[
            ['01', 'OBSERVE', 'repeat failures'],
            ['02', 'PROPOSE', 'candidate fix'],
            ['03', 'SANDBOX', 'replay + eval'],
            ['04', 'PROMOTE', 'version + rollback']
          ].map(([n, title, copy], index) => (
            <div
              key={title}
              className={`${styles.loopStep} ${styles[`loopStep${index + 1}` as keyof typeof styles]}`}
            >
              <b>{n}</b>
              <span>{title}</span>
              <small>{copy}</small>
            </div>
          ))}
          <svg viewBox='0 0 520 520' aria-hidden='true'>
            <circle cx='260' cy='260' r='190' />
          </svg>
        </div>
      </section>

      <section className={styles.longSection} id='ecosystem'>
        <SectionHeading
          index='08 / BOUNDARY MAP'
          title='The core has an ecosystem around it.'
          lead='External frameworks, providers, and storage systems stay outside the ownership boundary while their relationships remain explicit.'
        />
        <svg
          className={styles.ecosystemGraph}
          data-testid='ecosystem-boundary'
          viewBox='0 0 1180 650'
          aria-label='VoidArch ecosystem boundary map'
        >
          <circle cx='590' cy='325' r='184' />
          <circle cx='590' cy='325' r='118' />
          <path d='M500 262 C410 220 315 170 235 132' />
          <path d='M680 262 C770 220 865 170 945 132' />
          <path d='M480 365 C375 405 295 450 220 505' />
          <path d='M700 365 C805 405 885 450 960 505' />
          <path d='M590 207 L590 95' />
          <path d='M590 443 L590 565' />
          <g className={styles.ecoCore}>
            <circle cx='590' cy='325' r='104' />
            <text x='590' y='296'>
              VOIDARCH
            </text>
            <text x='590' y='330'>
              CORE
            </text>
            <text x='590' y='365'>
              CONTEXT · ROUTER · STUDIO
            </text>
          </g>
          <g>
            <rect x='480' y='35' width='220' height='62' rx='3' />
            <text x='590' y='60'>
              OBSERVABILITY
            </text>
            <text x='590' y='80'>
              Trace exporters · PLANNED
            </text>
          </g>
          <g>
            <rect x='70' y='90' width='230' height='86' rx='3' />
            <text x='185' y='120'>
              HERMES · EXTERNAL
            </text>
            <text x='185' y='145'>
              Agent testbed / integration surface
            </text>
          </g>
          <g>
            <rect x='880' y='90' width='230' height='86' rx='3' />
            <text x='995' y='120'>
              MCP
            </text>
            <text x='995' y='145'>
              Tool adapters · ACTIVE
            </text>
          </g>
          <g>
            <rect x='45' y='470' width='270' height='92' rx='3' />
            <text x='180' y='505'>
              MODEL POOLS
            </text>
            <text x='180' y='532'>
              OpenRouter · local · direct
            </text>
          </g>
          <g>
            <rect x='865' y='470' width='270' height='92' rx='3' />
            <text x='1000' y='505'>
              STORAGE
            </text>
            <text x='1000' y='532'>
              SurrealDB · local state
            </text>
          </g>
          <g className={styles.ecoFuture}>
            <rect x='475' y='558' width='230' height='70' rx='3' />
            <text x='590' y='585'>
              VOID-ARCH · FUTURE
            </text>
            <text x='590' y='608'>
              OS-level systems surface
            </text>
          </g>
        </svg>
      </section>

      <section className={styles.longSection} id='lineage'>
        <SectionHeading
          index='09 / LINEAGE'
          title='Past work becomes an architectural extraction path.'
          lead='Individual projects stop competing for attention. They become evidence of the recurring system problems that produced VoidArch.'
        />
        <div className={styles.lineageRail}>
          <span className={styles.lineageSpine} />
          {[
            [
              '01',
              'PAST',
              'Experiments',
              'Agents, integrations, memory, security, and applied AI systems create the raw material.'
            ],
            [
              '02',
              'EXTRACT',
              'Patterns',
              'Context, routing, observability, verification, and control keep reappearing.'
            ],
            [
              '03',
              'TODAY',
              'VoidArch',
              'The recurring primitives consolidate into Context, Router, Studio, Policy, Memory, and Evidence.'
            ],
            [
              '04',
              'NEXT',
              'Void-Arch',
              'The same primitives become environmental capabilities in an AI-native operating system.'
            ]
          ].map(([n, date, title, copy], index) => (
            <article
              key={title}
              className={`${styles.lineageMark} ${index === 2 ? styles.lineageCurrent : ''}`}
            >
              <i>{n}</i>
              <small>{date}</small>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
