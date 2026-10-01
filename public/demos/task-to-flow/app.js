// Task-to-Flow — chat-style UI wiring. Imports the deterministic engine.
import { PATTERNS, matchPattern, hoursPerMonth } from "./engine.js";
import {
  createResultId, createResultRecord, saveResult, loadResult,
  parseJourneyHash, resultHash, implementationHash, fullPageUrl,
  contextFromSearch, resultMarkdown,
} from "./journey-state.js";

const thread = document.getElementById("thread");
const form = document.getElementById("ask-form");
const input = document.getElementById("ask-input");
const chipsEl = document.getElementById("chips");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const context = contextFromSearch(location.search);
let memoryResult = null;
let storageAvailable = true;
let activeResult = null;

function cacheResult(record) {
  memoryResult = record;
  try { storageAvailable = saveResult(sessionStorage, record) && storageAvailable; }
  catch { storageAvailable = false; }
}

function findResult(id) {
  if (memoryResult?.id === id) return memoryResult;
  try { return loadResult(sessionStorage, id); }
  catch { storageAvailable = false; return null; }
}

// Sample chips from pattern samples.
for (const p of PATTERNS) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip";
  chip.textContent = p.chip;
  chip.addEventListener("click", () => run(p.sample));
  chipsEl.appendChild(chip);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) { run(text); }
});

function addUserBubble(text) {
  const node = document.getElementById("tpl-user-bubble").content.cloneNode(true);
  node.querySelector(".bubble").textContent = text;
  return node;
}

function addAssistantBubble(matchedPattern, isFallback, record) {
  const tpl = document.getElementById("tpl-assistant");
  const node = tpl.content.cloneNode(true);
  const bubble = node.querySelector(".bubble-bot");

  const confirm = node.querySelector(".confirm");
  confirm.textContent = isFallback
    ? `I don't know that exact task yet — but the closest thing I see is: ${matchedPattern.title.toLowerCase()}. Here's what that flow looks like:`
    : `I see a ${matchedPattern.title.split("→")[0].trim().toLowerCase()} flow. Here's how it could work:`;

  // Build flow steps (staggered).
  const flow = node.querySelector(".flow");
  matchedPattern.steps.forEach((step, i) => {
    const li = document.createElement("li");
    li.innerHTML =
      `<span class="step-icon" aria-hidden="true"></span>` +
      `<span class="step-label"></span>` +
      `<span class="step-num">Step ${i + 1} of ${matchedPattern.steps.length}</span>`;
    li.querySelector(".step-icon").textContent = step.icon;
    li.querySelector(".step-label").textContent = step.label;
    flow.appendChild(li);
  });

  // Savings counter + assumption sliders (user-driven numbers only).
  const hoursEl = node.querySelector(".hours");
  const sliderDay = node.querySelector(".slider-day");
  const sliderMin = node.querySelector(".slider-min");
  const outDay = node.querySelector(".out-day");
  const outMin = node.querySelector(".out-min");

  function updateHours(animate = true) {
    const target = Math.round(hoursPerMonth(+sliderDay.value, +sliderMin.value));
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

  function persistAssumptions() {
    const updated = createResultRecord({
      id: record.id, task: record.task, patternId: record.pattern.id,
      tasksPerDay: +sliderDay.value, minutesPerTask: +sliderMin.value,
      context: record.context,
    });
    if (updated) {
      record = updated; cacheResult(record);
      node.querySelector(".storage-note").hidden = storageAvailable;
    }
  }
  sliderDay.addEventListener("input", () => { updateHours(false); persistAssumptions(); });
  sliderMin.addEventListener("input", () => { updateHours(false); persistAssumptions(); });
  const cta = node.querySelector(".cta");
  cta.href = implementationHash(record.id);
  cta.addEventListener("click", (event) => {
    event.preventDefault();
    if (location.hash !== cta.hash) history.pushState(null, "", cta.hash);
    renderRoute();
  });
  const contact = node.querySelector(".contact-link");
  contact.href = "https://davidpapp.dev/#contact";
  node.querySelector(".storage-note").hidden = storageAvailable;
  node.querySelector(".export")?.addEventListener("click", () => downloadMarkdown(record));

  return { node, updateHours, record };
}

function downloadMarkdown(record) {
  const blob = new Blob([resultMarkdown(record)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = `task-to-flow-${record.pattern.id}.md`;
  link.click(); URL.revokeObjectURL(url);
}

function restoreBubble(record) {
  thread.replaceChildren(addUserBubble(record.task));
  const { node, updateHours } = addAssistantBubble(record.pattern, false, record);
  node.querySelectorAll(".flow li").forEach((step) => step.classList.add("visible"));
  thread.appendChild(node);
  node.querySelector(".slider-day").value = record.assumptions.tasksPerDay;
  node.querySelector(".slider-min").value = record.assumptions.minutesPerTask;
  updateHours(false);
  node.querySelector(".out-day").textContent = record.assumptions.tasksPerDay;
  node.querySelector(".out-min").textContent = record.assumptions.minutesPerTask;
  return node;
}

function renderRoute() {
  const hashRoute = parseJourneyHash(location.hash);
  const queryId = new URLSearchParams(location.search).get("result");
  const id = hashRoute?.id ?? queryId;
  if (!id) return;
  const record = findResult(id);
  if (!record) {
    if (hashRoute?.view === "implementation") {
      showImplementationMessage("This saved result is unavailable or expired. Describe the task again to create a fresh build sketch.");
    }
    return;
  }
  activeResult = record;
  let bubble = thread.querySelector(".bubble-bot");
  if (!bubble || bubble.dataset.resultId !== record.id) bubble = restoreBubble(record);
  bubble.dataset.resultId = record.id;
  if (hashRoute?.view === "implementation" || (queryId && !hashRoute)) {
    showImplementation(record, bubble);
    notifyParent(record.id);
  } else {
    bubble.querySelector(".implementation")?.remove();
    scrollBottom();
  }
}

function showImplementationMessage(message) {
  const existing = thread.querySelector(".implementation");
  if (existing) existing.remove();
  const section = document.createElement("section");
  section.className = "implementation";
  section.tabIndex = -1;
  section.innerHTML = `<p class="implementation-status"></p>`;
  section.querySelector(".implementation-status").textContent = message;
  thread.appendChild(section);
  section.focus();
}

function showImplementation(record, bubble) {
  let section = bubble.querySelector(".implementation");
  if (section) section.remove();
  section = document.createElement("section");
  section.className = "implementation";
  section.id = "implementation";
  section.tabIndex = -1;
  const plan = record.pattern.implementation;
  const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  section.innerHTML = `<a class="back-to-result" href="${resultHash(record.id)}">← Back to your flow</a>
    <h2>Build sketch: ${escapeHtml(record.pattern.title)}</h2>
    <p class="pattern-explanation"></p>
    <p class="task-summary"></p>
    <p class="assumption-summary"></p>
    <p class="illustrative-warning">Illustrative design only. This demo has not executed the workflow, connected services, created records, sent messages, or deployed automation.</p>
    <h3>Trigger</h3><p class="trigger"></p>
    <h3>Input schema</h3><div class="inputs"></div>
    <h3>Processing steps</h3><div class="actions"></div>
    <h3>Validation and error handling</h3><div class="validation"></div>
    <h3>Human handoff</h3><p class="handoff"></p>
    <h3>Expected outputs</h3><div class="outputs"></div>
    <h3>Acceptance checks</h3><div class="checks"></div>
    <div class="implementation-actions"><a class="full-page">Open this result full page</a><button type="button" class="export">Download build sketch (.md)</button><a class="contact-link" href="https://davidpapp.dev/#contact">Discuss a real implementation</a></div>`;
  section.querySelector(".pattern-explanation").textContent = record.pattern.explanation;
  section.querySelector(".task-summary").textContent = `Task: ${record.task}`;
  section.querySelector(".assumption-summary").textContent = `Assumptions: ${record.assumptions.tasksPerDay} tasks/day × ${record.assumptions.minutesPerTask} minutes/task ≈ ${record.estimatedHoursPerMonth} hours/month over 22 working days. This is not a measured result.`;
  section.querySelector(".trigger").textContent = plan.trigger;
  section.querySelector(".inputs").innerHTML = list(plan.inputs);
  section.querySelector(".actions").innerHTML = list(plan.actions);
  section.querySelector(".validation").innerHTML = list(plan.validation);
  section.querySelector(".handoff").textContent = plan.handoff;
  section.querySelector(".outputs").innerHTML = list(plan.outputs);
  section.querySelector(".checks").innerHTML = list(plan.tests);
  const fullPageLink = section.querySelector(".full-page");
  fullPageLink.href = fullPageUrl(location.href, record.id, record.context);
  fullPageLink.target = "_top";
  fullPageLink.hidden = !storageAvailable;
  section.querySelector(".export").addEventListener("click", () => downloadMarkdown(record));
  section.querySelector(".back-to-result").addEventListener("click", (event) => {
    event.preventDefault(); history.pushState(null, "", resultHash(record.id)); renderRoute();
  });
  bubble.appendChild(section);
  section.focus();
  section.scrollIntoView({ block: "start", behavior: reducedMotion ? "auto" : "smooth" });
}

function notifyParent(id) {
  if (window.parent === window) return;
  window.parent.postMessage({ type: "task-to-flow-result", resultId: id }, location.origin);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
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

  const record = createResultRecord({
    id: createResultId(), task: text, patternId: match.pattern.id,
    tasksPerDay: 10, minutesPerTask: 15, context,
  });
  cacheResult(record);
  const { node, updateHours } = addAssistantBubble(match.pattern, isFallback, record);
  thread.appendChild(node);
  node.querySelector(".bubble-bot").dataset.resultId = record.id;
  history.replaceState(null, "", resultHash(record.id));
  scrollBottom();

  if (reducedMotion) { updateHours(); return; }

  // Stagger step reveal (~2s total), then animate the savings counter.
  const steps = node.querySelectorAll(".flow li");
  steps.forEach((li, i) => setTimeout(() => { li.classList.add("visible"); scrollBottom(); }, 150 + i * 320));
  setTimeout(() => updateHours(), 150 + steps.length * 320 + 200);
}

window.addEventListener("hashchange", renderRoute);
window.addEventListener("popstate", renderRoute);
renderRoute();
