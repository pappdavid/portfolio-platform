import * as T from "../vendor/three.module.min.js";
import { Drawing, inks, lerp } from "./drawing.js";
import { mark } from "./machines.js";
import { studio } from "./studio.js";
import { companion } from "./companion.js";
import { fault } from "./fault.js";
import { projectFaces } from "./atlas.js";
import { clamp, ease, starts, frame } from "./story.js";
const sites = [
  [0, 0, 0],
  [3, 0, -17],
  [-4, 0, -35],
  [2, 0, -53],
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
    plotFraction = mobile ? 0.84 : 0.566;
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
      { u: 0.99, eye: vector([0.0, 4.45, 1.08]), aim: vector([2.4, 2.3, -12]) },
      pose(2, 1, [0.0, 2.55, -0.3], [0.39, 0.32, 1], 15.7),
    ];
    const shots = [
      [
        [-2.6, 1.65, 0.65, 0.2, 0.21, 8.5],
        [-2.04, 3.1, 0.32, 0.09, 0.09, 6.5],
        [0.07, 2.85, -0.5, 0.32, 0.4, 8.4],
        [2.24, 2.14, -0.15, -0.2, 0.25, 9.8],
        [-1.45, 1.41, 0.65, 0.25, 0.16, 8.7],
      ],
      [
        [-3.1, 1.48, 1.43, 0.18, 0.36, 9.9],
        [-3.05, 0.29, 1.75, 0.06, 0.1, 9.7],
        [0.42, 2.11, 1, 0.12, 0.18, 8.44],
        [2.77, 2.53, -0.05, -0.18, 0.27, 11.4],
        [4.78, 3.26, -0.4, -0.21, 0.24, 8.4],
      ],
      [
        [-0.14, 1.5, 0.12, 0.25, 0.36, 13.9],
        [-1.7, 1.1, 0.45, 0.12, 0.24, 10.6],
        [3.72, 1.39, 0.44, 0.2, 0.1, 8.05],
        [3.66, 0.57, 0.88, -0.16, 0.18, 8.45],
        [2.72, 1.85, 0.32, 0.02, 0.2, 9.95],
      ],
    ];
    for (let a = 0; a < 3; a++) {
      const start = starts[a];
      if (a > 0)
        keys.push(
          pose(
            start,
            a + 1,
            [0, a === 1 ? 2.05 : 0.55, 0],
            a === 1 ? [0.32, 0.43, 1] : [0.37, 0.56, 1],
            a === 1 ? 17.1 : 15.6,
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
      const aim = vector([0, 1.2, -27]);
      return {
        u,
        aim,
        eye: aim
          .clone()
          .add(vector(dir).normalize().multiplyScalar(dist(span))),
      };
    };
    keys.push(
      { u: 21.85, eye: vector([15, 15, -35]), aim: vector([1, 1, -48]) },
      wide(23.45, 48, [0.92, 0.86, 1.22]),
      wide(24.5, 49, [0.95, 0.89, 1.22]),
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
    // Fade distant chapters away during the take. Keep only the destination in close views.
    systems.forEach((s, j) => {
      const center = j ? starts[j - 1] : 0;
      s.group.visible =
        u > 21.5 ||
        (j === 0 ? u < 2.1 : u >= center - 1.65 && u <= center + 6.65);
    });
    renderer.render(scene, camera);
    const active = f.kind === "act" ? f.a + 1 : 0;
    const fade =
      f.kind === "act"
        ? Math.min(
            1,
            Math.max(0, (6.35 - f.t) * 1.8),
            Math.max(0, (f.t + 1.2) * 1.7),
          )
        : 1;
    projectFaces(
      systems,
      camera,
      width,
      height,
      active,
      f.kind === "index" || f.kind === "closing",
      fade,
    );
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
    if (f.kind === "act" && f.b === 0 && Math.abs(f.t) < 0.54) {
      const labels = [
        [
          ["Studio page", 0, 1],
          ["PostgreSQL · sources", 4, 0],
          ["Audience filter · retrieval", 3, 1],
          ["Server route · session", 2, 1],
          ["Command handler", 2, 0],
          ["Frozen snapshot", 8, 0],
          ["Customer runtime", 1, 1],
          ["Model gateway · off", 9, 0],
        ],
        [
          ["Transcript", 0, 0],
          ["SlidingWindow · 30 s", 1, 1],
          ["IntentClassifier", 9, 1],
          ["Knowledge base", 14, 0],
          ["TF-IDF retrieval", 24, 0],
          ["Evidence card", 25, 1],
          ["Model · local lab only", 27, 0],
          ["Card list", 26, 1],
        ],
        [
          ["Client", 0, 0],
          ["Request · before commit", 8, 0],
          ["Receiver · baseline / fixed", 1, 0],
          ["Visits", 2, 1],
          ["Receipts · fixed only", 5, 1],
          ["Reply · after commit", 9, 1],
          ["Trace", 6, 1],
        ],
      ];
      const faces = systems[f.a + 1].faces;
      return labels[f.a].map(([name, n, lane]) => {
        const surface = faces[n];
        surface.obj.getWorldPosition(label);
        label.y += surface.h * (lane ? -0.46 : 0.46);
        return { ...projection(label.toArray()), name, lane };
      });
    }
    return [];
  }
  return { render, resize, accent, renderer, tags };
}
