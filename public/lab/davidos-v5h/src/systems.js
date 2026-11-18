import {
  BOOKING,
  createRun,
  sendFirst,
  retry,
  replayFixed,
  probeConflict,
  receipt,
  assertions,
} from './engine.mjs';

import { printedTrace } from './printed-trace.js';
function executeBooking() {
  const first = sendFirst(createRun({ adapter: 'fixed' }));
  const duplicate = retry(sendFirst(createRun()));
  const fixed = replayFixed(duplicate);
  return [first, first, duplicate, fixed, probeConflict(fixed)].map(
    (run, i) => {
      const record = receipt(run);
      return {
        count: record.visits.length,
        unique: assertions(run).uniqueness,
        events: (i === 0
          ? record.trace.slice(0, 2)
          : record.trace.slice(-3)
        ).map((e) => e.title),
      };
    },
  );
}
export const runs = matchMedia('(prefers-reduced-motion: reduce)').matches
  ? printedTrace
  : executeBooking();
const traces = runs.map((r) => r.events);
const scenario = [
  [
    6,
    10.5,
    'engineer',
    'How does your API integration work? Do you support webhooks?',
  ],
  [10.7, 14.5, 'se', 'REST over HTTPS with OAuth2, webhooks signed with HMAC.'],
  [27, 31, 'engineer', "What's the latency and throughput spec under load?"],
  [
    31.2,
    35,
    'se',
    'p50 is 120 milliseconds, sustained five thousand events per second.',
  ],
  [
    44,
    49,
    'engineer',
    'Who is from your team should review our security questionnaire? Who is the technical contact?',
  ],
];
const contact =
  'Marcus Chen — Solutions Engineer, our side (technical deep-dives)';
const title = "Who's who";
const windowed = scenario.filter((line) => line[1] >= scenario.at(-1)[1] - 30);
export const systems = [
  {
    id: 'client-studio',
    kind: 'Grounded answers',
    plate: '01',
    letter: 'A',
    parts: [
      'Question',
      'Source v2',
      'Audience filter',
      'Review gate',
      'Snapshot',
    ],
    desc: 'A company assistant answers from supplied text, shows the exact sentence it used, and goes live after a person approves it.',
    stack: 'TypeScript, Next.js, React, Supabase (PostgreSQL)',
    proof: '65 unit tests',
    scope:
      'Hosted fictional demo. Lexical retrieval, model calls off. Private source.',
    demo: 'https://client-studio-psi.vercel.app',
    beats: [
      [
        'A question arrives.',
        'The assistant receives a question against the supplied sources.',
        'Incoming question',
        ['“What is the API batch limit?”'],
      ],
      [
        'The answer comes with its source.',
        'Lexical retrieval quotes the matching excerpt from source version 2.',
        'Source excerpt · v2',
        ['“up to 50 records”'],
      ],
      [
        'Internal text stays inside.',
        'The server filters sources by audience before returning the customer view.',
        'Customer view',
        ['Supplied excerpt → visible', 'Internal source → withheld'],
      ],
      [
        'A person approves what goes live.',
        'Activation stores an immutable snapshot of the approved configuration and sources.',
        'Review record',
        ['Human review → approved', 'Source v2 → frozen snapshot'],
      ],
      [
        'A late edit is refused.',
        'Writes are revision-checked and idempotent. A stale write returns HTTP 409.',
        'Write result',
        ['Stale revision → 409', 'Approved snapshot retained'],
      ],
    ],
  },
  {
    id: 'active-companion',
    kind: 'Live references',
    plate: '02',
    letter: 'B',
    parts: [
      'Transcript',
      'Context window',
      'Intent',
      'Source card',
      'Citation gate',
    ],
    desc: 'It follows a transcript and brings up the right reference card at the right moment. Every card names its source.',
    stack: 'Python',
    proof: '18 tests in CI · public MIT source',
    scope:
      'Scripted replay of four fictional conversations. No inference, microphone or uploads. Unevaluated on real meetings.',
    demo: 'https://active-companion-replay.vercel.app',
    source: 'https://github.com/pappdavid/active-companion',
    beats: [
      [
        'The conversation comes in.',
        'Scripted transcript replay preserves each speaker and utterance timestamp.',
        'Transcript · technical discussion',
        scenario
          .slice(0, 2)
          .map((v) => v[0] + 's / ' + v[2] + '   “' + v[3] + '”'),
      ],
      [
        'Only the last 30 seconds stay.',
        'A sliding context window drops utterances ending before the trailing horizon.',
        'Context at 49s',
        [
          '6s / opening question → expired',
          windowed.length + ' utterances in the trailing 30s',
        ],
      ],
      [
        'Someone asks who can help.',
        'Heuristic intent classification identifies a contact lookup.',
        'Intent · contact_lookup',
        ['“' + scenario.at(-1)[3] + '”'],
      ],
      [
        'A card names the contact.',
        'TF-IDF retrieval carries the matching source title onto the card.',
        'Reference / ' + title,
        [contact],
      ],
      [
        'Only sourced bullets survive.',
        'The optional answer keeps bullets citing retrieved titles. On failure the retrieval cards remain.',
        'Citation check',
        ['Cites “' + title + '” → keep', 'Missing source → drop'],
      ],
    ],
  },
  {
    id: 'faultline',
    kind: 'Safe retries',
    plate: '03',
    letter: 'C',
    parts: [
      'Booking',
      'Return path',
      'Plain receiver',
      'Keyed receipt',
      'Conflict check',
    ],
    desc: 'It shows why “just try again” can book the same job twice, and the fix that prevents it.',
    stack: 'JavaScript · in-memory engine',
    proof: '12 tests in CI · public MIT source',
    scope:
      'Browser teaching model. Atomic effect-and-receipt storage is assumed. This drawing runs the demo’s own engine.',
    demo: 'https://davidpapp.dev/faultline/index.html',
    source: 'https://github.com/pappdavid/faultline',
    beats: [
      [
        'A booking is made.',
        'The keyed receiver commits the visit and its receipt in one model transaction.',
        BOOKING.operation + ' / ' + BOOKING.service,
        traces[0],
      ],
      [
        'The reply goes missing.',
        'The reply is dropped after commit. The sender has no confirmed visit ID.',
        BOOKING.operation + ' / response path',
        traces[1],
      ],
      [
        'One retry books the job twice.',
        'The plain receiver repeats the side effect because it does not remember the operation key.',
        runs[2].count + ' visits / ' + BOOKING.operation,
        traces[2],
      ],
      [
        'The saved receipt stops a duplicate.',
        'The keyed receiver stores the operation key and payload fingerprint and replays the original result.',
        runs[3].count + ' visit / ' + BOOKING.operation,
        traces[3],
      ],
      [
        'A changed booking is refused.',
        'The same key with a different payload fingerprint returns HTTP 409.',
        (runs[4].unique ? 'Unique visit' : 'Duplicate visit') +
          ' / ' +
          BOOKING.operation,
        traces[4],
      ],
    ],
  },
];
export const contacts = [
  ['LinkedIn', 'https://www.linkedin.com/in/d%C3%A1vid-papp'],
  ['GitHub', 'https://github.com/pappdavid'],
];
export const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const smooth = (v) => {
  v = clamp(v);
  return v * v * (3 - 2 * v);
};
export const total = 14.25;
export const start = (i) => 1 + 4 * i;
export const beatPosition = (i, b) =>
  start(i) + (b === 0 ? 0.29 : 4 * (0.14 + (b - 0.5) * 0.15));
export function stateAt(s) {
  if (s < 1) return { i: -1, b: 0, t: s };
  if (s >= 13) return { i: 3, b: 0, t: s - 13 };
  const i = Math.floor((s - 1) / 4),
    t = (s - start(i)) / 4;
  return {
    i,
    b: t < 0.14 ? 0 : Math.min(5, 1 + Math.floor((t - 0.14) / 0.15)),
    t,
  };
}
