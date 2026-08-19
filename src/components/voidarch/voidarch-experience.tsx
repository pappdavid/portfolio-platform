'use client';

import { LiquidField } from './liquid-field';
import { VOIDARCH_NODES } from '@/lib/voidarch/architecture';
import styles from '@/app/voidarch/voidarch.module.css';

const positions: Record<string, { left: string; top: string }> = {
  context: { left: '59%', top: '24%' },
  memory: { left: '48%', top: '66%' },
  models: { left: '74%', top: '17%' },
  router: { left: '70%', top: '46%' },
  tools: { left: '67%', top: '76%' },
  studio: { left: '86%', top: '29%' },
  policy: { left: '88%', top: '57%' },
  evidence: { left: '91%', top: '80%' }
};

export function VoidArchExperience() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <LiquidField />
        <div className={styles.atmosphere} />

        <header className={styles.topbar}>
          <div className={styles.brand}>
            <span>VA</span> / VOIDARCH
          </div>
          <nav className={styles.nav} aria-label='VoidArch sections'>
            <a href='#architecture'>ARCHITECTURE</a>
            <a href='#evidence'>EVIDENCE</a>
            <a href='/voidarch/architecture.json'>AGENT VIEW</a>
          </nav>
          <div className={styles.status}>ACTIVE ARCHITECTURE / REV 0.x</div>
        </header>

        <div className={styles.heroCopy}>
          <div className={styles.kicker}>SYSTEMS AROUND THE MODEL</div>
          <h1>Context, route, execute, remember.</h1>
          <p>
            VoidArch is the systems layer extracted from repeated AI projects:
            persistent context, explicit routing, observable execution, durable
            evidence, and a constrained path toward systems that can improve
            their own infrastructure.
          </p>
          <div className={styles.thesis}>
            <strong>The atlas is the homepage.</strong> Follow the architecture,
            then drop beneath each claim into evidence.
          </div>
        </div>

        <div
          className={styles.atlas}
          data-testid='voidarch-atlas'
          aria-label='VoidArch architecture atlas'
        >
          <svg
            className={styles.edges}
            viewBox='0 0 1000 720'
            aria-hidden='true'
          >
            <path d='M590 175 C650 230 680 275 700 330' />
            <path d='M520 510 C535 410 555 300 590 175' />
            <path d='M740 120 C745 215 730 275 700 330' />
            <path d='M675 555 C690 485 700 420 700 330' />
            <path d='M735 330 C790 305 825 255 860 205' />
            <path d='M735 340 C800 380 850 405 885 420' />
            <path d='M885 420 C905 500 915 545 920 585' />
          </svg>
          {VOIDARCH_NODES.map((node) => (
            <div
              key={node.id}
              className={`${styles.node} ${node.group === 'core' ? styles.coreNode : ''}`}
              style={positions[node.id]}
              data-node={node.id}
            >
              <span className={styles.anchor} />
              <strong>{node.title}</strong>
              <small>{node.maturity}</small>
              <p>{node.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} id='architecture'>
        <div className={styles.sectionIndex}>01 / ARCHITECTURE</div>
        <div>
          <h2>Three layers, one shared trace.</h2>
          <p>
            Context remembers. Router decides. Studio executes and exposes
            evidence.
          </p>
          <div className={styles.architectureRows}>
            {VOIDARCH_NODES.filter((node) => node.group === 'core').map(
              (node) => (
                <article key={node.id}>
                  <span>{node.title}</span>
                  <p>{node.summary}</p>
                  <b>{node.maturity}</b>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <section className={styles.section} id='evidence'>
        <div className={styles.sectionIndex}>02 / EVIDENCE</div>
        <div>
          <h2>One click beneath every major claim.</h2>
          <p>
            The public surface stays concise because implementation, evaluation,
            and provenance sit directly underneath the architecture.
          </p>
        </div>
      </section>
    </main>
  );
}
