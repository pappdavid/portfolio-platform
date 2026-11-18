import * as T from '../vendor/three.module.min.js';
import { Drawing, markSlice } from './drawing.js';
import { studio, companion, faultline, matrixTerms } from './models.js';
import { replay } from './companion-data.js';
import { systems, smooth, clamp, stateAt } from './systems.js';

const mix = (a, b, t) => a + (b - a) * t;
function surface(def) {
  const d = new Drawing(),
    w = def.w / 2,
    h = def.h / 2,
    thickness = def.bar ? 2 : def.document ? 2.4 : 3;
  const perimeter = [
    [-w, -h],
    [w, -h],
    [w, h],
    [-w, h],
  ];
  if (def.frame) {
    for (const sign of [-1, 1]) {
      const x = sign * w;
      d.path(
        [
          [x - sign * 13, 2, -h],
          [x, 2, -h],
          [x, 2, h],
          [x - sign * 13, 2, h],
        ],
        [0.99, 1],
      );
    }
  } else {
    d.solid(
      perimeter,
      -thickness,
      thickness,
      def.bar ? [0.69, 0.8] : [0.09, 0.18],
      [0.7, 0.3],
      [0.27, 0.4],
    );
    d.path(
      perimeter.map(([x, z]) => [x, -thickness, z]),
      [0.34, 0.38],
      true,
    );
    if (def.file) {
      // Every heading chunk has an individual leaf underneath its source file.
      def.chunks.forEach((c, i) => {
        const step = (i + 1) * 2.5;
        d.solid(
          perimeter.map(([x, z]) => [x - step, z + step * 1.7]),
          -step - 2,
          1,
          [0.095, 0.15],
          [0.57, 0.34],
        );
      });
    }
  }
  const group = d.build();
  if (def.matrix) {
    const m = new Drawing(),
      cw = (def.w - 14) / replay.vocab.length,
      ch = (def.h - 37) / replay.chunks.length;
    const x0 = -w + 7,
      z0 = -h + 25;
    for (const col of matrixTerms) {
      const x = x0 + col * cw;
      m.quad(
        [x, 0.7, z0],
        [x + cw, 0.7, z0],
        [x + cw, 0.7, z0 + 14 * ch],
        [x, 0.7, z0 + 14 * ch],
        [0.42, 0.97],
      );
    }
    for (let i = 0; i <= replay.vocab.length; i++)
      m.line(
        [x0 + i * cw, 0.9, z0],
        [x0 + i * cw, 0.9, z0 + 14 * ch],
        [0.24, 0.17],
      );
    for (let i = 0; i <= 14; i++)
      m.line(
        [x0, 0.9, z0 + i * ch],
        [x0 + 283 * cw, 0.9, z0 + i * ch],
        [0.56, 0.28],
      );
    replay.chunks.forEach((c, r) =>
      c.terms.forEach((col) => {
        const x = x0 + col * cw,
          z = z0 + r * ch,
          ink = matrixTerms.has(col) ? [1, 1] : [0.62, 0.2];
        m.quad(
          [x, 1, z],
          [x + cw, 1, z],
          [x + cw, 1, z + ch],
          [x, 1, z + ch],
          ink,
        );
      }),
    );
    group.add(m.build());
  }
  return group;
}

function buildAct(builder, root, container) {
  const group = new T.Group(),
    parts = new Map(),
    anchors = new Map();
  const wires = new Float32Array(6 * 100),
    inks = new Float32Array(2 * 100);
  const geo = new T.BufferGeometry(),
    posAttr = new T.BufferAttribute(wires, 3),
    shade = new T.BufferAttribute(inks, 1);
  geo.setAttribute('position', posAttr);
  geo.setAttribute('ink', shade);
  const wireMat = new T.ShaderMaterial({
    uniforms: { accent: { value: new T.Vector3(0, 1, 0.533) } },
    vertexShader:
      'attribute float ink;varying float k;void main(){k=ink;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:
      'uniform vec3 accent;varying float k;void main(){gl_FragColor=vec4(mix(vec3(.76),accent,k*.65)*k,1.);}',
  });
  const links = new T.LineSegments(geo, wireMat);
  links.frustumCulled = false;
  group.add(links);
  root.add(group);
  let n = 0;
  const api = {
    add(defs) {
      for (const def of defs) {
        const obj = surface(def),
          el = document.createElement('div');
        el.className =
          'drawing-surface' +
          (def.message ? ' message' : '') +
          (def.frame ? ' window-frame' : '') +
          (def.bar ? ' time-bar' : '') +
          (def.matrix ? ' matrix' : '');
        el.dataset.part = def.id;
        el.style.width = def.w + 'px';
        el.style.height = def.h + 'px';
        container.append(el);
        const p = { ...def, obj, el, ink: 1, cache: null };
        parts.set(p.id, p);
        group.add(obj);
        if (typeof p.content === 'string') api.html(p, p.content);
      }
    },
    html(p, content) {
      if (p.cache !== content) {
        p.cache = content;
        p.el.innerHTML = content;
      }
    },
    part: (id) => parts.get(id),
    tiers(k) {
      for (const p of parts.values())
        p.obj.position.y += (p.tier || 0) * k * 23;
    },
    pos: (id) => parts.get(id).obj.position.toArray(),
    move(id, xyz) {
      parts.get(id).obj.position.fromArray(xyz);
    },
    offset(id, x, y, z) {
      const v = parts.get(id).obj.position;
      v.set(v.x + x, v.y + y, v.z + z);
    },
    scale(id, v) {
      parts.get(id).obj.scale.setScalar(v);
    },
    enlarge(id, v) {
      parts.get(id).obj.scale.multiplyScalar(v);
    },
    depth(id, h) {
      const p = parts.get(id);
      p.renderH = h;
      p.obj.scale.z = h / p.h;
    },
    show(id, v) {
      parts.get(id).obj.visible = v;
    },
    light(id, v) {
      parts.get(id).ink = v;
    },
    lightMatrix(p, lit) {
      p.obj.children.at(-1).userData.uniforms.light.value = lit ? 1 : 0.32;
    },
    anchor(id, xyz) {
      anchors.set(id, xyz);
    },
    wire(a, b, intensity, arrow = false) {
      wires.set(a, n * 3);
      inks[n++] = intensity;
      wires.set(b, n * 3);
      inks[n++] = intensity;
      if (arrow) {
        const dx = b[0] - a[0],
          dz = b[2] - a[2],
          len = Math.hypot(dx, dz) || 1;
        for (const sign of [-1, 1])
          api.wire(
            [
              b[0] - (6 * dx) / len + (sign * 3 * dz) / len,
              b[1],
              b[2] - (6 * dz) / len - (sign * 3 * dx) / len,
            ],
            b,
            intensity,
          );
      }
    },
  };
  const design = builder(api);
  function update(b, u, spread) {
    n = 0;
    for (const p of parts.values()) {
      p.renderH = p.h;
      p.obj.position.set(p.x, p.y, p.z);
      p.obj.scale.setScalar(1);
      p.obj.visible = true;
      p.ink =
        p.dark && !(p.id === 'Local lab' && b === 5)
          ? 0.48
          : b && !p.beats.includes(b)
            ? 0.31
            : 1;
      if (typeof p.content === 'function') api.html(p, p.content(b, u));
    }
    const names = design.update(b, u, spread);
    posAttr.needsUpdate = shade.needsUpdate = true;
    geo.setDrawRange(0, n);
    for (const p of parts.values()) p.obj.userData.uniforms.light.value = p.ink;
    return b ? names : design.labels;
  }
  return { group, parts, anchors, wireMat, ...design, update };
}

export function mount(canvas, labels) {
  const renderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x0a0a0a);
  const scene = new T.Scene(),
    camera = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 16000),
    root = new T.Group();
  scene.add(root);
  const hero = new T.Group(),
    slices = Array.from({ length: 6 }, (_, i) => markSlice(i, 6));
  hero.add(...slices);
  root.add(hero);
  hero.scale.setScalar(95);
  const container = canvas.parentElement.querySelector('.surfaces');
  const acts = [studio, companion, faultline].map((make) =>
    buildAct(make, root, container),
  );
  const tags = Array.from({ length: 8 }, () => {
    const el = document.createElement('span');
    el.className = 'callout';
    labels.append(el);
    return el;
  });
  const leaders = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  leaders.setAttribute('class', 'leaders');
  leaders.setAttribute('aria-hidden', 'true');
  labels.prepend(leaders);
  const paths = tags.map(() => {
    const p = document.createElementNS(leaders.namespaceURI, 'path');
    leaders.append(p);
    return p;
  });
  let width = 0,
    height = 0;
  function accent(hex) {
    const c = new T.Vector3(
      ...hex.match(/\w\w/g).map((v) => parseInt(v, 16) / 255),
    );
    scene.traverse((o) => {
      if (o.userData.uniforms) o.userData.uniforms.accent.value.copy(c);
    });
    for (const a of acts) a.wireMat.uniforms.accent.value.copy(c);
  }
  const vec = new T.Vector3();
  function project(obj, x, y, z) {
    vec.set(x, y, z).applyMatrix4(obj.matrixWorld).project(camera);
    return [(vec.x + 1) * width * 0.5, (1 - vec.y) * height * 0.5, vec.z];
  }
  let occupied = [];
  function drawSurfaces(a) {
    for (const p of a.parts.values()) {
      const el = p.el,
        o = p.obj;
      el.hidden = !a.group.visible || !o.visible;
      if (el.hidden) continue;
      el.style.height = p.renderH + 'px';
      const x = p.w / 2,
        z = p.h / 2,
        A = project(o, -x, 1.5, -z),
        B = project(o, x, 1.5, -z),
        C = project(o, -x, 1.5, z);
      el.style.transform =
        'matrix(' +
        [
          (B[0] - A[0]) / p.w,
          (B[1] - A[1]) / p.w,
          (C[0] - A[0]) / p.renderH,
          (C[1] - A[1]) / p.renderH,
          A[0],
          A[1],
        ].join(',') +
        ')';
      el.style.zIndex = String(
        Math.round(o.position.y * 10) + (p.message ? 4000 : 0),
      );
      if (p.ink >= 0.49 && !p.frame) {
        const D = project(o, x, 1.5, z),
          points = [A, B, C, D],
          xs = points.map((v) => v[0]),
          ys = points.map((v) => v[1]);
        occupied.push({
          x: Math.min(...xs),
          y: Math.min(...ys),
          r: Math.max(...xs),
          b: Math.max(...ys),
        });
      }
      // Dim the ink while keeping each physical sheet opaque to sheets behind it.
      const level = p.ink;
      el.classList.toggle('quiet', level < 0.5);
    }
  }
  function annotate(items) {
    const used = [],
      mobile = width < 480;
    paths.forEach((p) => p.removeAttribute('d'));
    tags.forEach((e) => (e.hidden = true));
    for (const [i, item] of items.entries()) {
      const [text, p] = item,
        el = tags[i];
      if (!p || !el) continue;
      el.textContent = text;
      el.hidden = false;
      const w = el.offsetWidth,
        h = el.offsetHeight,
        first = p[0] < width / 2;
      let best = null;
      for (const left of [first, !first]) {
        const x = left ? 3 : width - w - 3;
        for (let y = 3; y + h < height; y += h + 5) {
          if (
            used.some(
              (box) =>
                x < box.x + box.w + 4 &&
                x + w + 4 > box.x &&
                y < box.y + box.h + 4 &&
                y + h + 4 > box.y,
            )
          )
            continue;
          const overlap = occupied.reduce(
            (sum, r) =>
              sum +
              Math.max(0, Math.min(x + w, r.r) - Math.max(x, r.x)) *
                Math.max(0, Math.min(y + h, r.b) - Math.max(y, r.y)),
            0,
          );
          const dy = Math.abs(y + h / 2 - p[1]),
            dx = Math.abs((left ? x + w : x) - p[0]);
          const score =
            overlap * 2 + dy + dx * 0.22 + (left !== first ? 40 : 0);
          if (!best || score < best.score) best = { x, y, left, score };
        }
      }
      if (!best) {
        el.hidden = true;
        continue;
      }
      const { x, y, left } = best;
      used.push({ x, y, w, h });
      el.style.transform = 'translate(' + x + 'px,' + Math.round(y) + 'px)';
      const end = left ? x + w + 2 : x - 2,
        lineY = y + h / 2,
        bend = end + (left ? 9 : -9);
      paths[i].setAttribute(
        'd',
        'M' + p[0] + ',' + p[1] + ' L' + bend + ',' + lineY + ' H' + end,
      );
    }
  }
  const interests = [
    [
      [],
      ['Studio page', 'operation', 'Server route'],
      ['source1', 'operation'],
      ['source0', 'source1', 'source2', 'source3', 'operation'],
      ['Customer runtime', 'Frozen snapshot', 'operation'],
      ['operation', 'Server route', 'Frozen snapshot'],
    ],
    [
      [],
      ['utterance0', 'utterance1', 'readout'],
      ['utterance0', 'utterance1', 'utterance4', 'Window', 'readout'],
      ['readout', 'Intent classifier'],
      ['Ranked chunks', 'TF-IDF retrieval', 'Evidence card'],
      ['Local lab', 'readout', 'Evidence card'],
    ],
    [
      [],
      ['packet', 'Visits', 'Receipts', 'Client'],
      ['Client', 'packet', 'Visits'],
      ['Visits'],
      ['Receipts', 'Visits'],
      ['Receipts', 'packet', 'Visits'],
    ],
  ];
  // Fit semantic extents in camera coordinates, including both ends of a
  // lifted result. The same fit works for the shorter phone stage.
  function fitted(a, ids, angle, elevation, minSpan) {
    const dir = new T.Vector3(angle, elevation, 1).normalize();
    const right = new T.Vector3(0, 1, 0).cross(dir).normalize(),
      up = dir.clone().cross(right);
    let l = Infinity,
      r = -Infinity,
      top = -Infinity,
      bottom = Infinity;
    for (const p of a.parts.values()) {
      if (!p.obj.visible || (ids.length && !ids.includes(p.id))) continue;
      const o = p.obj;
      for (const signX of [-1, 1])
        for (const signZ of [-1, 1]) {
          vec.set(
            o.position.x + (signX * p.w * o.scale.x) / 2,
            o.position.y,
            o.position.z + (signZ * p.h * o.scale.z) / 2,
          );
          const x = vec.dot(right),
            y = vec.dot(up);
          l = Math.min(l, x);
          r = Math.max(r, x);
          bottom = Math.min(bottom, y);
          top = Math.max(top, y);
        }
    }
    const center = right
      .multiplyScalar((l + r) / 2)
      .addScaledVector(up, (top + bottom) / 2);
    return [
      ...center.toArray(),
      Math.max(
        minSpan,
        (r - l) * 1.14,
        (((top - bottom) * width) / height) * 1.14,
      ),
    ];
  }
  const heldViews = new Map();
  function draw(s, intro = 1, still = false) {
    if (canvas.clientWidth !== width || canvas.clientHeight !== height) {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      heldViews.clear();
      renderer.setSize(width, height, false);
    }
    if (!width || !height) return;
    const { i, b, t } = stateAt(s),
      opening = i < 0,
      closing = i === 3,
      wide = closing ? smooth(t / 0.64) : 0;
    const u = b ? clamp((t - 0.14 - (b - 1) * 0.15) / 0.15) : 0;
    const leave = opening
      ? smooth((t - 0.66) / 0.34)
      : !closing
        ? smooth((t - 0.92) / 0.08)
        : 0;
    const arrive = !closing && !opening ? smooth(t / 0.055) : 1;
    let view = [0, 28, 0, 888],
      angle = -0.36,
      elevation = 1.38;
    let tagList = [];
    hero.visible = opening && leave < 1;
    hero.position.set(0, 0, -65 * leave);
    hero.rotation.y = 0.07 + leave * 0.3;
    hero.scale.setScalar(95 * (1 - leave * 0.85));
    slices.forEach((o, j) => {
      o.position.y = j * (0.078 + 0.37 * (1 - smooth(intro)));
      o.position.x = (1 - smooth(intro)) * (j - 2.5) * 0.21;
    });
    for (const [aIndex, a] of acts.entries()) {
      a.group.visible =
        aIndex === i || closing || (opening && aIndex === 0 && leave > 0);
      if (!a.group.visible) continue;
      a.group.position.set(0, 0, 0);
      a.group.scale.setScalar(1);
      a.group.rotation.y = 0;
      const ab = closing && wide > 0.025 ? 4 : opening || closing ? 0 : b;
      const spread =
        closing || opening ? 0 : smooth((t - 0.1) / 0.11) * (1 - leave);
      if (!opening && !closing && ab && !heldViews.has(i + '-' + (ab - 1))) {
        const prev = ab - 1;
        a.update(prev, 0.5, prev ? 1 : 0);
        heldViews.set(
          i + '-' + prev,
          fitted(
            a,
            interests[i][prev],
            [-0.37, -0.2, -0.27][i],
            [1.58, 1.8, 1.58][i],
            prev ? 465 : 500,
          ),
        );
      }
      const names = a.update(ab, closing ? 0.5 : u, closing ? 0 : spread);
      if (closing) {
        for (const part of a.parts.values())
          if (part.message) part.obj.visible = false;
      }
      if (closing) {
        const scale = aIndex === 2 ? mix(1, 0.64, wide) : 0.64 * wide;
        a.group.scale.setScalar(Math.max(0.0001, scale));
        a.group.position.set(
          (aIndex - 1) * 495 * wide,
          0,
          (aIndex === 1 ? 300 : -100) * wide,
        );
        view = [0, mix(30, 48, wide), mix(55, 117, wide), mix(950, 1640, wide)];
        if (wide > 0.83) tagList.push([systems[aIndex].id, a, null]);
      } else if (opening) {
        a.group.scale.setScalar(leave);
        a.group.position.z = (1 - leave) * 250;
      } else {
        angle = [-0.37, -0.2, -0.27][i] + 0.045 * Math.sin(Math.PI * t);
        elevation = [1.58, 1.8, 1.58][i];
        a.group.rotation.y = (1 - arrive) * 0.09 + leave * 0.12;
        if (arrive > 0.2 && leave < 0.83)
          tagList = names.map(([id, txt]) => [txt, a, id]);
      }
    }
    if (opening) {
      view = view.map((n, j) => mix(n, [5, 73, 38, 830][j], leave));
      elevation = mix(1.04, 1.58, leave);
    }
    if (closing) elevation = 1.58;
    if (!opening && !closing) {
      const a = acts[i],
        ids = interests[i][b];
      // The whole exchange is held before the first event and between acts.
      const all = fitted(a, [], angle, elevation, 500);
      const foreground = fitted(
        a,
        ids,
        angle,
        elevation,
        b === 0 ? 500 : i === 1 && b === 1 ? 515 : 465,
      );
      const k = b ? smooth(u / 0.36) : 0;
      // Match the outgoing document edge to the incoming strip or packet edge.
      const previous = heldViews.get(i + '-' + (b - 1)) || all;
      view = b
        ? previous.map((v, j) => mix(mix(v, foreground[j], k), all[j], leave))
        : all;
      if (i < 2 && leave) {
        const p = a.parts.get(i === 0 ? 'source1' : 'Evidence card');
        const edge = fitted(a, [p.id], angle, elevation, 470);
        view = view.map((v, j) => mix(v, edge[j], leave));
      }
      if (i > 0 && !b && arrive < 1) {
        const entry = fitted(
          a,
          [i === 1 ? 'Transcript' : 'Client'],
          angle,
          elevation,
          470,
        );
        view = view.map((v, j) => mix(entry[j], v, arrive));
      }
    }
    const aspect = width / height;
    let frameWidth = view[3];
    camera.left = -frameWidth / 2;
    camera.right = frameWidth / 2;
    camera.top = (frameWidth / aspect) * 0.5;
    camera.bottom = -camera.top;
    const [x, y, z] = view;
    camera.position.set(x + angle * 1400, y + elevation * 1400, z + 1400);
    camera.lookAt(x, y, z);
    camera.updateProjectionMatrix();
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    renderer.render(scene, camera);
    occupied = [];
    acts.forEach(drawSurfaces);
    annotate(
      still
        ? []
        : tagList.map(([txt, a, id]) => {
            if (!id) return [txt, project(a.group, 0, 25, 30)];
            const p = a.parts.get(id);
            return [
              txt,
              p
                ? project(p.obj, 0, 3, -p.h * 0.35)
                : project(a.group, ...a.anchors.get(id)),
            ];
          }),
    );
  }
  canvas.addEventListener('webglcontextrestored', () =>
    window.dispatchEvent(new Event('resize')),
  );
  return { draw, accent, renderer };
}
