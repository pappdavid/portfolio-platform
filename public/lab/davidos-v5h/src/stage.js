import * as T from '../vendor/three.module.min.js';
import {
  Drawing,
  heroBase,
  markSlice,
  base,
  layer,
  grid,
  registration,
  cutFace,
  needle,
} from './drawing.js';
import { systems, smooth, clamp, stateAt, runs } from './systems.js';

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
    camera = new T.OrthographicCamera(),
    root = new T.Group();
  scene.add(grid(), root);
  const hero = new T.Group(),
    slices = Array.from({ length: 6 }, (_, i) => markSlice(i, 6));
  hero.add(heroBase(), ...slices);
  root.add(hero);
  const board = base(),
    rulers = registration();
  root.add(board, rulers);
  const acts = systems.map((_, s) => {
    const group = new T.Group(),
      layers = Array.from({ length: 5 }, (_, i) => layer(s, i));
    group.add(...layers);
    root.add(group);
    const faces = layers.map((_, j) => cutFace(j));
    group.add(...faces);
    return { group, layers, faces };
  });
  const extras = [base(), base()];
  root.add(...extras);
  const arm = needle();
  root.add(arm);
  const runner = new Drawing();
  runner.plate(0, 0, 0.43, 0.35, 0, 0.14, 0.07, [0.94, 0.92], [1, 0.1]);
  const token = runner.build();
  root.add(token);
  const cells = [0, 1].map(() => {
    const d = new Drawing();
    d.plate(0, 0, 0.34, 0.53, 0, 0.09, 0.04, [0.82, 0.65], [0.97, 0]);
    return d.build();
  });
  root.add(...cells);
  const pins = new Drawing();
  for (const x of [-2.77, 2.77])
    for (const z of [-1.23, 1.23]) {
      for (let j = 0; j < 35; j++)
        pins.line([x, j * 0.15, z], [x, j * 0.15 + 0.07, z], [0.38, 0.45]);
    }
  const rods = pins.build();
  root.add(rods);
  const overlay = new T.Scene(),
    screenCam = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  screenCam.position.z = 2;
  const vertices = new Float32Array(84),
    buffer = new T.BufferGeometry(),
    attr = new T.BufferAttribute(vertices, 3);
  buffer.setAttribute('position', attr);
  const strokes = new T.LineSegments(
    buffer,
    new T.LineBasicMaterial({ color: 0x668678 }),
  );
  strokes.frustumCulled = false;
  overlay.add(strokes);
  const tagEls = Array.from({ length: 3 }, () => {
    const e = document.createElement('span');
    e.className = 'tag';
    e.innerHTML = '<b></b><i></i>';
    labels.append(e);
    return e;
  });
  let width = 0,
    height = 0;
  const vec = new T.Vector3();
  function accent(hex) {
    const c = new T.Vector3(
      ...hex.match(/\w\w/g).map((v) => parseInt(v, 16) / 255),
    );
    scene.traverse((o) => {
      if (o.userData.uniforms) o.userData.uniforms.accent.value.copy(c);
    });
  }
  function resize() {
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    if (w !== width || h !== height) {
      width = w;
      height = h;
      renderer.setSize(w, h, false);
    }
  }
  function project(obj, x, y, z) {
    return vec
      .set(x, y, z)
      .applyMatrix4(obj.matrixWorld)
      .project(camera)
      .clone();
  }
  function annotate(items) {
    let n = 0;
    const used = [];
    function edge(x, y, X, Y) {
      vertices.set(
        [
          (2 * x) / width - 1,
          1 - (2 * y) / height,
          0,
          (2 * X) / width - 1,
          1 - (2 * Y) / height,
          0,
        ],
        n,
      );
      n += 6;
    }
    items.forEach(([code, label, point, right, offset], i) => {
      const el = tagEls[i];
      el.hidden = false;
      if (el.lastChild.textContent !== label) {
        el.firstChild.textContent = code;
        el.lastChild.textContent = label;
      }
      const tw = el.offsetWidth,
        h = el.offsetHeight;
      let px = ((point.x + 1) * width) / 2,
        py = ((1 - point.y) * height) / 2;
      const x = right ? width - tw - 10 : 10;
      let y = clamp(py + offset * height, 8, height - h - 8);
      for (const box of used) {
        if (Math.abs(box.x - x) < tw + 8 && Math.abs(box.y - y) < h + 9)
          y = clamp(box.y + h + 9, 8, height - h - 8);
      }
      used.push({ x, y });
      el.style.transform =
        'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
      const end = right ? x - 4 : x + tw + 4,
        bend = end + (right ? -1 : 1) * 14;
      edge(px, py, bend, y + h / 2);
      edge(bend, y + h / 2, end, y + h / 2);
      edge(px - 2, py, px + 2, py);
      edge(px, py - 2, px, py + 2);
    });
    tagEls.slice(items.length).forEach((e) => (e.hidden = true));
    attr.needsUpdate = true;
    buffer.setDrawRange(0, n / 3);
  }
  function draw(s, intro = 1, still = false) {
    resize();
    const { i, b, t } = stateAt(s);
    const mobile = width < 480;
    const opening = i < 0,
      closing = i === 3;
    const morph = opening ? smooth(t) : 0;
    const wide = closing ? smooth(t / 0.62) : 0;
    const arrive = opening || closing ? 1 : smooth(t / 0.085),
      leave = opening || closing ? 0 : smooth((t - 0.9) / 0.1);
    const split =
      opening || closing ? 0 : smooth((t - 0.115) / 0.1) * (1 - leave);
    const boardY = opening ? 0.22 * morph : 0.22;
    const span = opening
      ? 10.4 - 0.85 * morph
      : closing
        ? 9.55 + 6.7 * wide
        : 9.55 + 0.5 * split - 0.14 * Math.sin(Math.PI * t);
    const aspect = width / height,
      frustum = Math.max(
        span / aspect,
        opening ? 5.4 : closing ? 5.8 : 5.95 + 1.22 * split,
      );
    camera.left = (-frustum * aspect) / 2;
    camera.right = -camera.left;
    camera.top = frustum / 2;
    camera.bottom = -camera.top;
    const aim = opening
      ? 0.56 + 0.22 * morph
      : closing
        ? 0.78 - 0.42 * wide
        : 0.78 + 1.52 * split;
    camera.position.set(
      -7.4 +
        (opening
          ? morph * 0.8
          : closing
            ? 0.8
            : 0.8 + 0.36 * Math.sin(Math.PI * t)),
      aim + 9.2,
      13.6,
    );
    camera.lookAt(0, aim, 0);
    camera.updateProjectionMatrix();
    root.rotation.y = opening
      ? -0.09 + 0.81 * morph
      : closing
        ? 0.72 * (1 - wide)
        : 0.72 * (1 - arrive) + 0.72 * leave;
    hero.visible = opening && morph < 1;
    hero.scale.set(1 - 0.19 * morph, 1 - morph, 1 - 0.19 * morph);
    slices.forEach((g, j) => {
      g.position.y =
        0.62 +
        j *
          (0.078 +
            (1 - smooth(intro)) * 0.37 +
            0.095 * Math.sin(Math.PI * morph));
      g.position.x = (1 - smooth(intro)) * (j - 2.5) * 0.21;
    });
    board.visible = !opening || morph > 0.001;
    board.position.set(0, opening ? 0 : boardY, 0);
    board.scale.setScalar(1);
    rulers.scale.setScalar(opening ? 1.22 - 0.22 * morph : 1);
    rulers.visible = !closing || wide < 1;
    rods.visible = split > 0.07;
    rods.position.y = 0.41;
    rods.scale.y = split * 0.86;
    token.visible = !opening && !closing && b > 0 && leave < 0.95;
    cells.forEach((c) => (c.visible = false));
    let activeObj;
    const beatFloat = (t - 0.14) / 0.15;
    const easeBeat = smooth((beatFloat - Math.max(0, b - 1)) / 0.6);
    for (let a = 0; a < 3; a++) {
      const { group, layers, faces } = acts[a];
      group.visible = a === i || closing;
      if (!group.visible) continue;
      const sc = closing
        ? (a === 2 ? 1 : 0.001) + (a === 2 ? -0.3 : 0.699) * wide
        : 1;
      group.scale.setScalar(sc);
      const dx = closing ? (a - 1) * 5.1 * wide : 0,
        dz = closing ? (a - 1) * 1.4 * wide : 0;
      group.position.set(dx, 0, dz);
      if (closing) {
        const foot = a === 2 ? board : extras[a];
        foot.visible = sc > 0.01;
        foot.scale.setScalar(sc);
        foot.position.set(dx, boardY * sc, dz);
      }
      layers.forEach((obj, j) => {
        const visibleHeight = closing ? smooth(t / 0.13) : arrive * (1 - leave);
        const baseH =
          0.405 + ((4 - j) * (0.235 + split * 0.71) + 0.095) * visibleHeight;
        const focus =
          b === 0 || closing ? 0 : clamp(1 - Math.abs(j - (b - 2 + easeBeat)));
        const section =
          closing || b === 0 ? 0 : split * smooth((b - 2 + easeBeat - j) * 1.2);
        obj.position.set(
          -focus * 0.22 * split,
          baseH + focus * 0.14 * split,
          focus * 0.53 * split,
        );
        const cut = -3.5 + 5.32 * section;
        obj.userData.uniforms.cut.value = cut;
        obj.userData.uniforms.focus.value = focus * split;
        const face = faces[j];
        face.visible = section > 0.074;
        face.position.copy(obj.position);
        face.position.x += cut;
        face.position.y += 0.001;
        face.userData.uniforms.light.value = 0.75;
        obj.scale.y = Math.max(0.001, visibleHeight);
        obj.userData.uniforms.light.value = 1 - split * (1 - focus) * 0.51;
        if (j === b - 1 && a === i) activeObj = obj;
      });
    }
    if (!closing) extras.forEach((e) => (e.visible = false));
    arm.visible = i === 1 && b > 0 && b < 4 && leave < 0.95;
    if (arm.visible && activeObj) {
      arm.position.copy(activeObj.position);
      arm.position.add(new T.Vector3(-0.88, 0.266, -0.02));
      arm.rotation.y = -Math.PI * (beatFloat * 0.8 + 0.14);
    }
    if (token.visible && activeObj) {
      const track = clamp(beatFloat - 0.48, 0, 4),
        lo = Math.floor(track),
        f = smooth(track - lo),
        layers = acts[i].layers;
      const h =
        layers[lo].position.y * (1 - f) +
        layers[Math.min(4, lo + 1)].position.y * f;
      const travel = smooth((beatFloat - Math.max(0, b - 1)) / 0.64);
      const from = layers[lo].position,
        to = layers[Math.min(4, lo + 1)].position;
      token.position.set(
        -1.67 - 0.52 * Math.sin(Math.PI * f) + from.x * (1 - f) + to.x * f,
        h + 0.22,
        1.03 + 0.19 * Math.sin(Math.PI * f) + from.z * (1 - f) + to.z * f,
      );
      if (i === 2) {
        const backward = b === 2 || b === 4;
        token.position.x =
          activeObj.position.x + (backward ? 1 : -1) * (1.58 - 3.16 * travel);
        token.position.y = activeObj.position.y + 0.42;
        token.position.z = activeObj.position.z - 0.06;
        if (b === 2)
          token.scale.setScalar(1 - 0.9 * smooth((travel - 0.4) / 0.6));
        else token.scale.setScalar(1);
      } else token.scale.setScalar(1);
      if (i === 2) {
        cells.forEach((c, k) => {
          c.visible = k < runs[b - 1].count;
          c.position.set(
            1.16 + k * 0.64 + activeObj.position.x,
            activeObj.position.y + 0.396,
            activeObj.position.z + 0.19,
          );
        });
      }
    }
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    let items = [];
    if (opening && morph < 0.6)
      items = [
        ['A', 'Mark die', project(slices[5], 2.5, 0.07, -0.62), true, -0.13],
        ['B', 'Carrier', project(hero, -2.9, 0.23, 1.97), false, 0.12],
      ];
    if (i >= 0 && !closing && t > 0.04 && t < 0.96) {
      const j = Math.max(0, b - 1),
        p = acts[i].layers[j];
      items = [
        [
          String.fromCharCode(65 + j),
          systems[i].parts[j],
          project(p, 2.6, 0.17, -0.5),
          true,
          -0.1,
        ],
      ];
      if (!mobile && split > 0.35) {
        const k = j === 4 ? 0 : 4;
        items.push([
          String.fromCharCode(65 + k),
          systems[i].parts[k],
          project(acts[i].layers[k], k === 0 ? 2.04 : -2.5, 0.15, 0.98),
          k === 0,
          k === 0 ? -0.15 : 0.105,
        ]);
      }
    }
    if (closing && wide > 0.8 && !mobile)
      items = [
        ['A', systems[0].id, project(acts[0].group, 0, 1.73, 0), false, 0.22],
        ['C', systems[2].id, project(acts[2].group, 0, 1.73, 0), true, -0.16],
      ];
    annotate(still ? [] : items);
    renderer.autoClear = true;
    renderer.render(scene, camera);
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(overlay, screenCam);
  }
  canvas.addEventListener('webglcontextrestored', () =>
    window.dispatchEvent(new Event('resize')),
  );
  return { draw, accent, renderer };
}
