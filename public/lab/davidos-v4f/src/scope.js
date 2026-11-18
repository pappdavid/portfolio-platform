import {drawDiagram} from './diagrams.js';

const vectorVS = `#version 300 es
in vec2 aPos;
in float aDistance, aRadius, aTone;
uniform vec2 bounds;
out float dist, radius, tone;
void main() {
  gl_Position=vec4(aPos / bounds * vec2(2.,-2.) + vec2(-1.,1.),0.,1.);
  dist=aDistance; radius=aRadius; tone=aTone;
}`;
const vectorFS = `#version 300 es
precision highp float;
in float dist, radius, tone;
uniform vec3 accent;
out vec4 outColor;
void main() {
  float a=clamp(radius+0.55-abs(dist),0.,1.);
  vec3 col=mix(vec3(.19,.23,.20),accent,clamp(tone*tone*.87+tone*.13,0.,1.));
  col=mix(col,vec3(.94,1.,.94),max(0.,tone-1.)*3.);
  outColor=vec4(col*a,a);
}`;
const screenVS = `#version 300 es
out vec2 uv;
void main(){
  uv=vec2((gl_VertexID<<1)&2,gl_VertexID&2);
  gl_Position=vec4(uv*2.-1.,0.,1.);
}`;
const screenFS = `#version 300 es
precision mediump float;
uniform sampler2D history;
uniform float decay;
in vec2 uv; out vec4 col;
void main(){col=texture(history,uv)*decay;}
`;

function program(gl,vs,fs) {
  const p=gl.createProgram();
  for(const [type,source] of [[gl.VERTEX_SHADER,vs],[gl.FRAGMENT_SHADER,fs]]){
    const shader=gl.createShader(type);
    gl.shaderSource(shader,source); gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
    gl.attachShader(p,shader); gl.deleteShader(shader);
  }
  gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(p));
  return p;
}

// Extrude a connected strip in CSS pixels; miter joins keep diagonal elbows watertight.
function stroke(vertices,points,tone,width,sx,sy) {
  let prevX=-1e6,prevY=-1e6;
  const chain=[];
  for(const [x,y] of points){
    const px=x*sx,py=y*sy;
    if(Math.hypot(px-prevX,py-prevY)>.01){chain.push([px,py]);prevX=px;prevY=py;}
  }
  if(chain.length<2)return;
  const normals=chain.slice(1).map(([x,y],i)=>{
    const dx=x-chain[i][0],dy=y-chain[i][1],len=Math.hypot(dx,dy);
    return [-dy/len,dx/len];
  });
  const edge=width*.5+.75;
  let previous;
  for(let i=0;i<chain.length;i++){
    const a=normals[Math.max(0,i-1)],b=normals[Math.min(i,normals.length-1)];
    const factor=edge/Math.max(.33,1+a[0]*b[0]+a[1]*b[1]);
    const dx=(a[0]+b[0])*factor,dy=(a[1]+b[1])*factor;
    const [x,y]=chain[i];
    const pair=[[x-dx,y-dy,-edge,width*.5,tone],[x+dx,y+dy,edge,width*.5,tone]];
    if(previous)vertices.push(...previous[0],...previous[1],...pair[0],...pair[0],...previous[1],...pair[1]);
    previous=pair;
  }
}
export function createScope(canvas,index) {
  let gl=canvas.getContext('webgl2',{alpha:true,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});
  let width=0,height=0,ratio=0,lastAccent='',targets=[],front=0;
  let vectors,screen,buff,vao,uniforms,ctx;
  function init(){
    vectors=program(gl,vectorVS,vectorFS);screen=program(gl,screenVS,screenFS);
    uniforms={bounds:gl.getUniformLocation(vectors,'bounds'),accent:gl.getUniformLocation(vectors,'accent'),decay:gl.getUniformLocation(screen,'decay')};
    vao=gl.createVertexArray();gl.bindVertexArray(vao);
    buff=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buff);
    for(const [field,size,offset] of [['aPos',2,0],['aDistance',1,8],['aRadius',1,12],['aTone',1,16]]){
      const attr=gl.getAttribLocation(vectors,field);gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,size,gl.FLOAT,false,20,offset);
    }
    gl.bindVertexArray(null);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    targets=[0,1].map(()=>{
      const tex=gl.createTexture(),fb=gl.createFramebuffer();
      gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      for(const axis of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,axis,gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
      return {tex,fb};
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  }
  if(gl){
    init();
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();canvas.dataset.lost='true';});
    canvas.addEventListener('webglcontextrestored',()=>{init();width=0;delete canvas.dataset.lost;window.dispatchEvent(new Event('resize'));});
  }else ctx=canvas.getContext('2d');
  function resize(w,h,dpr) {
    if(!w||!h){width=0;return false;}
    if(w===width&&h===height&&ratio===dpr)return false;
    width=w;height=h;ratio=dpr;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    if(gl&&!gl.isContextLost()){
      for(const {tex} of targets){
        gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,canvas.width,canvas.height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
      }
      gl.viewport(0,0,canvas.width,canvas.height);
    }
    return true;
  }
  function copy(tex,decay){
    gl.bindVertexArray(null);gl.useProgram(screen);gl.uniform1f(uniforms.decay,decay);
    gl.bindTexture(gl.TEXTURE_2D,tex);gl.drawArrays(gl.TRIANGLES,0,3);
  }
  function render(state,accent,dt,still=false) {
    if(!width||canvas.dataset.lost)return;
    const sx=width/640,sy=height/84;
    const rgb=[1,3,5].map(i=>parseInt(accent.slice(i,i+2),16)/255);
    if(!gl){
      if(!ctx)return;
      ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);ctx.lineJoin='round';
      drawDiagram(index,state,(pts,t,w)=>{
        ctx.strokeStyle=accent;ctx.globalAlpha=Math.min(1,t);ctx.lineWidth=w;ctx.beginPath();
        pts.forEach(([x,y],i)=>i?ctx.lineTo(sx*x,sy*y):ctx.moveTo(sx*x,sy*y));ctx.stroke();
      });
      return;
    }
    const base=[],pulses=[];
    drawDiagram(index,state,(p,t,w,m)=>stroke(m?pulses:base,p,t,w,sx,sy));
    function paint(batch) {
      if(!batch.length)return;
      gl.useProgram(vectors);gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buff);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(batch),gl.STREAM_DRAW);
      gl.uniform2f(uniforms.bounds,width,height);gl.uniform3fv(uniforms.accent,rgb);
      gl.drawArrays(gl.TRIANGLES,0,batch.length/5);
    }
    const dst=targets[1-front];
    gl.bindFramebuffer(gl.FRAMEBUFFER,dst.fb);gl.disable(gl.BLEND);
    copy(targets[front].tex,still||accent!==lastAccent?0:Math.exp(-dt*15));
    gl.enable(gl.BLEND);paint(pulses);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    paint(base);copy(dst.tex,1);front=1-front;lastAccent=accent;
  }
  return {resize,render,gpu:!!gl};
}
