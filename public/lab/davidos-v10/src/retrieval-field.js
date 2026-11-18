// Integrate term coverage in each real chunk row. Fractional prefix sums keep the
// last partial bin and isolated matches correct at every projection distance.
import * as T from "../vendor/three.module.min.js";
export function retrievalField(data, corners, uniforms) {
  const cols = data.vocab.length,
    rows = data.chunks.length,
    pitch = cols + 1;
  const sums = new Float32Array(pitch * rows * 4),
    query = new Set(data.query);
  data.chunks.forEach((chunk, j) => {
    const occupied = new Set(chunk.terms);
    for (let i = 0; i < cols; i++) {
      const from = 4 * (j * pitch + i),
        to = from + 4;
      sums[to] = sums[from] + Number(occupied.has(i));
      sums[to + 1] = sums[from + 1] + Number(query.has(i));
      sums[to + 2] = sums[from + 2] + Number(query.has(i) && occupied.has(i));
    }
  });
  const prefix = new T.DataTexture(
    sums,
    pitch,
    rows,
    T.RGBAFormat,
    T.FloatType,
  );
  prefix.needsUpdate = true;
  const geometry = new T.BufferGeometry();
  geometry.setAttribute(
    "position",
    new T.Float32BufferAttribute(corners.flat(), 3),
  );
  geometry.setAttribute(
    "uv",
    new T.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 1, 1], 2),
  );
  geometry.setIndex([0, 1, 2, 2, 1, 3]);
  const light = { value: 0 };
  const material = new T.ShaderMaterial({
    uniforms: {
      ...uniforms,
      exposure: { value: 1 },
      prefix: { value: prefix },
      dims: { value: new T.Vector2(cols, rows) },
      light,
      dpr: { value: Math.min(devicePixelRatio, 2) },
    },
    side: T.DoubleSide,
    vertexShader: `varying vec2 st;
    void main(){st=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform sampler2D prefix;uniform vec2 dims;uniform vec3 accent;
    uniform float light,siteInk,dpr,exposure;varying vec2 st;
    vec3 integral(float x,int row){
      x=clamp(x,0.,dims.x);int i=int(floor(x));
      return mix(texelFetch(prefix,ivec2(i,row),0).rgb,
        texelFetch(prefix,ivec2(min(i+1,int(dims.x)),row),0).rgb,fract(x));
    }
    vec3 area(float x,float w,int j){
      float a=clamp(x-w*.5,0.,dims.x),b=clamp(x+w*.5,0.,dims.x);
      return (integral(b,j)-integral(a,j))/max(.00001,b-a);
    }
    vec3 bin(float x,float size,int j){
      float lo=floor(x/size)*size, hi=min(lo+size,dims.x);
      return (integral(hi,j)-integral(lo,j))/max(.001,hi-lo);
    }
    vec3 level(float x,float width,float size,int j){
      float a=clamp(x-width*.5,0.,dims.x-.00001), b=clamp(x+width*.5,0.,dims.x-.00001);
      float lo=(floor(a/size)+1.)*size;
      if(b<=lo)return bin(a,size,j);
      return (bin(a,size,j)*(lo-a)+integral(floor(b/size)*size,j)-integral(lo,j)+bin(b,size,j)*mod(b,size))/max(.00001,b-a);
    }
    void main(){
      vec2 p=st*dims, footprint=max(fwidth(p),vec2(.0001));
      float stepPx=1./(footprint.x*dpr);
      float w=max(footprint.x*1.65,1.-smoothstep(1.5,4.,stepPx));
      vec3 density=vec3(0.);
      for(int k=0;k<3;k++){
        int j=int(clamp(floor(p.y+(float(k)-1.)*.33*footprint.y),0.,dims.y-1.));
        float lod=clamp(log2(max(1.,2.25/stepPx)),0.,8.);
        float binWidth=exp2(floor(lod));
        vec3 binned=mix(level(p.x,w,binWidth,j),level(p.x,w,binWidth*2.,j),fract(lod));
        density+=mix(binned,area(p.x,w,j),smoothstep(1.5,4.,stepPx))/3.;
      }
      vec2 dist=min(fract(p),1.-fract(p))/footprint/dpr;
      float xline=(1.-smoothstep(.05,.85,dist.x))*smoothstep(2.8,4.5,stepPx);
      float yline=1.-smoothstep(.05,.95,dist.y);
      vec3 ground=vec3(10./255.),neutral=mix(vec3(.89,.91,.87),accent,.04);
      vec3 base=mix(ground,neutral,.10+.32*max(xline,yline)+.48*density.r);
      vec3 color=mix(base,accent,clamp(light*(density.g*.48+density.b*.52),0.,1.));
      // At readable pitch, distinguish the upper and lower edges of each occupied cell.
      float relief=smoothstep(3.6,4.8,stepPx)*density.r;
      color+=relief*(1.-smoothstep(.0,1.,fract(p.y)/footprint.y))*vec3(.09);
      gl_FragColor=vec4(mix(ground,color,siteInk*exposure),1.);

    }`,
  });
  const mesh = new T.Mesh(geometry, material);
  // The same occupied term/chunk pairs become shallow relief where a column is
  // wide enough to resolve a top and edge. No additional score is encoded.
  const origin = new T.Vector3(...corners[0]);
  const column = new T.Vector3(...corners[1]).sub(origin).divideScalar(cols);
  const row = new T.Vector3(...corners[2]).sub(origin).divideScalar(rows);
  const normal = new T.Vector3().crossVectors(column, row).normalize();
  const boxes = new T.BoxGeometry(1, 1, 1);
  const matches = data.chunks.flatMap((chunk) =>
    chunk.terms.map((i) => Number(query.has(i))),
  );
  boxes.setAttribute(
    "matched",
    new T.InstancedBufferAttribute(new Float32Array(matches), 1),
  );
  const relief = new T.InstancedMesh(
    boxes,
    new T.ShaderMaterial({
      uniforms: material.uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: `attribute float matched;uniform vec2 viewport;
      varying float presence,hit,face;
      void main(){
        mat4 transform=modelViewMatrix*instanceMatrix;
        vec4 p=projectionMatrix*transform*vec4(position,1.);
        vec4 next=projectionMatrix*transform*vec4(position+vec3(1./.70,0.,0.),1.);
        float pitch=length((p.xy/p.w-next.xy/next.w)*viewport*.5);
        presence=smoothstep(3.9,4.8,pitch);
        face=normal.z;hit=matched;gl_Position=p;
      }`,
      fragmentShader: `uniform vec3 accent;uniform float light,siteInk,exposure;
      varying float presence,hit,face;
      void main(){
        vec3 ink=mix(vec3(.70,.74,.71),accent,light*hit);
        gl_FragColor=vec4(ink*(face>.5?.78:.46),presence*siteInk*exposure*.76);
      }`,
    }),
    matches.length,
  );
  let instance = 0;
  const basis = new T.Matrix4().makeBasis(
    column.clone().multiplyScalar(0.7),
    row.clone().multiplyScalar(0.69),
    normal.clone().multiplyScalar(0.017),
  );
  data.chunks.forEach((chunk, j) =>
    chunk.terms.forEach((i) => {
      const center = origin
        .clone()
        .addScaledVector(column, i + 0.5)
        .addScaledVector(row, j + 0.5)
        .addScaledVector(normal, 0.01);
      relief.setMatrixAt(instance++, basis.setPosition(center));
    }),
  );
  mesh.add(relief);
  return { mesh, light };
}
