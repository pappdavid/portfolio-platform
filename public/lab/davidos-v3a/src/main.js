import { mountFlow } from "./flow.js";
import { scenes } from "./scenes.js";

const $ = (s) => document.querySelector(s);
const projects = [
  {
    name: "client-studio",
    line: "Answers questions with exact source excerpts.",
    runtime: "Hosted workflow",
    proof: "65 tests",
    source: "Private source",
    detail:
      "Answers come from the text you supply. An exact excerpt is lifted out for review. Approve it, then activate a frozen snapshot.",
    fact: "The hosted demo makes no AI calls.",
    sample:
      "Fictional sample · “What is the API batch limit?” → “up to 50 records” (source version 2).",
    demo: "https://client-studio-psi.vercel.app",
  },
  {
    name: "active-companion",
    line: "Turns conversations into traceable evidence cards.",
    runtime: "Scripted replay",
    proof: "18 tests in CI",
    source: "Public MIT source",
    detail:
      "Replay four fictional conversations. Lines from the transcript become evidence cards. Each card names its source and stays tied to the line it came from.",
    sample:
      "In the fictional diagram, Mira’s and Noor’s lines each feed a card that names the speaker.",
    demo: "https://active-companion-replay.vercel.app",
    repo: "https://github.com/pappdavid/active-companion",
  },
  {
    name: "faultline",
    line: "Shows what happens when a request is retried.",
    runtime: "Browser model",
    proof: "12 tests in CI",
    source: "Public MIT source",
    detail:
      "A receiver saves a receipt, but its response is lost. A naive retry creates a duplicate. Retry with the same key and the receiver returns the saved receipt.",
    demo: "https://davidpapp.dev/faultline/index.html",
    repo: "https://github.com/pappdavid/faultline",
  },
];
const colors = {
  green: "#00ff88",
  cyan: "#00f0ff",
  amber: "#ffb700",
  pink: "#ff007f",
};
const params = new URLSearchParams(location.search);
const seconds = Number(params.get("capture"));
const capture =
  params.has("capture") && Number.isFinite(seconds) && seconds >= 0
    ? seconds
    : null;
const selected = projects.findIndex((p) => p.name === params.get("select"));
let mode = selected + 1,
  tint = "green",
  field = null,
  fallback = false,
  messageTimer;
const rgb = () =>
  colors[tint]
    .slice(1)
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255);
const links = (p, primary = false) =>
  `<a ${primary ? 'class="primary"' : ""} aria-label="Open ${p.name} demo" href="${p.demo}">Demo <i aria-hidden="true">↗</i></a>${p.repo ? `<a aria-label="View ${p.name} source" href="${p.repo}">Source <i aria-hidden="true">↗</i></a>` : ""}`;
$("#rows").innerHTML = projects
  .map(
    (p, i) =>
      `<div class="row project-row" data-i="${i}"><button class="process" aria-controls="detail" aria-pressed="false"><span class="key" aria-hidden="true">[${i + 1}]</span>${p.name}</button><p class="desc">${p.line}</p><div><div class="runtime">${p.runtime}</div><div class="proof">${p.proof} · ${p.repo ? "MIT" : "Private source"}</div></div><div class="row-links">${links(p)}</div></div>`,
  )
  .join("");
// A cut through each course preserves the scan lines in the original block mark.
$(".mark").innerHTML =
  `<svg aria-hidden="true" viewBox="0 0 326 58"><defs><pattern id="courses" patternUnits="userSpaceOnUse" width="2" height="4"><path fill="currentColor" d="M0 0h2v3.5H0z"/></pattern></defs><g fill="url(#courses)" fill-rule="evenodd"><path d="M0 0h45l14 14v30L45 58H0zm15 13v32h24l5-5V18l-5-5z"/><path d="m67 58 0-44L81 0h31l14 14v44h-15V39H82v19zm15-32h29v-8l-5-5H87l-5 5z"/><path d="M133 0h17l14 41 15-41h17l-22 58h-20z"/><path d="M203 0h43v13h-14v32h14v13h-43V45h14V13h-14z"/><path d="M254 0h48l16 15v28l-16 15h-48zm15 13v32h27l7-7V20l-7-7z"/></g></svg>`;

for (const [name, color] of Object.entries(colors)) {
  const button = document.createElement("button");
  button.type = "button";
  button.style.setProperty("--swatch", color);
  button.dataset.accent = name;
  button.title = `${name[0].toUpperCase() + name.slice(1)} accent`;
  button.setAttribute("aria-label", button.title);
  button.addEventListener("click", () => setAccent(name));
  $(".palette").append(button);
}
function setAccent(name) {
  if (!Object.hasOwn(colors, name)) name = "green";
  tint = name;
  document.documentElement.style.setProperty("--accent", colors[name]);
  document
    .querySelectorAll("[data-accent]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.accent === name)),
    );
  field?.tint(rgb());
}
setAccent(params.get("accent"));
function showPanel(id) {
  for (const el of document.querySelectorAll(".inspector article"))
    el.hidden = el.id !== id;
}
function navState(id) {
  for (const a of document.querySelectorAll("nav a")) {
    if (a.hash === "#" + id) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  }
}
function diagram() {
  const scene = scenes[mode - 1],
    guides = $(".guides");
  $("#field-name").textContent = scene?.title ?? "Flow field";
  $("#field-state").textContent =
    fallback || matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "Still"
      : mode
        ? "Selected"
        : "Idle";
  $("#field-legend").textContent = scene?.legend ?? "Curl-noise advection";
  guides.replaceChildren();
  if (fallback) {
    const paths =
      scene?.paths ??
      Array.from({ length: 48 }, (_, i) => ({
        tint: i / 48,
        points: Array.from({ length: 161 }, (_, j) => {
          const a = (j / 160) * 2 * Math.PI,
            b = i / 47 - 0.5,
            r = 1 + 0.54 * b * Math.cos(1.5 * a);
          return [
            0.5 + 0.32 * r * Math.cos(a),
            0.5 +
              0.21 * r * Math.sin(a) -
              0.36 * b * Math.sin(1.5 * a) -
              0.12 * Math.sin(a * 2),
          ];
        }),
      }));
    guides.innerHTML = `<svg class="fallback-art" viewBox="0 0 1000 1000" preserveAspectRatio="none" fill="none">${paths.map((p) => `<polyline points="${p.points.map(([x, y]) => x * 1000 + "," + y * 1000).join(" ")}" stroke="${p.tint > 0.45 ? "var(--accent)" : "#949f97"}" stroke-opacity=".64" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join("")}</svg>`;
  }
  for (const item of scene?.labels ?? []) {
    const el = document.createElement("span");
    el.className = "tag" + (item.accent ? " accent" : "");
    el.style.left = item.x * 100 + "%";
    el.style.top = item.y * 100 + "%";
    el.textContent = item.text;
    guides.append(el);
  }
}
function select(i, scroll = false) {
  const p = projects[i];
  if (p) {
    if (mode !== i + 1 || !$("#detail").childElementCount) {
      $("#detail").innerHTML =
        `<div class="inspect-head"><p class="prompt"><span>david@dev:~$</span> open ${p.name}</p><button class="back" type="button" aria-label="Close project">Close ×</button></div><h2>${p.name}<span class="period">.</span></h2><p class="detail-copy">${p.detail}</p><div class="detail-facts">${p.sample ? `<p>${p.sample}</p>` : ""}${p.fact ? `<p>${p.fact}</p>` : ""}<p>${p.runtime} · ${p.proof} · ${p.source}</p></div><div class="detail-actions">${links(p, true)}</div>`;
      $(".back").onclick = () => section("home", true);
    }
    showPanel("detail");
    navState("projects");
  }
  mode = i + 1;
  document.querySelectorAll(".project-row").forEach((el, j) => {
    el.classList.toggle("selected", i === j);
    el.querySelector("button").setAttribute("aria-pressed", String(i === j));
  });
  diagram();
  field?.select(mode);
  if (scroll && matchMedia("(max-width:760px)").matches)
    $("#home").scrollIntoView({ block: "start" });
}
function section(id, focus = false) {
  if (!["home", "projects", "skills", "contact"].includes(id)) id = "home";
  select(-1);
  showPanel(id === "projects" || id === "home" ? "identity" : id);
  navState(id);
  if (focus) {
    const target =
      id === "projects"
        ? $("#projects-title")
        : $(".inspector article:not([hidden])");
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    if (id === "home") window.scrollTo(0, 0);
    else target.scrollIntoView({ block: "nearest" });
  }
}
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (
    link &&
    ["#home", "#projects", "#skills", "#contact"].includes(link.hash)
  ) {
    e.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    section(link.hash.slice(1), true);
  }
  const button = e.target.closest("[data-open]");
  if (button)
    select(
      projects.findIndex((p) => p.name === button.dataset.open),
      true,
    );
});
window.addEventListener("popstate", () =>
  section(location.hash.slice(1), true),
);
for (const el of document.querySelectorAll(".project-row")) {
  const i = Number(el.dataset.i);
  el.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse" && capture === null) select(i);
  });
  el.addEventListener("focusin", () => select(i));
  el.addEventListener("click", (e) => {
    if (!e.target.closest("a")) select(i, true);
  });
}
const cli = $("#cli"),
  menu = $("#command-menu"),
  help = $(".help");
const commands = [
  ...projects.map((p) => "open " + p.name),
  "ps",
  ...Object.keys(colors).map((c) => "accent " + c),
  "cv",
  "contact",
  "help",
];
function showMenu(open) {
  menu.hidden = !open;
  help.setAttribute("aria-expanded", String(open));
  if (open) $("#response").textContent = "";
}
function execute(value) {
  const cmd = value.trim().toLowerCase();
  cli.value = "";
  showMenu(false);
  $("#response").textContent = "";
  if (cmd === "help") {
    showMenu(true);
    $("#commands button").focus();
    return;
  }
  if (cmd === "ps" || cmd === "contact") {
    section(cmd === "ps" ? "projects" : "contact", true);
    return;
  }
  if (cmd === "cv") {
    location.assign("/cv.pdf");
    return;
  }
  if (cmd.startsWith("accent ") && Object.hasOwn(colors, cmd.slice(7))) {
    setAccent(cmd.slice(7));
    return;
  }
  const i = projects.findIndex((p) => cmd === "open " + p.name);
  if (i !== -1) {
    select(i, true);
    return;
  }
  if (cmd) {
    $("#response").textContent = "Unknown command. Open Help to see commands.";
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => ($("#response").textContent = ""), 4200);
  }
}
for (const cmd of commands) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = cmd;
  b.onclick = () => {
    cli.focus();
    execute(cmd);
  };
  $("#commands").append(b);
}
function complete() {
  const prefix = cli.value.trimStart().toLowerCase();
  const match = prefix && commands.find((c) => c.startsWith(prefix));
  if (match && cli.value !== match) {
    cli.value = match;
    return true;
  }
  return false;
}
cli.onkeydown = (e) => {
  if (e.key === "Tab" && !e.shiftKey && complete()) e.preventDefault();
};
$(".complete").onclick = () => {
  complete();
  cli.focus();
};
help.onclick = () => {
  showMenu(menu.hidden);
  if (!menu.hidden) $("#commands button").focus();
};
$("#close-menu").onclick = () => {
  showMenu(false);
  help.focus();
};
$("#command").onsubmit = (e) => {
  e.preventDefault();
  execute(cli.value);
};
document.addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
  if (e.key === "Escape") {
    if (!menu.hidden) {
      showMenu(false);
      help.focus();
    } else if (mode) section("home", true);
    return;
  }
  if (e.target.matches("input,textarea") || !menu.hidden) return;
  let i = -1;
  if (/^[1-3]$/.test(e.key)) i = Number(e.key) - 1;
  if (
    ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key) &&
    (mode || e.target.closest("#projects"))
  ) {
    i =
      mode === 0
        ? 0
        : (mode -
            1 +
            (["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1) +
            3) %
          3;
  }
  if (i >= 0) {
    e.preventDefault();
    document.querySelectorAll(".process")[i].focus({ preventScroll: true });
    select(i, true);
  }
});
$("#rev").textContent = $('meta[name="portfolio:commit"]').content;
const clock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
function tick() {
  const now = new Date();
  $("#clock").dateTime = now.toISOString();
  $("#clock").textContent = clock.format(now);
}
tick();
setInterval(tick, 1000);
const nav = performance.getEntriesByType("navigation")[0];
if (nav?.responseStart > 0)
  $("#ttfb").textContent =
    (nav.responseStart - nav.startTime).toFixed(1) + " ms";
if (selected >= 0) select(selected);
else section(location.hash.slice(1));
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
reduced.addEventListener("change", diagram);
function noGL() {
  fallback = true;
  $("#frame").textContent = "—";
  $("#field-count").textContent = "Static diagram";
  diagram();
}
try {
  field = mountFlow({
    canvas: $("canvas"),
    mode,
    accent: rgb(),
    capture,
    onFallback: noGL,
    onPhase(stage) {
      if (mode && !reduced.matches) $("#field-legend").textContent = stage;
    },
    onReadout(n, mean) {
      $("#field-count").textContent = n.toLocaleString("en-US") + " particles";
      $("#frame").textContent = mean === null ? "—" : mean.toFixed(1) + " ms";
    },
  });
} catch (error) {
  console.error(error);
  noGL();
}
