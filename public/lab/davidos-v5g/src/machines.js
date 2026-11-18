import { Drawing, base, tau, lerp } from "./drawing.js";
import { clamp, ease, runs } from "./story.js";
import * as T from "../vendor/three.module.min.js";
const glyphs = [
  [
    [
      [0, 0],
      [0.67, 0],
      [1, 0.28],
      [1, 0.72],
      [0.72, 1],
      [0, 1],
    ],
    [
      [0.29, 0.24],
      [0.56, 0.24],
      [0.71, 0.37],
      [0.71, 0.62],
      [0.56, 0.76],
      [0.29, 0.76],
    ],
  ],
  [
    [
      [0, 0],
      [0.29, 0],
      [0.36, 0.25],
      [0.67, 0.25],
      [0.75, 0],
      [1.05, 0],
      [0.77, 1],
      [0.28, 1],
    ],
    [
      [0.42, 0.46],
      [0.62, 0.46],
      [0.52, 0.77],
    ],
  ],
  [
    [
      [0, 1],
      [0.31, 1],
      [0.53, 0.29],
      [0.73, 1],
      [1.04, 1],
      [0.74, 0],
      [0.3, 0],
    ],
  ],
  [
    [
      [0, 0],
      [0.73, 0],
      [0.73, 0.22],
      [0.51, 0.22],
      [0.51, 0.78],
      [0.73, 0.78],
      [0.73, 1],
      [0, 1],
      [0, 0.78],
      [0.22, 0.78],
      [0.22, 0.22],
      [0, 0.22],
    ],
  ],
];
glyphs.push(glyphs[0]);
function glyph(k) {
  const g = new Drawing(),
    rings = glyphs[k],
    ox = [0, 1.16, 2.35, 3.53, 4.44][k];
  const point = ([x, y], z) => [(x + ox - 2.73) * 1.84, y * 2.83, z];
  const contours = rings.map((r) => r.map((p) => new T.Vector2(...p)));
  const triangles = T.ShapeUtils.triangulateShape(
    contours[0],
    contours.slice(1),
  );
  const flat = rings.flat();
  for (const z of [-0.4, 0.4])
    for (const ids of triangles)
      g.triangle(...ids.map((i) => point(flat[i], z)), 0.17);
  rings.forEach((r) => {
    for (let j = 0; j < r.length; j++) {
      const a = r[j],
        b = r[(j + 1) % r.length];
      g.quad(
        point(a, -0.4),
        point(b, -0.4),
        point(b, 0.4),
        point(a, 0.4),
        0.09,
      );
      for (let n = 0; n < 16; n++) {
        const z = lerp(-0.4, 0.4, n / 15);
        g.line(point(a, z), point(b, z), n % 5 === 0 ? 0.63 : 0.32);
      }
      const steps = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * 46);
      for (let n = 0; n < steps; n++) {
        const p = [lerp(a[0], b[0], n / steps), lerp(a[1], b[1], n / steps)];
        g.line(point(p, -0.4), point(p, 0.4), 0.44);
      }
    }
  });
  // Section cuts across both the silhouette and its counters.
  for (let row = 0; row < 134; row++) {
    const y = (row + 0.5) / 134,
      hits = [];
    rings.forEach((r) =>
      r.forEach((a, j) => {
        const b = r[(j + 1) % r.length];
        if (a[1] > y !== b[1] > y)
          hits.push(lerp(a[0], b[0], (y - a[1]) / (b[1] - a[1])));
      }),
    );
    hits.sort((a, b) => a - b);
    for (let i = 0; i < hits.length; i += 2)
      g.line(
        point([hits[i], y], 0.402),
        point([hits[i + 1], y], 0.402),
        row % 7 === 0 ? 1 : 0.95,
      );
  }
  return g;
}
export function mark(m) {
  const g = new Drawing();
  base(g, 11.8, 4.7);
  for (let k = 0; k < 5; k++) {
    const x = [-4.2, -2.0, 0.16, 2.1, 3.98][k];
    g.deck(x, 0.95, -0.1, 1.18, 0.25, 1.45, -0.53);
    // Ribbon looms feed the individual glyphs from a common bus.
    for (let n = 0; n < 30; n++) {
      const f = (n - 14.5) / 29;
      g.deck(x + f * 0.97, 1.21, -0.1, 0.017, 0.62, 1.03, -0.36, -0.12, 0.005);
      const points = [
        [-6.8, 0.22 + f * 0.46, 3.85 + f * 0.6],
        [-4.3, 0.78 + f * 0.63, 3.66 + f * 0.36],
        [-2.1 + k * 0.55, 1.36 + f * 0.72, 2.98 + f * 0.51],
        [x + 0.26 + f * 0.67, 1.22 + 0.35 * Math.cos(f * 4), 1.95 + f * 0.82],
        [x + f * 1.42, 1.47, 0.94],
        [x + f * 1.42, 2.02, 0.23],
      ];
      g.tube(points, 1, 0, n % 6 === 0 ? 0.95 : 0.46 + 0.16 * Math.cos(f * 4));
    }
  }
  const group = g.build(m),
    formation = { value: 1 },
    weave = {};
  for (const key of ["line", "face"]) {
    const material = m[key].clone();
    material.uniforms = { ...m.uniforms, formation };
    material.vertexShader =
      "uniform float formation;\n" +
      material.vertexShader.replace(
        "modelViewMatrix*vec4(position,1.)",
        `modelViewMatrix*vec4(mix(vec3(position.x*.68-1.12,-.65+.14*sin(position.x*1.4+position.y),1.72+.42*sin(position.x*.68+position.z)),position,smoothstep(0.,.63,formation*1.49-(position.x+5.1)*.06-position.y*.06)),1.)`,
      );
    weave[key] = material;
  }
  glyphs.forEach((_, k) => {
    const o = glyph(k).build(weave);
    o.position.set(0, 1.91, 0.15);
    group.add(o);
  });
  return {
    group,
    update: (t, intro) => {
      formation.value = intro;
    },
  };
}
function leaf(g, x, y, z, w, d, tone = -0.44) {
  g.deck(x, y, z, w, 0.048, d, tone, -0.12, 0.07);
  for (let j = 0; j < 11; j++) {
    const v = z - d * 0.36 + j * d * 0.07,
      len = (j % 4 === 2 ? 0.48 : 0.77) * w;
    g.line(
      [x - w * 0.39, y + 0.052, v],
      [x - w * 0.39 + len, y + 0.052, v],
      j === 2 ? tone : -0.31,
    );
  }
}
function portal(g, x, y, z, w, h, tone) {
  for (const v of [-1, 1]) {
    g.deck(x, y, z + (v * w) / 2, 0.36, h, 0.27, tone, -0.09, 0.045);
    for (let j = 0; j < 13; j++)
      g.line(
        [x - 0.18, y + 0.17 + j * h * 0.065, z + (v * w) / 2 + 0.14],
        [x + 0.18, y + 0.17 + j * h * 0.065, z + (v * w) / 2 + 0.14],
        -0.29,
      );
  }
  g.deck(x, y + h, z, 0.5, 0.26, w + 0.45, tone, -0.14, 0.09);
}
function linearRail(g, x1, x2, z, y) {
  for (const o of [-0.46, 0.46])
    g.deck((x1 + x2) / 2, y, z + o, x2 - x1, 0.14, 0.13, -0.52, -0.14, 0.03);
  for (let k = 0; k < 60; k++) {
    const x = lerp(x1, x2, k / 59);
    g.line(
      [x, y + 0.16, z - 0.47],
      [x, y + 0.16, z + 0.47],
      k % 6 === 0 ? -0.47 : -0.16,
    );
  }
}
function packet(m, wide = 1.25) {
  const g = new Drawing();
  g.deck(0, 0, 0, wide, 0.12, 0.87, 0.99, 0.34, 0.095);
  for (let j = 0; j < 9; j++)
    g.line(
      [-wide * 0.36, 0.127, (j - 4) * 0.073],
      [wide * (j % 3 === 1 ? 0.13 : 0.36), 0.127, (j - 4) * 0.073],
      0.99,
    );
  return g.build(m);
}
const curveMotion = (points, t) => {
  const i = clamp(Math.floor(t), 0, points.length - 2),
    f = ease(t - i);
  return points[i].map((v, j) => lerp(v, points[i + 1][j], f));
};
export function studio(m) {
  const g = new Drawing();
  base(g);
  linearRail(g, -5, 5.15, 0.35, 1.25);
  for (let k = 0; k < 13; k++)
    leaf(
      g,
      -3.75 + k * 0.031,
      1.43 + k * 0.096,
      -0.32,
      2.55,
      2.52,
      k === 12 ? 0.55 : -0.43,
    );
  for (const x of [-0.8, 1.15])
    portal(g, x, 0.97, 0.07, 2.1, x < 0 ? 2.43 : 1.94, -0.55);
  // Fan of versioned source leaves behind the reading head.
  for (let j = 0; j < 24; j++) {
    const x = -2.66 + j * 0.073;
    g.deck(
      x,
      0.97,
      -1.45,
      0.035,
      1.17 + Math.sin(j * 0.13) * 0.34,
      0.75,
      -0.32,
      -0.055,
      0.014,
    );
  }
  g.deck(3.72, 1.0, -0.1, 2.33, 0.38, 2.22, -0.48);
  for (let j = 0; j < 6; j++) leaf(g, 3.75, 1.43 + j * 0.088, -0.1, 1.88, 1.66);
  g.tube(
    [
      [-4.6, 1, -1],
      [-2.7, 1.14, -1.9],
      [0.1, 1.86, -1.57],
      [2.4, 1, -1.72],
      [4.12, 1.2, -0.85],
    ],
    52,
    0.44,
    (j) => (j % 12 === 0 ? 0.54 : -0.29),
  );
  // A rear gantry suspends the press shoe over the snapshot bed.
  for (const x of [2.99, 4.42]) {
    g.deck(x, 0.95, -1.28, 0.24, 2.81, 0.3, -0.68, -0.15, 0.04);
    for (let k = 0; k < 23; k++)
      g.line(
        [x - 0.12, 1.25 + k * 0.1, -1.125],
        [x + 0.12, 1.25 + k * 0.1, -1.125],
        -0.43,
      );
    g.deck(x, 3.68, -0.56, 0.25, 0.2, 1.81, -0.66, -0.15, 0.04);
  }
  g.deck(3.71, 3.68, 0.26, 1.72, 0.2, 0.27, -0.67, -0.15);
  for (const x of [3.3, 4.1]) g.drum(x, 2.33, -0.07, 0.1, 1.38, -0.52);
  for (const x of [-4.4, -3.9, -3.4, -2.9])
    g.deck(x, 1.01, 1.18, 0.21, 0.3, 0.46, -0.42, -0.08);
  const group = g.build(m),
    payload = packet(m);
  group.add(payload);
  const press = new Drawing();
  press.deck(0, 0, 0, 1.52, 0.23, 1.48, -0.62, -0.16);
  for (let j = 0; j < 13; j++)
    press.line(
      [-0.66, 0.24, (j - 6) * 0.09],
      [0.66, 0.24, (j - 6) * 0.09],
      -0.48,
    );
  const head = press.build(m);
  group.add(head);
  const gate = new Drawing();
  for (let j = 0; j < 20; j++)
    gate.line(
      [0, 0, -0.86 + j * 0.09],
      [0, 1.29, -0.86 + j * 0.09],
      j % 4 === 0 ? 0.62 : 0.29,
    );
  const filter = gate.build(m);
  group.add(filter);
  const pos = [
    [-4.95, 1.6, 0.48],
    [-4.21, 2.75, -0.17],
    [-2.47, 3.05, 0.2],
    [0.72, 1.58, 0.32],
    [3.7, 2.06, -0.1],
    [2.61, 1.59, 0.53],
  ];
  return {
    group,
    payload,
    update(t) {
      payload.position.fromArray(curveMotion(pos, clamp(t, 0, 5)));
      head.position.set(3.7, 3.16 - 0.9 * ease(t - 3), -0.1);
      filter.position.set(1.15, 2.76 - ease(t - 2) * 1.32, 0.05);
    },
  };
}
export function companion(m) {
  const g = new Drawing();
  base(g);
  const spool = (x, r) => {
    g.deck(x, 0.95, -0.22, 1.36, 0.21, 2.55, -0.47);
    g.deck(x, 1.03, -0.94, 0.45, 1.34, 0.25, -0.54);
    g.drum(x, 2.46, -0.56, r, 0.93, -0.44, false);
    for (const z of [-0.68, 0.49]) {
      g.drum(x, 2.46, z, r * 1.12, 0.08, -0.53, false);
      for (const q of [0.28, 0.48, 0.81, 0.96])
        g.circle(x, 2.46, z + 0.085, r * q, -0.48, "xy");
    }
    for (let k = 0; k < 40; k++)
      g.circle(
        x,
        2.46,
        -0.53 + k * 0.023,
        r + 0.007,
        k % 5 === 0 ? 0.31 : -0.21,
        "xy",
      );
  };
  spool(-3.42, 1.24);
  spool(-0.67, 0.85);
  // The tape follows the tangent of the reels and twists into the card bed.
  g.tube(
    [
      [-4.75, 1.3, 0.05],
      [-4.57, 3.04, 0.06],
      [-3.5, 3.73, 0.06],
      [-1.38, 3.39, 0.03],
      [-0.52, 3.33, 0.05],
      [0.81, 2.44, 0.05],
      [2.45, 1.78, 0.15],
      [4.61, 1.68, 0.3],
    ],
    64,
    0.92,
    (j) => (j % 8 === 0 ? 0.73 : 0.35),
  );
  portal(g, 1.53, 0.96, 0, 1.7, 1.66, -0.55);
  for (let k = 0; k < 11; k++)
    leaf(g, 3.76 - 0.03 * k, 1.04 + k * 0.09, -0.08, 2.55, 2.0);
  const group = g.build(m),
    payload = packet(m, 1.06);
  group.add(payload);
  const spokes = [];
  for (const [x, r] of [
    [-3.42, 1.24],
    [-0.67, 0.85],
  ]) {
    const s = new Drawing();
    for (let n = 0; n < 6; n++) {
      const a = (n * tau) / 6;
      for (let j = 0; j < 22; j++) {
        const t = j / 21,
          angle = a + t * 0.47;
        s.line(
          [Math.cos(angle) * r * 0.48, Math.sin(angle) * r * 0.48, 0.002],
          [
            Math.cos(angle + 0.17) * r * 0.91,
            Math.sin(angle + 0.17) * r * 0.91,
            0.002,
          ],
          j % 5 === 0 ? -0.72 : -0.4,
        );
      }
      for (const offset of [-0.045, 0.045])
        s.line(
          [Math.cos(a + offset) * r * 0.29, Math.sin(a + offset) * r * 0.29, 0],
          [
            Math.cos(a + offset + 0.19) * r * 0.8,
            Math.sin(a + offset + 0.19) * r * 0.8,
            0,
          ],
          -0.71,
        );
    }
    s.circle(0, 0, 0, r * 0.17, 0.86, "xy");
    s.circle(0, 0, 0.002, r * 0.12, -0.64, "xy");
    const o = s.build(m);
    o.position.set(x, 2.46, 0.582);
    group.add(o);
    spokes.push(o);
  }
  const pos = [
    [-4.68, 2.9, 0.3],
    [-3.44, 3.84, 0.13],
    [-1.72, 3.55, 0.12],
    [1.17, 2.53, 0.12],
    [3.49, 2.36, 0.06],
    [4.46, 2.2, 0.1],
  ];
  return {
    group,
    payload,
    update(t) {
      payload.position.fromArray(curveMotion(pos, clamp(t, 0, 5)));
      spokes.forEach((s, i) => (s.rotation.z = -t * (i ? 1.5 : 1)));
    },
  };
}
export function fault(m) {
  const g = new Drawing();
  base(g, 11.2, 5.85);
  for (const [x, r, h] of [
    [-3.81, 0.97, 1.13],
    [3.49, 1.28, 1.76],
  ]) {
    for (let j = 0; j < 4; j++)
      g.drum(x, 0.95 + j * 0.092, -0.13, r + 0.1 * (j % 2), 0.065, -0.4);
    g.drum(x, 1.3, -0.13, r, h, -0.41);
    for (let j = 0; j < 24; j++)
      g.circle(
        x,
        1.31 + (j * h) / 24,
        -0.13,
        r + 0.01,
        j % 6 === 0 ? -0.59 : -0.27,
      );
    g.drum(x, 1.32 + h, -0.13, r * 1.09, 0.14, -0.59);
    for (let j = 0; j < 7; j++)
      g.circle(
        x,
        1.47 + h,
        -0.13,
        r * (0.23 + j * 0.103),
        j % 2 === 0 ? -0.45 : 0.32,
      );
    for (let j = 0; j < 40; j++) {
      const a = (tau * j) / 40;
      g.line(
        [x + Math.cos(a) * r * 0.83, 1.47 + h, -0.13 + Math.sin(a) * r * 0.83],
        [
          x + Math.cos(a) * r * (j % 5 === 0 ? 1.04 : 0.94),
          1.47 + h,
          -0.13 + Math.sin(a) * r * (j % 5 === 0 ? 1.04 : 0.94),
        ],
        -0.67,
      );
    }
  }
  g.tube(
    [
      [-3.82, 2.16, -0.53],
      [-2.53, 2.02, -1.56],
      [-0.25, 1.56, -1.84],
      [2.11, 1.94, -1.54],
      [3.49, 2.14, -0.71],
    ],
    51,
    0.64,
    (j) => (j % 9 === 0 ? 0.65 : -0.37),
  );
  for (const s of [-1, 1])
    g.tube(
      [
        [s * 3.6, 1.85, 0.52],
        [s * 2.62, 1.64, 1.49],
        [s * 1.62, 1.52, 1.63],
        [s * 0.32, 1.49, 1.17],
      ],
      35,
      0.56,
      (j) => (j % 7 === 0 ? 0.5 : -0.34),
    );
  for (const x of [-0.35, 0.35]) g.deck(x, 1.02, 1.16, 0.17, 1.0, 1.01, -0.58);
  // A ruled receipt rack and a keyed shuttle sit on the receiver return.
  for (let j = 0; j < 41; j++) {
    const x = -2.48 + j * 0.13,
      len = j % 5 === 0 ? 0.36 : 0.16;
    g.line(
      [x, 0.947, 2.12],
      [x, 0.947, 2.12 + len],
      j % 5 === 0 ? -0.68 : -0.35,
    );
  }
  for (const x of [-3.81, 3.49])
    for (let j = 0; j < 16; j++) {
      const a = (tau * j) / 16,
        r = x < 0 ? 1.04 : 1.35;
      const u = x + Math.cos(a) * r,
        z = -0.13 + Math.sin(a) * r;
      g.deck(u, 1.06, z, 0.1, 0.36, 0.1, -0.55, -0.1, 0.02);
    }
  const group = g.build(m),
    payload = packet(m, 0.84);
  group.add(payload);
  const slips = [0, 1].map((j) => {
    const d = new Drawing();
    leaf(d, 0, 0, 0, 1.37, 1.05, 0.74);
    const o = d.build(m);
    group.add(o);
    o.position.set(3.46 + j * 0.69, 3.34 + j * 0.39, -0.15 + j * 0.6);
    return o;
  });
  const curves = [
    [
      [-3.8, 2.7, -0.1],
      [-2.6, 2.49, -1.6],
      [0.2, 1.84, -1.85],
      [2.6, 2.42, -1.5],
      [3.48, 3.49, -0.13],
    ],
    [
      [3.48, 3.49, -0.13],
      [2.8, 2.4, 1.43],
      [1.6, 1.73, 1.64],
      [0.43, 1.6, 1.17],
    ],
    [
      [0.43, 1.6, 1.17],
      [-2.7, 1.92, 1.53],
      [-3.81, 2.78, -0.13],
      [-1.6, 2, -1.77],
      [2.3, 2.39, -1.5],
      [3.76, 3.73, 0.12],
    ],
    [
      [3.76, 3.73, 0.12],
      [2.6, 2.29, 1.55],
      [0.3, 1.72, 1.21],
      [-2.6, 1.96, 1.53],
      [-3.81, 2.76, -0.13],
    ],
    [
      [-3.81, 2.76, -0.13],
      [-2.4, 2.22, -1.64],
      [0.2, 1.84, -1.83],
      [2.6, 2.45, -1.53],
      [3.48, 3.55, -0.13],
    ],
  ].map(
    (points) => new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p))),
  );
  return {
    group,
    payload,
    update(t) {
      const b = clamp(Math.ceil(t), 1, 5);
      payload.position.copy(curves[b - 1].getPoint(ease(t - b + 1)));
      const shown = clamp(Math.floor(t + 0.5), 0, 5);
      slips.forEach((s, j) => {
        s.visible = shown > 0 && j < runs[Math.max(0, shown - 1)].visits.length;
      });
    },
  };
}
