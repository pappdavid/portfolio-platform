import {
  acts,
  starts,
  end,
  frame,
  clamp,
  ease,
  evidence,
  runs,
  prepareReplay,
  booking,
  linkedin,
  github,
} from "./story.js";
const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const colors = {
  green: "#00ff88",
  cyan: "#00f0ff",
  amber: "#ffb700",
  pink: "#ff007f",
};
const names = ["opening", ...acts.map((a) => a.id), "index"];
const positions = [0, ...starts, 24.25];
const ids = ["A", "B", "C", "D", "E"];
let world,
  reading = false,
  accent = "green",
  u = 0,
  velocity = 0,
  lastTime = 0,
  raf = 0,
  dirty = true,
  lastCopy = "",
  intro = 0,
  locked = null;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const boot = performance.now();
const chapters = names
  .map(
    (n, i) =>
      `<a class="chapter" href="#${n}"><span class="chapter-letter">${ids[i]}</span><span class="long">${i === 0 ? "Opening" : i === 4 ? "Index" : n}</span><span class="short">${["Opening", "Studio", "Companion", "Faultline", "Index"][i]}</span>${i > 0 && i < 4 ? '<span class="ticks" aria-hidden="true">' + "<i></i>".repeat(5) + "</span>" : ""}</a>`,
  )
  .join("");
$("#chapters").innerHTML = chapters;
$("#anchors").innerHTML = names
  .map(
    (n, i) =>
      `<span id="${n}" style="top:${(positions[i] / end) * 1400}svh"></span>`,
  )
  .join("");
$(".palette").innerHTML =
  "<small>Accent</small>" +
  Object.entries(colors)
    .map(
      ([name, color]) =>
        `<button style="--swatch:${color}" aria-label="${name} accent" data-accent="${name}"></button>`,
    )
    .join("");
function setAccent(name) {
  if (!Object.hasOwn(colors, name)) return;
  accent = name;
  document.documentElement.style.setProperty("--accent", colors[name]);
  document
    .querySelectorAll("[data-accent]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.accent === name)),
    );
  const rgb = colors[name]
    .slice(1)
    .match(/../g)
    .map((hex) => parseInt(hex, 16) / 255);
  const [r, g, b] = rgb,
    shift = b - 136 / 255;
  $("#ink-matrix").setAttribute(
    "values",
    [
      1 - r,
      r,
      0,
      0,
      0,
      1 - g,
      g,
      0,
      0,
      0,
      -shift,
      shift,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ].join(" "),
  );
  document.documentElement.style.setProperty(
    "--still-filter",
    name === "green" ? "none" : "url(#still-ink)",
  );
  world?.accent(colors[name]);
  dirty = true;
}
$(".palette").onclick = (e) =>
  setAccent(e.target.closest("button")?.dataset.accent);
setAccent(params.get("accent") || "green");
const number = (n) => String(n).padStart(2, "0");
const title = (left, right) =>
  `<div class="kicker"><span class="bright">${left}</span><span class="bar"></span>${right}</div>`;
const links = (a) =>
  `<div class="links"><a href="${a.demo}">Open demo <span>↗</span></a>${a.repo ? `<a href="${a.repo}">Source <span>↗</span></a>` : ""}</div>`;
const heroMarkup = $("#copy").innerHTML;
const opening = () => heroMarkup;
function spec(a) {
  return `<dl class="spec">${[
    ["Stack", a.stack],
    ["Proof", a.proof],
    ["Scope", a.scope],
  ]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("")}</dl>${links(a)}`;
}
function rows(a, b, t) {
  return evidence(a, b, t)
    .map(([k, v]) => `<div class="ev-row"><span>${k}</span><p>${v}</p></div>`)
    .join("");
}
function beatCopy(a, b, t) {
  const item = acts[a],
    run = runs[b - 1];
  if (!b)
    return (
      title("System " + number(a + 1), "Establishing view") +
      `<h2 class="project">${item.id}</h2><p class="desc">${item.description}</p>` +
      spec(item)
    );
  return (
    title(item.id, "Beat " + number(b) + " / 05") +
    `<div class="beat-progress" aria-hidden="true">${Array.from({ length: 5 }, (_, i) => `<i class="${i + 1 === b ? "now" : i + 1 < b ? "done" : ""}"></i>`).join("")}</div><h2>${item.beats[b - 1][0]}</h2><p class="tech">${item.beats[b - 1][1]}</p><div class="evidence"><div class="panel-title"><b>${a === 2 ? "Engine trace" : a === 1 ? "Transcript replay" : "Source record"}</b><span>Fictional</span></div><div class="rows">${rows(a, b, t)}</div></div>${a === 2 ? `<p class="stats">${booking.operation} · ${booking.service} · ${run.visits.length} ${run.visits.length === 1 ? "booking" : "bookings"} · ${run.config.adapter === "fixed" ? "key stored" : "plain receiver"}</p>` : ""}`
  );
}
function indexCopy() {
  return `<div class="kicker prompt">david@dev:~$ <span>ps --featured</span></div><h2>Project index<em class="bright">.</em></h2><div class="index-list">${acts.map((a, i) => `<div><span class="serial">${a.plate}</span><a href="#${a.id}">${a.id}</a><a class="ext" href="${a.demo}">Demo ↗</a>${a.repo ? `<a class="ext" href="${a.repo}">Source ↗</a>` : "<span></span>"}</div>`).join("")}</div><div class="actions"><a href="/cv.pdf">Résumé ↗</a></div><div class="index-contact"><span class="micro">Contact</span><a data-contact href="${linkedin}">LinkedIn ↗</a><a href="${github}">GitHub ↗</a></div>`;
}
const closing = () =>
  title("System tour", "Overview") +
  '<h2>Three systems.<br>One workbench.</h2><p class="desc">A quoted answer, a source card and a booking receipt.</p>';
function describe(f) {
  if (f.kind === "opening")
    return [
      "A",
      "Identity loom",
      "Woven signature",
      "Scroll to enter ↓",
      opening,
    ];
  if (f.kind === "act") {
    const a = acts[f.a],
      b = f.b,
      progress = ease((f.t - b + 0.5) * 1.4);
    return [
      a.plate,
      a.device,
      b ? a.stations[b - 1] : "Complete assembly",
      b
        ? "Payload / " +
          (f.a === 0 && b === 1
            ? "Question"
            : f.a === 1 && b > 3
              ? "Source card"
              : a.object)
        : "System / " + a.id,
      () => beatCopy(f.a, b, progress),
    ];
  }
  return [
    "E",
    "System array",
    "Whole assembly",
    "Opening · " + names.slice(1, 4).join(" · "),
    f.kind === "closing" ? closing : indexCopy,
  ];
}
function draw() {
  const f = frame(u),
    data = describe(f),
    point = world?.render(u, intro);
  $("#figure").textContent = "FIG. " + data[0];
  $("#device").textContent = data[1];
  $("#plot-text").textContent =
    f.kind === "opening"
      ? "Woven signature   /   Scroll to enter ↓"
      : f.kind === "act"
        ? data[3] + "  /  " + data[2]
        : data[3];
  const key = f.kind + "-" + f.a + "-" + f.b;
  if (key !== lastCopy) {
    $("#copy").innerHTML = data[4]();
    lastCopy = key;
    const chapter = f.kind === "opening" ? 0 : f.kind === "act" ? f.a + 1 : 4;
    document.querySelectorAll("#chapters .chapter").forEach((el, i) => {
      if (i === chapter) el.setAttribute("aria-current", "step");
      else el.removeAttribute("aria-current");
      el.querySelectorAll("i").forEach((tick, j) =>
        tick.classList.toggle("on", i === chapter && j < f.b),
      );
    });
  } else if (f.a === 1 && f.b > 0 && f.b < 3) {
    const box = $("#copy .rows"),
      markup = rows(f.a, f.b, ease((f.t - f.b + 0.5) * 1.4));
    if (box.innerHTML !== markup) box.innerHTML = markup;
  }
  const tagbox = $("#part-tags"),
    parts = world?.tags(f, u) || [];
  while (tagbox.children.length > parts.length)
    tagbox.lastElementChild.remove();
  parts.forEach((v, i) => {
    const tag =
      tagbox.children[i] || tagbox.appendChild(document.createElement("span"));
    tag.textContent = v.name;
    tag.style.left = v.x + "px";
    tag.style.top = v.y + "px";
  });
  const leader = $("#leader"),
    valid =
      point &&
      point.x > (innerWidth > 740 ? innerWidth * 0.4 : 16) &&
      point.x < innerWidth - 135 &&
      point.y > 58 &&
      point.y < $("#world").clientHeight - 46 &&
      f.t < 5.38;
  leader.hidden = !valid;
  if (valid) {
    leader.style.left = point.x + "px";
    leader.style.top = point.y + "px";
    leader.lastElementChild.textContent =
      f.a === 2
        ? booking.operation
        : f.a === 0 && f.b >= 2
          ? "source v2"
          : f.a === 0
            ? "question"
            : f.a === 1 && f.b >= 4
              ? "source card"
              : acts[f.a].object.toLowerCase();
  }
}
const maxScroll = () =>
  Math.max(1, document.documentElement.scrollHeight - innerHeight);
const nativeU = () => (scrollY / maxScroll()) * end;
function seek(value, formation = 1) {
  u = clamp(value, 0, end);
  velocity = 0;
  intro = formation;
  scrollTo(0, (u / end) * maxScroll());
  locked = { value: u, y: scrollY, formation };
  dirty = false;
  draw();
}
function loadPosition() {
  if (params.has("p") && Number.isFinite(+params.get("p")))
    return clamp(+params.get("p")) * end;
  const a = acts.findIndex((v) => v.id === params.get("act"));
  if (a >= 0) return starts[a] + clamp(Number(params.get("beat")) || 0, 0, 5);
  const i = names.indexOf(location.hash.slice(1));
  return i >= 0
    ? positions[i]
    : location.hash === "#contact"
      ? positions[4]
      : null;
}
let sampleTime = 0,
  sampleCount = 0,
  sampleSum = 0;
function animate(now) {
  const dt = lastTime ? Math.max(0, (now - lastTime) / 1000) : 0;
  lastTime = now;
  if (dt > 0) {
    sampleSum += dt * 1000;
    sampleCount++;
  }
  if (now - sampleTime >= 650) {
    if (sampleCount)
      $("#ms").textContent = (sampleSum / sampleCount).toFixed(1) + " ms";
    sampleCount = sampleSum = 0;
    sampleTime = now;
  }
  const goal =
    locked && Math.abs(scrollY - locked.y) < 0.5 ? locked.value : nativeU();
  if (locked && goal !== locked.value) locked = null;
  const old = u,
    oldIntro = intro;
  if (Math.abs(u - goal) > 0.00003 || Math.abs(velocity) > 0.0001) {
    const delta = u - goal,
      w = 15,
      step = Math.min(dt, 0.12),
      decay = Math.exp(-w * step),
      v = velocity + w * delta;
    const next = goal + (delta + v * step) * decay;
    if ((goal - u) * (goal - next) < 0) {
      u = goal;
      velocity = 0;
    } else {
      u = next;
      velocity = (velocity - w * v * step) * decay;
    }
  } else u = goal;
  intro = locked
    ? locked.formation
    : Math.max(intro, clamp((now - boot) / 1900));
  if (dirty || u !== old || intro !== oldIntro) {
    draw();
    dirty = false;
  }
  raf = requestAnimationFrame(animate);
}
function startLoop() {
  if (!reading && !document.hidden) {
    lastTime = 0;
    raf = requestAnimationFrame(animate);
  }
}
document.addEventListener("visibilitychange", () => {
  cancelAnimationFrame(raf);
  if (!document.hidden) startLoop();
});
function staticPage() {
  reading = true;
  cancelAnimationFrame(raf);
  document.body.classList.add("reading");
  $("#anchors").innerHTML = "";
  $("#reader").replaceChildren($("#still-edition").content.cloneNode(true));
  $("#reader").hidden = false;
  const offset = loadPosition();
  if (offset !== null) {
    const f = frame(offset);
    jump(
      f.kind === "act"
        ? acts[f.a].id + (f.b ? "-" + f.b : "")
        : f.kind === "closing"
          ? "overview"
          : f.kind,
    );
  }
}
function jump(id) {
  if (id === "contact") id = "index";
  const i = names.indexOf(id);
  if (reading) {
    document.getElementById(id)?.scrollIntoView();
    return;
  }
  if (i >= 0) {
    locked = null;
    scrollTo(0, (positions[i] / end) * maxScroll());
  }
}
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const id = link.hash.slice(1);
  e.preventDefault();
  history.pushState(null, "", "#" + id);
  jump(id);
  if (id === "contact") {
    if (!reading) seek(positions[4]);
    requestAnimationFrame(() =>
      $(reading ? "#reader [data-contact]" : "#copy [data-contact]")?.focus({
        preventScroll: true,
      }),
    );
  }
});
addEventListener("popstate", () => jump(location.hash.slice(1) || "opening"));
addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $("#reply").textContent = "";
    $("#cmd").blur();
    return;
  }
  if (e.target.matches("input,textarea") || e.metaKey || e.ctrlKey || e.altKey)
    return;
  if ("123".includes(e.key) && e.key.length === 1)
    jump(acts[Number(e.key) - 1].id);
  if (e.key === "/") {
    e.preventDefault();
    $("#cmd").focus();
  }
});
const help =
  "open client-studio | open active-companion | open faultline | ps | accent green/cyan/amber/pink | cv | contact";
$("#help").onclick = () => {
  $("#reply").textContent = $("#reply").textContent ? "" : help;
};
$(".command form").onsubmit = (e) => {
  e.preventDefault();
  const cmd = $("#cmd"),
    [verb, arg] = cmd.value.trim().toLowerCase().split(/\s+/);
  let message = "";
  if (verb === "open" && names.includes(arg)) jump(arg);
  else if (verb === "ps") jump("index");
  else if (verb === "contact") {
    jump("index");
    if (!reading) seek(positions[4]);
  } else if (verb === "cv") location.assign("/cv.pdf");
  else if (verb === "accent" && Object.hasOwn(colors, arg)) setAccent(arg);
  else message = verb === "help" ? help : "Unknown command. Type help.";
  $("#reply").textContent = message;
  cmd.value = "";
};
const clock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
function status() {
  if (!document.hidden) $("#clock").textContent = clock.format(new Date());
}
status();
setInterval(status, 1000);
$("#rev").textContent = $('meta[name="portfolio:commit"]').content;
const nav = performance.getEntriesByType("navigation")[0];
$("#ttfb").textContent = nav
  ? Math.round(nav.responseStart - nav.startTime) + " ms"
  : "—";
if (reduced.matches) staticPage();
else {
  try {
    const { createWorld } = await import("./world.js");
    world = createWorld($("#world"));
    prepareReplay();
    world.accent(colors[accent]);
    const at = loadPosition();
    if (at !== null) seek(at);
    else {
      u = nativeU();
      draw();
    }
    startLoop();
    $("#world").addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      staticPage();
    });
  } catch (error) {
    console.warn("Still edition selected.", error.message);
    staticPage();
  }
}
reduced.addEventListener("change", () => location.reload());
addEventListener("resize", () => {
  if (!reading) {
    world.resize();
    dirty = true;
  }
});
window.tourCapture = {
  ready: true,
  reading,
  seek: (p, formation = 1) => seek(clamp(p) * end, formation),
  renderer: world?.renderer,
  accent: setAccent,
};
