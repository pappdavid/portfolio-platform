import { terrain, simulation, contours } from './terrain.js';
import { storyPaths } from './story.js';

const vertex=`#version 300 es
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
const fragment=body=>`#version 300 es
precision highp float;
in vec2 uv;out vec4 outColor;
${body}`;
const traceVertex=`#version 300 es
precision highp float;
layout(location=0) in vec4 segment;
layout(location=1) in vec2 pen;
uniform vec2 cssSize;
out float edge;flat out float weight;flat out float strength;
void main(){
  vec2 d=(segment.zw-segment.xy)*cssSize;
  vec2 normal=vec2(-d.y,d.x)/max(length(d),.0001);
  int id=gl_VertexID;
  bool last=id==1||id==4||id==5;
  float side=(id==2||id==3||id==5)?1.:-1.;
  vec2 point=last?segment.zw:segment.xy;
  float extent=pen.x*.5+.8;
  point+=normal*side*extent/cssSize;
  gl_Position=vec4(point.x*2.-1.,1.-point.y*2.,0.,1.);
  edge=side*extent;weight=pen.x*.5;strength=pen.y;
}`;
const traceFragment=`#version 300 es
precision highp float;
uniform vec3 accent;uniform float reveal;
in float edge;flat in float weight;flat in float strength;
out vec4 outColor;
void main(){
  float coverage=1.-smoothstep(weight-.55,weight+.55,abs(edge));
  outColor=vec4(mix(vec3(.75,.79,.69),accent,strength),coverage*strength*reveal);
}`;

function program(gl,vs,fs){
  const id=gl.createProgram();
  for(const [type,source] of [[gl.VERTEX_SHADER,vs],[gl.FRAGMENT_SHADER,fs]]){
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));
    gl.attachShader(id,shader);gl.deleteShader(shader);
  }
  gl.linkProgram(id);
  if(!gl.getProgramParameter(id,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(id));
  const uniforms={};
  for(let i=0;i<gl.getProgramParameter(id,gl.ACTIVE_UNIFORMS);i++){
    const {name}=gl.getActiveUniform(id,i);uniforms[name]=gl.getUniformLocation(id,name);
  }
  return {id,...uniforms};
}

export function createAtlas(canvas,{capture,onTime,onFrame,onResize,onLoss}){
  const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});
  if(!gl||!gl.getExtension('EXT_color_buffer_float'))throw Error('Floating-point WebGL surface unavailable');
  const atlasProgram=program(gl,vertex,fragment(terrain));
  const wave=program(gl,vertex,fragment(simulation));
  const map=program(gl,vertex,fragment(contours));
  const pen=program(gl,traceVertex,traceFragment);
  const empty=gl.createVertexArray(),lines=gl.createVertexArray(),buffer=gl.createBuffer();
  gl.bindVertexArray(lines);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  for(const [slot,size,offset] of [[0,4,0],[1,2,16]]){
    gl.enableVertexAttribArray(slot);gl.vertexAttribPointer(slot,size,gl.FLOAT,false,24,offset);gl.vertexAttribDivisor(slot,1);
  }
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let surfaces=[],cols,rows,w,h,mode=0,color=[0,1,.53],time=0,storyStart=0,prev=0,carry=0,frame=0,ratio=1;
  let pointer=[-2,-2],kick=0,samples=[],lost=false,ready=false,front=0,age=1;
  const step=1/45;
  const fixed=()=>capture!==null||motion.matches;
  function surface(){
    const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA16F,cols,rows);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Incomplete wave surface');
    return {tex,fb};
  }
  function use(p,fb,width,height){
    gl.useProgram(p.id);gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.viewport(0,0,width,height);gl.bindVertexArray(empty);
  }
  function texture(unit,location,tex){
    gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(location,unit);
  }
  function solve(init=false){
    use(wave,surfaces[1-front].fb,cols,rows);
    texture(0,wave.stateTex,surfaces[front].tex);texture(1,wave.atlas,surfaces[2].tex);
    gl.uniform2f(wave.cell,1/cols,1/rows);gl.uniform2fv(wave.touch,pointer);
    gl.uniform4fv(wave.weights,[0,1,2,3].map(i=>Number(i===mode)));
    gl.uniform1f(wave.opening,fixed()?0:Math.max(0,1-age));gl.uniform1f(wave.story,time-storyStart);gl.uniform1f(wave.t,time);gl.uniform1f(wave.aspect,w/h);gl.uniform1f(wave.kick,kick);gl.uniform1f(wave.init,Number(init));
    gl.drawArrays(gl.TRIANGLES,0,3);front=1-front;kick*=.60;
  }
  function draw(){
    const story=Math.max(0,time-storyStart);
    use(map,null,canvas.width,canvas.height);texture(0,map.stateTex,surfaces[front].tex);gl.uniform3fv(map.accent,color);
    gl.uniform2f(map.cssSize,w,h);gl.uniform1f(map.selected,mode?1:0);gl.drawArrays(gl.TRIANGLES,0,3);
    if(mode){
      const segments=[];
      for(const {points,width,tone} of storyPaths(mode,story)){
        for(let j=1;j<points.length;j++)segments.push(...points[j-1],...points[j],width,tone);
      }
      gl.bindVertexArray(lines);gl.useProgram(pen.id);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(segments),gl.DYNAMIC_DRAW);
      gl.uniform3fv(pen.accent,color);gl.uniform2f(pen.cssSize,w,h);gl.uniform1f(pen.reveal,Math.min(1,age*3));
      gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArraysInstanced(gl.TRIANGLES,0,6,segments.length/6);gl.disable(gl.BLEND);gl.bindVertexArray(empty);
    }
    onTime(story);
  }
  function setBufferSize(){
    const scale=Math.min(devicePixelRatio,1.5)*ratio;
    canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));
  }
  function still(){
    time=motion.matches?9.25:(capture??0);storyStart=0;age=1;kick=0;
    // Capture starts from a known equilibrium and integrates a fixed history.
    if(capture!==null&&!motion.matches){
      const end=time;time-=12*step;solve(true);
      for(let i=0;i<12;i++){time+=step;solve()}time=end;
    }else solve(true);
    draw();onFrame(null);
  }
  function resize(){
    if(lost)return;
    w=canvas.clientWidth;h=canvas.clientHeight;if(!w||!h)return;
    setBufferSize();cols=Math.min(640,Math.max(160,Math.round(w*.47)));rows=Math.max(80,Math.round(cols*h/w));
    for(const {tex,fb} of surfaces){gl.deleteTexture(tex);gl.deleteFramebuffer(fb)}
    surfaces=[surface(),surface(),surface()];front=0;
    use(atlasProgram,surfaces[2].fb,cols,rows);gl.drawArrays(gl.TRIANGLES,0,3);
    ready=true;onResize(w,h);
    if(fixed())still();else{solve(true);draw()}
  }
  function tick(now){
    if(lost||!ready||fixed()||document.hidden)return;
    if(prev){
      const elapsed=(now-prev)/1000;
      samples.push(elapsed*1000);carry+=Math.min(elapsed,.10);
      const steps=Math.min(4,Math.floor(carry/step));carry%=step;
      for(let i=0;i<steps;i++){time+=step;age+=step;solve()}
      if(samples.length>=45){
        const mean=samples.reduce((a,b)=>a+b)/samples.length;
        onFrame(mean);
        let next=mean>24?Math.max(.65,ratio-.12):mean<18?Math.min(1,ratio+.04):ratio;
        if(next!==ratio){ratio=next;setBufferSize()}samples=[];
      }
    }
    prev=now;draw();frame=requestAnimationFrame(tick);
  }
  function run(){cancelAnimationFrame(frame);prev=0;carry=0;samples=[];
    if(lost||!ready||document.hidden)return;
    if(fixed())still();else frame=requestAnimationFrame(tick);
  }
  resize();
  const observer=new ResizeObserver(()=>{if(canvas.clientWidth!==w||canvas.clientHeight!==h)resize()});
  observer.observe(canvas);
  document.addEventListener('visibilitychange',run);motion.addEventListener('change',run);
  canvas.parentElement.addEventListener('pointermove',e=>{
    if(fixed()||e.pointerType==='touch')return;
    const rect=canvas.getBoundingClientRect();
    pointer=[(e.clientX-rect.left)/w,(e.clientY-rect.top)/h];kick=.022;
  });
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;cancelAnimationFrame(frame);observer.disconnect();onLoss()});
  run();
  return {
    select(next){if(lost||mode===next)return;mode=next;storyStart=time;age=0;if(fixed())still();else draw()},
    tint(rgb){color=rgb;if(!lost&&ready)draw()}
  };
}
