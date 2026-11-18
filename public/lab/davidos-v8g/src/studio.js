import { CatmullRomCurve3, Vector3 } from "../vendor/three.module.min.js";
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
  const author = page("Studio page", -7.6, 3.45, 4.8),
    customer = page("Customer runtime", 7.7, 2.95, 3.85);
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
  const excerptCurve = new CatmullRomCurve3(
    quotePath.map((p) => new Vector3(...p)),
  );
  const aperture = (d, x, y, r, n = 8) => {
    for (let i = 0; i < n; i++)
      ring(d, x, y, -0.42 + i * 0.095, r, r * 0.95, i % 3 === 0 ? 0.76 : -0.5);
  };
  const publicPath = [
    [-0.2, 1.7, -0.88],
    [0.34, 1.34, -0.48],
    [2.22, 1.41, -0.46],
    [2.88, 1.62, -0.44],
    [3.18, 1.3, -0.4],
    [3.42, 1.22, -0.36],
  ];
  const internalPath = [
    [1.87, 2.36, -0.9],
    [2.26, 2.18, -0.72],
    [2.6, 1.68, -0.45],
  ];
  const routing = s.part((d) => {
    cable(d, request, 18, 0.116, -0.52);

    // Session matches the two sides of one request, the route forks vertically.
    d.path(
      [
        [-4.0, -0.45, 0.22],
        [-3.62, -0.45, 0.22],
        [-3.47, -0.7, 0.22],
      ],
      -0.82,
    );
    d.path(
      [
        [-3.47, -0.7, 0.22],
        [-3.25, -0.94, 0.22],
        [-2.9, -0.94, 0.22],
      ],
      0.83,
    );
    aperture(d, 0, -0.7, 0.32, 3);
  });
  const runtimeRead = s.part((d) => cable(d, read, 18, 0.09, -0.47));
  const store = s.part((d) => {
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
  });
  const filter = s.part((d) => {
    // Two source paths meet the filter. The internal branch terminates at its teeth.
    cable(d, internalPath, 10, 0.06, -0.75);
    cable(d, publicPath, 15, 0.075, 0.66);
    for (let i = 0; i < 12; i++)
      d.line(
        [2.26 + i * 0.064, 1.62, -0.85],
        [2.26 + i * 0.064, 1.62, -0.18],
        i % 2 === 0 ? 0.61 : -0.4,
      );
  });
  const snapshotLink = s.part((d) => {
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
  });
  const gateway = s.part(
    (d) => {
      d.path(
        [
          [0, 0.42, 0],
          [0, 0, 0],
          [1.02, 0, 0],
          [1.02, 0.42, 0],
          [0.62, 0.42, 0],
        ],
        -0.78,
      );
      d.line([0, 0.42, 0], [0.38, 0.42, 0], -0.78);
      d.line([0.23, 0.2, 0], [0.79, 0.2, 0], -0.42);
    },
    [4.27, 3.12, -0.4],
  );
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
  const stopX = -0.82,
    baseY = 0.45;
  const comparison = s.part((d) => {
    // One shared origin. Each block is one accepted workspace revision.
    const unit = 1.26;
    d.line([stopX, baseY + 0.58, 0.43], [stopX, baseY - 1.05, 0.43], -0.83);
    for (const [i, count] of [data.expected, data.current].entries()) {
      const y = baseY - i * 0.74;
      d.line([stopX, y, 0.45], [stopX + unit * 1.72, y, 0.45], -0.42);
      if (!count) ring(d, stopX, y, 0.47, 0.085, 0.085, 0.97);
      for (let k = 0; k < count; k++)
        box(d, stopX + k * unit, y - 0.16, 0.47, unit, 0.32, 0.13, 0.97, 0.22);
    }
  });
  const incomingLine = [
    [-3.66, 0.45, 0.42],
    [-3.1, 0.45, 0.42],
    [-2.3, 0.45, 0.42],
    [stopX - 0.11, 0.45, 0.42],
  ];
  const incoming = packet(s, incomingLine, 25, 0.115);
  const stopped = s.part((d) => cable(d, incomingLine, 21, 0.115, 0.96));
  const refusal = packet(
    s,
    [
      [stopX - 0.12, 0.3, 0.42],
      [-1.5, -0.6, 0.52],
      [-2.6, -0.7, 0.52],
      [-3.66, -0.7, 0.52],
    ],
    20,
    0.075,
  );
  const send = packet(s, request),
    deliver = packet(s, quotePath, 25, 0.082);
  const extraction = s.part((d) => {
    for (let i = 0; i < 16; i++)
      d.line([-0.62, i * 0.014, 0], [0.62, i * 0.014, 0], 0.94);
  });
  const label = (pos, text, beats, off, css) =>
    s.words(pos, text, beats, off, css);

  label([-1.16, 3.54, -0.9], "PostgreSQL · versioned sources", [0], [0, -20]);
  label([4.8, 3.7, -0.35], "Model gateway · off in this demo", [0], [10, -12]);
  label([2.78, 1.62, -0.45], "Audience filter · retrieval", [0, 3], [0, -17]);
  label([4.7, 0.59, -0.5], "Frozen snapshot", [0, 4], [8, 18]);

  label([-0.02, -0.73, 0], "Server route", [0, 1], [20, 25]);
  label([-1.75, -1.86, 0.45], "Command handler · revision check", [0], [0, 20]);
  docX.forEach((x, i) =>
    label(
      [x + 0.78, sourceY + 2, -0.9],
      ["v1 · public", "v2 · public", "v2 · internal"][i],
      [2, 3],
      [0, -16],
    ),
  );
  label([-3.55, -0.4, 0.2], "Cookie → Workspace", [0, 1], [0, -22]);
  label(
    [stopX + 1.15, baseY, 0.45],
    "Expected · " + data.expected,
    [5],
    [0, -14],
  );
  label(
    [stopX + 1.15, baseY - 0.74, 0.45],
    "Current · " + data.current,
    [5],
    [0, 12],
  );
  label([-2.54, 0.45, 0.42], "Late write", [5], [-12, -14]);
  const statusLabel = label(
    [-2.4, -0.7, 0.52],
    "409 · Revision conflict",
    [5],
    [0, 14],
    "signal",
  );
  label([4.5, 1.18, -0.5], "Frozen snapshot · v2", [5], [0, -16]);
  const heldQuote = label(
    [4.5, 0.44, -0.47],
    "“" + data.excerpt + "”",
    [5],
    [0, 12],
  );
  heldQuote.el.classList.add("signal");
  label([2.55, 1.61, -0.44], "Withheld", [3], [0, 17]);
  const quoted = label([-1, 1.8, 0], "“up to 50 records”", [2], [0, -19]);
  quoted.el.classList.add("quotation");
  label([-0.95, 2.49, -0.8], "API · batch · limit", [2], [0, -14], "unit");
  label([4.5, 1.83, -0.49], "v2 · public", [4], [0, -12]);
  const allowed = packet(s, publicPath, 22, 0.083),
    withheld = packet(s, internalPath, 17, 0.06);
  const activationPath = [
    [-0.21, 1.79, -0.88],
    [1.3, 1.68, -0.66],
    [2.85, 1.35, -0.52],
    [3.72, 1.27, -0.54],
  ];
  const activatedRead = [
    [5.29, 1.18, -0.54],
    [5.68, 1.12, -0.3],
    [5.94, 0.84, 0.1],
    [6.24, 0.73, 0.28],
  ];
  const activationGuide = s.part((d) => {
    cable(d, activationPath, 18, 0.095, 0.75);
    cable(d, activatedRead, 15, 0.075, 0.75);
  });
  const copyPacket = packet(s, activationPath, 22, 0.1),
    readPacket = packet(s, activatedRead, 20, 0.08);
  const extractedGuide = s.part((d) => cable(d, quotePath, 15, 0.055, 0.68));
  const endpoints = [
    [],
    request.at(-1),
    quotePath.at(-1),
    [2.55, 1.61, -0.45],
    [4.5, 0.08, -0.4],
    [stopX + 1.26, baseY - 0.9, 0.47],
  ];
  return {
    ...s,
    gateway,
    endpoints,
    update(t, closing = 0) {
      const b = sceneBeat(t),
        p = stage(t, b),
        lift = stage(t, 2),
        active = ramp(t, 3.7, 4);
      const show = (text, amount) =>
        '<span style="opacity:' + amount + '">' + text + "</span>";
      const preview = 1 - ramp(t, 0.45, 0.67);
      const weights = [0, ...[1, 2, 3, 4, 5].map((b) => weight(t, b))];
      const question = show(
          data.question,
          Math.max(closing, preview, ramp(t, 0.48, 0.77)),
        ),
        quote = show(
          data.excerpt,
          Math.max(closing, preview, ramp(t, 1.79, 2)),
        );
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
            show("v2 · public", Math.max(closing, preview, active)),
          ) +
          field(
            "Question",
            show(data.question, Math.max(closing, preview, active)),
          ) +
          field(
            "Answer",
            show(data.excerpt, Math.max(closing, preview, active)),
          ),
        1,
      );
      docs.forEach((o, i) =>
        o.ink(i === 1 ? 0.84 + 0.16 * weight(t, 2) : 0.67),
      );
      send(stage(t, 1));
      copyPacket(ramp(p, 0.11, 0.71), weights[4]);
      readPacket(ramp(p, 0.6, 1), weights[4]);
      activationGuide.ink(weights[4]);
      extractedGuide.ink(weights[2] * 0.78);
      deliver(lift, weight(t, 2));
      const loc = excerptCurve.getPointAt(lift).toArray();
      extraction.position.fromArray(loc);
      extraction.ink(weights[2] * (1 - ramp(lift, 0.71, 0.99)));
      quoted.position = loc;
      quoted.amount = 1 - ramp(lift, 0.74, 1);
      snapshot.ink(0.27 + 0.73 * active);
      snapshot.scale.z = 0.26 + 0.74 * active;
      const close = weight(t, 5),
        depart = ramp(t, 5.45, 5.83);
      comparison.ink(Math.max(preview * 0.8, close));
      comparison.position.set(-1.48 * (1 - close), -2.23 * (1 - close), 0);
      comparison.scale.setScalar(0.5 + 0.5 * close);
      routing.ink(
        Math.max(
          closing,
          (1 - depart) *
            (1 - Math.max(weights[2], weights[3], weights[4], close)),
        ),
      );
      runtimeRead.ink(Math.max(closing, preview));
      store.ink(Math.max(closing, preview));
      filter.ink(
        (1 - depart) *
          (1 - Math.max(weights[1], weights[2], weights[4], close)),
      );
      snapshotLink.ink(Math.max(closing, preview));
      gateway.ink(preview);
      snapshot.ink(
        Math.max(closing, preview, active) *
          (1 - Math.max(weights[1], weights[2], weights[3])),
      );
      docs.forEach((doc, i) =>
        doc.ink(
          (1 - depart) *
            (1 - Math.max(weights[1], close, i === 1 ? 0 : weights[4])),
        ),
      );
      author.obj.scale.setScalar(1 - 0.35 * close);
      author.obj.position.x = -7.6 + 2.95 * close;
      author.exposure.value = Math.max(
        closing,
        (1 - depart) * (1 - Math.max(weights[3], weights[4])),
      );
      customer.exposure.value = Math.max(
        closing,
        preview,
        ramp(t, 3.7, 3.9) * (1 - close),
      );
      snapshot.position.y = 0.65 - 0.68 * close;
      incoming(ramp(p, 0, 0.45), close);
      stopped.ink(close * ramp(p, 0.24, 0.46));
      refusal(ramp(p, 0.48, 0.91), close);
      statusLabel.amount = ramp(p, 0.6, 0.89);

      allowed(stage(t, 3), weight(t, 3));
      withheld(stage(t, 3) * 0.85, weight(t, 3));

      docs[1].position.z =
        -0.9 + 0.16 * Math.sin(4 * Math.PI * stage(t, 4)) * weight(t, 4);
      endpoints[2] = loc;
    },
  };
}
