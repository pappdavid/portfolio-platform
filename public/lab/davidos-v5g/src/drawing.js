// Batched engravings and opaque cut faces share a depth buffer. Ink is mixed in
// display space so the same drawing survives every phosphor colour.
import * as T from "../vendor/three.module.min.js";
export const tau = Math.PI * 2;
export const lerp = (a, b, t) => a + (b - a) * t;
const vertex = `attribute float ink;
varying float strength; varying float depth;
void main(){vec4 p=modelViewMatrix*vec4(position,1.); depth=-p.z; strength=ink; gl_Position=projectionMatrix*p;}`;
const fragment = `uniform vec3 accent; uniform float mist; uniform float focalDepth; uniform float distantFade;
varying float strength; varying float depth;
void main(){float i=abs(strength);
vec3 paper=mix(vec3(.90,.92,.87),accent,strength>0.?.95:.08);
float fog=exp(-max(0.,depth-8.)*mist-max(0.,depth-focalDepth-4.)*distantFade);
if(strength<-.2) i=pow(i,.78);
gl_FragColor=vec4(mix(vec3(.039216),paper,i*fog),1.);}`;
export function inks() {
  const uniforms = {
    accent: { value: new T.Vector3(0, 1, 0.533) },
    mist: { value: 0.012 },
    focalDepth: { value: 22 },
    distantFade: { value: 0.052 },
  };
  const params = {
    uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
    side: T.DoubleSide,
  };
  return {
    line: new T.ShaderMaterial(params),
    face: new T.ShaderMaterial({
      ...params,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 2,
    }),
    uniforms,
  };
}
export class Drawing {
  constructor() {
    this.lines = [];
    this.tones = [];
    this.faces = [];
    this.fills = [];
  }
  line(a, b, i = -0.42) {
    this.lines.push(...a, ...b);
    this.tones.push(i, i);
  }
  path(p, i, loop = false) {
    for (let k = 1; k < p.length; k++) this.line(p[k - 1], p[k], i);
    if (loop) this.line(p.at(-1), p[0], i);
  }
  triangle(a, b, c, i) {
    this.faces.push(...a, ...b, ...c);
    this.fills.push(i, i, i);
  }
  quad(a, b, c, d, i) {
    this.triangle(a, b, c, i);
    this.triangle(a, c, d, i);
  }
  // Chamfered sheet metal in the horizontal plane, with a matte occluding surface.
  deck(x, y, z, w, h, d, edge = -0.38, fill = -0.048, cut = 0.16) {
    const X = w / 2,
      Z = d / 2,
      k = Math.min(X / 2, Z / 2, cut);
    const shape = [
      [-X + k, -Z],
      [X - k, -Z],
      [X, -Z + k],
      [X, Z - k],
      [X - k, Z],
      [-X + k, Z],
      [-X, Z - k],
      [-X, -Z + k],
    ];
    const ring = (height) => shape.map(([u, v]) => [x + u, height, z + v]);
    const a = ring(y),
      b = ring(y + h);
    this.path(a, edge, true);
    this.path(b, edge, true);
    b.forEach((p, j) => {
      const n = (j + 1) % 8;
      this.line(a[j], p, edge);
      this.quad(a[j], a[n], b[n], p, fill * 0.6);
      this.triangle([x, y + h, z], p, b[n], fill);
    });
  }
  circle(x, y, z, r, i = -0.5, plane = "xz", count = 64) {
    const p = [];
    for (let j = 0; j < count; j++) {
      const a = (tau * j) / count,
        c = r * Math.cos(a),
        s = r * Math.sin(a);
      p.push(
        plane === "xy"
          ? [x + c, y + s, z]
          : plane === "yz"
            ? [x, y + c, z + s]
            : [x + c, y, z + s],
      );
    }
    this.path(p, i, true);
  }
  drum(x, y, z, r, h, edge, vertical = true) {
    const pt = (a, k, f = 1) =>
      vertical
        ? [x + r * Math.cos(a) * f, y + k, z + r * Math.sin(a) * f]
        : [x + r * Math.cos(a) * f, y + r * Math.sin(a) * f, z + k];
    for (let n = 0; n < 72; n++) {
      const a = (tau * n) / 72,
        b = (tau * (n + 1)) / 72;
      this.quad(pt(a, 0), pt(b, 0), pt(b, h), pt(a, h), -0.055);
      this.triangle(pt(a, h), pt(b, h), pt(0, h, 0), -0.09);
      this.triangle(pt(a, 0), pt(0, 0, 0), pt(b, 0), -0.075);
      this.line(pt(a, 0), pt(a, h), n % 6 === 0 ? edge : -0.16);
      for (const k of [0, h]) this.line(pt(a, k), pt(b, k), edge);
    }
  }
  tube(points, count, width, i) {
    for (let j = 0; j < count; j++) {
      const f = count === 1 ? 0 : j / (count - 1) - 0.5;
      const p = points.map(
        (a, n) =>
          new T.Vector3(
            a[0],
            a[1] + Math.sin(f * 4 + n * 0.7) * width * 0.16,
            a[2] + f * width,
          ),
      );
      const curve = new T.CatmullRomCurve3(p);
      this.path(
        curve.getPoints(56).map((v) => v.toArray()),
        typeof i === "function" ? i(j) : i,
      );
    }
  }
  build(mat) {
    const group = new T.Group();
    for (const [positions, tones, m, type] of [
      [this.faces, this.fills, mat.face, T.Mesh],
      [this.lines, this.tones, mat.line, T.LineSegments],
    ]) {
      if (!positions.length) continue;
      const geom = new T.BufferGeometry();
      geom.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
      geom.setAttribute("ink", new T.Float32BufferAttribute(tones, 1));
      geom.computeBoundingSphere();
      group.add(new type(geom, m));
    }
    return group;
  }
}
export function base(g, w = 11, d = 5) {
  for (const x of [-w * 0.39, w * 0.39])
    for (const z of [-d * 0.32, d * 0.32])
      g.deck(x, 0.06, z, 1.2, 0.25, 0.8, -0.29);
  g.deck(0, 0.28, 0, w - 0.25, 0.16, d - 0.18, -0.33, -0.035, 0.34);
  g.deck(0, 0.54, 0, w, 0.28, d, -0.54, -0.08, 0.34);
  g.deck(0, 0.88, 0, w - 0.17, 0.055, d - 0.16, -0.37, -0.07, 0.26);
  for (let j = 0; j < 175; j++) {
    const x = -w * 0.46 + (j * w * 0.92) / 174,
      h = j % 10 === 0 ? 0.19 : j % 5 === 0 ? 0.13 : 0.055;
    g.line(
      [x, 0.82, d / 2],
      [x, 0.82 - h, d / 2],
      j % 10 === 0 ? -0.52 : -0.28,
    );
  }
  for (let j = 0; j < 40; j++) {
    const x = -w * 0.43 + (j * w * 0.86) / 39;
    g.line([x, 0.94, -d * 0.42], [x + 0.25, 0.94, -d * 0.3], -0.21);
  }
  for (const x of [-w * 0.45, w * 0.45])
    for (const z of [-d * 0.37, d * 0.37]) {
      g.circle(x, 0.943, z, 0.105, -0.5);
      g.line([x - 0.07, 0.946, z + 0.038], [x + 0.07, 0.946, z - 0.038], -0.46);
    }
}
