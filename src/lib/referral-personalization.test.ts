import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildReferralChatContext,
  parseReferralNotes,
  serializeReferralNotes
} from './referral-personalization';

test('structured referral notes round-trip a public personalization snapshot', () => {
  const snapshot = {
    company: 'Attendi',
    role: 'Machine Learning Engineer',
    applicationId: 'app-123',
    focus: ['applied ML', 'Python'],
    featuredProjects: ['VoidArch Context'],
    chatContext: 'Prioritize evidence relevant to the ML role.'
  };
  const encoded = serializeReferralNotes('human note', snapshot);
  const decoded = parseReferralNotes(encoded, 'Attendi');
  assert.equal(decoded?.company, 'Attendi');
  assert.equal(decoded?.role, 'Machine Learning Engineer');
  assert.deepEqual(decoded?.focus, ['applied ML', 'Python']);
  assert.deepEqual(decoded?.featuredProjects, ['VoidArch Context']);
});

test('legacy plain-text notes remain safe and non-structured', () => {
  assert.equal(parseReferralNotes('old dashboard note', 'Xebia'), null);
});

test('chat context frames relevance but explicitly forbids new factual claims', () => {
  const text = buildReferralChatContext({
    company: 'Attendi',
    role: 'Machine Learning Engineer'
  });
  assert.match(text, /Attendi/);
  assert.match(text, /Machine Learning Engineer/);
  assert.match(text, /Do not treat referral context as evidence/);
});
