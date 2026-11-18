import * as T from "../vendor/three.module.min.js";
import { Print, printed, rgb } from "./folio-text.js";
export function device(canvas) {
  const gl = canvas.getContext("webgl2", {
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  if (!gl) throw Error("WebGL2 unavailable");
  const renderer = new T.WebGLRenderer({
    canvas,
    context: gl,
    antialias: true,
    alpha: false,
  });
  renderer.setClearColor(0x0a0a0a);
  const camera = new T.PerspectiveCamera(32, 1, 1, 10000),
    scene = new T.Scene();
  const accent = { value: new T.Vector3(...rgb("#00ff88")) };
  let w = 0,
    h = 0;
  function resize(width, height) {
    w = width;
    h = height;
    renderer.setPixelRatio(Math.min(3, devicePixelRatio));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = h / (2 * Math.tan((Math.PI * camera.fov) / 360));
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }
  function pose(group, cx, cy, z, yaw = 0, pitch = 0, roll = 0) {
    const scale = (camera.position.z - z) / camera.position.z;
    group.position.set((cx - w / 2) * scale, (h / 2 - cy) * scale, z);
    group.scale.setScalar(scale);
    group.rotation.set(
      (pitch * Math.PI) / 180,
      (yaw * Math.PI) / 180,
      (roll * Math.PI) / 180,
    );
  }
  return {
    renderer,
    camera,
    scene,
    accent,
    resize,
    pose,
    setAccent(hex) {
      accent.value.fromArray(rgb(hex));
    },
  };
}
const box = new T.BoxGeometry(1, 1, 1);
export function sheet(texture, accent, name, tab = true) {
  const root = new T.Group(),
    local = new T.Group();
  root.add(local);
  const face = new T.MeshBasicMaterial({ color: 0x151917 }),
    edge = new T.MeshBasicMaterial({ color: 0x1d2521 });
  const materials = [edge, edge, edge, edge, face, edge];
  function body() {
    const mesh = new T.Mesh(box, materials);
    local.add(mesh);
    return mesh;
  }
  const panel = body(),
    lip = body(),
    header = printed(texture, accent);
  local.add(header.group);
  header.group.position.z = 0.22;
  let key = "";
  function size(w, h, selected = true, phone = false) {
    local.position.set(-w / 2, h / 2, 0);
    const thick = phone ? 2.2 : 3.5;
    panel.scale.set(w, h, thick);
    panel.position.set(w / 2, -h / 2, -thick / 2);
    const font = phone ? 17 : 23,
      tw = font * 0.6 * name.length + (phone ? 22 : 36),
      th = phone ? 27 : 37;
    lip.visible = tab;
    lip.scale.set(tw, th + 1, thick);
    lip.position.set(tw / 2, th / 2 - 0.5, -thick / 2);
    face.color.set(selected ? 0x151917 : 0x101412);
    const signature = [Math.round(w * 2) / 2, selected, phone].join("/");
    if (signature !== key) {
      key = signature;
      const p = new Print();
      p.line(0, 0.7, w, 0.7, selected ? "accent" : "rule", selected ? 1 : 0.8);
      if (tab) {
        p.text(
          name,
          phone ? 10 : 16,
          -(th - font) * 0.65,
          font,
          selected ? "accent" : "quiet",
          700,
        );
        p.line(0, -th, tw, -th, selected ? "accent" : "rule", 0.9);
      }
      header.set(p);
      header.items = p.items;
    }
  }
  return { root, local, size, panel, header };
}
