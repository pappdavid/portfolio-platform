import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('vendored demo HTML uses root-absolute asset URLs', () => {
  const files = [
    'public/demos/self-interview/index.html',
    'public/demos/rolefit-quiz/index.html',
    'public/demos/task-to-flow/index.html'
  ];
  for (const file of files) {
    const html = readFileSync(resolve(process.cwd(), file), 'utf8');
    assert.doesNotMatch(
      html,
      /(?:src|href)=["']\.\//,
      `${file} still uses ./ relative assets that 404 after a trailing-slash redirect`
    );
    assert.match(html, /(?:src|href)=["']\/demos\//);
  }
});
