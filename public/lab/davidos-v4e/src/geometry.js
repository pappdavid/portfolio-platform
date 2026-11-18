// Each row is one continuous strand. A row keeps its identity across all five drawings.
export const STRANDS = 2048;
export const KNOTS = 25;
const TAU = Math.PI * 2;
const mix = (a, b, t) => a + (b - a) * t;
const between = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t)];
const frac = (x) => x - Math.floor(x);
function path(points, t) {
  const p = Math.min(t, 0.999999) * (points.length - 1),
    i = Math.floor(p);
  return between(points[i], points[i + 1], p - i);
}
const glyphs = [
  [
    [
      [0, 0],
      [0.65, 0],
      [1, 0.28],
      [1, 0.76],
      [0.69, 1],
      [0, 1],
    ],
    [
      [0.3, 0.23],
      [0.58, 0.23],
      [0.7, 0.34],
      [0.7, 0.65],
      [0.56, 0.77],
      [0.3, 0.77],
    ],
  ],
  [
    [
      [0, 0],
      [0.3, 0],
      [0.36, 0.23],
      [0.68, 0.23],
      [0.74, 0],
      [1.04, 0],
      [0.76, 1],
      [0.28, 1],
    ],
    [
      [0.42, 0.45],
      [0.62, 0.45],
      [0.52, 0.78],
    ],
  ],
  [
    [
      [0, 1],
      [0.33, 1],
      [0.53, 0.31],
      [0.73, 1],
      [1.06, 1],
      [0.74, 0],
      [0.32, 0],
    ],
  ],
  [
    [
      [0, 0],
      [0.76, 0],
      [0.76, 0.23],
      [0.54, 0.23],
      [0.54, 0.77],
      [0.76, 0.77],
      [0.76, 1],
      [0, 1],
      [0, 0.77],
      [0.23, 0.77],
      [0.23, 0.23],
      [0, 0.23],
    ],
  ],
];
glyphs.push(glyphs[0]);
const offsets = [0, 1.16, 2.33, 3.53, 4.45];
function signature(i, t, r, s) {
  if (i >= 1290) return cloth(i - 1290, t, r, s, false);
  const k = i % 5,
    loops = glyphs[k],
    j = Math.floor(i / 5);
  const project = (x, y, d) => {
    const u = (x + offsets[k] - 2.73) * 0.335;
    return [u + 0.132 * d + 0.035 * y, 0.07 + 0.445 * y - 0.21 * u + 0.115 * d];
  };
  if (j < 126) {
    const y = (j + 0.45) / 126,
      hits = [];
    for (const ring of loops)
      for (let h = 0; h < ring.length; h++) {
        const a = ring[h],
          b = ring[(h + 1) % ring.length];
        if (a[1] > y !== b[1] > y)
          hits.push(mix(a[0], b[0], (y - a[1]) / (b[1] - a[1])));
      }
    hits.sort((a, b) => a - b);
    const n = hits.length === 4 && j % 2 ? 2 : 0;
    return [...project(mix(hits[n], hits[n + 1], t), y, 0), 0.65 + 0.29 * r, 0];
  }
  const ring = loops[j % 4 === 0 && loops.length > 1 ? 1 : 0];
  const q = (j - 126) / 132;
  const pp = [...ring, ring[0]];
  if (j % 4 === 0) {
    const p = path(pp, t);
    return [...project(...p, q), 0.16 + 0.2 * (1 - q), 0];
  }
  const p = path(pp, frac(j * 0.61803399));
  return [...project(...p, t), 0.27 + 0.34 * s, 0];
}
function cloth(i, t, r, s, horizon) {
  // Warp and weft share one height field, with a sparse cross-grain.
  const cross = i % 7 === 0,
    u = cross ? r : t,
    v = cross ? t : frac(i * 0.61803399);
  const x = (u - 0.5) * 2.16 + (v - 0.5) * 0.32;
  const hill =
    0.19 * Math.sin(6.5 * u + 3.8 * v) +
    0.1 * Math.cos(8 * u - 5 * v) +
    0.08 * Math.sin(12 * u + v);
  const y =
    (horizon ? -0.06 : -0.41) +
    (v - 0.5) * (horizon ? 0.72 : 0.58) +
    hill * (horizon ? 0.8 : 0.58) -
    x * 0.095;
  const ink =
    (cross ? 0.15 : 0.032) +
    0.15 * (0.5 + 0.5 * Math.sin(9 * u + 3 * v)) +
    0.036 * s;
  return [x, y, ink, 9];
}
function rect(x, y, w, h, t, slant = 0.09) {
  const p = path(
    [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
      [0, 0],
    ],
    t,
  );
  return [x + p[0] + p[1] * slant, y + p[1] - p[0] * 0.14];
}
function sheet(x, y, w, h, i, t, r, s, lit = false) {
  const base = lit ? 0.63 : -0.48;
  const depth = (i % 3) * 0.014;
  if (i % 11 < 3)
    return [...rect(x + depth, y + depth, w, h, t, 0.12), base, 0];
  if (i % 11 < 5)
    return [
      x + 0.12 * h * t + w * r,
      y + h * t - w * r * 0.14,
      lit ? 0.074 : -0.052,
      0,
    ];
  const row = i % 9,
    top = h * (0.12 + row * 0.093),
    len = w * (0.5 + 0.31 * frac(row * 0.63));
  const u = 0.035 + t * len;
  return [
    x + u + top * 0.12,
    y + top - 0.14 * u + (s - 0.5) * 0.0035,
    lit ? 0.66 : -0.55,
    0,
  ];
}
function studio(i, t, r, s) {
  if (i < 600) return sheet(-0.99, -0.26, 0.46, 0.75, i, t, r, s);
  if (i < 1230) {
    const g = i % 3,
      x = -0.27 + g * 0.35,
      h = 0.56,
      z = 0.135;
    const p = path(
      [
        [x, -0.22],
        [x, h - 0.22],
        [x + z, h - 0.11],
        [x + z, -0.11],
        [x, -0.22],
      ],
      t,
    );
    const off = (i % 7 === 0 ? r : Math.round(r)) * 0.026;
    return [p[0] + off, p[1] - off * 0.35, -0.43, 2 + g];
  }
  if (i < 1500) return sheet(0.74, -0.22, 0.22, 0.34, i, t, r, s, true);
  if (i < 1730) {
    const y = -0.015 + 0.038 * r;
    return [-0.94 + 0.32 * t, y - 0.045 * t, 0.72 + 0.21 * s, 1];
  }
  // A warp running through the apertures, each thread slightly displaced in depth.
  return [
    mix(-0.55, 0.88, t),
    -0.115 + 0.095 * r + 0.035 * Math.sin(TAU * t + r * 2),
    0.08 + 0.12 * s,
    0,
  ];
}
function tether(i, t, r, s) {
  const row = i % 4,
    from = 0.39 - 0.235 * row,
    dest = 0.385 - row * 0.252;
  const length = 0.34 + 0.115 * frac(row * 0.722),
    end = -0.96 + length;
  if (i < 640) {
    const n = Math.floor(i / 4) % 3;
    return [
      -0.96 + (length - (n === 1 ? 0.085 : 0)) * t,
      from - 0.038 * n - 0.056 * t + 0.003 * r,
      n === 0 ? 0.55 : -0.48,
      5,
    ];
  }
  if (i < 1360) {
    const x = mix(end, 0.36, t),
      ease = t * t * (3 - 2 * t);
    return [
      x,
      mix(from - 0.056, dest + 0.018, ease) +
        (0.07 + 0.04 * row) * Math.sin(Math.PI * 2 * t) +
        0.034 * (r - 0.5) * Math.sin(Math.PI * t),
      0.18 + 0.29 * s,
      0,
    ];
  }
  const j = Math.floor(i / 4);
  if (j % 8 >= 3) {
    const n = j % 3;
    return [
      0.39 + t * (0.3 - 0.057 * n),
      dest + 0.048 - 0.037 * n - 0.034 * t + r * 0.003,
      n === 0 ? 0.67 : -0.51,
      6,
    ];
  }
  const off = 0.016 * (j % 2);
  const p = rect(0.35 + off, dest - 0.085 + off, 0.5, 0.174, t, 0.13);
  return [p[0], p[1], 0.42 + 0.22 * s, 6];
}
const lanes = [0.33, 0.11, -0.14, -0.36];
function retry(i, t, r, s) {
  if (i < 370) {
    // An outgoing queue, drawn in profile as a stack of envelopes.
    const n = i % 4,
      x = -0.97 + 0.012 * n,
      y = -0.31 + 0.126 * n;
    if (Math.floor(i / 4) % 3 === 0)
      return [
        ...path(
          [
            [x, y + 0.14],
            [x + 0.122, y + 0.027],
            [x + 0.245, y + 0.106],
          ],
          t,
        ),
        -0.46,
        0,
      ];
    return [...rect(x, y, 0.245, 0.14, t, 0.12), -0.54, 0];
  }
  if (i < 740) {
    // Receiver vault: elliptical rims, a ruled cylinder, then its saved receipt.
    if (i % 3 === 0) {
      const a = r * TAU;
      return [
        0.8 + 0.16 * Math.cos(a),
        -0.28 + 0.48 * t + 0.041 * Math.sin(a),
        -0.24,
        0,
      ];
    }
    const level = i % 5;
    return [
      0.8 + 0.16 * Math.cos(TAU * t),
      -0.28 + 0.12 * level + 0.041 * Math.sin(TAU * t),
      -0.58,
      0,
    ];
  }
  if (i < 940) return sheet(0.62, 0.23, 0.28, 0.2, i, t, r, s, true);
  const lane = i % 4,
    dir = lane === 0 || lane === 2 ? 1 : -1;
  const a = dir > 0 ? -0.66 : 0.59,
    b = dir > 0 ? 0.59 : lane === 1 ? -0.055 : -0.66;
  if (i < 1630) {
    if (lane === 1 && Math.floor(i / 4) % 9 === 0) {
      return [
        -0.13 + 0.09 * t,
        0.108 + (Math.floor(i / 4) % 2 ? 1 : -1) * 0.092 * (t - 0.5),
        0.72,
        11,
      ];
    }
    return [
      mix(a, b, t),
      lanes[lane] + 0.037 * Math.sin(Math.PI * t) + (r - 0.5) * 0.014,
      -0.17,
      10 + lane,
    ];
  }
  if (i < 1790) {
    const p = rect(0.7, 0.48, 0.27, 0.17, t, 0.12);
    return [p[0], p[1], 0.72, 14];
  }
  // A small, tapered bundle points in the direction of the current delivery.
  const v = (i - 1790) % 5;
  return [
    a + dir * 0.115 * t,
    lanes[lane] + (v - 2) * 0.013 * (1 - t),
    0.93,
    15 + lane,
  ];
}
export function makeDrawings() {
  const count = STRANDS * KNOTS,
    sheets = Array.from({ length: 5 }, () => new Float32Array(count * 4));
  for (let i = 0; i < STRANDS; i++) {
    const r = frac((i + 1) * 0.61803398875),
      s = frac((i + 1) * 0.754877666);
    for (let n = 0; n < KNOTS; n++) {
      const t = n / (KNOTS - 1),
        j = (i * KNOTS + n) * 4;
      sheets[0].set(signature(i, t, r, s), j);
      sheets[1].set(studio(i, t, r, s), j);
      sheets[2].set(tether(i, t, r, s), j);
      sheets[3].set(retry(i, t, r, s), j);
      sheets[4].set(cloth(i, t, r, s, true), j);
    }
  }
  return sheets;
}
