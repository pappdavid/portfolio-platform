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

test('referral retrieval query includes role focus and explicitly featured projects', async () => {
  const { buildReferralRetrievalQuery } = await import(
    './referral-personalization'
  );
  const query = buildReferralRetrievalQuery('why is David relevant?', {
    company: 'Attendi',
    role: 'Machine Learning Engineer',
    focus: ['applied ML', 'Python', 'production AI'],
    featuredProjects: ['VoidArch Context', 'AgentSec Suite']
  });
  assert.match(query, /Machine Learning Engineer/);
  assert.match(query, /applied ML/);
  assert.match(query, /VoidArch Context/);
  assert.match(query, /AgentSec Suite/);
});

test('referral presentation visibly frames the target without claiming company facts', async () => {
  const { buildReferralPresentation } = await import(
    './referral-personalization'
  );
  const view = buildReferralPresentation({
    company: 'Attendi',
    role: 'Machine Learning Engineer',
    focus: ['applied ML', 'Python']
  });
  assert.equal(view.target, 'Attendi · Machine Learning Engineer');
  assert.equal(view.roleFocus, 'applied ML · Python');
  assert.match(view.heroTag, /Machine Learning Engineer/);
  assert.equal(view.projectsCta, '[relevant projects]');
});

test('featured referral projects are ordered first and other projects remain', async () => {
  const { prioritizeReferralProjects } = await import(
    './referral-personalization'
  );
  const projects = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
  const ordered = prioritizeReferralProjects(projects, {
    company: 'Example',
    featuredProjects: ['C', 'A']
  });
  assert.deepEqual(
    ordered.map((project) => project.name),
    ['C', 'A', 'B']
  );
});

test('chat context forbids unsupported claims about the referral company itself', () => {
  const text = buildReferralChatContext({
    company: 'Attendi',
    role: 'Machine Learning Engineer'
  });
  assert.match(text, /routing metadata/i);
  assert.match(text, /do not state or infer facts about the company/i);
});

test('featured referral project chunks are selected in configured order', async () => {
  const { getReferralFeaturedProjectChunks } = await import('./referral-personalization');
  const chunks = [
    'Project Name: VoidArch Context\nDetails: context',
    'Project Name: VoidArch Studio\nDetails: studio',
    'Project Name: AgentSec Suite\nDetails: security'
  ];
  const selected = getReferralFeaturedProjectChunks(chunks, {
    company: 'Attendi',
    featuredProjects: ['AgentSec Suite', 'VoidArch Context']
  });
  assert.deepEqual(selected, [chunks[2], chunks[0]]);
});

test('chat context names explicitly prioritized referral projects', () => {
  const text = buildReferralChatContext({
    company: 'Attendi',
    featuredProjects: ['VoidArch Context', 'AgentSec Suite']
  });
  assert.match(text, /Prioritized projects: VoidArch Context, AgentSec Suite/);
});
