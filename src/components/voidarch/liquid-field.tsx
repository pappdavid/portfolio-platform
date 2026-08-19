'use client';

import { useEffect, useRef } from 'react';

interface LiquidFieldProps {
  focus?: readonly [number, number];
  routeEnergy?: number;
  routePhase?: number;
  enabled?: boolean;
}

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uFocus;
uniform float uFocusStrength;
uniform float uRouteEnergy;
uniform float uRoutePhase;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.52;
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(4.1, 2.3);
    amplitude *= 0.51;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv - 0.5;
  p.x *= uResolution.x / uResolution.y;
  vec2 fp = uFocus - 0.5;
  fp.x *= uResolution.x / uResolution.y;

  float t = uTime * 0.09;
  float a = fbm(p * 1.8 + vec2(t * 0.22, -t * 0.13));
  float b = fbm((p + vec2(a, -a)) * 2.55 + vec2(-t * 0.17, t * 0.24));
  vec2 q = p + (vec2(a, b) - 0.5) * (0.20 + 0.10 * uRouteEnergy);
  float f = fbm(q * 2.6 + vec2(t * 0.08, -t * 0.05));
  float g = fbm((q + vec2(f, -f)) * 4.0 - vec2(t * 0.06, t * 0.04));

  float liquid = smoothstep(0.28, 0.82, f * 0.70 + g * 0.48);
  float caustic = pow(max(0.0, 1.0 - abs(f - g) * 2.45), 7.0);
  float filament = smoothstep(0.76, 0.98, fbm(q * 7.0 + vec2(t * 0.18, -t * 0.15)));
  float focal = exp(-7.2 * length(q - fp)) * uFocusStrength;
  float focusRing = exp(-72.0 * abs(length(q - fp) - (0.20 + 0.03 * sin(uTime * 0.42)))) * uFocusStrength;
  float sweep = exp(-38.0 * abs((uv.x * 0.82 + uv.y * 0.22) - fract(uRoutePhase * 0.92 + 0.03))) * uRouteEnergy;
  float sparkle = smoothstep(0.986, 0.999, noise(uv * vec2(170.0, 128.0) + uTime * 0.05));

  vec3 base = vec3(0.020, 0.012, 0.050);
  vec3 violet = vec3(0.46, 0.20, 0.98);
  vec3 magenta = vec3(0.92, 0.26, 0.98);
  vec3 cyan = vec3(0.18, 0.82, 1.0);
  vec3 pearl = vec3(0.88, 0.82, 1.0);

  vec3 color = base;
  color += violet * liquid * 0.18;
  color += magenta * caustic * 0.13;
  color += cyan * filament * 0.045;
  color += pearl * sparkle * 0.055;
  color += magenta * focal * 0.20;
  color += cyan * focusRing * 0.08;
  color += cyan * sweep * 0.10;

  float vignette = smoothstep(1.10, 0.18, length(p));
  color *= 0.72 + 0.28 * vignette;
  outColor = vec4(color, 1.0);
}`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function LiquidField({
  focus = [0.72, 0.42],
  routeEnergy = 0,
  routePhase = 0,
  enabled = true
}: LiquidFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance'
    });

    if (!gl) {
      canvas.dataset.webgl = 'fallback';
      return;
    }

    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) {
      canvas.dataset.webgl = 'fallback';
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.dataset.webgl = 'fallback';
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const start = performance.now();
    let animationFrame = 0;
    let disposed = false;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = (now: number) => {
      if (disposed) return;
      resize();
      gl.useProgram(program);
      gl.uniform2f(uniform('uResolution'), canvas.width, canvas.height);
      gl.uniform1f(uniform('uTime'), reducedMotion ? 0 : (now - start) / 1000);
      gl.uniform2f(uniform('uFocus'), focus[0], focus[1]);
      gl.uniform1f(uniform('uFocusStrength'), 0.8);
      gl.uniform1f(uniform('uRouteEnergy'), reducedMotion ? 0 : routeEnergy);
      gl.uniform1f(uniform('uRoutePhase'), routePhase);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reducedMotion) animationFrame = requestAnimationFrame(render);
    };

    canvas.dataset.webgl = reducedMotion ? 'reduced-motion' : 'active';
    render(performance.now());

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      canvas.dataset.webgl = 'fallback';
      cancelAnimationFrame(animationFrame);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, [enabled, focus, routeEnergy, routePhase]);

  return (
    <canvas
      ref={canvasRef}
      data-testid='voidarch-liquid-field'
      aria-hidden='true'
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
