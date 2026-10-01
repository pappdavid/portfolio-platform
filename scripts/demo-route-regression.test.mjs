import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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

test('RoleFit assets resolve under the canonical index document URL', () => {
  const html = readFileSync(
    resolve(process.cwd(), 'public/demos/rolefit-quiz/index.html'),
    'utf8'
  );
  const canonical = new URL(
    '/demos/rolefit-quiz/index.html',
    'https://davidpapp.dev'
  );
  const assets = Array.from(
    html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/g),
    (match) => match[1]
  );
  assert(assets.length > 0, 'RoleFit must include its built assets');

  for (const reference of assets) {
    const asset = new URL(reference, canonical);
    assert(
      asset.pathname.startsWith('/demos/rolefit-quiz/assets/'),
      `${reference} must resolve inside the RoleFit asset directory`
    );
    assert(
      existsSync(resolve(process.cwd(), 'public', asset.pathname.slice(1))),
      `${asset.pathname} must exist in the vendored source output`
    );
  }
});
