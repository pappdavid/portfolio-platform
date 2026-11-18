import {newBench,caption,transcript,evidence,projects,verbs} from './stories.js';
import {createScope} from './scope.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const sections=$$('.lane'),bench=newBench(),params=new URLSearchParams(location.search);
const seconds=Number(params.get('capture'));
const capture=params.has('capture')&&Number.isFinite(seconds)&&seconds>=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:680px)');
const colors={green:'#00ff88',cyan:'#00f0ff',amber:'#ffb700',pink:'#ff007f'};
const states=[],signatures=[],scopes=sections.map((el,i)=>createScope(el.querySelector('canvas'),i));
let selected=projects.indexOf(params.get('select')),expanded=selected<0?0:selected;
let accent='green',time=capture?seconds:0,dpr=Math.min(devicePixelRatio,1.5),frameId=0,previous=0,intervals=[],slow=0;
const still=()=>capture||reduced.matches;
const dialog=$('dialog'),cli=$('#cli'),reply=$('#reply');

function syncSize(){
  sections.forEach((el,i)=>{
    const {width,height}=el.querySelector('.screen').getBoundingClientRect();
    scopes[i].resize(width,height,dpr);
  });
}
function choose(i,focus=false){
  if(i<0||i>=sections.length)return;
  selected=i;expanded=i;
  sections.forEach((s,n)=>{
    s.classList.toggle('selected',n===selected);s.classList.toggle('expanded',n===expanded);
    const title=s.querySelector('.lane-name');
    title.setAttribute('aria-pressed',String(n===selected));
    if(phone.matches)title.setAttribute('aria-expanded',String(n===expanded));else title.removeAttribute('aria-expanded');
  });
  $('.rack').classList.add('has-selection');
  syncSize();if(focus)sections[i].querySelector('.lane-name').focus();
  if(still())draw(0,true);
}
function setAccent(value){
  if(!Object.hasOwn(colors,value))return;
  accent=value;document.documentElement.style.setProperty('--accent',colors[value]);
  $$('[data-accent]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.accent===value)));
  if(still())draw(0,true);
}
function canStep(i,n){
  const {mode,step}=bench.lanes[i];
  if(n===1)return true;
  if(mode==='auto')return false;
  return i===0?n===step+1:(n===2?step===1:step>=2);
}
function update(i,state) {
  const {step,mode}=state,s=sections[i];
  const key=[step,mode,...(i===2?bench.counts():[])].join('/');
  if(signatures[i]===key)return;
  signatures[i]=key;
  const label=s.querySelector('figcaption');
  label.setAttribute('aria-live',mode==='manual'?'polite':'off');
  label.textContent=state.returnedId?'The same key returns saved receipt #'+state.returnedId+'. No duplicate is created.':caption(i,step);
  s.querySelector('.control-head>span').textContent=mode==='auto'?'Auto replay':mode==='play'?'Playing':'Manual';
  if(i===0)s.querySelector('.axis span:last-child').textContent=step===4?'Frozen · v2':'Snapshot';
  const play=s.querySelector('.play');
  play.textContent=mode==='play'?'Ⅱ Pause':i===1?'▷ Play':'▷ Play all';
  play.setAttribute('aria-label',(mode==='play'?'Pause ':'Play ')+projects[i]);
  if(i===1){
    $('#scrub').value=step;$('#line-num').textContent=step+' / '+transcript.length;
    const cards=evidence.filter(c=>c.line<=step);
    $('#cards').replaceChildren(...cards.map(c=>{
      const li=document.createElement('li'),source=document.createElement('b');
      source.textContent='L'+c.line+' ↳ ';li.append(source,c.title);return li;
    }));
    if(!cards.length)$('#cards').innerHTML='<li>Awaiting evidence</li>';
  }else{
    s.querySelectorAll('.switches button').forEach((btn,k)=>{
      btn.setAttribute('aria-disabled',String(!canStep(i,k+1)));
      btn.classList.toggle('current',k+1===step);
    });
    if(i===2){const [a,b]=bench.counts();$('#receipts').textContent=a;$('#duplicates').textContent=b;}
  }
}
function draw(dt,clear=false){
  for(let i=0;i<3;i++){
    const state=bench.view(i,time,reduced.matches);
    if(reduced.matches||(capture&&state.mode!=='auto'))state.age=3.2;
    states[i]=state;update(i,state);
    if(capture&&!reduced.matches&&state.mode==='auto'){
      for(let back=6;back>0;back--){
        scopes[i].render({...state,age:Math.max(0,state.age-back/40)},colors[accent],1/40,back===6);
      }
      scopes[i].render(state,colors[accent],1/40);
    }else scopes[i].render(state,colors[accent],dt,clear||still());
  }
}
function frame(now){
  frameId=0;
  if(document.hidden||still())return;
  const dt=previous?(now-previous)/1000:0;previous=now;
  time+=Math.min(dt,.15);draw(dt);
  if(dt>0)intervals.push(dt*1000);
  if(intervals.length>=45){
    const mean=intervals.reduce((a,b)=>a+b)/intervals.length;
    $('#frame').textContent=scopes.some(s=>s.gpu)?mean.toFixed(1)+' ms':'—';
    slow=mean>22?slow+1:0;
    if(slow>=2&&dpr>.7){dpr=Math.max(.7,dpr*.84);syncSize();slow=0;}
    intervals=[];
  }
  frameId=requestAnimationFrame(frame);
}
function restart(){
  cancelAnimationFrame(frameId);previous=0;intervals=[];$('#frame').textContent='—';
  if(document.hidden)return;
  syncSize();draw(0,true);if(!still())frameId=requestAnimationFrame(frame);
}
function action(i,verb){
  choose(i);
  const lane=bench.lanes[i];
  if(verb==='play'){
    if(lane.mode==='play'){lane.mode='manual';}
    else {
      bench.begin(i,time);
      if(still()){
        for(const v of verbs[i].slice(1))bench.apply(i,v,time);
      }
    }
  }else if(!bench.apply(i,verb,time)){
    reply.textContent=i===0?'Start with Ask, then follow the gates.':'Send a request, then lose its response.';
    return;
  }
  reply.textContent='';draw(0,true);
}
sections.forEach((s,i)=>{
  s.addEventListener('pointerenter',e=>{if(!capture&&e.pointerType==='mouse'&&!phone.matches)choose(i);});
  s.addEventListener('focusin',()=>{if(selected!==i)choose(i);});
  s.addEventListener('click',e=>{
    const button=e.target.closest('button');
    if(button?.dataset.action){action(i,button.dataset.action);return;}
    choose(i);
  });
});
$('#scrub').addEventListener('input',e=>action(1,e.target.value));
$$('[data-accent]').forEach(b=>b.addEventListener('click',()=>setAccent(b.dataset.accent)));

const commands=['ps',...projects.map(x=>'open '+x),...Object.keys(colors).map(x=>'accent '+x),'cv','contact','help','skills',
 'ask','review','approve','activate','send','lose','retry','retry --key','play'];
function openDialog(name){
  const body=$('#dialog-body');
  $('#dialog-title').textContent={help:'Command reference',skills:'Skills',contact:'Contact',transcript:'Fictional transcript'}[name];
  if(name==='contact')body.innerHTML='<p>David Papp · Rotterdam, NL<br>Open to full-time work</p><div class="dialog-links"><a href="https://www.linkedin.com/in/d%C3%A1vid-papp">LinkedIn ↗</a><a href="https://github.com/pappdavid">GitHub ↗</a><a href="/cv.pdf">Résumé ↗</a></div>';
  if(name==='skills')body.innerHTML='<p>Target roles · AI engineering, backend and data</p><div class="cmd-grid"></div>';
  if(name==='help')body.innerHTML='<p>Select a lane with 1–3 or the arrow keys. Use Tab to complete a partial command. Enter runs it.</p><div class="cmd-grid"></div>';
  if(name==='help'||name==='skills'){
    const labels=['Source excerpts','Traceable evidence','Retries and idempotency'];
    const grid=body.querySelector('.cmd-grid');
    (name==='help'?commands:projects.map(p=>'open '+p)).forEach((cmd,i)=>{
      const b=document.createElement('button');b.textContent=name==='skills'?labels[i]:cmd;
      b.onclick=()=>{dialog.close();run(cmd);};grid.append(b);
    });
  }
  if(name==='transcript'){
    body.innerHTML='<p>The hosted replay covers four fictional conversations. This bench uses a fictional delivery delay.</p><ol></ol>';
    transcript.forEach((text,i)=>{
      const li=document.createElement('li');li.textContent=text;
      li.classList.toggle('focus-line',i+1===states[1].step);body.querySelector('ol').append(li);
    });
  }
  if(!dialog.open)dialog.showModal();
}
function currentNav(name){$$('nav a').forEach(a=>{if(a.hash==='#'+name)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
function navigate(name){
  if(!['home','projects','skills','contact'].includes(name))return;
  currentNav(name);
  if(name==='contact'||name==='skills'){openDialog(name);return;}
  if(dialog.open)dialog.close();
  if(name==='projects')$('#bench-title').focus();
  else {selected=-1;expanded=0;sections.forEach((s,i)=>{s.classList.remove('selected');s.classList.toggle('expanded',i===0);s.querySelector('.lane-name').setAttribute('aria-pressed','false');if(phone.matches)s.querySelector('.lane-name').setAttribute('aria-expanded',i===0);});$('.rack').classList.remove('has-selection');window.scrollTo(0,0);syncSize();if(still())draw(0,true);}
}
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();history.pushState(null,'',a.hash);navigate(a.hash.slice(1));}));
window.addEventListener('popstate',()=>navigate(location.hash.slice(1)||'home'));
$$('[data-dialog]').forEach(b=>b.addEventListener('click',()=>openDialog(b.dataset.dialog)));
$('#close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{if(!dialog.open&&['#skills','#contact'].includes(location.hash)){history.replaceState(null,'','#home');currentNav('home');}});
function run(raw){
  const cmd=raw.trim().toLowerCase().replace(/\s+/g,' '),i=selected<0?expanded:selected;
  reply.textContent='';
  if(cmd==='help'){openDialog('help');return;}
  if(cmd==='cv'){location.assign('/cv.pdf');return;}
  if(['skills','contact','ps'].includes(cmd)){const dest=cmd==='ps'?'projects':cmd;history.pushState(null,'','#'+dest);navigate(dest);return;}
  if(cmd.startsWith('open ')&&projects.includes(cmd.slice(5))){choose(projects.indexOf(cmd.slice(5)),true);return;}
  if(cmd.startsWith('accent ')&&Object.hasOwn(colors,cmd.slice(7))){setAccent(cmd.slice(7));reply.textContent='Accent '+cmd.slice(7);return;}
  if(cmd==='play'||verbs[i].includes(cmd)){action(i,cmd);return;}
  reply.textContent='Use help for available commands.';
}
$('#command').onsubmit=e=>{e.preventDefault();run(cli.value);cli.value='';};
function complete(){
  const v=cli.value.trim().toLowerCase();
  const matches=commands.filter(c=>c.startsWith(v));
  if(!v||!matches.length)return false;
  const next=matches.find(c=>c!==v)||matches[0];if(next===v)return false;
  cli.value=next;return true;
}
$('#complete').onclick=()=>{complete();cli.focus();};
cli.addEventListener('keydown',e=>{if(e.key==='Tab'&&!e.shiftKey&&complete())e.preventDefault();});
document.addEventListener('keydown',e=>{
  if(dialog.open||e.target.matches('input,textarea')||e.ctrlKey||e.metaKey||e.altKey)return;
  if(/^[1-3]$/.test(e.key)){choose(Number(e.key)-1,true);return;}
  if(e.target.closest('.lane')&&['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(e.key)){
    e.preventDefault();choose((selected+(['ArrowDown','ArrowRight'].includes(e.key)?1:2))%3,true);
  }
});
const clock=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Amsterdam',hour:'2-digit',minute:'2-digit',second:'2-digit'});
function tick(){if(!document.hidden)$('#clock').textContent=clock.format(new Date());}
tick();setInterval(tick,1000);
$('#revision').textContent=document.querySelector('meta[name="portfolio:commit"]').content;
const nav=performance.getEntriesByType('navigation')[0];
if(nav?.responseStart)$('#ttfb').textContent=(nav.responseStart-nav.startTime).toFixed(1)+' ms';
function layout(){syncSize();if(still()&&!document.hidden)draw(0,true);}
new ResizeObserver(layout).observe($('.rack'));
window.addEventListener('resize',layout);
phone.addEventListener('change',()=>{sections.forEach((s,i)=>{if(phone.matches)s.querySelector('.lane-name').setAttribute('aria-expanded',i===expanded);else s.querySelector('.lane-name').removeAttribute('aria-expanded');});layout();});
reduced.addEventListener('change',restart);document.addEventListener('visibilitychange',()=>{tick();restart();});
sections[expanded].classList.add('expanded');
sections.forEach((s,i)=>{if(phone.matches)s.querySelector('.lane-name').setAttribute('aria-expanded',i===expanded);});
if(selected>=0)choose(selected);
setAccent(Object.hasOwn(colors,params.get('accent'))?params.get('accent'):'green');
if(location.hash)navigate(location.hash.slice(1));
restart();
