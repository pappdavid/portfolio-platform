/** A deterministic, in-memory receiver model. No external requests are made. */
export const BOOKING = Object.freeze({
  operation: 'WORK-318',
  service: 'Boiler inspection',
  slot: '09:30–10:00',
  location: 'Demo workshop'
});
export function createRun({
  adapter = 'baseline',
  fault = 'after',
  stableKey = true,
  retries = 1
} = {}) {
  if (
    !['baseline', 'fixed'].includes(adapter) ||
    !['after', 'before', 'none'].includes(fault) ||
    typeof stableKey !== 'boolean' ||
    !Number.isInteger(retries) ||
    retries < 1 ||
    retries > 5
  )
    throw new Error('Invalid run configuration');
  return {
    config: { adapter, fault, stableKey, retries },
    phase: 'ready',
    attempts: 0,
    visits: [],
    receipts: {},
    trace: [],
    observedId: null,
    conflict: false
  };
}
function event(run, kind, title, detail) {
  run.trace.push({
    sequence: run.trace.length + 1,
    attempt: run.attempts,
    kind,
    title,
    detail
  });
}
function receive(run, key, payload) {
  const fingerprint = JSON.stringify([
    payload.operation,
    payload.service,
    payload.slot,
    payload.location
  ]);
  const receipt = run.receipts[key];
  if (run.config.adapter === 'fixed' && receipt) {
    if (receipt.fingerprint !== fingerprint) {
      event(
        run,
        'conflict',
        '409 · Key reused with a different payload',
        'Receiver rejects the mutation. No extra visit is created.'
      );
      return { status: 409 };
    }
    event(
      run,
      'replay',
      `Replay stored result · ${receipt.id}`,
      'Same key + same payload. Return the original visit without another effect.'
    );
    return { status: 200, id: receipt.id };
  }
  const id = `VIS-${742 + run.visits.length}`;
  // One synchronous transaction in this model: effect + receipt commit together.
  run.visits.push({ id, key, ...payload });
  if (run.config.adapter === 'fixed') run.receipts[key] = { fingerprint, id };
  event(
    run,
    'commit',
    `Committed · ${id}`,
    run.config.adapter === 'fixed'
      ? 'Visit and idempotency receipt committed atomically in the model.'
      : 'Receiver creates a visit. It does not remember the operation key.'
  );
  return { status: 201, id };
}
function attempt(run, payload = BOOKING, drop = false) {
  run.attempts += 1;
  const key =
    run.config.stableKey || run.attempts === 1
      ? BOOKING.operation
      : `${BOOKING.operation}-retry-${run.attempts}`;
  event(
    run,
    'request',
    `POST /visits · attempt ${run.attempts}`,
    `Idempotency-Key: ${key}`
  );
  if (drop && run.config.fault === 'before') {
    event(
      run,
      'drop',
      'Request lost · before commit',
      'The receiver sees nothing. The client has no confirmation.'
    );
    return;
  }
  const result = receive(run, key, payload);
  if (result.status === 409) {
    run.conflict = true;
    return;
  }
  if (drop && run.config.fault === 'after') {
    event(
      run,
      'drop',
      'Response lost · after commit',
      'The visit exists. The client times out and cannot tell whether it committed.'
    );
    return;
  }
  run.observedId = result.id;
  event(
    run,
    'response',
    `${result.status} received · ${result.id}`,
    'Client can now confirm this visit against receiver state.'
  );
}
export function sendFirst(state) {
  if (state.phase !== 'ready') return state;
  const run = structuredClone(state);
  attempt(run, BOOKING, true);
  run.phase = 'sent';
  return run;
}
export function retry(state) {
  if (state.phase !== 'sent' && state.phase !== 'retried') return state;
  const run = structuredClone(state);
  for (let i = 0; i < run.config.retries; i++) attempt(run);
  run.phase = 'retried';
  return run;
}
export function replayFixed(state) {
  const run = sendFirst(createRun({ ...state.config, adapter: 'fixed' }));
  // Replay every baseline attempt, including extra retry batches, for a fair comparison.
  const retryCount = Math.max(state.attempts - 1, state.config.retries);
  for (let i = 0; i < retryCount; i++) attempt(run);
  run.phase = 'retried';
  return run;
}
export function probeConflict(state) {
  if (
    state.config.adapter !== 'fixed' ||
    !state.visits.length ||
    !state.config.stableKey
  )
    return state;
  const run = structuredClone(state);
  attempt(run, { ...BOOKING, slot: '11:00–11:30' });
  return run;
}
export function assertions(run) {
  return {
    completion:
      !!run.observedId && run.visits.some((v) => v.id === run.observedId),
    uniqueness:
      run.visits.filter((v) => v.operation === BOOKING.operation).length === 1
  };
}
export function receipt(run) {
  return {
    showcase: 'Faultline',
    modelVersion: 1,
    disclosure:
      'Executed deterministic browser simulation. Seeded booking. In-memory receiver, no network or real booking. Atomic effect + receipt is an explicit model assumption; not proof of durable distributed behavior.',
    ...run,
    assertions: assertions(run)
  };
}
