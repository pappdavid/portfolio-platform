import type { Metadata } from 'next';
import Link from 'next/link';
import {
  VOIDARCH_EVIDENCE,
  VOIDARCH_NODES,
  VOIDARCH_RESEARCH_ROUTE
} from '@/lib/voidarch/architecture';
import styles from './agent.module.css';

export const metadata: Metadata = {
  title: 'VoidArch Agent View — Machine-readable architecture',
  description:
    'Human-readable index of the machine-readable VoidArch architecture and evidence manifests.'
};

export default function VoidArchAgentPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href='/voidarch'>
          <span>VA</span> / VOIDARCH
        </Link>
        <nav aria-label='Agent view resources'>
          <Link href='/voidarch'>ATLAS</Link>
          <Link href='/voidarch/architecture.json'>RAW ARCHITECTURE JSON</Link>
          <Link href='/voidarch/evidence.json'>RAW EVIDENCE JSON</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.eyebrow}>
          AGENT INTERFACE / HUMAN-READABLE INDEX
        </div>
        <h1>Agent-readable architecture.</h1>
        <p>
          This is the readable index for the same machine-readable VoidArch
          contract exposed to agents. Humans get context and navigation;
          machines can consume the JSON manifests directly.
        </p>
      </section>

      <section className={styles.discovery} aria-labelledby='discovery-title'>
        <div className={styles.sectionLabel}>01 / DISCOVERY SURFACES</div>
        <div className={styles.discoveryGrid}>
          <article>
            <span>ARCHITECTURE MANIFEST</span>
            <code>/voidarch/architecture.json</code>
            <p>
              Nodes, edges, maturity taxonomy, world coordinates, and canonical
              routes.
            </p>
            <Link href='/voidarch/architecture.json'>
              RAW ARCHITECTURE JSON ↗
            </Link>
          </article>
          <article>
            <span>EVIDENCE MANIFEST</span>
            <code>/voidarch/evidence.json</code>
            <p>
              Evidence grouped under Context, Router, and Studio with explicit
              maturity.
            </p>
            <Link href='/voidarch/evidence.json'>RAW EVIDENCE JSON ↗</Link>
          </article>
        </div>
      </section>

      <section className={styles.contract} aria-labelledby='contract-title'>
        <div className={styles.sectionLabel}>02 / CORE CONTRACT</div>
        <div className={styles.contractHeader}>
          <h2 id='contract-title'>Subsystem ownership</h2>
          <p>
            Maturity is part of the public contract, not decorative metadata.
          </p>
        </div>
        <div className={styles.nodeList}>
          {VOIDARCH_NODES.map((node) => (
            <article key={node.id}>
              <div className={styles.nodeTitle}>
                <span>{node.id.toUpperCase()}</span>
                <h3>{node.title}</h3>
                <b data-maturity={node.maturity}>{node.maturity}</b>
              </div>
              <p>{node.role}</p>
              <dl>
                <div>
                  <dt>OWNS</dt>
                  <dd>{node.owns}</dd>
                </div>
                <div>
                  <dt>CONNECTS</dt>
                  <dd>{node.connects}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.route} aria-labelledby='route-title'>
        <div className={styles.sectionLabel}>03 / CANONICAL ROUTE</div>
        <h2 id='route-title'>research_query</h2>
        <ol>
          {VOIDARCH_RESEARCH_ROUTE.map((step, index) => (
            <li key={`${step.node}-${index}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step.node.toUpperCase()}</strong>
              <p>{step.message}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.evidence} aria-labelledby='evidence-title'>
        <div className={styles.sectionLabel}>04 / EVIDENCE INDEX</div>
        <h2 id='evidence-title'>Evidence beneath the claim.</h2>
        <div className={styles.evidenceColumns}>
          {Object.entries(VOIDARCH_EVIDENCE).map(([group, items]) => (
            <div key={group}>
              <h3>{group.toUpperCase()}</h3>
              {items.map((item) => (
                <article key={item.id}>
                  <span>{item.maturity}</span>
                  <b>{item.label}</b>
                  <p>{item.summary}</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>MACHINE-READABLE / VERSIONED / MATURITY-AWARE</span>
        <Link href='/voidarch'>RETURN TO SIGNAL ATLAS ↑</Link>
      </footer>
    </main>
  );
}
