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
import { makeAtlas } from "./atlas.js";
import { sourceReplay as data, ramp } from "./story.js";
export function studio(m) {
  const documentWordLengths = data.sources.map(
    (source) => source.text?.split(/\s+/).map((word) => word.length) ?? [],
  );
  const s = sculpt(m),
    book = makeAtlas(m);
  s.group.add(book.group);
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
  });
  const routeSocket = s.part((d) => aperture(d, 0, -0.7, 0.32, 3));
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
  const send = packet(s, request, 22, 0.116),
    deliver = packet(s, quotePath, 25, 0.082);
  const extraction = s.part((d) => {
    for (let i = 0; i < 16; i++)
      d.line([-0.62, i * 0.014, 0], [0.62, i * 0.014, 0], 0.94);
  });
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
  return {
    group: s.group,
    pulses: [
      [request, 22, 0.116],
      [publicPath, 22, 0.083],
      [read, 18, 0.09],
    ],
    update(t, b, p) {
      const overview = b === 0;
      docs.forEach((doc, i) =>
        doc.ink(i === 1 ? 1.15 : i === 2 && b === 3 ? 0.92 : 0.67),
      );
      send(t, 1, 0, 0.82);
      const lift = deliver(t, 2, 0, 0.76);
      extraction.position.copy(excerptCurve.getPointAt(lift));
      extraction.ink(b === 2 ? 1 - ramp(p, 0.8, 1) : 0);
      extractedGuide.ink(b === 2 ? 0.85 : 0);
      activationGuide.ink(b === 4 ? 0.9 : 0);
      copyPacket(t, 4, 0.04, 0.63);
      readPacket(t, 4, 0.63, 0.89);
      allowed(t, 3);
      withheld(t, 3, 0, 0.57);
      incoming(t, 5, 0, 0.48);
      refusal(t, 5, 0.48, 0.8);
      stopped.ink(b === 5 ? ramp(p, 0.4, 0.7) : 0);
      comparison.ink(b === 5 ? 1 : 0);
      snapshot.ink(
        b === 4 ? ramp(p, 0.23, 0.89) : overview || b === 5 ? 1 : 0.32,
      );
      filter.ink(b === 3 ? 1.2 : 0.73);
      gateway.ink(0);
    },
  };
}
