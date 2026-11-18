import { Drawing } from "./drawing.js";
import { makeAtlas, heading, field, table, step } from "./atlas.js";
import { conversation as c } from "./conversation.js";
import { beatPhase, clamp } from "./story.js";

const speech = c.utterances;
const parserTest = { text: "claim without cite" };
const cited = [parserTest].filter(
  (b) =>
    b.text.trim() &&
    typeof b.cite === "string" &&
    c.hits.some((hit) => hit.title === b.cite.trim().replace(/^\[|\]$/g, "")),
);
if (cited.length) throw Error("Invalid citation fixture");
const files = [...new Set(c.chunks.map((r) => r.id.split(":")[0]))];
const xTime = (s) => -7.55 + s * 0.191;
export function companion(m) {
  const a = makeAtlas(m),
    panel = a.surface;
  const timeline = panel("Transcript", xTime(30), 1.05, 1.45, 11.9, 1.68, {
    rx: -0.35,
    depth: 0.1,
    css: "axis",
    draw(g, w, h) {
      for (let s = 0; s <= 60; s++) {
        const x = (s - 30) * 0.191;
        g.line(
          [x, -0.67, 0.008],
          [x, -0.67 + (s % 5 === 0 ? 0.16 : 0.065), 0.008],
          s % 5 === 0 ? -0.75 : -0.38,
        );
      }
      for (const u of speech) {
        const l = (u.start - 30) * 0.191,
          r = (u.end - 30) * 0.191,
          y = u.speaker === "engineer" ? 0.16 : -0.24;

        g.path(
          [
            [l, y, 0.01],
            [r, y, 0.01],
            [r, y + 0.2, 0.01],
            [l, y + 0.2, 0.01],
          ],
          -0.7,
          true,
        );
        for (const [i, word] of u.text.split(" ").entries()) {
          const parts = u.text.split(" ");
          const start = parts.slice(0, i).join(" ").length / u.text.length;
          g.line(
            [l + (r - l) * start, y + 0.08, 0.012],
            [
              l + (r - l) * (start + word.length / u.text.length),
              y + 0.08,
              0.012,
            ],
            0.84,
          );
        }
      }
    },
  });
  const speechBars = speech.map((u) => {
    const g = new Drawing(),
      l = (u.start - 30) * 0.191,
      r = (u.end - 30) * 0.191,
      y = u.speaker === "engineer" ? 0.16 : -0.24;
    g.quad(
      [l, y, 0.014],
      [r, y, 0.014],
      [r, y + 0.2, 0.014],
      [l, y + 0.2, 0.014],
      0.54,
    );
    const o = g.build(m);
    timeline.obj.add(o);
    return o;
  });
  const window = a.surface(
    "SlidingWindow",
    xTime(20),
    0.09,
    2.15,
    30 * 0.191,
    0.67,
    { rx: -0.12, ink: 0.95, fill: 0.032, css: "window" },
  );
  const intervals = speech.map((u) =>
    panel(
      u.speaker,
      xTime((u.start + u.end) / 2),
      0.23,
      2.22,
      (u.end - u.start) * 0.191,
      0.22,
      { ink: 0.96, fill: 0.28, depth: 0.08 },
    ),
  );
  const classifier = panel("IntentClassifier", 2.35, 1.28, 0.9, 2.68, 1.75, {
    rx: -0.17,
    ry: -0.12,
  });
  const fileFaces = files.map((f, i) => {
    const rows = c.chunks.filter((r) => r.id.startsWith(f + ":"));
    const baseX = -5.55 + i * 1.55;
    return rows.map((chunk, j) =>
      panel(
        chunk.id,
        baseX + (j - (rows.length - 1) / 2) * 0.21,
        2.59 + j * 0.24,
        -1.75 + j * 0.19,
        1.63,
        1.64,
        { rx: -0.48, rz: (j - 2) * 0.05, depth: 0.038, css: "chunk" },
      ),
    );
  });
  const index = panel("TF-IDF retrieval", 0.38, 3.28, -1.6, 5.6, 2.23, {
    rx: -0.43,
    depth: 0.12,
    css: "index-matrix",
    draw(g, w, h) {
      const left = -w * 0.47,
        top = h * 0.19,
        dx = (w * 0.94) / c.vocab.length,
        dy = (h * 0.48) / c.chunks.length;
      for (let i = 0; i <= c.vocab.length; i++) {
        const x = left + i * dx;
        g.line([x, top, 0.009], [x, top - c.chunks.length * dy, 0.009], -0.16);
      }
      for (let j = 0; j <= c.chunks.length; j++) {
        const y = top - j * dy;
        g.line([left, y, 0.009], [-left, y, 0.009], -0.41);
      }
      c.chunks.forEach((chunk, j) =>
        chunk.terms.forEach((i) => {
          const x = left + i * dx,
            y = top - j * dy,
            d = 0.011;
          g.quad(
            [x, y, d],
            [x + dx, y, d],
            [x + dx, y - dy, d],
            [x, y - dy, d],
            -0.65,
          );
        }),
      );
    },
  });
  const matches = new Drawing();
  const dx = (index.w * 0.94) / c.vocab.length,
    dy = (index.h * 0.48) / c.chunks.length;
  c.chunks.forEach((chunk, j) =>
    chunk.terms
      .filter((i) => c.query.includes(i))
      .forEach((i) => {
        const x = -index.w * 0.47 + i * dx,
          y = index.h * 0.19 - j * dy,
          z = 0.017;
        matches.quad(
          [x, y, z],
          [x + dx, y, z],
          [x + dx, y - dy, z],
          [x, y - dy, z],
          1,
        );
      }),
  );
  const queryCells = matches.build(m);
  index.obj.add(queryCells);
  const card = panel("Evidence card", 5.53, 2.92, -0.0, 3.6, 3.6, {
    ry: -0.18,
    depth: 0.12,
    css: "article",
  });
  const list = panel("Card list", 5.65, 0.22, 0.82, 3.47, 1.73, {
    rx: -0.37,
    css: "card-list",
  });
  const lab = panel("Optional model", 3.69, 5.1, -2.13, 3.1, 1.13, {
    rx: -0.12,
    ink: -0.38,
  });
  const expiredFaces = speech
    .slice(0, 2)
    .map((u) =>
      panel("Expired utterance", 0, 0, 0, 4.22, 0.81, {
        ink: 0.78,
        depth: 0.055,
        css: "expired",
      }),
    );
  const sample = panel("Utterance", -3.25, 1.86, 2.6, 5.2, 1.66, {
    ink: 0.92,
    css: "spoken",
  });
  const rank = panel("Ranked matches", 0.7, 2.09, -0.65, 4.8, 1.33, {
    rx: -0.24,
    css: "ranks",
  });
  const citedChunk = panel("Retrieved evidence", 0, 0, 0, 2.57, 0.72, {
    css: "token",
    ink: 0.94,
  });
  const connections = [
    [
      [1.92, 1.05, 1.45],
      [2.35, 1.05, 1.45],
      [2.35, 1.28, 0.9],
    ],
    [
      [1.4, 0.2, 2.15],
      [1.4, 0.2, -1.6],
      [1.4, 3.28, -1.6],
    ],
    [
      [-2.7, 2.78, -1.8],
      [-2.6, 3.28, -1.6],
    ],
    [
      [3.18, 3.28, -1.6],
      [4.0, 3.28, -1.6],
      [4.0, 2.45, 0],
    ],
    [
      [3.63, 1.28, 0.9],
      [4.15, 1.28, 0.9],
      [4.15, 2.45, 0],
    ],
    [
      [5.21, 2.45, 0],
      [5.4, 1.05, 0.88],
    ],
    [
      [5.21, 3.9, 0],
      [5.21, 5.1, -2.1],
    ],
  ];
  connections.forEach((l, i) => a.path(l, i === 6 ? -0.22 : -0.6));
  function update(t) {
    const b = clamp(Math.floor(t + 0.5), 0, 5),
      p = beatPhase(t, b),
      level = (...beats) => (!b || beats.includes(b) ? 1 : 0.27);
    const now =
      b === 0
        ? 49
        : b === 1
          ? p < 0.45
            ? 10.5
            : 14.5
          : b === 2
            ? p < 0.17
              ? 31
              : p < 0.5
                ? 35
                : 49
            : 49;
    speechBars.forEach((bar, i) => (bar.visible = !b || speech[i].end <= now));
    queryCells.visible = !b || b >= 4;
    const horizon = now - 30,
      shift = b === 2 ? step(p, 0.48, 0.88) : 1;
    timeline.set(
      heading("Transcript", "technical_discussion") +
        '<div class="time-labels">' +
        [0, 10, 20, 30, 40, 50, 60]
          .map((n) => "<span>" + n + " s</span>")
          .join("") +
        "</div>",
      level(1, 2),
    );
    window.obj.position.x = xTime(
      b === 2 && now === 49 ? 5 + 14 * shift + 15 : horizon + 15,
    );
    window.set(
      "<b>SlidingWindow</b><span>" +
        Math.max(0, horizon).toFixed(1) +
        " – " +
        now.toFixed(1) +
        " s</span>",
      level(1, 2),
    );
    intervals.forEach((r, i) => {
      const u = speech[i];
      const expired = u.end < horizon;
      r.obj.position.y = 0.27 - (expired ? shift * 1.1 : 0);
      r.set("", 1, u.end <= now && (!expired || b === 2));
    });
    const row =
      b === 1
        ? p < 0.45
          ? speech[0]
          : speech[1]
        : b === 2
          ? now === 49
            ? speech[4]
            : now === 35
              ? speech[3]
              : speech[2]
          : speech[4];
    let words = row.text;
    if (b === 3)
      words = words.replace(
        /Who is|from your team/g,
        (v) => "<mark>" + v + "</mark>",
      );
    sample.obj.position.set(
      b === 3 ? -0.05 : -3.05,
      b === 2 ? -1.16 : b === 3 ? 2.98 : 1.9,
      b === 2 ? 2.49 : 2.15,
    );
    const drop = b === 2 && now === 49;
    expiredFaces.forEach((face, i) => {
      const u = speech[i];
      face.obj.position.set(
        -4.74 + i * 3.28,
        0.08 - (1.05 + i * 0.6) * shift,
        2.44 + i * 0.18,
      );
      face.obj.rotation.z = (i ? -0.025 : 0.025) * shift;
      face.set(
        "<b>" +
          u.end.toFixed(1) +
          " s · " +
          u.speaker +
          "</b><p>" +
          u.text +
          "</p>",
        1,
        drop,
      );
    });
    sample.set(
      heading(
        drop ? "Expired utterances" : row.speaker,
        drop
          ? "end < 19.0 s"
          : row.start.toFixed(1) + "–" + row.end.toFixed(1) + " s",
      ) +
        (drop
          ? speech
              .slice(0, 2)
              .map(
                (u) =>
                  "<p>" +
                  u.end.toFixed(1) +
                  " s · " +
                  u.speaker +
                  " · " +
                  u.text +
                  "</p>",
              )
              .join("")
          : "<p>" + words + "</p>"),
      1,
      b > 0 && b < 4 && !drop,
    );
    classifier.set(
      heading("IntentClassifier") +
        field("Recent match", b >= 3 ? "Who is · from your team" : "") +
        ("<b>" + (b >= 3 ? "contact_lookup" : "") + "</b>"),
      level(3),
    );
    files.forEach((f, i) => {
      const rows = c.chunks.filter((r) => r.id.startsWith(f + ":"));
      rows.forEach((r, j) =>
        fileFaces[i][j].set(
          heading(j === rows.length - 1 ? f + ".md" : r.id) +
            field(
              j === rows.length - 1 ? rows.length + " chunks · " + r.id : "",
              r.title,
            ) +
            '<div class="chunk-lines">' +
            r.lines
              .map((n) => '<i style="width:' + (n / 42) * 96 + '%"></i>')
              .join("") +
            "</div>",
          level(4),
        ),
      );
    });
    index.set(
      heading(
        "TF-IDF retrieval",
        c.vocab.length + " terms × " + c.chunks.length + " chunks",
      ) +
        '<div class="matrix-caption">' +
        c.query.length +
        " matching terms · " +
        c.query.map((i) => c.vocab[i]).join(" · ") +
        "</div>",
      level(4),
    );
    rank.obj.position.set(0.48, 2.27, b === 4 ? 1.33 : -0.65);
    citedChunk.set(
      "<b>" +
        c.hits[1].title +
        "</b><small>" +
        c.hits[1].id +
        " · " +
        c.hits[1].score +
        "</small>",
      1,
      b === 4 && p > 0.1 && p < 0.61,
    );
    a.travel(
      citedChunk,
      [
        [0.5, 2.32, 1.53],
        [2.11, 2.79, 1.41],
        [4.55, 2.94, 0.24],
      ],
      step(p, 0.12, 0.6),
    );
    rank.set(
      table(
        ["chunk", "title", "cosine"],
        c.hits.map((v) => [v.id, v.title, v.score]),
        1,
      ),
      level(4),
      b === 4 || !b,
    );
    const composed = b === 0 || b > 4 || (b === 4 && p > 0.49);
    card.set(
      heading("Evidence card", composed ? "49.0 s" : "") +
        (composed
          ? "<h3>Who's Who</h3>" +
            c.bullets
              .map(
                (v) =>
                  "<p>" + v.text + "<small>Source: " + v.title + "</small></p>",
              )
              .join("")
          : ""),
      level(4, 5),
    );
    card.obj.position.y =
      2.92 + (b === 4 ? 0.55 * (1 - step(p, 0.45, 0.95)) : 0);
    const prior = speech.filter((u) => u.end <= now && u.end < 49).reverse();
    list.set(
      heading("Card list", "Newest first") +
        (composed ? "<b>49.0 s · Who's Who</b>" : "") +
        prior
          .map((u) => "<div>" + u.end.toFixed(1) + " s · " + u.title + "</div>")
          .join(""),
      level(4, 5),
    );
    lab.set(
      heading("Optional model", "local lab only") +
        (b === 5
          ? "<small>Citation check · parser test</small><p>" +
            (p < 0.65
              ? "claim without cite · cite ∅"
              : cited.length
                ? "Cited"
                : "cite ∅ → Dropped") +
            "</p>"
          : "<small>Citation check</small>"),
      b === 5 ? 1 : 0.52,
    );
  }
  return { ...a, update };
}
