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
test('AMA uses the shared Gateway/OpenRouter model selector through the Vercel AI SDK', () => {
  assert.match(source, /getPortfolioModel/);
  assert.match(source, /generateText/);
  assert.doesNotMatch(source, /OPENAI_API_KEY|from ['\"]openai['\"]/);
});
