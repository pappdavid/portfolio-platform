import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CANONICAL_PROJECT_NAMES,
  DEFAULT_FOCUS_LINE,
  DEFAULT_HERO_ROLE,
  DEFAULT_SUGGESTIONS,
  JOB_TYPES,
  getJobTypeSiteView,
  prioritizeProjects,
  resolveJobType,
  resolveJobTypeFromSearchParams
} from './job-type';

test('resolves every canonical id, label, and common alias', () => {
  for (const profile of Object.values(JOB_TYPES)) {
    assert.equal(resolveJobType(profile.id)?.id, profile.id);
    assert.equal(resolveJobType(profile.label)?.id, profile.id);
    // URL-style spelling with spaces instead of dashes.
    assert.equal(resolveJobType(profile.id.replace(/-/g, ' '))?.id, profile.id);
  }
  assert.equal(resolveJobType('ml engineer')?.id, 'ai-engineering');
  assert.equal(resolveJobType('erp')?.id, 'ai-integration');
  assert.equal(resolveJobType('rpa')?.id, 'automation');
  assert.equal(resolveJobType('full-stack')?.id, 'product-engineering');
});

test('unknown or empty input falls back to null so callers render the general site', () => {
  assert.equal(resolveJobType(null), null);
  assert.equal(resolveJobType(undefined), null);
  assert.equal(resolveJobType(123), null);
  assert.equal(resolveJobType(''), null);
  assert.equal(resolveJobType('   '), null);
  assert.equal(resolveJobType('astronaut'), null);
  assert.equal(resolveJobType('../etc/passwd'), null);

  const params = new URLSearchParams('?role=astronaut');
  const fromParams = resolveJobTypeFromSearchParams(
    Object.fromEntries(params.entries())
  );
  assert.equal(fromParams, null);
});

test('search-param resolution reads the role param and tolerates arrays', () => {
  assert.equal(
    resolveJobTypeFromSearchParams({ role: 'automation' })?.id,
    'automation'
  );
  assert.equal(
    resolveJobTypeFromSearchParams({ role: ['ai-engineering'] })?.id,
    'ai-engineering'
  );
  assert.equal(resolveJobTypeFromSearchParams({}), null);
  assert.equal(resolveJobTypeFromSearchParams(undefined), null);
});

test('every profile features only canonical project names', () => {
  const canonical = new Set(
    CANONICAL_PROJECT_NAMES.map((n) => n.toLowerCase())
  );
  for (const profile of Object.values(JOB_TYPES)) {
    assert.ok(profile.featuredProjects.length > 0, profile.id);
    for (const name of profile.featuredProjects) {
      assert.ok(
        canonical.has(name.toLowerCase()),
        `${profile.id} features unknown project ${name}`
      );
    }
  }
});

test('general site (no profile, no referral) reproduces today’s copy exactly', () => {
  const view = getJobTypeSiteView(null, null);
  assert.equal(view.profile, null);
  assert.equal(view.heroRole, DEFAULT_HERO_ROLE);
  assert.equal(view.focusLine, DEFAULT_FOCUS_LINE);
  assert.deepEqual(view.suggestions, DEFAULT_SUGGESTIONS);
  assert.deepEqual(view.recruiterChips, []);
  assert.equal(view.recruiterGreeting, null);
  assert.match(view.heroTag, /Building AI-first solutions/);
  assert.equal(view.projectsCta, '[projects]');
});

test('a job-type profile shapes hero, focus, chat, and suggestions without referral overrides', () => {
  const view = getJobTypeSiteView(JOB_TYPES.automation, null);
  assert.equal(view.profile?.id, 'automation');
  assert.notEqual(view.heroRole, DEFAULT_HERO_ROLE);
  assert.match(view.heroTag, /Automating real workflows/);
  assert.match(view.focusLine, /workflow automation/);
  assert.match(view.chatGreeting, /automation roles/);
  assert.match(view.chatContextLabel, /automation profile/);
  assert.ok(!view.suggestions.includes(DEFAULT_SUGGESTIONS[0]));
  assert.ok(view.recruiterChips.length > 0);
  assert.match(view.recruiterGreeting ?? '', /David's assistant/);
});

test('every job-type profile exposes recruiter chips and a warmer recruiter greeting', () => {
  for (const profile of Object.values(JOB_TYPES)) {
    const view = getJobTypeSiteView(profile, null);
    assert.ok(
      Array.isArray(view.recruiterChips),
      `${profile.id}: recruiterChips must be an array`
    );
    assert.ok(
      view.recruiterChips.length > 0,
      `${profile.id}: recruiterChips must not be empty`
    );
    assert.ok(
      view.recruiterChips.length <= 6,
      `${profile.id}: recruiterChips must not exceed 6`
    );
    assert.ok(
      view.recruiterGreeting && view.recruiterGreeting.length > 0,
      `${profile.id}: recruiterGreeting must be set`
    );
  }
  // General-site copy stays byte-identical.
  const general = getJobTypeSiteView(null, null);
  assert.deepEqual(general.recruiterChips, []);
  assert.equal(general.recruiterGreeting, null);
});

test('referral copy stays the most specific override on top of a job-type profile', () => {
  const snapshot = {
    company: 'Attendi',
    role: 'Machine Learning Engineer',
    focus: ['applied ML'],
    featuredProjects: ['VoidArch Context']
  };
  const jobType = JOB_TYPES['ai-engineering'];
  const view = getJobTypeSiteView(jobType, snapshot);

  // Referral wins the contested strings...
  assert.match(view.heroTag, /Attendi/);
  assert.match(view.target ?? '', /Attendi/);
  assert.equal(view.roleFocus, 'applied ML');
  assert.match(view.chatContextLabel, /referral/);
  // ...but never removes job-type structure.
  assert.equal(view.profile?.id, 'ai-engineering');
  assert.equal(view.heroRole, jobType.heroRole);
  assert.equal(view.focusLine, jobType.focusLine);
  assert.deepEqual(view.suggestions, jobType.suggestions);
});

test('prioritization: referral tier first, then job type, then curated order preserved', () => {
  const projects = [
    { name: 'VoidArch Studio' },
    { name: 'VoidArch Context' },
    { name: 'AgentSec Suite' },
    { name: 'saas-core' }
  ];

  const none = prioritizeProjects(projects, {});
  assert.deepEqual(none, projects);

  const byJobType = prioritizeProjects(projects, {
    jobType: JOB_TYPES['product-engineering']
  });
  // Featured trio first in listed order, unfeatured remainder keeps
  // original relative order.
  assert.deepEqual(
    byJobType.map((p) => p.name),
    ['AgentSec Suite', 'saas-core', 'VoidArch Context', 'VoidArch Studio']
  );

  const byReferral = prioritizeProjects(projects, {
    jobType: JOB_TYPES['product-engineering'],
    referral: { company: 'X', featuredProjects: ['VoidArch Context'] }
  });
  assert.deepEqual(
    byReferral.map((p) => p.name),
    ['VoidArch Context', 'AgentSec Suite', 'saas-core', 'VoidArch Studio']
  );

  // Unknown featured names are ignored and ties keep original order.
  const unknownOnly = prioritizeProjects(projects, {
    jobType: {
      ...JOB_TYPES.automation,
      featuredProjects: ['Nonexistent Thing']
    }
  });
  assert.deepEqual(unknownOnly, projects);
});
