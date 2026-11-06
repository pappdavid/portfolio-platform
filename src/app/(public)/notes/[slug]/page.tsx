import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import notes from '@/data/field-notes.json';

export const dynamicParams = false;

export function generateStaticParams() {
  return notes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find((entry) => entry.slug === slug);
  if (!note) return {};
  return {
    title: `${note.title} — David Papp`,
    description: note.summary,
    alternates: { canonical: `/notes/${note.slug}` }
  };
}

export default async function FieldNotePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = notes.find((entry) => entry.slug === slug);
  if (!note) notFound();

  return (
    <article className='field-note-page'>
      <nav aria-label='Field note navigation'>
        <Link href='/#notes'>← All field notes</Link>
        <Link href='/projects'>Explore projects →</Link>
      </nav>
      <header>
        <p className='field-note-kicker'>
          ENGINEERING FIELD NOTE / {note.repo}
        </p>
        <h1>{note.title}</h1>
        <p className='field-note-lead'>{note.summary}</p>
      </header>
      {note.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}
      <aside className='field-note-limit' aria-label='Scope and limitations'>
        <h2>Scope and limitations</h2>
        <p>{note.limitation}</p>
      </aside>
      <footer>
        <p>
          Based on the public repository documentation. These notes describe
          implementation choices, not independent security certification.
        </p>
        <a href={`${note.url}/tree/${note.sourceRevision}`}>
          Read the source at the reviewed revision →
        </a>
        <Link href='/#notes'>← Back to field notes</Link>
      </footer>
    </article>
  );
}
