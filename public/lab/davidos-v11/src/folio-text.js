// Text and rules share the page's local coordinates (CSS pixels, y down).
import * as T from "../vendor/three.module.min.js";
import atlas from "./glyph-metrics.js";
const palette = {
  paper: "#e6eae7",
  quiet: "#a2afa7",
  dim: "#a2afa7",
  rule: "#35483d",
  face: "#151917",
  well: "#101512",
};
export const rgb = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
export function wrap(text, size, width) {
  const limit = Math.max(1, Math.floor(width / (size * 0.6))),
    lines = [];
  for (const paragraph of String(text).split("\n")) {
    let line = "";
    for (const word of paragraph.split(" ")) {
      if (line && line.length + word.length + 1 > limit) {
        lines.push(line);
        line = "";
      }
      line += (line ? " " : "") + word;
    }
    lines.push(line);
  }
  return lines;
}
export class Print {
  constructor() {
    this.items = [];
  }
  text(
    value,
    x,
    y,
    size = 16,
    tone = "paper",
    weight = 400,
    width = Infinity,
    leading = 1.32,
  ) {
    const lines = wrap(value, size, width);
    lines.forEach((text, i) =>
      this.items.push({
        text,
        x,
        y: y + i * size * leading,
        size,
        tone,
        weight,
      }),
    );
    return lines.length * size * leading;
  }
  rect(x, y, w, h, tone = "rule") {
    if (w > 0 && h > 0) this.items.push({ x, y, w, h, tone });
  }
  line(x, y, xx, yy, tone = "rule", stroke = 1) {
    this.items.push({
      path: [
        [x, y],
        [xx, yy],
      ],
      tone,
      stroke,
    });
  }
  path(points, tone = "rule", stroke = 1) {
    this.items.push({ path: points, tone, stroke });
  }
}
export async function loadFont() {
  const texture = await new T.TextureLoader().loadAsync(
    new URL("../assets/glyphs/mono.png", import.meta.url).href,
  );
  texture.colorSpace = T.NoColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = texture.magFilter = T.LinearFilter;
  return texture;
}
const vertex = `attribute vec4 ink; varying vec4 colorInk; varying vec2 st;
void main(){colorInk=ink;st=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
function material(texture, accent, alpha) {
  return new T.ShaderMaterial({
    uniforms: { atlas: { value: texture }, accent, alpha },
    vertexShader: vertex,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: T.FrontSide,
    fragmentShader:
      `varying vec4 colorInk;varying vec2 st;uniform sampler2D atlas;uniform vec3 accent;uniform float alpha;
    void main(){float a=alpha;` +
      (texture
        ? `float d=texture2D(atlas,st).r-.5;a*=clamp(d/max(fwidth(d),.0001)+.5,0.,1.);`
        : "") +
      `
    if(a<.003)discard;gl_FragColor=vec4(mix(colorInk.rgb,accent,colorInk.a),a);}`,
  });
}
function batch() {
  return { pos: [], uv: [], ink: [] };
}
function quad(b, points, color, uv = [0, 0, 0, 0]) {
  const corners = [
    [uv[0], uv[1]],
    [uv[2], uv[1]],
    [uv[2], uv[3]],
    [uv[0], uv[3]],
  ];
  for (const j of [0, 3, 1, 1, 3, 2]) {
    b.pos.push(points[j][0], -points[j][1], 0);
    b.uv.push(...corners[j]);
    b.ink.push(...color);
  }
}
const colors = new Map();
function shade(tone) {
  if (!colors.has(tone))
    colors.set(
      tone,
      tone === "accent" ? [0, 0, 0, 1] : [...rgb(palette[tone] || tone), 0],
    );
  return colors.get(tone);
}
function rectangle(x, y, w, h) {
  return [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
}
export function printed(texture, accent) {
  const group = new T.Group(),
    alpha = { value: 1 };
  const meshes = [null, texture].map((tex, i) => {
    const mesh = new T.Mesh(
      new T.BufferGeometry(),
      material(tex, accent, alpha),
    );
    mesh.position.z = i * 0.035;
    mesh.renderOrder = 10 + i;
    mesh.frustumCulled = false;
    group.add(mesh);
    return mesh;
  });
  function set(print) {
    const lines = batch(),
      type = batch();
    for (const p of print.items) {
      const color = shade(p.tone);
      if (p.text !== undefined) {
        let x = p.x;
        const scale = p.size / atlas.em;
        for (const char of p.text) {
          const g = atlas.metrics[p.weight][char];
          if (!g) throw Error("Missing glyph " + char);
          const [u, v, w, h, left, top, advance] = g;
          if (char !== " ")
            quad(
              type,
              rectangle(
                x + left * scale,
                p.y + top * scale,
                w * scale,
                h * scale,
              ),
              color,
              [
                u / atlas.width,
                1 - v / atlas.height,
                (u + w) / atlas.width,
                1 - (v + h) / atlas.height,
              ],
            );
          x += advance * scale;
        }
      } else if (p.path) {
        for (let i = 1; i < p.path.length; i++) {
          const [x, y] = p.path[i - 1],
            [xx, yy] = p.path[i],
            dx = xx - x,
            dy = yy - y,
            len = Math.hypot(dx, dy) || 1;
          const a = ((-dy / len) * p.stroke) / 2,
            b = ((dx / len) * p.stroke) / 2;
          quad(
            lines,
            [
              [x - a, y - b],
              [xx - a, yy - b],
              [xx + a, yy + b],
              [x + a, y + b],
            ],
            color,
          );
        }
      } else quad(lines, rectangle(p.x, p.y, p.w, p.h), color);
    }
    for (const [i, b] of [lines, type].entries()) {
      const mesh = meshes[i];
      mesh.geometry.dispose();
      const g = new T.BufferGeometry();
      for (const [name, values, n] of [
        ["position", b.pos, 3],
        ["uv", b.uv, 2],
        ["ink", b.ink, 4],
      ])
        g.setAttribute(name, new T.Float32BufferAttribute(values, n));
      mesh.geometry = g;
    }
  }
  return { group, set, alpha };
}
