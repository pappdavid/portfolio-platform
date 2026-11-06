import {
  createRun,
  sendFirst,
  retry,
  replayFixed,
  probeConflict,
  assertions,
  receipt
} from './engine.mjs';
const $ = (selector) => document.querySelector(selector);
let state = createRun();
let baseline = null;
const emptyState = $('#trace .empty-state').cloneNode(true);
const config = () => ({
  fault: $('[data-fault][aria-pressed="true"]').dataset.fault,
  stableKey: $('#stable-key').checked,
  retries: Number($('#retries').value)
});
const faultDescriptions = {
  after:
    'The service commits a visit, then the response is dropped. The client sees a timeout.',
  before:
    'The request is lost before it reaches the receiver. No visit is committed until a retry arrives.',
  none: 'Control experiment: the request and response both arrive. Retry anyway to test duplicate protection.'
};
function reset() {
  state = createRun(config());
  baseline = null;
  render();
}
function node(tag, className, text) {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = text;
  return el;
}
function announce(text) {
  $('#announcement').textContent = text;
}
function render() {
  const { adapter, fault, stableKey } = state.config;
  const fixed = adapter === 'fixed';
  const started = state.phase !== 'ready';
  const retried = state.phase === 'retried';
  const checks = assertions(state);
  $('#scenario-note').textContent =
    faultDescriptions[fault] +
    (!stableKey
      ? ' Warning: each retry gets a new key, so even the fixed receiver will create new visits.'
      : '');
  $('#adapter-label').textContent = fixed
    ? 'FIXED / ATOMIC DEDUPLICATION'
    : 'BASELINE / NO DEDUPLICATION';
  $('#adapter-label').classList.toggle('fixed', fixed);
  $('#visit-count').textContent = state.visits.length;
  const callout = $('#state-callout');
  callout.className = 'state-callout';
  if (!started)
    callout.textContent = 'The receiver is empty. Start the experiment.';
  else if (state.visits.length > 1) {
    callout.textContent = fixed
      ? 'Different keys, duplicate intent. The contract cannot help if the caller changes its key.'
      : 'Duplicate effect. The retry created another visit for the same intended booking.';
    callout.classList.add('bad');
  } else if (!state.observedId && state.visits.length) {
    callout.textContent =
      'Committed, but unconfirmed. The client sees a timeout, not this visit.';
    callout.classList.add('warn');
  } else if (!state.visits.length) {
    callout.textContent =
      'Nothing committed. The request never reached the receiver.';
    callout.classList.add('warn');
  } else {
    callout.textContent = fixed
      ? `One visit. ${state.attempts} attempts. The client received the original result.`
      : 'One visit confirmed. An extra request is still unsafe without deduplication.';
    callout.classList.add('good');
  }
  if (state.trace.length) {
    $('#trace').replaceChildren(
      ...state.trace.map((e) => {
        const li = node('li', `event ${e.kind}`, '');
        const marker = node(
          'span',
          'event-marker',
          {
            request: '→',
            commit: '◆',
            drop: '×',
            response: '←',
            replay: '=',
            conflict: '!'
          }[e.kind]
        );
        marker.setAttribute('aria-hidden', 'true');
        const body = node('div', 'event-body', '');
        body.append(
          node(
            'span',
            'event-number',
            `${String(e.sequence).padStart(2, '0')} / ATTEMPT ${e.attempt}`
          ),
          node('strong', '', e.title),
          node('p', '', e.detail)
        );
        li.append(marker, body);
        return li;
      })
    );
  } else if (!$('#trace .empty-state')) {
    $('#trace').replaceChildren(emptyState.cloneNode(true));
  }
  $('#trace').scrollTop = $('#trace').scrollHeight;
  $('#visits').replaceChildren(
    ...state.visits.map((v) => {
      const row = node('div', 'visit-record', '');
      row.append(node('strong', '', v.id), node('span', '', v.key));
      return row;
    })
  );
  for (const [key, pass] of Object.entries(checks)) {
    const el = $(`#${key}`);
    el.textContent = !started ? 'NOT RUN' : pass ? 'PASS' : 'FAIL';
    el.className = !started ? 'pending' : pass ? 'pass' : 'fail';
  }
  const primary = $('#primary');
  primary.disabled = fixed;
  primary.textContent = !started
    ? fault === 'none'
      ? 'Send request →'
      : fault === 'before'
        ? 'Send request & drop it →'
        : 'Send request & lose response →'
    : !retried
      ? `Retry ${state.config.retries === 1 ? 'the request' : `${state.config.retries} times`} →`
      : fixed
        ? 'Fixed receiver replayed ✓'
        : 'Apply idempotency & replay →';
  $('#guidance').replaceChildren(
    node('span', 'step-circle', !started ? '1' : !retried ? '2' : '3'),
    (() => {
      const span = node('span', '', '');
      span.append(
        node(
          'strong',
          '',
          !started
            ? 'First, create the uncertainty.'
            : !retried
              ? 'Now retry. Inspect the effect.'
              : fixed
                ? checks.uniqueness
                  ? 'Same fault. One committed visit.'
                  : 'The stable-key assumption matters.'
                : 'Run the identical fault through the fix.'
        ),
        node(
          'small',
          '',
          !started
            ? 'Send the booking through the selected fault.'
            : !retried
              ? 'The client cannot infer receiver state from a timeout.'
              : fixed
                ? baseline
                  ? `Baseline: ${baseline.visits.length} visits / ${baseline.attempts} attempts. Fixed: ${state.visits.length} visits / ${state.attempts} attempts. Independent runs.`
                  : 'Inspect the contract below.'
                : 'Fresh receiver state. Same fault and retry count.'
        )
      );
      return span;
    })()
  );
  $('#export').disabled = !started;
  $('#retry-more').hidden = !retried;
  $('#probe').hidden = !fixed || !stableKey || !state.visits.length;
  $('#probe').disabled = state.conflict;
  $('#probe-result').textContent = state.conflict
    ? '409 received. Original visit preserved.'
    : '';
  announce(
    !started
      ? 'Experiment reset.'
      : `${fixed ? 'Fixed receiver' : 'Baseline'}: ${state.visits.length} visits committed. Completion ${checks.completion ? 'passes' : 'fails'}. Uniqueness ${checks.uniqueness ? 'passes' : 'fails'}.`
  );
}
$('#primary').addEventListener('click', () => {
  if (state.phase === 'ready') state = sendFirst(state);
  else if (state.phase === 'sent') state = retry(state);
  else if (state.config.adapter === 'baseline') {
    baseline = structuredClone(state);
    state = replayFixed(state);
  }
  render();
});
$('#retry-more').addEventListener('click', () => {
  state = retry(state);
  render();
});
$('#probe').addEventListener('click', () => {
  state = probeConflict(state);
  render();
});
$('#reset').addEventListener('click', reset);
for (const button of document.querySelectorAll('[data-fault]'))
  button.addEventListener('click', () => {
    for (const b of document.querySelectorAll('[data-fault]')) {
      b.setAttribute('aria-pressed', String(b === button));
      b.classList.toggle('selected', b === button);
    }
    reset();
  });
for (const el of [$('#stable-key'), $('#retries')])
  el.addEventListener('change', reset);
$('#export').addEventListener('click', () => {
  const blob = new Blob(
    [
      JSON.stringify(
        { current: receipt(state), baseline: baseline && receipt(baseline) },
        null,
        2
      )
    ],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = node('a', '', '');
  a.href = url;
  a.download = 'faultline-evidence.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
render();
