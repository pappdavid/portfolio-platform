import { scenes, pathAtlas } from "./scenes.js";

const count = 36864;
const update = `#version 300 es
precision highp float;
layout(location=0) in vec4 seed;
layout(location=1) in vec4 state;
uniform sampler2D atlas;
uniform float time, dt, aspect, hand;
uniform int scene, settle;
uniform vec2 pointer;
out vec4 nextState;
out vec2 pigment;
const float tau=6.2831853;

// The curled sheet is a moving family of streamlines. Each seed keeps its
// cross-stream coordinate as the material travels around the fold.
vec2 sheet(float t, out float tint, out float light){
  float u=tau*fract(seed.x+t*.018);
  float strip=(floor(seed.y*76.)+seed.z*.11)/76.*2.-1.;
  float twist=u*1.5+.52*sin(u*2.+t*.20)+.22*sin(t*.24);
  float radius=1.+.32*strip*cos(twist)+.075*sin(u*3.+t*.12);
  vec3 p=vec3(radius*cos(u),radius*sin(u),.56*strip*sin(twist)+.32*sin(2.*u+t*.18));
  float depth=.88*p.y+.46*p.z;
  vec2 v=vec2(p.x,.34*p.y-.87*p.z);
  v=mat2(.97,-.24,.24,.97)*v;
  tint=smoothstep(-.86,.50,cos(u+.50)+strip*.38);
  float weave=.72+.28*cos(strip*77.+u*.8);
  light=(.35+.47*smoothstep(-1.,1.,depth)+.18*seed.w)*weave;
  vec2 scale=vec2(min(.36,.85/aspect),min(.52,.285*aspect));
  return vec2(.5,.5)+v*scale;
}
// Curl of a multi-frequency smooth scalar noise potential. The analytic
// derivatives give a divergence-free velocity field without texture reads.
vec2 curl(vec2 p,float t){
  vec2 k=vec2(6.1,9.3), l=vec2(-14.2,5.8), m=vec2(19.7,17.3);
  vec2 d=k*cos(dot(p,k)+t*.32)+.43*l*cos(dot(p,l)-t*.21)+.17*m*cos(dot(p,m)+t*.44);
  return vec2(d.y,-d.x)*.0015;
}
void main(){
  vec2 dest;
  float tint,light;
  if(scene==0){
    dest=sheet(time,tint,light);
    dest+=curl(dest*1.2,time)*.62;
    dest+=(seed.zw-.5)*vec2(.002,.003);
  }else{
    float u=clamp(seed.x+.006*sin(time+seed.z*tau),0.,.9999);
    vec4 route=texelFetch(atlas,ivec2(int(u*255.),int(seed.y*128.)),0);
    float phase=fract(time/8.);
    float diff=abs(phase-route.w);
    float pulse=route.w<0.?0.:1.-smoothstep(.012,.10,min(diff,1.-diff));
    tint=route.z;
    light=.20+.24*seed.z+.54*pulse;
    dest=route.xy+(seed.zw-.5)*vec2(.004,.009)*(1.+pulse);
    // A separate group transports material between the structural attractors.
    // Its shape changes from a line into the excerpt, card or returned receipt.
    if(seed.z<.075){
      float lag=(seed.y-.5)*.055;
      float t=fract(phase-lag);
      vec2 spread=seed.xw-.5;
      tint=.92;
      light=.78*smoothstep(0.,.045,t)*(1.-smoothstep(.95,1.,t));
      if(scene==1){
        vec2 center=mix(vec2(.14,.518),vec2(.47,.39),smoothstep(.10,.28,t));
        center=mix(center,vec2(.46,.58),smoothstep(.32,.43,t));
        center.x+=.19*smoothstep(.47,.59,t)+.19*smoothstep(.65,.77,t)+.075*smoothstep(.81,.92,t);
        dest=center+spread*mix(vec2(.15,.015),vec2(.032,.065),smoothstep(.28,.43,t));
      }else if(scene==2){
        bool lower=seed.z>.0375;
        float v=fract(t+(lower?.49:0.));
        float sy=lower?.698:.406,ey=lower?.72:.38;
        float travel=smoothstep(.17,.57,v);
        vec2 center=vec2(mix(.14,.76,travel),mix(sy,ey,travel));
        float stream=sin(travel*3.14159);
        center.y-=stream*.043;
        vec2 card=vec2(spread.x*.17,(floor(seed.w*3.)-1.)*.026+.025);
        vec2 shape=mix(spread*vec2(.15,.016),card,smoothstep(.50,.64,v));
        dest=center+shape*vec2(1.+stream*.35,1.);
        light=.85*smoothstep(.01,.08,v)*(1.-smoothstep(.84,1.,v));
      }else{
        vec2 center;
        if(t<.24)center=vec2(mix(.15,.835,smoothstep(.01,.18,t)),.23);
        else if(t<.40){center=vec2(mix(.81,.558,smoothstep(.24,.37,t)),.42);light*=1.-smoothstep(.36,.40,t);}
        else if(t<.65)center=vec2(mix(.15,.879,smoothstep(.40,.58,t)),.61);
        else if(t<.82)center=vec2(mix(.15,.81,smoothstep(.65,.81,t)),.82);
        else center=vec2(mix(.81,.15,smoothstep(.82,.98,t)),.87);
        dest=center+spread*vec2(.043,.033);
      }
    }
  }
  vec2 pos=state.xy,vel=state.zw;
  vec2 delta=(pos-pointer)*vec2(aspect,1.);
  float influence=exp(-dot(delta,delta)*25.)*hand;
  float stiffness=scene==0?33.:49.;
  vec2 force=(dest-pos)*stiffness-vel*2.*sqrt(stiffness);
  force+=curl(pos,time)*(scene==0?4.:.7);
  force+=vec2(delta.x-delta.y,delta.y+delta.x)*influence*18./vec2(aspect,1.);
  vel+=force*dt;
  pos+=vel*dt;
  if(settle==1){pos=dest;vel=vec2(0.);}
  nextState=vec4(pos,vel);pigment=vec2(tint,light);
}`;

const draw = `#version 300 es
precision highp float;
layout(location=0) in vec4 seed;
layout(location=1) in vec4 state;
layout(location=2) in vec2 pigment;
uniform float dpr, opacity;
uniform int streak;
uniform vec3 accent;
out vec4 color;
void main(){
  vec2 pos=state.xy;
  if(streak==1 && gl_VertexID==0) pos-=state.zw*.026;
  gl_Position=vec4(pos*vec2(2.,-2.)+vec2(-1.,1.),0.,1.);
  gl_PointSize=dpr*(.85+.56*seed.w);
  vec3 ink=mix(vec3(.70,.75,.71),accent,pigment.x);
  color=vec4(ink,opacity*pigment.y*(streak==1?.27:1.));
}`;
const fragment = `#version 300 es
precision highp float;
in vec4 color;
out vec4 pixel;
void main(){pixel=color;}`;

export function mountFlow({
  canvas,
  mode,
  accent,
  capture,
  onReadout,
  onFallback,
  onPhase,
}) {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    depth: false,
    stencil: false,
  });
  if (!gl) {
    onFallback();
    return null;
  }
  function program(vs, fs, varyings) {
    const p = gl.createProgram();
    for (const [kind, source] of [
      [gl.VERTEX_SHADER, vs],
      [gl.FRAGMENT_SHADER, fs],
    ]) {
      const s = gl.createShader(kind);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw Error(gl.getShaderInfoLog(s));
      gl.attachShader(p, s);
    }
    if (varyings)
      gl.transformFeedbackVaryings(p, varyings, gl.INTERLEAVED_ATTRIBS);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
      throw Error(gl.getProgramInfoLog(p));
    return p;
  }
  const sim = program(
    update,
    "#version 300 es\nprecision mediump float;out vec4 pixel;void main(){pixel=vec4(0.);}",
    ["nextState", "pigment"],
  );
  const render = program(draw, fragment);
  const uniforms = (p, names) =>
    Object.fromEntries(
      names.split(" ").map((n) => [n, gl.getUniformLocation(p, n)]),
    );
  const s = uniforms(sim, "time dt aspect hand scene settle pointer atlas");
  const r = uniforms(render, "accent dpr opacity streak");
  let salt = 67421;
  function random() {
    salt = (Math.imul(salt, 1664525) + 1013904223) >>> 0;
    return salt / 4294967296;
  }
  function buffer(data, usage) {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    return b;
  }
  const seeds = buffer(
    Float32Array.from({ length: count * 4 }, () =>
      Math.min(0.9999999, random()),
    ),
    gl.STATIC_DRAW,
  );
  const states = [
    buffer(count * 24, gl.DYNAMIC_COPY),
    buffer(count * 24, gl.DYNAMIC_COPY),
  ];
  function vao(state, instanced) {
    const a = gl.createVertexArray();
    gl.bindVertexArray(a);
    for (const [loc, b, size, stride, offset] of [
      [0, seeds, 4, 0, 0],
      [1, state, 4, 24, 0],
      [2, state, 2, 24, 16],
    ]) {
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset);
      gl.vertexAttribDivisor(loc, instanced ? 1 : 0);
    }
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return a;
  }
  const points = states.map((b) => vao(b, false)),
    lines = states.map((b) => vao(b, true));
  const textures = scenes.map((scene) => {
    const { width, height, data } = pathAtlas(scene),
      tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32F,
      width,
      height,
      0,
      gl.RGBA,
      gl.FLOAT,
      data,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return tex;
  });
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let n = count,
    dpr = 1,
    side = 0,
    time = capture ?? 0,
    last = 0,
    raf = 0,
    total = 0,
    frames = 0,
    slow = 0,
    hand = 0,
    hover = false,
    initialized = false,
    lost = false;
  let x = 0.5,
    y = 0.5,
    phase = -1,
    w = 1,
    h = 1;
  function still() {
    return motion.matches || capture !== null;
  }
  function refresh() {
    if (!raf && !document.hidden && !lost) raf = requestAnimationFrame(frame);
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    dpr = Math.min(devicePixelRatio, 1.5, n < count ? 1 : 1.5);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    refresh();
  }
  function frame(now) {
    raf = 0;
    if (document.hidden || lost) return;
    const ms = last ? now - last : 0;
    last = now;
    const dt = Math.min(ms / 1000, 0.075),
      fixed = still();
    if (!fixed) time += dt;
    else time = capture ?? 4;
    hand += ((hover && !fixed ? 1 : 0) - hand) * (1 - Math.exp(-dt * 9));
    gl.useProgram(sim);
    gl.bindTexture(gl.TEXTURE_2D, textures[Math.max(0, mode - 1)]);
    gl.uniform1i(s.atlas, 0);
    gl.uniform1f(s.aspect, w / h);
    gl.uniform1i(s.scene, mode);
    gl.uniform1f(s.hand, fixed ? 0 : hand);
    gl.uniform2f(s.pointer, x, y);
    function step(t, delta, initialize) {
      gl.uniform1f(s.time, t);
      gl.uniform1f(s.dt, delta);
      gl.uniform1i(s.settle, initialize ? 1 : 0);
      gl.bindVertexArray(points[side]);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, states[1 - side]);
      gl.beginTransformFeedback(gl.POINTS);
      gl.drawArrays(gl.POINTS, 0, n);
      gl.endTransformFeedback();
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
      side = 1 - side;
    }
    gl.enable(gl.RASTERIZER_DISCARD);
    if (capture !== null && !motion.matches) {
      // A bounded, fixed-step history gives the captured frame the same drag,
      // moving packets and velocity streaks as the live simulation.
      const steps = Math.min(90, Math.ceil(time * 60)),
        start = Math.max(0, time - steps / 60);
      step(start, 0, true);
      for (let i = 1; i <= steps; i++)
        step(
          start + ((time - start) * i) / steps,
          (time - start) / steps,
          false,
        );
    } else step(time, dt, !initialized || motion.matches);
    gl.disable(gl.RASTERIZER_DISCARD);
    initialized = true;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(render);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);
    gl.uniform3fv(r.accent, accent);
    gl.uniform1f(r.dpr, dpr);
    gl.uniform1f(r.opacity, (mode === 0 ? 0.82 : 0.32) * Math.min(1, w / 620));
    gl.bindVertexArray(points[side]);
    gl.uniform1i(r.streak, 0);
    gl.drawArrays(gl.POINTS, 0, n);
    if (!motion.matches) {
      gl.bindVertexArray(lines[side]);
      gl.uniform1i(r.streak, 1);
      gl.drawArraysInstanced(gl.LINES, 0, 2, Math.floor(n / 3));
    }
    gl.bindVertexArray(null);
    if (mode) {
      const stages = scenes[mode - 1].phases;
      const stageTime = (time % 8) / 8;
      const step = scenes[mode - 1].ends.findIndex((end) => stageTime < end);
      if (step !== phase) {
        phase = step;
        onPhase(stages[step]);
      }
    }
    if (!fixed && ms > 0) {
      total += ms;
      frames++;
      if (total >= 750) {
        const mean = total / frames;
        onReadout(n, mean);
        slow = mean > 24 ? slow + 1 : 0;
        if (slow >= 2 && n > 18432) {
          n = Math.max(18432, Math.floor(n * 0.8));
          slow = 0;
          resize();
        }
        total = frames = 0;
      }
    } else onReadout(n, null);
    if (!fixed) refresh();
  }
  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    x = (e.clientX - rect.left) / rect.width;
    y = (e.clientY - rect.top) / rect.height;
    hover = true;
  });
  canvas.addEventListener("pointerleave", () => (hover = false));
  document.addEventListener("visibilitychange", () => {
    last = total = frames = 0;
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else refresh();
  });
  motion.addEventListener("change", () => {
    last = 0;
    refresh();
  });
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    onFallback();
  });
  canvas.addEventListener("webglcontextrestored", () => location.reload());
  new ResizeObserver(resize).observe(canvas);
  resize();
  return {
    select(value) {
      if (value !== mode) {
        mode = value;
        time = capture ?? 0;
      }
      phase = -1;
      refresh();
    },
    tint(value) {
      accent = value;
      refresh();
    },
  };
}
