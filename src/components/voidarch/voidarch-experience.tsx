'use client';

import { useState } from 'react';
import { LiquidField } from './liquid-field';
import { SignalAtlas } from './signal-atlas';
import { VOIDARCH_NODES } from '@/lib/voidarch/architecture';
import styles from '@/app/voidarch/voidarch.module.css';

export function VoidArchExperience() {
  const [focus, setFocus] = useState<readonly [number, number]>([0.72, 0.42]);
  const [routeState, setRouteState] = useState({ energy: 0, phase: 0 });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <LiquidField
          focus={focus}
          routeEnergy={routeState.energy}
          routePhase={routeState.phase}
        />
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

        <SignalAtlas
          onFocusChange={setFocus}
          onRouteState={(energy, phase) => setRouteState({ energy, phase })}
        />
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
