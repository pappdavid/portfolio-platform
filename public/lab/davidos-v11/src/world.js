import * as T from "../vendor/three.module.min.js";
import { device, sheet } from "./folio-sheet.js";
import { Print, printed, loadFont } from "./folio-text.js";
import { mountModel } from "./folio-model.js";
import {
  names,
  record,
  results,
  resultDetails,
  short,
  ownership,
  chartKey,
} from "./folio-records.js";
import { bounds, coverPrint } from "./folio-layout.js";
import { acts, starts, clamp } from "./story.js";
const smooth = (v, a, b) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, k) => a + (b - a) * k;
const blend = (a, b, t) => a.map((v, i) => mix(v, b[i], t));
// Focus positions are local to the model, in the same units as its routes and row lattices.
const focalStations = [
  [
    [-7.6, 0.15, 0.3],
    [-1, 1.82, -0.85],
    [2.88, 1.62, -0.46],
    [4.55, 1.24, -0.55],
    [-0.82, -0.55, 0.45],
  ],
  [
    [-6.62, -0.25, 0.65],
    [1.0, -1.66, 0.8],
    [5.4, -0.07, 0.45],
    [5.42, 1.22 + 0.2702 * 6.4, -0.5],
    [6.78, 3.52, -0.4],
  ],
  [
    [2.65, 2.13, 0],
    [-2.13, -0.97, 1.1],
    [2.65, 1.6, 0.17],
    [3.64, -0.57, 0.6],
    [5, -1.03, 0.59],
  ],
];
export async function createWorld(canvas) {
  const d = device(canvas),
    font = await loadFont(),
    cover = sheet(font, d.accent, "", false);
  const sheets = names.map((n) => sheet(font, d.accent, n));
  const frontModels = names.map((_, i) => mountModel(i, d.accent)),
    models = names.map((_, i) => mountModel(i, d.accent));
  const layers = [],
    hits = [];
  let focus = "",
    current = [],
    hover = [0, 0],
    aim = [0, 0],
    W,
    H,
    view;
  canvas.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse")
      aim = [clamp(e.clientX / W) * 2 - 1, clamp(e.clientY / H) * 2 - 1];
  });
  canvas.addEventListener("pointerleave", () => {
    aim = [0, 0];
  });
  function layer(s) {
    const l = printed(font, d.accent);
    s.local.add(l.group);
    l.group.position.z = 1.7;
    layers.push(l);
    return l;
  }
  const coverInk = layer(cover),
    cursor = layer(cover),
    selection = layer(cover),
    coverFocus = layer(cover);
  const seam = layer(sheets[0]);
  const leader = sheets.map(layer),
    chartInk = sheets.map(layer),
    ink = sheets.map(layer),
    previous = sheets.map(layer),
    final = sheets.map(layer),
    focusInk = sheets.map(layer);
  d.scene.add(cover.root, ...sheets.map((s) => s.root));
  frontModels.forEach((m) => cover.local.add(m.root));
  models.forEach((m, i) => sheets[i].local.add(m.root));
  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    d.resize(W, H);
    view = bounds(W, H);
  }
  function cached(l, key, fn) {
    if (l.key !== key) {
      const data = fn();
      l.set(data);
      l.items = data.items;
      l.key = key;
    }
  }
  function show(l, a) {
    l.group.visible = a > 0.001;
    l.alpha.value = clamp(a);
  }
  function place(s, pose, selected) {
    const [x, y, w, h, z, yaw, pitch, roll] = pose;
    s.size(w, h, selected, view.phone);
    d.pose(s.root, x + w / 2, y + h / 2, z, yaw, pitch, roll);
  }
  function render(u, time = 0) {
    const { x, w, h, top, bottom, phone, coverTop } = view,
      who = ownership(u);
    const fade = smooth(u, 0.225, 0.7),
      end = smooth(u, 21.45, 23);
    const owner = who.index === 3 ? 2 : Math.max(0, who.index);
    current = [];
    hits.length = 0;
    hover = hover.map((v, i) => mix(v, aim[i], 0.075));
    const ch = bottom - coverTop,
      cp = [
        x - w * 0.29 * fade,
        coverTop,
        w,
        ch,
        115,
        fade * -104 + hover[0] * (1 - fade) * 0.8,
        hover[1] * (1 - fade) * 0.6,
        0,
      ];
    cover.root.visible = u < 0.7;
    if (cover.root.visible) {
      place(cover, cp, true);
      const { p, diagrams, bar, dy } = coverPrint(w, ch, phone);
      const focused = names.indexOf(focus);
      show(coverFocus, focused >= 0 && u <= 0.22 ? 1 : 0);
      if (focused >= 0)
        cached(coverFocus, [focused, w, ch].join(), () => {
          const p = new Print();
          p.line(
            11,
            bar + dy * focused + 3,
            w - 11,
            bar + dy * focused + 3,
            "accent",
            2,
          );
          return p;
        });
      cached(coverInk, [w, ch].join(), () => p);
      cached(cursor, [w, ch].join(), () => {
        const g = new Print(),
          f = phone ? 15 : 22;
        g.rect(
          (phone ? 11 : 30) + 26 * f * 0.6 + 6,
          phone ? 12 : 24,
          f * 0.49,
          f * 0.84,
          "accent",
        );
        return g;
      });
      show(cursor, time % 1.14 < 0.73 ? 1 : 0);
      cached(selection, [w, ch].join(), () => {
        const g = new Print();
        g.rect(0, bar, 3, dy, "accent");
        return g;
      });
      show(selection, smooth(u, 0, 0.12));
      diagrams.forEach((r, i) => frontModels[i].place(...r, W, H, 0, 1, time));
      if (u <= 0.22)
        names.forEach((id, i) =>
          hits.push({ obj: cover, rect: [0, bar + i * dy, w, dy], id }),
        );
    }
    for (let i = 0; i < 3; i++) {
      const s = sheets[i],
        width = w * (phone ? 0.95 : 0.9),
        fanH = (h - (phone ? 76 : 90)) / 3;
      const fan = [
        x + (2 - i) * w * (phone ? 0.019 : 0.039),
        top + (phone ? 5 : 2) + i * (fanH + (phone ? 26 : 35)),
        width,
        fanH,
        62 - i * 46,
        phone ? -4 : -8 + i * 2,
        phone ? -1 : -3,
        phone ? 0 : 1.2 - i * 0.6,
      ];
      const tuck = [
        x + w * 0.03,
        coverTop + 4,
        w * 0.94,
        ch * 0.94,
        -72 - i * 15,
        -1,
        0,
        0,
      ];
      const active = [x, top, w, h, 74, phone ? -1 : -3, phone ? 0 : 1.2, 0];
      const parked = [
        x + w * 1.8,
        top + h * 0.25 + i * 12,
        w * 0.88,
        h * 0.76,
        -190 - i * 26,
        -24,
        1,
        0,
      ];
      const approach =
        i === 0
          ? smooth(u, 0.88, 1.12)
          : smooth(u, [0, 8.25, 15.25][i], [0, 9, 16][i]);
      const leave =
        i === 0 ? smooth(u, 7.45, 7.85) : i === 1 ? smooth(u, 14.45, 14.85) : 0;
      let spread =
        1 -
        smooth(u, 0.88, 1.12) +
        smooth(u, 7.45, 7.85) * (1 - smooth(u, 8.25, 9)) +
        smooth(u, 14.45, 14.85) * (1 - smooth(u, 15.25, 16));
      spread = clamp(spread);
      const on = approach * (1 - leave),
        act = on * (1 - end);
      let pos = blend(fan, parked, clamp(1 - spread - on));
      pos = blend(pos, active, on);
      pos = blend(tuck, pos, fade);
      const gap = phone ? 37 : 23,
        fw = phone ? W - 38 : (W - 2 * x * 0.105 - gap * 2) / 3;
      const fy = phone ? H * 0.298 : H * 0.52,
        fh = phone ? (bottom - fy - 2 * gap) / 3 : H * 0.3;
      const ep = phone
        ? [19, fy + i * (fh + gap), fw, fh, 20 + i * 3, 0, 0, 0]
        : [x * 0.105 + i * (fw + gap), fy, fw, fh, 15 + i * 4, 0, 0, 0];
      pos = blend(pos, ep, end);
      s.root.visible =
        u > 0.219 && (spread > 0.001 || on > 0.001 || end > 0.001 || fade < 1);
      if (!s.root.visible) continue;
      place(s, pos, i === owner || end > 0.5);
      const ww = pos[2],
        hh = pos[3],
        pad = phone ? 12 : 26,
        aw = ww - 2 * pad,
        t = u - starts[i];
      const b = clamp(Math.ceil(t - 0.45 - 1e-8), 0, 5);
      const phase = b ? smooth(t, b - 0.55, b) : 1;
      const preview =
        i === 0 ? smooth(u, 0.92, 1.14) * (1 - smooth(u, 1.62, 2)) : 0;
      const chartH = phone
          ? Math.min(83, hh * 0.235) - (i === 1 && b >= 4 ? 16 : 0)
          : hh * 0.475,
        chart = mix(hh - 12, chartH, act);
      const finalChart = phone ? hh * 0.64 : hh * 0.4;
      const mw = mix(ww - 2 * pad, phone ? ww * 0.43 : ww - 2 * pad, end);
      const keyHeight = phone ? 24 : 28;
      const chartTop = act * keyHeight + 4;
      const graphicBeat = end > 0.8 ? [2, 2, 4][i] : preview > 0.2 ? 2 : b;
      const graphicPhase = preview > 0.2 ? smooth(u, 1.06, 1.22) : phase;
      models[i].place(
        pad,
        chartTop,
        mw,
        Math.max(0, mix(chart, finalChart, end) - chartTop - 2),
        W,
        H,
        graphicBeat,
        graphicPhase,
        time,
        act < 0.99 || b === 0 || end > 0.01,
      );
      const labels = chartInk[i];
      show(labels, act);
      labels.group.position.set(pad, -3, 1.8);
      if (labels.group.visible)
        cached(labels, [b, Math.round(aw), phone].join(), () =>
          chartKey(i, b, aw, phone),
        );

      const yy = chartH + (phone ? 9 : 18),
        rh = hh - yy - pad;
      const leaderInk = leader[i];
      show(leaderInk, b ? act * (1 - preview) * smooth(phase, 0.14, 0.41) : 0);
      if (leaderInk.group.visible) {
        const pt = models[i].inkPoint(focalStations[i][b - 1]),
          right = pt[0] > ww * 0.5,
          edge = right ? ww - pad + 6 : pad - 6;
        cached(
          leaderInk,
          [
            b,
            Math.round(ww),
            Math.round(hh),
            Math.round(pt[0] * 2),
            Math.round(pt[1] * 2),
          ].join(),
          () => {
            const p = new Print(),
              elbow = right
                ? Math.min(ww - pad, pt[0] + 12)
                : Math.max(pad, pt[0] - 12);
            p.path(
              [
                pt,
                [elbow, pt[1] + 7],
                [edge, pt[1] + 7],
                [edge, yy + 3],
                [edge + (right ? -6 : 6), yy + 3],
              ],
              "rule",
              1,
            );
            p.line(pt[0] - 3, pt[1], pt[0] + 4, pt[1], "accent", 2);
            return p;
          },
        );
      }
      const k = [
        Math.round(aw),
        Math.round(rh),
        b,
        Math.round(phase * 65),
      ].join("/");
      const reveal = b ? smooth(phase, 0, 0.28) : 1;
      for (const layer of [ink[i], previous[i]])
        layer.group.position.set(pad, -yy, 1.7);
      if (i === 0) {
        const join = smooth(u, 1.62, 1.95),
          amount = smooth(u, 1.59, 1.66) * (1 - smooth(u, 1.91, 2));
        show(seam, amount);
        if (amount > 0.001) {
          const endpoint = models[i].inkPoint();
          cached(seam, Math.round(u * 250) + "/" + W, () => {
            const p = new Print(),
              from = [pad + (phone ? 10 : 19), yy + (phone ? 213 : 187)],
              a = [
                mix(from[0], endpoint[0], join),
                mix(from[1], endpoint[1], join),
              ];
            p.line(
              a[0],
              a[1],
              mix(from[0] + (phone ? 198 : 298), endpoint[0], join),
              mix(from[1], endpoint[1], join),
              "accent",
              1.3,
            );
            return p;
          });
        }
      }
      const recordOpacity = act * (1 - smooth(end, 0.05, 0.42));
      show(ink[i], recordOpacity * reveal * (1 - preview));
      show(previous[i], recordOpacity * (preview || 1 - reveal));
      if (ink[i].group.visible)
        cached(ink[i], k, () => record(i, b, aw, rh, phase));
      if (previous[i].group.visible) {
        const bb = preview ? 2 : Math.max(0, b - 1),
          q = preview ? smooth(u, 1.06, 1.22) : 1;
        cached(previous[i], k + "/" + bb + "/" + Math.round(q * 80), () =>
          record(i, bb, aw, rh, q),
        );
      }
      const f = final[i];
      show(f, smooth(end, 0.46, 0.85));
      if (f.group.visible)
        cached(f, [Math.round(ww), Math.round(hh), phone].join(), () => {
          const p = new Print(),
            cx = phone ? ww * 0.47 : pad,
            cy = phone ? 20 : hh * 0.45,
            sz = phone ? 17 : 23;
          let ry =
            cy + p.text(results[i], cx, cy, sz, "accent", 700, ww - cx - 8);
          const descH = p.text(
            resultDetails[i],
            cx,
            ry + 2,
            phone ? 14 : 16,
            "paper",
            400,
            ww - cx - 8,
          );
          p.text(
            short[i],
            phone ? pad : cx,
            phone ? hh - 38 : ry + descH + 9,
            phone ? 14 : 15,
            "paper",
            400,
            phone ? ww - 2 * pad : ww - cx - 8,
          );
          if (!phone) {
            p.line(pad, hh - 52, ww - pad, hh - 52, "rule");
            p.text("ps --featured  /  " + names[i], pad, hh - 31, 14, "quiet");
            p.text(
              acts[i].repo ? "Demo ↗    Source ↗" : "Demo ↗",
              pad,
              hh - 9,
              14,
              "accent",
            );
          } else
            p.text(
              "Demo ↗" + (acts[i].repo ? "  Source ↗" : ""),
              pad,
              hh - 5,
              14,
              "accent",
            );
          return p;
        });
      if ((spread > 0.95 && u > 0.695) || on > 0.98 || end > 0.95)
        hits.push({
          obj: s,
          rect: [0, -(phone ? 27 : 37), Math.min(ww, 240), phone ? 28 : 38],
          id: names[i],
        });
      if (end > 0.96) {
        hits.push({
          obj: s,
          rect: [pad, hh - 25, phone ? 52 : 79, 25],
          id: acts[i].demo,
        });
        if (acts[i].repo)
          hits.push({
            obj: s,
            rect: [pad + (phone ? 52 : 79), hh - 25, 95, 25],
            id: acts[i].repo,
          });
      }
      const focused = hits.find((v) => v.obj === s && v.id === focus);
      show(focusInk[i], focused ? 1 : 0);
      if (focused)
        cached(focusInk[i], focus + focused.rect.join(), () => {
          const p = new Print(),
            [a, b, c, e] = focused.rect;
          p.line(a, b + e, a + c, b + e, "accent", 2);
          return p;
        });
      current.push({
        name: names[i],
        pose: pos,
        beat: b,
        phase,
        record: ink[i].key,
      });
    }
    d.renderer.render(d.scene, d.camera);
  }
  // Ray-plane intersection uses actual local coordinates and the closest opaque sheet.
  function hit(cx, cy) {
    const ray = new T.Raycaster();
    ray.setFromCamera(
      new T.Vector2((cx / W) * 2 - 1, 1 - (cy / H) * 2),
      d.camera,
    );
    const candidates = [];
    for (const row of hits) {
      const inv = row.obj.local.matrixWorld.clone().invert(),
        r = ray.ray.clone().applyMatrix4(inv);
      const point = r.intersectPlane(
        new T.Plane(new T.Vector3(0, 0, 1), 0),
        new T.Vector3(),
      );
      if (!point) continue;
      const [x, y, w, h] = row.rect;
      if (point.x < x || point.x > x + w || -point.y < y || -point.y > y + h)
        continue;
      const distance = ray.ray.origin.distanceTo(
        point.applyMatrix4(row.obj.local.matrixWorld),
      );
      candidates.push({ distance, id: row.id });
    }
    candidates.sort((a, b) => a.distance - b.distance);
    const closest = ray.intersectObjects(
      [cover, ...sheets].filter((v) => v.root.visible).map((v) => v.panel),
      false,
    )[0];
    return candidates[0] &&
      (!closest || candidates[0].distance < closest.distance + 2)
      ? candidates[0].id
      : null;
  }
  function audit() {
    const visible = (n) => n.visible && (!n.parent || visible(n.parent));
    function screen(group, x, y) {
      const v = new T.Vector3(x, -y, 0)
        .applyMatrix4(group.matrixWorld)
        .project(d.camera);
      return [((1 + v.x) * W) / 2, ((1 - v.y) * H) / 2];
    }
    const lines = [];
    for (const l of [...layers, ...sheets.map((v) => v.header)]) {
      if (!l.items || !visible(l.group) || l.alpha.value < 0.999) continue;
      for (const item of l.items) {
        if (!item.text) continue;
        const { x, y, size, text } = item;
        const at = screen(l.group, x, y),
          up = screen(l.group, x, y - size),
          right = screen(l.group, x + size * 0.6 * text.length, y);
        lines.push({
          text,
          em: Math.hypot(at[0] - up[0], at[1] - up[1]),
          bounds: [at[0], up[1], right[0], at[1]],
          tone: item.tone,
        });
      }
    }
    return { lines, targets: hits.map((h) => h.id) };
  }
  function transcript() {
    const hasInk = (n) => n.visible && (!n.parent || hasInk(n.parent));
    const parts = [
      coverInk,
      ...sheets.flatMap((v, i) => [
        v.header,
        chartInk[i],
        previous[i],
        ink[i],
        final[i],
      ]),
    ];
    return parts
      .filter((v) => v.items && v.alpha.value > 0.01 && hasInk(v.group))
      .flatMap((v) => v.items.filter((e) => e.text).map((e) => e.text))
      .join("\n");
  }
  function substrate() {
    const visible = [];
    for (const el of [
      ...layers.map((v) => v.group),
      ...models.map((v) => v.root),
      ...frontModels.map((v) => v.root),
      ...[cover, ...sheets].map((v) => v.header.group),
    ]) {
      if (el.visible) {
        visible.push(el);
        el.visible = false;
      }
    }
    d.renderer.render(d.scene, d.camera);
    visible.forEach((el) => (el.visible = true));
  }
  resize();
  return {
    render,
    substrate,
    transcript,
    resize,
    hit,
    audit,
    targets: () => [...new Set(hits.map((v) => v.id))],
    focus(id) {
      focus = id;
    },
    state: () => current,
    accent: d.setAccent,
    renderer: d.renderer,
  };
}
