import * as THREE from 'three';
import type { ModuleId, SceneHandle } from './types';
import { isCaptureMode } from '@/lib/capture-mode';
import { createNebulaTidesMaterial, NEBULA_TIDES } from './nebula-tides';

// Procedural texture generator for glowing circular particles
function createCircleTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const tex = new THREE.CanvasTexture(c);
  return tex;
}

function makeRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  r.setClearColor(0x000000, 0);
  r.outputColorSpace = THREE.SRGBColorSpace;
  return r;
}

function fit(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  el: HTMLElement
): void {
  const w = el.clientWidth,
    h = el.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

interface MiniNebula {
  id: ModuleId;
  group: THREE.Group;
  particles: THREE.Points;
  radius: number;
  tilt: number;
  phase: number;
  speed: number;
  focus: number;
  targetFocus: number;
  particleSpeeds: Float32Array;
}

export function mountScene(canvas: HTMLCanvasElement): SceneHandle {
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0.2, 5.2);

  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  const glowTex = createCircleTexture();

  // ============================================================
  // 1. Nebula tides: retain the 9,000-particle double spiral
  // ============================================================
  const STARDUST_COUNT = 9000;
  const sdGeo = new THREE.BufferGeometry();
  const sdPos = new Float32Array(STARDUST_COUNT * 3);
  const sdOrbit = new Float32Array(STARDUST_COUNT * 4);
  // Stable seeds keep capture/reduced-motion poses identical across reloads.
  let seed = 619;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let i = 0; i < STARDUST_COUNT; i++) {
    // Distribute stardust in double spiral arms
    const isArmA = i % 2 === 0;
    const armAngle = isArmA ? 0 : Math.PI;
    const progress = i / STARDUST_COUNT;
    const radius = progress * 4.2 + random() * 0.5;
    const angle = armAngle + progress * Math.PI * 6.5 + (random() - 0.5) * 0.35;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (random() - 0.5) * 0.3 + Math.sin(radius * 2.5) * 0.2;

    sdPos[i * 3] = x;
    sdPos[i * 3 + 1] = y;
    sdPos[i * 3 + 2] = z;

    sdOrbit.set(
      [radius, angle, random() * Math.PI * 2, random() < 0.6 ? 0 : 1],
      i * 4
    );
  }

  sdGeo.setAttribute('position', new THREE.BufferAttribute(sdPos, 3));
  sdGeo.setAttribute('orbit', new THREE.BufferAttribute(sdOrbit, 4));
  const sdMaterial = createNebulaTidesMaterial();

  const stardust = new THREE.Points(sdGeo, sdMaterial);
  // Vertex deformation and warp can extend beyond the initial seed positions.
  stardust.frustumCulled = false;
  rootGroup.add(stardust);

  // ============================================================
  // 2. Swirling Project Mini-Nebulae (sentinel, training, chat)
  // ============================================================
  const moduleDefs = [
    {
      id: 'sentinel' as ModuleId,
      radius: 1.8,
      tilt: 0.05,
      phase: 0.0,
      speed: 0.07
    },
    {
      id: 'training' as ModuleId,
      radius: 2.4,
      tilt: 0.45,
      phase: 2.1,
      speed: 0.05
    },
    {
      id: 'chat' as ModuleId,
      radius: 3.0,
      tilt: -0.35,
      phase: 4.2,
      speed: 0.04
    }
  ];

  const NEBULA_PARTICLES = 220;

  const nebulae: MiniNebula[] = moduleDefs.map((def) => {
    const group = new THREE.Group();
    rootGroup.add(group);

    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(NEBULA_PARTICLES * 3);
    const colors = new Float32Array(NEBULA_PARTICLES * 3);
    const pSpeeds = new Float32Array(NEBULA_PARTICLES);

    for (let i = 0; i < NEBULA_PARTICLES; i++) {
      // Swirl around local origin
      const dist = 0.05 + random() * 0.16;
      const angle = random() * Math.PI * 2;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = (random() - 0.5) * 0.08;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      pSpeeds[i] = 1.0 + random() * 1.5;

      // Color starts at pure white glowing core fading to accent tint
      const factor = random();
      colors[i * 3] = 0.6 + factor * 0.4;
      colors[i * 3 + 1] = 0.8 + factor * 0.2;
      colors[i * 3 + 2] = 0.7 + factor * 0.3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.038,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geo, material);
    group.add(points);

    // Glowing core mesh in center of nebula
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const coreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      coreMat
    );
    group.add(coreMesh);

    return {
      id: def.id,
      group,
      particles: points,
      radius: def.radius,
      tilt: def.tilt,
      phase: def.phase,
      speed: def.speed,
      focus: 0.0,
      targetFocus: 0.0,
      particleSpeeds: pSpeeds
    };
  });

  // ============================================================
  // 3. Glowing Tracers / Signal Wave Lines
  // ============================================================
  const TRACER_POINTS = 32;
  const tracers = nebulae.map((n) => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(TRACER_POINTS * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });

    const line = new THREE.Line(geo, mat);
    rootGroup.add(line);
    return { line, nebula: n };
  });

  let warpFactor = 1.0;
  let targetWarpFactor = 1.0;

  const onWarp = () => {
    targetWarpFactor = 15.0;
  };
  window.addEventListener('dp-portfolio-warp', onWarp);

  fit(renderer, camera, canvas);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let raf: number;
  let lastFrame = performance.now();
  let elapsed = 0;

  const onResize = () => fit(renderer, camera, canvas);
  window.addEventListener('resize', onResize);

  const onMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMove);

  // Capture mode (?capture=1 or reduced motion): render exactly one frame
  // at the fixed t=0 pose instead of a continuous rAF loop, so every
  // screenshot shows the identical constellation.
  const capture = isCaptureMode();

  function tick(): void {
    const now = performance.now();
    const delta = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    if (!capture) elapsed += delta * NEBULA_TIDES.speed;
    const t = elapsed;
    const smoothing = capture ? 0 : 1 - Math.exp(-delta * 3);
    mouse.x += (mouse.tx - mouse.x) * smoothing;
    mouse.y += (mouse.ty - mouse.y) * smoothing;

    // Smooth warp speed decay
    warpFactor += (targetWarpFactor - warpFactor) * 0.05;
    if (targetWarpFactor > 1.0) {
      targetWarpFactor -= 0.18;
      if (targetWarpFactor < 1.0) targetWarpFactor = 1.0;
    }

    // 1. Fetch dynamic profile color
    let hexColor = '#00ff88'; // Default Matrix Green
    if (typeof document !== 'undefined') {
      const profile =
        document.documentElement.getAttribute('data-theme-profile');
      if (profile === 'cyan') hexColor = '#00f0ff';
      else if (profile === 'amber') hexColor = '#ffb700';
      else if (profile === 'pink') hexColor = '#ff007f';
    }
    const activeColor = new THREE.Color(hexColor);

    // GPU tide deformation: only uniforms change, never 9,000 CPU positions/colors.
    sdMaterial.uniforms.uTime.value = t;
    sdMaterial.uniforms.uMouse.value.set(mouse.x, -mouse.y);
    sdMaterial.uniforms.uAccent.value.copy(activeColor);
    sdMaterial.uniforms.uWarp.value = warpFactor;
    sdMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    sdMaterial.uniforms.uHeight.value = canvas.clientHeight;

    rootGroup.rotation.y = t * 0.015 + mouse.x * 0.025;
    rootGroup.rotation.x = -0.17 + mouse.y * 0.04;

    // 3. Animate Project Mini-Nebulae
    nebulae.forEach((n) => {
      n.focus += (n.targetFocus - n.focus) * 0.08;
      const f = n.focus;

      // Update parent nebula group orbits (slow orbit speed based on focus)
      const curPhase = n.phase + t * (n.speed * (1.0 + f * 0.8));
      const nX = Math.cos(curPhase) * n.radius;
      const nZ = Math.sin(curPhase) * n.radius * Math.cos(n.tilt);
      const nY = Math.sin(curPhase) * n.radius * Math.sin(n.tilt);
      n.group.position.set(nX, nY, nZ);

      // Local nebula points swirling
      const localPosAttr = n.particles.geometry.attributes[
        'position'
      ] as THREE.BufferAttribute;
      const localPos = localPosAttr.array as Float32Array;
      const pSpeeds = n.particleSpeeds;

      for (let i = 0; i < NEBULA_PARTICLES; i++) {
        const localAngle = t * 0.16 * pSpeeds[i] * (1.0 + f * 1.5) + i * 0.04;
        const localDist = 0.04 + (i / NEBULA_PARTICLES) * (0.16 + f * 0.14);

        localPos[i * 3] = Math.cos(localAngle) * localDist;
        localPos[i * 3 + 2] = Math.sin(localAngle) * localDist;
        localPos[i * 3 + 1] = Math.sin(t * 0.8 + i) * 0.02 * (1.0 + f);
      }
      localPosAttr.needsUpdate = true;

      // Color/Opacity transitions
      (n.particles.material as THREE.PointsMaterial).color.copy(activeColor);
      (n.particles.material as THREE.PointsMaterial).opacity = 0.6 + f * 0.4;
      n.particles.scale.setScalar(1.0 + f * 0.4);
    });

    // 4. Update Tracer Wave Paths
    tracers.forEach((tr) => {
      const n = tr.nebula;
      const trPosAttr = tr.line.geometry.attributes[
        'position'
      ] as THREE.BufferAttribute;
      const trPos = trPosAttr.array as Float32Array;

      // Connect parent center (0,0,0) to nebula orbit (nX, nY, nZ) with a sine curve
      const nPos = n.group.position;
      for (let k = 0; k < TRACER_POINTS; k++) {
        const u = k / (TRACER_POINTS - 1);
        const wave =
          Math.sin(u * Math.PI * 2.0 - t * 4.0) *
          0.08 *
          (1.0 - u) *
          (1.0 + n.focus * 1.2);

        trPos[k * 3] = nPos.x * u;
        trPos[k * 3 + 1] = nPos.y * u + wave;
        trPos[k * 3 + 2] = nPos.z * u;
      }
      trPosAttr.needsUpdate = true;

      (tr.line.material as THREE.LineBasicMaterial).color.copy(activeColor);
      (tr.line.material as THREE.LineBasicMaterial).opacity =
        0.12 + n.focus * 0.35;
    });

    // 5. Parallax Viewport camera drift + 3D smooth focus zooming
    let targetCamX = mouse.x * 0.25;
    let targetCamY = 0.2 + mouse.y * -0.15;
    let targetCamZ = 5.2;
    let targetLookX = 0;
    let targetLookY = 0;
    let targetLookZ = 0;

    nebulae.forEach((n) => {
      if (n.focus > 0.01) {
        const f = n.focus;
        const nPos = n.group.position;
        // Glide target lookAt closer to focused nebula
        targetLookX += nPos.x * 0.75 * f;
        targetLookY += nPos.y * 0.75 * f;
        targetLookZ += nPos.z * 0.75 * f;

        // Shift camera coordinate system closer to nebula
        targetCamX += nPos.x * 0.3 * f;
        targetCamY += nPos.y * 0.3 * f;
        targetCamZ -= 1.95 * f; // Smooth zoom-in!
      }
    });

    // Smoothly interpolate camera position
    camera.position.x += (targetCamX - camera.position.x) * 0.07;
    camera.position.y += (targetCamY - camera.position.y) * 0.07;
    camera.position.z += (targetCamZ - camera.position.z) * 0.07;

    // Interpolate camera focus lookAt coordinates
    const activeLook = new THREE.Vector3(
      camera.userData.lookX !== undefined ? camera.userData.lookX : 0,
      camera.userData.lookY !== undefined ? camera.userData.lookY : 0,
      camera.userData.lookZ !== undefined ? camera.userData.lookZ : 0
    );
    activeLook.x += (targetLookX - activeLook.x) * 0.07;
    activeLook.y += (targetLookY - activeLook.y) * 0.07;
    activeLook.z += (targetLookZ - activeLook.z) * 0.07;

    camera.userData.lookX = activeLook.x;
    camera.userData.lookY = activeLook.y;
    camera.userData.lookZ = activeLook.z;

    camera.lookAt(activeLook);

    renderer.render(scene, camera);
    if (!capture) {
      raf = requestAnimationFrame(tick);
    }
  }
  tick();

  return {
    focusModule(id: ModuleId) {
      nebulae.forEach((n) => {
        n.targetFocus = n.id === id ? 1.0 : 0.0;
      });
    },
    clearFocus() {
      nebulae.forEach((n) => {
        n.targetFocus = 0.0;
      });
    },
    getModuleScreenPositions() {
      const out = {} as Record<
        ModuleId,
        { x: number; y: number; inFront: boolean; focus: number }
      >;
      const v = new THREE.Vector3();
      const rect = canvas.getBoundingClientRect();

      nebulae.forEach((n) => {
        v.copy(n.group.position).project(camera);
        out[n.id] = {
          x: (v.x * 0.5 + 0.5) * rect.width,
          y: (-v.y * 0.5 + 0.5) * rect.height,
          inFront: v.z < 1.0,
          focus: n.focus
        };
      });
      return out;
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('dp-portfolio-warp', onWarp);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material;
        if (mat) {
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else (mat as THREE.Material).dispose();
        }
      });
      glowTex.dispose();
      renderer.dispose();
    }
  };
}
