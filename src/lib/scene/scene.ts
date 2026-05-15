import * as THREE from 'three';
import type { ModuleId, SceneHandle } from './types';

const EMERALD = new THREE.Color('#22c55e');
const EMERALD_DIM = new THREE.Color('#0e7c3a');
const INK = new THREE.Color('#f5f3ee');

// Suppress unused var warnings — kept for reference parity with design
void EMERALD_DIM;
void INK;

function makeRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  r.setClearColor(0x000000, 0);
  r.outputColorSpace = THREE.SRGBColorSpace;
  return r;
}

function fit(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, el: HTMLElement): void {
  const w = el.clientWidth, h = el.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

interface CoreParts {
  group: THREE.Group;
  shellSeams: THREE.LineSegments;
  innerWire: THREE.LineSegments;
  nucleus: THREE.Mesh;
  ring: THREE.Mesh;
  ringInner: THREE.Mesh;
  glow: THREE.Mesh;
}

function buildOperatorCore(): CoreParts {
  const group = new THREE.Group();

  const shellGeo = new THREE.DodecahedronGeometry(1.1, 0);
  const shellFill = new THREE.Mesh(
    shellGeo,
    new THREE.MeshBasicMaterial({ color: 0x141210, transparent: true, opacity: 0.94 })
  );
  group.add(shellFill);

  const shellSeams = new THREE.LineSegments(
    new THREE.EdgesGeometry(shellGeo, 1),
    new THREE.LineBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.55 })
  );
  group.add(shellSeams);

  const innerGeo = new THREE.IcosahedronGeometry(0.78, 0);
  const innerFill = new THREE.Mesh(
    innerGeo,
    new THREE.MeshBasicMaterial({ color: 0x0a0908, transparent: true, opacity: 0.9 })
  );
  group.add(innerFill);
  const innerWire = new THREE.LineSegments(
    new THREE.WireframeGeometry(innerGeo),
    new THREE.LineBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.25 })
  );
  group.add(innerWire);

  const nucleus = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.18, 1),
    new THREE.MeshBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.95 })
  );
  group.add(nucleus);

  const ringGeo = new THREE.RingGeometry(1.3, 1.32, 96);
  const ring = new THREE.Mesh(
    ringGeo,
    new THREE.MeshBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -1.6;
  group.add(ring);

  const ringGeoInner = new THREE.RingGeometry(1.10, 1.115, 96);
  const ringInner = new THREE.Mesh(
    ringGeoInner,
    new THREE.MeshBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
  );
  ringInner.rotation.x = -Math.PI / 2;
  ringInner.position.y = -1.6;
  group.add(ringInner);

  const glowGeo = new THREE.CircleGeometry(1.6, 64);
  const glowMat = new THREE.MeshBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.12 });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -1.59;
  group.add(glow);

  return { group, shellSeams, innerWire, nucleus, ring, ringInner, glow };
}

interface ModuleDef {
  id: ModuleId;
  radius: number;
  tilt: number;
  phase: number;
  speed: number;
}

interface ModuleObjects {
  group: THREE.Group;
  rail: THREE.Mesh;
  node: THREE.Mesh;
  nodeWire: THREE.LineSegments;
  halo: THREE.Mesh;
  id: ModuleId;
  radius: number;
  tilt: number;
  phase: number;
  speed: number;
  focus: number;
  targetFocus: number;
}

function buildModule(def: ModuleDef): ModuleObjects {
  const group = new THREE.Group();

  const railGeo = new THREE.TorusGeometry(def.radius, 0.004, 8, 240);
  const rail = new THREE.Mesh(
    railGeo,
    new THREE.MeshBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.10 })
  );
  rail.rotation.x = def.tilt;

  const nodeGeo = new THREE.OctahedronGeometry(0.12, 0);
  const node = new THREE.Mesh(
    nodeGeo,
    new THREE.MeshBasicMaterial({ color: 0xf5f3ee, transparent: true, opacity: 0.85 })
  );
  group.add(node);
  const nodeWire = new THREE.LineSegments(
    new THREE.WireframeGeometry(nodeGeo),
    new THREE.LineBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.85 })
  );
  group.add(nodeWire);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 16, 16),
    new THREE.MeshBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.18 })
  );
  group.add(halo);

  const tickGeo = new THREE.BufferGeometry();
  const tickPos = new Float32Array([0, 0, 0, 0.35, 0, 0]);
  tickGeo.setAttribute('position', new THREE.BufferAttribute(tickPos, 3));
  const tick = new THREE.Line(
    tickGeo,
    new THREE.LineBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.35 })
  );
  group.add(tick);

  return {
    group, rail, node, nodeWire, halo,
    id: def.id, radius: def.radius, tilt: def.tilt,
    phase: def.phase, speed: def.speed,
    focus: 0, targetFocus: 0,
  };
}

interface SignalTrace {
  line: THREE.Line;
  module: ModuleObjects;
}

function buildSignalTrace(module: ModuleObjects): SignalTrace {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 30; i++) points.push(new THREE.Vector3());
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: EMERALD, transparent: true, opacity: 0.18 });
  const line = new THREE.Line(geo, mat);
  return { line, module };
}

interface HazeParts {
  group: THREE.Group;
  particles: THREE.Points;
}

function buildHaze(): HazeParts {
  const group = new THREE.Group();

  const gridGeo = new THREE.PlaneGeometry(24, 24, 24, 24);
  const gridMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true, transparent: true, opacity: 0.04 });
  const grid = new THREE.Mesh(gridGeo, gridMat);
  grid.position.set(0, -2.2, -4);
  grid.rotation.x = -Math.PI / 2.3;
  group.add(grid);

  const count = 180;
  const pos = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 14;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    speeds[i] = 0.0005 + Math.random() * 0.002;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0xb8b3a8, size: 0.018, transparent: true, opacity: 0.4, sizeAttenuation: true })
  );
  (particles as unknown as THREE.Points & { userData: { speeds: Float32Array } }).userData.speeds = speeds;
  group.add(particles);

  return { group, particles };
}

export function mountScene(canvas: HTMLCanvasElement): SceneHandle {
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0.4, 5.6);

  const root = new THREE.Group();
  scene.add(root);

  const core = buildOperatorCore();
  root.add(core.group);

  const moduleDefs: ModuleDef[] = [
    { id: 'sentinel', radius: 2.0, tilt: 0.05,  phase: 0.0, speed: 0.09 },
    { id: 'training', radius: 2.6, tilt: 0.55,  phase: 2.1, speed: 0.065 },
    { id: 'chat',     radius: 3.2, tilt: -0.40, phase: 4.2, speed: 0.05 },
  ];

  const modules = moduleDefs.map((def) => {
    const m = buildModule(def);
    root.add(m.group);
    root.add(m.rail);
    return m;
  });

  const traces = modules.map((m) => {
    const t = buildSignalTrace(m);
    root.add(t.line);
    return t;
  });

  const haze = buildHaze();
  root.add(haze.group);

  fit(renderer, camera, canvas);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollY = 0, targetScroll = 0;
  let raf: number;
  const start = performance.now();

  const onResize = () => fit(renderer, camera, canvas);
  window.addEventListener('resize', onResize);

  const onMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMove);

  const onScroll = () => { targetScroll = window.scrollY; };
  window.addEventListener('scroll', onScroll, { passive: true });

  function tick(): void {
    const t = (performance.now() - start) / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    scrollY += (targetScroll - scrollY) * 0.08;

    core.group.rotation.y = t * 0.04 + mouse.x * 0.12;
    core.group.rotation.x = mouse.y * 0.06 + Math.sin(t * 0.10) * 0.04;
    core.innerWire.rotation.y = -t * 0.09;
    core.innerWire.rotation.x = t * 0.05;
    const pulse = 1 + Math.sin(t * 1.8) * 0.08;
    core.nucleus.scale.setScalar(pulse);
    (core.nucleus.material as THREE.MeshBasicMaterial).opacity = 0.7 + Math.sin(t * 1.8) * 0.25;

    modules.forEach((m, i) => {
      const phase = m.phase + t * m.speed;
      m.group.position.set(
        Math.cos(phase) * m.radius,
        Math.sin(phase) * m.radius * Math.sin(m.tilt),
        Math.sin(phase) * m.radius * Math.cos(m.tilt)
      );
      m.group.rotation.y = t * 0.4 + i;
      m.group.rotation.x = t * 0.25;

      m.focus += (m.targetFocus - m.focus) * 0.08;
      const f = m.focus;
      (m.node.material as THREE.MeshBasicMaterial).opacity = 0.6 + f * 0.4;
      (m.nodeWire.material as THREE.LineBasicMaterial).opacity = 0.55 + f * 0.45;
      (m.halo.material as THREE.MeshBasicMaterial).opacity = 0.10 + f * 0.35;
      m.halo.scale.setScalar(1 + f * 0.5 + Math.sin(t * 2 + i) * 0.05 * (1 + f));
      (m.rail.material as THREE.MeshBasicMaterial).opacity = 0.08 + f * 0.25;
    });

    traces.forEach((trace, i) => {
      const m = trace.module;
      const posAttr = trace.line.geometry.attributes['position'] as THREE.BufferAttribute;
      const pts = posAttr.array as Float32Array;
      for (let k = 0; k <= 30; k++) {
        const u = k / 30;
        const ctrlY = Math.sin(u * Math.PI) * 0.4;
        pts[k * 3]     = m.group.position.x * u;
        pts[k * 3 + 1] = m.group.position.y * u + ctrlY;
        pts[k * 3 + 2] = m.group.position.z * u;
      }
      posAttr.needsUpdate = true;
      const phase = (t * 0.35 + i * 0.6) % 1;
      const baseOp = 0.08 + m.focus * 0.32;
      const pulseOp = Math.exp(-Math.pow((phase - 0.5) * 4, 2)) * 0.25;
      (trace.line.material as THREE.LineBasicMaterial).opacity = baseOp + pulseOp;
    });

    const dp = (haze.particles.geometry.attributes['position'] as THREE.BufferAttribute).array as Float32Array;
    const sp = (haze.particles as unknown as THREE.Points & { userData: { speeds: Float32Array } }).userData.speeds;
    for (let i = 0; i < sp.length; i++) {
      dp[i * 3 + 1] -= sp[i];
      if (dp[i * 3 + 1] < -4) dp[i * 3 + 1] = 4;
    }
    (haze.particles.geometry.attributes['position'] as THREE.BufferAttribute).needsUpdate = true;
    haze.particles.rotation.y = t * 0.01;

    camera.position.x = mouse.x * 0.15;
    camera.position.y = 0.4 + mouse.y * -0.08;
    camera.position.z = 5.6;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();

  const v = new THREE.Vector3();

  return {
    focusModule(id: ModuleId) {
      modules.forEach((m) => {
        m.targetFocus = m.id === id ? 1 : 0;
      });
    },
    clearFocus() {
      modules.forEach((m) => { m.targetFocus = 0; });
    },
    getModuleScreenPositions() {
      const out = {} as Record<ModuleId, { x: number; y: number; inFront: boolean; focus: number }>;
      const rect = canvas.getBoundingClientRect();
      modules.forEach((m) => {
        v.copy(m.group.position).project(camera);
        out[m.id] = {
          x: (v.x * 0.5 + 0.5) * rect.width,
          y: (-v.y * 0.5 + 0.5) * rect.height,
          inFront: v.z < 1,
          focus: m.focus,
        };
      });
      return out;
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
    },
  };
}
