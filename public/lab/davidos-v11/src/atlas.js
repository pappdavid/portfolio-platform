import * as T from "../vendor/three.module.min.js";
import { Drawing } from "./drawing.js";
export function makeAtlas(materials) {
  const group = new T.Group();
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
    const exposure = { value: 1 },
      local = {};
    for (const key of ["face", "line"]) {
      local[key] = materials[key].clone();
      local[key].uniforms = { ...materials.uniforms, exposure };
    }
    const obj = g.build(local);
    obj.position.set(x, y, z);
    obj.rotation.set(rx, ry, rz);
    group.add(obj);
    return { obj, exposure };
  }
  return { group, surface };
}
