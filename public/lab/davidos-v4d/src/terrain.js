// Render the terrain atlas once per size. Each channel is a survey surface.
export const terrain = `
float hill(vec2 p, vec2 c, vec2 radius, float skew){
  vec2 q=p-c; q.x+=q.y*skew; q/=radius;
  return exp(-dot(q,q)*1.35);
}
float hash(vec2 p){
  vec3 a=fract(p.xyx*vec3(.1031,.1030,.0973));
  a+=dot(a,a.yzx+33.33); return fract((a.x+a.y)*a.z);
}
float noise(vec2 p){
  vec2 cell=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(cell),hash(cell+vec2(1,0)),f.x),
    mix(hash(cell+vec2(0,1)),hash(cell+1.),f.x),f.y);
}
void main(){
  vec2 p=uv;
  vec2 k=p*vec2(5.,2.6);
  vec2 q=p+vec2(.072,.14)*(vec2(noise(k+3.),noise(k-2.))-.5)
          +vec2(.016,.025)*sin(k.yx*5.+k.xy*3.);
  float detail=.075*(noise(k*3.)-.5)+.028*(noise(k*8.)-.5);
  float a=hill(q,vec2(.17,.70),vec2(.145,.54),.12)
        +.63*hill(q,vec2(-.035,.29),vec2(.13,.38),.09)
        +.48*hill(q,vec2(.28,.32),vec2(.125,.37),-.06);
  float b=hill(q,vec2(.51,.41),vec2(.097,.57),-.18)
        +.58*hill(q,vec2(.60,.65),vec2(.08,.41),-.14);
  float c=.93*hill(q,vec2(.84,.63),vec2(.142,.48),.14)
        +.56*hill(q,vec2(.99,.12),vec2(.14,.47),.12)
        +.58*hill(q,vec2(.76,1.04),vec2(.14,.3),.05);
  float landscape=(a+b+c)*.82+detail+.055*sin(16.*q.x+q.y*5.);
  // Broad, level beds face the three narrow cuts in the hillside.
  float beds=exp(-pow(abs((p.x-.19)/.145),4.)-pow(abs((p.y-.54)/.34),2.));
  float gates=0.;
  for(int i=0;i<3;i++){
    float x=.47+.178*float(i);
    gates+=hill(q,vec2(x,.29),vec2(.056,.19),.04)+hill(q,vec2(x+.018,.78),vec2(.067,.22),-.05);
  }
  float strata=.68*beds+.50*gates+.14*a+.18*detail;
  // Transcripts run as parallel ridges. At the outlet they close into isolated peaks.
  float ridgeY=p.y+.05*sin(10.*p.x+.4)+.028*sin(18.*p.x);
  float stream=(.48+.32*cos((ridgeY-.29)*25.))*exp(-pow(abs((p.x-.21)/.24),4.)-pow(abs((p.y-.49)/.37),4.));
  float evidence=stream+.82*hill(q,vec2(.77,.34),vec2(.138,.18),.06)
        +.86*hill(q,vec2(.83,.72),vec2(.13,.18),-.08)+.09*b+.3*detail;
  float channel=.92*hill(q,vec2(.21,.53),vec2(.12,.32),.10)
        +.98*hill(q,vec2(.80,.53),vec2(.13,.31),-.09)
        +.20*hill(q,vec2(.52,.48),vec2(.39,.10),.0)+.18*c+.35*detail;
  outColor=vec4(landscape,strata,evidence,channel);
}`;

export const simulation = `
uniform sampler2D stateTex,atlas;
uniform vec2 cell, touch;
uniform vec4 weights;
uniform float t,story,opening,kick,init,aspect;
void main(){
  vec2 drift=vec2(.012,.032)*sin(vec2(t*.34+uv.y*4.,t*.29+uv.x*7.));
  float target=dot(texture(atlas,uv+drift),weights);
  // A passing request displaces the channel. Evidence accumulates at its source outlet.
  float phase=mod(max(0.,story)/2.35,4.);
  float u=smoothstep(0.,1.,fract(phase));
  if(weights.w>.5){
    float f=min(1.,u/.74), branch=0.;
    if(phase>=1.&&phase<2.) f=1.-.49*min(1.,u/.8);
    if(phase>=2.&&phase<3.) branch=smoothstep(.78,1.,f);
    if(phase>=3.) f=u<.46?u/.46:1.-(u-.46)/.54;
    vec2 center=vec2(.19+.61*f+.046*branch,.53+.15*branch);
    vec2 d=(uv-center)*vec2(aspect,1.);
    target+=.15*exp(-dot(d,d)*86.);
    if(phase>2.){d=(uv-vec2(.846,.68))*vec2(aspect,1.);target+=.19*smoothstep(2.55,2.9,phase)*exp(-dot(d,d)*42.);}
  }else if(weights.z>.5){
    vec2 d=(uv-vec2(.77,.34))/vec2(.12,.18);
    target-=.35*(1.-smoothstep(1.,1.85,phase))*exp(-dot(d,d));
    d=(uv-vec2(.825,.70))/vec2(.12,.18);
    target-=.37*(1.-smoothstep(2.,2.85,phase))*exp(-dot(d,d));
  }
  if(opening>0.&&weights.x<.5){
    vec2 summit=weights.y*vec2(.17,.70)+weights.z*vec2(.51,.41)+weights.w*vec2(.84,.63);
    vec2 offset=(uv-summit)/vec2(.21,.59);
    float uplift=exp(-dot(offset,offset));
    target=mix(target,texture(atlas,uv+drift).r*(.30+1.20*uplift)+.12*uplift,opening);
  }
  if(init>.5){outColor=vec4(target,0.,0.,1.);return;}
  vec2 state=texture(stateTex,uv).rg;
  float neighbors=texture(stateTex,uv+vec2(cell.x,0)).r+texture(stateTex,uv-vec2(cell.x,0)).r
    +texture(stateTex,uv+vec2(0,cell.y)).r+texture(stateTex,uv-vec2(0,cell.y)).r;
  vec2 delta=(uv-touch)*vec2(aspect,1.);
  float force=kick*exp(-dot(delta,delta)*750.);
  // Discrete damped wave with a restoring force toward the advected landform.
  float velocity=.944*state.y+.175*(neighbors-4.*state.x)+.0055*(target-state.x)+force;
  outColor=vec4(state.x+velocity,velocity,0.,1.);
}`;

export const contours = `
uniform sampler2D stateTex;
uniform vec3 accent;
uniform vec2 screen,cssSize;
uniform float selected;
float iso(float h,float width){
  float gradient=max(length(vec2(dFdx(h),dFdy(h))),.0001);
  float d=abs(fract(h+.5)-.5)/gradient;
  return (1.-smoothstep(max(0.,width-.48),width+.48,d))*smoothstep(.001,.029,gradient);
}
void main(){
  vec2 p=vec2(uv.x,1.-uv.y);
  float h=texture(stateTex,p).r;
  float altitude=h*32.+.36;
  float minor=iso(altitude,.54),major=iso(altitude/5.,.73);
  vec3 paper=vec3(.044,.061,.054);
  vec2 xy=p*cssSize;
  vec2 g=abs(mod(xy+48.,96.)-48.);
  vec2 dd=abs(mod(xy+2.,4.)-2.);
  float cross=max((1.-step(.65,g.x))*(1.-step(3.5,g.y)),(1.-step(3.5,g.x))*(1.-step(.65,g.y)));
  float grid=max((1.-step(.52,g.x))*(1.-step(.65,dd.y)),(1.-step(.52,g.y))*(1.-step(.65,dd.x)));
  vec3 base=paper+clamp(h,0.,1.)*mix(vec3(.018,.022,.015),accent*.028,.4)+vec3(grid*.039+cross*.19);
  float high=smoothstep(.25,.93,h);
  vec3 pencil=mix(vec3(.52,.55,.49),mix(vec3(.79,.83,.68),accent,.64),high);
  vec3 ink=mix(pencil,accent,.31+.32*high);
  float soft=mix(1.,.67,selected);
  vec3 col=mix(base,pencil,minor*(.53+.38*high)*soft);
  col=mix(col,ink,major*(.74+.22*high)*soft);
  outColor=vec4(col,1.);
}`;
