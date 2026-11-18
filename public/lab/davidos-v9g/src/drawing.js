// Batched engravings and opaque cut faces share a depth buffer. Ink is mixed in
// display space so the same drawing survives every phosphor colour.
import * as T from "../vendor/three.module.min.js";
export const tau = Math.PI * 2;
export const lerp = (a, b, t) => a + (b - a) * t;
export const paperGL = `const vec3 ground=vec3(10./255.);
vec3 paper(float role) {
  vec3 neutral=mix(vec3(227.,231.,223.)/255.,accent,.04);
  return role>0. ? accent : mix(ground,neutral,role < -.65 ? .82 : .55);
}`;
const uniformsGL = `uniform float siteInk, exposure, mist, focalDepth, distantFade;
uniform vec3 accent;
varying float strength, depth;
${paperGL}
float fog() { return exp(-max(0.,depth-8.)*mist-max(0.,depth-focalDepth-4.)*distantFade); }`;
const vertex = `attribute float ink;
varying float strength, depth;
void main(){vec4 p=modelViewMatrix*vec4(position,1.); depth=-p.z; strength=ink; gl_Position=projectionMatrix*p;}`;
const lineVertex = `attribute vec3 other; attribute vec2 filament; attribute float ink, side;
uniform vec2 viewport;
varying float strength, depth, edge, halfWidth, laneCoverage;
vec3 deform(vec3 v){return v;}
void main(){
  vec4 a=projectionMatrix*modelViewMatrix*vec4(deform(position),1.);
  vec4 b=projectionMatrix*modelViewMatrix*vec4(deform(other),1.);
  vec2 delta=(b.xy/b.w-a.xy/a.w)*viewport;
  vec2 normal=vec2(-delta.y,delta.x)/max(length(delta),.00001);
  float weight=ink>=.95 ? 2. : (ink < -.65 || ink>=.75 ? 1.25 : .75);
  halfWidth=.5*weight;
  edge=sign(side)*(halfWidth+.65);
  a.xy+=normal*edge*2./viewport*a.w;
  laneCoverage=1.;
  if(filament.x>0.){
    float pitch=filament.x*abs(projectionMatrix[1][1])*viewport.y*.5*length(modelMatrix[1].xyz)/max(a.w,.001);
    float lane=filament.y;
    if(mod(lane,2.)>.5) laneCoverage=smoothstep(1.05,2.25,pitch);
    else if(mod(lane,4.)>1.) laneCoverage=smoothstep(.53,1.13,pitch);
    else if(mod(lane,8.)>2.) laneCoverage=smoothstep(.26,.57,pitch);
  }
  if(abs(side)>1.5) edge=-edge;
  gl_Position=a; depth=a.w; strength=ink;
}`;
const lineFragment =
  uniformsGL +
  `
varying float edge,halfWidth,laneCoverage;
void main(){
  float aa=max(.01,.5*fwidth(edge));
  float coverage=1.-smoothstep(halfWidth-aa,halfWidth+aa,abs(edge));
  gl_FragColor=vec4(mix(ground,paper(strength),fog()),coverage*exposure*laneCoverage*siteInk);
}`;
const fragment =
  uniformsGL +
  `
void main(){gl_FragColor=vec4(mix(ground,paper(strength),abs(strength)*fog()*exposure*siteInk),1.);}`;
export function inks() {
  const uniforms = {
    viewport: { value: new T.Vector2(1, 1) },
    exposure: { value: 1 },
    siteInk: { value: 1 },
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
    line: new T.ShaderMaterial({
      ...params,
      vertexShader: lineVertex,
      fragmentShader: lineFragment,
      transparent: true,
      depthWrite: false,
      forceSinglePass: true,
    }),
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
    this.filaments = [];
    this.pitch = 0;
    this.lane = 0;
    this.tones = [];
    this.faces = [];
    this.fills = [];
  }
  line(a, b, i = -0.42) {
    this.lines.push(...a, ...b);
    this.tones.push(i, i);
    this.filaments.push(this.pitch, this.lane);
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
    if (this.faces.length) {
      const geometry = new T.BufferGeometry();
      geometry.setAttribute(
        "position",
        new T.Float32BufferAttribute(this.faces, 3),
      );
      geometry.setAttribute("ink", new T.Float32BufferAttribute(this.fills, 1));
      group.add(new T.Mesh(geometry, mat.face));
    }
    if (this.lines.length) {
      const positions = [],
        others = [],
        filaments = [],
        roles = [],
        sides = [],
        indices = [];
      for (let i = 0; i < this.lines.length; i += 6) {
        const a = this.lines.slice(i, i + 3),
          b = this.lines.slice(i + 3, i + 6);
        const base = sides.length,
          role = this.tones[i / 3];
        positions.push(...a, ...a, ...b, ...b);
        others.push(...b, ...b, ...a, ...a);
        sides.push(-1, 1, 2, -2);
        for (let k = 0; k < 4; k++)
          filaments.push(this.filaments[i / 3], this.filaments[i / 3 + 1]);
        roles.push(role, role, role, role);
        indices.push(base, base + 1, base + 2, base + 2, base + 1, base + 3);
      }
      const geometry = new T.BufferGeometry();
      geometry.setAttribute(
        "position",
        new T.Float32BufferAttribute(positions, 3),
      );
      geometry.setAttribute("other", new T.Float32BufferAttribute(others, 3));
      geometry.setAttribute(
        "filament",
        new T.Float32BufferAttribute(filaments, 2),
      );
      geometry.setAttribute("side", new T.Float32BufferAttribute(sides, 1));
      geometry.setAttribute("ink", new T.Float32BufferAttribute(roles, 1));
      geometry.setIndex(indices);
      group.add(new T.Mesh(geometry, mat.line));
    }
    return group;
  }
}
