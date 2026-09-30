import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  getPortfolioModel,
  PORTFOLIO_GATEWAY_MODEL_ID,
  PORTFOLIO_OPENROUTER_MODEL_ID
} from '../../../lib/openrouter';
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
  assert.doesNotMatch(
    `${route}\n${provider}`,
    /OPENAI_API_KEY|from ['\"]openai['\"]|@ai-sdk\/openai/
  );
  assert.match(route, /buildPortfolioKnowledgeBase/);
  assert.match(route, /retrieveKnowledge/);
});

test('model routing uses configured OpenRouter when a key exists and Gateway otherwise', () => {
  const previous = process.env.OPENROUTER_API_KEY;
  try {
    delete process.env.OPENROUTER_API_KEY;
    assert.equal(getPortfolioModel(), PORTFOLIO_GATEWAY_MODEL_ID);
    process.env.OPENROUTER_API_KEY =
      'synthetic-test-key-not-used-for-inference';
    const model = getPortfolioModel();
    assert.notEqual(typeof model, 'string');
    if (typeof model !== 'string') {
      assert.equal(model.modelId, PORTFOLIO_OPENROUTER_MODEL_ID);
    }
  } finally {
    if (previous === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previous;
  }
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
