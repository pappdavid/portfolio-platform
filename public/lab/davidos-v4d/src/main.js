import {createAtlas} from './atlas.js';
import {projects,storyPaths,storyTime} from './story.js';

const $=s=>document.querySelector(s);
const all=s=>Array.from(document.querySelectorAll(s));
const params=new URLSearchParams(location.search);
const seconds=Number(params.get('capture'));
const capture=params.has('capture')&&Number.isFinite(seconds)&&seconds>=0?seconds:null;
const colors={green:'#00ff88',cyan:'#00f0ff',amber:'#ffb700',pink:'#ff007f'};
const names=projects.map(p=>p.name);
const ids=['A','B','C'];
let selected=-1,section='home',field=null,tint='green',lastStage=-1,fallback=false;
const pinX=[17,51,83],pinY=[63,36,63];
const links=p=>`<a href="${p.demo}" aria-label="Open ${p.name} demo">Demo</a>${p.repo?`<a href="${p.repo}" aria-label="View ${p.name} source">Source</a>`:''}`;
$('#pins').innerHTML=projects.map((p,i)=>`<button type="button" class="pin" data-project="${i}" style="--x:${pinX[i]}%;--y:${pinY[i]}%" aria-controls="inspector" aria-pressed="false"><b>${ids[i]}</b>${p.name}</button>`).join('');
$('#rows').innerHTML=projects.map((p,i)=>`<li class="project" data-row="${i}"><button data-project="${i}" aria-controls="inspector" aria-pressed="false"><span class="row-id">${ids[i]}</span>${p.name}</button><div><p>${p.line}</p><small>${p.kind} · ${p.proof} · ${p.repo?'MIT':'Private source'}</small></div><div class="links">${links(p)}</div></li>`).join('');
const legend=`<h2 id="detail-title">Map key</h2><dl class="legend">
<div><dt><svg aria-hidden="true" viewBox="0 0 36 22"><path d="M1 15Q6 1 19 3T34 13Q30 21 17 19T1 15ZM7 14Q10 5 20 7T28 14Q21 20 7 14ZM13 13Q17 8 22 11T13 13Z"/></svg></dt><dd>Contours · project terrain</dd></div>
<div><dt><svg aria-hidden="true" viewBox="0 0 36 22"><path d="M18 1v12m0 0 4 4-4 4-4-4Z"/></svg></dt><dd>Survey pin · select a project</dd></div>
<div><dt><svg aria-hidden="true" viewBox="0 0 36 22"><path d="M1 16h9l7-9h16m-4-4 5 4-5 4"/></svg></dt><dd>Bright trace · follow the process</dd></div></dl>`;
function inspector(){
  const p=projects[selected],box=$('#inspector');
  if(section==='contact'){
    box.innerHTML=`<h2 id="detail-title">Contact</h2><p>David Papp · Rotterdam, NL</p><p>Open to full-time work in AI engineering, backend and data.</p><div class="links"><a href="https://www.linkedin.com/in/d%C3%A1vid-papp">LinkedIn</a><a href="https://github.com/pappdavid">GitHub</a></div>`;
  }else if(section==='skills'){
    box.innerHTML=`<h2 id="detail-title">Skills</h2><p>AI engineering, backend and data</p><p class="fact">Explore the work</p><div class="skill-links">${projects.map((p,i)=>`<button data-skill="${i}">${['Source-grounded answers','Transcript evidence','Retries and idempotency'][i]} ↗</button>`).join('')}</div>`;
    all('[data-skill]').forEach(b=>b.onclick=()=>{select(Number(b.dataset.skill));$('#inspector').focus({preventScroll:true})});
  }else if(p){
    box.innerHTML=`<div class="inspector-head selected-detail"><h2 id="detail-title">${p.name}</h2><span class="small-label">Site ${ids[selected]}</span></div><p>${p.detail}</p>${p.sample?`<p class="sample">${p.sample}</p>`:''}<p class="fact">${p.kind} · ${p.proof} · ${p.source}</p><div class="links">${links(p)}</div>`;
  }else box.innerHTML=legend;
}
function nav(){all('nav a').forEach(a=>{if(a.hash==='#'+section)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
function annotations(stage){
  const tag=(x,y,label,cls='')=>`<span class="annotation ${cls}" style="--x:${x}%;--y:${y}%">${label}</span>`;
  let html='';
  if(selected===0)html=tag(17,50,'Fictional · “up to 50 records”','excerpt');
  if(selected===1){
    html=tag(23,35,'Mira')+tag(23,60,'Noor');
    if(stage>=1)html+=tag(77,34,'Mira');
    if(stage>=2)html+=tag(82.5,70,'Noor');
  }
  if(selected===2&&stage>=1)html=tag(80,53,'Receipt');
  if(selected===2&&stage>=3)html+=tag(84.6,68,'Copy');
  $('#annotations').innerHTML=html;
}
function updateTime(t){
  if(selected<0)return;
  const stage=Math.floor(storyTime(t));
  if(lastStage===stage)return;
  lastStage=stage;annotations(stage);$('#caption').textContent=projects[selected].captions[stage];
  all('.station').forEach((el,i)=>el.classList.toggle('current',i===(selected===0?stage:selected===1?[0,1,2,2][stage]:[2,1,2,0][stage])));
}
const phone=matchMedia('(max-width:560px)');
function orderDetail(){
  const box=$('#inspector'),lower=$('.lower');
  if(phone.matches&&selected>=0){
    if(lower.firstElementChild!==box)lower.prepend(box);
  }else if(lower.lastElementChild!==box)lower.append(box);
}
phone.addEventListener('change',orderDetail);
function select(i,area=i<0?'home':'projects'){
  if(i===selected&&area===section&&$('#inspector').children.length)return;
  selected=i;section=area;lastStage=-1;nav();inspector();orderDetail();
  all('[data-project]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.project)===i)));
  $('.map').classList.toggle('selected',i>=0);$('#reset').hidden=i<0;
  $('#view-label').textContent=i<0?'Contour survey':'Site '+ids[i];
  $('#stations').innerHTML=i<0?'':projects[i].stations.map(([s,x])=>`<span class="station" style="--x:${x*100}%">${s}</span>`).join('');
  $('.trace-key').hidden=i<0;$('.key-hint').hidden=i>=0;
  if(i<0)$('#annotations').replaceChildren();
  if(i<0)$('#caption').textContent='Select a landform to explore its project.';else updateTime(0);
  $('#announcement').textContent=i>=0?projects[i].name+'. '+projects[i].detail:'';
  field?.select(i+1);if(fallback)drawFallback();
}
all('[data-project]').forEach(b=>{
  const choose=()=>select(Number(b.dataset.project));
  b.addEventListener('click',()=>{choose();if(phone.matches&&b.closest('.project'))$('figure').scrollIntoView()});b.addEventListener('focus',choose);
  b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')choose()});
});
all('.project').forEach(row=>{
  row.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')select(Number(row.dataset.row))});
  row.addEventListener('click',e=>{if(!e.target.closest('a,button'))select(Number(row.dataset.row))});
});
function area(id,move=true){
  if(!['home','projects','skills','contact'].includes(id))id='home';
  select(-1,id);
  if(move){
    const dest=id==='home'?$('#home'):id==='projects'?$('#projects'):$('#inspector');
    if(id==='skills'||id==='contact')dest.focus({preventScroll:true});
    if(innerWidth<=820||document.documentElement.scrollHeight>innerHeight+1)dest.scrollIntoView({block:id==='home'?'end':'nearest'});
  }
}
function go(id){
  if(location.hash!=='#'+id)history.pushState(null,'','#'+id);
  area(id);
}
all('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();go(a.hash.slice(1))}));
window.addEventListener('popstate',()=>area(location.hash.slice(1)));
$('#surface').addEventListener('pointermove',e=>{
  if(capture!==null||selected>=0||e.pointerType!=='mouse')return;
  const rect=$('#surface').getBoundingClientRect();
  $('#view-label').textContent=`X ${Math.round(e.clientX-rect.left)} · Y ${Math.round(e.clientY-rect.top)} px`;
});
$('#surface').addEventListener('pointerleave',()=>{if(selected<0)$('#view-label').textContent='Contour survey'});
$('#reset').onclick=()=>{select(-1);$('#atlas-title').setAttribute('tabindex','-1');$('#atlas-title').focus({preventScroll:true})};
function accent(name){
  tint=Object.hasOwn(colors,name)?name:'green';
  document.documentElement.style.setProperty('--accent',colors[tint]);
  const rgb=colors[tint].slice(1).match(/../g).map(h=>parseInt(h,16)/255);
  field?.tint(rgb);all('[data-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===tint)));
  $('#color-toggle').setAttribute('aria-label',`Accent color: ${tint}. Choose a color`);
}
function pop(trigger,panel,open){
  $(trigger).setAttribute('aria-expanded',String(open));$(panel).hidden=!open;
}
$('#colors').innerHTML=Object.keys(colors).map(name=>`<button data-color="${name}" style="--swatch:${colors[name]}"><i></i>${name}</button>`).join('');
$('#color-toggle').onclick=()=>pop('#color-toggle','#colors',$('#colors').hidden);
all('[data-color]').forEach(b=>b.onclick=()=>{accent(b.dataset.color);pop('#color-toggle','#colors',false);$('#color-toggle').focus()});
const commands=[...names.map(n=>'open '+n),'ps',...Object.keys(colors).map(c=>'accent '+c),'cv','contact','help'];
$('#commands').innerHTML=commands.map(cmd=>`<button type="button" data-command="${cmd}">${cmd}</button>`).join('');
function help(open){pop('#help','#commands',open)}
$('#help').onclick=()=>help($('#commands').hidden);
const input=$('#cmd');
const clean=()=>input.value.trimStart().toLowerCase();
const match=()=>clean()&&commands.find(c=>c.startsWith(clean())&&c!==clean());
function complete(){const hint=match();$('#completion').textContent=hint?`Tab → ${hint}`:''}
function execute(command){
  const cmd=command.trim().toLowerCase();help(false);
  if(cmd==='help'){help(true);$('#help').focus()}
  else if(cmd==='ps')go('projects');
  else if(cmd==='contact')go('contact');
  else if(cmd==='cv'){location.assign('/cv.pdf');return}
  else if(cmd.startsWith('open ')&&names.includes(cmd.slice(5))){select(names.indexOf(cmd.slice(5)));if(innerWidth<=820)$('figure').scrollIntoView()}
  else if(cmd.startsWith('accent ')&&Object.hasOwn(colors,cmd.slice(7)))accent(cmd.slice(7));
  else {$('#completion').textContent='Unknown command · try help';return}
  input.value='';complete();
}
all('[data-command]').forEach(b=>b.onclick=()=>{input.focus();execute(b.dataset.command)});
$('#command').onsubmit=e=>{e.preventDefault();execute(input.value)};
input.addEventListener('input',complete);
input.addEventListener('keydown',e=>{if(e.key==='Tab'&&!e.shiftKey&&match()){e.preventDefault();input.value=match();complete()}});
document.addEventListener('pointerdown',e=>{
  if(!e.target.closest('.palette'))pop('#color-toggle','#colors',false);
  if(!e.target.closest('#command'))help(false);
});
document.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey)return;
  if(e.key==='Escape'){
    if(!$('#colors').hidden){pop('#color-toggle','#colors',false);$('#color-toggle').focus()}
    else if(!$('#commands').hidden){help(false);$('#help').focus()}
    else if(e.target===input){input.value='';complete();input.blur()}
    else select(-1);
    return;
  }
  if(e.target===input)return;
  if(/^[1-3]$/.test(e.key)){select(Number(e.key)-1);if(innerWidth<=560)$('figure').scrollIntoView();return}
  if(e.key==='?'){help(true);$('#help').focus();return}
  if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(e.key)&&e.target.matches('[data-project]')){
    e.preventDefault();const next=(Number(e.target.dataset.project)+(['ArrowRight','ArrowDown'].includes(e.key)?1:2))%3;
    $(`${e.target.classList.contains('pin')?'.pin':'.project button'}[data-project="${next}"]`).focus();
  }
});
function ruler(w,h){
  for(const [el,len,step,side] of [['#x-ruler',w,w<500?64:128,'left'],['#y-ruler',h,64,'top']]){
    let labels='';for(let px=0;px<len-20;px+=step)labels+=`<span style="${side}:${px}px">${String(px).padStart(3,'0')}</span>`;
    $(el).innerHTML=labels;
  }
}
function drawFallback(){
  let svg=$('#static-map');
  if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='static-map';svg.setAttribute('aria-hidden','true');svg.setAttribute('viewBox','0 0 1000 400');svg.setAttribute('preserveAspectRatio','none');$('#surface').prepend(svg)}
  const t=capture??9.25;
  let paths=storyPaths(selected+1,t);
  if(selected<0){
    for(let i=0;i<3;i++)for(let j=1;j<=20;j++){
      const x=pinX[i]/100,y=pinY[i]/100+.05;
      const points=Array.from({length:97},(_,k)=>{
        const a=k*Math.PI/48,r=j/20*(1+.13*Math.sin(3*a+i)+.075*Math.cos(5*a+j*.07));
        return [x+.16*r*Math.cos(a)+.04*r*Math.sin(a),y+.44*r*Math.sin(a)];
      });paths.push({points,width:j%5===0?1.2:.8,tone:j%5===0?.65:.32});
    }
  }
  svg.innerHTML=paths.map(({points,width,tone})=>`<polyline fill="none" stroke="var(--accent)" stroke-opacity="${tone}" stroke-width="${width}" vector-effect="non-scaling-stroke" points="${points.map(([x,y])=>[x*1000,y*400].join(',')).join(' ')}"/>`).join('');
  updateTime(t);ruler($('#surface').clientWidth,$('#surface').clientHeight);
}
function noGL(){fallback=true;field=null;$('canvas').hidden=true;$('#frame').textContent='—';drawFallback();new ResizeObserver(()=>ruler($('#surface').clientWidth,$('#surface').clientHeight)).observe($('#surface'))}
$('#revision').textContent=$('meta[name="portfolio:commit"]').content;
const clock=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Amsterdam',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
function clockTick(){$('#clock').textContent=clock.format(new Date())}
clockTick();setInterval(()=>{if(!document.hidden)clockTick()},1000);
const navigation=performance.getEntriesByType('navigation')[0];
if(navigation?.responseStart)$('#ttfb').textContent=(navigation.responseStart-navigation.startTime).toFixed(1)+' ms';
try{field=createAtlas($('canvas'),{capture,onTime:updateTime,onResize:ruler,onFrame:ms=>$('#frame').textContent=ms===null?'—':ms.toFixed(1)+' ms',onLoss:noGL})}
catch(error){console.info('Static atlas:',error.message);noGL()}
accent(params.get('accent'));
const initial=names.indexOf(params.get('select'));
if(initial>=0)select(initial);else area(location.hash.slice(1),false);
