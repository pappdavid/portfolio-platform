import {
  BOOKING,
  createRun,
  sendFirst,
  retry,
  replayFixed,
  probeConflict,
  receipt,
  assertions,
} from "./engine.mjs";

import { replaySource } from "./source-replay.js";
export const runs = [];
export let sourceReplay;
export function prepareReplay() {
  if (runs.length) return;
  sourceReplay = replaySource();
  const first = sendFirst(createRun({ adapter: "fixed" }));
  const duplicate = retry(sendFirst(createRun()));
  const fixed = replayFixed(duplicate);
  const conflict = probeConflict(fixed);
  runs.push(...[first, first, duplicate, fixed, conflict].map(receipt));
  if (
    assertions(duplicate).uniqueness ||
    !assertions(fixed).uniqueness ||
    !conflict.conflict
  )
    throw Error("Unexpected receiver state");
}
export const booking = BOOKING;
export const linkedin = "https://www.linkedin.com/in/d%C3%A1vid-papp";
export const github = "https://github.com/pappdavid";

export const acts = [
  {
    id: "client-studio",
    plate: "B",
    device: "Studio workspace",
    object: "Excerpt",
    description:
      "A company assistant that answers only from the text you give it, shows the exact sentence it used, and goes live only after a person approves it.",
    stack: "TypeScript, Next.js, React, Supabase (PostgreSQL)",
    proof: "65 unit tests",
    scope:
      "Hosted demo with fictional examples. Lexical retrieval, model calls off. Private source.",
    demo: "https://client-studio-psi.vercel.app",
    stations: [
      "Anonymous session",
      "Lexical retrieval",
      "Audience filter",
      "Activation",
      "Revision check",
    ],
    beats: [
      [
        "A question arrives in the Studio.",
        "The server uses the anonymous session to find the workspace for this question.",
      ],
      [
        "The answer quotes the limit in the source.",
        "Lexical retrieval selects the permitted source in version 2. The answer repeats its exact excerpt.",
      ],
      [
        "Internal text stays out of the customer answer.",
        "The server filters by audience before lexical retrieval sees the source text.",
      ],
      [
        "A person approves what customers can use.",
        "Approval captures the tested configuration and permitted sources. Activation copies that revision into the runtime snapshot.",
      ],
      [
        "A late edit cannot overwrite the approved version.",
        "Writes are idempotent and revision-checked. A new write based on a stale revision returns 409.",
      ],
    ],
  },
  {
    id: "active-companion",
    plate: "C",
    device: "Transcript and evidence",
    object: "Transcript",
    description:
      "It follows a conversation transcript and puts the right reference card in front of you at the right moment, and every card names its source.",
    stack: "Python",
    proof: "18 tests in CI · Public MIT source",
    scope:
      "Hosted replay of pipeline output for four fictional conversations. No inference, microphone or uploads. No evaluation on real meetings.",
    demo: "https://active-companion-replay.vercel.app",
    repo: github + "/active-companion",
    stations: [
      "Transcript",
      "SlidingWindow",
      "IntentClassifier",
      "TF-IDF retrieval",
      "Citation check",
    ],
    beats: [
      [
        "Each speaker’s words arrive with a time.",
        "The fictional transcript supplies the speaker, text, start and end of each utterance.",
      ],
      [
        "The two oldest lines leave the working conversation.",
        "SlidingWindow keeps utterances whose end time falls on or after the 30-second cutoff.",
      ],
      [
        "Someone asks who should handle a security review.",
        "The heuristic classifier weights recent keyword matches and returns contact_lookup.",
      ],
      [
        "A reference card names two people and shows where both names came from.",
        "TF-IDF ranks the chunks. The card selects two matching snippets from “Who's who” and cites that title on each bullet.",
      ],
      [
        "An uncited bullet is dropped. The reference card stays.",
        "Only bullets citing a retrieved title can replace retrieval bullets. This local parser test shows a missing citation.",
      ],
    ],
  },
  {
    id: "faultline",
    plate: "D",
    device: "Booking receiver",
    object: "Booking",
    description:
      "It shows why “just try again” can book the same job twice, and the fix that prevents it.",
    stack: "JavaScript · In-memory engine",
    proof:
      "12 tests in CI · Public MIT source. This animation runs the demo’s engine.",
    scope:
      "Browser teaching model. Atomic effect-and-receipt storage is a model assumption. No deployed service.",
    demo: "https://davidpapp.dev/faultline/index.html",
    repo: github + "/faultline",
    stations: [
      "Atomic commit",
      "Response lost",
      "Baseline retry",
      "Fixed replay",
      "Conflict",
    ],
    beats: [
      [
        "The receiver books the job and saves its receipt.",
        "The fixed receiver commits VIS-742 and its keyed payload fingerprint together in the engine’s atomic storage model.",
      ],
      [
        "The confirmation is lost on the way back.",
        "The reply drops after commit. The client times out with no observed visit ID.",
      ],
      [
        "Trying again books the same job twice.",
        "In the separate baseline run, the same operation commits VIS-743 after VIS-742.",
      ],
      [
        "The same retry returns the original booking.",
        "The fixed receiver matches the key and payload fingerprint and returns VIS-742 with 200.",
      ],
      [
        "The same key cannot book a different time.",
        "The fingerprint mismatch returns 409 and preserves the original visit.",
      ],
    ],
  },
];
export const end = 24.5;
export const starts = [2, 9, 16];
export const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const ease = (v) => {
  v = clamp(v);
  return v * v * (3 - 2 * v);
};
// Each integer shot is settled from its anchor through the next 0.45 tour units.
export const ramp = (v, a, b) => ease((v - a) / (b - a));
export const shotPhase = (t, b) => clamp((t - b + 0.55) / 0.55);
export const beatPhase = shotPhase;
export const landing = {
  commit: 0.74,
  lost: 0.77,
  duplicate: 0.58,
  lookup: 0.64,
  reply: 0.91,
  conflict: 0.89,
};
export function faultFrame(b, phase) {
  const run = runs[Math.max(0, b - 1)];
  const limits = [
    0,
    phase < landing.commit ? 1 : 2,
    phase < landing.lost ? 2 : 3,
    phase < landing.duplicate ? 4 : phase < landing.reply ? 5 : 6,
    phase < landing.lookup ? 4 : phase < landing.reply ? 5 : 6,
    phase < landing.conflict ? 7 : 8,
  ];
  const trace = run.trace.slice(0, limits[b]);
  const visits = run.visits.slice(
    0,
    trace.filter((e) => e.kind === "commit").length,
  );
  const response = trace.filter((e) => e.kind === "response").at(-1);
  return {
    run,
    trace,
    visits,
    receipts: visits.length ? Object.entries(run.receipts) : [],
    observed: response?.title.split(" · ")[1] || "null",
  };
}
