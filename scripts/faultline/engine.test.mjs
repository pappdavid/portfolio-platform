import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createRun,
  sendFirst,
  retry,
  replayFixed,
  probeConflict,
  assertions,
  receipt
} from '../../public/faultline/engine.mjs';
test('lost response leaves committed effect and uncertain client', () => {
  const initial = createRun();
  const run = sendFirst(initial);
  assert.equal(run.visits.length, 1);
  assert.equal(run.observedId, null);
  assert.deepEqual(assertions(run), { completion: false, uniqueness: true });
  assert.equal(initial.attempts, 0);
  assert.equal(sendFirst(run), run);
});
test('baseline retry duplicates; fix replays original effect and completes', () => {
  const baseline = retry(sendFirst(createRun()));
  assert.equal(baseline.visits.length, 2);
  assert.equal(baseline.observedId, 'VIS-743');
  assert.deepEqual(assertions(baseline), {
    completion: true,
    uniqueness: false
  });
  const fixed = replayFixed(baseline);
  assert.equal(fixed.visits.length, 1);
  assert.equal(fixed.observedId, 'VIS-742');
  assert.deepEqual(assertions(fixed), { completion: true, uniqueness: true });
  assert.equal(fixed.receipts['WORK-318'].id, fixed.visits[0].id);
});
test('all fault positions and retry counts have expected effects', () => {
  for (const fault of ['before', 'after', 'none'])
    for (const retries of [1, 2, 3, 4, 5])
      for (const adapter of ['baseline', 'fixed']) {
        const run = retry(sendFirst(createRun({ fault, retries, adapter })));
        assert.equal(
          run.visits.length,
          adapter === 'fixed' ? 1 : retries + (fault === 'before' ? 0 : 1)
        );
        assert.equal(assertions(run).completion, true);
      }
});
test('repeated retries remain safe only for fixed stable key receiver', () => {
  let run = replayFixed(retry(sendFirst(createRun({ retries: 5 }))));
  for (let i = 0; i < 30; i++) run = retry(run);
  assert.equal(run.visits.length, 1);
  assert.equal(run.attempts, 156);
  const unsafe = replayFixed(
    retry(sendFirst(createRun({ stableKey: false, retries: 5 })))
  );
  assert.equal(unsafe.visits.length, 6);
  assert.equal(assertions(unsafe).uniqueness, false);
});
test('payload conflict rejects mutation without creating an effect', () => {
  const fixed = replayFixed(retry(sendFirst(createRun())));
  const probed = probeConflict(fixed);
  assert.equal(probed.conflict, true);
  assert.equal(probed.visits.length, 1);
  assert.deepEqual(probed.visits, fixed.visits);
  assert.equal(probed.trace.at(-1).kind, 'conflict');
  assert.deepEqual(assertions(probed), { completion: true, uniqueness: true });
});
test('reset and independent runs share no mutable state', () => {
  const a = retry(sendFirst(createRun()));
  const b = createRun();
  assert.equal(b.visits.length, 0);
  assert.equal(b.trace.length, 0);
  assert.equal(b.observedId, null);
  assert.equal(a.visits.length, 2);
  assert.equal(retry(b), b);
});
test('evidence contains model caveats and computed assertions', () => {
  const run = replayFixed(retry(sendFirst(createRun())));
  const evidence = JSON.parse(JSON.stringify(receipt(run)));
  assert.match(evidence.disclosure, /in-memory/i);
  assert.match(evidence.disclosure, /not proof/);
  assert.deepEqual(evidence.assertions, assertions(run));
});
test('invalid configs rejected rather than silently normalized', () => {
  for (const config of [
    { fault: 'oops' },
    { retries: 0 },
    { retries: 50 },
    { retries: 1.5 },
    { adapter: 'fake' },
    { stableKey: 'true' }
  ])
    assert.throws(() => createRun(config));
});

test('fixed replay matches all prior baseline attempts including extra batches', () => {
  let baseline = retry(sendFirst(createRun({ retries: 3 })));
  baseline = retry(retry(baseline));
  const fixed = replayFixed(baseline);
  assert.equal(baseline.attempts, 10);
  assert.equal(fixed.attempts, 10);
  assert.equal(baseline.visits.length, 10);
  assert.equal(fixed.visits.length, 1);
});
