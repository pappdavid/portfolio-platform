import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  RECRUITER_CHIPS,
  findRecruiterChipAnswer,
  getRecruiterChipQuestions,
  type RecruiterChip
} from './recruiter-chips';

const corpus = readFileSync(
  new URL('./ama/corpus.ts', import.meta.url),
  'utf8'
);

test('every profile has recruiter chips with non-empty question + answer', () => {
  for (const [profileId, chips] of Object.entries(RECRUITER_CHIPS)) {
    assert.ok(chips.length > 0, `${profileId}: must have at least one chip`);
    for (const chip of chips as RecruiterChip[]) {
      assert.ok(
        chip.question.length > 0,
        `${profileId}: chip question must be non-empty`
      );
      assert.ok(
        chip.answer.length > 0,
        `${profileId}: chip answer must be non-empty`
      );
      assert.ok(
        !chip.answer.includes('production-ready'),
        `${profileId}: chip answer must not claim production-ready`
      );
      assert.ok(
        !/\b\d{2,}%\s*(?:uptime|availability|savings|reduction)\b/i.test(
          chip.answer
        ),
        `${profileId}: chip answer must not invent percentage metrics`
      );
    }
  }
});

test('chip answers stay grounded in corpus facts (no invented metrics/clients)', () => {
  for (const chips of Object.values(RECRUITER_CHIPS)) {
    for (const chip of chips as RecruiterChip[]) {
      // "roughly 40%" is the only allowed approximate metric.
      const mentions40 = chip.answer.includes('roughly 40%');
      const inventedPct =
        /\b\d{2,}%\b/.test(chip.answer) && !chip.answer.includes('40%');
      assert.ok(
        !inventedPct,
        `chip "${chip.question}" has invented percentage`
      );
      assert.ok(
        !chip.answer.includes('fine-tuning'),
        `chip "${chip.question}" must not claim fine-tuning experience`
      );
      if (mentions40) {
        assert.match(chip.answer, /roughly 40%/);
      }
    }
  }
});

test('findRecruiterChipAnswer returns the deterministic answer for known questions', () => {
  for (const chips of Object.values(RECRUITER_CHIPS)) {
    for (const chip of chips as RecruiterChip[]) {
      const answer = findRecruiterChipAnswer(chip.question);
      assert.equal(answer, chip.answer);
      // Case-insensitive and whitespace-tolerant matching.
      assert.equal(
        findRecruiterChipAnswer(`  ${chip.question.toUpperCase()}  `),
        chip.answer
      );
    }
  }
  assert.equal(
    findRecruiterChipAnswer('how many angels dance on a pin?'),
    null
  );
  assert.equal(findRecruiterChipAnswer(''), null);
});

test('getRecruiterChipQuestions returns the questions in order', () => {
  const questions = getRecruiterChipQuestions('ai-engineering');
  assert.deepEqual(
    questions,
    (RECRUITER_CHIPS['ai-engineering'] as RecruiterChip[]).map(
      (c) => c.question
    )
  );
  assert.ok(questions.length > 0);
});
