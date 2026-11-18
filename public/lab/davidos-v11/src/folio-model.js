import * as T from "../vendor/three.module.min.js";
import { inks } from "./drawing.js";
import { filamentMesh } from "./filaments.js";
import { studio } from "./studio.js";
import { companion } from "./companion.js";
import { fault } from "./fault.js";

export function mountModel(index, accent) {
  const ink = inks(),
    u = ink.uniforms;
  u.accent = accent;
  u.mist.value = 0;
  u.distantFade.value = 0;
  for (const m of [ink.line, ink.face]) m.uniforms = u;
  const model = [studio, companion, fault][index](ink);
  const signals = model.pulses.map(([path, count, spread, options]) =>
    filamentMesh(path, count, spread, u, { ...options, active: true }),
  );
  model.group.add(...signals);
  model.group.traverse((n) => {
    if (n.isInstancedMesh) {
      n.visible = false;
      return;
    }
    const mat = n.material;
    if (!mat) return;
    if (mat.uniforms?.tinted) mat.uniforms.tinted.value = 1;
    if (mat.uniforms?.dpr)
      mat.uniforms.dpr.value = Math.min(devicePixelRatio, 3);
    // Opaque faces provide their own depth. Thin ribbons retain normal depth testing.
    if (mat.transparent) {
      mat.depthWrite = false;
      n.renderOrder = 3;
    }
  });
  const tilt = new T.Group(),
    origin = new T.Group(),
    root = new T.Group();
  tilt.rotation.set(0.43, -0.1, -0.014);
  tilt.add(model.group);
  origin.add(tilt);
  root.add(origin);
  // Fixed bounds from the fixture. The drawing never rescales when an event releases a row.
  const bounds = [
    [-9.7, 9.55, -2.48, 3.55],
    [-9.45, 9.45, -2.16, 4.2],
    [-12.2, 9.95, -1.72, 2.91],
  ][index];
  function place(
    x,
    y,
    w,
    h,
    screenW,
    screenH,
    beat = 0,
    phase = 1,
    time = 0,
    live = true,
  ) {
    root.visible = w > 0 && h > 0;
    if (!root.visible) return;
    const [xmin, xmax, ymin, ymax] = bounds,
      dx = xmax - xmin,
      dy = ymax - ymin;
    const sx = Math.min(w / dx, (1.9 * h) / dy),
      sy = Math.min(h / dy, (1.4 * w) / dx);
    root.position.set(x + w / 2, -y - h / 2, 0.9);
    origin.scale.set(sx, sy, 0.045);
    tilt.position.set(-(xmin + xmax) / 2, -(ymin + ymax) / 2, 0);
    u.viewport.value.set(
      screenW * (w < 400 ? 1.4 : 1.08),
      screenH * (w < 400 ? 1.4 : 1.08),
    );
    u.siteInk.value = 1.75;
    model.update(beat ? beat - 0.55 + 0.55 * phase : 0, beat, phase);
    const clock = (time + 4.2 - index * 0.97) % 4.2;
    signals.forEach((m, j) => {
      m.visible = live;
      m.material.uniforms.elapsed.value = clock - j * 0.64;
      m.material.uniforms.duration.value = 1.28;
    });
  }
  function inkPoint(point = model.pulses[0][0][0]) {
    const pt = new T.Vector3(...point);
    model.group.localToWorld(pt);
    root.parent.worldToLocal(pt);
    return [pt.x, -pt.y];
  }
  return { root, place, inkPoint };
}
