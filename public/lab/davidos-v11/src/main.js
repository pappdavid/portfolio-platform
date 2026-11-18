import { acts, starts, end, clamp, ramp } from "./story.js";
import { ownership } from "./folio-records.js";
import { column } from "./folio-copy.js";
const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const colors = {
  green: "#00ff88",
  cyan: "#00f0ff",
  amber: "#ffb700",
  pink: "#ff007f",
};
const names = ["opening", ...acts.map((a) => a.id), "index"];
const positions = [0, ...starts, end];
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
let boot = performance.now();
const dest = new Map(names.map((name, i) => [name, positions[i]]));
acts.forEach((act, i) =>
  act.beats.forEach((_, j) =>
    dest.set(act.id + "-" + (j + 1), starts[i] + j + 1),
  ),
);
const anchorMarkup = [...dest]
  .map(
    ([id, pos]) =>
      `<span id="${id}" style="top:${(pos / end) * 2700}svh"></span>`,
  )
  .join("");
$("#anchors").innerHTML = anchorMarkup;
$("#chapters").innerHTML =
  '<div class="track"><i class="travelled"></i><i class="cursor"></i></div>' +
  [...dest]
    .map(([id, pos]) => {
      const i = names.indexOf(id),
        text = i < 0 ? "" : i === 0 ? "Opening" : i === 4 ? "Index" : id;
      return `<a class="${i < 0 ? "beat-tick" : "chapter"}" aria-label="${id}" href="#${id}" style="left:${(pos / end) * 100}%"><span>${text}</span></a>`;
    })
    .join("");
$(".palette").innerHTML =
  "<small>Accent</small>" +
  Object.entries(colors)
    .map(
      ([name, color]) =>
        `<button style="--swatch:${color}" aria-label="${name} accent" data-accent="${name}"></button>`,
    )
    .join("");

const field = $("#field"),
  copy = $("#copy"),
  canvas = $("#world");
let idleTime = 0,
  loopPhase = 0,
  contactFocus = false,
  lost = null;
const idFor = (u) => ownership(u).id;
const destinations = [
  ...document.querySelectorAll("#reader section[data-dest]"),
];
function mirror(live) {
  destinations.forEach(
    (el) => (el.id = (live ? "transcript-" : "") + el.dataset.dest),
  );
  $("#anchors").innerHTML = live ? anchorMarkup : "";
  $("#reader")
    .querySelectorAll("a,summary")
    .forEach((el) => {
      if (live) el.tabIndex = -1;
      else el.removeAttribute("tabindex");
    });
}
function setAccent(name) {
  if (!Object.hasOwn(colors, name)) return;
  accent = name;
  document.documentElement.style.setProperty("--accent", colors[name]);
  document
    .querySelectorAll("[data-accent]")
    .forEach((el) =>
      el.setAttribute("aria-pressed", String(el.dataset.accent === name)),
    );
  world?.accent(colors[name]);
  dirty = true;
  if (world && !reading) draw();
}
$(".palette").onclick = (e) =>
  setAccent(e.target.closest("button")?.dataset.accent);
setAccent(params.get("accent") || "green");
function draw() {
  const { index, beat } = ownership(u),
    key = [
      index,
      beat,
      index === 0 && u < 2 ? (u < 0.88 ? "fan" : "source") : "",
    ].join("/");
  if (key !== lastCopy) {
    const opened =
      copy.querySelector("details[open]") &&
      copy.dataset.project === String(index);
    copy.innerHTML = column(index, beat, u);
    copy.dataset.project = index;
    if (opened) copy.querySelector("details")?.setAttribute("open", "");
    lastCopy = key;
    document.body.classList.toggle("ending", index === 3);
    document.querySelectorAll(".chapter").forEach((el, i) => {
      if (i === index + 1) el.setAttribute("aria-current", "step");
      else el.removeAttribute("aria-current");
    });
  }
  $("#chapters").style.setProperty("--position", (u / end) * 100 + "%");
  // The final results take the space below the fixed identity after the fifth beat.
  const closing = u > 21.45 && u < 23;
  if (closing)
    copy.style.setProperty("--caption-ink", String(1 - ramp(u, 21.45, 21.95)));
  else copy.style.removeProperty("--caption-ink");
  world?.render(u, idleTime + loopPhase * 3);
  if (world) {
    const mirror = $("#current-print"),
      words = world.transcript();
    if (mirror.textContent !== words) mirror.textContent = words;
    const targets = world.targets(),
      holder = $("#sheet-targets"),
      key = targets.join("|");
    if (holder.dataset.key !== key) {
      holder.dataset.key = key;
      holder.replaceChildren(
        ...targets.map((id) => {
          const a = document.createElement("a");
          a.href = dest.has(id) ? "#" + id : id;
          a.textContent = dest.has(id)
            ? id
            : acts.find((v) => v.demo === id || v.repo === id)?.id +
              " " +
              (acts.some((v) => v.demo === id) ? "demo" : "source");
          return a;
        }),
      );
    }
  }
}
const maxScroll = () =>
  Math.max(1, document.documentElement.scrollHeight - innerHeight);
const nativeU = () => (scrollY / maxScroll()) * end;
let travel = null,
  travelLight = 1,
  jumpRequested = false;
function followLongMove(goal, now, dt) {
  const distance = goal - u;
  const requested = jumpRequested;
  jumpRequested = false;
  if (!travel && (distance === 0 || (!requested && Math.abs(distance) <= 1.5)))
    return false;

  if (!travel || goal !== travel.to) {
    const fresh = !travel || requested || Math.abs(goal - travel.to) > 1.5;
    const start = now - Math.min(dt, 0.12) * 1000;
    // Wheel events in one gesture steer the same move and keep its deadline.
    const end = fresh ? start + 1200 : Math.max(travel.end, start + 320);
    const seconds = (end - start) / 1000;
    travel = {
      from: u,
      to: goal,
      start,
      end,
      fadeStart: fresh ? start : travel.fadeStart,
      origin: fresh ? idFor(u) : travel.origin,
      startLight: fresh ? travelLight : travel.startLight,
      // A cubic with this entrance tangent and a flat exit stays between its endpoints.
      tangent: distance
        ? distance * clamp((velocity * seconds) / distance, 0, 3)
        : 0,
    };
  }

  const p = clamp((now - travel.start) / (travel.end - travel.start));
  const left = 1 - p,
    span = travel.to - travel.from;
  u =
    p === 1
      ? goal
      : travel.from +
        span * p * p * (3 - 2 * p) +
        travel.tangent * p * left * left;
  velocity =
    ((6 * p * left * span + travel.tangent * left * (1 - 3 * p)) * 1000) /
    (travel.end - travel.start);
  travelLight = Math.max(
    travel.startLight *
      (1 - ramp(now, travel.fadeStart, travel.fadeStart + 220)),
    ramp(now, travel.fadeStart + 940, travel.fadeStart + 1200),
  );
  travel.caption = now < travel.fadeStart + 220 ? travel.origin : idFor(goal);
  field.style.opacity = String(0.15 + 0.85 * travelLight);
  if (p === 1) {
    travel = null;
    field.style.removeProperty("opacity");
  }
  return true;
}
function seek(value, formation = 1) {
  travel = null;
  travelLight = 1;
  jumpRequested = false;
  field.style.removeProperty("opacity");
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
  if (dest.has(location.hash.slice(1))) return dest.get(location.hash.slice(1));
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
  // Keep the original 400 ms spring and gentle speed cap for nearby scroll targets.
  const omega = 2.5,
    limit = 1 / 0.9;
  const travelling = followLongMove(goal, now, dt);
  let remaining = travelling ? 0 : Math.min(dt, 0.12);
  while (remaining > 0 && (u !== goal || velocity !== 0)) {
    const step = Math.min(remaining, 1 / 60);
    remaining -= step;
    const error = goal - u;
    const delta = -clamp(error, (-2 * limit) / omega, (2 * limit) / omega);
    const decay = Math.exp(-omega * step);
    const spring = velocity + omega * delta;
    const advance = clamp(
      delta * Math.expm1(-omega * step) + spring * step * decay,
      -limit * step,
      limit * step,
    );
    velocity = clamp((velocity - omega * spring * step) * decay, -limit, limit);
    if (
      error * (error - advance) <= 0 ||
      (Math.abs(error) < 0.00014 && Math.abs(velocity) < 0.0004)
    ) {
      u = goal;
      velocity = 0;
    } else u += advance;
  }
  intro = locked
    ? locked.formation
    : Math.max(intro, clamp((now - boot) / 1900));
  if (!locked) loopPhase = Math.max(0, u - 21.9) / 3;
  const isIdle =
    u < 2 || (u > 7.45 && u < 9) || (u > 14.45 && u < 16) || u > 21.45;
  if (!locked && isIdle) idleTime = now / 1000;
  if (
    dirty ||
    travelling ||
    u !== old ||
    intro !== oldIntro ||
    (!locked && isIdle)
  ) {
    draw();
    dirty = false;
  }
  if (contactFocus && u === goal && !velocity) {
    contactFocus = false;
    document
      .querySelector("#copy [data-contact]")
      ?.focus({ preventScroll: true });
  }
  raf = requestAnimationFrame(animate);
}
function startLoop() {
  cancelAnimationFrame(raf);
  if (!reading && !document.hidden) {
    lastTime = 0;
    raf = requestAnimationFrame(animate);
  }
}
document.addEventListener("visibilitychange", () => {
  cancelAnimationFrame(raf);
  if (!document.hidden) startLoop();
});

function staticPage(at = loadPosition()) {
  reading = true;
  cancelAnimationFrame(raf);
  document.body.classList.remove("live", "ending");
  document.body.classList.add("reading");
  mirror(false);
  copy.innerHTML = column(-1, 0, 0);
  lastCopy = "";
  if (at !== null) {
    const id = idFor(at);
    requestAnimationFrame(() => {
      if (reading) {
        jump(id);
        if (lost) lost.readerY = scrollY;
      }
    });
  }
}
function jump(id) {
  contactFocus = id === "contact" && !reading;
  if (id === "contact") id = "index";
  if (reading) {
    document.getElementById(id)?.scrollIntoView();
    return;
  }
  if (dest.has(id)) {
    jumpRequested = true;
    locked = null;
    scrollTo(0, (dest.get(id) / end) * maxScroll());
  }
}
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const id = link.hash.slice(1);
  e.preventDefault();
  history.pushState(null, "", "#" + id);
  jump(id);
  if (id === "contact" && reading) {
    requestAnimationFrame(() =>
      $("#reader [data-contact]")?.focus({
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
const beatMenu = document.createElement("div");
beatMenu.className = "beat-menu";
beatMenu.hidden = true;
$("#chapters").append(beatMenu);
function openBeats(e) {
  const link = e.target.closest(".chapter");
  if (innerWidth > 740 || !link) return;
  const act = acts.find((v) => "#" + v.id === link.hash);
  if (!act) {
    beatMenu.hidden = true;
    return;
  }
  beatMenu.innerHTML = act.beats
    .map(
      (_, i) =>
        '<a href="#' +
        act.id +
        "-" +
        (i + 1) +
        '" aria-label="' +
        act.id +
        " beat " +
        (i + 1) +
        '">' +
        (i + 1) +
        "</a>",
    )
    .join("");
  beatMenu.hidden = false;
}
$("#chapters").addEventListener("focusin", openBeats);
$("#chapters").addEventListener("click", openBeats);
document.addEventListener("click", (e) => {
  if (!e.target.closest("#chapters .chapter")) beatMenu.hidden = true;
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") beatMenu.hidden = true;
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
    jump("contact");
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

const nav = performance.getEntriesByType("navigation")[0];
$("#ttfb").textContent = nav
  ? Math.round(nav.responseStart - nav.startTime) + " ms"
  : "—";
$("#revision").textContent = $('meta[name="portfolio:commit"]').content;

function live() {
  reading = false;
  document.body.classList.remove("reading");
  document.body.classList.add("live");
  mirror(true);
}
canvas.addEventListener("click", (e) => {
  const id = world?.hit(e.clientX, e.clientY);
  if (!id) return;
  if (dest.has(id)) {
    history.pushState(null, "", "#" + id);
    jump(id);
  } else location.assign(id);
});
document.addEventListener("focusin", (e) => {
  const id = e.target.closest("a")?.getAttribute("href") || "";
  world?.focus(id.replace(/^#/, ""));
  dirty = true;
});
if (reduced.matches) staticPage();
else
  try {
    const { createWorld } = await import("./world.js");
    world = await createWorld(canvas);
    world.accent(colors[accent]);
    live();
    boot = performance.now();
    const at = loadPosition();
    if (at !== null) seek(at);
    else {
      u = nativeU();
      draw();
    }
    startLoop();
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      if (lost || reading) return;
      lost = {
        u,
        intro,
        loopPhase,
        idleTime,
        locked,
        focus:
          document.activeElement?.getAttribute("href") ||
          document.activeElement?.id,
        readerY: null,
      };
      staticPage(u);
    });
    canvas.addEventListener("webglcontextrestored", () => {
      if (!lost || reduced.matches) return;
      const saved = lost;
      lost = null;
      const moved =
        saved.readerY !== null && Math.abs(scrollY - saved.readerY) > 4;
      const section = destinations.reduce(
        (b, s) =>
          Math.abs(s.getBoundingClientRect().top - 65) <
          Math.abs(b.getBoundingClientRect().top - 65)
            ? s
            : b,
        destinations[0],
      );
      const to = moved ? (dest.get(section.dataset.dest) ?? saved.u) : saved.u;
      live();
      world.resize();
      loopPhase = saved.loopPhase;
      idleTime = saved.idleTime;
      seek(to, saved.intro);
      if (!saved.locked) locked = null;
      if (saved.focus) {
        const el =
          [...document.querySelectorAll("a")].find(
            (el) =>
              el.getAttribute("href") === saved.focus &&
              el.closest("#reader") === null,
          ) || document.getElementById(saved.focus);
        el?.focus({ preventScroll: true });
      }
      startLoop();
    });
  } catch (error) {
    if (error.message !== "WebGL2 unavailable") console.error(error);
    staticPage();
  }
reduced.addEventListener("change", () => location.reload());
addEventListener("resize", () => {
  if (!reading) {
    world?.resize();
    dirty = true;
  }
});
window.tourCapture = {
  ready: true,
  get reading() {
    return reading;
  },
  get u() {
    return u;
  },
  state: () => world?.state(),
  audit: () => world?.audit(),
  substrate: () => world?.substrate(),
  seek: (p, formation = 1, loop = 0, seconds = 0) => {
    idleTime = seconds;
    loopPhase = loop;
    seek(clamp(p) * end, formation);
  },
  renderer: world?.renderer,
  accent: setAccent,
};
