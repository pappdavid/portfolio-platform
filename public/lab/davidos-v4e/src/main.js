import { stops, colors, figures, mountChapters } from './content.js';
import { createLoom } from './loom.js';
mountChapters();
const $ = (s) => document.querySelector(s),
  all = (s) => [...document.querySelectorAll(s)];
const journey = $('.journey'),
  sections = all('.stop'),
  canvas = $('canvas'),
  plate = $('.plate');
const query = new URLSearchParams(location.search),
  capture =
    query.has('capture') && Number.isFinite(+query.get('capture'))
      ? Math.max(0, +query.get('capture'))
      : null;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const input = $('#cmd'),
  menu = $('#commands'),
  help = $('.help');
let current = -1,
  position = 0,
  starts = [],
  activeSkills = false,
  lastStep = -1,
  phase = 0,
  time = 0,
  rgb,
  dirty = true;
let previous = 0,
  priorPosition = 0,
  velocity = 0,
  raf = 0,
  quality = 0,
  frameSum = 0,
  frameCount = 0,
  slow = 0;
let pointer = [0, 0],
  paint;
try {
  paint = createLoom(canvas);
} catch (error) {
  console.warn('Strand rendering unavailable', error);
}
const fallback = $('.fallback');
function noCanvas() {
  paint = null;
  fallback.hidden = false;
  canvas.hidden = true;
  dirty = true;
  request();
}
if (!paint) noCanvas();
canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  noCanvas();
});
function accent(name) {
  if (!Object.hasOwn(colors, name)) return;
  const hex = colors[name];
  document.documentElement.style.setProperty('--accent', hex);
  all('[data-color]').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.color === name)),
  );
  rgb = [1, 3, 5].map((n) => parseInt(hex.slice(n, n + 2), 16) / 255);
  dirty = true;
  request();
}
all('[data-color]').forEach((b) => (b.onclick = () => accent(b.dataset.color)));
accent(
  Object.hasOwn(colors, query.get('accent')) ? query.get('accent') : 'green',
);
function measure() {
  const top = journey.getBoundingClientRect().top;
  const band = matchMedia('(max-width:740px)').matches ? plate.offsetHeight : 0;
  starts = sections.map((el) =>
    Math.max(
      0,
      el.getBoundingClientRect().top - top + journey.scrollTop - band,
    ),
  );
}
function tabState() {
  const tab = activeSkills
    ? '#skills'
    : current === 0
      ? '#who'
      : current === 4
        ? '#contact'
        : '#client-studio';
  all('.tabs a').forEach((a) => {
    if (a.hash === tab) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}
function selectChapter() {
  const top = journey.scrollTop;
  let base = 0;
  while (base < 4 && top >= starts[base + 1]) base++;
  position =
    base === 4
      ? 4
      : base +
        clamp((top - starts[base]) / (starts[base + 1] - starts[base]), 0, 1);
  const index = Math.round(position);
  if (index !== current) {
    current = index;
    lastStep = -1;
    phase = reduced.matches ? (figures[index].captions.length - 1) * PERIOD : 0;
    activeSkills = false;
    $('#fig-letter').textContent = String.fromCharCode(65 + index);
    $('#plate-title').textContent = figures[index].title;
    const rail = all('.rail a');
    rail.forEach((a, i) => {
      if (index === i) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
    const steps = $('.steps');
    steps.replaceChildren();
    if (figures[index].captions.length > 1)
      figures[index].captions.forEach((label, i) => {
        const b = document.createElement('button');
        b.textContent = i + 1;
        b.setAttribute('aria-label', `Step ${i + 1}. ${label}`);
        b.onclick = () => {
          phase = i * PERIOD;
          dirty = true;
          request();
        };
        steps.append(b);
      });
    const legend = $('.legend-row');
    legend.replaceChildren();
    legend.hidden = !figures[index].legend;
    for (const label of figures[index].legend ?? []) {
      const span = document.createElement('span');
      span.textContent = label;
      legend.append(span);
    }
    fallback.textContent = index === 0 ? 'DAVID' : figures[index].title;
    tabState();
  }
  dirty = true;
  request();
}
function go(id, focus = true, instant = false) {
  const skills = id === 'skills',
    i = skills ? 0 : stops.indexOf(id);
  if (i < 0) return;
  journey.scrollTo({
    top: starts[i],
    behavior:
      instant || reduced.matches || capture !== null ? 'instant' : 'smooth',
  });
  activeSkills = skills;
  tabState();
  if (focus)
    (skills ? $('#skills') : sections[i].querySelector('h1,h2')).focus({
      preventScroll: true,
    });
  if (skills) {
    activeSkills = true;
  }
}
let navigatingSkills = false;
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (
    !a ||
    a.classList.contains('skip') ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  )
    return;
  const id = a.hash.slice(1);
  if (!stops.includes(id) && id !== 'skills') return;
  e.preventDefault();
  navigatingSkills = id === 'skills';
  go(id);
  history.replaceState(null, '', '#' + id);
});
all('.rail a').forEach((a, i) => {
  const visit = () => {
    if (i >= 1 && i <= 3) {
      navigatingSkills = false;
      go(stops[i], false, true);
    }
  };
  a.addEventListener('focus', visit);
  a.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') visit();
  });
});
journey.addEventListener(
  'scroll',
  () => {
    selectChapter();
    if (navigatingSkills && current === 0) {
      activeSkills = true;
      tabState();
    }
  },
  { passive: true },
);
journey.addEventListener(
  'wheel',
  () => {
    navigatingSkills = false;
  },
  { passive: true },
);
canvas.addEventListener('pointermove', (e) => {
  if (capture !== null || reduced.matches) return;
  const r = canvas.getBoundingClientRect();
  pointer = [
    (2 * (e.clientX - r.left)) / r.width - 1,
    1 - (2 * (e.clientY - r.top)) / r.height,
  ];
});
canvas.addEventListener('pointerleave', () => {
  pointer = [0, 0];
});
const commands = [
  'open client-studio',
  'open active-companion',
  'open faultline',
  'ps',
  'accent green',
  'accent cyan',
  'accent amber',
  'accent pink',
  'cv',
  'contact',
  'help',
];
function setMenu(open) {
  menu.hidden = !open;
  help.setAttribute('aria-expanded', String(open));
}
function run(raw) {
  const cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!commands.includes(cmd)) {
    input.setCustomValidity('Choose a command from the index.');
    input.reportValidity();
    return;
  }
  input.setCustomValidity('');
  setMenu(cmd === 'help');
  if (cmd.startsWith('accent ')) accent(cmd.slice(7));
  else if (cmd === 'cv') location.assign('/cv.pdf');
  else if (cmd !== 'help')
    go(
      cmd === 'ps'
        ? 'client-studio'
        : cmd === 'contact'
          ? 'contact'
          : cmd.slice(5),
    );
  input.value = '';
  $('#completion').textContent = '';
  $('#message').textContent = `Executed ${cmd}`;
}
for (const c of commands) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = c;
  b.onclick = () => {
    input.focus();
    run(c);
  };
  $('#command-list').append(b);
}
help.onclick = () => setMenu(menu.hidden);
$('.menu-title button').onclick = () => {
  setMenu(false);
  help.focus();
};
document.addEventListener('pointerdown', (e) => {
  if (!e.target.closest('.terminal')) setMenu(false);
});
$('.terminal').addEventListener('submit', (e) => {
  e.preventDefault();
  run(input.value);
});
const completion = () =>
  commands.find(
    (c) =>
      input.value.trim() &&
      c.startsWith(input.value.toLowerCase()) &&
      c !== input.value,
  );
input.addEventListener('input', () => {
  input.setCustomValidity('');
  const c = completion();
  $('#completion').textContent = c ? `Tab → ${c}` : '';
});
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
  if (e.key === 'Escape') {
    setMenu(false);
    if (menu.contains(document.activeElement)) help.focus();
    return;
  }
  if (e.target === input) {
    if (e.key === 'Tab' && !e.shiftKey && completion()) {
      e.preventDefault();
      input.value = completion();
      $('#completion').textContent = '';
    }
    return;
  }
  if (e.key === '?') {
    e.preventDefault();
    setMenu(menu.hidden);
    if (!menu.hidden) menu.querySelector('button').focus();
    return;
  }
  if (menu.contains(e.target)) return;
  let dest;
  if (/^[123]$/.test(e.key)) dest = +e.key;
  if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key))
    dest = Math.min(4, current + 1);
  if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key))
    dest = Math.max(0, current - 1);
  if (dest !== undefined) {
    e.preventDefault();
    navigatingSkills = false;
    go(stops[dest]);
  }
});
$('#rev').textContent = $('meta[name="portfolio:commit"]').content;
const clock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Amsterdam',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});
function metrics() {
  $('time').textContent = clock.format(new Date());
  const nav = performance.getEntriesByType('navigation')[0];
  if (nav?.responseStart > 0)
    $('#ttfb').textContent =
      (nav.responseStart - nav.requestStart).toFixed(1) + ' ms';
}
metrics();
setInterval(() => {
  if (!document.hidden) metrics();
}, 1000);
const PERIOD = 2.8;
function frame(now) {
  raf = 0;
  if (document.hidden || current < 0) return;
  const still = reduced.matches || !paint,
    frozen = capture !== null || still;
  const gap = previous ? (now - previous) / 1000 : 0;
  const dt = Math.min(gap, 0.075);
  if (!frozen) {
    time += dt;
    phase += dt;
  }
  const t = capture ?? (still ? 0 : time);
  const count = figures[current].captions.length;
  const story = capture ?? phase;
  const step = Math.floor(story / PERIOD) % count,
    part = still ? 0.85 : (story / PERIOD) % 1;
  if (step !== lastStep || dirty) {
    lastStep = step;
    const key =
      current === 1
        ? step
        : current === 2
          ? [0, 2, 1][step]
          : current === 3
            ? [2, 1, 2, 0][step]
            : -1;
    all('.legend-row span').forEach((el, i) =>
      el.classList.toggle('active', i === key),
    );
    $('#notation').textContent = figures[current].label;
    $('#caption').textContent =
      (count > 1 ? `${step + 1} of ${count} · ` : '') +
      (current === 0 && (still || capture !== null)
        ? 'Block letters woven from continuous strands.'
        : figures[current].captions[step]);
    all('.steps button').forEach((b, i) =>
      b.setAttribute('aria-pressed', String(i === step)),
    );
  }
  velocity = frozen
    ? 0
    : velocity * Math.exp(-6 * dt) +
      clamp(position - priorPosition, -0.2, 0.2) * 4;
  paint?.({
    position,
    time: t,
    step,
    part,
    velocity,
    pointer,
    delta: dt,
    snap: frozen || !previous,
    accent: rgb,
    quality: frozen ? 0 : quality,
  });
  if (!frozen && gap > 0) {
    frameSum += gap;
    frameCount++;
    if (frameSum >= 0.8) {
      const ms = (1000 * frameSum) / frameCount;
      $('#frame').textContent = ms.toFixed(1) + ' ms';
      slow = ms > 24 ? slow + 1 : 0;
      if (slow >= 2) {
        quality = Math.min(2, quality + 1);
        slow = 0;
      }
      frameSum = 0;
      frameCount = 0;
    }
  } else if (frozen) $('#frame').textContent = '—';
  priorPosition = position;
  previous = now;
  dirty = false;
  if (!frozen) request();
}
function request() {
  if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
}
function place() {
  measure();
  const requested =
    query.get('stop') ?? query.get('select') ?? location.hash.slice(1);
  let i = stops.indexOf(requested);
  if (i < 0) i = 0;
  // A fractional stop exposes an exact native scroll offset for transition plates.
  const offset =
    capture !== null ? clamp(Number(query.get('between')) || 0, 0, 1) : 0;
  if (capture !== null) journey.style.scrollSnapType = 'none';
  journey.scrollTop =
    starts[i] + (starts[Math.min(4, i + 1)] - starts[i]) * offset;
  selectChapter();
  if (requested === 'skills') {
    activeSkills = true;
    tabState();
  }
}
place();
document.fonts.ready.then(place);
new ResizeObserver(() => {
  measure();
  if (capture !== null) place();
  else selectChapter();
}).observe(journey);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(raf);
    raf = 0;
  } else {
    previous = 0;
    frameSum = frameCount = 0;
    request();
  }
});
reduced.addEventListener('change', () => {
  previous = 0;
  if (reduced.matches) phase = (figures[current].captions.length - 1) * PERIOD;
  dirty = true;
  request();
});
