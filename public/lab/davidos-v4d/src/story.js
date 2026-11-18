// The same stroke geometry supplies the WebGL overlay and the static SVG fallback.
export const projects=[
  {name:'client-studio',line:'Answers questions with exact source excerpts.',kind:'Hosted workflow',proof:'65 tests',source:'Private source',
   detail:'An answer cites the supplied text. Review the excerpt, approve it, then activate a frozen snapshot. The hosted demo makes no AI calls.',
   sample:'Fictional · “What is the API batch limit?” → “up to 50 records” · source version 2.',
   demo:'https://client-studio-psi.vercel.app',
   stations:[['Source rows',.17],['Review',.47],['Approve',.648],['Activate',.826]],
   captions:['One exact excerpt lights up in the supplied text.','The excerpt lifts out of its source and moves to review.','The reviewed excerpt passes through approval.','The approved version becomes a frozen snapshot.']},
  {name:'active-companion',line:'Turns transcript lines into sourced evidence cards.',kind:'Scripted replay',proof:'18 tests in CI',source:'Public MIT source',
   detail:'Four fictional conversations replay as a transcript. Selected lines become evidence cards. In the diagram, Mira’s and Noor’s cards each link back to their own line.',
   demo:'https://active-companion-replay.vercel.app',repo:'https://github.com/pappdavid/active-companion',
   stations:[['Fictional transcript',.19],['Source links',.50],['Evidence cards',.80]],
   captions:['Lines from a fictional conversation enter the transcript.','A transcript line curls into an evidence card.','Another line becomes a card with its own named source.','Each card stays connected to its original line.']},
  {name:'faultline',line:'Shows what happens when a request is retried.',kind:'Browser model',proof:'12 tests in CI',source:'Public MIT source',
   detail:'The receiver saves a receipt, but its reply gets lost. Trying again creates a duplicate. Retrying with the same key returns the saved receipt.',
   demo:'https://davidpapp.dev/faultline/index.html',repo:'https://github.com/pappdavid/faultline',
   stations:[['Sender',.19],['Lost reply',.5],['Saved receipt',.815]],
   captions:['A request reaches the receiver, which saves a receipt.','The reply breaks off before it reaches the sender.','A plain retry creates a second, duplicate receipt.','Reusing the same key brings back the original receipt.']}
];
export const duration=2.35;
export function storyTime(seconds){return (seconds/duration)%4}
const curve=(n,fn)=>Array.from({length:n+1},(_,i)=>fn(i/n));
const ease=t=>t*t*(3-2*t);
const loop=(x,y,rx,ry,end=1)=>curve(60,t=>[x+rx*Math.cos(t*end*Math.PI*2),y+ry*Math.sin(t*end*Math.PI*2)]);
export function storyPaths(mode,time){
  const strokes=[];
  const add=(points,tone=1,width=1.4)=>strokes.push({points,tone,width});
  const t=storyTime(time), stage=Math.floor(t), u=ease(t-stage);
  const path=(a,b,fn,tone,width)=>add(curve(44,f=>fn(a+(b-a)*f)),tone,width);
  const arrow=(x,y,dir)=>add([[x-dir*.013,y-.018],[x,y],[x-dir*.013,y+.018]],1,1.8);
  if(mode===1){
    for(let i=0;i<6;i++){
      let y=.36+i*.061;
      add([[.068,y+.015],[.11,y],[.265,y],[.287,y-.014]],i===3?1:.42,i===3?2:1);
    }
    const y=.36+3*.061;
    add([[.222,y],[.30,y],[.35,.5],[.872,.5]],.45,1);
    for(let i=0;i<3;i++){
      const x=.47+i*.178;
      add([[x-.013,.33],[x,.33],[x,.46],[x+.009,.46]],stage===i+1?1:.68);
      add([[x-.013,.68],[x,.68],[x,.54],[x+.009,.54]],stage===i+1?1:.68);
    }
    const stops=[.162,.234,.47,.648,.867];
    let head=stops[stage]+(stops[stage+1]-stops[stage])*u;
    let cy=y+(.5-y)*Math.min(1,Math.max(0,(head-.25)/.10));
    add([[head-.04,cy],[head+.04,cy]],1,3);
    if(stage===3){const x=.876;add([[x-.046,.445],[x+.046,.445],[x+.046,.558],[x-.046,.558],[x-.046,.445]],.5+u*.5)}
  }
  if(mode===2){
    for(let i=0;i<6;i++){
      const y=.29+i*.082;
      path(.0,.39,x=>[x,y+Math.sin(x*12+i*.2+time*.42)*.015],.35,.95);
      let head=.065+((time*.07+i*.068)%.30);
      path(head-.056,head,x=>[x,y+Math.sin(x*12+i*.2+time*.42)*.015],.82,1.7);
    }
    for(let i=0;i<2;i++){
      let y=.29+(i?4:1)*.082, cy=i?.70:.34, cx=i?.825:.77;
      y+=Math.sin(.30*12+(i?4:1)*.2+time*.42)*.015;
      let end=stage<i+1?.12:stage===i+1?.12+.88*u:1;
      const thread=f=>[.30+(cx-.057-.30)*f,y+(cy-y)*ease(f)+.025*Math.sin(Math.PI*2*f)];
      path(0,1,thread,.38,1);path(0,Math.min(1,end*2),thread,.94,1.6);
      add(loop(cx,cy,.057,.075,1),.39,1);
      if(end>.45)add(loop(cx,cy,.057,.075,(end-.45)/.55),1,2.2);
      add(loop(.30,y,.004,.011),1);
    }
  }
  if(mode===3){
    const left=.19,right=.80;
    const lane=(f,l)=>[left+(right-left)*f,.53-(.11-l*.096)*Math.sin(Math.PI*f)];
    path(0,1,f=>lane(f,0),.55,1);
    path(0,.452,f=>lane(f,1),.38,1);path(.535,1,f=>lane(f,1),.49,1);
    path(0,1,f=>lane(f,2),.5,1);
    add(loop(left,.53,.032,.06),.88);
    // Receipts form only after their requests reach the receiver.
    add(loop(right,.53,.038,.066,stage===0?Math.max(.004,Math.min(1,(u-.7)/.3)):1),1,2);
    if(stage>=2)add(loop(right+.046,.68,.033,.058,stage===2?Math.max(.004,Math.min(1,(u-.7)/.3)):1),1,1.8);
    const inReturn=stage===1||(stage===3&&u>.46);
    let pos=Math.min(1,u/.74);
    if(stage===1)pos=1-.49*Math.min(1,u/.80);
    if(stage===3)pos=inReturn?1-(u-.46)/.54:u/.46;
    const l=stage===0?0:stage===1?1:stage===3&&!inReturn?0:2;
    const route=f=>{
      const [x,y]=lane(f,l);
      const branch=stage===2?ease(Math.max(0,(f-.78)/.22)):0;
      return [x+.046*branch,y+.15*branch];
    };
    if(stage===2)path(.78,1,route,.65,1);
    const tail=Math.max(0,Math.min(1,pos+(inReturn?.14:-.14)));
    if(stage!==1||u<.82){
      path(tail,pos,route,1,2.8);
      const [x,y]=route(pos);arrow(x,y,inReturn?-1:1);
    }
    if(stage===1){
      let [bx,by]=lane(.5,1);
      add([[bx-.009,by-.025],[bx+.009,by+.025]],1,1.8);
      add([[bx-.009,by+.025],[bx+.009,by-.025]],1,1.8);
    }
  }
  return strokes;
}
