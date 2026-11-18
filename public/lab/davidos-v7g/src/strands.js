// Shared linework. Curves carry a finite packet; depth and width separate its filaments.
import * as T from "../vendor/three.module.min.js";
import { Drawing, lerp } from "./drawing.js";
import { clamp, ramp } from "./story.js";
export const vec = (p) => new T.Vector3(...p);
export function sculpt(m) {
  const group = new T.Group(),
    labels = [];
  function part(draw, position = [0, 0, 0]) {
    const d = new Drawing();
    draw(d);
    const exposure = { value: 1 };
    const material = {};
    for (const key of ["face", "line"]) {
      material[key] = m[key].clone();
      material[key].uniforms = { ...m.uniforms, exposure };
    }
    const obj = d.build(material);
    obj.position.fromArray(position);
    group.add(obj);
    obj.ink = (v) => {
      exposure.value = v;
      obj.visible = v > 0.001;
    };
    return obj;
  }
  function words(position, html, beats = [0], offset = [0, -12], css = "") {
    const el = document.createElement("div");
    el.className = "notation " + css;
    el.innerHTML = html;
    const leader = document.createElement("i");
    leader.className = "leader";
    document.querySelector("#surfaces").append(leader, el);
    const item = { position, el, leader, beats, offset, amount: 1 };
    labels.push(item);
    return item;
  }
  return { group, labels, part, words, faces: [] };
}
export function ring(d, x, y, z, rx, ry, ink = -0.6, depth = 0) {
  const p = [];
  for (let i = 0; i < 64; i++) {
    const a = (2 * Math.PI * i) / 64;
    p.push([
      x + rx * Math.cos(a),
      y + ry * Math.sin(a),
      z + depth * Math.sin(a),
    ]);
  }
  d.path(p, ink, true);
}
export function box(d, x, y, z, w, h, depth, ink = -0.6, fill = 0) {
  const r = (k) => [
    [x, y, z + k],
    [x + w, y, z + k],
    [x + w, y + h, z + k],
    [x, y + h, z + k],
  ];
  const f = r(0),
    b = r(-depth);
  if (fill) {
    d.quad(...f, fill);
    d.quad(f[2], b[2], b[3], f[3], fill * 0.8);
  }
  d.path(f, ink, true);
  d.path(b, ink * 0.68, true);
  f.forEach((v, i) => d.line(v, b[i], ink * 0.65));
}
export function cable(
  d,
  pts,
  n = 18,
  spread = 0.22,
  ink = 0.77,
  { twist = 0.55, fray = 0 } = {},
) {
  const curve = new T.CatmullRomCurve3(pts.map(vec)),
    path = curve.getPoints(80);
  for (let j = 0; j < n; j++) {
    const a = (j / (n - 1 || 1)) * Math.PI * 2;
    const line = path.map((p, k) => {
      const t = k / 80,
        theta = a + twist * t * 2 * Math.PI;
      const radius =
        spread * (0.75 + 0.25 * Math.cos(a * 3)) * (1 + fray * t * t * t);
      return [
        p.x,
        p.y + Math.sin(theta) * radius,
        p.z + Math.cos(theta) * radius * 1.5,
      ];
    });
    d.path(line, ink * (0.45 + 0.55 * (0.5 + 0.5 * Math.cos(a))));
  }
}
export function packet(s, coords, n = 20, spread = 0.19) {
  const curve = new T.CatmullRomCurve3(coords.map(vec));
  // A moving range of segments traverses the same pre-sampled curve as the quiet guide.
  const count = 128,
    rings = [];
  for (let i = 0; i <= count; i++) {
    const p = curve.getPointAt(i / count);
    rings.push(
      Array.from({ length: n }, (_, j) => {
        const a = (j / n + (i / count) * 0.65) * 2 * Math.PI;
        return [
          p.x,
          p.y + spread * Math.sin(a),
          p.z + spread * 1.5 * Math.cos(a),
        ];
      }),
    );
  }
  const obj = s.part((g) => {
    for (let i = 0; i < count; i++)
      for (let j = 0; j < n; j++)
        g.line(rings[i][j], rings[i + 1][j], 0.62 + (0.36 * j) / n);
  });
  return function (progress, amount = 1) {
    const head = clamp(progress) * 1.36,
      lo = Math.min(count, Math.floor(Math.max(0, head - 0.36) * count)),
      hi = Math.min(count, Math.floor(head * count));
    obj.children[0].geometry.setDrawRange(
      lo * n * 2,
      Math.max(0, (hi - lo) * n * 2),
    );
    obj.ink(amount);
  };
}
export const stage = (t, b) => clamp((t - b + 0.55) / 0.55);
export const sceneBeat = (t) => clamp(Math.floor(t + 0.55 - 1e-8), 0, 5);
export const weight = (t, b) =>
  ramp(t, b - 0.55, b - 0.34) * (1 - ramp(t, b + 0.45, b + 0.64));
export function table(headers, rows) {
  return (
    "<table><thead><tr>" +
    headers.map((k) => "<th>" + k + "</th>").join("") +
    "</tr></thead><tbody>" +
    rows
      .map(
        (row) =>
          "<tr>" + row.map((v) => "<td>" + v + "</td>").join("") + "</tr>",
      )
      .join("") +
    "</tbody></table>"
  );
}
