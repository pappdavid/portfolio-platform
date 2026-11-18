// The opening uses screen-sized model units. Its orthographic view makes the front
// writing plane and semantic HTML share an aperture at every aspect ratio.
import * as T from "../vendor/three.module.min.js";
import { ramp, sourceReplay } from "./story.js";

const mix = T.MathUtils.lerp;
const V = (x, y, z = 0) => new T.Vector3(x, y, z);
const rect = (x, y, w, h, z = 0) => [
  V(x, y, z),
  V(x + w, y, z),
  V(x + w, y + h, z),
  V(x, y + h, z),
];
const blend = (a, b, t) => a.clone().lerp(b, t);
const panel = (points) => [
  points[0],
  points[1],
  blend(points[1], points[2], 0.14),
  points[2],
  points[3],
];
function show(el, amount) {
  if (amount < 0.5 && el.contains(document.activeElement)) {
    const target = document.activeElement.hash || "#client-studio";
    const rail = [...document.querySelectorAll("#chapters a")].find(
      (a) => a.hash === target,
    );
    rail?.focus({ preventScroll: true });
  }
  el.hidden = amount <= 0.001;
  el.inert = amount < 0.5;
  el.style.opacity = amount;
}
function place(el, x, y, w, h) {
  el.style.left = x + "px";
  el.style.top = y + "px";
  if (w !== undefined) el.style.width = w + "px";
  if (h !== undefined) el.style.height = h + "px";
}
export function createOpening() {
  const root = document.querySelector(".folio-opening"),
    face = root.querySelector(".folio-face"),
    id = root.querySelector(".folio-id"),
    proof = root.querySelector(".folio-proof"),
    leaves = [...root.querySelectorAll(".folio-leaf")],
    source = root.querySelector(".folio-source"),
    strip = root.querySelector(".folio-strip"),
    rows = [...face.querySelectorAll("li")],
    cursor = face.querySelector(".folio-cursor"),
    proofTitle = proof.querySelector("h2"),
    question = proof.querySelector(".folio-question"),
    pulses = rows.map((row) => [...row.querySelectorAll(".pulse")]),
    drawings = leaves.map((leaf) => leaf.querySelector("svg"));
  proof.querySelector(".folio-question p").textContent = sourceReplay.question;
  source.querySelector("small").textContent =
    "Public source · version " + sourceReplay.source.version;
  source.querySelector("strong").textContent = strip.textContent =
    sourceReplay.excerpt;
  const scene = new T.Scene(),
    camera = new T.OrthographicCamera(0, 1, 0, -1, 0.1, 10000);
  camera.position.z = 5000;
  const loader = new T.TextureLoader();
  let loaded = 0,
    ready = false,
    finish;
  const materialsReady = new Promise((resolve) => {
    finish = resolve;
  });
  const settled = () => {
    if (++loaded === 2)
      document.fonts.ready.then(() => {
        ready = true;
        finish();
      });
  };
  const [body, mask] = ["material", "emission"].map((key) =>
    loader.load("assets/folios/" + key + ".webp", settled, undefined, settled),
  );
  body.anisotropy = mask.anisotropy = 8;
  const ink = { value: new T.Vector3(0, 1, 0.533) },
    pass = { value: 0 };

  function surface(rgb, tile = -1, strength = 0) {
    const mat = new T.ShaderMaterial({
      side: T.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        body: { value: body },
        matte: { value: mask },
        color: { value: new T.Vector3(...rgb) },
        tile: { value: tile },
        strength: { value: strength },
        ink,
        pass,
        alpha: { value: 1 },
      },
      vertexShader:
        "varying vec2 st;void main(){st=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: `varying vec2 st;uniform sampler2D body,matte;uniform vec3 color,ink;uniform float tile,strength,pass,alpha;
        void main(){vec3 c=color;float e=strength;
        if(tile>=0.){vec2 uv=tile==1.?st.yx:st;vec2 p=vec2(uv.x,1.-(tile+mix(.02,.98,uv.y))*.25);c+=texture2D(body,p).rgb;e+=texture2D(matte,p).r;}
        vec3 result=pass==2.?vec3(e):c+(pass==1.?vec3(0.):ink)*e;
        gl_FragColor=vec4(result,alpha);}`,
    });
    return mat;
  }
  const graphite = surface([0.023, 0.026, 0.025], 2),
    rim = surface([0.032, 0.032, 0.032], 3),
    top = surface([0.05, 0.05, 0.05], 0),
    side = surface([0.04, 0.04, 0.04], 1),
    paper = surface([0.058, 0.068, 0.064]),
    edge = surface([0.33, 0.36, 0.34]),
    fold = surface([0.135, 0.16, 0.145]),
    lit = surface([0.02, 0.025, 0.02], -1, 0.77),
    stripMat = surface([0.015, 0.015, 0.015], -1, 0.94);
  function sheet(n, mat, order) {
    const g = new T.BufferGeometry(),
      coords = new T.BufferAttribute(new Float32Array(n * 3), 3);
    g.setAttribute("position", coords);
    const uv = new Float32Array(n * 2);
    const corners =
      n === 5
        ? [
            [0, 0],
            [0.86, 0],
            [1, 0.14],
            [1, 1],
            [0, 1],
          ]
        : [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ];
    corners.forEach((p, i) => uv.set(p, i * 2));
    g.setAttribute("uv", new T.BufferAttribute(uv, 2));
    const indices = [];
    for (let i = 1; i < n - 1; i++) indices.push(0, i, i + 1);
    g.setIndex(indices);
    const mesh = new T.Mesh(g, mat);
    mesh.renderOrder = order;
    mesh.frustumCulled = false;
    scene.add(mesh);
    mesh.onBeforeRender = () => {
      mat.uniforms.alpha.value = mesh.userData.exposure;
      mat.uniformsNeedUpdate = true;
    };
    return (pts, alpha = 1) => {
      mesh.visible = !!pts && alpha > 0.001;
      if (!mesh.visible) return;
      pts.forEach((v, i) => coords.setXYZ(i, v.x, -v.y, v.z));
      coords.needsUpdate = true;
      mesh.userData.exposure = alpha;
    };
  }
  const housings = Array.from({ length: 4 }, (_, i) => {
    const order = 4 * (3 - i) + 1;
    return {
      top: sheet(4, top, order),
      side: sheet(4, side, order + 1),
      lips: Array.from({ length: 4 }, () => sheet(4, rim, order + 2)),
      face: sheet(4, graphite, order + 3),
    };
  });
  const folios = Array.from({ length: 3 }, (_, i) => {
    const z = 22 + (2 - i) * 5;
    return {
      back: sheet(5, fold, z - 0.5),
      edge: sheet(5, edge, z),
      face: sheet(5, paper, z + 1),
      line: sheet(4, lit, z + 2),
      fold: sheet(4, fold, z + 3),
    };
  });
  const documentRules = Array.from(
    { length: sourceReplay.source.text.split(" ").length + 1 },
    () => sheet(4, lit, 39),
  );
  const fibers = Array.from({ length: 7 }, () => sheet(4, lit, 39));
  const band = Array.from({ length: 16 }, () => sheet(4, stripMat, 40));
  let w,
    h,
    mobile,
    box,
    px = 0,
    py = 0,
    tx = 0,
    ty = 0,
    oldTime = 0;
  const fine = matchMedia(
    "(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
  );
  const aim = (e) => {
    if (fine.matches && e.pointerType !== "touch") {
      tx = (e.clientX / innerWidth) * 2 - 1;
      ty = (e.clientY / innerHeight) * 2 - 1;
    }
  };
  addEventListener("pointermove", aim, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => {
    tx = ty = 0;
  });
  function resize(width, height) {
    w = width;
    h = height;
    mobile = w <= 960;
    camera.right = w;
    camera.bottom = -h;
    camera.updateProjectionMatrix();
    // CSS percentages are resolved against the field, including while hidden on direct entry.
    box = mobile
      ? [w * 0.0487, h * 0.295, w * 0.9026, h * 0.5438]
      : [w * 0.3125, h * 0.215556, w * 0.597222, h * 0.593333];
  }
  function positionTitle(u) {
    const leave = ramp(u, 1.58, 1.86);
    const arrival =
      leave && !proof.hidden && document.querySelector("#copy h2");
    let dx = 0,
      dy = 0;
    if (arrival) {
      const to = arrival.getBoundingClientRect(),
        ink = getComputedStyle(arrival);
      const size = mobile ? 34 : Math.min(58, Math.max(25, w * 0.03));
      proofTitle.style.fontSize =
        mix(size, parseFloat(ink.fontSize), leave) + "px";
      proofTitle.style.letterSpacing =
        mix(-0.065 * size, parseFloat(ink.letterSpacing), leave) + "px";
      proofTitle.style.lineHeight =
        mix(size * 1.12, parseFloat(ink.lineHeight), leave) + "px";
      dx = leave * (to.left - proof.offsetLeft);
      dy =
        leave *
        (to.top -
          proof.offsetTop +
          (mobile ? 0 : proof.offsetHeight / 2) -
          proofTitle.offsetTop);
    } else {
      proofTitle.style.removeProperty("font-size");
      proofTitle.style.removeProperty("letter-spacing");
      proofTitle.style.removeProperty("line-height");
    }
    proof.style.translate = dx + "px " + dy + "px";
  }
  function draw(renderer, u, time, targets, light) {
    root.hidden = u >= 2;
    if (root.hidden || !ready) return;
    root.style.opacity = light;
    root.classList.add("is-live");
    const [x, y, W, H] = box,
      base = Math.min(w / 1440, h / 900),
      unit = mobile ? Math.min(w / 390, 1.25) : base;
    const pivot = ramp(u, 0.22, 0.5),
      fan = ramp(u, 0.34, 0.7),
      open = ramp(u, 0.88, 1.06),
      lift = ramp(u, 1.06, 1.22),
      join = ramp(u, 1.62, 1.8),
      dock = ramp(u, 1.65, 1.98),
      gone = ramp(u, 1.64, 1.8);
    const idle = 1 - ramp(u, 0.03, 0.18),
      dt = Math.min(0.08, Math.max(0, time - oldTime));
    oldTime = time;
    px = mix(px, fine.matches ? tx : 0, 1 - Math.exp(-8 * dt));
    py = mix(py, fine.matches ? ty : 0, 1 - Math.exp(-8 * dt));
    const yaw = ((70 * Math.PI) / 180) * pivot,
      dx = mobile ? 1.4 : 12,
      dy = mobile ? 2 : 11;
    // Shallow axonometric depth: the front datum is fixed; only the return faces answer the pointer.
    const departure = ramp(u, 0.5, 0.76);
    function shellPoint(a, b, d, layer) {
      const hinge = layer === 0 ? yaw : yaw * 0.08;
      const aside =
        (layer === 0 ? -1 : 0) * departure * (mobile ? 0.25 : 0.085) * W;
      return V(
        x +
          a * Math.cos(hinge) +
          d * (0.43 + Math.tan(px * 0.0235) * idle) +
          aside,
        y +
          b -
          a * Math.sin(hinge) * 0.052 -
          d * (0.39 + Math.tan(py * 0.0235) * idle),
        d + a * Math.sin(hinge),
      );
    }
    housings.forEach((q, i) => {
      const reach = mobile ? 3.8 : 12,
        offset = i * reach * unit,
        pad = (mobile ? 4 : 10) * unit;
      function point(a, b, d) {
        const v = shellPoint(a, b, d, i);
        v.x += i * dx * unit;
        v.y -= i * dy * unit;
        return v;
      }
      const outer = [
        point(-pad, -pad, offset),
        point(W + pad, -pad, offset),
        point(W + pad, H + pad, offset),
        point(-pad, H + pad, offset),
      ];
      const back = [
        point(-pad, -pad, offset + reach * 2.8 * unit),
        point(W + pad, -pad, offset + reach * 2.8 * unit),
        point(W + pad, H + pad, offset + reach * 2.8 * unit),
      ];
      const a = (1 - ramp(u, 0.46, 0.79)) * (i === 0 ? 1 : 1 - fan);
      q.top([outer[0], outer[1], back[1], back[0]], a);
      q.side([outer[1], outer[2], back[2], back[1]], a);
      const aperture = [
        point(0, 0, offset),
        point(W, 0, offset),
        point(W, H, offset),
        point(0, H, offset),
      ];
      q.lips.forEach((put, j) => {
        const k = (j + 1) % 4;
        put([outer[j], outer[k], aperture[k], aperture[j]], a);
      });
      q.face(aperture, a);
    });
    const byline = 1 - ramp(u, 0.035, 0.125),
      faceInk = 1 - ramp(pivot, 0.035, 0.13);
    show(id, byline);
    show(face, faceInk);
    face.style.transform =
      "matrix(" +
      Math.cos(yaw) +
      "," +
      -0.052 * Math.sin(yaw) +
      ",0,1," +
      -departure * (mobile ? 0.25 : 0.085) * W +
      ",0)";
    show(proof, u < 1.985 ? ramp(u, 0.125, 0.22) : 0);
    proof.style.setProperty("--proof-copy", 1 - ramp(u, 1.75, 1.87));
    question.style.opacity = open * (1 - ramp(u, 1.61, 1.77));
    face.style.setProperty("--selection", ramp(u, 0.03, 0.22));
    cursor.style.opacity = time % 1.12 < 0.72 ? 1 : 0;
    pulses.forEach((paths, i) => {
      const phase = (((time / 3.6 + 1 - i / 3) % 1) + 1) % 1;
      const p = phase * 2.45;
      paths.forEach((path, j) => {
        path.style.strokeDashoffset = String(-p - j * 0.029);
        path.style.opacity = String(
          (1 - ramp(p, 0.93, 1.09)) * [0.48, 0.8, 1][j] * idle,
        );
      });
    });
    const expose = ramp(u, 0.27, 0.51);
    let sourceBox, sourceCorners;
    folios.forEach((q, i) => {
      // Rear silhouettes each get a complete exposed horizontal shelf at the fan hold.
      const front = 2 - i;
      const fw = mobile
          ? W * (0.89 + 0.022 * front)
          : W * (0.73 + 0.035 * front),
        fh = mobile ? H * 0.33 : H * 0.36;
      const xx = mobile
        ? x + W * (0.11 - 0.051 * front)
        : x + W * (0.32 - 0.135 * front);
      const yy = mobile
        ? y + H * (0.018 + 0.313 * front)
        : y + H * (-0.075 + 0.349 * front);
      const fx = mix(x + W * 0.08, xx, fan),
        fy = mix(y + H * (0.03 + 0.075 * front), yy, fan);
      const sx =
          i === 0 ? mix(fx, mobile ? x + 5 * unit : x + W * 0.037, open) : fx,
        sy =
          i === 0 ? mix(fy, mobile ? y + H * 0.636 : y + H * 0.624, open) : fy,
        sw = i === 0 ? mix(fw, mobile ? W * 0.97 : W * 0.82, open) : fw,
        sh = i === 0 ? mix(fh, mobile ? H * 0.35 : H * 0.403, open) : fh;
      // The rear leaves lean out of the hinge around their vertical and horizontal axes.
      // Their projected plane basis drives the SVG scale and the tab's DOM baseline.
      const angle =
        (((10 + i * 4) * Math.PI) / 180) * fan * (i === 0 ? 1 - open : 1);
      const pitch =
        (((mobile ? 3.5 : 8) * Math.PI) / 180) * fan * (i === 0 ? 1 - open : 1);
      const along = V(
        Math.cos(angle) + 0.32 * Math.sin(angle),
        -0.15 * Math.sin(angle),
        Math.sin(angle),
      );
      const down = V(
        -0.3 * Math.sin(pitch),
        Math.cos(pitch) + 0.16 * Math.sin(pitch),
        -Math.sin(pitch),
      );
      const planeAt = (lx, ly) =>
        V(sx, sy).addScaledVector(along, lx).addScaledVector(down, ly);
      let corners = panel(rect(sx, sy, sw, sh));
      corners[1].x -= mobile ? 13 : 25;
      corners[2].y = sy + (mobile ? 13 : 25);
      corners = corners.map((v) => planeAt(v.x - sx, v.y - sy));
      if (i === 0)
        corners = corners.map((v, j) => blend(v, targets.doc[j], dock));
      const a = expose * (i === 0 ? 1 - ramp(u, 1.96, 1.995) : 1 - gone);
      q.back(
        corners.map((v) =>
          v
            .clone()
            .add(V(4 * unit * (1 - dock), -4 * unit * (1 - dock), -4 * unit)),
        ),
        a,
      );
      q.edge(corners, a);
      const inset = corners.map((v, j) =>
        V(
          v.x + ([0, 4].includes(j) ? 1 : -1) * unit,
          v.y + (j <= 1 ? 1 : -1) * unit,
          v.z,
        ),
      );
      q.face(inset, a);
      const v0 = corners[0],
        v1 = corners[1];
      q.line(
        [
          v0,
          blend(v0, v1, 0.29),
          blend(v0, v1, 0.29).add(V(0, 2 * unit)),
          v0.clone().add(V(0, 2 * unit)),
        ],
        a * (1 - dock),
      );
      q.fold(
        [corners[1], corners[2], V(corners[1].x, corners[2].y), corners[1]],
        a * (1 - dock),
      );
      const el = leaves[i];
      const mx = mobile ? 12 * unit : 19 * unit,
        my = mobile ? 8 * unit : 12 * unit;
      const tab = planeAt(mx, my);
      place(el, tab.x, tab.y, sw - 2 * mx, sh - 2 * my);
      el.style.transform =
        "matrix(" + [along.x, along.y, down.x, down.y, 0, 0].join(",") + ")";
      // Occlude ink with the sheet in front until there is room for its named shelf.
      const shelf = mix(H * 0.075, H * (mobile ? 0.313 : 0.349), fan);
      el.style.clipPath =
        i === 0
          ? "none"
          : "inset(0 0 " + Math.max(0, sh - shelf - my) + "px 0)";
      show(el, expose * (1 - gone));
      drawings[i].style.opacity = i === 0 ? 1 - open : 1;
      if (i === 0) {
        sourceBox = { sx, sy, sw, sh, mx, my };
        sourceCorners = corners;
      }
    });
    const { sx, sy, sw, sh, mx } = sourceBox;
    // Ink resolves to the word lengths and excerpt underline of the landing document.
    const uv = (x, y) =>
      blend(
        blend(sourceCorners[0], sourceCorners[4], y),
        blend(sourceCorners[1], sourceCorners[3], y),
        x,
      );
    let run = 0.09,
      line = 0.17;
    const words = sourceReplay.source.text.split(" ");
    documentRules.forEach((put, i) => {
      const width = i === words.length ? 0.78 : words[i].length * 0.024;
      if (run + width > 0.88) {
        run = 0.09;
        line += 0.08;
      }
      const start = i === words.length ? 0.09 : run,
        top = i === words.length ? 0.83 : line;
      put(
        [
          uv(start, top),
          uv(start + width, top),
          uv(start + width, top + 0.011),
          uv(start, top + 0.011),
        ],
        ramp(u, 1.6, 1.76) * (1 - ramp(u, 1.9, 1.99)) * 0.79,
      );
      run += width + 0.032;
    });
    const sourceX = sx + mx,
      sourceY = sy + sh * (mobile ? 0.18 : 0.23);
    place(source, sourceX, sourceY);
    show(source, open * (1 - ramp(u, 1.62, 1.75)));
    // A CSS baseline offset locates the original excerpt without sampling a transformed DOM rect.
    const font = mobile ? 17 : Math.min(28, Math.max(18, w * 0.017));
    const original = V(sourceX - 4, sourceY + 18 + 12 + font * 1.35);
    const lifted = V(
      sx + sw * (mobile ? 0.33 : 0.51),
      sy + sh * (mobile ? 0.76 : 0.68),
    );
    const left = blend(original, lifted, lift),
      bandW = mobile ? 170 : Math.min(264, sw * 0.42),
      bandH = font * 1.5;
    const stripOpacity = ramp(lift, 0, 0.19) * (1 - ramp(u, 1.8, 1.86));
    const right = left.clone().add(V(bandW, 0));
    const dir = targets.tangent,
      joint = targets.joint;
    const near = joint.clone().addScaledVector(dir, -Math.max(18, w * 0.032));
    const nearLeft = blend(left, near, join),
      nearRight = blend(right, joint, join);
    const bottom = (t) =>
      blend(nearLeft, nearRight, t).add(V(0, (1 - join) * bandH + join * 0.75));
    fibers.forEach((put, i) => {
      const start = original.clone().add(V((mobile ? 35 : 78) + i * 3, bandH));
      const finish = left.clone().add(V(16 + i * 3, bandH));
      const normal = V(-(finish.y - start.y), finish.x - start.x)
        .normalize()
        .multiplyScalar(0.72);
      put(
        [start, finish, finish.clone().add(normal), start.clone().add(normal)],
        lift * (1 - join) * 0.65,
      );
    });
    band.forEach((put, i) => {
      const a = i / band.length,
        b = (i + 1) / band.length;
      const point = (t) =>
        blend(nearLeft, nearRight, t).add(
          V(0, -Math.sin(t * Math.PI) * lift * (1 - lift) * 8),
        );
      put([point(a), point(b), bottom(b), bottom(a)], stripOpacity);
    });
    place(strip, left.x + 7, left.y + 1);
    show(strip, ramp(lift, 0.08, 0.35) * (1 - ramp(u, 1.62, 1.69)));
    const previous = renderer.autoClear;
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(scene, camera);
    renderer.autoClear = previous;
    return {
      joint: [nearRight.x, nearRight.y],
      ribbon: [joint.x, joint.y],
      tangent: [nearRight.x - nearLeft.x, nearRight.y - nearLeft.y],
      ribbonTangent: [dir.x, dir.y],
      documentCorners: sourceCorners.map((p) => [p.x, p.y]),
      destination: targets.doc.map((p) => [p.x, p.y]),
      corners: dock,
      yaw: (yaw * 180) / Math.PI,
      pointerDegrees: Math.hypot(px, py) * 1.35 * idle,
    };
  }
  return {
    resize,
    draw,
    materialsReady,
    positionTitle,
    accent(hex) {
      const n = parseInt(hex.slice(1), 16);
      ink.value.set((n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
    },
    // Neutral and emission passes are used to bake the responsive pre-script posters.
    setPass(n) {
      pass.value = n;
    },
  };
}
