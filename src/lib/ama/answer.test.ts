import assert from 'node:assert/strict';
import test from 'node:test';
import { answerPortfolioQuestion } from './answer';

const statusCopy = /sponsor|work authori[sz]ation|work permit|citizen|visa/i;
test('general hiring and profile answers omit unsolicited eligibility facts', () => {
  for (const question of [
    'Is David available for full-time work?',
    'What roles is David open to?',
    'Tell me about David',
    'What is his experience?'
  ]) {
    assert.doesNotMatch(
      answerPortfolioQuestion(question).answer,
      statusCopy,
      question
    );
  }
});
test('explicit eligibility questions retain the reviewed answer', () => {
  for (const question of [
    'Does David need sponsorship?',
    'What is his work authorization?',
    'Does he need a visa?',
    'Is he eligible to work in the Netherlands?'
  ]) {
    assert.match(
      answerPortfolioQuestion(question).answer,
      /no sponsorship required/i,
      question
    );
  }
});
