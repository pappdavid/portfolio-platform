import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import {
  demoFullPageHref,
  demoIframeSrc,
  parseTaskFlowResultHash,
  taskFlowResultHash,
  taskFlowResultIdFromMessage
} from './demo-urls';

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

test('Task-to-Flow result IDs stay opaque and survive host reload URLs', () => {
  const id = '123e4567-e89b-42d3-a456-426614174000';
  assert.equal(taskFlowResultHash(id), `#task-to-flow-result/${id}`);
  assert.equal(parseTaskFlowResultHash(`#task-to-flow-result/${id}`), id);
  assert.equal(
    parseTaskFlowResultHash(`#task-to-flow-result/not-a-uuid`),
    null
  );
  assert.equal(parseTaskFlowResultHash(`#implementation/${id}`), null);
});

test('embedded Task-to-Flow reload iframe gets result fragment and allowlisted context', () => {
  const id = '123e4567-e89b-42d3-a456-426614174000';
  assert.equal(
    demoIframeSrc(
      'task-to-flow',
      'ai-integration',
      '?ref=69f28b66d40dfd22&c=odoo&unrelated=omit',
      id
    ),
    `/demos/task-to-flow/index.html?role=ai-integration&ref=69f28b66d40dfd22&c=odoo#implementation/${id}`
  );
  assert.equal(
    demoIframeSrc('self-interview', 'ai-integration', '', id),
    '/demos/self-interview/index.html?role=ai-integration'
  );
  assert.equal(
    demoIframeSrc('task-to-flow', 'not-a-role', '?c=x', 'not-a-uuid'),
    '/demos/task-to-flow/index.html'
  );
});

test('Task-to-Flow full-page continuation carries only opaque result ID and context', () => {
  const id = '123e4567-e89b-42d3-a456-426614174000';
  assert.equal(
    demoFullPageHref(
      'task-to-flow',
      'automation',
      '?ref=69f28b66d40dfd22&c=acme-corp&private=never-copy',
      id
    ),
    `/demos/task-to-flow/index.html?role=automation&ref=69f28b66d40dfd22&c=acme-corp&result=${id}#implementation/${id}`
  );
  assert.equal(
    demoFullPageHref('task-to-flow', undefined, '', 'invalid'),
    '/demos/task-to-flow/index.html'
  );
});

test('host accepts only the Task-to-Flow result message contract and RFC4122 UUIDs', () => {
  const id = '123e4567-e89b-42d3-a456-426614174000';
  assert.equal(
    taskFlowResultIdFromMessage({ type: 'task-to-flow-result', resultId: id }),
    id
  );
  assert.equal(
    taskFlowResultIdFromMessage({ type: 'task-to-flow-result', resultId: 'x' }),
    null
  );
  assert.equal(
    taskFlowResultIdFromMessage({ type: 'other', resultId: id }),
    null
  );
  assert.equal(taskFlowResultIdFromMessage(null), null);
});
