import assert from 'node:assert/strict';
import test from 'node:test';
import projects from '../../data/github-projects-rag.json';
import { amaCorpus } from '../ama/corpus';
import * as kb from './knowledge-base';

test('builds one reviewed KB from profile sections and structured projects', () => {
  const docs = kb.buildPortfolioKnowledgeBase(amaCorpus, projects);
  assert.ok(docs.length >= 10);
  assert.ok(docs.some((doc) => doc.title === 'Professional work at WEBINFORM'));
  assert.ok(docs.some((doc) => doc.title === 'AgentSec Suite'));
});

test('BM25 retrieval finds work, availability, and exact technical projects', () => {
  const docs = kb.buildPortfolioKnowledgeBase(amaCorpus, projects);
  assert.equal(
    kb.retrieveKnowledge('ERP integration client discovery', docs, 3)[0].doc
      .title,
    'Professional work at WEBINFORM'
  );
  assert.equal(
    kb.retrieveKnowledge(
      'work authorization sponsorship availability',
      docs,
      3
    )[0].doc.title,
    'About David Papp'
  );
  assert.equal(
    kb.retrieveKnowledge(
      'SurrealDB Tree-sitter BM25 context engine',
      docs,
      3
    )[0].doc.title,
    'VoidArch Context'
  );
});

test('configured referral project titles are deterministic retrieval boosts', () => {
  const docs = kb.buildPortfolioKnowledgeBase(amaCorpus, projects);
  const hits = kb.retrieveKnowledge('why is he relevant?', docs, 3, {
    pinnedTitles: ['AgentSec Suite', 'VoidArch Context']
  });
  assert.deepEqual(
    hits.slice(0, 2).map((hit) => hit.doc.title),
    ['AgentSec Suite', 'VoidArch Context']
  );
});
