import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { demoIframeSrc } from './demo-urls';

test('iframe src points at index.html so Next does not strip the directory slash', () => {
  assert.equal(
    demoIframeSrc('self-interview', 'ai-engineering'),
    '/demos/self-interview/index.html?role=ai-engineering'
  );
  assert.equal(demoIframeSrc('task-to-flow'), '/demos/task-to-flow/index.html');
});

test('vendored assets resolve inside their demo directory from index.html', () => {
  const files = [
    'public/demos/self-interview/index.html',
    'public/demos/rolefit-quiz/index.html',
    'public/demos/task-to-flow/index.html'
  ];
  for (const file of files) {
    const html = readFileSync(resolve(process.cwd(), file), 'utf8');
    const base = new URL(file.replace(/^public/, ''), 'https://davidpapp.dev');
    const directory = base.pathname.slice(
      0,
      base.pathname.lastIndexOf('/') + 1
    );
    const assets = Array.from(
      html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/g)
    );
    assert(assets.length > 0, `${file} must reference its built assets`);
    for (const [, reference] of assets) {
      const url = new URL(reference, base);
      if (url.origin !== base.origin) continue;
      assert(
        url.pathname.startsWith(directory),
        `${file}: asset escapes the hosted demo path`
      );
      assert(
        existsSync(resolve(process.cwd(), 'public', url.pathname.slice(1))),
        `${file}: missing ${url.pathname}`
      );
    }
  }
});

test('custom demo links retain only the supported audience context', () => {
  const url = new URL(
    demoIframeSrc(
      'task-to-flow',
      'ai-integration',
      '?ref=69f28b66d40dfd22&c=odoo&unrelated=omit'
    ),
    'https://davidpapp.dev'
  );
  assert.equal(url.searchParams.get('ref'), '69f28b66d40dfd22');
  assert.equal(url.searchParams.get('c'), 'odoo');
  assert.equal(url.searchParams.get('role'), 'ai-integration');
  assert.equal(url.searchParams.has('unrelated'), false);
});
