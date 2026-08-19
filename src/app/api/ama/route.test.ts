import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const source = readFileSync(new URL('./route.ts', import.meta.url), 'utf8');
test('AMA shares the reviewed portfolio knowledge base', () => {
  assert.match(source, /buildPortfolioKnowledgeBase/);
  assert.match(source, /retrieveKnowledge/);
  assert.match(source, /formatKnowledgeContext/);
  assert.doesNotMatch(source, /retrieveChunks/);
});
test('AMA defaults to the current cheap portfolio model', () => {
  assert.match(source, /gpt-5-nano/);
  assert.doesNotMatch(source, /gpt-4o-mini/);
});
