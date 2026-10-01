import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import nextConfig from '../next.config.ts';

const demoSlugs = ['rolefit-quiz', 'self-interview', 'task-to-flow'];

test('short and slash demo URLs redirect to the canonical index document', async () => {
  const redirects = await nextConfig.redirects?.();
  assert.ok(redirects);

  for (const slug of demoSlugs) {
    assert.ok(
      redirects.some(
        (redirect) =>
          redirect.source === `/demos/${slug}` &&
          redirect.destination === `/demos/${slug}/index.html`
      ),
      `${slug} needs a canonical redirect from its directory URL to index.html`
    );
  }
});

test('RoleFit assets resolve under their demo directory for all path variants', () => {
  const html = readFileSync(
    resolve(process.cwd(), 'public/demos/rolefit-quiz/index.html'),
    'utf8'
  );
  assert.match(
    html,
    /<base href="\/demos\/rolefit-quiz\/"\s*\/>/,
    'the source document must anchor relative assets to its own public demo directory'
  );
  assert.match(html, /src="\.\/assets\//);
  assert.match(html, /href="\.\/assets\//);
});
