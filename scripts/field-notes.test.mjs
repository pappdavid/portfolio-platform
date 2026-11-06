import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const notes = JSON.parse(read('src/data/field-notes.json'));

test('every engineering note has a unique route and substantive source-linked content', () => {
  assert.equal(new Set(notes.map((note) => note.slug)).size, notes.length);
  for (const note of notes) {
    assert.match(note.slug, /^[a-z]+(?:-[a-z]+)*$/);
    assert.match(note.sourceRevision, /^[a-f0-9]{40}$/);
    assert.equal(note.url, `https://github.com/pappdavid/${note.repo}`);
    assert(note.sections.length >= 3, note.slug);
    for (const section of note.sections) {
      assert(section.heading.length > 10, note.slug);
      assert(section.body.length > 150, note.slug);
    }
    assert(note.limitation.length > 100, note.slug);
    assert(
      !/TODO|lorem ipsum|coming soon/i.test(JSON.stringify(note)),
      note.slug
    );
  }
});

test('note route includes source provenance, limitations, metadata, and recovery navigation', () => {
  const route = read('src/app/(public)/notes/[slug]/page.tsx');
  assert(route.includes('notFound()'));
  assert(route.includes('generateStaticParams'));
  assert(route.includes('generateMetadata'));
  assert(route.includes('note.sourceRevision'));
  assert(route.includes('note.limitation'));
  assert(route.includes("href='/#notes'"));
  assert(route.includes("href='/projects'"));
  assert(read('src/app/sitemap.ts').includes('`/notes/${note.slug}`'));
  assert(
    read('src/components/landing/landing-content.tsx').includes(
      'href={`/notes/${note.slug}`}'
    )
  );
});

test('security notes retain the limits of classification and approval', () => {
  const byRepo = Object.fromEntries(
    notes.map((note) => [note.repo, JSON.stringify(note)])
  );
  assert.match(byRepo['agentsec-hook-pack'], /default is observe/i);
  assert.match(byRepo['approveops'], /calling system must wait/i);
  assert.match(byRepo['mcpguard-lite'], /without invoking/i);
  assert.match(byRepo['agentmap'], /does not itself revoke/i);
  assert.match(byRepo['PromptShield'], /false|miss paraphrases/i);
  assert.match(
    byRepo['agent-cli-mcp-rust'],
    /not establish that every secret/i
  );
});
