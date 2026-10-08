import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import records from '@/data/application-proofs.json';
import styles from './proof.module.css';

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const record = records.find((item) => item.key === key);
  if (!record) return { title: 'Evidence page unavailable' };
  const title = record.company + ' / ' + record.role + ' — David Papp';
  const description =
    'Selected commercial experience and personal engineering prototypes for ' +
    record.role +
    '.';
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description },
    twitter: { card: 'summary', title, description }
  };
}

export default async function ProofPage({ params }: Props) {
  const { key } = await params;
  const record = records.find((item) => item.key === key);
  if (!record) notFound();
  return (
    <article className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Selected engineering evidence</p>
        <h1>{record.headline}</h1>
        <p className={styles.subtitle}>
          {record.company} · {record.role}
        </p>
        <p className={styles.identity}>
          David Papp · Rotterdam, Netherlands ·{' '}
          <a href='mailto:contact@davidpapp.dev'>contact@davidpapp.dev</a>
        </p>
        <p className={styles.pitch}>{record.pitch}</p>
        <nav aria-label='Evidence sections'>
          <a href='#commercial-recovery'>Commercial delivery</a>
          <a href='#client-studio'>Client Studio</a>
          <a href='#voidarch-context'>VoidArch Context</a>
          <a href='#process-handoffs'>Operational experience</a>
          <a href='#sources'>Sources</a>
        </nav>
      </header>
      <section id='commercial-recovery'>
        <h2>Commercial delivery and inherited-service recovery</h2>
        {record.profile.slice(0, 2).map((item) => (
          <p key={item.lead}>
            <strong>{item.lead}</strong> {item.text}
          </p>
        ))}
        <p className={styles.scope}>
          Commercial experience at WEBINFORM IT Ltd. Client code and
          confidential material are not published here.
        </p>
        <ul>
          {record.experience[0].bullets.map((item) => (
            <li key={item.lead}>
              <strong>{item.lead}</strong> {item.text}
            </li>
          ))}
        </ul>
      </section>
      <section id='personal-projects'>
        <h2>Selected personal engineering work</h2>
        <p className={styles.scope}>
          These are personal prototypes and engineering demonstrations. They are
          separate from commercial client delivery; no customer adoption or
          production performance is claimed.
        </p>
        {record.projects.map((project) => (
          <section
            id={project.id}
            key={project.title}
            className={styles.project}
          >
            <h3>{project.title}</h3>
            <p className={styles.scope}>{project.scope}</p>
            <p>{project.summary}</p>
            <ul>
              {project.bullets.map((item) => (
                <li key={item.lead}>
                  <strong>{item.lead}</strong> {item.text}
                </li>
              ))}
            </ul>
            {project.url && (
              <p>
                <a href={project.url}>Open the functional Client Studio demo</a>
                <br />
                <span className={styles.scope}>
                  Opens its source-input workspace with disclosed fictional
                  examples. This link does not preload employer data.
                </span>
              </p>
            )}
          </section>
        ))}
        <p>{record.otherPersonalWork}</p>
      </section>
      <section id='process-handoffs'>
        <h2>Operational handoffs and collaboration</h2>
        {record.experience.slice(1).map((experience) => (
          <div key={experience.company}>
            <h3>
              {experience.company} · {experience.role}
            </h3>
            <p className={styles.scope}>
              {experience.date} · {experience.location}
            </p>
            {experience.body && <p>{experience.body}</p>}
            <ul>
              {experience.bullets.map((item) => (
                <li key={item.lead}>
                  <strong>{item.lead}</strong> {item.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section id='education'>
        <h2>Education and evaluation</h2>
        <h3>{record.education.university}</h3>
        <p>
          {record.education.programme} · {record.education.status}
        </p>
        <p>{record.education.history}</p>
        <ul>
          {record.education.academic_work.map((item) => (
            <li key={item.lead}>
              <strong>{item.lead}</strong> {item.text}
            </li>
          ))}
        </ul>
        <h3>
          {record.education.milestone.institution} ·{' '}
          {record.education.milestone.programme}
        </h3>
        <p>
          {record.education.milestone.date}. {record.education.milestone.body}{' '}
          {record.education.milestone.leadership}
        </p>
      </section>
      <footer id='sources'>
        <h2>Sources and scope</h2>
        <p>
          Candidate experience and project descriptions follow the approved CV
          factual record and reviewed role brief, dated 8 October 2026. Role
          targeting follows the linked vacancy; this page does not imply an
          employment relationship with {record.company}.
        </p>
        <p>
          <a href={record.sourceUrl}>Source vacancy</a> ·{' '}
          <a href={record.applicationUrl}>
            Employer vacancy / application source
          </a>
        </p>
        <p>
          <a href='https://client-studio-psi.vercel.app/'>
            Functional Client Studio application
          </a>{' '}
          · <a href='mailto:contact@davidpapp.dev'>Contact David</a>
        </p>
      </footer>
    </article>
  );
}
