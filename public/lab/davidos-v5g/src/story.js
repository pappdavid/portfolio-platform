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
let sourceReplay;
export function prepareReplay() {
  if (runs.length) return;
  sourceReplay = replaySource();
  const first = sendFirst(createRun());
  const duplicate = retry(first);
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

export const technical = [
  [
    6,
    10.5,
    "engineer",
    "How does your API integration work? Do you support webhooks?",
  ],
  [10.7, 14.5, "se", "REST over HTTPS with OAuth2, webhooks signed with HMAC."],
  [27, 31, "engineer", "What's the latency and throughput spec under load?"],
  [
    31.2,
    35,
    "se",
    "p50 is 120 milliseconds, sustained five thousand events per second.",
  ],
  [
    44,
    49,
    "engineer",
    "Who is from your team should review our security questionnaire? Who is the technical contact?",
  ],
];
export const source = "Who's who";
export const cardText =
  "Marcus Chen — Solutions Engineer, our side (technical deep-dives)";
export const acts = [
  {
    id: "client-studio",
    plate: "B",
    device: "Source press",
    object: "Excerpt",
    description:
      "A company assistant that answers only from the text you give it, shows the exact sentence it used, and goes live only after a person approves it.",
    stack: "TypeScript, Next.js, React, Supabase (PostgreSQL)",
    proof: "65 unit tests",
    scope:
      "Hosted demo with fictional examples. Lexical retrieval, model calls off. Private source.",
    demo: "https://client-studio-psi.vercel.app",
    stations: [
      "Question feed",
      "Source bed",
      "Audience gate",
      "Snapshot press",
      "Revision stop",
    ],
    beats: [
      [
        "A customer asks a question.",
        "The fictional request enters the versioned source lookup.",
      ],
      [
        "The answer comes straight from the text.",
        "Lexical retrieval quotes the exact excerpt from source version 2.",
      ],
      [
        "Internal text stays internal.",
        "The server filters sources by audience before returning the customer view.",
      ],
      [
        "A person approves what goes live.",
        "Approval and activation freeze the configuration and sources in an immutable snapshot.",
      ],
      [
        "A late edit is refused.",
        "Writes are idempotent and revision-checked. A stale revision returns 409.",
      ],
    ],
  },
  {
    id: "active-companion",
    plate: "C",
    device: "Context reel",
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
      "Transcript feed",
      "Context window",
      "Intent reader",
      "Reference card",
      "Citation gate",
    ],
    beats: [
      [
        "The conversation rolls in.",
        "Timestamped utterances enter in order from the fictional technical_discussion scenario.",
      ],
      [
        "Only the last 30 seconds stay in view.",
        "A 30-second sliding context window drops older transcript lines.",
      ],
      [
        "Someone asks who can help.",
        "Heuristic intent classification identifies a contact lookup.",
      ],
      [
        "A card names the right person.",
        "TF-IDF retrieval surfaces a reference card carrying its source title.",
      ],
      [
        "An answer needs a source.",
        "Only bullets citing a retrieved source title survive. Retrieval cards remain if the optional model step fails.",
      ],
    ],
  },
  {
    id: "faultline",
    plate: "D",
    device: "Receipt loop",
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
      "Receiver commit",
      "Broken return",
      "Duplicate visit",
      "Stored receipt",
      "Conflict stop",
    ],
    beats: [
      [
        "The receiver books the job.",
        "The receiver commits the visit and generates its confirmation before the reply travels back.",
      ],
      [
        "The confirmation gets lost.",
        "The reply drops after commit. The sender cannot tell whether the visit exists.",
      ],
      [
        "Trying again books it twice.",
        "The plain receiver commits a second visit for the same operation.",
      ],
      [
        "A saved receipt prevents a duplicate.",
        "The fixed receiver stores the operation key and payload fingerprint, then replays the original receipt.",
      ],
      [
        "A changed booking is rejected.",
        "The same key with a different payload returns 409 without creating another visit.",
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
export function frame(u) {
  if (u < 1.11) return { kind: "opening" };
  if (u >= 22.17) return { kind: u >= 24 ? "index" : "closing" };
  let a = u < 7.77 ? 0 : u < 14.77 ? 1 : 2;
  const t = u - starts[a];
  return { kind: "act", a, b: clamp(Math.floor(t + 0.5), 0, 5), t };
}
export function evidence(a, b, progress = 1) {
  if (a === 0) {
    const { question, excerpt } = sourceReplay;
    return [
      [],
      [["Question", question]],
      [["Source v" + sourceReplay.source.version, "“" + excerpt + "”"]],
      [
        ["Customer", "“" + excerpt + "”"],
        ["Internal", sourceReplay.held ? "Withheld" : "Visible"],
      ],
      [
        ["Review", "Approved by a person"],
        ["Snapshot", "Sources + configuration frozen"],
      ],
      [
        ["Stale write", sourceReplay.late.status + " · Revision conflict"],
        ["Snapshot", "Preserved"],
      ],
    ][b];
  }
  if (a === 1) {
    if (b === 1 || b === 2) {
      const time = b === 1 ? 6 + 8.5 * progress : 14.5 + 29.5 * progress;
      return technical
        .filter((row) => row[0] <= time && row[1] >= time - 30)
        .slice(-2)
        .map((row) => [row[0] + "s · " + row[2], row[3]]);
    }
    if (b === 3)
      return [
        ["Engineer · 44s", technical[4][3]],
        ["Intent", "contact_lookup"],
      ];
    if (b === 4) return [[source, cardText]];
    const retrieved = new Set([source]);
    const bullets = [
      { text: cardText, title: source },
      { text: "Uncited bullet", title: null },
    ];
    return bullets.map((bullet) =>
      retrieved.has(bullet.title)
        ? ["Retained · " + bullet.title, bullet.text]
        : [bullet.text, "Dropped"],
    );
  }
  const r = runs[b - 1];
  const trace = b === 1 ? r.trace.slice(0, 2) : r.trace.slice(-2);
  return trace.map((e) => [
    String(e.sequence).padStart(2, "0") + " / " + e.kind,
    e.title,
  ]);
}
