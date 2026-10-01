import * as THREE from 'three';

/** Settings selected in the Nebula tides motion preview. */
export const NEBULA_TIDES = {
  visibility: 2.15,
  deformation: 1.6,
  speed: 1.2
} as const;

/** Animate the existing spiral seeds on the GPU without rewriting their buffers. */
export function createNebulaTidesMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uAccent: { value: new THREE.Color('#00ff88') },
      uWarp: { value: 1 },
      uPixelRatio: { value: 1 },
      uHeight: { value: 900 },
      uVisibility: { value: NEBULA_TIDES.visibility },
      uDeformation: { value: NEBULA_TIDES.deformation }
    },
    vertexShader: `
      attribute vec4 orbit;
      uniform float uTime, uWarp, uHeight, uPixelRatio, uDeformation;
      uniform vec2 uMouse;
      varying float vBrightness, vNeutral;

      void main() {
        float radius = orbit.x;
        float angle = orbit.y + uTime * (0.04 + 0.06 / (radius + 0.5));
        vec2 p = vec2(cos(angle), sin(angle)) * radius;
        float y = 0.10 * sin(radius * 2.0 - uTime * 0.45 + orbit.z)
                + 0.10 * cos(angle * 3.0 + uTime * 0.3);
        float tide = sin(angle * 2.0 - radius * 1.1 + uTime * 0.5);
        p *= 1.0 + uDeformation * 0.055 * tide;
        y += uDeformation * 0.33 * tide
           + uDeformation * 0.11 * sin(p.x * 2.3 + uTime * 0.4)
             * cos(p.y * 1.8 - uTime * 0.3);

        vec2 delta = p - uMouse * vec2(3.0, 2.8);
        float wake = exp(-dot(delta, delta));
        p += vec2(-delta.y, delta.x) * wake * uDeformation * 0.38;
        y += wake * uDeformation * 0.18;
        p *= 1.0 + (uWarp - 1.0) * 0.04;

        vec4 mvPosition = modelViewMatrix * vec4(p.x, y, p.y, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = clamp(
          0.024 * uHeight * uPixelRatio / max(1.0, -mvPosition.z),
          uPixelRatio, 4.2 * uPixelRatio
        ) * (1.0 + (uWarp - 1.0) * 0.08);
        vBrightness = 0.40 + 0.24 * (0.5 + 0.5 * sin(orbit.z));
        vNeutral = orbit.w;
      }
    `,
    fragmentShader: `
      uniform vec3 uAccent;
      uniform float uVisibility;
      varying float vBrightness, vNeutral;

      void main() {
        float distanceFromCenter = length(gl_PointCoord - 0.5) * 2.0;
        if (distanceFromCenter > 1.0) discard;
        float glow = pow(1.0 - distanceFromCenter, 1.5);
        vec3 color = mix(uAccent, vec3(0.38, 0.46, 0.40), vNeutral);
        gl_FragColor = vec4(color, glow * vBrightness * uVisibility);
        #include <colorspace_fragment>
      }
    `
  });
}
