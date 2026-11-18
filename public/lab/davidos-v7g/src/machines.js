import { Drawing, lerp } from "./drawing.js";
import * as T from "../vendor/three.module.min.js";
const glyphs = [
  [
    [
      [0, 0],
      [0.67, 0],
      [1, 0.28],
      [1, 0.72],
      [0.72, 1],
      [0, 1],
    ],
    [
      [0.29, 0.24],
      [0.56, 0.24],
      [0.71, 0.37],
      [0.71, 0.62],
      [0.56, 0.76],
      [0.29, 0.76],
    ],
  ],
  [
    [
      [0, 0],
      [0.29, 0],
      [0.36, 0.25],
      [0.67, 0.25],
      [0.75, 0],
      [1.05, 0],
      [0.77, 1],
      [0.28, 1],
    ],
    [
      [0.42, 0.46],
      [0.62, 0.46],
      [0.52, 0.77],
    ],
  ],
  [
    [
      [0, 1],
      [0.31, 1],
      [0.53, 0.29],
      [0.73, 1],
      [1.04, 1],
      [0.74, 0],
      [0.3, 0],
    ],
  ],
  [
    [
      [0, 0],
      [0.73, 0],
      [0.73, 0.22],
      [0.51, 0.22],
      [0.51, 0.78],
      [0.73, 0.78],
      [0.73, 1],
      [0, 1],
      [0, 0.78],
      [0.22, 0.78],
      [0.22, 0.22],
      [0, 0.22],
    ],
  ],
];
glyphs.push(glyphs[0]);
function letter(d, k) {
  const rings = glyphs[k],
    offset = [0, 1.18, 2.42, 3.65, 4.55][k];
  const p = (x, y, z) => [(offset + x - 2.78) * 2.05, (y - 0.5) * 3.35, z];
  // Loom rows stop at the interior contours too, leaving the letter counters open.
  for (let row = 0; row < 72; row++) {
    const y = (row + 0.5) / 72,
      hits = [];
    for (const ring of rings)
      ring.forEach(([x0, y0], j) => {
        const [x1, y1] = ring[(j + 1) % ring.length];
        if (y0 > y !== y1 > y) hits.push(lerp(x0, x1, (y - y0) / (y1 - y0)));
      });
    hits.sort((a, b) => a - b);
    for (let i = 0; i < hits.length; i += 2) {
      const line = [];
      for (let j = 0; j <= 22; j++) {
        const x = lerp(hits[i], hits[i + 1], j / 22);
        line.push(p(x, y, 0.38 + 0.065 * Math.sin(14 * x + row * 0.22)));
      }
      d.path(line, row % 5 === 0 ? 0.99 : 0.58);
    }
  }
  for (const ring of rings)
    for (let j = 0; j < ring.length; j++) {
      const a = ring[j],
        b = ring[(j + 1) % ring.length];
      for (let i = 0; i < 12; i++)
        d.line(
          p(...a, lerp(-0.42, 0.38, i / 11)),
          p(...b, lerp(-0.42, 0.38, i / 11)),
          0.39 + i * 0.035,
        );
    }
}
export function mark(m) {
  const d = new Drawing();
  for (let k = 0; k < 5; k++) letter(d, k);
  const form = { value: 0 },
    handoff = { value: 0 },
    intensity = { value: 1 };
  const material = m.line.clone();
  material.uniforms = { ...m.uniforms, form, handoff, exposure: intensity };
  material.vertexShader =
    "uniform float form; uniform float handoff;\n" +
    material.vertexShader.replace(
      "vec4 p=modelViewMatrix*vec4(position,1.);",
      `
    float lane=clamp((position.y+1.7)/3.4,0.,1.);
    float along=clamp((position.x+5.72)/11.6,0.,1.);
    float seat=smoothstep(0.,1.,clamp(form*1.85-along*.55-lane*.2,0.,1.));
    vec3 loose=vec3(position.x-3.2+lane*.55, position.y*.19+.65*sin(2.*along+lane*2.), position.z+(1.-along)*2.4);
    vec3 pos=mix(loose,position,seat);
    float pull=smoothstep(0.,1.,clamp(handoff*2.25-(1.-along)*1.25,0.,1.));
    vec3 path=vec3(11.+7.6*along, -.65+.22*sin(lane*6.28)+.5*sin(along*3.14), position.z*.6+lane*.3);
    pos=mix(pos,path,pull);
    strength=ink; vec4 p=modelViewMatrix*vec4(pos,1.);`,
    );
  const group = d.build({ ...m, line: material });
  // Continue a loom row from each letter into the request route's actual entry.
  // Segments are interleaved by distance so drawRange advances all filament tips together.
  const tail = new Drawing(),
    count = 28,
    samples = 105,
    filaments = [];
  for (let j = 0; j < count; j++) {
    const k = j % 5,
      lane = j / (count - 1),
      x = [-4.8, -2.45, 0.08, 2.36, 4.9][k];
    const y = -0.38 + 0.5 * Math.sin(lane * 6.28);
    const curve = new T.CatmullRomCurve3(
      [
        [x, y, 0.38],
        [x + 1.7, y + 0.08, 0.45],
        [7.7, -0.42 + (lane - 0.5) * 0.57, 0.3],
        [11.04, -1.32 + (lane - 0.5) * 0.22, 0.29],
        [12.92, -1.32 + (lane - 0.5) * 0.18, 0.21],
        [15.45, -1.3 + (lane - 0.5) * 0.19, -0.14],
        [19, -1.3 + (lane - 0.5) * 0.17, 0],
      ].map((v) => new T.Vector3(...v)),
    );
    filaments.push(curve.getSpacedPoints(samples));
  }
  for (let i = 0; i < samples; i++)
    for (let j = 0; j < count; j++)
      tail.line(
        filaments[j][i].toArray(),
        filaments[j][i + 1].toArray(),
        0.57 + (0.4 * j) / count,
      );
  const opacity = { value: 0 },
    tailMat = m.line.clone();
  tailMat.uniforms = { ...m.uniforms, exposure: opacity };
  const bundle = tail.build({ ...m, line: tailMat });
  group.add(bundle);
  return {
    group,
    update(f, h, level = 1) {
      form.value = f;
      handoff.value = h;
      const lo = Math.floor(Math.max(0, (h - 0.56) / 0.44) * samples),
        hi = Math.floor(Math.min(1, h / 0.59) * samples);
      bundle.children[0].geometry.setDrawRange(
        lo * count * 2,
        Math.max(0, (hi - lo) * count * 2),
      );
      opacity.value = level * Math.min(1, h * 4);
      intensity.value = level * (0.04 + 0.96 * Math.min(1, f * 2.3));
      group.visible = intensity.value > 0.001;
    },
  };
}
