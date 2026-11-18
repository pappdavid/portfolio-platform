import { retrievalField } from "./retrieval-field.js";
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
  const axis = s.part((d) => {
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
    for (let n = 0; n < 3; n++)
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
  const spines = [];
  for (let f = 0; f < 3; f++) {
    const chunks = c.chunks.filter((k) => k.id.startsWith(fileNames[f] + ":")),
      fx = -9.05 + f * 1.72;
    spines.push(
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
      }),
    );
  }
  const field = retrievalField(
    c,
    [cell(0, 0), cell(283, 0), cell(0, 14), cell(283, 14)],
    m.uniforms,
  );
  s.group.add(field.mesh);
  const frameCorners = [cell(0, 0), cell(283, 0), cell(283, 14), cell(0, 14)];
  const outline = s.part((d) => d.path(frameCorners, -0.8, true));
  const ranks = c.hits.map((hit, i) =>
    s.part(
      (d) => {
        const h = hit.score * 6.4;
        box(d, 0, 0, 0, 0.37, h, 0.46, 0.91, i === 1 ? 0.32 : -0.065);
      },
      [4.62 + i * 0.61, 1.22, -0.55],
    ),
  );
  const matches = [
    [xTime(47), -0.02, 0.65],
    [3.3, 0.25, 0.45],
    [4.4, 0.27, 0.4],
    [5.4, -0.07, 0.45],
  ];
  const citePath = [
    [5.42, 1.22 + c.hits[1].score * 6.4, -0.5],
    [5.6, 4.02, 0.12],
    [6.74, 3.77, 0.55],
    [6.91, 1.82, 0.4],
    [7.18, 1.79, 0.38],
    [7.7, 1.6, 0.32],
    [8.3, 1.58, 0.18],
    [8.9, 1.525, 0.15],
  ];
  const classifier = s.part((d) => {
    cable(d, matches, 21, 0.105, -0.68);
  });
  // Adjacent lanes stay on one continuous ribbon through the citation fork.
  const fork = { at: 4, gap: 0.325 };
  const evidence = s.part((d) => cable(d, citePath, 20, 0.076, 0.65, { fork }));
  const stem = evidence.children[0].material.uniforms.stem;
  const citations = s.part((d) => {
    for (let i = 0; i < 2; i++) {
      const y = 1.85 - i * 0.65;
      d.path(
        [
          [7.3, y - 0.1, 0.15],
          [7.3, y - 0.29, 0.15],
          [8.85, y - 0.29, 0.15],
        ],
        -0.72,
      );
    }
  });
  const list = s.part((d) => {
    for (let j = 0; j < 5; j++)
      d.path(
        [
          [7.15, -0.08 - j * 0.17, 0.23],
          [7.26, -0.14 - j * 0.17, 0.23],
          [9, -0.14 - j * 0.17, 0.23],
        ],
        -0.62,
      );
  });
  const lab = s.part((d) => {
    const x = 6.78,
      y = 3.52;
    d.path(
      [
        [x, y + 0.4, -0.4],
        [x, y, -0.4],
        [x + 1.95, y, -0.4],
        [x + 1.95, y + 0.4, -0.4],
      ],
      -0.82,
    );
    d.line([x + 0.97, y, -0.4], [x + 0.97, y + 0.4, -0.4], -0.65);
  });
  const lift = packet(s, citePath, 20, 0.076, { fork });
  return {
    group: s.group,
    pulses: [
      [matches, 21, 0.105],
      [citePath, 20, 0.076, { fork }],
    ],
    update(t, b, p) {
      const now =
        b === 1
          ? 6 + 8.5 * p
          : b === 2
            ? 35 + 14 * Math.max(0, Math.min(1, (p - 0.15) / 0.8))
            : 49;
      bracket.position.x = xTime(Math.max(0, now - 30));
      bracket.position.y = -1.66;
      bracket.position.z = 0.8;
      bars.forEach(({ archive, working, u }, i) => {
        const arrived = u.end <= now;
        archive.ink(arrived || !b ? 1 : 0.27);
        const cut = now - 30;
        const release = ramp(cut, u.end, u.end + 2);
        working.position.y = -1.57 - release * 0.9;
        working.ink(b === 2 && arrived ? 1 - release : 0);
      });
      ranks.forEach((r, i) => r.ink(b === 4 && i === 1 ? 1.35 : 0.84));
      field.light.value = b === 4 ? 1 : 0.8;
      lab.ink(b === 5 ? 1 : 0);
      lift(t, 4, 0.12, 0.9);
      stem.value = 1;
    },
  };
}
