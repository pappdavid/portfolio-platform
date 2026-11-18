import {
  systems,
  contacts,
  runs,
  beatPosition,
  total,
  start,
  clamp,
  stateAt,
} from './systems.js';
import { mount } from './stage.js';
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const chapters = ['opening', ...systems.map((s) => s.id), 'index'];
const colors = {
  green: '#00ff88',
  cyan: '#00f0ff',
  amber: '#ffb700',
  pink: '#ff007f',
};
const query = new URLSearchParams(location.search),
  motion = matchMedia('(prefers-reduced-motion: reduce)');
const projectIcons = [
  '<path d="m3 11 12-7 13 7-13 7z M3 16l12 7 13-7 M3 21l12 7 13-7"/><path d="m9 11 6-3 6 3-6 3z"/>',
  '<ellipse cx="15" cy="12" rx="12" ry="7"/><ellipse cx="15" cy="12" rx="6" ry="3.5"/><path d="M3 12v8c0 4 5 7 12 7s12-3 12-7v-8 M3 16c0 4 5 7 12 7s12-3 12-7"/>',
  '<path d="m1 14 6-3 6 3-6 4z M1 14v8l6 4 6-4v-8 M7 18v8 M18 8l6-3 6 3-6 4z M18 8v8l6 4 6-4V8 M24 12v8 M13 20l5-3 M9 11l9-5"/>',
];
const icon = (i) =>
  '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.15" aria-hidden="true">' +
  projectIcons[i] +
  '</svg>';
const contactLinks = contacts
  .map(([n, url]) => '<a href="' + url + '">' + n + ' ↗</a>')
  .join('');
const actions =
  '<div class="actions"><a class="primary" href="/cv.pdf">Résumé ↗</a><a class="secondary" href="#client-studio">Projects ↓</a><button class="secondary" data-contact>Contact ↗</button></div>';
const partHeader = (s) => '<div class="section-id">' + s + '</div>';
const opening =
  partHeader('System tour / Opening') +
  '<div class="prompt">david@dev:~$ <b>whoami</b></div><h1>David <span class="lname">Papp<span class="cursor"></span></span></h1><p class="job">AI solution developer</p><div class="availability"><i class="lamp"></i>Open to full-time work <em>Rotterdam, NL</em></div><p class="roles"><small>Target roles</small> AI engineering, backend and data</p>' +
  actions;
$('#copy').innerHTML = opening;
function links(a) {
  return (
    '<div class="links"><a href="' +
    a.demo +
    '">Demo ↗</a>' +
    (a.source ? '<a href="' + a.source + '">Source ↗</a>' : '') +
    '</div>'
  );
}
function spec(a) {
  return (
    '<dl class="spec">' +
    [
      ['Stack', a.stack],
      ['Proof', a.proof],
      ['Scope', a.scope],
    ]
      .map(([k, v]) => '<div><dt>' + k + '</dt><dd>' + v + '</dd></div>')
      .join('') +
    '</dl>'
  );
}
function establish(a) {
  return (
    partHeader('System ' + a.plate + ' / Assembly') +
    '<h2>' +
    a.id +
    '</h2><p class="description">' +
    a.desc +
    '</p>' +
    spec(a) +
    links(a)
  );
}
function evidence(a, b, count) {
  const [, , label, lines] = a.beats[b - 1];
  return (
    '<div class="record"><div class="record-heading">' +
    (a.id === 'faultline' ? 'Engine trace · fictional' : 'Fictional sample') +
    ' / ' +
    label +
    '</div>' +
    lines
      .slice(0, count)
      .map((l) => '<p>' + l + '</p>')
      .join('') +
    '</div>'
  );
}
function beat(a, b, count, reader = false) {
  const [caption, tech] = a.beats[b - 1];
  return (
    partHeader(a.plate + ' / ' + a.id + '　·　' + b + ' of 5') +
    '<' +
    (reader ? 'h3' : 'h2') +
    '>' +
    caption +
    '</' +
    (reader ? 'h3' : 'h2') +
    '><p class="technical">' +
    tech +
    '</p>' +
    evidence(a, b, count) +
    (reader
      ? ''
      : '<nav class="beat-nav" aria-label="System beats">' +
        a.beats
          .map(
            (_, i) =>
              '<a class="' +
              (i + 1 === b ? 'selected' : '') +
              '" href="#' +
              a.id +
              '-' +
              (i + 1) +
              '" aria-label="Beat ' +
              (i + 1) +
              '">' +
              (i + 1) +
              '</a>',
          )
          .join('') +
        '<a class="spec-link" href="#' +
        a.id +
        '">Spec ↗</a></nav>')
  );
}
const index =
  partHeader('System tour / Index') +
  '<div class="prompt">david@dev:~$</div><h2>ps --featured</h2><div class="index-links">' +
  systems
    .map(
      (a) =>
        '<div><b>' +
        a.id +
        '</b><a href="' +
        a.demo +
        '">Demo ↗</a>' +
        (a.source ? '<a href="' + a.source + '">Source ↗</a>' : '') +
        '</div>',
    )
    .join('') +
  '</div><div class="actions"><a class="primary" href="/cv.pdf">Résumé ↗</a><button data-contact>Contact ↗</button></div><div class="links">' +
  contactLinks +
  '</div>';
const closing =
  partHeader('System tour / Closing') +
  '<h2>Three systems,<br>in working order.</h2><p class="technical">Grounded answers, timely references, and a receiver that remembers each booking.</p><div class="links"><a href="#index">Open project index ↓</a></div>';
const stops = new Map([
  ['opening', 0],
  ['index', total],
]);
systems.forEach((a, i) => {
  stops.set(a.id, beatPosition(i, 0));
  a.beats.forEach((_, b) =>
    stops.set(a.id + '-' + (b + 1), beatPosition(i, b + 1)),
  );
});
$('#anchors').innerHTML = [...stops]
  .map(([name, s]) => '<i id="' + name + '" style="top:' + s * 100 + 'vh"></i>')
  .join('');
$('#rail').innerHTML = chapters
  .map(
    (c, i) =>
      '<a href="#' +
      c +
      '" aria-label="' +
      c +
      '"><span class="rail-code">' +
      ['00', '01', '02', '03', '↳'][i] +
      '</span><span class="rail-name">' +
      (i === 0 ? 'Opening' : i === 4 ? 'Index' : c) +
      '</span>' +
      (i > 0 && i < 4
        ? '<span class="tickset">' + '<i></i>'.repeat(5) + '</span>'
        : '') +
      '</a>',
  )
  .join('');
$('.project-list').innerHTML = systems
  .map(
    (a, i) =>
      '<a class="project-item" href="#' +
      a.id +
      '">' +
      icon(i) +
      '<div><b>' +
      a.id +
      '</b><small>' +
      a.kind +
      '</small></div><em>↗</em></a>',
  )
  .join('');
let stage,
  reader = false,
  p = 0,
  velocity = 0,
  last = 0,
  age = 0,
  lastKey = '',
  lastU = -10,
  raf = 0,
  dirty = true;
function accent(name) {
  if (!Object.hasOwn(colors, name)) return;
  document.documentElement.dataset.accent = name;
  document.documentElement.style.setProperty('--accent', colors[name]);
  stage?.accent(colors[name].slice(1));
  $$('.accents button').forEach((e) =>
    e.setAttribute('aria-pressed', e.dataset.color === name),
  );
  dirty = true;
}
for (const [name, hex] of Object.entries(colors)) {
  const b = document.createElement('button');
  b.setAttribute('aria-label', name + ' accent');
  b.style.setProperty('--swatch', hex);
  b.dataset.color = name;
  b.onclick = () => accent(name);
  $('.accents').append(b);
}
const dialog = $('#dialog');
function showDialog(type) {
  $('#dialog-body').innerHTML =
    type === 'contact'
      ? '<h2>Contact David</h2>' + contactLinks
      : '<h2>Command reference</h2><p>open client-studio<br>open active-companion<br>open faultline<br>ps · cv · contact<br>accent green | cyan | amber | pink<br>help</p><p>Keys 1–3 open a system.</p>';
  if (!dialog.open) dialog.showModal();
}
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-contact]')) showDialog('contact');
  if (e.target === dialog) dialog.close();
});
$('#help').onclick = () => showDialog('help');
function go(id) {
  if (stops.has(id)) {
    location.hash = id;
    document.getElementById(id)?.scrollIntoView();
  }
}
$('#terminal').onsubmit = (e) => {
  e.preventDefault();
  const cmd = $('#cmd').value.trim().toLowerCase();
  $('#cmd').value = '';
  $('#reply').textContent = '';
  if (cmd === 'ps') go('index');
  else if (cmd === 'cv') location.assign('/cv.pdf');
  else if (cmd === 'contact' || cmd === 'help') showDialog(cmd);
  else if (cmd.startsWith('open ') && chapters.includes(cmd.slice(5)))
    go(cmd.slice(5));
  else if (cmd.startsWith('accent ') && colors[cmd.slice(7)])
    accent(cmd.slice(7));
  else $('#reply').textContent = 'Unknown command. Try help.';
};
document.addEventListener('keydown', (e) => {
  if (
    e.altKey ||
    e.ctrlKey ||
    e.metaKey ||
    e.target.matches('input,textarea') ||
    dialog.open
  )
    return;
  if (/^[1-3]$/.test(e.key)) go(systems[Number(e.key) - 1].id);
  if (e.key === '?') showDialog('help');
});
function readerPage() {
  reader = true;
  document.body.classList.add('reader-mode');
  $('#anchors').innerHTML = '';
  const still = (file, alt) =>
    '<img src="./assets/stills/' + file + '.webp" alt="' + alt + '">';
  $('#reader').innerHTML =
    '<section class="read-section" id="opening"><div class="read-opening"><div>' +
    opening +
    '<div class="links"><a href="#index">Skip the tour ↓</a></div></div>' +
    still('opening', 'Sliced DAVID die on its machined carrier') +
    '</div></section>' +
    systems
      .map(
        (a) =>
          '<section class="read-section" id="' +
          a.id +
          '"><div class="read-establish"><div>' +
          establish(a) +
          '</div>' +
          still(a.id + '-0', 'Assembled ' + a.id + ' mechanism') +
          '</div>' +
          a.beats
            .map(
              (q, b) =>
                '<article class="read-beat" id="' +
                a.id +
                '-' +
                (b + 1) +
                '"><div>' +
                beat(a, b + 1, undefined, true) +
                '</div>' +
                still(
                  a.id + '-' + (b + 1),
                  a.parts[b] + ' layer in the cutaway',
                ) +
                '</article>',
            )
            .join('') +
          '</section>',
      )
      .join('') +
    '<section class="read-section" id="index">' +
    index +
    '</section>';
}
function paint(s, intro = 1, force = false) {
  if (reader) return;
  const { i, b, t } = stateAt(s),
    isIndex = i === 3 && t >= 0.64,
    stream = i === 1 && b === 1 && (t - 0.14) / 0.15 < 0.36 ? 1 : undefined;
  const key = i + '-' + b + '-' + isIndex + '-' + stream;
  if (key !== lastKey) {
    lastKey = key;
    const a = systems[i];
    $('#copy').innerHTML =
      i === -1
        ? opening
        : i === 3
          ? isIndex
            ? index
            : closing
          : b === 0
            ? establish(a)
            : beat(a, b, stream);
    $('#fig-id').textContent =
      'FIG. ' + (i === -1 ? 'A' : i === 3 ? 'E' : String.fromCharCode(66 + i));
    $('#fig-name').textContent =
      i === -1
        ? 'Identity assembly'
        : i === 3
          ? 'Assembly register'
          : ['Source cassette', 'Transcript register', 'Booking receiver'][i];
    $('#view-label').textContent =
      i === -1
        ? 'Section / identity'
        : i === 3
          ? 'Plan / featured systems'
          : 'Section / ' + a.id;
    $('#view-state').textContent =
      i === -1
        ? 'Assembled'
        : i === 3
          ? 'Wide view'
          : b === 0
            ? 'Assembled'
            : 'Exploded view';
    $('#skip').textContent = isIndex ? 'Back to opening ↑' : 'Skip the tour ↓';
    $('#skip').href = isIndex ? '#opening' : '#index';
    $$('#rail a').forEach((el, j) => {
      el.classList.toggle('active', j === i + 1);
      if (j === i + 1) el.setAttribute('aria-current', 'step');
      else el.removeAttribute('aria-current');
      el.querySelectorAll('.tickset i').forEach((tick, n) =>
        tick.classList.toggle('on', j === i + 1 && n < b),
      );
    });
    $$('.project-item').forEach((el, j) =>
      el.classList.toggle('current', i === j),
    );
  }
  if (force || dirty || Math.abs(lastU - s) > 0.000015 || intro < 1) {
    stage.draw(s, intro);
    lastU = s;
    dirty = false;
  }
}
const navEntry = performance.getEntriesByType('navigation')[0];
$('#rev').textContent = document.querySelector(
  'meta[name="portfolio:commit"]',
).content;
$('#ttfb').textContent = navEntry
  ? navEntry.responseStart.toFixed(1) + ' ms'
  : '—';
const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Amsterdam',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});
function clock() {
  $('#clock').textContent = fmt.format(new Date());
}
clock();
let clockID = setInterval(clock, 1000);
const maxScroll = () =>
  Math.max(1, document.documentElement.scrollHeight - innerHeight);
function settle(progress, intro = 1) {
  p = clamp(progress) * total;
  velocity = 0;
  window.scrollTo(0, clamp(progress) * maxScroll());
  age = 2;
  paint(p, intro, true);
}
let samples = 0,
  sampleTime = 0,
  locked = false;
function tick(now) {
  const elapsed = last ? (now - last) / 1000 : 0,
    dt = Math.min(0.08, elapsed);
  last = now;
  if (!locked && !reader) {
    const target = (scrollY / maxScroll()) * total;
    const diff = p - target,
      w = 13,
      k = Math.exp(-w * dt),
      v = velocity + w * diff;
    p = target + (diff + v * dt) * k;
    velocity = (velocity - w * v * dt) * k;
    const was = age;
    age += dt;
    paint(p, clamp(age / 1.85), was < 1.85 && age >= 1.85);
  }
  if (elapsed > 0) {
    samples++;
    sampleTime += elapsed;
    if (sampleTime >= 0.65) {
      $('#frame').textContent =
        ((1000 * sampleTime) / samples).toFixed(1) + ' ms';
      samples = 0;
      sampleTime = 0;
    }
  }
  raf = requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(raf);
    clearInterval(clockID);
  } else {
    last = 0;
    clock();
    clockID = setInterval(clock, 1000);
    raf = requestAnimationFrame(tick);
  }
});
window.addEventListener('resize', () => (dirty = true));
motion.addEventListener('change', () => location.reload());
function initial() {
  if (query.has('act')) {
    const i = systems.findIndex((a) => a.id === query.get('act'));
    if (i >= 0)
      return (
        beatPosition(
          i,
          Math.floor(clamp(Number(query.get('beat')) || 0, 0, 5)),
        ) / total
      );
  }
  if (query.has('p')) return clamp(Number(query.get('p')) || 0);
  return null;
}
if (motion.matches) readerPage();
else {
  try {
    stage = mount($('#stage'), $('.tags'));
  } catch {
    readerPage();
  }
}
accent(
  Object.hasOwn(colors, query.get('accent')) ? query.get('accent') : 'green',
);
await document.fonts.ready;
const progress = initial();
if (reader) {
  if (progress !== null) {
    const { i, b } = stateAt(progress * total);
    document
      .getElementById(
        i === -1
          ? 'opening'
          : i === 3
            ? 'index'
            : systems[i].id + (b ? '-' + b : ''),
      )
      ?.scrollIntoView();
  } else if (location.hash)
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
} else if (progress !== null) settle(progress);
else {
  p = (scrollY / maxScroll()) * total;
  paint(p, 0, true);
}
// Capture uses exactly the scroll drawing, bypassing only the spring and wall clock.
window.tour = {
  ready: true,
  reader,
  seek(q, intro = 1) {
    locked = true;
    settle(q, intro);
  },
  release() {
    locked = false;
  },
  accent,
  progressFor: (a, b) => beatPosition(a, b) / total,
  still() {
    stage.draw(p, 1, true);
    return $('#stage').toDataURL('image/webp', 0.92);
  },
  renderer: () => {
    const gl = stage.renderer.getContext(),
      ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext
      ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER);
  },
};
raf = requestAnimationFrame(tick);
