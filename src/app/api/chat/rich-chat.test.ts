import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const route = readFileSync(new URL('./route.ts', import.meta.url), 'utf8');
const provider = readFileSync(
  new URL('../../../lib/openrouter.ts', import.meta.url),
  'utf8'
);
const ui = readFileSync(
  new URL('../../../components/landing/landing-content.tsx', import.meta.url),
  'utf8'
);

test('chat uses the Vercel AI SDK with Gateway fallback and OpenRouter preference', () => {
  assert.match(route, /getPortfolioModel/);
  assert.match(route, /streamText/);
  assert.match(provider, /@openrouter\/ai-sdk-provider/);
  assert.match(provider, /OPENROUTER_API_KEY/);
  assert.match(provider, /openrouter\/free/);
  assert.match(provider, /deepseek\/deepseek-v4-flash-0731/);
  assert.doesNotMatch(
    `${route}\n${provider}`,
    /OPENAI_API_KEY|from ['\"]openai['\"]|@ai-sdk\/openai/
  );
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
