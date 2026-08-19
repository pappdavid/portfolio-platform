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
  assert.match(source, /retrieveChunks\(\s*retrievalQuery/);
});
