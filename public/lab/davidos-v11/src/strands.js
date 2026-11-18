// Shared linework. Curves carry a finite packet; depth and width separate its filaments.
import * as T from "../vendor/three.module.min.js";
import { Drawing } from "./drawing.js";
import { filamentMesh } from "./filaments.js";
import { ease, clamp, ramp } from "./story.js";
export function sculpt(m) {
  const group = new T.Group();
  function part(draw, position = [0, 0, 0]) {
    const d = new Drawing();
    d.bundles = [];
    draw(d);
    const exposure = { value: 1 };
    const material = {};
    for (const key of ["face", "line"]) {
      material[key] = m[key].clone();
      material[key].uniforms = { ...m.uniforms, exposure };
    }
    const obj = d.build(material);
    for (const bundle of d.bundles) {
      obj.add(
        filamentMesh(
          bundle.coords,
          bundle.count,
          bundle.spread,
          material.line.uniforms,
          bundle.options,
        ),
      );
    }
    obj.position.fromArray(position);
    group.add(obj);
    obj.ink = (v) => {
      exposure.value = v;
      obj.visible = v > 0.001;
    };
    return obj;
  }
  return { group, part };
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
  coords,
  count = 18,
  spread = 0.22,
  ink = 0.77,
  options = {},
) {
  d.bundles.push({
    coords,
    count,
    spread,
    options: { ...options, tinted: ink > 0 },
  });
}
// In each integer beat the first 45% is a reading hold. Integrating only
// the traveling intervals makes an afterimage continuous across that hold.
function motionClock(t) {
  return Math.floor(t) * 0.55 + Math.max(0, t - Math.floor(t) - 0.45);
}
export function packet(s, coords, count = 20, spread = 0.19, options = {}) {
  const obj = s.part((d) =>
    cable(d, coords, count, spread, 1, { ...options, active: true }),
  );
  const uniforms = obj.children[0].material.uniforms;
  // Repeated attempts can share the path while the previous tail is cooling.
  const clockAt = (beat, offset) => (beat - 1 + offset) * 0.55 * 1.63;
  const flights = options.flights?.map(([beat, start, end]) => ({
    start: clockAt(beat, start),
    duration: (end - start) * 0.55 * 1.63,
  }));
  return function (t, beat, launch = 0, arrival = 0.8) {
    const now = motionClock(t) * 1.63;
    let elapsed,
      duration,
      previous = -1;
    if (flights) {
      let index = flights.length - 1;
      while (index > 0 && flights[index].start > now) index--;
      elapsed = now - flights[index].start;
      duration = flights[index].duration;
      if (index > 0) {
        const prior = flights[index - 1];
        if (now - prior.start < prior.duration + 0.8) {
          previous = now - prior.start;
          uniforms.earlierDuration.value = prior.duration;
        }
      }
    } else {
      elapsed = now - clockAt(beat, launch);
      duration = (arrival - launch) * 0.55 * 1.63;
    }
    uniforms.earlierElapsed.value = previous;
    uniforms.elapsed.value = elapsed;
    uniforms.duration.value = duration;
    obj.ink((elapsed > 0 && elapsed < duration + 0.81) || previous > 0 ? 1 : 0);
    return ease(elapsed / duration);
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
