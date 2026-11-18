// Coordinates describe a 640 × 84 scope. All lettering lives outside this region.
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
function along(points,t) {
  const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
  let d=clamp(t,0,1.018)*lengths.reduce((a,b)=>a+b,0);
  for(let i=0;i<lengths.length;i++){
    if(d<=lengths[i] || i===lengths.length-1){
      const u=d/(lengths[i]||1);
      return [points[i][0]+(points[i+1][0]-points[i][0])*u,points[i][1]+(points[i+1][1]-points[i][1])*u];
    }
    d-=lengths[i];
  }
}
export function drawDiagram(index,state,ink) {
  const {step,age}=state;
  const line=(points,tone=.55,w=1,moving=false)=>ink(points,tone,w,moving);
  const seg=(x,y,u,v,t=.5,w=1)=>line([[x,y],[u,v]],t,w);
  const box=(x,y,w,h,t=.5)=>line([[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]],t);
  const packet=(points,t,tone=1,span=.055)=>{
    const part=Array.from({length:10},(_,i)=>along(points,t-span+i*span/9));
    line(part,tone,2,true);
    const [x,y]=part[9];line([[x-2.3,y],[x+2.3,y]],1.15,4,true);
  };
  // Closed-form damped step response. Display a compact, continuous travelling packet.
  // Analytic response of a spring-mass-damper to a step in target position.
  // A small underdamped overshoot settles without a frame-rate dependent integrator.
  const position=(seconds)=>{
    const t=Math.max(0,seconds);
    return 1-Math.exp(-2.55*t)*(Math.cos(2.05*t)+2.55/2.05*Math.sin(2.05*t));
  };
  const u=position(age);
  const settle=age<2 ? 2.2*Math.exp(-4*age)*Math.sin(age*13) : 0;
  function sheet(x,y,w,h,depth,tone) {
    line([[x,y],[x+depth,y-depth],[x+w+depth,y-depth],[x+w,y],[x,y],[x,y+h],[x+w,y+h],[x+w,y],[x+w+depth,y-depth],[x+w+depth,y+h-depth],[x+w,y+h]],tone,1.2);
  }
  if(index===0){
    // A highlighted line is lifted from the layered source and forwarded through each gate.
    for(let i=2;i>=0;i--)sheet(13+i*4,22-i*4,60,45,7,.31+i*.025);
    for(let i=0;i<5;i++)seg(20,29+i*7,20+[40,33,49,38,29][i],29+i*7,i===2?1:.55,i===2?2:1);
    // The double rule identifies the exact text range on the front source page.
    seg(20,40,65,40,.57);seg(20,46,65,46,.57);
    const nodes=[83,208,328,447,562], route=[[34,43],[91,43],[110,24],[155,24],[173,42],[570,42]];
    line(route,.50,1.3);
    for(let n=0;n<3;n++){
      let x=nodes[n+1],open=step>=n+2,y=open?(step===n+2?28-18*position(age):10):30;
      line([[x-23,54],[x-12,54],[x-12,64],[x+11,64],[x+11,54],[x+24,54]],.34);
      for(let k=0;k<3;k++){
        let dx=k*3;
        line([[x-13+dx,59-k*2],[x-13+dx,y-k*2],[x+10+dx,y-k*2],[x+10+dx,34-k*2]],open?.82:.43);
      }
      seg(x-10,61,x+8,61,open?.87:.40);
      for(let k=0;k<6;k++)seg(x-10+k*3,y+1,x-7+k*3,y-2,open?.78:.45);
      if(open)line([[x-4,49],[x,52],[x+6,45]],.99,1.35);
    }
    const stageEnd=[0,162,244,358,558][step];
    const lit=route.filter(p=>p[0]<stageEnd);
    lit.push([stageEnd,stageEnd===162?31:42]);line(lit,.91,1.5);
    const travelStart=[0,0,.26,.45,.64][step],travelEnd=[0,.26,.45,.64,.99][step];
    if(step!==4 || age<2.8) packet(route,travelStart+(travelEnd-travelStart)*u);
    sheet(563,22,52,42,8,step===4?1:.48);
    for(let j=0;j<4;j++)seg(571,30+j*7,571+[30,21,34,25][j],30+j*7,step===4?.92:.41);
    if(step===4)for(let k=0;k<6;k++)seg(575+k*5,62,579+k*5,58,.7);
  }else if(index===1){
    // Each transcript rail owns its waveform, each evidence card has exactly one tether.
    for(let r=0;r<6;r++){
      const y=13+r*11,exists=r<step;
      const path=[[11,y]];
      // A horizontal stream rendered as narrow, joined signal lobes.
      for(let x=16;x<=254;x+=2){
        const phase=r===step-1?u*13:0;
        const envelope=.15+.85*Math.pow(Math.sin((x-phase)*.045+r*1.8),2);
        path.push([x,y+envelope*(exists?5:1.7)*Math.sin((x-phase)*.75+r*2.6)]);
      }
      path.push([264,y]);line(path,exists?(r===step-1?1:.73):.33,1.1);
      if(r===step-1)packet(path,u,.98,.09);
      seg(4,y,7,y,exists?.86:.36,2);
    }
    for(let j=0;j<2;j++){
      const source=j===0?2:4,formed=step>=source,ys=13+(source-1)*11, yc=j===0?22:61;
      const route=[[264,ys],[300+j*20,ys],[317+j*20,ys+(j?13:-12)],[372+j*25,ys+(j?13:-12)],[392+j*25,yc],[493+j*22,yc]];
      line(route,formed?.82:.26,1.3);
      const growth=step===source?.54+.46*position(age-.25):1;
      const x=496+j*22+(step===source?settle:0),y=yc-12*growth;
      sheet(x,y,83*growth,24*growth,6,formed?.94:.43);
      seg(x+7,y+7,x+30*growth,y+7,formed?.95:.32,2);
      seg(x+7,y+12,x+66*growth,y+12,formed?.62:.28);
      seg(x+7,y+17,x+49*growth,y+17,formed?.59:.28);
      if(formed){box(261,ys-3,6,6,.94);if(source===step)packet(route,position(age-.35));}
    }
  }else{
    // Outbound and inbound lines are separate; a lost response has a real break.
    for(const [x,flip] of [[19,false],[567,true]]){
      sheet(x,22,47,42,8,.68);
      for(let k=0;k<5;k++)seg(x+7+k*7,28,x+7+k*7,34,flip?.78:.56,1.7);
      for(let k=0;k<3;k++)seg(x+8,43+k*5,x+37-k*6,43+k*5,.54);
    }
    const outgoing=[[68,34],[110,34],[118,17],[135,17],[143,34],[162,34],[170,17],[187,17],[195,34],[216,34],[224,17],[241,17],[249,34],[562,34]];
    line(outgoing,step===1||step===3?.95:.52,1.65);
    for(let x=293;x<=491;x+=66)line([[x-4,31],[x,34],[x-4,37]],.68);
    if(step===4)line([[213,44],[207,48],[213,52]],.97,1.65);
    const end=step===2?325:74;
    const incoming=[[563,48],[517,48],[507,61],[467,61],[457,48],[412,48],[402,61],[365,61],[355,48],[end,48]];
    line(incoming,step===4?1:step===2?.78:.39,1.45);
    if(step===2){seg(313,43,323,53,.98,2);seg(323,43,313,53,.98,2);for(let x=82;x<305;x+=10)seg(x,48,x+3,48,.30);}
    if(step===3){
      const copy=outgoing.map(([x,y])=>[x+2,y+6]);line(copy,.66);sheet(576,53,39,16,5,.93);
      packet(copy,u,.96);
    }else packet(step===1?outgoing:incoming,u,.99);
    if(step===4 && state.duplicate)sheet(576,53,39,16,5,.75);
    if(step>=1){seg(579,59,600,59,1,2);if(step===4)seg(25,59,43,59,1,2);}
  }
}
