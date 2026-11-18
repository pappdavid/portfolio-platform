import * as T from "../vendor/three.module.min.js";
import { inks } from "./drawing.js";
import { mark } from "./machines.js";
import { studio } from "./studio.js";
import { companion } from "./companion.js";
import { fault } from "./fault.js";
import { projectFaces } from "./atlas.js";
import { frame, starts, clamp, ramp, shotInk, ease } from "./story.js";
const sites = [
  [-42, 0.6, 0],
  [-23, 0, 0],
  [0, 0, -2],
  [23, 0, 0],
];
const shots = [
  [
    [0, 0.65, 0, 22.4],
    [-3.4, 0.05, 0, 14.9],
    [-3.2, 0.85, -0.1, 15.7],
    [0.18, 2.19, -0.45, 10.9],
    [3, 0.65, 0, 13.8],
    [-0.7, -0.55, 0.3, 11.2],
  ],
  [
    [0, 0.65, 0, 23],
    [-5.05, -0.14, 0.6, 12.35],
    [-4.25, -1.35, 0.77, 12.5],
    [1.5, -0.18, 0.48, 13.3],
    [2.1, 1.75, -0.9, 16.8],
    [7.25, 2.03, 0.1, 10.9],
  ],
  [
    [0, 0.04, 0, 23.5],
    [-0.5, 0.62, 0, 21],
    [-3.35, -0.16, 0.36, 14.9],
    [4.95, 0.74, 0.2, 14.0],
    [4.95, 0.74, 0.2, 14.0],
    [6.45, -0.17, 0.53, 10.5],
  ],
];
export function createWorld(canvas) {
  const opts = { antialias: true, powerPreference: "high-performance" };
  const gl = canvas.getContext("webgl2", opts);
  if (!gl) throw Error("WebGL2 unavailable");
  const renderer = new T.WebGLRenderer({ canvas, context: gl, ...opts }),
    scene = new T.Scene();
  renderer.setClearColor(0x0a0a0a);
  const camera = new T.PerspectiveCamera(29, 1, 0.1, 500),
    palette = inks();
  const systems = [mark, studio, companion, fault].map((fn, i) => {
    const local = inks();
    local.uniforms.accent = palette.uniforms.accent;
    for (const k of ["face", "line"]) local[k].uniforms = local.uniforms;
    const system = fn(local);
    system.group.position.fromArray(sites[i]);
    scene.add(system.group);
    system.uniforms = local.uniforms;
    return system;
  });
  let width,
    height,
    mobile,
    keys = [];
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    mobile = width < 741;
    camera.aspect = width / height;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    const pose = (u, location, span, dir, shift = [0, -0.2]) => {
      const aim = new T.Vector3(...location),
        distance = span / (2 * Math.tan((29 * Math.PI) / 360) * camera.aspect);
      const eye = aim
        .clone()
        .add(new T.Vector3(...dir).normalize().multiplyScalar(distance));
      return { u, aim, eye, shift };
    };
    keys = [
      pose(
        0,
        sites[0],
        mobile ? 14 : 20.9,
        [0.13, 0.19, 1],
        mobile ? [0, -0.43] : [-0.37, -0.12],
      ),
    ];
    for (let a = 0; a < 3; a++)
      shots[a].forEach(([x, y, z, span], b) => {
        const loc = [x + sites[a + 1][0], y, z + sites[a + 1][2]],
          angle = b === 0 ? [0.105, 0.35, 1] : [0.07, b === 2 ? 0.16 : 0.27, 1];
        keys.push(
          pose(starts[a] + b, loc, span * (mobile ? 1.08 : 1), angle, [
            0,
            mobile ? -0.39 : -0.18,
          ]),
        );
      });
    keys.push(
      pose(23, [0, -0.35, -1], 68.4, [0, 0.33, 1], [0, mobile ? -0.45 : -0.38]),
    );
  }
  resize();
  function screenPoint(position, site) {
    const v = new T.Vector3(...position);
    if (site !== undefined) {
      const sys = systems[site];
      v.multiply(sys.group.scale).add(sys.group.position);
    }
    v.project(camera);
    return { x: ((v.x + 1) * width) / 2, y: ((1 - v.y) * height) / 2, z: v.z };
  }
  function render(u, formation, loop = 0) {
    const f = frame(u),
      closing = ramp(u, 21.52, 23.0),
      gather = ramp(u, 23.18, 24.43),
      active = f.kind === "act" ? f.a + 1 : 0;
    let j = keys.findIndex((k) => k.u > u);
    if (j < 0) j = keys.length;
    const a = keys[Math.max(0, j - 1)],
      b = keys[Math.min(j, keys.length - 1)];
    const p = b === a ? 0 : ramp(u, a.u + (a.u === 0 ? 0.15 : 0.45), b.u);
    camera.position.lerpVectors(a.eye, b.eye, p);
    camera.lookAt(new T.Vector3().lerpVectors(a.aim, b.aim, p));
    camera.updateProjectionMatrix();
    camera.projectionMatrix.elements[8] = T.MathUtils.lerp(
      a.shift[0],
      b.shift[0],
      p,
    );
    camera.projectionMatrix.elements[9] = T.MathUtils.lerp(
      a.shift[1],
      b.shift[1],
      p,
    );
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    camera.updateMatrixWorld();
    const sig = systems[0];
    if (u < 15) {
      sig.uniforms.mist.value = mobile ? 0.001 : 0.012;
      sig.uniforms.distantFade.value = mobile ? 0 : 0.052;
      sig.group.position.fromArray(sites[0]);
      sig.group.scale.setScalar(1);
      sig.update(formation, ramp(u, 0.14, 1.74), 1 - ramp(u, 1.42, 1.97));
    } else {
      sig.group.position.set(14, mobile ? -17 : -17.5, 1);
      sig.group.scale.setScalar(1.52);
      sig.uniforms.mist.value = 0.001;
      sig.uniforms.distantFade.value = 0.0;
      sig.update(gather, 0, gather);
    }
    for (let i = 1; i < 4; i++) {
      const sys = systems[i],
        t = u - starts[i - 1];
      const visible = Math.max(
        ramp(t, -1.55, -0.33) * (1 - ramp(t, 5.62, 7.25)),
        closing,
      );
      sys.group.visible = visible > 0.0001;
      sys.group.scale.y = 1 + closing * 0.49;
      sys.uniforms.mist.value = 0.004;
      sys.uniforms.distantFade.value = 0.024;
      sys.uniforms.focalDepth.value = camera.position.distanceTo(b.aim);
      sys.uniforms.siteInk.value = visible;
      if (sys.group.visible) {
        const phase = (loop + [0, 0.32, 0.6][i - 1]) % 1;
        const demo = [
          1.45 + 0.54 * (0.5 - 0.5 * Math.cos(phase * 2 * Math.PI)),
          1.46 + 0.54 * (0.5 - 0.5 * Math.cos(phase * 2 * Math.PI)),
          3.46 + 0.54 * (0.5 - 0.5 * Math.cos(phase * 2 * Math.PI)),
        ][i - 1];
        sys.update(T.MathUtils.lerp(clamp(t, -1, 5.43), demo, closing));
      }
    }
    renderer.render(scene, camera);
    const fade = shotInk(u, f);
    projectFaces(systems, camera, width, height, active, false, fade);
    const notes = active ? systems[active].labels : [];
    return {
      notes,
      site: active,
      project: (pos) => screenPoint(pos, active),
      endpoint:
        active && f.b
          ? screenPoint(systems[active].endpoints[f.b], active)
          : null,
      ports: [1, 2, 3].map((i) => screenPoint([0, -1.7, 0.5], i)),
      signature: screenPoint([-0.8, 0, 0], 0),
      closing,
      gather,
      fade,
    };
  }
  function accent(hex) {
    const n = parseInt(hex.slice(1), 16);
    palette.uniforms.accent.value.set(
      (n >> 16) / 255,
      ((n >> 8) & 255) / 255,
      (n & 255) / 255,
    );
  }
  return { render, resize, accent, renderer, systems };
}
