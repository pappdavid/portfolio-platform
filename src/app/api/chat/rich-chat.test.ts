import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const route = readFileSync(new URL('./route.ts', import.meta.url), 'utf8');
const ui = readFileSync(
  new URL('../../../components/landing/landing-content.tsx', import.meta.url),
  'utf8'
);

test('chat uses current cheap model and reviewed knowledge base', () => {
  assert.match(route, /gpt-5-nano/);
  assert.doesNotMatch(route, /gpt-4o-mini/);
  assert.match(route, /buildPortfolioKnowledgeBase/);
  assert.match(route, /retrieveKnowledge/);
});

test('chat emits structured evidence before prose', () => {
  assert.match(route, /type:\s*['"]evidence['"]/);
  assert.match(route, /evidenceItems/);
});

test('chat UI renders evidence cards and markdown answers', () => {
  assert.match(ui, /ChatEvidence/);
  assert.match(ui, /EvidenceCards/);
  assert.match(ui, /MarkDownRenderer/);
  assert.match(ui, /parsed\.type === ['"]evidence['"]/);
});
