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
export function frame(u) {
  if (u < 1.2) return { kind: "opening" };
  if (u >= 21.95) return { kind: u >= 23.7 ? "index" : "closing" };
  const a = u < 8.05 ? 0 : u < 15.05 ? 1 : 2;
  const t = u - starts[a];
  return { kind: "act", a, t, b: clamp(Math.floor(t + 0.38), 0, 5) };
}
export function shotInk(u, f) {
  if (f.kind === "opening") return 1 - ramp(u, 0.25, 0.67);
  if (f.kind === "closing") return ramp(u, 21.95, 22.45);
  if (f.kind === "index") return 1;
  const t = f.t,
    start = f.b ? f.b - 0.38 : f.a ? -0.95 : -0.8;
  const end = f.b === 5 ? (f.a === 2 ? 5.95 : 6.05) : f.b + 0.62;
  return ramp(t, start, start + 0.18) * (1 - ramp(t, end - 0.165, end));
}
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

import { conversation } from "./conversation.js";
export function evidence(a, b, p = 1) {
  if (!b) return [];
  if (a === 0) {
    const s = sourceReplay;
    return [
      [
        ["Question", s.question],
        ["Session", "Cookie → Workspace"],
      ],
      [["Source v2", "“" + s.excerpt + "”"]],
      [
        ["Public · v2", "“" + s.excerpt + "”"],
        ["Internal · v2", "Withheld"],
      ],
      [
        ["Review", "Approved"],
        ["Active source", "v2 · public"],
      ],
      [
        ["Stale edit", s.late.status + " · Revision conflict"],
        ["Active source", "v2 · public"],
      ],
    ][b - 1];
  }
  if (a === 1) {
    const c = conversation,
      row = c.utterances[4];
    return [
      c.utterances
        .slice(0, p < 0.45 ? 1 : 2)
        .map((u) => [
          u.start.toFixed(1) + "–" + u.end.toFixed(1) + " s",
          u.text,
        ]),
      p < 0.5
        ? [
            ["Window", p < 0.17 ? "1.0–31.0 s" : "5.0–35.0 s"],
            [
              "Retained",
              p < 0.17
                ? "10.5 s / 14.5 s / 31.0 s"
                : "10.5 s / 14.5 s / 31.0 s / 35.0 s",
            ],
          ]
        : [
            ["Window", "19.0–49.0 s"],
            ["Released", "10.5 s · engineer / 14.5 s · se"],
            ["Retained", "31.0 s / 35.0 s / 49.0 s"],
          ],
      [
        ["Engineer", row.text],
        ["Intent", row.intent],
      ],
      [
        ["Rank 2", "notes:4 · Who's who"],
        ["Card", "Who's Who · " + c.bullets.length + " sourced bullets"],
      ],
      [
        ["Parser test", "claim without cite"],
        ["Result", "Dropped · retrieval card retained"],
      ],
    ][b - 1];
  }
  return faultFrame(b, p)
    .trace.slice(-2)
    .map((e) => [
      String(e.sequence).padStart(2, "0") + " / " + e.kind,
      e.title,
    ]);
}
