import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./route.ts', import.meta.url), 'utf8');

test('public chat does not accept caller supplied document context', () => {
  assert.doesNotMatch(source, /context\?: string/);
  assert.doesNotMatch(source, /chunkText\(context\)/);
});

test('referral metadata participates in project retrieval', () => {
  assert.match(source, /buildReferralRetrievalQuery/);
  assert.match(source, /retrieveKnowledge\(\s*retrievalQuery/);
  assert.match(source, /pinnedTitles:\s*referral\?\.featuredProjects/);
});

test('explicitly featured referral projects are deterministic retrieval boosts', () => {
  assert.match(source, /pinnedTitles:\s*referral\?\.featuredProjects/);
  assert.doesNotMatch(source, /getReferralFeaturedProjectChunks/);
});
