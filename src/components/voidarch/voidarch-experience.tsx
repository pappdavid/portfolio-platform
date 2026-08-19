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
            <a href='#architecture'>ARCHITECTURE</a>
            <a href='#evidence'>EVIDENCE</a>
            <a href='/voidarch/architecture.json'>AGENT VIEW</a>
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

      <ArchitectureSections />
    </main>
  );
}
