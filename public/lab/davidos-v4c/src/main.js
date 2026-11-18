import { mountField } from "./field.js";
import { projects } from "./scenes.js";

const $ = (s) => document.querySelector(s);
const colors = {
  green: "#00ff88",
  cyan: "#00f0ff",
  amber: "#ffb700",
  pink: "#ff007f",
};
const params = new URLSearchParams(location.search),
  seconds = Number(params.get("capture"));
const capture =
  params.has("capture") && Number.isFinite(seconds) && seconds >= 0
    ? seconds
    : null;
let mode = -1,
  accent = "green",
  field,
  state = "live",
  noticeTimer,
  measure = "";
const commands = [
  ...projects.map((p) => "open " + p.name),
  "ps",
  ...Object.keys(colors).map((x) => "accent " + x),
  "cv",
  "contact",
  "help",
];
const links = (p, primary = false) =>
  `<a ${primary ? 'class="primary"' : ""} href="${p.demo}" aria-label="Open ${p.name} demo">${primary ? "Open demo" : "Demo"} <b aria-hidden="true">↗</b></a>${p.repo ? `<a href="${p.repo}" aria-label="View ${p.name} source">Source <b aria-hidden="true">↗</b></a>` : ""}`;
$("#rows").innerHTML = projects
  .map(
    (p, i) =>
      `<article class="row"><h3><button class="project" type="button" aria-pressed="false" aria-controls="detail"><span class="number" aria-hidden="true">[${i + 1}]</span><span>${p.name}</span><span class="arrow" aria-hidden="true">↗</span></button></h3><p class="desc">${p.line}</p><p class="proof">${p.kind} · ${p.proof}</p><div class="links">${links(p)}</div></article>`,
  )
  .join("");
const rows = [...document.querySelectorAll(".row")],
  buttons = rows.map((el) => el.querySelector(".project"));
function setAccent(name) {
  accent = Object.hasOwn(colors, name) ? name : "green";
  const color = colors[accent];
  document.documentElement.style.setProperty("--accent", color);
  for (const b of $("#swatches").children)
    b.setAttribute("aria-pressed", String(b.dataset.color === accent));
  field?.tint(
    color
      .slice(1)
      .match(/../g)
      .map((x) => parseInt(x, 16) / 255),
  );
}
for (const [name, value] of Object.entries(colors)) {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.color = name;
  b.title = name + " accent";
  b.setAttribute("aria-label", b.title);
  b.style.setProperty("--swatch", value);
  b.onclick = () => setAccent(name);
  $("#swatches").append(b);
}

function caption(phase) {
  const still = ["still", "fallback"].includes(state);
  const label = mode < 0 ? "Glyph field" : still ? "Still frame" : "Trace";
  const copy =
    mode < 0
      ? still
        ? "Still current"
        : "Move pointer to disturb"
      : projects[mode].steps[Math.max(0, phase)];
  $("#caption").innerHTML =
    `<span class="field-label">${label}</span><span class="field-caption">${copy}</span>${mode < 0 ? '<span class="grid-measure">' + measure + "</span>" : ""}`;
}
function display(view, index = -1) {
  mode = index;
  for (const id of ["home", "detail", "aux"]) $("#" + id).hidden = id !== view;
  $("#profile").hidden = view !== "home";
  $("#facts").hidden = view !== "detail";
  $(".display").classList.toggle("detail-mode", view === "detail");
  const section =
    view === "detail"
      ? "projects"
      : view === "aux"
        ? $("#aux").dataset.section
        : "home";
  document.querySelectorAll("nav a").forEach((el) => {
    if (el.dataset.go === section) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
  rows.forEach((r, i) => {
    r.toggleAttribute("data-active", i === mode);
    buttons[i].setAttribute("aria-pressed", String(i === mode));
    r.querySelector(".arrow").textContent = i === mode ? "←" : "→";
  });
  caption(0);
  field?.setMode(mode);
}
function reveal() {
  if (matchMedia("(max-width:690px)").matches)
    $("#workspace").scrollIntoView({ block: "start" });
}
function select(i, scroll = false) {
  const p = projects[i];
  if (!p) return;
  if (mode !== i) {
    $("#detail").innerHTML =
      `<div class="prompt-line"><p class="prompt"><span>david@dev:~$</span> open ${p.name}</p><button class="back" data-go="home">Close ×</button></div><h2>${p.name}</h2><p class="expl">${p.detail}</p>`;
    $("#facts").innerHTML =
      `${p.sample ? `<p class="sample">${p.sample}</p>` : ""}${p.fact ? `<p class="sample">${p.fact}</p>` : ""}<p class="proof">${p.kind} · ${p.proof} · ${p.source}</p><div class="actions">${links(p, true)}</div>`;
    display("detail", i);
  }
  if (scroll) reveal();
}
function section(id, scroll = false) {
  if (id === "projects") select(0, scroll);
  else if (["skills", "contact"].includes(id)) {
    const contact = id === "contact";
    $("#aux").dataset.section = id;
    $("#aux").innerHTML =
      `<p class="prompt"><span>david@dev:~$</span> cat ${id}</p><h2>${contact ? "Contact" : "Skills"}</h2><p class="expl">${contact ? "Open to full-time work. Based in Rotterdam, NL." : "Target roles across AI engineering, backend and data."}</p><div class="actions">${contact ? '<a class="primary" href="https://www.linkedin.com/in/d%C3%A1vid-papp">LinkedIn <b>↗</b></a><a href="https://github.com/pappdavid">GitHub <b>↗</b></a>' : '<a class="primary" href="#projects" data-go="projects">Explore projects <b>→</b></a>'}<a href="/cv.pdf">Résumé <b>↗</b></a></div>`;
    display("aux");
    if (scroll) reveal();
  } else {
    display("home");
    if (scroll) window.scrollTo(0, 0);
  }
}
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-go]");
  if (!target || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  const id = target.dataset.go;
  history.replaceState(null, "", "#" + id);
  const closing = target.classList.contains("back");
  section(id, true);
  if (closing) document.querySelector("nav a").focus({ preventScroll: true });
});
window.addEventListener("hashchange", () =>
  section(location.hash.slice(1), true),
);
rows.forEach((row, i) => {
  row.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse" && capture === null) select(i);
  });
  row.addEventListener("focusin", (e) => {
    // Touch focus precedes click. Relayout here can move the row away from the finger.
    if (!e.sourceCapabilities?.firesTouchEvents) select(i);
  });
  row.addEventListener("click", (e) => {
    if (!e.target.closest("a")) select(i, true);
  });
});
function help(show, focus = false) {
  $("#commands").hidden = !show;
  $("#help").setAttribute("aria-expanded", String(show));
  if (focus) (show ? $("#dismiss") : $("#help")).focus();
  field?.refresh();
}
$("#help").onclick = () => help($("#commands").hidden, true);
$("#dismiss").onclick = () => help(false, true);
function notice(msg) {
  clearTimeout(noticeTimer);
  $("#notice").textContent = msg;
  field?.refresh();
  noticeTimer = setTimeout(() => {
    $("#notice").textContent = "";
    field?.refresh();
  }, 4500);
}
function run(raw) {
  const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!cmd) return;
  $("#notice").textContent = "";
  help(false);
  if (cmd === "help") help(true, true);
  else if (cmd === "cv") location.assign("/cv.pdf");
  else if (cmd === "contact" || cmd === "ps")
    section(cmd === "ps" ? "projects" : "contact", true);
  else if (cmd.startsWith("accent ") && Object.hasOwn(colors, cmd.slice(7)))
    setAccent(cmd.slice(7));
  else if (
    cmd.startsWith("open ") &&
    projects.some((p) => p.name === cmd.slice(5))
  )
    select(
      projects.findIndex((p) => p.name === cmd.slice(5)),
      true,
    );
  else notice("Unknown command. Choose Commands to see the list.");
}
for (const cmd of commands) {
  const b = document.createElement("button");
  b.textContent = cmd;
  b.type = "button";
  b.onclick = () => {
    $("#help").focus();
    run(cmd);
  };
  $("#choices").append(b);
}
$("#command").onsubmit = (e) => {
  e.preventDefault();
  const input = $("#input");
  run(input.value);
  input.value = "";
};
$("#input").addEventListener("keydown", (e) => {
  if (e.key === "Tab" && !e.shiftKey && e.target.value.trim()) {
    const match = commands.find((s) =>
      s.startsWith(e.target.value.trimStart().toLowerCase()),
    );
    if (match && match !== e.target.value) {
      e.preventDefault();
      e.target.value = match;
    }
  }
});
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
  if (e.key === "Escape") {
    if (!$("#commands").hidden) help(false, true);
    else if (mode >= 0) section("home");
    return;
  }
  if (e.target.matches("input,textarea,[contenteditable=true]")) return;
  if (/^[1-3]$/.test(e.key)) {
    select(Number(e.key) - 1, true);
    return;
  }
  if (
    (e.key === "ArrowDown" || e.key === "ArrowUp") &&
    e.target.closest("#rows")
  ) {
    e.preventDefault();
    buttons[(mode + (e.key === "ArrowDown" ? 1 : 2)) % 3].focus();
    return;
  }
  if (e.key === "?") {
    e.preventDefault();
    help($("#commands").hidden, true);
  }
  if (e.key === "/") {
    e.preventDefault();
    $("#input").focus();
  }
});

$("#rev").textContent = $('meta[name="portfolio:commit"]').content;
const nav = performance.getEntriesByType("navigation")[0];
if (nav?.responseStart > 0)
  $("#ttfb").textContent = nav.responseStart.toFixed(1) + " ms";
const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
const tick = () => {
  $("#clock").textContent = format.format(new Date());
};
tick();
if (capture === null)
  setInterval(() => {
    if (!document.hidden) tick();
  }, 1000);
const initial = projects.findIndex((p) => p.name === params.get("select"));
if (initial >= 0) select(initial);
else section(location.hash.slice(1));
setAccent(params.get("accent"));
await document.fonts.ready;
document.documentElement.style.setProperty(
  "--cell",
  $("#cell").getBoundingClientRect().width + "px",
);
field = mountField({
  capture,
  onSize: (w, h) => {
    measure = w + " × " + h + " cells";
    const m = $(".grid-measure");
    if (m) m.textContent = measure;
  },
  onPhase: caption,
  onFrame: (ms) => {
    $("#frame").textContent = ms.toFixed(1) + " ms";
  },
  onState: (s) => {
    state = s;
    $("#frame").textContent = "—";
  },
});
field.setMode(mode);
setAccent(accent);
