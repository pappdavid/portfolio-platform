import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  INTERVIEW_SCRIPT,
  QUIZ_SCRIPT,
  FLOW_EXAMPLE,
  ROLE_GROUP_LABELS,
  resolveDemoIntent,
  scoreQuiz,
  type RoleGroupId
} from './assistant-intents';
import { DEMO_CHIPS, type RecruiterChip } from './recruiter-chips';

/* ------------------------------------------------------------------ */
/* Interview script                                                    */
/* ------------------------------------------------------------------ */

test('interview script has nine deterministic, fully-populated steps', () => {
  assert.equal(INTERVIEW_SCRIPT.length, 9);
  for (const step of INTERVIEW_SCRIPT) {
    assert.ok(step.question.trim().length > 0);
    assert.ok(step.answer.trim().length > 0);
    assert.ok(step.receipt.length > 0);
    for (const label of step.receipt) {
      assert.ok(label.trim().length > 0);
    }
  }
});

test('interview answers stay grounded: approximate numbers stay approximate', () => {
  const joined = INTERVIEW_SCRIPT.map((s) => s.answer).join(' ');
  // The only approved quantitative result, kept approximate:
  assert.match(joined, /roughly 40%/);
  // Prototypes are never described as production systems:
  for (const step of INTERVIEW_SCRIPT) {
    assert.doesNotMatch(step.answer, /production-ready/i);
  }
});

/* ------------------------------------------------------------------ */
/* Quiz                                                                */
/* ------------------------------------------------------------------ */

test('every quiz question has four uniquely-idded choices with valid weights', () => {
  for (const q of QUIZ_SCRIPT) {
    const labels = q.choices.map((c) => c.id);
    assert.equal(labels.length, 4);
    assert.equal(new Set(labels).size, 4);
    for (const [choiceId, weights] of Object.entries(q.weights)) {
      assert.ok(
        labels.includes(choiceId),
        `weight key ${choiceId} must be a choice`
      );
      for (const group of Object.keys(weights ?? {})) {
        const weight = (weights as Record<string, number | undefined>)[group];
        assert.ok(group in ROLE_GROUP_LABELS, `unknown rolegroup ${group}`);
        assert.ok((weight ?? 0) > 0);
      }
    }
  }
  for (const group of Object.keys(ROLE_GROUP_LABELS) as RoleGroupId[]) {
    const reachable = QUIZ_SCRIPT.some((q) =>
      Object.values(q.weights).some((w) => group in (w ?? {}))
    );
    assert.ok(reachable, `${group} must be reachable via some answer`);
  }
});

test('scoreQuiz is deterministic and ties resolve in rolegroup order', () => {
  const allModels = ['models', 'quality', 'costfix', 'deep'];
  assert.equal(scoreQuiz(allModels), 'ai-engineering');

  const allIntegration = ['connect', 'bridge', 'erp', 'bridge'];
  assert.equal(scoreQuiz(allIntegration), 'ai-integration');

  // Genuine 4-4 tie: automation (manual+safety) vs product-engineering
  // (velocity+build); strict-> keeps the earlier rolegroup order.
  const tied = ['manual', 'velocity', 'safety', 'build'];
  assert.equal(scoreQuiz(tied), 'automation');

  // Repeated scoring yields identical results (no randomness):
  assert.deepEqual(
    [...Array(5)].map(() => scoreQuiz(allModels)),
    [...Array(5)].fill('ai-engineering')
  );
});

/* ------------------------------------------------------------------ */
/* Flow example                                                        */
/* ------------------------------------------------------------------ */

test('flow example is a well-formed, honestly-labelled DAG fragment', () => {
  assert.match(FLOW_EXAMPLE.summary, /[Ii]llustrative/);
  const nodeIds = new Set(FLOW_EXAMPLE.nodes.map((n) => n.id));
  assert.equal(nodeIds.size, FLOW_EXAMPLE.nodes.length);
  for (const edge of FLOW_EXAMPLE.edges) {
    assert.ok(nodeIds.has(edge.from), `edge from ${edge.from} missing node`);
    assert.ok(nodeIds.has(edge.to), `edge to ${edge.to} missing node`);
  }
  assert.ok(FLOW_EXAMPLE.nodes.some((n) => n.type === 'decision'));
});

/* ------------------------------------------------------------------ */
/* Token resolution                                                    */
/* ------------------------------------------------------------------ */

test('interview tokens resolve to the right step, out-of-range returns null', () => {
  assert.deepEqual(resolveDemoIntent('interview:start'), {
    kind: 'interview',
    step: 0
  });
  assert.deepEqual(resolveDemoIntent('INTERVIEW:Step:4'), {
    kind: 'interview',
    step: 4
  });
  assert.deepEqual(resolveDemoIntent('  interview:step:8  '), {
    kind: 'interview',
    step: 8
  });
  assert.equal(resolveDemoIntent('interview:step:9'), null);
  assert.equal(resolveDemoIntent('interview:step:99'), null);
});

test('quiz tokens carry stateless answer chains', () => {
  assert.deepEqual(resolveDemoIntent('quiz:start'), {
    kind: 'quiz',
    answered: []
  });
  assert.deepEqual(resolveDemoIntent('quiz:next'), {
    kind: 'quiz',
    answered: []
  });

  assert.deepEqual(resolveDemoIntent('quiz:answer:models'), {
    kind: 'quiz',
    answered: ['models']
  });
  assert.deepEqual(resolveDemoIntent('quiz:answer:models:connect:costfix'), {
    kind: 'quiz',
    answered: ['models', 'connect', 'costfix']
  });
  // Unknown ids are filtered rather than corrupting state:
  assert.deepEqual(resolveDemoIntent('quiz:answer:bogus:models'), {
    kind: 'quiz',
    answered: ['models']
  });
  // All-noise resets to a fresh quiz instead of falling through to the LLM:
  assert.deepEqual(resolveDemoIntent('quiz:answer:bogus'), {
    kind: 'quiz',
    answered: []
  });
  // A complete chain still resolves (caller emits the result card):
  assert.deepEqual(
    resolveDemoIntent('quiz:answer:models:quality:costfix:deep'),
    {
      kind: 'quiz',
      answered: ['models', 'quality', 'costfix', 'deep']
    }
  );
});

test('flow token resolves; ordinary prose never captures into a demo intent', () => {
  assert.deepEqual(resolveDemoIntent('flow:example'), { kind: 'flow' });

  const plainQuestions = [
    "What's your stack?",
    'Will he fit our team?',
    'Tell me about the interview process at your last job',
    'how would you quiz a candidate',
    'quiz me on typescript',
    'flowcharts in general',
    ''
  ];
  for (const q of plainQuestions) {
    assert.equal(resolveDemoIntent(q), null, `must not capture: "${q}"`);
  }
});

/* ------------------------------------------------------------------ */
/* Demo chips                                                          */
/* ------------------------------------------------------------------ */

test('every profile exposes three demo chips wired to real start tokens', () => {
  for (const [profileId, chips] of Object.entries<RecruiterChip[]>(
    DEMO_CHIPS
  )) {
    assert.equal(
      chips.length,
      3,
      `${profileId}: expected exactly 3 demo chips`
    );
    const questions = new Set(chips.map((c) => c.question));
    assert.equal(
      questions.size,
      3,
      `${profileId}: chip questions must be unique`
    );
    for (const chip of chips) {
      const intent = resolveDemoIntent(chip.answer);
      assert.ok(
        intent,
        `${profileId}: chip token must resolve (${chip.answer})`
      );
    }
  }
});
