import assert from 'node:assert/strict';
import test from 'node:test';
import {
  COMPANY_SLUG_QUERY_PARAM,
  humanizeCompanySlug,
  mergeReferralWithCompanySlug,
  parseCompanySlug,
  snapshotFromCompanySlug,
  snapshotFromCompanySearchParam
} from './company-slug';
import { getJobTypeSiteView } from './job-type';

test('parseCompanySlug accepts hunt-style kebab slugs', () => {
  assert.equal(parseCompanySlug('databricks'), 'databricks');
  assert.equal(parseCompanySlug('Xebia'), 'xebia');
  assert.equal(parseCompanySlug(['a-s-r-verzekeringen']), 'a-s-r-verzekeringen');
  assert.equal(COMPANY_SLUG_QUERY_PARAM, 'c');
});

test('parseCompanySlug rejects junk and reserved-looking noise', () => {
  assert.equal(parseCompanySlug(''), null);
  assert.equal(parseCompanySlug('a'), null);
  assert.equal(parseCompanySlug('has spaces'), null);
  assert.equal(parseCompanySlug('../etc'), null);
  assert.equal(parseCompanySlug('foo--bar'), null);
  assert.equal(parseCompanySlug('foo/bar'), null);
  assert.equal(parseCompanySlug(undefined), null);
});

test('humanizeCompanySlug title-cases hyphenated tokens', () => {
  assert.equal(humanizeCompanySlug('databricks'), 'Databricks');
  assert.equal(humanizeCompanySlug('a-s-r-verzekeringen'), 'A S R Verzekeringen');
});

test('slug snapshot frames the company without inventing a role or projects', () => {
  const snap = snapshotFromCompanySlug('databricks');
  assert.equal(snap.company, 'Databricks');
  assert.equal(snap.role, undefined);
  assert.equal(snap.featuredProjects, undefined);
  assert.match(snap.heroTag ?? '', /Databricks/);
  assert.match(snap.chatContext ?? '', /do not state or infer facts about the company/i);
});

test('cookie referral wins over ?c=', () => {
  const cookie = { company: 'Bound Token Co', role: 'FDE' };
  const merged = mergeReferralWithCompanySlug(cookie, 'databricks');
  assert.equal(merged?.company, 'Bound Token Co');
  assert.equal(merged?.role, 'FDE');
});

test('?c= fills in when no referral cookie exists', () => {
  const merged = mergeReferralWithCompanySlug(null, 'databricks');
  assert.equal(merged?.company, 'Databricks');
  assert.equal(snapshotFromCompanySearchParam('not a slug'), null);
});

test('slug snapshot only frames the landing view, it does not add a job-type profile', () => {
  const view = getJobTypeSiteView(null, snapshotFromCompanySlug('databricks'));
  assert.equal(view.profile, null);
  assert.match(view.heroTag, /Databricks/);
  assert.match(view.chatGreeting, /Databricks/);
});
