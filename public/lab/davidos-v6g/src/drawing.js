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
