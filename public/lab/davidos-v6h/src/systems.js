import { BOOKING } from './engine.mjs';
import { replay } from './companion-data.js';
import { bookingRecords } from './booking.js';
import { printedTrace } from './printed-trace.js';

export const records = matchMedia('(prefers-reduced-motion: reduce)').matches
  ? printedTrace
  : bookingRecords();
const traces = [
  records[0].trace.slice(0, 2),
  records[0].trace,
  records[2].trace.slice(3),
  records[3].trace.slice(3),
  records[4].trace.slice(6),
].map((rows) => rows.map((e) => e.title));

export const systems = [
  {
    id: 'client-studio',
    kind: 'Grounded answers',
    plate: '01',
    desc: 'A company assistant answers from supplied text, shows the exact sentence it used, and goes live after a person approves it.',
    stack: 'TypeScript, Next.js, React, Supabase (PostgreSQL)',
    proof: '65 unit tests',
    scope:
      'Hosted fictional demo. Lexical retrieval, model calls off. Private source.',
    demo: 'https://client-studio-psi.vercel.app',
    beats: [
      [
        'Someone asks what a batch can hold.',
        'The Studio sends the question through its server route in the anonymous workspace.',
        'Incoming question',
        ['“What is the API batch limit?”'],
      ],
      [
        'The answer shows the words it came from.',
        'Lexical retrieval selects source version 2. The answer quotes “up to 50 records” verbatim.',
        'Source excerpt · v2',
        ['“up to 50 records”'],
      ],
      [
        'Internal text stays out of the customer’s evidence.',
        'The server filters source fragments by audience and selected version before they can enter a customer answer.',
        'Customer view',
        ['Supplied excerpt → visible', 'Internal source → withheld'],
      ],
      [
        'A person approves what customers will see.',
        'Approval copies the tested configuration and permitted sources. Activation makes that snapshot available to the customer runtime.',
        'Review record',
        ['Human review → approved', 'Source v2 → frozen snapshot'],
      ],
      [
        'The late edit cannot change what went live.',
        'Writes are revision-checked and idempotent. A new write carrying a stale revision returns HTTP 409.',
        'Write result',
        ['Stale revision → 409', 'Approved snapshot retained'],
      ],
    ],
  },
  {
    id: 'active-companion',
    kind: 'Live references',
    plate: '02',
    desc: 'It follows a transcript and brings up the right reference card at the right moment. Every card names its source.',
    stack: 'Python',
    proof: '18 tests in CI · public MIT source',
    scope:
      'Scripted replay of four fictional conversations. No inference, microphone or uploads. Unevaluated on real meetings.',
    demo: 'https://active-companion-replay.vercel.app',
    source: 'https://github.com/pappdavid/active-companion',
    beats: [
      [
        'A question and its reply arrive in order.',
        'Each fictional transcript entry carries its speaker, start time, end time and words.',
        'Transcript · technical discussion',
        replay.utterances
          .slice(0, 2)
          .map(
            (u) => u.start + '–' + u.end + ' s / ' + u.speaker + ' · ' + u.text,
          ),
      ],
      [
        'Only the last 30 seconds stay in view.',
        'The window removes utterances whose end time is earlier than the latest end time minus 30 seconds.',
        'Context at 49s',
        [
          'Expired ends · 10.5 s / 14.5 s',
          'Retained ends · 31.0 s / 35.0 s / 49.0 s',
        ],
      ],
      [
        'Someone asks who can help.',
        'The heuristic classifier weights recent keyword matches and emits contact_lookup.',
        'Intent · contact_lookup',
        ['“' + replay.card.trigger_excerpt + '”'],
      ],
      [
        'A card names the people and the source.',
        "TF-IDF ranks chunks against the whole window. The card selects snippets from those hits and cites “Who's who”.",
        "Source / Who's who",
        replay.card.bullets.map((b) => b.text),
      ],
      [
        'An optional answer needs a source for each bullet.',
        'The local check keeps bullets citing retrieved titles. If none survive, the retrieval card remains. The hosted replay never calls the model.',
        'Citation check',
        ['[Known source] → keep', 'Another source → drop'],
      ],
    ],
  },
  {
    id: 'faultline',
    kind: 'Safe retries',
    plate: '03',
    desc: 'It shows why “just try again” can book the same job twice, and the fix that prevents it.',
    stack: 'JavaScript · in-memory engine',
    proof: '12 tests in CI · public MIT source',
    scope:
      'Browser teaching model. Atomic effect-and-receipt storage is assumed. This drawing runs the demo’s own engine.',
    demo: 'https://davidpapp.dev/faultline/index.html',
    source: 'https://github.com/pappdavid/faultline',
    beats: [
      [
        'One booking and its receipt are saved together.',
        'On the first POST, the fixed receiver commits VIS-742 and its keyed receipt atomically in this model.',
        BOOKING.operation + ' / ' + BOOKING.service,
        traces[0],
      ],
      [
        'The booking exists, but the reply never arrives.',
        'The response is lost after commit. The client times out with no confirmed visit ID.',
        BOOKING.operation + ' / response path',
        traces[1],
      ],
      [
        'Trying again books the same job twice.',
        'In a separate baseline run, the same key creates VIS-743 and the retry returns 201.',
        records[2].visits.length + ' visits / ' + BOOKING.operation,
        traces[2],
      ],
      [
        'The same retry now returns the original booking.',
        'The fixed receiver matches the operation key and payload fingerprint. It returns VIS-742 with 200 and makes no new visit.',
        records[3].visits.length + ' visit / ' + BOOKING.operation,
        traces[3],
      ],
      [
        'Changing the booking under the same key is refused.',
        'The incoming fingerprint differs from the saved receipt. The receiver returns 409 and preserves VIS-742.',
        (records[4].assertions.uniqueness
          ? 'Unique visit'
          : 'Duplicate visit') +
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
// Index into the immutable real trace at the event reached by scroll.
export function bookingPrefix(beat, progress) {
  const f = smooth((progress - 0.02) / 0.45);
  switch (beat) {
    case 0:
      return 0;
    case 1:
      return f < 0.46 ? 1 : 2;
    case 2:
      return f < 0.43 ? 2 : 3;
    case 5:
      return f < 0.5 ? 7 : 8;
    default:
      return f < 0.5 ? 4 : f < 0.84 ? 5 : 6;
  }
}
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
