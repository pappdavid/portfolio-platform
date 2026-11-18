// Indexed ribbons share both vertices at a join. Arc length, lane order and the
// transported cross-section are independent of the camera and playback direction.
import * as T from "../vendor/three.module.min.js";
import { paperGL } from "./drawing.js";

const vertexShader = `
attribute vec3 tangent;
attribute float laneNumber;
attribute vec4 fiber; // arc fraction, signed lane, side, pitch in scene units
uniform vec2 viewport;
varying float arc, lane, edge, width, density, depth;
void main(){
  vec4 a = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  vec4 b = projectionMatrix * modelViewMatrix * vec4(position + tangent, 1.);
  vec2 dir = (b.xy/b.w - a.xy/a.w)*viewport;
  vec2 normal = vec2(-dir.y, dir.x)/max(.00001,length(dir));
  arc=fiber.x; lane=fiber.y; depth=a.w;
  width=mix(.22,.44,1.-lane*lane);
  edge=fiber.z*(width+.7);
  float pitch=fiber.w*abs(projectionMatrix[1][1])*viewport.y*.5*length(modelMatrix[1].xyz)/max(.01,a.w);
  // Below two pixels of pitch, preserve evenly spaced resolved filaments.
  // The remaining lanes still contribute a little body between the bright ones.
  float resolved=1.;
  if(mod(laneNumber,2.)>.5) resolved=mix(.09,1.,smoothstep(1.15,2.15,pitch));
  else if(mod(laneNumber,4.)>1.) resolved=mix(.13,1.,smoothstep(.58,1.20,pitch));
  else if(mod(laneNumber,8.)>3.) resolved=mix(.17,1.,smoothstep(.29,.59,pitch));
  density=resolved*clamp(pitch*2.4,.20,1.);
  a.xy+=normal*edge*2./viewport*a.w;
  gl_Position=a;
}`;
const fragmentShader = `
uniform vec3 accent;
uniform float earlierElapsed,earlierDuration;
uniform float exposure,siteInk,mist,focalDepth,distantFade,elapsed,duration,travel,tinted,fray,endFade,stem,splitAt;
varying float arc,lane,edge,width,density,depth;
${paperGL}
vec2 signalAt(float clock,float duration,float passage){
  float age=clock-duration*passage;
  float front=smoothstep(-.017,.012,age)*smoothstep(0.,.065,clock);
  float distanceToHead=(age-.025)/.068;
  float head=exp(-distanceToHead*distanceToHead);
  float tail=exp(-max(age,0.)/.27)*(1.-smoothstep(.58,.80,age));
  return vec2(front*(head*1.45+tail*.91),age);
}
void main(){
  float end=1.-fray*(.015+.055*abs(lane));
  float fade=smoothstep(0.,endFade,arc)*(1.-smoothstep(end-max(endFade,fray*.06),end,arc));
  fade*=mix(stem,1.,smoothstep(splitAt-.005,splitAt+.005,arc));
  float coverage=clamp(width+.5-abs(edge),0.,1.)*density;
  float core=1.-lane*lane;
  vec3 structure=mix(vec3(.60,.63,.61),accent,.10);
  vec3 color=mix(structure,accent,tinted*.82);
  float energy=mix(.23,.61,core);
  if(travel>.5){
    // Inverse smoothstep gives the instant the eased head reached this sample.
    float passage=.5-sin(asin(clamp(1.-2.*arc,-1.,1.))/3.);
    vec2 signal=signalAt(elapsed,duration,passage);
    if(earlierElapsed>0.){
      vec2 prior=signalAt(earlierElapsed,earlierDuration,passage);
      if(prior.x>signal.x) signal=prior;
    }
    color=mix(paper(-.82),accent,1.-smoothstep(.09,.69,signal.y));
    energy=signal.x*mix(.50,1.,core);
  }
  float fog=exp(-max(0.,depth-8.)*mist-max(0.,depth-focalDepth-4.)*distantFade);
  gl_FragColor=vec4(color,coverage*fade*energy*exposure*siteInk*fog);
}`;
export function filamentMesh(
  coords,
  count,
  spread,
  uniforms,
  {
    active = false,
    tinted = false,
    fray = 0,
    inlets = false,
    fork = false,
  } = {},
) {
  const curve = new T.CatmullRomCurve3(coords.map((p) => new T.Vector3(...p)));
  const length = curve.getLength();
  const split = fork
    ? curve.getLengths(480)[Math.round((480 * fork.at) / (coords.length - 1))] /
      length
    : 1;
  const steps = Math.max(40, Math.min(180, Math.ceil(length * 15)));
  const points = curve.getSpacedPoints(steps);
  const frames = points.map((point, i) => {
    const t = curve.getTangentAt(i / steps);
    return { point, t };
  });
  let across = new T.Vector3(-frames[0].t.y, frames[0].t.x, 0);
  if (across.lengthSq() < 0.0001) across.set(1, 0, 0);
  across.normalize();
  frames.forEach((f, i) => {
    if (i)
      across.applyQuaternion(
        new T.Quaternion().setFromUnitVectors(frames[i - 1].t, f.t),
      );
    f.across = across.clone();
    f.back = new T.Vector3().crossVectors(f.t, across).normalize();
  });
  const positions = [],
    tangents = [],
    attrs = [],
    lanes = [],
    indices = [];
  for (let j = 0; j < count; j++) {
    const lane = count === 1 ? 0 : (2 * j) / (count - 1) - 1;
    const spine = frames.map(({ point, across, back }, i) => {
      const u = i / steps;
      const taper =
        0.54 + 0.46 * T.MathUtils.smoothstep(Math.min(u, 1 - u), 0, 0.15);
      const fan = fray * T.MathUtils.smoothstep(u, 0.55, 1);
      let offset = spread * lane * (taper + fan * 1.85);
      const v = point.clone();
      if (inlets) {
        // Five input rows feed disjoint, ordered groups in the same trunk.
        const groupSize = count / 5,
          row = Math.floor(j / groupSize);
        const inner = (j % groupSize) / (groupSize - 1) - 0.5;
        const source = 1.44 - (4 - row) * 0.59 + inner * 0.074;
        const trunk = T.MathUtils.smoothstep(u * length, 0.28, 2.6);
        v.y += source * (1 - trunk);
        offset *= trunk;
      }
      if (fork) {
        const fan = T.MathUtils.smoothstep(u, split, Math.min(1, split + 0.2));
        v.y += Math.sign(lane) * fork.gap * fan;
      }
      return v
        .addScaledVector(across, offset)
        .addScaledVector(
          back,
          spread * (0.55 * (1 - lane * lane) + fan * 0.19 * lane),
        );
    });
    for (let i = 0; i <= steps; i++) {
      const tangent = spine[Math.min(steps, i + 1)]
        .clone()
        .sub(spine[Math.max(0, i - 1)])
        .normalize();
      const base = positions.length / 3;
      for (const side of [-1, 1]) {
        positions.push(...spine[i].toArray());
        tangents.push(...tangent.toArray());
        lanes.push(j);
        attrs.push(
          i / steps,
          lane,
          side,
          count === 1 ? 1 : (2 * spread) / (count - 1),
        );
      }
      if (i < steps)
        indices.push(base, base + 1, base + 2, base + 2, base + 1, base + 3);
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("tangent", new T.Float32BufferAttribute(tangents, 3));
  geometry.setAttribute("fiber", new T.Float32BufferAttribute(attrs, 4));
  geometry.setAttribute("laneNumber", new T.Float32BufferAttribute(lanes, 1));
  geometry.setIndex(indices);
  const material = new T.ShaderMaterial({
    uniforms: {
      ...uniforms,
      travel: { value: +active },
      stem: { value: 1 },
      splitAt: { value: split },
      endFade: { value: Math.min(0.07, 0.17 / length) },
      tinted: { value: +tinted },
      fray: { value: Math.min(1, fray) },
      earlierElapsed: { value: -1 },
      earlierDuration: { value: 1 },
      elapsed: { value: 0 },
      duration: { value: 1 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: T.AdditiveBlending,
    depthWrite: false,
    side: T.DoubleSide,
    forceSinglePass: true,
  });
  return new T.Mesh(geometry, material);
}
