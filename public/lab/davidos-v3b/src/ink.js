import { diagramLines } from "./projects.js";

const quad = `#version 300 es
out vec2 uv;
void main(){
  vec2 p=vec2((gl_VertexID<<1)&2, gl_VertexID&2);
  uv=p; gl_Position=vec4(p*2.-1.,0.,1.);
}`;

const passes = {
  curl: `float w=.5*(V(1,0).y-V(-1,0).y-V(0,1).x+V(0,-1).x); outColor=vec4(w,0,0,1);`,
  flow: `float w=texture(B,uv).x;
    vec2 n=.5*vec2(abs(S(B,1,0))-abs(S(B,-1,0)),abs(S(B,0,1))-abs(S(B,0,-1)));
    vec2 confinement=vec2(n.y,-n.x)*w/(length(n)+.0001);
    vec2 v=texture(A,uv-dt*grid*V(0,0)).xy*exp(-dt*.9)+confinement*dt*7.;
    vec4 ink=texture(C,uv);
    v+=dt*ink.b*(ink.rg*2.-1.)*155.;
    vec2 delta=(uv-pointer.xy)/grid;
    v+=pointer.zw*exp(-dot(delta,delta)/43.)*dt*17.;
    outColor=vec4(clamp(v,vec2(-125.),vec2(125.)),0,1);`,
  divergence: `vec2 l=V(-1,0), r=V(1,0), b=V(0,-1), t=V(0,1), c=V(0,0);
    if(uv.x<grid.x)l.x=-c.x;if(uv.x>1.-grid.x)r.x=-c.x;
    if(uv.y<grid.y)b.y=-c.y;if(uv.y>1.-grid.y)t.y=-c.y;
    outColor=vec4(.5*(r.x-l.x+t.y-b.y),0,0,1);`,
  pressure: `float p=(S(A,-1,0)+S(A,1,0)+S(A,0,1)+S(A,0,-1)-texture(B,uv).r)*.25;
    outColor=vec4(p,0,0,1);`,
  project: `vec2 v=V(0,0)-.5*vec2(S(B,1,0)-S(B,-1,0),S(B,0,1)-S(B,0,-1));
    outColor=vec4(v,0,1);`,
  dye: `vec2 v=texture(B,uv).xy;
    float old=texture(A,uv-dt*grid*v).r*exp(-dt*2.4);
    float fresh=texture(C,uv).b;
    outColor=vec4(min(1.,old+(1.-old)*fresh*(1.-exp(-dt*32.))),0,0,1);`,
  display: `float d=texture(A,uv).r, fresh=texture(C,uv).b;
    float lines=max(fresh*.85, d*.93);
    vec3 color=mix(accent,mix(accent,vec3(.88,1.,.91),.75),smoothstep(.64,.96,lines));
    outColor=vec4(color,clamp(lines,0.,1.));`,
};
const shared = `#version 300 es
precision highp float; in vec2 uv; out vec4 outColor;
uniform sampler2D A,B,C; uniform vec2 grid; uniform float dt; uniform vec4 pointer; uniform vec3 accent;
vec2 V(int x,int y){return texture(A,uv+vec2(x,y)*grid).xy;}
float S(sampler2D f,int x,int y){return texture(f,uv+vec2(x,y)*grid).r;}
`;

// Instanced filaments deposit directional impulses and dye into the same
// texture. They are the source for the solver, including its static plate.
const inkFragment = `#version 300 es
precision highp float;in vec2 direction;in float strength;out vec4 deposit;
void main(){deposit=vec4(direction*.5+.5,clamp(strength,0.,1.),1.);}`;
const idleVertex = `#version 300 es
precision highp float;uniform float time;uniform vec2 fieldSize;
out vec2 direction;out float strength;const float TAU=6.2831853;
vec3 surface(float u,float lane){
  float v=TAU*lane + 1.65*sin(2.*u-time*.26)+.55*sin(3.*u+time*.19);
  float width=.24+.11*sin(2.*u-time*.22);
  float radius=.98+width*cos(v)+.10*cos(3.*u+time*.15);
  float x=radius*cos(u);
  float y=radius*sin(u);
  float z=.47*sin(v)+.48*sin(2.*u+time*.25)+.105*cos(3.*v+2.*u);
  return vec3(.50+.358*x+.038*y,.50+.185*y+.266*z+.102*x,z+.52*y);
}
void main(){
  float u=TAU*float(gl_VertexID)/300., lane=float(gl_InstanceID)/78.;
  vec3 p=surface(u,lane), next=surface(u+.003,lane);
  direction=normalize((next.xy-p.xy)*fieldSize);
  float light=.5+.5*sin(2.*u+6.283*lane+time*.14);
  strength=(.28+.49*smoothstep(-.62,.86,p.z)+.22*light)*(.69+.31*cos(lane*131.));
  strength*=.77+.23*sin(u*5.+lane*16.+time*.55);
  gl_Position=vec4(p.xy*2.-1.,0.,1.);
}`;
const pathVertex = `#version 300 es
precision highp float;layout(location=0) in vec2 pos;layout(location=1) in vec2 tangent;
layout(location=2) in vec2 timing;uniform float time;uniform vec2 fieldSize;
out vec2 direction;out float strength;
void main(){float phase=fract(time/7.2);float age=fract(phase-timing.x+1.);
  float pulse=exp(-age*24.);
  strength=timing.y*(.27+.73*pulse);
  direction=normalize(tangent*fieldSize);
  gl_Position=vec4(pos*2.-1.,0.,1.);
}`;

export function startInk(canvas, options) {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    depth: false,
    stencil: false,
  });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;

  function program(vertex, fragment) {
    const p = gl.createProgram();
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ]) {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw Error(gl.getShaderInfoLog(s));
      gl.attachShader(p, s);
      gl.deleteShader(s);
    }
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
      throw Error(gl.getProgramInfoLog(p));
    const names = [
      "A",
      "B",
      "C",
      "grid",
      "pointer",
      "dt",
      "accent",
      "time",
      "fieldSize",
    ];
    const result = {
      p,
      u: Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(p, n)])),
    };
    return result;
  }
  const shaders = Object.fromEntries(
    Object.entries(passes).map(([key, body]) => [
      key,
      program(quad, shared + "void main(){" + body + "}"),
    ]),
  );
  const idle = program(idleVertex, inkFragment),
    path = program(pathVertex, inkFragment);
  const vao = gl.createVertexArray(),
    buffer = gl.createBuffer();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  for (let i = 0; i < 3; i++) {
    gl.enableVertexAttribArray(i);
    gl.vertexAttribPointer(i, 2, gl.FLOAT, false, 24, i * 8);
  }
  gl.bindVertexArray(null);
  let project = "",
    pathVertices = 0,
    color = [0, 1, 0.53],
    time = 0,
    quality = 1,
    request = 0,
    last = 0,
    intervals = [],
    slowWindows = 0;
  let tex = [],
    velocity,
    pressure,
    curl,
    div,
    dye,
    emit,
    grid,
    rect;
  let pointer = [-2, -2, 0, 0],
    selectedAt = 0,
    stopped = false;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const capture = options.capture;
  function target(w, h, byte = false, channels = 1) {
    const texture = gl.createTexture(),
      fb = gl.createFramebuffer();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const internal = byte ? gl.RGBA8 : channels === 2 ? gl.RG16F : gl.R16F;
    gl.texStorage2D(gl.TEXTURE_2D, 1, internal, w, h);
    for (const [parameter, value] of [
      [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
      [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
      [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
    ])
      gl.texParameteri(gl.TEXTURE_2D, parameter, value);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
      throw Error("Ink framebuffer unavailable");
    const t = { w, h, texture, fb };
    tex.push(t);
    return t;
  }
  function allocate(keep = false) {
    const previous = tex,
      oldDye = dye?.[0],
      oldVelocity = velocity?.[0];
    tex = [];
    rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio, 1.5) * quality;
    const w = Math.max(2, Math.round(rect.width * dpr)),
      h = Math.max(2, Math.round(rect.height * dpr));
    canvas.width = w;
    canvas.height = h;
    const nx = Math.max(40, Math.min(165, Math.round(w * 0.24))),
      ny = Math.max(24, Math.round((nx * h) / w));
    grid = [1 / nx, 1 / ny];
    velocity = [target(nx, ny, false, 2), target(nx, ny, false, 2)];
    pressure = [target(nx, ny), target(nx, ny)];
    curl = target(nx, ny);
    div = target(nx, ny);
    emit = target(w, h, true);
    dye = [target(w, h), target(w, h)];
    if (keep && oldDye) {
      for (const [before, after] of [
        [oldDye, dye[0]],
        [oldVelocity, velocity[0]],
      ]) {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, before.fb);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, after.fb);
        gl.blitFramebuffer(
          0,
          0,
          before.w,
          before.h,
          0,
          0,
          after.w,
          after.h,
          gl.COLOR_BUFFER_BIT,
          gl.LINEAR,
        );
      }
    }
    for (const t of previous) {
      gl.deleteTexture(t.texture);
      gl.deleteFramebuffer(t.fb);
    }
  }
  function destination(t) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, t?.fb ?? null);
    gl.viewport(0, 0, t?.w ?? canvas.width, t?.h ?? canvas.height);
  }
  function source(t) {
    destination(emit);
    gl.clearColor(0.5, 0.5, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const s = project ? path : idle;
    gl.useProgram(s.p);
    gl.uniform1f(s.u.time, t);
    gl.uniform2f(s.u.fieldSize, canvas.width, canvas.height);
    if (project) {
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.LINES, 0, pathVertices);
      gl.bindVertexArray(null);
    } else gl.drawArraysInstanced(gl.LINE_STRIP, 0, 301, 78);
  }
  function pass(key, out, inputs, dt) {
    const { p, u } = shaders[key];
    destination(out);
    gl.useProgram(p);
    inputs.forEach((t, i) => {
      if (!t) return;
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, t.texture);
      gl.uniform1i(u[["A", "B", "C"][i]], i);
    });
    gl.uniform2fv(u.grid, grid);
    gl.uniform1f(u.dt, dt);
    gl.uniform4fv(u.pointer, pointer);
    gl.uniform3fv(u.accent, color);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function simulate(t, dt) {
    source(t);
    pass("curl", curl, [velocity[0]], dt);
    pass("flow", velocity[1], [velocity[0], curl, emit], dt);
    pass("divergence", div, [velocity[1]], dt);
    for (let i = 0; i < 8; i++) {
      pass("pressure", pressure[1], [pressure[0], div], dt);
      pressure.reverse();
    }
    pass("project", velocity[0], [velocity[1], pressure[0]], dt);
    pass("dye", dye[1], [dye[0], velocity[0], emit], dt);
    dye.reverse();
    pointer[2] *= Math.exp(-dt * 8);
    pointer[3] *= Math.exp(-dt * 8);
  }
  const display = () => pass("display", null, [dye[0], null, emit], 0);
  function frame(now) {
    request = 0;
    if (document.hidden || stopped) return;
    if (last) intervals.push(now - last);
    const elapsed = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    time += Math.min(0.05, elapsed);
    simulate(time - selectedAt, Math.min(0.04, elapsed));
    display();
    if (intervals.length >= 28) {
      const mean = intervals.reduce((a, b) => a + b) / intervals.length;
      options.onFrame(mean);
      intervals = [];
      slowWindows = mean > 24 ? slowWindows + 1 : 0;
      if (slowWindows >= 2 && quality > 0.59) {
        quality = Math.max(0.58, quality - 0.18);
        allocate(true);
        slowWindows = 0;
      }
    }
    request = requestAnimationFrame(frame);
  }
  function redraw(reset = true) {
    cancelAnimationFrame(request);
    request = 0;
    last = 0;
    intervals = [];
    if (stopped || document.hidden) return;
    if (reset || !emit) allocate(capture === null && !motion.matches);
    if (motion.matches) {
      source(3.4);
      display();
      options.onFrame(null);
    } else if (capture !== null) {
      // Reconstruct a fixed recent history. Work stays bounded even for a
      // capture far into the replay. Never integrate elapsed wall-clock time.
      for (let i = 15; i >= 0; i--) simulate(capture - i / 30, 1 / 30);
      display();
      options.onFrame(null);
    } else request = requestAnimationFrame(frame);
    canvas.dataset.ready = "true";
  }
  function select(name) {
    project = name;
    selectedAt = time;
    const vertices = [];
    for (const { points, start, end, weight } of diagramLines(name)) {
      const lengths = points
        .slice(1)
        .map(([x, y], i) => Math.hypot(x - points[i][0], y - points[i][1]));
      const total = lengths.reduce((a, b) => a + b, 0);
      let along = 0;
      for (let i = 0; i < lengths.length; i++) {
        const [x, y] = points[i],
          [bx, by] = points[i + 1],
          dx = bx - x,
          dy = y - by;
        // Interpolate the replay phase along each entire emitter.
        const segments = Math.max(1, Math.ceil(lengths[i] * 90));
        for (let j = 0; j < segments; j++) {
          for (const f of [j / segments, (j + 1) / segments]) {
            vertices.push(
              x + dx * f,
              1 - y + dy * f,
              dx,
              dy,
              start + ((end - start) * (along + lengths[i] * f)) / total,
              weight,
            );
          }
        }
        along += lengths[i];
      }
    }
    pathVertices = vertices.length / 6;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    if (capture !== null || motion.matches) redraw();
  }
  canvas.addEventListener("pointermove", (e) => {
    if (motion.matches || capture !== null) return;
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width,
      y = 1 - (e.clientY - r.top) / r.height;
    if (pointer[0] >= 0) {
      pointer[2] = Math.max(
        -150,
        Math.min(150, ((x - pointer[0]) / grid[0]) * 20),
      );
      pointer[3] = Math.max(
        -150,
        Math.min(150, ((y - pointer[1]) / grid[1]) * 20),
      );
    }
    pointer[0] = x;
    pointer[1] = y;
  });
  canvas.addEventListener("pointerleave", () => {
    pointer = [-2, -2, 0, 0];
  });
  new ResizeObserver(() => redraw()).observe(canvas.parentElement);
  motion.addEventListener("change", () => redraw());
  document.addEventListener("visibilitychange", () => redraw(false));
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    stopped = true;
    cancelAnimationFrame(request);
    options.onLost();
  });
  canvas.addEventListener("webglcontextrestored", () => location.reload());
  return {
    select,
    accent(hex) {
      color = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
      if (emit && !stopped) display();
    },
  };
}
