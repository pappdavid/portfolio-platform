import { conversation as convo } from "./conversation.js";
import { table } from "./strands.js";
import {
  acts,
  starts,
  end,
  frame,
  clamp,
  ramp,
  booking,
  faultFrame,
  prepareReplay,
  beatPhase,
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
      `<span id="${id}" style="top:${(pos / end) * 1400}svh"></span>`,
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
const copy = $("#copy"),
  readout = $("#readout"),
  wires = $("#wires"),
  sceneName = $("#scene-name");
const markTag = (s) => "<mark>" + s + "</mark>";
const pair = (name, value) =>
  "<small>" + name + "</small><div>" + value + "</div>";
function record(f) {
  const { a, b, t } = f,
    p = beatPhase(t, b);
  if (a === 0)
    return [
      "",
      pair("Anonymous session · POST", "Cookie → Workspace") +
        "<p>What is the API batch limit?</p>",
      pair("Selected passage · v2 · public", "“up to 50 records”"),
      pair(
        "Customer evidence",
        "v2 · public → lexical retrieval<br>v2 · internal → Withheld",
      ),
      pair("Activation", "Review → Approved → Active") +
        "<p>v2 · public　“up to 50 records”</p>",
      pair("Revision check", "Expected ≠ current") +
        "<p>409 · Revision conflict</p>",
    ][b];
  if (a === 1) {
    if (b === 1)
      return convo.utterances
        .slice(0, 2)
        .map(
          (u, i) =>
            '<div class="speech-value" style="opacity:' +
            (i ? ramp(p, 0.68, 0.98) : 1) +
            '">' +
            pair(
              u.speaker +
                " · " +
                u.start.toFixed(1) +
                "–" +
                u.end.toFixed(1) +
                " s",
              u.text,
            ) +
            "</div>",
        )
        .join("");
    if (b === 2) {
      const now = 35 + 14 * ramp(p, 0.6, 0.99),
        cut = now - 30;
      const arrived = convo.utterances.filter((v) => v.end <= now),
        times = (rows) => rows.map((v) => v.end.toFixed(1)).join(" / ");
      const out = arrived.filter((v) => v.end < cut);
      return (
        pair(
          "SlidingWindow · 30 seconds",
          cut.toFixed(1) + "–" + now.toFixed(1) + " s",
        ) +
        "<p>" +
        (out.length ? "Released · " + times(out) + " s<br>" : "") +
        "Retained · " +
        times(arrived.filter((v) => v.end >= cut)) +
        " s</p>"
      );
    }
    if (b === 3)
      return (
        pair(
          "engineer · 44.0–49.0 s",
          convo.utterances[4].text.replace(/Who is|from your team/g, markTag),
        ) + "<p>contact_lookup</p>"
      );
    if (b === 4 && p < 0.7)
      return pair(
        "283 terms × 14 chunks · 18 query terms",
        table(
          ["rank", "source", "cosine"],
          convo.hits.map((v, i) => [i + 1, v.title + "<br>" + v.id, v.score]),
        ),
      );
    if (b === 4)
      return (
        pair("notes:4 · rank 2 · cosine 0.2702", "<h3>Who's Who</h3>") +
        convo.bullets
          .map(
            (v) =>
              "<p>" + v.text + "<small>Source: " + v.title + "</small></p>",
          )
          .join("")
      );
    return (
      pair("Citation check · local lab only", "claim without cite　·　cite ∅") +
      "<p>" +
      (p > 0.62
        ? "Dropped · both sourced bullets retained"
        : "Checking retrieved source titles") +
      "</p>"
    );
  }
  const state = faultFrame(b, p),
    latest = state.trace.at(-1);
  const trace = latest
    ? '<p class="event">' +
      latest.sequence +
      " / " +
      latest.attempt +
      " · " +
      latest.kind +
      "　" +
      latest.title +
      "</p>"
    : "";
  if (b === 1)
    return (
      pair(
        "POST /visits · Idempotency-Key: WORK-318",
        "Boiler inspection　09:30–10:00<br>Demo workshop",
      ) + trace
    );
  if (b === 2) return pair("Client · observedId", "null") + trace;
  if (b === 3 || b === 4) {
    const cols = ["id", "key", "operation", "service", "slot", "location"];
    const visit = table(
      cols,
      state.visits.map((r) => cols.map((k) => r[k])),
    );
    return (
      pair("Visits · " + state.run.config.adapter, visit) +
      (b === 4 ? "<p>WORK-318 → fingerprint → VIS-742</p>" : "") +
      trace
    );
  }
  const stored = state.run.receipts[booking.operation].fingerprint;
  return (
    pair(
      "Fingerprint · same key",
      '<p class="bytes">' +
        stored.replace(booking.slot, markTag(booking.slot)) +
        '</p><p class="bytes">' +
        stored.replace(booking.slot, markTag("11:00–11:30")) +
        "</p>",
    ) +
    "<p>VIS-742 · 1 visit</p>" +
    trace
  );
}
function overview(a) {
  const item = acts[a];
  return (
    '<div class="summary"><h2>' +
    item.id +
    '</h2><p class="desc">' +
    item.description +
    '</p></div><div class="spec-block">' +
    spec(item) +
    "</div>"
  );
}
function caption(a, b) {
  return (
    "<h2>" +
    acts[a].beats[b - 1][0] +
    '</h2><p class="tech">' +
    acts[a].beats[b - 1][1] +
    "</p>"
  );
}
function indexCopy() {
  return (
    '<div class="kicker prompt">david@dev:~$ <span>ps --featured</span></div><div class="index-list">' +
    acts
      .map(
        (a, i) =>
          '<div><span class="serial">' +
          ids[i + 1] +
          '</span><a href="#' +
          a.id +
          '">' +
          a.id +
          '</a><a class="ext" href="' +
          a.demo +
          '">Demo ↗</a>' +
          (a.repo
            ? '<a class="ext" href="' + a.repo + '">Source ↗</a>'
            : "<span></span>") +
          "</div>",
      )
      .join("") +
    '</div><div class="end-actions"><a href="/cv.pdf">Résumé ↗</a><a data-contact href="' +
    linkedin +
    '">Contact · LinkedIn ↗</a><a href="' +
    github +
    '">GitHub ↗</a></div>'
  );
}
const occupied = (a, b) =>
  a.x < b.x + b.w + 5 &&
  b.x < a.x + a.w + 5 &&
  a.y < b.y + b.h + 4 &&
  b.y < a.y + a.h + 4;
function layoutWords(view, f) {
  const mobile = innerWidth <= 740;
  const rects = [];
  for (const set of world.systems)
    for (const n of set.labels || []) {
      const show =
        f.kind === "act" &&
        set === world.systems[view.site] &&
        n.beats.includes(f.b) &&
        n.amount > 0.002 &&
        view.fade > 0.002;
      if (!show) {
        n.el.hidden = n.leader.hidden = true;
        continue;
      }
      const pt = view.project(n.position),
        w = innerWidth;
      if (
        pt.z >= 1 ||
        pt.x < 0 ||
        pt.x > w ||
        pt.y < 28 ||
        pt.y > innerHeight * 0.65
      ) {
        n.el.hidden = n.leader.hidden = true;
        continue;
      }
      n.el.hidden = false;
      if (n.el.classList.contains("cell")) {
        n.leader.hidden = true;
        n.el.style.opacity = view.fade * n.amount;
        n.el.style.transform =
          "translate(" + pt.x + "px," + pt.y + "px) translate(-50%,-50%)";
        if (n.extent) {
          const next = view.project([
            n.position[0] + n.extent,
            n.position[1],
            n.position[2],
          ]);
          n.el.style.width = Math.max(0, next.x - pt.x) + "px";
          n.el.style.transform =
            "translate(" + pt.x + "px," + pt.y + "px) translateY(-50%)";
        }
        if (mobile) n.el.hidden = true;
        continue;
      }
      const ew = n.el.offsetWidth,
        eh = n.el.offsetHeight;
      const [ox, oy] = n.offset;
      const y0 = pt.y + oy - (oy < 0 ? eh : 0);
      let result = null;
      for (const [dx, dy] of [
        [0, 0],
        [0, -22],
        [0, 22],
        [-24, 0],
        [24, 0],
        [0, 44],
        [0, -44],
        [-42, -20],
        [42, 20],
        [0, 66],
        [0, -66],
      ]) {
        const r = {
          x: Math.max(7, Math.min(w - ew - 8, pt.x + ox - ew / 2 + dx)),
          y: Math.max(
            mobile ? 70 : 87,
            Math.min(innerHeight * (mobile ? 0.56 : 0.66) - eh, y0 + dy),
          ),
          w: ew,
          h: eh,
        };
        if (!rects.some((other) => occupied(r, other))) {
          result = r;
          break;
        }
      }
      if (!result) {
        n.el.hidden = n.leader.hidden = true;
        continue;
      }
      rects.push(result);
      n.el.style.transform = "translate(" + result.x + "px," + result.y + "px)";
      n.el.style.opacity = view.fade * n.amount;
      const lx = Math.max(result.x, Math.min(result.x + ew, pt.x)),
        ly = Math.max(result.y, Math.min(result.y + eh, pt.y)),
        dx = pt.x - lx,
        dy = pt.y - ly;
      n.leader.hidden = false;
      n.leader.style.cssText =
        "width:" +
        Math.hypot(dx, dy) +
        "px;opacity:" +
        view.fade * n.amount * 0.65 +
        ";transform:translate(" +
        lx +
        "px," +
        ly +
        "px) rotate(" +
        Math.atan2(dy, dx) +
        "rad)";
    }
}
let loopPhase = 0;
function draw() {
  // Quantize only the authored reading holds. The physical scroll marker keeps moving.
  let at = u;
  for (const start of starts) {
    const beat = Math.floor(u - start + 1e-8);
    if (beat >= 0 && beat <= 5 && u - start - beat <= 0.450000001) {
      at = start + beat;
      break;
    }
  }
  const f = frame(at),
    view = world.render(at, intro, loopPhase);
  const isAct = f.kind === "act",
    index = f.kind === "closing" || f.kind === "index",
    mode = isAct ? (f.b ? "beat" : "establish") : index ? "index" : "opening";
  document.body.dataset.shot = mode;
  const key = [mode, f.a, f.b].join("-");
  if (key !== lastCopy) {
    copy.innerHTML = isAct
      ? f.b
        ? caption(f.a, f.b)
        : overview(f.a)
      : index
        ? indexCopy()
        : opening();
    lastCopy = key;
    sceneName.innerHTML = isAct
      ? "<b>" +
        acts[f.a].id +
        "</b><span>" +
        (f.b ? "Beat " + number(f.b) + " / 05" : "Architecture") +
        "</span><small>Fictional sample data</small>"
      : "";
    const curr = isAct ? acts[f.a].id : index ? "index" : "opening";
    for (const el of document.querySelectorAll("#chapters a")) {
      if (el.hash === "#" + curr) el.setAttribute("aria-current", "step");
      else el.removeAttribute("aria-current");
    }
  }
  copy.style.opacity = index ? ramp(u, 22.08, 22.72) : view.fade;
  sceneName.style.opacity = view.fade;
  $("#chapters").style.setProperty("--position", (u / end) * 100 + "%");
  readout.hidden = !(isAct && f.b);
  let paths = "";
  if (!readout.hidden) {
    const html = record(f);
    if (readout.innerHTML !== html) readout.innerHTML = html;
    const at = beatPhase(f.t, f.b);
    const thresholds =
      f.a === 0
        ? []
        : f.a === 1
          ? [[], [], [], [], [0.7], [0.62]][f.b]
          : [[], [0.28], [0.46], [0.34, 0.7], [0.34, 0.7], [0.7]][f.b];
    const ink = thresholds.reduce(
      (ink, q) => Math.min(ink, ramp(Math.abs(at - q), 0, 0.29)),
      1,
    );
    readout.style.opacity = view.fade * ink;
    readout.style.top =
      innerWidth <= 740
        ? Math.max(
            90,
            Math.min(
              innerHeight * 0.47,
              copy.getBoundingClientRect().top - readout.offsetHeight - 12,
            ),
          ) + "px"
        : "";
    const box = readout.getBoundingClientRect(),
      pt = view.endpoint;
    const x = Math.max(box.left + 8, Math.min(box.right - 15, pt.x)),
      y = box.top;
    paths =
      '<path class="data-wire" opacity="' +
      view.fade +
      '" d="M ' +
      pt.x +
      " " +
      pt.y +
      " Q " +
      x +
      " " +
      (pt.y + y) / 2 +
      " " +
      x +
      " " +
      y +
      '"/>';
  }
  layoutWords(view, f);
  if (index) {
    const rows = [...copy.querySelectorAll(".index-list>div")],
      g = view.gather;
    rows.forEach((row, i) => {
      const r = row.getBoundingClientRect(),
        p = view.ports[i],
        x = r.right + 5,
        y = r.top + r.height * 0.55;
      const phone = innerWidth < 741,
        bx = phone ? Math.min(innerWidth - 4, x + 4 + i * 2) : x + 17 + i * 27,
        my = p.y + Math.max(35, (y - p.y) * 0.24);
      const length = ramp(u, 22.32 + i * 0.09, 23.16 + i * 0.09);
      for (let j = 0; j < 4; j++) {
        paths +=
          '<path pathLength="1" stroke-dasharray="' +
          length +
          ' 2" opacity="' +
          (0.28 + j * 0.1) +
          '" d="M ' +
          (p.x + j) +
          " " +
          p.y +
          " C " +
          p.x +
          " " +
          my +
          " " +
          (bx + j) +
          " " +
          my +
          " " +
          (bx + j) +
          " " +
          (y - 14) +
          " Q " +
          (bx + j) +
          " " +
          y +
          " " +
          x +
          " " +
          y +
          '"/>';
        if (g > 0.001) {
          const target = view.signature;
          paths +=
            '<path pathLength="1" stroke-dasharray="' +
            g +
            ' 2" opacity=".35" d="M ' +
            x +
            " " +
            (y + j) +
            " C " +
            (x + 70) +
            " " +
            (y + j) +
            " " +
            (target.x - 90) +
            " " +
            (target.y + i * 5 + j) +
            " " +
            target.x +
            " " +
            (target.y + i * 4 + j) +
            '"/>';
        }
      }
    });
  }
  wires.innerHTML = paths;
  // Keep the stage behind the caption quiet without changing the mask at a shot boundary.
  const fadeMask = Math.max(
    ...starts.map(
      (v) => ramp(at, v + 0.45, v + 0.95) * (1 - ramp(at, v + 5.55, v + 6.05)),
    ),
  );
  document.body.style.setProperty("--stage-edge", String(1 - fadeMask));
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
  if (!locked && u > 21.9) loopPhase = (loopPhase + dt / 5) % 1;
  if (dirty || u !== old || intro !== oldIntro || (!locked && u > 21.9)) {
    draw();
    dirty = false;
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
const idFor = (u) => {
  const f = frame(u);
  return f.kind === "act"
    ? acts[f.a].id + (f.b ? "-" + f.b : "")
    : f.kind === "closing"
      ? "overview"
      : f.kind;
};
let lost = null;
function staticPage(at = loadPosition()) {
  reading = true;
  cancelAnimationFrame(raf);
  document.body.classList.add("reading");
  $("#anchors").innerHTML = "";
  $("#reader").replaceChildren($("#still-edition").content.cloneNode(true));
  $("#reader").hidden = false;
  if (at !== null) jump(idFor(at));
}
function jump(id) {
  if (id === "contact") id = "index";
  const i = names.indexOf(id);
  if (reading) {
    document.getElementById(id)?.scrollIntoView();
    return;
  }
  if (dest.has(id)) {
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

const nav = performance.getEntriesByType("navigation")[0];
$("#ttfb").textContent = nav
  ? Math.round(nav.responseStart - nav.startTime) + " ms"
  : "—";
$("#revision").textContent = $('meta[name="portfolio:commit"]').content;
if (reduced.matches) staticPage();
else {
  try {
    const { createWorld } = await import("./world.js");
    prepareReplay();
    world = createWorld($("#world"));
    world.accent(colors[accent]);
    boot = performance.now();
    const at = loadPosition();
    if (at !== null) seek(at);
    else {
      u = nativeU();
      draw();
    }
    startLoop();
    $("#world").addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      if (lost || reading) return;
      lost = {
        u,
        intro,
        loopPhase,
        locked,
        focus:
          document.activeElement?.getAttribute("href") ||
          document.activeElement?.id,
      };
      staticPage(u);
    });
    $("#world").addEventListener("webglcontextrestored", () => {
      if (!lost || reduced.matches) return;
      const saved = lost;
      lost = null;
      const sections = [...$("#reader").querySelectorAll("section[id]")];
      const y = document.querySelector("header").offsetHeight + 30;
      const section = sections.reduce(
        (best, el) =>
          Math.abs(el.getBoundingClientRect().top - y) <
          Math.abs(best.getBoundingClientRect().top - y)
            ? el
            : best,
        sections[0],
      );
      const id = section?.id,
        restore =
          id === idFor(saved.u)
            ? saved.u
            : id === "overview"
              ? 23
              : (dest.get(id) ?? saved.u);
      const focused =
        document.activeElement?.getAttribute("href") || saved.focus;
      reading = false;
      $("#reader").hidden = true;
      $("#reader").replaceChildren();
      document.body.classList.remove("reading");
      $("#anchors").innerHTML = anchorMarkup;
      lastCopy = "";
      world.resize();
      loopPhase = saved.loopPhase;
      seek(restore, saved.intro);
      if (!saved.locked) locked = null;
      if (focused) {
        const el =
          [...document.querySelectorAll("a")].find(
            (el) => el.getAttribute("href") === focused && el.offsetWidth,
          ) || document.getElementById(focused);
        el?.focus({ preventScroll: true });
      }
      startLoop();
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
  get reading() {
    return reading;
  },
  get u() {
    return u;
  },
  seek: (p, formation = 1, loop = 0) => {
    loopPhase = loop;
    seek(clamp(p) * end, formation);
  },
  renderer: world?.renderer,
  accent: setAccent,
};
