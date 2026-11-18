// The opening borrows geometry buffers from the three acts. Each print has its
// own projection and uniforms so pulsing it cannot advance the underlying tour.
import * as T from "../vendor/three.module.min.js";
import { Drawing, inks } from "./drawing.js";
import { filamentMesh } from "./filaments.js";
import { sourceReplay } from "./story.js";

function textRules(d, text, x, y, z, width, em, role) {
  let offset = 0;
  for (const word of String(text).split(/\s+/)) {
    const length = Math.min(width, word.length * em);
    if (offset && offset + length > width) {
      offset = 0;
      y -= em * 2.6;
    }
    d.line([x + offset, y, z], [x + offset + length, y, z], role);
    offset += length + em;
  }
}

// The large acts set these values in HTML. At miniature scale their word,
// field and row lengths remain visible ink, using the same Drawing primitive.
function recordInk(index, data) {
  const d = new Drawing();
  if (index === 0) {
    const sources = sourceReplay.sources
      .map((s) => "v" + s.version + " " + s.visibility)
      .join(" ");
    const fields = [
      ["Sources", sources],
      ["Question", sourceReplay.question],
      ["Answer", sourceReplay.source.text],
      ["Review", "Approve Activate"],
    ];
    [
      [-7.6, 3.45, 4.8],
      [7.7, 2.95, 3.85],
    ].forEach(([cx, w, h], page) => {
      fields.slice(0, page ? 3 : 4).forEach(([label, value], i) => {
        const y = 0.15 + h * (0.245 - i * 0.15),
          left = cx - w * 0.35;
        textRules(d, label, left, y, 0.345, w * 0.7, 0.083, -0.72);
        textRules(
          d,
          page && i === 0 ? "v2 public" : value,
          left,
          y - 0.14,
          0.35,
          w * 0.72,
          0.085,
          i === 2 ? 0.76 : -0.84,
        );
      });
    });
  } else if (index === 2) {
    const payload = [
      data.visit.operation,
      data.visit.service,
      data.visit.slot,
      data.visit.location,
      data.visit.key,
    ];
    payload.forEach((value, i) => {
      const y = 1.44 - i * 0.59;
      d.path(
        [
          [-12.1, y + 0.2, 0.02],
          [-12.1, y - 0.22, 0.02],
          [-9.8, y - 0.22, 0.02],
          [-9.8, y, 0.02],
        ],
        -0.65,
      );
      textRules(d, value, -11.96, y, 0.04, 1.99, 0.068, -0.78);
    });
    // Bind the visited row and receipt using their actual column bounds and stored fields.
    for (const y of [2.64, 2.16, 1.61])
      d.line([2.33, y, 0.37], [9.7, y, 0.37], -0.83);
    d.line([2.33, 2.64, 0.37], [2.33, 1.61, 0.37], -0.83);
    d.line([9.7, 2.64, 0.37], [9.7, 1.61, 0.37], -0.83);
    const values = ["id", "key", "operation", "service", "slot", "location"];
    values.forEach((key, i) => {
      const x = 2.33 + data.columns[i] + 0.08,
        width = data.columns[i + 1] - data.columns[i] - 0.16;
      textRules(d, key, x, 2.47, 0.23, width, 0.052, -0.68);
      const segments = String(data.visit[key])
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean);
      const sum = segments.reduce((n, w) => n + w.length + 1, 0);
      let cursor = x;
      for (const word of segments) {
        const advance = (width * (word.length + 0.5)) / sum;
        for (const y of [1.92, 1.98, 2.04])
          d.line([cursor, y, 0.4], [cursor + advance, y, 0.4], -0.85);
        cursor += advance + (width * 0.5) / sum;
      }
    });
    const left = 4.47,
      right = 9.7,
      top = -0.63,
      bottom = -1.38,
      split = 6.68;
    d.path(
      [
        [left, top, 0.58],
        [right, top, 0.58],
        [right, bottom, 0.58],
        [left, bottom, 0.58],
      ],
      -0.77,
      true,
    );
    d.line([split, top, 0.58], [split, bottom, 0.58], -0.76);
    textRules(
      d,
      data.visit.operation,
      left + 0.18,
      top - 0.29,
      0.6,
      2,
      0.075,
      0.76,
    );
    textRules(
      d,
      data.receipt.id,
      split + 0.18,
      top - 0.29,
      0.6,
      2,
      0.075,
      -0.77,
    );
    // The two interruption sites are points on the request and reply curves.
    const point = data.pulses[1][0].at(-1);
    d.path(
      [
        [point[0] - 0.12, point[1] - 0.2, point[2]],
        [point[0], point[1], point[2]],
        [point[0] + 0.11, point[1] + 0.22, point[2]],
      ],
      0.95,
    );
  }
  return d.build(inks());
}

function labels(index, data) {
  if (index === 0)
    return [
      ["Studio page", -7.6, -2.61, 0.3],
      ["Public · v2", -1.0, 3.74, -0.9, "caption"],
      ["Customer runtime", 7.7, -2.1, 0.3],
      ...sourceReplay.sources.map((s, i) => [
        "v" + s.version + " · " + s.visibility,
        -7.6,
        1.17 - i * 0.72,
        0.35,
        "value",
      ]),
      ["v2 · public", 7.7, 0.95, 0.35, "value"],
      [
        sourceReplay.excerpt.replace(" records", "\nrecords"),
        7.7,
        -0.36,
        0.35,
        "value",
      ],
    ];
  if (index === 1)
    return [
      ["Knowledge", -6.8, 0.68, -0.22],
      ["Retrieval field", 0.5, 2.99, -3.52],
      ["30 s window", -2.02, -1.95, 0.8, "caption"],
      ["Source cards", 8.0, 0.32, 0.4],
      ["0 s", -8.98, -1.53, 0.7],
      ["60 s", 3.3, -1.53, 0.7],
    ];
  return [
    ["Client", -10.95, -1.44, 0.04, "caption"],
    ["Visits · " + data.visit.id, 5.9, 3.02, 0.1, "caption"],
    ["Receipts", 7.32, 0.7, 0.6],
    ...["operation", "service", "slot", "location", "key"].map((k, i) => [
      k,
      -10.95,
      1.45 - i * 0.59,
      0.1,
      "value",
    ]),
    ["id", 2.88, 2.41, 0.39, "value"],
    ["key", 3.96, 2.41, 0.39, "value"],
    ["slot", 7.71, 2.41, 0.39, "value"],
    [data.visit.operation, 5.54, -1.01, 0.62, "value"],
    [data.receipt.id, 8.16, -1.01, 0.62, "value"],
    ["Receive", 2.04, -0.02, 0.04],
    ["POST /visits", -4.24, 1.86, -0.92],
  ];
}
const point = new T.Vector3();
export function createDiagram(data, index, accent) {
  const group = new T.Group(),
    content = new T.Group();
  const uniforms = inks().uniforms,
    viewport = uniforms.viewport;
  uniforms.accent = accent;
  uniforms.mist.value = uniforms.distantFade.value = 0;
  const packetMaterials = [],
    annotations = labels(index, data),
    extra = recordInk(index, data),
    etched = [];
  const fade = { value: 1 };
  const pulseGeometry = data.pulses.map(([path, count, spread, options]) =>
    filamentMesh(path, count, spread, uniforms, { ...options, active: true }),
  );
  const borrowed = [...data.parts];
  if (data.bracket) {
    const bracket = data.bracket.clone();
    bracket.position.set(data.bracketStart, -1.66, 0.8);
    borrowed.push(bracket);
  }
  borrowed.push(extra, ...pulseGeometry);
  for (const obj of borrowed) {
    obj.updateMatrix();
    const include = (node, local) => {
      if (node.isInstancedMesh) return; // At this distance the prefix-integrated field owns the surface.
      if (node.isMesh) {
        const original = node.material;
        const mat = original.clone();
        // A retrieval field's prefix texture is fixture data, preserved by reference.
        mat.uniforms = {
          ...original.uniforms,
          ...uniforms,
          exposure: { value: 1 },
        };
        if (mat.uniforms.light) mat.uniforms.light = { value: 0.85 };
        if (mat.uniforms.dpr)
          mat.uniforms.dpr = { value: Math.min(devicePixelRatio, 3) };
        mat.uniforms.previewFade = fade;
        mat.fragmentShader =
          "uniform float previewFade;\n" +
          mat.fragmentShader.replace(/}\s*$/, "gl_FragColor.a*=previewFade;}");
        if (mat.uniforms.tinted && !pulseGeometry.includes(node)) {
          const accented =
            data.highlight.includes(obj) || mat.uniforms.tinted.value;
          mat.uniforms.tinted = { value: accented ? 0.94 : 0.4 };
          mat.uniforms.exposure.value = accented ? 2.5 : 1.75;
        }
        mat.transparent = true;
        mat.forceSinglePass = true;
        let order = original.transparent ? 2 : 1;
        if (pulseGeometry.includes(node)) {
          packetMaterials.push(mat);
          mat.uniforms.elapsed = { value: 0 };
          mat.uniforms.duration = { value: 1.25 };
          order = 3;
        }
        const mesh = new T.Mesh(node.geometry, mat);
        mesh.matrixAutoUpdate = false;
        mesh.matrix.copy(local);
        mesh.userData.inkOrder = order;
        mesh.frustumCulled = false;
        content.add(mesh);
        if (obj === extra) etched.push(mesh);
      }
      for (const child of node.children) {
        child.updateMatrix();
        include(child, local.clone().multiply(child.matrix));
      }
    };
    include(obj, obj.matrix);
  }
  content.rotation.set(0.43, -0.115, -0.012, "XYZ");
  content.updateMatrixWorld(true);
  const bounds = new T.Box3().setFromObject(content, true);
  const extent = bounds.getSize(new T.Vector3()),
    center = bounds.getCenter(new T.Vector3());
  group.add(content);
  group.matrixAutoUpdate = false;
  // Both surfaces exist while the cover turns. They share all source geometry
  // and packet clocks, with independent opacity and screen-space stroke widths.
  const cover = group.clone(true);
  const coverViewport = { value: new T.Vector2() };
  const coverFade = { value: 0 };
  cover.traverse((mesh) => {
    if (!mesh.isMesh) return;
    const original = mesh.material;
    mesh.material = original.clone();
    mesh.material.uniforms = {
      ...original.uniforms,
      viewport: coverViewport,
      previewFade: coverFade,
    };
  });
  const projection = new T.Matrix4(),
    model = new T.Matrix4(),
    basisX = new T.Vector3(),
    basisY = new T.Vector3(),
    basisZ = new T.Vector3();
  // Flatten only the hierarchy, retaining the shaders' original depth buffer and draw order.
  function place(
    origin,
    along,
    down,
    width,
    height,
    order,
    amount,
    time,
    screenW,
    screenH,
    onCover = false,
  ) {
    const print = onCover ? cover : group;
    print.visible = amount > 0.001;
    if (!print.visible) return;
    const sx = Math.min(width / extent.x, (height / extent.y) * 1.38);
    const sy = Math.min(height / extent.y, (width / extent.x) * 1.22);
    basisX.set(along.x, -along.y, 0);
    basisY.set(-down.x, down.y, 0);
    basisZ.set(0, 0, 1);
    projection.makeBasis(basisX, basisY, basisZ);
    projection.setPosition(origin.x, -origin.y, 1600 - index * 420);
    model.makeScale(sx, sy, Math.min(sx, sy));
    model.setPosition(-center.x * sx, -center.y * sy, 0);
    print.matrix.multiplyMatrices(projection, model);
    print.matrixWorldNeedsUpdate = true;
    // Shader widths are specified in CSS pixels and filtered at the framebuffer's native DPR.
    const pen = width < 390 ? 1.85 : 1.4;
    (onCover ? coverViewport : viewport).value.set(
      screenW * pen,
      screenH * pen,
    );
    (onCover ? coverFade : fade).value = Math.min(1, amount);
    uniforms.siteInk.value = 1;
    print.children[0].children.forEach((mesh) => {
      mesh.renderOrder = order + mesh.userData.inkOrder * 0.1;
    });
    const clock = (time + 4.2 - index * 0.97) % 4.2;
    packetMaterials.forEach((mat, j) => {
      mat.uniforms.elapsed.value = clock - j * 0.63;
    });
    print.updateMatrixWorld(true);
  }
  function anchors() {
    return annotations.map(([name, x, y, z, kind]) => {
      point.set(x, y, z).applyMatrix4(content.matrixWorld);
      return { name, x: point.x, y: -point.y, kind };
    });
  }
  function showRecordValues(show) {
    // The paper form itself survives the transition from engraved values to readable type.
    etched.forEach((mesh) => {
      mesh.material.uniforms.exposure.value = show
        ? index === 2
          ? 0.82
          : 0.17
        : 1;
    });
  }
  return { group, cover, content, place, anchors, showRecordValues };
}
