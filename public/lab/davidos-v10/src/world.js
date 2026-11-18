import * as T from "../vendor/three.module.min.js";
import { createOpening } from "./opening.js";
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
    [-4.1, 0.1, 0, 16.8],
    [-3.75, 0.56, -0.1, 17.9],
    [0.18, 2.19, -0.45, 10.9],
    [3.3, 0.62, 0, 16.6],
    [0.27, -0.5, 0.2, 12.8],
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
    [0, 0.2, 0, 23.6],
    [-0.12, -0.04, 0.25, 22.6],
    [4.95, 0.74, 0.2, 14.0],
    [4.95, 0.74, 0.2, 14.0],
    [5.55, 0.37, 0.4, 12.5],
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
  const opening = createOpening(systems.slice(1).map(system => system.folio));
  const closingCamera = camera.clone();
  let width,
    height,
    mobile,
    keys = [];
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    for (const sys of systems) sys.uniforms.viewport.value.set(width, height);
    mobile = width < 741;
    opening.resize(width,height);
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
        mobile ? [0, -0.16] : [-0.37, -0.12],
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
    keys.push(pose(23, [0, 0, 0], mobile ? 33 : 61, [0, 0.29, 1], [0, 0]));
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
  function render(u, formation, loop = 0, idleTime = 0, light = 1) {
    const ratio = Math.min(devicePixelRatio, u < 1.8 ? 3 : 2);
    if (renderer.getPixelRatio() !== ratio) renderer.setPixelRatio(ratio);
    const f = frame(u),
      closing = ramp(u, 21.52, 23.0),
      gather = ramp(u, 23.18, 24.43),
      active = f.kind === "act" ? f.a + 1 : 0;
    let j = keys.findIndex((k) => k.u > u);
    if (j < 0) j = keys.length;
    const a = keys[Math.max(0, j - 1)],
      b = keys[Math.min(j, keys.length - 1)];
    const p =
      b === a
        ? 0
        : ramp(
            u,
            a.u + (a.u === 0 ? 0.15 : 0.45),
            b.u === 6 ? 5.72 : b.u === 7 ? 6.74 : b.u,
          );
    camera.position.lerpVectors(a.eye, b.eye, p);
    const aim = new T.Vector3().lerpVectors(a.aim, b.aim, p);
    // The scoring arrival passes over the matrix before pulling back to the evidence.
    const near = mobile ? 0 : ramp(u, 12.45, 12.74) * (1 - ramp(u, 12.74, 13));
    if (near > 0) {
      const fieldAim = new T.Vector3(0.4, 2.18, -3.94);
      const distance =
        9.25 / (2 * Math.tan((29 * Math.PI) / 360) * camera.aspect);
      camera.position.lerp(
        fieldAim
          .clone()
          .addScaledVector(new T.Vector3(0.07, 0.32, 1).normalize(), distance),
        near,
      );
      aim.lerp(fieldAim, near);
    }
    camera.lookAt(aim);
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
    // Lay out the final section in the same world. Unproject sockets through the
    // settled camera so portrait and landscape share the same figure geometry.
    const dock = (x, y, depth = 0) => {
      const final = keys.at(-1);
      const cam = closingCamera;
      cam.position.copy(final.eye);
      cam.lookAt(final.aim);
      cam.aspect = camera.aspect;
      cam.updateProjectionMatrix();
      cam.updateMatrixWorld();
      const ray = new T.Vector3(x * 2 - 1, 1 - y * 2, 0.5)
        .unproject(cam)
        .sub(cam.position);
      return cam.position
        .clone()
        .addScaledVector(ray, (depth - cam.position.z) / ray.z);
    };
    const sig = systems[0];
    if (u < 15) {
      sig.uniforms.mist.value = mobile ? 0.001 : 0.012;
      sig.uniforms.distantFade.value = mobile ? 0 : 0.052;
      sig.group.position.fromArray(sites[0]);
      sig.group.scale.setScalar(1);
      if (u < 2) {
        const h = .03 + .496*ramp(u,1.68,1.80) + .424*ramp(u,1.80,1.98);
        sig.update(0,h,ramp(u,1.70,1.82)*(1-ramp(u,1.91,1.995)));
      } else sig.update(formation, ramp(u, 0.14, 1.74), 1 - ramp(u, 1.42, 1.97));
    } else {
      sig.group.position.copy(
        dock(mobile ? 0.5 : 0.335, mobile ? 0.676 : 0.735),
      );
      sig.group.scale.setScalar(mobile ? 1.37 : 1.4);
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
      ) * (u < 2 ? ramp(u,1.70,1.94) : 1);
      sys.group.visible = visible > 0.0001;
      sys.group.position.fromArray(sites[i]);
      if (closing > 0) {
        const x = mobile ? 0.259 : [0.181, 0.5, 0.819][i - 1];
        const y = mobile ? [0.208, 0.374, 0.54][i - 1] : 0.263;
        sys.group.position.lerp(dock(x, y), closing);
      }
      sys.group.scale.setScalar(1 + closing * (mobile ? -0.26 : -0.09));
      sys.uniforms.mist.value = 0.004;
      sys.uniforms.distantFade.value = 0.024;
      sys.uniforms.focalDepth.value = camera.position.distanceTo(b.aim);
      sys.uniforms.siteInk.value = visible;
      if (sys.group.visible || (i === 1 && u >= 1.60 && u < 2)) {
        const phase = (loop + [0.5, 0.5, 0.5][i - 1]) % 1;
        const demo = [
          1.6 + 0.4 * (0.5 - 0.5 * Math.cos(phase * 2 * Math.PI)),
          1.8 + 0.2 * (0.5 - 0.5 * Math.cos(phase * 2 * Math.PI)),
          3.68 + 0.32 * (0.5 - 0.5 * Math.cos(phase * 2 * Math.PI)),
        ][i - 1];
        sys.update(
          T.MathUtils.lerp(clamp(t, -1, i === 3 ? 5.43 : 6.32), demo, closing),
          closing,
        );
        if (closing && sys.gateway) sys.gateway.ink(1 - closing);
      }
    }
    renderer.render(scene, camera);
    let registration = null;
    if (u < 2) {
      const doc = systems[1].publicDocument;
      doc.updateWorldMatrix(true,false);
      const project = v => {
        const p = screenPoint(v.toArray());
        return new T.Vector3(p.x,p.y,0);
      };
      const docPoints = [[0,2],[1.25,2],[1.55,1.7],[1.55,0],[0,0]].map(
        ([x,y]) => project(new T.Vector3(x,y,0).applyMatrix4(doc.matrixWorld))
      );
      const geo=sig.centerRoute.geometry, positions=geo.attributes.position;
      const steps = positions.count / 14;
      const point = j => new T.Vector3().fromBufferAttribute(positions,j).applyMatrix4(sig.group.matrixWorld);
      // Use one physical vertex pair on the inlet side throughout the approach.
      // A view-dependent nearest sample would jump between segments as the camera moves.
      const i=2*(3*steps+Math.floor((steps-1)*.91));
      const joint=project(point(i)), tangent=project(point(i+2)).sub(joint).normalize();
      registration=opening.draw(renderer,u,idleTime,{doc:docPoints,joint,tangent},light);
    }
    const fade = shotInk(u, f) * (u < 2 ? ramp(u,1.86,1.985) : 1);
    projectFaces(systems, camera, width, height, active, false, fade);
    const notes = active ? systems[active].labels : [];
    return {
      registration,
      fieldCorners: systems[2].fieldCorners.map((corner) =>
        screenPoint(corner, 2),
      ),
      notes,
      site: active,
      project: (pos) => screenPoint(pos, active),
      endpoint:
        active && f.b
          ? screenPoint(systems[active].endpoints[f.b], active)
          : null,
      commit: screenPoint([2.05, 0.55, -0.18], 3),
      ports: [1, 2, 3].map((i) =>
        screenPoint(
          mobile
            ? [9, 0, 0]
            : [
                [-7.5, -1.6, 0.21],
                [0, -1.68, 0.8],
                [8.65, -0.6, 0.5],
              ][i - 1],
          i,
        ),
      ),
      windowEnd: systems[2].windowEnd,
      signature: screenPoint([-5.72, -0.1, 0.38], 0),
      closing,
      gather,
      fade,
    };
  }
  function accent(hex) {
    opening.accent(hex);
    const n = parseInt(hex.slice(1), 16);
    palette.uniforms.accent.value.set(
      (n >> 16) / 255,
      ((n >> 8) & 255) / 255,
      (n & 255) / 255,
    );
  }
  return { render, resize, accent, renderer, systems, opening };
}
