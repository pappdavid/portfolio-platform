'use client';

import { useState } from 'react';
import { LiquidField } from './liquid-field';
import { SignalAtlas } from './signal-atlas';
import { ArchitectureSections } from './architecture-sections';
import styles from '@/app/voidarch/voidarch.module.css';

export function VoidArchExperience() {
  const [focus, setFocus] = useState<readonly [number, number]>([0.72, 0.42]);
  const [routeState, setRouteState] = useState({ energy: 0, phase: 0 });
  const [fieldEnabled, setFieldEnabled] = useState(true);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <LiquidField
          focus={focus}
          routeEnergy={routeState.energy}
          routePhase={routeState.phase}
          enabled={fieldEnabled}
        />
        <div className={styles.atmosphere} />

        <header className={styles.topbar}>
          <div className={styles.brand}>
            <span>VA</span> / VOIDARCH
          </div>
          <nav className={styles.nav} aria-label='VoidArch sections'>
            <a href='#systems'>SYSTEMS</a>
            <a href='#flow'>FLOW</a>
            <a href='#labs'>LABS</a>
            <a href='/voidarch/agent'>AGENT VIEW</a>
          </nav>
          <div className={styles.statusCluster}>
            <button
              type='button'
              className={styles.fieldToggle}
              aria-label='Toggle liquid field'
              aria-pressed={fieldEnabled}
              onClick={() => setFieldEnabled((enabled) => !enabled)}
            >
              FIELD {fieldEnabled ? 'ON' : 'OFF'}
            </button>
            <div className={styles.status}>ACTIVE ARCHITECTURE / REV 0.x</div>
          </div>
        </header>

        <div className={styles.heroCopy}>
          <div className={styles.kicker}>SYSTEMS AROUND THE MODEL</div>
          <h1>Context, route, execute, remember.</h1>
          <p>
            VoidArch is a set of working systems for repository context,
            capability routing, local agent execution, safety policy, and
            evidence. Context packages repository state; Router resolves trusted
            execution paths; Studio owns the processes that actually run them.
          </p>
          <div className={styles.thesis}>
            <strong>The atlas is the index.</strong> Every major claim below
            maps to a repository, a command surface, a deterministic contract,
            or a verification path.
          </div>
        </div>

        <SignalAtlas
          onFocusChange={setFocus}
          onRouteState={(energy, phase) => setRouteState({ energy, phase })}
        />
      </section>

      <ArchitectureSections />
    </main>
  );
}
