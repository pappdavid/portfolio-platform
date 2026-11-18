// One surface batch and one edge batch per independently moving part.
import * as T from '../vendor/three.module.min.js';
import { glyphs } from './glyphs.js';
const V = `attribute vec2 ink; varying vec2 pigment;
void main(){pigment=ink;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const F = `uniform vec3 accent; uniform float light; uniform float focus; varying vec2 pigment;
void main(){vec3 neutral=vec3(.88,.94,.92); vec3 col=mix(neutral,accent,min(1.,pigment.y+focus*.52))*pigment.x*(1.+focus*.37); gl_FragColor=vec4(mix(vec3(.0392),col,light),1.);}`;

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
  build() {
    const group = new T.Group();
    const uniforms = {
      accent: { value: new T.Vector3(0, 1, 0.533) },
      light: { value: 1 },
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
