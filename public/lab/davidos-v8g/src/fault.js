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
import { booking, runs, faultFrame, ramp } from "./story.js";
const bytes = (text) => new TextEncoder().encode(text);
export function fault(m) {
  const s = sculpt(m),
    request = [
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
  s.part((d) => {
    cable(d, request, 24, 0.18, -0.65);
    cable(d, response.slice(0, 4), 24, 0.16, -0.68);
    cable(d, response.slice(4), 24, 0.16, -0.68);
    for (let f = 0; f < 5; f++) {
      const h = 1.44 - f * 0.59;
      d.line([-9.8, h, 0], [-8.94, h, 0], -0.7);
      cable(
        d,
        [
          [-8.95, h, 0],
          [-8.37, h, 0.12],
          [-7.64, h * 0.28, 0.25],
          [-7.1, 0, 0.3],
        ],
        9,
        0.048,
        f === 4 ? 0.76 : -0.6,
      );
    }
    for (let i = 0; i < 4; i++)
      ring(d, -3.55, 1.28, -0.96 + i * 0.04, 0.08, 0.3, -0.64, -0.18);
  });
  const visitHead = s.part((d) => {
    cable(
      d,
      [
        [2.05, 0.55, -0.18],
        [2.48, 1.18, -0.28],
        [2.52, 1.88, -0.14],
        [2.65, 2.13, 0],
      ],
      13,
      0.089,
      -0.71,
    );
    for (const cx of columns)
      d.line([x + cx, y, 0.1], [x + cx, y - 0.48, 0.18], -0.65);
    d.line([x, y, 0.1], [x + 7.37, y, 0.1], -0.9);
  });
  const seam = s.part((d) => cable(d, response.slice(3, 5), 24, 0.16, -0.65));
  const fray = s.part((d) =>
    cable(
      d,
      [
        [-0.96, -0.95, 1.05],
        [-1.48, -0.97, 1.08],
        [-1.85, -0.97, 1.1],
        [-2.14, -0.97, 1.1],
      ],
      26,
      0.12,
      0.92,
      { twist: 0.32, fray: 2.55 },
    ),
  );
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
  const log = runs[4].trace.map((_, i) =>
    s.part(
      (d) => {
        const left = -6.9,
          fields = [0, 1.95, 3.4, 5.1, 9.1, 14.5];
        d.line([left, 0, 0], [left + 14.5, 0, 0], -0.49);
        fields.forEach((x) =>
          d.line([left + x, 0, 0], [left + x, 0.18, -0.05], -0.62),
        );
      },
      [0, -2.04 - i * 0.315, 0.65 + i * 0.09],
    ),
  );
  const outbound = packet(s, request, 28, 0.19),
    reply = packet(s, response, 24, 0.15),
    lost = packet(s, response.slice(0, 4), 24, 0.15),
    beam = packet(s, lookup, 25, 0.105);
  const w = s.words;
  w([-8.6, 1.49, 0], "Client", [0], [0, -18]);
  w([-3.55, 1.62, -1], "Request · before commit", [0, 1], [0, -18]);
  w([2.09, 0.61, -0.1], "receive · baseline / fixed", [0], [0, 19]);
  w([6, 2.69, 0.1], "Visits · fixed commit", [0], [0, -20]);
  w([7.5, -0.66, 0.65], "Receipts · fixed only", [0], [0, 21]);
  w([-2.55, -0.85, 1.14], "Reply · after commit", [0, 2], [0, -10]);
  w([-6.9, -1.7, 0.88], "Trace", [0], [-36, -6]);
  w([-7.3, -0.2, 0.37], "observedId · null", [2], [0, 20], "signal");
  w([-4.8, 1.3, -0.8], "POST /visits", [1, 3], [0, -20], "signal");
  w([2.05, 0.63, -0.15], "receive", [1, 3, 4], [0, 20]);
  w([6.25, 2.66, 0.15], "Visits", [1, 2, 3, 4, 5], [0, -17]);
  w([4, -0.53, 0.65], "WORK-318", [0, 1, 4, 5], [-10, 22], "signal");
  w([8.85, -0.64, 0.6], "VIS-742", [0, 1, 4], [0, 21], "signal");
  w([7.15, 0.42, 0.63], "Stored · " + booking.slot, [5], [0, -16]);
  w([7.15, -1.06, 0.63], "Incoming · 11:00–11:30", [5], [0, 17], "signal");
  w([7.04, 0.24, 0.65], "Payload fingerprint", [1, 4], [0, -13], "unit");
  const compareBits = s.part(
    (d) => {
      incoming.forEach((byte, i) => {
        if (byte !== stored[i]) {
          const xx = i * 0.072;
          d.path(
            [
              [xx, -0.01, 0],
              [xx, -0.08, 0],
              [xx + 0.069, -0.08, 0],
              [xx + 0.069, -0.01, 0],
            ],
            1,
          );
          for (let b = 0; b < 8; b++)
            if (((byte ^ stored[i]) & (1 << (7 - b))) !== 0)
              d.quad(
                [xx, b * 0.064, 0],
                [xx + 0.061, b * 0.064, 0],
                [xx + 0.061, b * 0.064 + 0.043, 0],
                [xx, b * 0.064 + 0.043, 0],
                1,
              );
        }
      });
    },
    [5, -1.03, 0.65],
  );
  const fields = ["id", "key", "operation", "service", "slot", "location"];
  const values = [];
  fields.forEach((key, j) => {
    const xx = x + (columns[j] + columns[j + 1]) / 2;
    w([xx, y - 0.18, 0.13], key, [0, 1, 2, 3, 4, 5], [0, 0], "cell head");
    for (let i = 0; i < 2; i++) {
      const v = w(
        [xx, y - 0.73 - i * 0.55, 0.24],
        runs[2].visits[i][key],
        [0, 1, 2, 3, 4, 5],
        [0, 0],
        "cell" + (i ? " signal" : ""),
      );
      v.cellWidth = columns[j + 1] - columns[j] - 0.06;
      values.push({ v, i, xx });
    }
  });
  const clientVals = Object.entries(booking)
    .map(([k, v]) => k + " · " + v)
    .concat("Idempotency-Key · " + booking.operation);
  clientVals.forEach((v, j) =>
    w([-9.1, 1.45 - j * 0.59, 0.05], v, [1], [0, -5], "unit"),
  );
  const traceColumns = ["sequence", "attempt", "kind", "title", "detail"];
  const traceStops = [-6.9, -4.95, -3.5, -1.8, 2.2, 7.6];
  const traceField = (j, y, z, text, beats) => {
    const note = w(
      [traceStops[j] + 0.05, y, z],
      text,
      beats,
      [0, 0],
      "cell log-cell",
    );
    note.extent = traceStops[j + 1] - traceStops[j] - 0.11;
    return note;
  };
  traceColumns.forEach((name, j) =>
    traceField(j, -1.61, 0.64, name, [0, 1, 2]),
  );
  const traceNotes = log.map((_, i) =>
    traceColumns.map((key, j) =>
      traceField(j, -1.93 - i * 0.315, 0.68 + i * 0.09, "", [0, 1, 2]),
    ),
  );
  const ends = [
    [],
    [2.7, 2.12, 0.2],
    [-2.16, -0.98, 1.08],
    [5.9, 1.1, 0.37],
    lookup.at(-1),
    [7.24, -0.52, 0.63],
  ];
  return {
    ...s,
    endpoints: ends,
    update(t, closing = 0) {
      const b = sceneBeat(t),
        p = stage(t, b),
        f = b === 0 ? faultFrame(1, 1) : faultFrame(b, p);
      const preview = 1 - ramp(t, 0.45, 0.67);
      const drop = weight(t, 2) * ramp(stage(t, 2), 0.16, 0.7);
      seam.ink(1 - drop);
      fray.ink(drop);
      const write = Math.max(
        preview,
        ramp(t, 0.45 + 0.55 * 0.28, 0.45 + 0.55 * 0.58),
      );
      const ledgerInFrame = ramp(t, -0.62, -0.28);
      visitHead.ink(ledgerInFrame * (1 - closing));
      rows[0].ink(ledgerInFrame * write * (1 - closing));
      const insert = weight(t, 3) * ramp(stage(t, 3), 0.34, 0.68);
      rows[1].ink(insert);
      rows[1].position.x = x - (1 - insert) * 1.45;
      map.ink(ledgerInFrame * (1 - weight(t, 3)) * write);
      compare.ink(weight(t, 5) * ramp(p, 0, 0.41));
      compareBits.ink(weight(t, 5) * ramp(p, 0.05, 0.35));
      values.forEach(({ v, i, xx }) => {
        v.amount = i ? insert : write;
        v.position[0] = xx + (i ? rows[1].position.x - x : 0);
      });
      litJoin.ink(weight(t, 4) * ramp(stage(t, 4), 0.35, 0.85));
      const trace = f.trace;
      const gates = [0, 0.28, 0.46, 0, 0.34, 0.7, 0, 0.7];
      log.forEach((l, i) => {
        const previous = b === 5 ? 6 : b >= 3 ? 3 : b === 2 ? 2 : 0;
        const opacity =
          b === 0
            ? i < 2
              ? preview
              : 0
            : i < previous
              ? 0.79
              : i < trace.length
                ? 0.08 + 0.71 * ramp(p, gates[i], gates[i] + 0.28)
                : 0;
        l.ink(ledgerInFrame * opacity * (1 - ramp(t, 2.45, 2.69)));
        traceNotes[i].forEach((n, j) => {
          const event = trace[i];
          n.amount = event ? ledgerInFrame * opacity : 0;
          if (event) {
            const value = String(event[traceColumns[j]]);
            if (value !== n.el.textContent) n.el.textContent = value;
          }
        });
      });
      outbound(b === 1 || b >= 3 ? Math.min(1, p * 1.85) : 0);
      reply(b === 3 || b === 4 ? Math.max(0, (p - 0.56) / 0.44) : 0);
      lost(b === 2 ? Math.min(1, p * 1.3) : 0);
      beam(
        b === 4
          ? ramp(p, 0.15, 0.68)
          : b === 5
            ? ramp(p, 0, 0.45) * 0.32 * (1 - ramp(p, 0.45, 0.65))
            : 0,
        Math.max(weight(t, 4), weight(t, 5) * (1 - ramp(p, 0.4, 0.64))),
      );
    },
  };
}
