import * as T from "../vendor/three.module.min.js";
import { Drawing, inks, lerp } from "./drawing.js";
import { mark, studio, companion, fault } from "./machines.js";
import { clamp, ease, starts, frame } from "./story.js";
const sites = [
  [0, 0, 0],
  [3, 0, -25],
  [-4, 0, -51],
  [2, 0, -78],
];
const vector = (p) => new T.Vector3(...p);

export function createWorld(canvas) {
  const settings = {
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  };
  const context = canvas.getContext("webgl2", settings);
  if (!context) throw Error("WebGL2 is unavailable");
  const renderer = new T.WebGLRenderer({ canvas, context, ...settings });
  renderer.setClearColor(0x0a0a0a);
  const scene = new T.Scene(),
    camera = new T.PerspectiveCamera(27, 1, 0.15, 460),
    m = inks();
  const systems = [mark, studio, companion, fault].map((make, i) => {
    const s = make(m);
    s.group.position.fromArray(sites[i]);
    scene.add(s.group);
    return s;
  });
  const ground = new Drawing();
  for (let j = -70; j <= 70; j += 2)
    ground.line([j, 0.0, 28], [j, 0.0, -138], j % 10 === 0 ? -0.17 : -0.068);
  for (let j = -138; j <= 28; j += 2)
    ground.line([-70, 0.0, j], [70, 0.0, j], j % 10 === 0 ? -0.17 : -0.068);
  for (let z = -102; z <= 15; z += 4)
    for (let x = -26; x < 26; x += 4) {
      ground.line([x - 0.12, 0.012, z], [x + 0.12, 0.012, z], -0.3);
      ground.line([x, 0.012, z - 0.12], [x, 0.012, z + 0.12], -0.3);
    }
  // A continuous bundle enters and leaves the chassis of each instrument.
  for (let i = 0; i < 3; i++) {
    const [x, , z] = sites[i],
      [u, , v] = sites[i + 1];
    ground.tube(
      [
        [x + 4.7, 0.51, z - 0.69],
        [x + 6.45, 0.26, z - 2.2],
        [x + 6.9, 0.14, z - 7],
        [u - 7, 0.16, v + 7.3],
        [u - 6.7, 0.23, v + 2.4],
        [u - 4.7, 0.93, v + 0.6],
      ],
      76,
      1.34,
      (j) => (j % 13 === 0 ? 0.54 : j % 3 === 0 ? 0.28 : -0.17),
    );
  }
  scene.add(ground.build(m));
  const projection = (p) => {
    label.fromArray(p).project(camera);
    return { x: ((label.x + 1) * width) / 2, y: ((1 - label.y) * height) / 2 };
  };
  let width, height, mobile, plotFraction, aspect, keys;
  const eye = new T.Vector3(),
    target = new T.Vector3(),
    label = new T.Vector3();
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    mobile = innerWidth <= 740;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    aspect = width / height;
    camera.aspect = aspect;
    plotFraction = mobile ? 0.89 : 0.599;
    const dist = (span) =>
      span / (2 * Math.tan((Math.PI * 27) / 360) * aspect * plotFraction);
    const pose = (u, site, point, dir, span) => {
      const aim = vector(sites[site]).add(vector(point));
      return {
        u,
        aim,
        eye: aim
          .clone()
          .add(vector(dir).normalize().multiplyScalar(dist(span))),
      };
    };
    keys = [
      pose(0, 0, [0, 2.23, 0], [0.34, 0.39, 1], 13.6),
      pose(0.34, 0, [0, 2.26, 0], [0.26, 0.34, 1], 11.9),
      { u: 0.99, eye: vector([0.0, 4.45, 1.08]), aim: vector([2.4, 2.3, -17]) },
      pose(2, 1, [0, 1.48, 0], [0.48, 0.5, 1], 14.5),
    ];
    const shots = [
      [
        [-2.23, 1.9, 0.05, 0.28, 0.45, 10.6],
        [-1.95, 2.02, 0.03, 0.38, 0.53, 9.4],
        [0.1, 1.85, 0.07, 0.52, 0.32, 9.65],
        [2.21, 1.85, 0.0, 0.64, 0.53, 9.3],
        [2.01, 1.86, 0.25, 0.69, 0.38, 9.15],
      ],
      [
        [-2.09, 2.15, 0, 0.35, 0.29, 10.7],
        [-1.61, 2.19, 0, 0.2, 0.34, 10.1],
        [0.04, 2.23, 0, -0.15, 0.35, 10.0],
        [2.06, 1.88, 0, -0.35, 0.47, 9.55],
        [2.12, 1.87, 0, -0.46, 0.35, 9.25],
      ],
      [
        [0.54, 1.85, 0, 0.29, 0.49, 12.1],
        [0.78, 1.5, 0.65, 0.24, 0.35, 10.9],
        [1.16, 1.86, 0.15, 0.38, 0.58, 11.5],
        [0.09, 1.75, 0.16, 0.22, 0.65, 12.2],
        [1.98, 2.15, -0.08, 0.41, 0.41, 9.85],
      ],
    ];
    for (let a = 0; a < 3; a++) {
      const start = starts[a];
      if (a > 0)
        keys.push(
          pose(
            start,
            a + 1,
            [0, 1.58, 0],
            a === 1 ? [0.32, 0.43, 1] : [0.37, 0.56, 1],
            14.5,
          ),
        );
      shots[a].forEach(([x, y, z, h, v, w], j) =>
        keys.push(pose(start + 1 + j, a + 1, [x, y, z], [h, v, 1], w)),
      );
      if (a < 2) {
        const cur = sites[a + 1],
          next = sites[a + 2];
        keys.push({
          u: start + 6.02,
          eye: vector([next[0] + 15.6, 11.8, next[2] + 18]),
          aim: vector([next[0] + 0.75, 1.12, next[2] + 1.1]),
        });
      }
    }
    const wide = (u, span, dir) => {
      const aim = vector([0, 0, -38]);
      return {
        u,
        aim,
        eye: aim
          .clone()
          .add(vector(dir).normalize().multiplyScalar(dist(span))),
      };
    };
    keys.push(
      { u: 21.85, eye: vector([16, 16, -55]), aim: vector([0, 1, -70]) },
      wide(23.45, 76, [1, 0.92, 0.86]),
      wide(24.5, 77, [1, 0.96, 0.82]),
    );
    keys.sort((a, b) => a.u - b.u);
  }
  resize();
  function render(u, intro = 1) {
    const f = frame(u);
    systems.forEach((s, i) =>
      s.update(i ? clamp(u - starts[i - 1], 0, 5) : u, intro),
    );
    let i = keys.findIndex((k, j) => j < keys.length - 1 && u <= keys[j + 1].u);
    if (i < 0) i = keys.length - 2;
    const a = keys[i],
      b = keys[i + 1],
      t = clamp((u - a.u) / (b.u - a.u));
    // Cubic Hermite track. Central differences make position and heading continuous
    // even where the rail changes direction; shorter handles keep it inside the set.
    function spline(out, key) {
      const prev = keys[Math.max(0, i - 1)],
        next = keys[Math.min(keys.length - 1, i + 2)],
        dt = b.u - a.u;
      const p = a[key],
        q = b[key],
        l = prev[key],
        r = next[key],
        t2 = t * t,
        t3 = t * t * t;
      out
        .copy(p)
        .multiplyScalar(2 * t3 - 3 * t2 + 1)
        .addScaledVector(q, 3 * t2 - 2 * t3);
      const v1 = (((t3 - 2 * t2 + t) * dt) / (b.u - prev.u)) * 0.68,
        v2 = (((t3 - t2) * dt) / (next.u - a.u)) * 0.68;
      out
        .addScaledVector(q, v1)
        .addScaledVector(l, -v1)
        .addScaledVector(r, v2)
        .addScaledVector(p, -v2);
    }
    spline(eye, "eye");
    spline(target, "aim");
    camera.position.copy(eye);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.projectionMatrix.elements[8] = mobile ? 0 : -0.36;
    camera.projectionMatrix.elements[9] = mobile ? 0.015 : -0.02;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    m.uniforms.mist.value = lerp(0.016, 0.0036, ease((u - 21.75) / 1.8));
    m.uniforms.focalDepth.value = eye.distanceTo(target);
    m.uniforms.distantFade.value = 0.065 * (1 - ease((u - 21.5) / 1.85));
    renderer.render(scene, camera);
    if (f.kind === "act" && f.b > 0) {
      const item = systems[f.a + 1].payload;
      item.getWorldPosition(label);
      label.y += 0.2;
      label.project(camera);
      return {
        x: ((label.x + 1) * width) / 2,
        y: ((1 - label.y) * height) / 2,
      };
    }
  }
  function accent(hex) {
    const n = parseInt(hex.slice(1), 16);
    m.uniforms.accent.value.set(
      (n >> 16) / 255,
      ((n >> 8) & 255) / 255,
      (n & 255) / 255,
    );
  }
  function tags(f, u) {
    if (f.kind === "index" || (f.kind === "closing" && u > 23.1))
      return sites.map(([x, y, z], i) => ({
        ...projection([x, y + 3.5, z]),
        name: ["A", "B", "C", "D"][i],
      }));
    if (f.kind === "act" && !f.b && Math.abs(f.t) < 0.56) {
      const [x, , z] = sites[f.a + 1],
        parts = [
          [
            [-3.8, 2.65, -0.8, "Sources"],
            [3.7, 3.2, -0.45, "Snapshot"],
          ],
          [
            [-3.48, 3.9, -0.35, "Transcript"],
            [3.7, 2.14, -0.4, "Reference card"],
          ],
          [
            [-3.8, 2.74, -0.34, "Sender"],
            [3.48, 3.39, -0.44, "Receiver"],
          ],
        ][f.a];
      return parts.map(([dx, y, dz, name]) => ({
        ...projection([x + dx, y, z + dz]),
        name,
      }));
    }
    return [];
  }
  return { render, resize, accent, renderer, tags };
}
