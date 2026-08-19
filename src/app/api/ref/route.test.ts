import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./route.ts', import.meta.url), 'utf8');

test('referral provisioning does not require Clerk', () => {
  assert.doesNotMatch(source, /@clerk\/nextjs\/server/);
  assert.doesNotMatch(source, /await auth\(\)/);
  assert.doesNotMatch(source, /Unauthorized/);
});

test('public referral rows are ownerless', () => {
  assert.doesNotMatch(source, /user_id\s*:/);
});

const eventsSource = readFileSync(
  new URL('./events/route.ts', import.meta.url),
  'utf8'
);

test('private analytics includes ownerless system-created links', () => {
  assert.match(eventsSource, /user_id\.is\.null/);
});
