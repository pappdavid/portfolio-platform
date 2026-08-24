import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./landing-content.tsx', import.meta.url), 'utf8');

test('referral hero renders its role context immediately instead of through typewriter state', () => {
  assert.match(source, /<span>\{siteView\.heroTag\}<\/span>/);
  assert.match(source, /hasContext\s*\?/);
});

test('job-type variants drive the hero role line instead of a hardcoded title', () => {
  assert.match(
    source,
    /<p className='hero-role'>\{siteView\.heroRole\}<\/p>/
  );
  assert.doesNotMatch(source, /<p className='hero-role'>AI solution developer<\/p>/);
});
