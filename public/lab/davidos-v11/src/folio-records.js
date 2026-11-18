import {
  sourceReplay as studio,
  runs,
  booking,
  faultFrame,
  prepareReplay,
} from "./story.js";
import { conversation as conversation } from "./conversation.js";
import { Print } from "./folio-text.js";
prepareReplay();
const mix = (a, b, t) => a + (b - a) * t;
export function sourceRecord(p, w, h, progress = 1) {
  const compact = w < 550,
    m = compact ? 10 : 19,
    gap = compact ? 7 : 15,
    fs = compact ? 17 : 20,
    dw = compact ? w : (w - gap) / 2;
  const rh = compact ? 73 : 108;
  let sx = 0,
    sy = 0;
  studio.sources.slice(0, 2).forEach((s, i) => {
    const x = compact ? 0 : i * (dw + gap),
      y = compact ? i * (rh + gap) : 0;
    p.rect(x, y, dw, rh, "well");
    p.line(x, y, x + dw, y, i ? "accent" : "rule", i ? 1.5 : 1);
    p.text(
      "Public source · v" + s.version,
      x + m,
      y + (compact ? 17 : 23),
      compact ? 15 : 17,
      i ? "accent" : "quiet",
    );
    const prefix = s.text.slice(0, s.text.indexOf("up to")).trimEnd(),
      tail = s.text.slice(prefix.length + 1);
    const baseline = y + (compact ? 40 : 61),
      last = baseline + fs * 1.15;
    p.text(prefix, x + m, baseline, fs, i ? "paper" : "quiet");
    p.text(tail, x + m, last, fs, i ? "paper" : "quiet");
    if (i) {
      sx = x + m;
      sy = last;
      p.line(
        sx,
        sy + 4,
        sx + studio.excerpt.length * fs * 0.6,
        sy + 4,
        "accent",
        1.2,
      );
    }
  });
  const y = compact ? 2 * (rh + gap) : rh + gap,
    b = compact ? 23 : 35,
    dest = y + 24 + b;
  p.text("Answer", m, y + 17, compact ? 15 : 17, "quiet");
  const tx = mix(sx, m, progress),
    ty = mix(sy, dest, progress),
    size = mix(fs, b, progress);
  if (progress > 0.015) {
    p.rect(
      tx - 3,
      ty - size,
      size * 0.6 * studio.excerpt.length + 8,
      size * 1.28,
      "well",
    );
    p.text(studio.excerpt, tx, ty, size, "accent", 700);
    p.line(
      tx,
      ty + 6,
      tx + studio.excerpt.length * size * 0.6,
      ty + 6,
      "accent",
      1.1,
    );
  }
  return p;
}
export function rankedRecord(p, w, h, phase = 1) {
  const compact = w < 550,
    tableW = compact ? w : w * 0.49,
    fs = compact ? 15 : 17,
    margin = compact ? 3 : 6;
  p.text("Cosine score", margin, 16, fs, "quiet");
  conversation.hits.forEach((hit, i) => {
    const y = 41 + i * (compact ? 25 : 40);
    p.rect(0, y + 7, tableW, 1, "rule");
    p.text(String(i + 1), margin, y, fs, "quiet");
    p.text(
      hit.title,
      margin + fs * 1.5,
      y,
      i === 1 ? (compact ? 17 : 19) : fs,
      i === 1 ? "accent" : "paper",
    );
    p.text(
      String(hit.score),
      tableW - (i === 1 ? (compact ? 17 : 19) : fs) * 0.6 * 6 - 3,
      y,
      i === 1 ? (compact ? 17 : 19) : fs,
      i === 1 ? "accent" : "paper",
      700,
    );
  });
  if (phase < 0.42) return p;
  const x = compact ? 0 : tableW + 36,
    y = compact ? 124 : 0,
    cw = w - x;
  p.line(x, y, x + cw, y, "accent", 1.1);
  p.text(
    conversation.utterances[4].title,
    x + margin,
    y + (compact ? 23 : 33),
    compact ? 20 : 27,
    "accent",
    700,
  );
  if (!compact)
    p.path(
      [
        [tableW - 1, 81],
        [tableW + 14, 81],
        [x - 4, 22],
        [x, 22],
      ],
      "accent",
      1.2,
    );
  else
    p.path(
      [
        [tableW - 2, 66],
        [tableW - 2, 119],
        [tableW - 13, 124],
      ],
      "accent",
      1.1,
    );
  if (phase < 0.64) return p;
  let top = y + (compact ? 48 : 67);
  for (const row of conversation.bullets) {
    const n = p.text(
      row.text,
      x + margin,
      top,
      compact ? 15 : 17,
      "paper",
      400,
      cw - margin * 2,
      1.19,
    );
    top += n;
    p.text("↗ " + row.title, x + margin, top, fs, "quiet");
    top += compact ? 20 : 30;
  }
  return p;
}
export const names = ["client-studio", "active-companion", "faultline"];
export const short = [
  "A company assistant that quotes your text.",
  "Source cards for a conversation transcript.",
  "How a retry can book a job twice.",
];
export const sentences = [
  "The assistant quotes the text you supply and goes live after approval.",
  "It finds reference cards for a conversation transcript and cites their sources.",
  "It shows how a retry can book one job twice and how a saved receipt prevents it.",
];
export const legends = [
  "Studio page · Sources · Server · Customer page",
  "Transcript · Window · Knowledge · Card",
  "Client · Request/reply · Receiver · Visits/Receipts",
];
export const disclosures = [
  "Fictional example · Northstar Components API",
  "Fictional transcript · Scripted replay",
  "Fictional booking · Browser teaching model",
];
export const captions = [
  [
    [
      "A question arrives about the batch limit.",
      "The server resolves the anonymous session to its workspace.",
    ],
    [
      "The answer quotes the limit in version 2.",
      "Lexical retrieval selects the permitted source and returns its exact words.",
    ],
    [
      "Internal text stays out of the customer view.",
      "The server filters sources by audience before retrieval.",
    ],
    [
      "A person approves what goes live.",
      "Activation freezes the approved configuration and sources in a snapshot.",
    ],
    [
      "The late edit cannot overwrite the approved version.",
      "A new write with a stale revision returns 409. Repeated successful operations reuse their result.",
    ],
  ],
  [
    [
      "Each speaker’s words arrive with a time.",
      "The replay places each utterance at its recorded start and end.",
    ],
    [
      "The two oldest lines leave the working conversation.",
      "At 49.0 seconds the window keeps arrived utterances ending at or after 19.0 seconds.",
    ],
    [
      "The assistant notices a request for a technical contact.",
      "A keyword-based classifier assigns the contact_lookup intent.",
    ],
    [
      "The card names two contacts and cites its source.",
      "TF-IDF ranks three chunks. The second-ranked chunk supplies both cited snippets.",
    ],
    [
      "An uncited bullet is dropped. The reference card stays.",
      "This local parser example requires a retrieved source title. The hosted replay uses saved output.",
    ],
  ],
  [
    [
      "The receiver books the job and saves its receipt.",
      "The engine models the visit and its keyed receipt as one atomic write.",
    ],
    [
      "The confirmation is lost on the way back.",
      "The client times out after the receiver has already committed the visit.",
    ],
    [
      "Trying again books the same job twice.",
      "The baseline receiver executes the repeated operation and records a second visit.",
    ],
    [
      "The same retry returns the original booking.",
      "A matching key and payload fingerprint retrieve the saved receipt.",
    ],
    [
      "The same key cannot book a different time.",
      "The changed payload returns 409 and preserves the original visit.",
    ],
  ],
];
export const results = [
  studio.excerpt,
  "19.0–49.0 s",
  booking.operation + " → " + runs[3].observedId,
];
export const resultDetails = [
  "Public source · v2",
  "Retained ends · 31.0 / 35.0 / 49.0 s",
  "Saved receipt · 200 · 1 visit",
];
export function ownership(u) {
  if (u < 0.045) return { index: -1, beat: 0, id: "opening" };
  if (u >= 23) return { index: 3, beat: 0, id: "index" };
  const index = u < 8.05 ? 0 : u < 15.05 ? 1 : 2,
    t = u - [2, 9, 16][index];
  const beat = Math.max(0, Math.min(5, Math.ceil(t - 0.45 - 1e-8)));
  return { index, beat, id: names[index] + (beat ? "-" + beat : "") };
}
export const partLabels = [
  [
    ["Studio page", "Sources", "Customer page"],
    ["Studio page", "Server", "Customer page"],
    ["Studio page", "Sources", "Answer"],
    ["Sources", "Audience filter", "Customer page"],
    ["Review", "Frozen snapshot", "Runtime"],
    ["Late edit", "Revision check", "Snapshot"],
  ],
  [
    ["Archive", "Knowledge", "Card"],
    ["Utterances", "Seconds"],
    ["Archive", "30 s", "Working window"],
    ["Engineer", "Classifier", "Intent"],
    ["Knowledge", "Retrieval", "Card"],
    ["Claim", "Citation check", "Card"],
  ],
  [
    ["Client", "Request / reply", "Receiver"],
    ["Client", "POST /visits", "Fixed receiver"],
    ["Client", "Reply", "Receiver"],
    ["Client", "Retry", "Baseline receiver"],
    ["Client", "Retry", "Fixed receiver"],
    ["Client", "Payload", "Fixed receiver"],
  ],
];
export function chartKey(i, b, w, phone) {
  const p = new Print(),
    list = partLabels[i][b],
    fs = phone ? 15 : 17;
  const widths = list.map((txt) => fs * 0.6 * txt.length);
  const gap = (w - widths.reduce((sum, v) => sum + v, 0)) / (list.length - 1);
  let x = 0;
  list.forEach((txt, j) => {
    p.line(x, 2, x + 12, 2, j === 1 ? "accent" : "rule", 1);
    p.text(txt, x, fs + 7, fs, j === 1 ? "accent" : "quiet");
    x += widths[j] + gap;
  });
  return p;
}
function statement(p, w, h, label, value, support, phone) {
  const size = phone ? 24 : Math.min(43, Math.max(27, w / 20));
  p.text(label, 0, phone ? 17 : 20, phone ? 15 : 17, "quiet");
  const y = phone ? 54 : 77,
    used = p.text(value, 0, y, size, "accent", 700, w, 1.18);
  if (support)
    p.text(support, 0, y + used + 12, phone ? 15 : 19, "paper", 400, w);
}
function twoColumns(p, w, phone, entries) {
  const gap = phone ? 12 : 36,
    cw = (w - gap) / 2;
  entries.forEach(([label, value], i) => {
    const x = i * (cw + gap);
    p.line(x, 0, x + cw, 0, i ? "accent" : "rule");
    p.text(label, x, phone ? 23 : 30, phone ? 15 : 17, "quiet");
    p.text(
      value,
      x,
      phone ? 55 : 76,
      phone ? 20 : 35,
      i ? "accent" : "paper",
      700,
      cw,
    );
  });
}
export function record(index, beat, w, h, phase = 1) {
  const p = new Print(),
    phone = w < 550,
    fs = phone ? 15 : 17;
  if (beat === 0) {
    p.line(0, 0, w, 0, "rule");
    p.text(
      legends[index],
      0,
      phone ? 26 : 40,
      phone ? 15 : 21,
      "paper",
      400,
      w,
    );
    p.text(disclosures[index], 0, phone ? 76 : 93, fs, "quiet", 400, w);
    return p;
  }
  if (index === 0) {
    if (beat === 1)
      statement(
        p,
        w,
        h,
        "Studio page · Question",
        studio.question,
        "Cookie → Workspace",
        phone,
      );
    if (beat === 2) sourceRecord(p, w, h, phase);
    if (beat === 3) {
      twoColumns(p, w, phone, [
        ["Public · v2", "Customer page"],
        ["Internal · v2", "Withheld"],
      ]);
      p.text(
        studio.excerpt,
        0,
        phone ? 136 : 145,
        phone ? 17 : 24,
        "accent",
        700,
        w,
      );
    }
    if (beat === 4) {
      twoColumns(p, w, phone, [
        ["Review", phase < 0.35 ? "Review" : "Approved"],
        ["Activation", phase < 0.74 ? "Activate" : "Active"],
      ]);
      p.text(
        "Frozen snapshot · v2 public",
        0,
        phone ? 117 : 146,
        phone ? 17 : 23,
        phase < 0.74 ? "quiet" : "accent",
        700,
        w,
      );
    }
    if (beat === 5) {
      twoColumns(p, w, phone, [
        ["Expected revision", String(studio.expected)],
        ["Current revision", String(studio.current)],
      ]);
      p.text(
        phase < 0.64
          ? "Late edit"
          : studio.late.status + " · Revision conflict",
        0,
        phone ? 121 : 151,
        phone ? 20 : 30,
        "accent",
        700,
        w,
      );
      p.text(
        "Frozen snapshot · " + studio.excerpt,
        0,
        phone ? 159 : 190,
        fs,
        "quiet",
        400,
        w,
      );
    }
  } else if (index === 1) {
    if (beat === 1) {
      let y = fs;
      conversation.utterances.slice(0, phase < 0.43 ? 1 : 2).forEach((u, i) => {
        p.text(
          u.start.toFixed(1) + "–" + u.end.toFixed(1) + " s  /  " + u.speaker,
          0,
          y,
          fs,
          i ? "quiet" : "accent",
        );
        y += phone ? 24 : 35;
        y +=
          p.text(
            u.text,
            0,
            y,
            phone ? 17 : 22,
            i ? "paper" : "accent",
            400,
            w,
            1.25,
          ) + (phone ? 13 : 20);
      });
    }
    if (beat === 2) {
      const now = 35 + 14 * Math.max(0, Math.min(1, (phase - 0.15) / 0.8)),
        cut = now - 30;
      const ends = conversation.utterances.filter((u) => u.end <= now);
      statement(
        p,
        w,
        h,
        "Working window",
        cut.toFixed(1) + "–" + now.toFixed(1) + " s",
        "Retained · " +
          ends
            .filter((u) => u.end >= cut)
            .map((u) => u.end.toFixed(1))
            .join(" / ") +
          " s",
        phone,
      );
      p.text(
        "Released · " +
          (ends
            .filter((u) => u.end < cut)
            .map((u) => u.end.toFixed(1))
            .join(" / ") || "—"),
        0,
        phone ? 145 : 177,
        fs,
        "quiet",
        400,
        w,
      );
    }
    if (beat === 3)
      statement(
        p,
        w,
        h,
        "Engineer · 44.0–49.0 s",
        conversation.utterances[4].text.split("? ")[1],
        phase > 0.45 ? conversation.utterances[4].intent : "Intent",
        phone,
      );
    if (beat === 4) rankedRecord(p, w, h, phase);
    if (beat === 5) {
      p.text("Local citation check", 0, 16, fs, "quiet");
      p.text(
        phase > 0.54 ? "Dropped · claim without cite" : "claim without cite",
        0,
        phone ? 48 : 65,
        phone ? 18 : 28,
        "accent",
        700,
        w,
      );
      let y = phone ? 91 : 119;
      p.text("Who's Who", 0, y, phone ? 19 : 25, "paper", 700);
      y += phone ? 27 : 38;
      for (const row of conversation.bullets) {
        y += p.text(row.text, 0, y, fs, "paper", 400, w, 1.22);
        p.text("↗ " + row.title, 0, y, fs, "quiet");
        y += phone ? 24 : 28;
      }
    }
  } else {
    const f = faultFrame(beat, phase),
      title = f.trace.at(-1)?.title || "POST /visits";
    if (beat === 1 || beat === 3 || beat === 4) {
      const labels = phone
        ? ["Visit", "Operation"]
        : ["Visit", "Operation", "Service", "Slot"];
      const cols = phone ? [0, 0.5] : [0, 0.21, 0.43, 0.73];
      p.text(
        beat === 3 ? "Visits · baseline receiver" : "Visits · fixed receiver",
        0,
        fs,
        fs,
        "quiet",
      );
      labels.forEach((label, i) =>
        p.text(label, cols[i] * w, phone ? 42 : 55, fs, "quiet"),
      );
      f.visits.forEach((v, j) => {
        const y = (phone ? 71 : 98) + j * (phone ? 30 : 41);
        p.line(0, y + 7, w, y + 7, "rule");
        [v.id, v.operation, v.service, v.slot]
          .slice(0, cols.length)
          .forEach((value, i) =>
            p.text(
              value,
              cols[i] * w,
              y,
              phone ? 18 : i < 2 ? 25 : 18,
              i === 0 && j === f.visits.length - 1 ? "accent" : "paper",
              i === 0 ? 700 : 400,
            ),
          );
      });
      if (beat !== 3 && f.receipts.length)
        p.text(
          "Receipt  " + f.receipts[0][0] + " → " + f.receipts[0][1].id,
          0,
          phone ? 116 : 159,
          phone ? 17 : 21,
          "accent",
          700,
          w,
        );
    } else if (beat === 2)
      statement(
        p,
        w,
        h,
        "Client · Observed visit",
        phase < 0.77 ? "Awaiting reply" : "null",
        "Committed · " + (f.visits[0]?.id || "—"),
        phone,
      );
    else {
      twoColumns(p, w, phone, [
        ["Stored slot", booking.slot],
        ["Incoming slot", "11:00–11:30"],
      ]);
      p.text(
        phase >= 0.89 ? "409 · Changed payload" : "Compare fingerprints",
        0,
        phone ? 103 : 133,
        phone ? 20 : 28,
        "accent",
        700,
        w,
      );
      p.text(
        "VIS-742 · " + booking.operation,
        0,
        phone ? 135 : 166,
        fs,
        "quiet",
      );
    }
    const traceY = phone ? Math.min(h - 31, 185) : Math.min(h - 22, 223);
    p.line(0, traceY - 20, w, traceY - 20, "rule");
    p.text(title, 0, traceY, fs, beat === 2 ? "accent" : "quiet", 400, w);
  }
  return p;
}
