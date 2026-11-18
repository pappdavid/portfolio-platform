import { projects, diagramLines } from "./projects.js";
import { startInk } from "./ink.js";

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const capture =
  params.has("capture") && Number.isFinite(Number(params.get("capture")))
    ? Math.max(0, Number(params.get("capture")))
    : null;
const colors = {
  green: "#00ff88",
  cyan: "#00f0ff",
  amber: "#ffb700",
  pink: "#ff007f",
};
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const letters = {
  D: "M0 0H8V1H10V3H11V9H10V11H8V12H0ZM3 3V9H7V8H8V4H7V3Z",
  A: "M0 12V3H1V1H3V0H8V1H10V3H11V12H8V8H3V12ZM3 5H8V3H3Z",
  V: "M0 0H3V5H4V8H5V9H6V8H7V5H8V0H11V5H10V8H9V10H8V12H3V10H2V8H1V5H0Z",
  I: "M0 0H3V12H0Z",
};
$(".mark").innerHTML =
  '<svg viewBox="0 0 55 12" style="width:100%" aria-hidden="true"><defs><pattern id="cuts" width=".9" height=".7" patternUnits="userSpaceOnUse"><rect width=".9" height=".57" fill="currentColor"/><rect width=".69" height=".1" y=".53" fill="currentColor"/></pattern></defs>' +
  [..."DAVID"]
    .map(
      (l, i) =>
        '<path fill="url(#cuts)" fill-rule="evenodd" transform="translate(' +
        [0, 13, 26, 39, 44][i] +
        ' 0)" d="' +
        letters[l] +
        '"/>',
    )
    .join("") +
  "</svg>";

function links(p) {
  return (
    '<a aria-label="Open ' +
    p.name +
    ' demo" href="' +
    p.demo +
    '">Demo <span aria-hidden="true">↗</span></a>' +
    (p.source
      ? ' <a aria-label="View ' +
        p.name +
        ' source" href="' +
        p.source +
        '">Source <span aria-hidden="true">↗</span></a>'
      : "")
  );
}
$("#rows").innerHTML = projects
  .map(
    (p, i) =>
      '<li class="row-grid project"><button class="pick" aria-controls="detail" aria-pressed="false" aria-keyshortcuts="' +
      (i + 1) +
      '"><span class="cue" aria-hidden="true">›</span><span class="project-name">' +
      p.name +
      '</span><span class="description">' +
      p.line +
      '</span></button><span class="kind">' +
      p.kind +
      '</span><span class="proof">' +
      p.proof +
      '</span><div class="links">' +
      links(p) +
      "</div></li>",
  )
  .join("");
const rows = [...document.querySelectorAll(".project")];
for (const [name, color] of Object.entries(colors)) {
  const b = document.createElement("button");
  b.type = "button";
  b.title = name + " ink";
  b.setAttribute("aria-label", name + " ink");
  b.style.setProperty("--swatch", color);
  b.dataset.accent = name;
  b.onclick = () => setAccent(name);
  $(".palette").append(b);
}

let active = null,
  ink = null,
  accent = "green",
  fallback = false;
function setAccent(name) {
  accent = Object.hasOwn(colors, name) ? name : "green";
  document.documentElement.style.setProperty("--ink", colors[accent]);
  ink?.accent(colors[accent]);
  for (const b of $(".palette").querySelectorAll("button"))
    b.setAttribute("aria-pressed", b.dataset.accent === accent);
}

function stillPaths() {
  if (active) return diagramLines(active.name);
  return Array.from({ length: 60 }, (_, i) => ({
    weight: 0.6,
    points: Array.from({ length: 141 }, (_, j) => {
      const u = (j / 140) * Math.PI * 2,
        v = (i / 60) * Math.PI * 2 + 1.1 * Math.sin(2 * u),
        r = 1 + 0.22 * Math.cos(v) + 0.12 * Math.cos(3 * u);
      return [
        0.5 + 0.36 * r * Math.cos(u),
        0.5 +
          0.22 * r * Math.sin(u) +
          0.13 * Math.sin(v) +
          0.12 * Math.sin(2 * u) +
          0.11 * r * Math.cos(u),
      ];
    }),
  }));
}
function showDetail() {
  $("#fig-title").textContent = active ? active.caption : "Flow field";
  $("#reset").hidden = !active;
  $(".fig-type").hidden = !!active;
  const legend = active
    ? active.labels
        .map(
          ([x, y, text, key]) =>
            '<span class="annotation ' +
            (key ? "key" : "") +
            '" style="left:' +
            x * 100 +
            "%;top:" +
            y * 100 +
            '%">' +
            text +
            "</span>",
        )
        .join("")
    : "";
  const still = fallback
    ? '<svg viewBox="0 0 1000 400" preserveAspectRatio="none" width="100%" height="100%">' +
      stillPaths()
        .map(
          ({ points, weight }) =>
            '<polyline points="' +
            points.map(([x, y]) => x * 1000 + "," + y * 400).join(" ") +
            '" fill="none" stroke="var(--ink)" stroke-opacity="' +
            weight +
            '" vector-effect="non-scaling-stroke"/>',
        )
        .join("") +
      "</svg>"
    : "";
  $("#labels").innerHTML = still + legend;
  if (active)
    $("#detail").innerHTML =
      '<p class="detail-copy">' +
      active.story +
      '</p><div class="detail-meta"><span>' +
      active.facts +
      "</span><span>" +
      links(active) +
      "</span></div>";
  else
    $("#detail").innerHTML =
      '<div class="idle-note"><span><i></i> Velocity / dye</span><span>' +
      (fallback || motion.matches
        ? "Static field"
        : capture !== null
          ? "Fixed field"
          : "Move pointer to stir") +
      "</span></div>";
}
function select(p) {
  if (active === p) return;
  active = p;
  rows.forEach((row, i) => {
    const selected = projects[i] === p;
    row.setAttribute("aria-current", String(selected));
    row.querySelector("button").setAttribute("aria-pressed", String(selected));
  });
  showDetail();
  ink?.select(p?.name ?? "");
}
$("#reset").onclick = () => {
  select(null);
  $("#instrument").focus({ preventScroll: true });
};
const mobile = () => matchMedia("(max-width:740px)").matches;
function inspect(p, scroll = false) {
  select(p);
  if (scroll && mobile()) $("#instrument").scrollIntoView({ block: "start" });
}
rows.forEach((row, i) => {
  row.addEventListener("pointerenter", (e) => {
    if (
      capture === null &&
      e.pointerType === "mouse" &&
      matchMedia("(hover:hover)").matches
    )
      inspect(projects[i]);
  });
  row.addEventListener("focusin", () => inspect(projects[i]));
  row.addEventListener("click", (e) => {
    if (!e.target.closest("a")) inspect(projects[i], true);
  });
  row.addEventListener("keydown", (e) => {
    const direction = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    }[e.key];
    if (direction) {
      e.preventDefault();
      rows[(i + direction + rows.length) % rows.length]
        .querySelector("button")
        .focus();
    }
  });
});
try {
  ink = startInk($("canvas"), {
    capture,
    onFrame: (ms) => {
      $("#frame").textContent = ms === null ? "—" : ms.toFixed(1) + " ms";
    },
    onLost: () => {
      fallback = true;
      $("#frame").textContent = "—";
      showDetail();
    },
  });
} catch (error) {
  console.warn("Ink renderer unavailable", error);
}
fallback = !ink;
setAccent(params.get("accent"));
showDetail();
select(projects.find((p) => p.name === params.get("select")) ?? null);
motion.addEventListener("change", showDetail);

function route(section, focus = false) {
  const id = ["projects", "skills", "contact"].includes(section)
    ? section
    : "home";
  $("#identity").hidden = ["skills", "contact"].includes(id);
  for (const s of ["skills", "contact"]) $("#" + s).hidden = id !== s;
  $("#profile-command").textContent =
    id === "skills"
      ? "cat skills"
      : id === "contact"
        ? "cat contact"
        : "whoami";
  for (const a of document.querySelectorAll("nav a")) {
    if (a.hash === "#" + id) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  }
  if (focus) {
    if (id !== "projects") select(null);
    const dest =
      id === "projects" ? rows[0].querySelector("button") : $("#" + id);
    dest.focus({ preventScroll: true });
    if (mobile()) {
      if (id === "home") window.scrollTo(0, 0);
      else dest.scrollIntoView({ block: "start" });
    }
  }
}
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  if (location.hash !== a.hash) history.pushState({}, "", a.hash);
  route(a.hash.slice(1), true);
});
window.addEventListener("popstate", () => route(location.hash.slice(1), true));
route(location.hash.slice(1));

const commands = [
  "ps",
  ...projects.map((p) => "open " + p.name),
  ...Object.keys(colors).map((n) => "accent " + n),
  "cv",
  "contact",
  "help",
];
const input = $("#command"),
  menu = $("#command-menu"),
  reply = $("#reply");
function help(show) {
  menu.hidden = !show;
  $("#help").setAttribute("aria-expanded", show);
}
function run(raw) {
  const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ");
  help(false);
  reply.textContent = "";
  input.value = "";
  if (!cmd) return;
  if (cmd === "help") {
    help(true);
    menu.querySelector("button").focus();
    return;
  }
  if (cmd === "ps") {
    document.querySelector('nav a[href="#projects"]').click();
    return;
  }
  if (cmd === "cv") {
    location.assign("/cv.pdf");
    return;
  }
  if (cmd === "contact") {
    document.querySelector('nav a[href="#contact"]').click();
    return;
  }
  if (commands.includes(cmd) && cmd.startsWith("accent ")) {
    setAccent(cmd.slice(7));
    reply.textContent = accent + " ink";
    return;
  }
  const p = projects.find((p) => "open " + p.name === cmd);
  if (p) {
    inspect(p, true);
    reply.textContent = p.name;
    return;
  }
  reply.textContent = "Unknown command. Try help.";
}
for (const cmd of commands.filter((c) => c !== "help")) {
  const b = document.createElement("button");
  b.textContent = cmd;
  b.onclick = () => {
    input.focus();
    run(cmd);
  };
  menu.append(b);
}
$("#help").onclick = () => {
  help(menu.hidden);
  if (!menu.hidden) menu.querySelector("button").focus();
};
$(".console").onsubmit = (e) => {
  e.preventDefault();
  run(input.value);
};
input.addEventListener("input", () => {
  const raw = input.value.toLowerCase();
  const match = raw && commands.find((c) => c.startsWith(raw) && c !== raw);
  reply.textContent = match ? "Tab → " + match : "";
});
input.addEventListener("keydown", (e) => {
  if (e.key !== "Tab" || e.shiftKey || !input.value) return;
  const match = commands.find(
    (c) =>
      c.startsWith(input.value.toLowerCase()) &&
      c !== input.value.toLowerCase(),
  );
  if (match) {
    e.preventDefault();
    input.value = match;
    reply.textContent = "";
  }
});
document.addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === "Escape") {
    if (!menu.hidden) {
      help(false);
      $("#help").focus();
    } else {
      select(null);
      reply.textContent = "";
    }
    return;
  }
  if (e.target.matches("input,textarea") || e.target.isContentEditable) return;
  if (["1", "2", "3"].includes(e.key)) {
    inspect(projects[Number(e.key) - 1], true);
  }
  if (
    !e.defaultPrevented &&
    (e.target === document.body || e.target === $("#instrument")) &&
    ["ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    e.preventDefault();
    const i = projects.indexOf(active);
    inspect(
      projects[
        (i + (e.key === "ArrowRight" ? 1 : -1) + projects.length) %
          projects.length
      ],
      true,
    );
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".console-wrap")) help(false);
});
$("#rev").textContent = document.querySelector(
  'meta[name="portfolio:commit"]',
).content;
const clock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
function tick() {
  $("#clock").textContent = clock.format(new Date());
}
$("#clock").textContent = "—";
if (capture === null) {
  tick();
  setInterval(tick, 1000);
}
const nav = performance.getEntriesByType("navigation")[0];
if (capture === null && nav && nav.responseStart > 0)
  $("#ttfb").textContent =
    (nav.responseStart - nav.startTime).toFixed(1) + " ms";
