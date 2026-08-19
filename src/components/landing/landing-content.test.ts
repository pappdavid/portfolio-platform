import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./landing-content.tsx', import.meta.url), 'utf8');

test('referral hero renders its role context immediately instead of through typewriter state', () => {
  assert.match(source, /<span>\{referralView\.heroTag\}<\/span>/);
  assert.match(source, /referral\s*\?/);
});
