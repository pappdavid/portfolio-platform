// Batches each machined part into one surface mesh and one line mesh.
import * as T from '../vendor/three.module.min.js';
import { glyphs } from './glyphs.js';
const V = `attribute vec2 ink; varying vec2 pigment; varying float sectionX;
void main(){sectionX=position.x;pigment=ink;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const F = `uniform vec3 accent; uniform float light; uniform float cut; uniform float focus; varying float sectionX; varying vec2 pigment;
void main(){if(sectionX<cut)discard;vec3 neutral=vec3(.88,.94,.92); vec3 col=mix(neutral,accent,min(1.,pigment.y+focus*.52))*pigment.x*(1.+focus*.37); gl_FragColor=vec4(mix(vec3(.0392),col,light),1.);}`;
const TAU = Math.PI * 2;
const neutral = (v) => [v, 0],
  green = (v) => [v, 1];
const pale = (v) => [v, 0.22];
const clamp01 = (v) => Math.max(0, Math.min(1, v));
export class Drawing {
  constructor() {
    this.s = [[], []];
    this.l = [[], []];
  }
  add(batch, points, ink) {
    for (const p of points) {
      batch[0].push(...p);
      batch[1].push(...ink);
    }
  }
  line(a, b, ink = neutral(0.4)) {
    this.add(this.l, [a, b], ink);
  }
  path(p, ink, close = false) {
    for (let i = 1; i < p.length; i++) this.line(p[i - 1], p[i], ink);
    if (close) this.line(p.at(-1), p[0], ink);
  }
  quad(a, b, c, d, ink) {
    this.add(this.s, [a, b, c, a, c, d], ink);
  }
  // Coordinates on the drafting table are x,z; y is the assembly axis.
  solid(
    loop,
    y,
    h,
    top = pale(0.1),
    edge = neutral(0.62),
    side = pale(0.15),
    holes = [],
  ) {
    const shape = loop.map((p) => new T.Vector2(...p)),
      inners = holes.map((l) => l.map((p) => new T.Vector2(...p)));
    const vertices = [loop, ...holes].flat();
    for (const ids of T.ShapeUtils.triangulateShape(shape, inners))
      this.add(
        this.s,
        ids.map((i) => [vertices[i][0], y + h, vertices[i][1]]),
        top,
      );
    for (const ring of [loop, ...holes]) {
      for (let i = 0; i < ring.length; i++) {
        const [x, z] = ring[i],
          [X, Z] = ring[(i + 1) % ring.length];
        const a = [x, y, z],
          b = [X, y, Z],
          c = [X, y + h, Z],
          d = [x, y + h, z];
        const n = clamp01(
          0.6 + (0.36 * (X - x)) / Math.max(0.01, Math.hypot(X - x, Z - z)),
        );
        this.quad(a, b, c, d, [side[0] * n, side[1]]);
        this.line(c, d, edge);
        if (h > 0.06) {
          this.line(a, b, [edge[0] * 0.6, edge[1]]);
          this.line(a, d, [edge[0] * 0.5, edge[1]]);
        }
      }
    }
  }
  plate(
    x,
    z,
    w,
    d,
    y,
    h,
    cut = 0.14,
    top = pale(0.12),
    edge = neutral(0.65),
    side = pale(0.23),
  ) {
    this.solid(outline(x, z, w, d, cut), y, h, top, edge, side);
  }
  ring(x, z, r, y, ink = neutral(0.55), start = 0, end = TAU, n = 80) {
    this.path(
      Array.from({ length: n + 1 }, (_, i) => [
        x + r * Math.cos(start + ((end - start) * i) / n),
        y,
        z + r * Math.sin(start + ((end - start) * i) / n),
      ]),
      ink,
    );
  }
  disk(x, z, r, y, h, top, edge, n = 32) {
    this.solid(
      Array.from({ length: n }, (_, i) => [
        x + r * Math.cos((TAU * i) / n),
        z + r * Math.sin((TAU * i) / n),
      ]),
      y,
      h,
      top,
      edge,
    );
  }
  screw(x, z, y, r = 0.095) {
    this.disk(x, z, r, y, 0.035, pale(0.39), neutral(0.76), 12);
    this.line(
      [x - r * 0.6, y + 0.037, z - r * 0.4],
      [x + r * 0.6, y + 0.037, z + r * 0.4],
      neutral(0.05),
    );
  }
  route(p, y, ink) {
    this.path(
      p.map(([x, z]) => [x, y, z]),
      ink,
    );
  }
  build() {
    const group = new T.Group();
    const uniforms = {
      accent: { value: new T.Vector3(0, 1, 0.533) },
      light: { value: 1 },
      cut: { value: -100 },
      focus: { value: 0 },
    };
    group.userData.uniforms = uniforms;
    for (const [j, batch] of [this.s, this.l].entries()) {
      if (!batch[0].length) continue;
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.Float32BufferAttribute(batch[0], 3));
      g.setAttribute('ink', new T.Float32BufferAttribute(batch[1], 2));
      const material = new T.ShaderMaterial({
        uniforms,
        vertexShader: V,
        fragmentShader: F,
        side: T.DoubleSide,
        polygonOffset: j === 0,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      group.add(j ? new T.LineSegments(g, material) : new T.Mesh(g, material));
    }
    return group;
  }
}
function outline(x, z, w, d, c) {
  const a = w / 2,
    b = d / 2;
  c = Math.min(a, b, c);
  return [
    [-a + c, -b],
    [a - c, -b],
    [a, -b + c],
    [a, b - c],
    [a - c, b],
    [-a + c, b],
    [-a, b - c],
    [-a, -b + c],
  ].map(([u, v]) => [u + x, v + z]);
}
function rim(d, x, z, w, h, y, cut, ink) {
  d.route([...outline(x, z, w, h, cut), outline(x, z, w, h, cut)[0]], y, ink);
}
function hatch(d, x, z, w, depth, y, n, ink) {
  for (let i = 0; i < n; i++) {
    const a = ((i + 0.5) / n) * w;
    d.line([x + a, y, z], [x + a + 0.06, y, z + depth], ink);
  }
}
function ticks(d, w, depth, y) {
  for (let k = 0; k < 75; k++) {
    let x = -w / 2 + 0.29 + ((w - 0.58) * k) / 74;
    d.line(
      [x, y, depth / 2 - 0.14],
      [x, y, depth / 2 - (k % 5 === 0 ? 0.29 : 0.21)],
      neutral(k % 5 === 0 ? 0.69 : 0.37),
    );
  }
}
function corners(d, w, depth, y) {
  for (const x of [-1, 1])
    for (const z of [-1, 1])
      d.screw(x * (w / 2 - 0.26), z * (depth / 2 - 0.26), y);
}
function contacts(d, w, depth, y) {
  for (let k = 0; k < 32; k++) {
    const x = -w * 0.32 + (k * w * 0.64) / 31;
    d.quad(
      [x, y, depth / 2 + 0.002],
      [x + 0.045, y, depth / 2 + 0.002],
      [x + 0.045, y + 0.1, depth / 2 + 0.002],
      [x, y + 0.1, depth / 2 + 0.002],
      pale(0.5),
    );
  }
}
function carrier(w = 6.9, depth = 3.65) {
  const d = new Drawing();
  d.plate(0, 0, w, depth, 0, 0.19, 0.24, pale(0.13), neutral(0.64));
  rim(d, 0, 0, w - 0.18, depth - 0.18, 0.195, 0.18, pale(0.55));
  ticks(d, w, depth, 0.2);
  corners(d, w, depth, 0.2);
  contacts(d, w, depth, 0.035);
  for (const x of [-1, 1])
    for (const z of [-1, 1]) {
      d.plate(
        x * (w / 2 - 0.6),
        z * (depth / 2 - 0.55),
        0.65,
        0.56,
        -0.17,
        0.17,
        0.09,
        pale(0.12),
        neutral(0.38),
      );
    }
  return d;
}
export function heroBase() {
  const d = carrier(8.2, 4.2);
  d.plate(0, 0, 7.92, 3.95, 0.29, 0.13, 0.2, pale(0.1), pale(0.62));
  d.plate(0, 0, 8.06, 4.02, 0.46, 0.12, 0.24, [0.14, 0.3], pale(0.78));
  rim(d, 0, 0, 7.81, 3.8, 0.586, 0.2, green(0.53));
  corners(d, 8, 4, 0.59);
  ticks(d, 7.95, 4, 0.59);
  contacts(d, 7.96, 4.02, 0.47);
  // Parallel etched buses feed the word die. Individual traces terminate in vias.
  for (let k = 0; k < 15; k++) {
    const x = -3.12 + k * 0.405;
    const z = -1.8;
    d.route(
      [
        [x, z],
        [x, z + 0.12],
        [x + 0.17, z + 0.29],
        [x + 0.17, z + 0.67],
      ],
      0.588,
      k % 3 === 0 ? green(0.48) : neutral(0.32),
    );
    d.ring(x, z, 0.026, 0.59, pale(0.62), 0, TAU, 8);
  }
  for (let k = 0; k < 8; k++) {
    const x = 1.35 + k * 0.19;
    d.route(
      [
        [x, 1.43],
        [x + 0.17, 1.24],
        [x + 0.17, 1.03],
      ],
      0.589,
      neutral(0.51),
    );
  }
  hatch(d, -3.15, 1.28, 1.18, 0.15, 0.593, 26, green(0.78));
  rim(d, -0.14, 1.4, 1.25, 0.18, 0.59, 0.03, neutral(0.45));
  return d.build();
}
export function markSlice(index, count) {
  const d = new Drawing(),
    offs = [0, 1.16, 2.33, 3.53, 4.45];
  const cap = index === count - 1;
  for (let k = 0; k < 5; k++) {
    const loops = glyphs[k].map((r) =>
      r.map(([x, y]) => [(x + offs[k] - 2.73) * 1.29, (0.5 - y) * 2.35 - 0.04]),
    );
    d.solid(
      loops[0],
      0,
      0.065,
      cap ? [0.92, 0.46] : green(0.3),
      cap ? pale(0.99) : green(0.7),
      [0.64, 0.78],
      loops.slice(1),
    );
    if (cap) {
      for (let z = -1.19; z < 1.105; z += 0.049) {
        const hits = [];
        for (const loop of loops)
          for (let j = 0; j < loop.length; j++) {
            const [x, a] = loop[j],
              [X, b] = loop[(j + 1) % loop.length];
            if (a > z !== b > z) hits.push(x + ((X - x) * (z - a)) / (b - a));
          }
        hits.sort((a, b) => a - b);
        for (let j = 0; j < hits.length; j += 2)
          d.line([hits[j], 0.066, z], [hits[j + 1], 0.066, z], green(0.42));
      }
    }
  }
  return d.build();
}
function socket(d, x, z, y, w, h) {
  d.plate(x, z, w, h, y, 0.09, 0.09, pale(0.16), neutral(0.74));
  rim(d, x, z, w - 0.16, h - 0.16, y + 0.094, 0.05, pale(0.43));
  for (let i = 0; i < 10; i++) {
    const X = x - w * 0.35 + (i * w * 0.7) / 9;
    for (const side of [-1, 1])
      d.line(
        [X, y + 0.028, z + side * h * 0.5],
        [X, y + 0.028, z + side * (h * 0.5 + 0.12)],
        pale(0.75),
      );
  }
}
function documentDie(d, x, z, y, w, h, highlight) {
  d.plate(x, z, w, h, y, 0.07, 0.075, pale(0.2), pale(0.89));
  for (let i = 0; i < 7; i++) {
    const Z = z - h * 0.32 + i * 0.105;
    const W = w * (i % 3 === 2 ? 0.45 : 0.68);
    d.line(
      [x - w * 0.34, y + 0.073, Z],
      [x - w * 0.34 + W, y + 0.073, Z],
      i === 2 && highlight ? green(0.98) : neutral(0.66),
    );
  }
}
function dial(d, x, z, r, y, idx) {
  d.disk(x, z, r, y, 0.09, pale(0.12), pale(0.78), 72);
  for (const rr of [0.3, 0.44, 0.71, 0.94])
    d.ring(x, z, rr * r, y + 0.094, rr === 0.71 ? green(0.74) : neutral(0.45));
  for (let k = 0; k < 96; k++) {
    const a = (k * TAU) / 96,
      b = r * (k % 8 === 0 ? 0.79 : 0.87);
    d.line(
      [x + Math.cos(a) * b, y + 0.096, z + Math.sin(a) * b],
      [x + Math.cos(a) * r * 0.94, y + 0.096, z + Math.sin(a) * r * 0.94],
      k % 8 === 0 ? green(0.88) : neutral(0.51),
    );
  }
  for (let k = 0; k < 4; k++)
    d.ring(
      x,
      z,
      r * 0.62,
      y + 0.098,
      green(0.87),
      (k * TAU) / 4 + 0.12,
      (k * TAU) / 4 + 1.1,
      18,
    );
  d.screw(x, z, y + 0.1, 0.16);
  const a = idx * 0.95;
  d.line(
    [x + 0.22 * Math.cos(a), y + 0.11, z + 0.22 * Math.sin(a)],
    [x + r * 0.75 * Math.cos(a), y + 0.11, z + r * 0.75 * Math.sin(a)],
    green(0.96),
  );
}
export function layer(system, idx) {
  const w = 6.32 - idx * 0.09,
    depth = 3.12 - idx * 0.065,
    d = new Drawing(),
    y = 0.15;
  d.plate(0, 0, w, depth, 0, y, 0.23, pale(0.115), pale(0.74));
  rim(d, 0, 0, w - 0.2, depth - 0.18, y + 0.002, 0.19, pale(0.44));
  corners(d, w, depth, y);
  ticks(d, w, depth, y + 0.006);
  contacts(d, w, depth, 0.018);
  for (let k = 0; k < 7; k++) {
    let z = -0.62 + k * 0.15;
    d.route(
      [
        [-w * 0.45, z],
        [-w * 0.32, z],
        [-w * 0.23, z - 0.32],
        [-w * 0.12, z - 0.32],
      ],
      y + 0.004,
      k % 3 ? neutral(0.36) : green(0.62),
    );
  }
  if (system === 0) {
    if (idx === 0) {
      socket(d, -0.45, 0, y, 2.83, 1.8);
      documentDie(d, -0.45, -0.02, y + 0.1, 2.2, 1.29, false);
      socket(d, 1.73, 0, y, 0.91, 0.89);
    }
    if (idx === 1) {
      for (let k = 0; k < 3; k++)
        documentDie(d, -1.27 + k * 0.84, -0.03, y + k * 0.06, 2.48, 1.59, true);
    }
    if (idx === 2) {
      for (let k = 0; k < 8; k++) {
        const x = -1.58 + k * 0.42;
        d.plate(
          x,
          -0.04,
          0.15,
          1.86,
          y,
          0.27,
          0.06,
          k < 4 ? pale(0.4) : green(0.44),
          pale(0.7),
        );
      }
    }
    if (idx === 3) {
      socket(d, -0.38, 0, y, 3.36, 1.62);
      d.plate(
        -0.42,
        0,
        2.38,
        0.49,
        y + 0.11,
        0.16,
        0.16,
        green(0.35),
        green(0.94),
      );
      d.screw(0.41, 0, y + 0.27);
    }
    if (idx === 4) {
      socket(d, -0.28, 0, y, 3.36, 1.68);
      for (let k = 0; k < 3; k++)
        documentDie(
          d,
          -0.32 - 0.1 * k,
          0.1 * k,
          y + 0.095 + 0.075 * k,
          2.5,
          1.14,
          true,
        );
    }
  } else if (system === 1) {
    if (idx < 3) {
      dial(d, -0.88, -0.02, 1.06, y, idx);
      socket(d, 1.38, 0, y, 1.56, 1.48);
      for (let k = 0; k < 21; k++) {
        const x = 0.76 + k * 0.061,
          amp = 0.11 + 0.38 * Math.abs(Math.sin(k * 1.72 + idx));
        d.line([x, y + 0.1, -amp], [x, y + 0.1, amp], green(0.91));
      }
      if (idx === 1)
        d.ring(-0.88, -0.02, 0.84, y + 0.13, green(0.98), -0.9, 1.8, 45);
      if (idx === 2) {
        for (let k = 0; k < 3; k++)
          d.disk(
            1 + k * 0.35,
            0,
            0.095,
            y + 0.12,
            0.08,
            k === 1 ? green(0.9) : neutral(0.41),
            neutral(0.77),
          );
      }
    } else if (idx === 3) {
      for (let k = 0; k < 2; k++)
        documentDie(d, -0.78 + k * 0.84, -0.04, y + k * 0.08, 2.75, 1.63, true);
      dial(d, 1.86, 0, 0.55, y, idx);
    } else {
      documentDie(d, -1.24, -0.08, y, 2.17, 1.62, true);
      socket(d, 1.22, 0, y, 1.64, 1.43);
      for (let k = 0; k < 3; k++)
        d.plate(
          0.76 + k * 0.43,
          0,
          0.2,
          0.77,
          y + 0.1,
          0.11,
          0.03,
          k === 2 ? neutral(0.19) : green(0.52),
          neutral(0.72),
        );
    }
  } else {
    for (const sign of [-1, 1]) {
      socket(d, sign * 1.55, -0.04, y, 1.64, 1.63);
      if (sign < 0 || idx === 0 || idx === 1) {
        d.plate(
          sign * 1.55,
          -0.04,
          1.13,
          1.08,
          y + 0.095,
          0.14,
          0.13,
          pale(0.25),
          green(0.8),
        );
        rim(d, sign * 1.55, -0.04, 0.77, 0.72, y + 0.24, 0.1, neutral(0.76));
      } else {
        for (let k = 0; k < (idx === 2 ? 2 : 1); k++) {
          const X = 1.19 + 0.68 * k;
          documentDie(d, X, -0.04, y + 0.11, 0.63, 1.03, false);
        }
      }
    }
    for (let k = 0; k < 9; k++) {
      let z = -0.54 + k * 0.12;
      d.route(
        [
          [-0.73, z],
          [-0.51, z],
          [-0.31, z + 0.16],
          [0.36, z + 0.16],
          [0.52, z],
          [0.72, z],
        ],
        y + 0.012,
        k === 4 ? green(0.99) : neutral(0.56),
      );
    }
  }
  hatch(d, -w * 0.39, 0.99, 0.74, 0.11, y + 0.01, 16, pale(0.75));
  return d.build();
}
export function base() {
  return carrier().build();
}
export function grid() {
  const d = new Drawing();
  for (let i = -20; i <= 20; i++)
    for (let j = -18; j <= 18; j++) {
      const x = i * 0.66,
        z = j * 0.66,
        fall = Math.exp(-0.019 * (x * x + z * z));
      let c = neutral(0.04 + 0.112 * fall);
      d.line([x, -0.42, z], [x + 0.66, -0.42, z], c);
      d.line([x, -0.42, z], [x, -0.42, z + 0.66], c);
      if (i % 3 === 0 && j % 3 === 0) {
        d.line(
          [x - 0.1, -0.416, z],
          [x + 0.1, -0.416, z],
          neutral(0.044 + 0.29 * fall),
        );
        d.line(
          [x, -0.416, z - 0.1],
          [x, -0.416, z + 0.1],
          neutral(0.044 + 0.29 * fall),
        );
      }
    }
  return d.build();
}
export function registration() {
  const d = new Drawing();
  for (const sign of [-1, 1])
    for (let k = 0; k < 38; k++) {
      let z = -2.23 + k * 0.122;
      d.line(
        [sign * 3.71, -0.1, z],
        [sign * (3.71 + (k % 5 === 0 ? 0.15 : 0.065)), -0.1, z],
        pale(k % 5 === 0 ? 0.52 : 0.31),
      );
    }
  for (const side of [-1, 1]) {
    d.line([-3.3, -0.09, side * 2.16], [3.3, -0.09, side * 2.16], neutral(0.4));
    for (const x of [-3.3, 3.3])
      d.line(
        [x - 0.08, -0.09, side * 2.16 - 0.09],
        [x + 0.08, -0.09, side * 2.16 + 0.09],
        pale(0.79),
      );
  }
  return d.build();
}

export function cutFace(idx) {
  const d = new Drawing(),
    half = (3.12 - idx * 0.065) / 2;
  d.quad(
    [0, 0, -half],
    [0, 0, half],
    [0, 0.15, half],
    [0, 0.15, -half],
    pale(0.27),
  );
  d.line([0, 0.15, -half], [0, 0.15, half], pale(0.91));
  for (let z = -half + 0.12; z < half; z += 0.09)
    d.line([-0.002, 0, z], [0, 0.15, z - 0.085], pale(0.67));
  return d.build();
}
export function needle() {
  const d = new Drawing();
  d.plate(0.48, 0, 0.97, 0.045, 0, 0.055, 0.02, green(0.99), pale(0.87));
  d.disk(0, 0, 0.11, 0, 0.07, pale(0.7), green(0.98));
  return d.build();
}
