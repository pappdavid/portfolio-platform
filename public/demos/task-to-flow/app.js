// Task-to-Flow — chat-style UI wiring. Imports the deterministic engine.
import { PATTERNS, matchPattern, hoursPerMonth } from './engine.js';

const thread = document.getElementById('thread');
const form = document.getElementById('ask-form');
const input = document.getElementById('ask-input');
const chipsEl = document.getElementById('chips');
const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const CTA_URL = 'https://davidpapp.dev';

// Sample chips from pattern samples.
for (const p of PATTERNS) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip';
  chip.textContent = p.chip;
  chip.addEventListener('click', () => run(p.sample));
  chipsEl.appendChild(chip);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    run(text);
  }
});

function addUserBubble(text) {
  const node = document
    .getElementById('tpl-user-bubble')
    .content.cloneNode(true);
  node.querySelector('.bubble').textContent = text;
  return node;
}

function addAssistantBubble(matchedPattern, isFallback) {
  const tpl = document.getElementById('tpl-assistant');
  const node = tpl.content.cloneNode(true);
  const bubble = node.querySelector('.bubble-bot');

  const confirm = node.querySelector('.confirm');
  confirm.textContent = isFallback
    ? `I don't know that exact task yet — but the closest thing I see is: ${matchedPattern.title.toLowerCase()}. Here's what that flow looks like:`
    : `I see a ${matchedPattern.title.split('→')[0].trim().toLowerCase()} flow. Here's how it could work:`;

  // Build flow steps (staggered).
  const flow = node.querySelector('.flow');
  matchedPattern.steps.forEach((step, i) => {
    const li = document.createElement('li');
    li.innerHTML =
      `<span class="step-icon" aria-hidden="true"></span>` +
      `<span class="step-label"></span>` +
      `<span class="step-num">Step ${i + 1} of ${matchedPattern.steps.length}</span>`;
    li.querySelector('.step-icon').textContent = step.icon;
    li.querySelector('.step-label').textContent = step.label;
    flow.appendChild(li);
  });

  // Savings counter + assumption sliders (user-driven numbers only).
  const hoursEl = node.querySelector('.hours');
  const sliderDay = node.querySelector('.slider-day');
  const sliderMin = node.querySelector('.slider-min');
  const outDay = node.querySelector('.out-day');
  const outMin = node.querySelector('.out-min');

  function updateHours(animate = true) {
    const target = Math.round(
      hoursPerMonth(+sliderDay.value, +sliderMin.value)
    );
    outDay.textContent = sliderDay.value;
    outMin.textContent = sliderMin.value;
    if (!animate || reducedMotion) {
      hoursEl.textContent = target;
      return;
    }
    // Animate count up over ~700ms.
    const start = performance.now();
    const from = parseInt(hoursEl.textContent, 10) || 0;
    function tick(now) {
      const t = Math.min((now - start) / 700, 1);
      hoursEl.textContent = Math.round(from + (target - from) * t);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  sliderDay.addEventListener('input', () => updateHours(false));
  sliderMin.addEventListener('input', () => updateHours(false));
  node.querySelector('.cta').href = CTA_URL;

  return { node, updateHours };
}

function scrollBottom() {
  thread.scrollTop = thread.scrollHeight;
}

async function run(text) {
  form.reset();
  thread.appendChild(addUserBubble(text));

  const match = matchPattern(text);
  // Fallback framing when nothing meaningful hit (score 0 or 1 weak keyword).
  const isFallback = match.score === 0;

  // Brief "thinking" pause for story feel (skipped under reduced motion).
  await new Promise((r) => setTimeout(r, reducedMotion ? 0 : 500));

  const { node, updateHours } = addAssistantBubble(match.pattern, isFallback);
  thread.appendChild(node);
  scrollBottom();

  if (reducedMotion) {
    updateHours();
    return;
  }

  // Stagger step reveal (~2s total), then animate the savings counter.
  const steps = node.querySelectorAll('.flow li');
  steps.forEach((li, i) =>
    setTimeout(
      () => {
        li.classList.add('visible');
        scrollBottom();
      },
      150 + i * 320
    )
  );
  setTimeout(() => updateHours(), 150 + steps.length * 320 + 200);
}
