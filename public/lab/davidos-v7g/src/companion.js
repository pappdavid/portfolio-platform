import {
  sculpt,
  box,
  cable,
  packet,
  stage,
  sceneBeat,
  weight,
} from "./strands.js";
import { conversation as c } from "./conversation.js";
import { ramp, clamp } from "./story.js";
export const xTime = (s) => -9 + s * 0.205;
export function companion(m) {
  const s = sculpt(m),
    x0 = -3.35,
    width = 7.5,
    dx = width / c.vocab.length;
  const row = (j) => [1.42 + j * 0.085, -0.35 - j * 0.225];
  const cell = (i, j) => [x0 + i * dx, ...row(j)];
  s.part((d) => {
    for (const y of [-0.38, -0.92])
      d.line([xTime(0), y, 0.64], [xTime(60), y, 0.64], -0.57);
    for (let i = 0; i <= 60; i++) {
      const h = i % 5 ? 0.12 : 0.25;
      d.line(
        [xTime(i), -0.96, 0.67],
        [xTime(i), -0.96 - h, 0.73],
        i % 5 ? -0.46 : -0.86,
      );
    }
  });
  const bars = c.utterances.map((u, i) => {
    const w = (u.end - u.start) * 0.205,
      y = u.speaker === "se" ? -0.85 : -0.31;
    function paint(d) {
      box(d, 0, 0, 0, w, 0.28, 0.43, 0.74, -0.13);
      let at = 0;
      for (const word of u.text.split(" ")) {
        const w0 = (w * word.length) / u.text.length;
        for (let j = 0; j < 4; j++)
          d.line(
            [at, 0.045 + j * 0.052, 0.017],
            [at + w0, 0.045 + j * 0.052, 0.017],
            0.84,
          );
        at += w0 + w / u.text.length;
      }
    }
    return {
      archive: s.part(paint, [xTime(u.start), y, 0.65]),
      working: s.part(paint, [xTime(u.start), -1.57, 0.8]),
      u,
    };
  });
  const bracket = s.part((d) => {
    const w = 30 * 0.205;
    for (let n = 0; n < 8; n++)
      d.path(
        [
          [0, 0.38, -n * 0.055],
          [0, 0, -n * 0.055],
          [w, 0, -n * 0.055],
          [w, 0.38, -n * 0.055],
        ],
        0.5 + n * 0.06,
      );
  });
  const fileNames = ["acme_account", "contacts_and_facts", "notes"];
  for (let f = 0; f < 3; f++) {
    const chunks = c.chunks.filter((k) => k.id.startsWith(fileNames[f] + ":")),
      fx = -9.05 + f * 1.72;
    s.part((d) => {
      for (let j = 0; j < chunks.length; j++) {
        const y = 1.05 + j * 0.32,
          z = -0.22 - j * 0.13;
        d.path(
          [
            [fx, y, z + 0.1],
            [fx, y + 0.13, z - 0.8],
            [fx + 1.22, y + 0.13, z - 0.8],
            [fx + 1.38, y + 0.1, z - 0.53],
            [fx + 1.38, y, z + 0.1],
          ],
          -0.8,
          true,
        );
        chunks[j].lines.forEach((len, i) => {
          const xx = fx + 0.09 + (i % 3) * 0.36;
          d.line(
            [xx, y + 0.03, z - 0.03 - Math.floor(i / 3) * 0.08],
            [
              xx + 0.29 * Math.min(1, len / 38),
              y + 0.03,
              z - 0.03 - Math.floor(i / 3) * 0.08,
            ],
            0.65,
          );
        });
        const r = c.chunks.indexOf(chunks[j]);
        d.path(
          [
            [fx + 1.38, y, z - 0.3],
            [fx + 1.52, y, z - 0.6],
            [x0 - 0.35, ...row(r)],
            [x0, ...row(r)],
          ],
          -0.35,
        );
      }
    });
  }
  s.part((d) => {
    for (let i = 0; i <= c.vocab.length; i++)
      d.line(cell(i, 0), cell(i, 14), -0.32);
    for (let j = 0; j <= 14; j++) d.line(cell(0, j), cell(283, j), -0.66);
    for (let j = 0; j < 14; j++)
      for (const i of c.chunks[j].terms) {
        const [x, y, z] = cell(i, j);
        box(d, x, y + 0.028, z, dx * 0.87, 0.085, 0.09, -0.68, -0.45);
      }
  });
  const lit = s.part((d) => {
    for (const i of c.query) d.line(cell(i, 0), cell(i, 14), 0.83);
    c.chunks.forEach((r, j) =>
      r.terms
        .filter((i) => c.query.includes(i))
        .forEach((i) => {
          const [x, y, z] = cell(i, j);
          box(d, x, y + 0.065, z, dx, 0.145, 0.13, 0.97, 0.64);
        }),
    );
  });
  const ranks = c.hits.map((hit, i) =>
    s.part(
      (d) => {
        const h = hit.score * 6.4;
        box(d, 0, 0, 0, 0.37, h, 0.46, 0.91, -0.15);
        for (let k = 0; k < 13; k++)
          d.line([k * 0.028, 0, 0.01], [k * 0.028, h, 0.01], 0.32 + k * 0.048);
      },
      [4.62 + i * 0.61, 1.22, -0.55],
    ),
  );
  const matches = [
    [2.35, -0.2, 0.56],
    [3.3, 0.25, 0.45],
    [4.4, 0.27, 0.4],
    [5.4, -0.07, 0.45],
  ];
  const citePath = [
    [5.37, 2.9, -0.5],
    [5.92, 3.07, 0.42],
    [6.53, 2.53, 0.55],
    [7.18, 1.79, 0.38],
  ];
  s.part((d) => {
    for (let i = 0; i < 3; i++) {
      const shift = i * 0.11;
      d.path(
        matches.map(([x, y, z], k) => [x, y + (1 - k / 3) * shift, z]),
        -0.68,
      );
    }
    cable(d, citePath, 16, 0.056, -0.59);
    for (let i = 0; i < 2; i++) {
      const y = 1.85 - i * 0.65;
      cable(
        d,
        [
          [7.2, y, 0.35],
          [7.62, y + 0.12, 0.3],
          [8.34, y + 0.1, 0.15],
          [8.9, y, 0.15],
        ],
        12,
        0.06,
        0.67,
      );
      d.path(
        [
          [7.3, y - 0.1, 0.15],
          [7.3, y - 0.29, 0.15],
          [8.85, y - 0.29, 0.15],
        ],
        -0.72,
      );
    }
    for (let j = 0; j < 5; j++)
      d.path(
        [
          [7.15, -0.08 - j * 0.17, 0.23],
          [7.26, -0.14 - j * 0.17, 0.23],
          [9, -0.14 - j * 0.17, 0.23],
        ],
        -0.62,
      );
    for (let j = 0; j < 2; j++)
      d.path(
        [
          [6.7 + j * 1.25, 3.76, -0.4],
          [6.7 + j * 1.25, 3.5, -0.4],
          [7.75 + j * 1.25, 3.5, -0.4],
        ],
        -0.48,
      );
  });
  const lift = packet(s, citePath, 20, 0.08),
    expired = [],
    w = s.words;
  w([xTime(4), -0.38, 0.65], "Transcript", [0], [0, -22]);
  w([xTime(28), -1.59, 0.8], "SlidingWindow · 30 s", [0], [0, 24]);
  w([-6.4, 2.54, -1], "Knowledge base", [0], [-10, -22]);
  w([-0.12, 2.71, -3.25], "TF-IDF retrieval · 283 × 14", [0], [0, -16]);
  w([4.67, 0.18, 0.42], "IntentClassifier", [0, 3], [0, 24]);
  w([8, 1.85, 0.35], "Evidence card", [0], [0, -18]);
  w([7.62, 3.76, -0.46], "Model · local lab only", [0, 5], [0, -18]);
  w([8, -0.78, 0.23], "Card list", [0], [0, 22]);
  for (let sec = 0; sec <= 60; sec += 10)
    w(
      [xTime(sec), -1.17, 0.7],
      sec + " s",
      sec === 0 || sec === 30 || sec === 60 ? [0, 1, 2] : [1, 2],
      [0, 15],
      "unit",
    );
  const bracketLabel = w([0, -1.62, 0.8], "", [2], [0, 19], "signal");
  bars
    .slice(0, 2)
    .forEach(({ u }) =>
      expired.push(
        w(
          [0, 0, 0],
          u.end.toFixed(1) + " s · " + u.speaker,
          [2],
          [0, 16],
          "unit",
        ),
      ),
    );
  fileNames.forEach((v, i) =>
    w(
      [-8.5 + i * 1.72, 2.69, -0.8],
      String(c.chunks.filter((k) => k.id.startsWith(v + ":")).length) +
        " chunks",
      [0, 4],
      [0, -12],
      "unit",
    ),
  );
  w([0.8, 2.78, -3.2], "283 terms × 14 chunks", [4], [0, -18], "signal");
  w([3.95, 0.18, 0.41], "contact_lookup", [3], [0, -24], "signal");
  w([7.65, 1.73, 0.35], "Who's Who", [4, 5], [0, -18], "signal");
  c.bullets.forEach((v, i) =>
    w(
      [8.15, 1.68 - i * 0.67, 0.35],
      v.text.split(" — ")[0] + " · " + v.title,
      [4, 5],
      [0, 12],
      "unit",
    ),
  );
  w([5.26, 1.15, -0.5], "cosine similarity", [4], [0, 18]);
  const parsed = s.part((d) => {
    for (let k = 0; k < 12; k++)
      d.line([-0.4, k * 0.014, 0], [0.45, k * 0.014, 0], 0.9);
  });
  const matchesIn = packet(s, matches, 14, 0.056);
  const newest = w(
    [8, -0.05, 0.35],
    "49.0 s · Who's Who",
    [4, 5],
    [0, 4],
    "unit",
  );
  const previous = c.utterances
    .slice(0, 4)
    .reverse()
    .map((u, i) =>
      w(
        [8.12, -0.37 - i * 0.26, 0.23],
        u.end.toFixed(1) + " s · " + u.title,
        [4, 5],
        [0, 0],
        "cell",
      ),
    );
  c.hits.forEach((hit, i) =>
    w(
      [4.8 + i * 0.61, 1.22 + hit.score * 6.4, -0.5],
      String(hit.score),
      [4],
      [0, -15],
      "unit",
    ),
  );
  const labText = w(
    [7.4, 3.55, -0.25],
    "claim without cite",
    [5],
    [0, 10],
    "signal",
  );
  const firstWords = w([xTime(8), -0.2, 0.7], "engineer", [1], [0, -15]);
  const ends = [
    [],
    [xTime(14.5), -0.73, 0.6],
    [xTime(14.5), -2.62, 0.8],
    [4.4, 0.2, 0.4],
    [5.37, 2.9, -0.5],
    [7.8, 3.56, -0.4],
  ];
  return {
    ...s,
    endpoints: ends,
    update(t) {
      const replayStart = ramp(t, 0.45, 0.66),
        p = stage(t, 2),
        now =
          49 -
          38.5 * replayStart +
          4 * ramp(t, 0.68, 0.94) +
          16.5 * ramp(t, 1.45, 1.58) +
          4 * ramp(t, 1.58, 1.73) +
          14 * ramp(p, 0.6, 0.99),
        cut = now - 30;
      bracket.position.set(xTime(cut), -1.66, 0.8);
      bracketLabel.position = [xTime(cut + 15), -1.68, 0.8];
      bracketLabel.el.textContent =
        cut.toFixed(1) + "–" + now.toFixed(1) + " s";
      bars.forEach(({ u, archive, working }, i) => {
        const overview = 1 - ramp(t, 0.45, 0.63);
        const arrival = [0.45, 0.67, 1.45, 1.53, 1.75, 9, 10][i];
        const inTime = Math.max(overview, ramp(t, arrival, arrival + 0.19));
        archive.ink(0.3 + 0.7 * inTime);
        const drop =
          i < 2 ? ramp(cut, u.end, u.end + 3) * ramp(t, 1.6, 1.77) : 0;
        const release = i < 2 ? 1 - ramp(t, 2.45, 2.64) : 1;
        const selected = i >= 2 && i <= 4 ? overview : 0;
        working.ink(
          Math.max(selected, ramp(t, arrival, arrival + 0.19)) * release,
        );
        working.position.y = -1.52 - drop * (1.05 + i * 0.55);
        working.scale.x = Math.max(0.004, inTime);
        if (i < 2) {
          expired[i].position = [
            xTime((u.start + u.end) / 2),
            working.position.y,
            0.85,
          ];
          expired[i].amount = drop;
        }
      });
      firstWords.el.textContent = stage(t, 1) < 0.72 ? "engineer" : "se";
      const labDrop = ramp(t, 4.65, 4.98);
      parsed.position.set(7.32, 3.54 - labDrop * 0.88, -0.35);
      parsed.ink(weight(t, 5));
      labText.position = [7.32, 3.55 - labDrop * 0.88, -0.35];
      labText.el.textContent = labDrop > 0.7 ? "Dropped" : "claim without cite";
      newest.amount = ramp(t, 3.76, 4);
      previous.forEach((v) => (v.amount = ramp(t, 3.52, 3.9)));
      matchesIn(stage(t, 3) * 0.91, weight(t, 3));
      lit.ink(0.07 + 0.93 * ramp(t, 3.45, 3.78));
      ranks.forEach((r, i) => {
        r.scale.y = 0.1 + 0.9 * ramp(t, 3.46 + i * 0.025, 3.8 + i * 0.025);
      });
      lift(stage(t, 4), weight(t, 4));
      ends[1] = [xTime(stage(t, 1) < 0.72 ? 10.5 : 14.5), -0.52, 0.65];
    },
  };
}
