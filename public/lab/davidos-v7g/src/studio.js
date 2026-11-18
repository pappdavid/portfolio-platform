import {
  sculpt,
  box,
  ring,
  cable,
  packet,
  stage,
  sceneBeat,
  weight,
} from "./strands.js";
import { makeAtlas, field, heading } from "./atlas.js";
import { sourceReplay as data, ramp } from "./story.js";
const documentWordLengths = [
  [
    9, 7, 1, 9, 10, 3, 3, 3, 6, 3, 7, 2, 8, 3, 6, 3, 3, 4, 4, 11, 7, 2, 2, 2, 8,
    3, 11, 3, 11,
  ],
  [
    9, 7, 1, 9, 10, 3, 3, 3, 6, 3, 7, 3, 8, 3, 6, 3, 3, 4, 4, 11, 7, 2, 2, 2, 8,
    3, 11, 3, 11,
  ],
  [
    9, 13, 5, 2, 3, 7, 4, 2, 3, 2, 9, 2, 3, 7, 1, 6, 5, 6, 7, 1, 5, 3, 1, 7, 10,
    2, 7, 8, 7, 8, 15, 4, 5, 2, 8, 2, 10,
  ],
];
export function studio(m) {
  const s = sculpt(m),
    book = makeAtlas(m);
  s.group.add(book.group);
  s.faces = book.faces;
  const page = (name, x, w, h) =>
    book.surface(name, x, 0.15, 0.3, w, h, {
      depth: 0.15,
      css: "browser",
      ink: -0.65,
      fill: -0.036,
      draw(g) {
        for (let j = 0; j < 4; j++) {
          const y = h * 0.27 - h * 0.15 * j;
          g.path(
            [
              [-w * 0.4, y, 0],
              [-w * 0.4, y - h * 0.11, 0],
              [w * 0.4, y - h * 0.11, 0],
            ],
            -0.52,
          );
        }
        for (let j = 0; j < 4; j++)
          g.line(
            [-w / 2, h / 2 - j * 0.035, 0.03],
            [w / 2, h / 2 - j * 0.035, 0.03],
            0.75,
          );
      },
    });
  const author = page("Studio page", -7.6, 3.05, 4.7),
    customer = page("Customer runtime", 7.7, 2.65, 3.65);
  const request = [
    [-6.08, -0.72, 0.29],
    [-5.25, -0.69, 0.15],
    [-4.15, -0.72, -0.2],
    [-2.4, -0.7, 0],
    [0, -0.7, 0],
  ];
  const read = [
    [0, -0.7, 0],
    [2, -0.72, -0.08],
    [4.5, -0.7, 0.05],
    [6.4, -0.7, 0.25],
  ];
  const docX = [-3.75, -1.72, 0.32],
    sourceY = 1.45;
  const docs = docX.map((x, i) =>
    s.part(
      (d) => {
        const w = 1.55;
        let py = 1.68,
          px = 0;
        const pts = [
          [0, 0, 0],
          [0, 2, 0],
          [w - 0.3, 2, 0],
          [w, 1.7, 0],
          [w, 0, 0],
        ];
        for (let k = 0; k < 4; k++)
          d.path(
            pts.map(([x, y]) => [x, y, -k * 0.065]),
            k === 0 ? -0.79 : -0.3,
            true,
          );
        d.path(
          [
            [w - 0.3, 2, 0.01],
            [w - 0.3, 1.7, 0.01],
            [w, 1.7, 0.01],
          ],
          -0.6,
        );
        for (const length of documentWordLengths[i]) {
          const n = length * 0.033;
          if (px + n > 1.32) {
            px = 0;
            py -= 0.153;
          }
          for (let k = 0; k < 3; k++)
            d.line(
              [0.11 + px, py + k * 0.016, 0.02],
              [0.11 + px + n, py + k * 0.016, 0.02],
              i === 1 ? 0.76 : -0.62,
            );
          px += n + 0.048;
        }
        if (i === 1)
          for (let k = 0; k < 6; k++)
            d.line(
              [0.11, 0.27 + k * 0.024, 0.04],
              [1.38, 0.27 + k * 0.024, 0.04],
              0.85,
            );
      },
      [x, sourceY, -0.9],
    ),
  );
  const quotePath = [
    [-1, 1.82, -0.85],
    [-1.7, 2.48, 1.35],
    [-3.65, 2.17, 1.8],
    [-5.51, 1.06, 1.2],
    [-7.55, -1.06, 0.48],
  ];
  const aperture = (d, x, y, r, n = 8) => {
    for (let i = 0; i < n; i++)
      ring(d, x, y, -0.42 + i * 0.095, r, r * 0.95, i % 3 === 0 ? 0.76 : -0.5);
  };
  s.part((d) => {
    cable(d, request, 18, 0.116, -0.52);
    cable(d, read, 18, 0.116, -0.47);
    aperture(d, -3.55, -0.7, 0.4);
    aperture(d, 0, -0.7, 0.57, 10);
    cable(
      d,
      [
        [0, -0.15, 0],
        [0, 0.32, -0.28],
        [-1.2, 0.68, -0.55],
        [-1.2, 1.14, -0.9],
      ],
      14,
      0.075,
      -0.65,
    );
    d.path(
      [
        [-3.9, 1.38, -0.91],
        [-3.9, 1.12, -0.91],
        [2.05, 1.12, -0.91],
        [2.05, 1.38, -0.91],
      ],
      -0.86,
    );
    cable(
      d,
      [
        [0, -1.22, 0],
        [-0.12, -1.64, 0.35],
        [-1.2, -1.85, 0.46],
        [-2.35, -1.85, 0.46],
      ],
      12,
      0.065,
      -0.62,
    );
    // Two source paths meet the filter. The internal branch terminates at its teeth.
    cable(
      d,
      [
        [1.88, 2.35, -0.9],
        [2.25, 2.16, -0.76],
        [2.55, 1.65, -0.5],
      ],
      10,
      0.06,
      -0.75,
    );
    cable(
      d,
      [
        [-0.17, 2.73, -0.92],
        [0.1, 3.86, -0.85],
        [2.4, 3.82, -0.7],
        [2.83, 2.88, -0.6],
        [3.1, 1.62, -0.44],
        [2.8, 0.82, -0.3],
        [1.54, 0.15, -0.1],
        [0, -0.13, 0],
      ],
      15,
      0.082,
      -0.6,
    );
    for (let i = 0; i < 12; i++)
      d.line(
        [2.26 + i * 0.064, 1.62, -0.85],
        [2.26 + i * 0.064, 1.62, -0.18],
        i % 2 === 0 ? 0.61 : -0.4,
      );
    cable(
      d,
      [
        [4.5, 0.65, -0.6],
        [4.3, 0.16, -0.55],
        [2.85, -0.07, -0.5],
        [0.48, -0.48, -0.14],
      ],
      12,
      0.063,
      -0.45,
    );
    for (let j = 0; j < 2; j++)
      for (let k = 0; k < 5; k++)
        d.path(
          [
            [4.35 + j * 0.85, 3.1, -k * 0.11],
            [4.35 + j * 0.85, 3.62, -k * 0.11],
            [4.66 + j * 0.22, 3.62, -k * 0.11],
          ],
          -0.4,
        );
  });
  const snapshot = s.part(
    (d) => {
      for (let j = 0; j < 7; j++) {
        box(
          d,
          -0.8,
          0,
          -j * 0.085,
          1.6,
          1.17,
          0.02,
          j % 2 === 0 ? 0.67 : -0.38,
          j === 0 ? -0.19 : 0,
        );
      }
      let tx = 0,
        ty = 0.98;
      for (const word of documentWordLengths[1]) {
        const w = word * 0.03;
        if (tx + w > 1.3) {
          tx = 0;
          ty -= 0.104;
        }
        d.line([-0.64 + tx, ty, 0.035], [-0.64 + tx + w, ty, 0.035], -0.83);
        tx += w + 0.035;
      }
      for (let j = 0; j < 5; j++)
        d.line(
          [-0.64, 0.12 + j * 0.014, 0.035],
          [0.57, 0.12 + j * 0.014, 0.035],
          0.78,
        );
    },
    [4.5, 0.65, -0.6],
  );
  const counters = [0, 1].map((j) =>
    s.part(
      (d) => {
        for (let i = 0; i < 5; i++)
          d.line([i * 0.16, 0, 0], [i * 0.16, 0.21, -0.13], -0.5);
        d.path(
          [
            [0, -0.03, 0],
            [0.72, -0.03, 0],
          ],
          -0.75,
        );
        if (j === 0) ring(d, 0, 0.18, 0, 0.1, 0.1, 0.9);
      },
      [-2.48 + j * 1.18, -1.87, 0.47],
    ),
  );
  const send = packet(s, request),
    deliver = packet(s, quotePath, 25, 0.082),
    serve = packet(s, read);
  const extraction = s.part((d) => {
    for (let i = 0; i < 16; i++)
      d.line([-0.62, i * 0.014, 0], [0.62, i * 0.014, 0], 0.94);
  });
  const label = (pos, text, beats, off) => s.words(pos, text, beats, off);
  label([-7.6, 2.54, 0.3], "Studio page", [0], [0, -18]);
  label([-1.16, 3.54, -0.9], "PostgreSQL · versioned sources", [0], [0, -20]);
  label([4.8, 3.7, -0.35], "Model gateway · off in this demo", [0], [10, -12]);
  label([2.78, 1.62, -0.45], "Audience filter · retrieval", [0, 3], [0, -17]);
  label([4.7, 0.59, -0.5], "Frozen snapshot", [0, 4, 5], [8, 18]);
  label([7.7, 2.05, 0.3], "Customer runtime", [0, 4], [0, -18]);
  label([-0.02, -0.73, 0], "Server route · session", [0, 1], [20, 25]);
  label([-1.75, -1.86, 0.45], "Command handler · revision check", [0], [0, 20]);
  docX.forEach((x, i) =>
    label(
      [x + 0.78, sourceY + 2, -0.9],
      ["v1 · public", "v2 · public", "v2 · internal"][i],
      [2, 3],
      [0, -16],
    ),
  );
  label([-3.55, -0.4, 0.2], "Cookie → Workspace", [1], [0, -22]);
  label(
    [-1.75, -1.87, 0.48],
    "Expected revision  ≠  Current revision",
    [5],
    [0, 19],
  );
  label([2.55, 1.61, -0.44], "Withheld", [3], [0, 17]);
  const quoted = label([-1, 1.8, 0], "“up to 50 records”", [2], [0, -19]);
  quoted.el.classList.add("quotation");
  label([-0.95, 2.49, -0.8], "API · batch · limit", [2], [0, -14], "unit");
  const expectDot = s.part((d) => {
    for (let k = 0; k < 9; k++) ring(d, 0, 0, k * 0.026, 0.09, 0.09, 0.98);
  });
  label([-2.19, -2.08, 0.51], "Expected", [5], [-18, 9], "unit");
  label([-1, -2.08, 0.51], "Current", [5], [18, 9], "unit");
  label([4.5, 1.83, -0.49], "v2 · public", [4], [0, -12]);
  const publicPath = [
    [-0.8, 2.73, -0.9],
    [0.1, 3.86, -0.85],
    [2.4, 3.82, -0.7],
    [2.83, 2.88, -0.6],
    [3.1, 1.62, -0.44],
    [2.8, 0.82, -0.3],
    [1.54, 0.15, -0.1],
    [0, -0.13, 0],
  ];
  const allowed = packet(s, publicPath, 22, 0.083),
    withheld = packet(
      s,
      [
        [1.88, 2.35, -0.9],
        [2.25, 2.16, -0.76],
        [2.55, 1.65, -0.5],
      ],
      17,
      0.06,
    );
  const freeze = packet(
    s,
    [
      [0, -0.7, 0],
      [1.5, 0, -0.3],
      [2.85, -0.07, -0.5],
      [4.5, 0.65, -0.55],
    ],
    22,
    0.092,
  );
  const reject = packet(
    s,
    [
      [-2.32, -1.8, 0.42],
      [-1.2, -1.75, 0.41],
      [0, -0.7, 0],
      [-3.3, -0.7, -0.12],
      [-6.08, -0.72, 0.29],
    ],
    19,
    0.096,
  );
  const endpoints = [
    [],
    request.at(-1),
    quotePath.at(-1),
    [2.55, 1.61, -0.45],
    [4.5, 0.95, -0.4],
    [-1.75, -1.87, 0.48],
  ];
  return {
    ...s,
    endpoints,
    update(t) {
      const b = sceneBeat(t),
        p = stage(t, b),
        lift = stage(t, 2),
        active = ramp(t, 3.7, 4);
      const show = (text, amount) =>
        '<span style="opacity:' + amount + '">' + text + "</span>";
      const question = show(data.question, ramp(t, 0.48, 0.77)),
        quote = show(data.excerpt, ramp(t, 1.79, 2));
      author.set(
        heading("Studio page") +
          field("Sources", "v1 · public<br>v2 · public<br>v2 · internal") +
          field("Question", question) +
          field("Answer", quote) +
          field(
            "Review",
            t < 3.7
              ? "Approve　 Activate"
              : t < 3.92
                ? "Approved　 Activate"
                : "Approved　 Active",
          ),
        1,
      );
      customer.set(
        heading("Customer runtime") +
          field(
            "Active evidence",
            show("v2 · public<br>" + data.excerpt, active),
          ) +
          field("Question") +
          field("Answer"),
        1,
      );
      docs.forEach((o, i) =>
        o.ink(i === 1 ? 0.84 + 0.16 * weight(t, 2) : 0.67),
      );
      send(stage(t, 1));
      serve(stage(t, 4));
      deliver(lift, weight(t, 2));
      const k = lift * (quotePath.length - 1),
        i = Math.min(quotePath.length - 2, Math.floor(k));
      const loc = quotePath[i].map(
        (v, j) => v + (quotePath[i + 1][j] - v) * (k - i),
      );
      extraction.position.fromArray(loc);
      extraction.ink(weight(t, 2));
      quoted.position = loc;
      quoted.amount = 1 - ramp(lift, 0.74, 1);
      snapshot.ink(0.27 + 0.73 * active);
      snapshot.scale.z = 0.26 + 0.74 * active;
      counters[1].position.x = -1.3;
      allowed(stage(t, 3) * 0.89, weight(t, 3));
      withheld(stage(t, 3) * 0.78, weight(t, 3));
      freeze(stage(t, 4) * 0.91, weight(t, 4));
      reject(stage(t, 5) * 0.91, weight(t, 5));
      expectDot.position.set(-1.3 + data.current * 0.16 * active, -1.69, 0.51);
      expectDot.ink(0.24 + 0.76 * weight(t, 5));
      docs[1].position.z =
        -0.9 + 0.16 * Math.sin(4 * Math.PI * stage(t, 4)) * weight(t, 4);
      endpoints[2] = loc;
    },
  };
}
