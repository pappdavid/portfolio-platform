import { makeDrawings, STRANDS, KNOTS } from './geometry.js';

const shared = `#version 300 es
precision highp float;
layout(location=0) in vec4 state;
layout(location=1) in vec4 shapeA;
layout(location=2) in vec4 shapeB;
uniform float progress, clockTime, stage, beat, beatPart, shear;
uniform vec2 pointer;
float strand(){return float(gl_VertexID/${KNOTS});}
vec2 arrange(vec4 v, float stop) {
  vec2 p=v.xy;
  float seed=fract(strand()*.618034), g=v.w;
  if (g==9.) {
    p.y+=.028*sin(4.*p.x+clockTime*.60+seed*.4)+.018*cos(8.*p.x-clockTime*.45+2.*p.y);
    p.x+=.014*sin(clockTime*.43+4.*p.y);
  }
  if(stop==0.) {
    p.x+=pointer.x*(p.y+.13)*.15+.009*sin(clockTime*.37+p.y);
    p.y+=pointer.y*(p.x*.095)+.008*sin(clockTime*.31+p.x);
  }
  if(stop==1. && g==1.) {
    float nextX=beat==1.?.65:(beat==2.?1.:1.59);
    float prevX=beat==1.?0.:(beat==2.?.65:1.);
    float u=smoothstep(.03,.87,beatPart);
    p.x+=beat==0.?0.:mix(prevX,nextX,u);
    p.y+=beat==0.?0.:.075*sin(u*3.14159);
  }
  if(stop==2.) {
    if(g==5. && beat==0.) {
      float row=mod(strand(),4.);
      p.x-=.20*(1.-smoothstep(row*.11,.53+row*.11,beatPart));
    }
    if(g==0.)p.y+=.012*sin(p.x*10.-clockTime*1.8)*sin(clamp((p.x+.50)/.85,0.,1.)*3.14159);
    if(g==6.) {
      float row=mod(strand(),4.), center=.385-row*.252;
      float u=beat==0.?0.:(beat==1.?smoothstep(.10*row,.60+.10*row,beatPart):1.);
      p.x=mix(-.89+(p.x-.35)*.63,p.x,u);
      p.y=mix(.39-row*.235+(p.y-center)*.15,p.y,u);
    }
  }
  if(stop==3. && g==14.)p.y-=(beat==2.?1.-smoothstep(.36,.90,beatPart):0.)*.25;
  if(stop==3. && g>=15.) {
    float lane=g-15.;
    float d=lane==1.?-.62:((lane==3.)?-1.24:1.16);
    float u=lane==beat?smoothstep(0.,.86,beatPart):0.;
    if(beat==3. && lane==0.) u=smoothstep(0.,.36,beatPart);
    if(beat==3. && lane==3.) u=smoothstep(.36,.94,beatPart);
    p.x+=u*d;p.y+=.056*sin(u*3.14159);
  }
  return p;
}
float ink(vec4 v, float stop){
  float g=v.w;
  if(stop==1. && g>=2. && g<=4. && g-1.==beat) return .81;
  if(stop==2. && g==5. && beat==0.)return .71;
  if(stop==3. && g>=10. && g<=13. && g-10.==beat)return .26;
  if(stop==3. && g==14. && beat!=2.)return 0.;
  if(stop==3. && g>=15. && g-15.!=beat && !(beat==3. && g==15. && beatPart<.36))return 0.;
  if(stop==3. && g==18. && beat==3. && beatPart<.36)return 0.;
  return v.z;
}
`;
const update =
  shared +
  `
uniform float dt, snap;
out vec4 nextState;
void main(){
  vec2 a=arrange(shapeA,stage), b=arrange(shapeB,stage+1.);
  float seed=fract(strand()*.618034);
  float m=smoothstep(0.,1.,clamp(progress+(seed-.5)*.38*sin(progress*3.14159),0.,1.));
  float curl=sin(m*3.14159);
  vec2 goal=mix(a,b,m);
  goal.y+=curl*(.23*sin(6.*a.x+4.*seed+clockTime*.65)+.13*cos(6.*b.x));
  goal.x+=curl*(seed-.5)*.28+shear*(.1+.20*goal.y)*sin(seed*4.+goal.x);
  vec2 vel=state.zw+(goal-state.xy)*112.*dt;
  vel*=exp(-16.*dt);
  nextState=snap==1.?vec4(goal,0.,0.):vec4(state.xy+vel*dt,vel);
  gl_Position=vec4(0.,0.,0.,1.);
}`;
const render =
  shared +
  `
uniform vec2 fit;
uniform vec3 accent;
out vec4 color;
void main(){
  float f=mix(ink(shapeA,stage),ink(shapeB,stage+1.),smoothstep(0.,1.,progress));
  vec3 c=f<0.?vec3(.72,.76,.72):mix(accent,vec3(.92,1.,.94),smoothstep(.65,1.,f)*.68);
  float dense=stage==0.?smoothstep(0.,1.,progress):1.;
  float fiber=mix(1.,fract(strand()*.754877)>.88?1.:.14,dense);
  color=vec4(c,clamp(abs(f)*.77*fiber,0.,.93));
  gl_Position=vec4(state.xy*fit,0.,1.);
}`;
const fragment = `#version 300 es
precision mediump float;
in vec4 color;out vec4 outColor;
void main(){outColor=color;}`;
function program(gl, vs, fs, feedback) {
  const prog = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ]) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
      throw Error(gl.getShaderInfoLog(sh));
    gl.attachShader(prog, sh);
  }
  if (feedback)
    gl.transformFeedbackVaryings(prog, ['nextState'], gl.INTERLEAVED_ATTRIBS);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
    throw Error(gl.getProgramInfoLog(prog));
  const loc = {};
  for (let i = 0; i < gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS); i++) {
    const name = gl.getActiveUniform(prog, i).name;
    loc[name] = gl.getUniformLocation(prog, name);
  }
  return { prog, loc };
}
export function createLoom(canvas) {
  const gl = canvas.getContext('webgl2', {
    antialias: true,
    alpha: true,
    depth: false,
    powerPreference: 'low-power',
  });
  if (!gl) return null;
  const sim = program(
    gl,
    update,
    '#version 300 es\nprecision lowp float; out vec4 c; void main(){c=vec4(0.);}',
    true,
  );
  const draw = program(gl, render, fragment, false);
  function buffer(data, usage = gl.STATIC_DRAW, target = gl.ARRAY_BUFFER) {
    const b = gl.createBuffer();
    gl.bindBuffer(target, b);
    gl.bufferData(target, data, usage);
    return b;
  }
  const shapes = makeDrawings().map((s) => buffer(s)),
    total = STRANDS * KNOTS;
  const states = [
    buffer(total * 16, gl.DYNAMIC_COPY),
    buffer(total * 16, gl.DYNAMIC_COPY),
  ];
  const indices = [1, 2, 4].map((stride) => {
    // Fixed primitive restart joins independent line strips in a single draw.
    const ids = new Uint16Array(Math.ceil(STRANDS / stride) * (KNOTS + 1));
    let j = 0;
    for (let start = 0; start < STRANDS; start += stride) {
      const i = start + Math.floor(((start * 0.754877) % 1) * stride);
      for (let n = 0; n < KNOTS; n++) ids[j++] = i * KNOTS + n;
      ids[j++] = 65535;
    }
    return {
      buf: buffer(ids, gl.STATIC_DRAW, gl.ELEMENT_ARRAY_BUFFER),
      count: ids.length,
    };
  });
  let front = 0;
  function attrib(n, b) {
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.enableVertexAttribArray(n);
    gl.vertexAttribPointer(n, 4, gl.FLOAT, false, 0, 0);
  }
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA,
    gl.ONE,
    gl.ONE_MINUS_SRC_ALPHA,
  );
  return function paint({
    position,
    time,
    step,
    part,
    velocity,
    pointer,
    delta,
    snap,
    accent,
    quality,
  }) {
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    if (!w || !h) return;
    const density = Math.min(devicePixelRatio, 1.6) * [1, 0.86, 0.7][quality];
    const width = Math.round(w * density),
      height = Math.round(h * density);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    const a = Math.min(4, Math.floor(position)),
      b = Math.min(4, a + 1);
    const params = (p) => {
      gl.useProgram(p.prog);
      for (const [key, value] of Object.entries({
        stage: a,
        progress: position - a,
        beat: step,
        beatPart: part,
        clockTime: time,
        shear: velocity,
      })) {
        if (p.loc[key]) gl.uniform1f(p.loc[key], value);
      }
      if (p.loc.pointer) gl.uniform2fv(p.loc.pointer, pointer);
    };
    params(sim);
    attrib(0, states[front]);
    attrib(1, shapes[a]);
    attrib(2, shapes[b]);
    gl.uniform1f(sim.loc.dt, Math.min(delta, 0.035));
    gl.uniform1f(sim.loc.snap, snap ? 1 : 0);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, states[1 - front]);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, total);
    gl.endTransformFeedback();
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    gl.disable(gl.RASTERIZER_DISCARD);
    front = 1 - front;
    params(draw);
    attrib(0, states[front]);
    const scale = Math.min(
      w / 2.27,
      h / (1.37 + 0.41 * Math.max(0, 1 - position)),
    );
    gl.uniform2f(draw.loc.fit, (2 * scale) / w, (2 * scale) / h);
    gl.uniform3fv(draw.loc.accent, accent);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const idx = indices[quality];
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx.buf);
    gl.drawElements(gl.LINE_STRIP, idx.count, gl.UNSIGNED_SHORT, 0);
  };
}
