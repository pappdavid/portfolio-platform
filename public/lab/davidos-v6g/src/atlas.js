// A record has one coordinate system for its WebGL edges and its HTML face.
import * as T from "../vendor/three.module.min.js";
import { Drawing } from "./drawing.js";
import { clamp, ease } from "./story.js";

export const unit = 72;
export const step = (p, a, b) => ease((p - a) / (b - a));
export function table(headers, rows, highlight = -1) {
  return (
    "<table><thead><tr>" +
    headers.map((h) => "<th>" + h + "</th>").join("") +
    "</tr></thead><tbody>" +
    rows
      .map(
        (row, i) =>
          "<tr" +
          (i === highlight ? ' class="lit"' : "") +
          ">" +
          row.map((v) => "<td>" + v + "</td>").join("") +
          "</tr>",
      )
      .join("") +
    "</tbody></table>"
  );
}
export const heading = (label, value = "") =>
  '<div class="surface-title"><b>' +
  label +
  "</b><small>" +
  value +
  "</small></div>";
export const field = (name, value = "") =>
  '<div class="record-field"><small>' +
  name +
  "</small><div>" +
  value +
  "</div></div>";
export const point = (x, y, z) => new T.Vector3(x, y, z);
export function makeAtlas(materials) {
  const group = new T.Group(),
    faces = [];
  function surface(
    name,
    x,
    y,
    z,
    w,
    h,
    {
      rx = 0,
      ry = 0,
      rz = 0,
      depth = 0.055,
      ink = -0.66,
      fill = -0.065,
      draw,
      css = "",
    } = {},
  ) {
    const g = new Drawing();
    const ring = (d) => [
      [-w / 2, h / 2, d],
      [w / 2, h / 2, d],
      [w / 2, -h / 2, d],
      [-w / 2, -h / 2, d],
    ];
    const front = ring(0),
      back = ring(-depth);
    g.quad(...front, fill);
    g.path(front, ink, true);
    g.path(back, ink * 0.7, true);
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      g.quad(front[i], front[j], back[j], back[i], fill * 1.8);
      g.line(front[i], back[i], ink);
    }
    draw?.(g, w, h);
    const obj = g.build(materials);
    obj.position.set(x, y, z);
    obj.rotation.set(rx, ry, rz);
    group.add(obj);
    const el = document.createElement("section");
    el.className = "world-face " + css;
    el.setAttribute("aria-label", name);
    el.style.width = w * unit + "px";
    el.style.height = h * unit + "px";
    document.querySelector("#surfaces").append(el);
    const face = {
      obj,
      el,
      w,
      h,
      name,
      html: null,
      level: 1,
      set(html, level = 1, visible = true) {
        if (this.html !== html) {
          this.html = html;
          el.innerHTML = html;
        }
        if (this.level !== level)
          el.classList.toggle("quiet-face", level < 0.55);
        this.level = level;
        obj.visible = visible;
      },
    };
    faces.push(face);
    return face;
  }
  function path(coords, tone = -0.55, width = 0) {
    const g = new Drawing();
    g.path(coords, tone);
    if (width)
      for (let i = 1; i < coords.length; i++) {
        const p = coords[i - 1],
          q = coords[i],
          up = (v) => [v[0], v[1] + width, v[2]];
        g.quad(p, q, up(q), up(p), tone);
      }
    const obj = g.build(materials);
    group.add(obj);
    return obj;
  }
  function travel(face, coords, f) {
    const s = clamp(f) * (coords.length - 1),
      i = Math.min(Math.floor(s), coords.length - 2);
    face.obj.position.fromArray(coords[i]).lerp(point(...coords[i + 1]), s - i);
  }
  return { group, faces, surface, path, travel };
}

// Clip-space x, y and w define an exact plane homography in screen pixels.
// Use homogeneous coordinates so text follows the perspective of each thin record.
const vp = new T.Matrix4(),
  mvp = new T.Matrix4();
const view = new T.Vector3();
export function projectFaces(
  sets,
  camera,
  width,
  height,
  active,
  wide,
  travelFade,
) {
  vp.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  for (const [index, set] of sets.entries())
    for (const face of set.faces || []) {
      const { el, obj, w, h } = face;
      view
        .setFromMatrixPosition(obj.matrixWorld)
        .applyMatrix4(camera.matrixWorldInverse);
      const visible =
        obj.visible && view.z < -0.2 && (active === index || wide);
      if (!visible) {
        el.hidden = true;
        continue;
      }
      mvp.multiplyMatrices(vp, obj.matrixWorld);
      const m = mvp.elements;
      const cols = [0, 4].map((j, i) => {
        const k = (i ? -1 : 1) / unit / (i ? obj.scale.y : 1);
        return [
          (m[j] + m[j + 3]) * width * 0.5 * k,
          (-m[j + 1] + m[j + 3]) * height * 0.5 * k,
          0,
          m[j + 3] * k,
        ];
      });
      const origin = [0, 1, 2, 3].map(
        (i) => m[12 + i] - w * 0.5 * m[i] + h * 0.5 * m[4 + i],
      );
      const [x, y, , v] = origin;
      const values = [
        ...cols[0],
        ...cols[1],
        0,
        0,
        1,
        0,
        (x + v) * width * 0.5,
        (v - y) * height * 0.5,
        0,
        v,
      ];
      if (obj.scale.y !== 1 || face.scaled) {
        el.style.height = h * unit * obj.scale.y + "px";
        face.scaled = true;
      }
      el.style.transform = "matrix3d(" + values.join(",") + ")";
      el.style.zIndex = String(Math.max(0, Math.round(20000 + view.z * 30)));
      el.style.opacity = String(wide ? 0.86 : travelFade);
      el.style.filter =
        face.level < 0.95 && !wide ? "brightness(" + face.level + ")" : "none";
      el.hidden = false;
    }
}
