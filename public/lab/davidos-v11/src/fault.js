import {
  sculpt,
  box,
  cable,
  packet,
  stage,
  sceneBeat,
  weight,
  ring,
} from "./strands.js";
import { booking, runs, faultFrame, landing, ramp } from "./story.js";
const bytes = (text) => new TextEncoder().encode(text);
export function fault(m) {
  const s = sculpt(m),
    request = [
      [-8.95, 0, 0],
      [-8.38, 0, 0],
      [-7.64, -0.04, 0.18],
      [-7.1, 0, 0.3],
      [-5.4, 0.9, -0.32],
      [-3.5, 1.29, -1],
      [-0.8, 1.32, -1.05],
      [0.68, 0.78, -0.6],
      [2.05, 0.55, -0.18],
    ];
  const response = [
    [2.05, 0.35, 0],
    [0.85, -0.48, 0.67],
    [-0.95, -0.95, 1.05],
    [-2.13, -0.97, 1.1],
    [-3.02, -0.97, 1.1],
    [-4.9, -0.8, 0.94],
    [-7.1, -0.08, 0.3],
  ];
  const columns = [0, 1.09, 2.17, 3.36, 4.71, 6.01, 7.37],
    x = 2.33,
    y = 2.64;
  const lookup = [
    [2.05, 0.55, -0.1],
    [2.75, 0.13, 0.4],
    [3.44, -0.48, 0.57],
    [4.55, -0.6, 0.57],
    [5.73, -0.6, 0.57],
    [8.65, -0.6, 0.5],
  ];
  const clientLink = s.part((d) => {
    cable(d, request, 25, 0.18, -0.65, { inlets: true });

    for (let f = 0; f < 5; f++) {
      const h = 1.44 - f * 0.59;
      d.line([-9.8, h, 0], [-8.94, h, 0], -0.7);
    }
    ring(d, -3.55, 1.28, -0.91, 0.08, 0.3, -0.64, -0.18);
  });
  const writePath = [
    request.at(-1),
    [2.3, 0.57, -0.13],
    [2.48, 1.18, -0.28],
    [2.52, 1.88, -0.14],
    [2.65, 2.13, 0],
  ];
  const visitHead = s.part((d) => {
    cable(d, writePath, 15, 0.089, -0.71);
    for (const cx of columns)
      d.line([x + cx, y, 0.1], [x + cx, y - 0.48, 0.18], -0.65);
    d.line([x, y, 0.1], [x + 7.37, y, 0.1], -0.9);
  });
  const completeReply = s.part((d) => cable(d, response, 24, 0.16, -0.68));
  const brokenReply = s.part((d) => {
    cable(d, response.slice(0, 4), 24, 0.16, -0.68, { fray: 1 });
    cable(d, response.slice(4), 24, 0.16, -0.68);
  });
  const rows = [0, 1].map((i) =>
    s.part(
      (d) => {
        for (const cx of columns) d.line([cx, 0, 0], [cx, -0.55, 0.13], -0.7);
        for (let j = 0; j < 2; j++)
          d.line(
            [0, -0.55, -j * 0.07],
            [7.37, -0.55, -j * 0.07],
            i ? 0.85 : -0.7,
          );
        for (let k = 0; k < 6; k++) {
          const a = columns[k] + 0.05,
            b = columns[k + 1] - 0.05;
          d.quad(
            [a, 0, 0],
            [b, 0, 0],
            [b, -0.55, 0.13],
            [a, -0.55, 0.13],
            i ? 0.12 : -0.08,
          );
        }
      },
      [x, y - 0.48 - i * 0.55, 0.17],
    ),
  );
  const fp = runs[3].receipts[booking.operation].fingerprint;
  const candidate = JSON.stringify([
    booking.operation,
    booking.service,
    "11:00–11:30",
    booking.location,
  ]);
  const stored = bytes(fp),
    incoming = bytes(candidate);
  function stripes(d, b, compare, origin = [0, 0, 0]) {
    b.forEach((byte, col) => {
      for (let bit = 0; bit < 8; bit++) {
        const flag = 1 << (7 - bit),
          v = (byte & flag) !== 0,
          changed = compare && ((byte ^ stored[col]) & flag) !== 0;
        const xx = origin[0] + col * 0.072,
          yy = origin[1] + bit * 0.064;
        d.line(
          [xx, yy, origin[2] + 0.02],
          [xx + (v ? 0.06 : 0.019), yy, origin[2] + 0.02],
          changed ? 1 : v ? 0.76 : -0.36,
        );
        if (changed) d.line([xx, yy - 0.036, 0.02], [xx, yy + 0.036, 0.02], 1);
      }
    });
  }
  const map = s.part((d) => {
    cable(d, lookup, 16, 0.082, -0.72);
    for (let j = 0; j < 2; j++)
      ring(d, 3.64, -0.57, 0.6 + j * 0.05, 0.38, 0.22, j === 0 ? 0.9 : -0.5);
    d.path(
      [
        [5, -0.41, 0.55],
        [5, -0.27, 0.55],
        [9.35, -0.27, 0.55],
      ],
      -0.68,
    );
    stripes(d, stored, false, [5, -0.15, 0.57]);
  });
  const litJoin = s.part((d) => cable(d, lookup, 19, 0.082, 0.97));
  const compare = s.part((d) => stripes(d, incoming, true), [5, -1.03, 0.59]);
  const outbound = packet(s, request, 25, 0.18, {
      inlets: true,
      flights: [
        [1, 0, 0.54],
        [3, 0, 0.38],
        [4, 0, 0.38],
        [5, 0, 0.38],
      ],
    }),
    commit = packet(s, writePath, 15, 0.089, {
      flights: [
        [1, 0.54, landing.commit],
        [3, 0.38, landing.duplicate],
      ],
    }),
    reply = packet(s, response, 24, 0.16, {
      flights: [
        [3, landing.duplicate, landing.reply],
        [4, landing.lookup, landing.reply],
        [5, landing.lookup, landing.conflict],
      ],
    }),
    lost = packet(s, response.slice(0, 4), 24, 0.16, { fray: 1 }),
    beam = packet(s, lookup, 21, 0.085, {
      flights: [
        [1, 0.54, landing.commit],
        [4, 0.38, landing.lookup],
        [5, 0.38, landing.lookup],
      ],
    });
  return {
    group: s.group,
    pulses: [
      [request, 25, 0.18, { inlets: true }],
      [response.slice(0, 4), 24, 0.16, { fray: 1 }],
    ],
    update(t, b, p) {
      const f = faultFrame(b || 1, b ? p : 1),
        drop = b === 2 ? ramp(p, 0.3, landing.lost) : !b || b >= 3 ? 1 : 0;
      completeReply.ink(1 - drop);
      brokenReply.ink(drop);
      visitHead.ink(1);
      rows.forEach((row, i) => row.ink(f.visits[i] ? 1 : 0));
      rows[1].position.x = x - (1 - ramp(p, landing.duplicate, 0.9)) * 0.75;
      map.ink(f.receipts.length ? 1 : 0);
      compare.ink(b === 5 ? ramp(p, 0, 0.45) : 0);
      litJoin.ink(b === 4 ? ramp(p, landing.lookup, 0.9) : 0);
      outbound(t);
      commit(t);
      beam(t);
      lost(t, 2, 0, landing.lost);
      reply(t);
    },
  };
}
