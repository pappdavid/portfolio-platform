import { Drawing, lerp } from "./drawing.js";
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
  for (let k = 0; k < 5; k++) {
    const x = [-4.2, -2.0, 0.16, 2.1, 3.98][k];
    for (let n = 0; n < 30; n++) {
      const f = (n - 14.5) / 29;
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
