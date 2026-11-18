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
  sourceReplay,
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
const openingStage = $(".folio-opening");
const readerFront = [".folio-poster",".folio-id",".folio-face"].map(q => openingStage.querySelector(q).cloneNode(true));
const startupImages = [...new Set([
  ...Array.from($("#still-edition").content.querySelectorAll("img"), img => img.getAttribute("src")),
  ...["opening","opening-emission","opening-narrow","opening-narrow-emission"].map(n=>"assets/stills/"+n+".webp")
])].map(url => { const image = new Image(); image.fetchPriority="low"; if(url.endsWith("-emission.webp")) image.crossOrigin="anonymous"; image.src=url; return image; });

function spec(a) {
  return `<dl class="spec">${[
    ["Stack", a.stack],
    ["Proof", a.proof],
    ["Scope", a.scope],
  ]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("")}</dl>${links(a)}`;
}
const field = $("#field"),
  copy = $("#copy"),
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
      pair(
        "Activation",
        p < 0.45
          ? "Review"
          : p < 0.85
            ? "Review → Approved"
            : "Review → Approved → Active",
      ) + "<p>v2 · public　“up to 50 records”</p>",
      pair(
        "Workspace revision · accepted writes",
        "Expected " +
          sourceReplay.expected +
          " / Current " +
          sourceReplay.current,
      ) +
        (p >= 0.8
          ? "<p>409 · Revision conflict</p>"
          : "<p>Checking the late write</p>"),
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
    if (b === 4 && p < 0.85)
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
      pair(
        "Visits · " + state.run.config.adapter,
        innerWidth <= 740
          ? visit
          : state.visits.map((v) => v.id).join(" / ") +
              " · " +
              booking.operation,
      ) +
      (b === 4 ? "<p>WORK-318 → fingerprint → VIS-742</p>" : "") +
      trace
    );
  }
  const stored = state.run.receipts[booking.operation].fingerprint;
  return (
    pair(
      "Payload fingerprint · UTF-8 · bits 7–0",
      '<p class="bytes">Stored　' +
        stored.replace(booking.slot, markTag(booking.slot)) +
        '</p><p class="bytes">Incoming　' +
        stored.replace(booking.slot, markTag("11:00–11:30")) +
        "</p>",
    ) +
    "<p>Long 1 · short 0 · filled = differing bit</p><p>VIS-742 · 1 visit</p>" +
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
  const visit = faultFrame(4, 1).visits[0];
  const visitFields = ["id", "key", "operation", "service", "slot", "location"];
  const visitRow = table(visitFields, [visitFields.map((k) => visit[k])]);
  return (
    '<div class="kicker prompt">david@dev:~$ <span>ps --featured</span><small>Fictional sample data</small></div><div class="index-list">' +
    acts
      .map(
        (a, i) =>
          '<div class="project-entry"><span class="serial">' +
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
    '</div><div class="plate-results" aria-label="Fictional sample data">' +
    "<div><small>Selected source · v2</small><strong>“" +
    sourceReplay.excerpt +
    '”</strong><span>Public · quoted excerpt</span><div class="source-seating">Source v2 <i></i> Answer</div><small class="idle-port">Model gateway · off in this demo</small></div>' +
    '<div><small>SlidingWindow · seconds</small><strong>19.0 — 49.0 s</strong><span>Retained ends · 31.0 / 35.0 / 49.0 s</span><div class="retained-window"></div><small class="idle-port">Citation check · local lab only</small></div>' +
    "<div><small>Fixed receipt</small><strong>" +
    booking.operation +
    " → " +
    faultFrame(4, 1).visits[0].id +
    '</strong><span>Saved visit · replay status 200</span></div></div><div class="plate-visit"><small>Visits · fixed receiver</small>' +
    visitRow +
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
  const rects = [copy, readout, sceneName]
    .filter((el) => !el.hidden)
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
  if (mobile) {
    for (const face of document.querySelectorAll(".world-face:not([hidden])")) {
      if (Number(face.style.opacity) < 0.04) continue;
      const b = face.getBoundingClientRect();
      rects.push({ x: b.x, y: b.y, w: b.width, h: b.height });
    }
  }
  const cells = [];

  for (const set of world.systems)
    for (const n of [...(set.labels || [])].sort(
      (a, b) =>
        Number(b.el.classList.contains("cell")) -
        Number(a.el.classList.contains("cell")),
    )) {
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
        if (n.cellWidth) {
          const edge = view.project([
            n.position[0] + n.cellWidth,
            n.position[1],
            n.position[2],
          ]);
          n.el.style.width = Math.max(18, edge.x - pt.x) + "px";
          n.el.classList.add("visit-value");
        }
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
        const r = n.el.getBoundingClientRect();
        const box = { x: r.x, y: r.y, w: r.width, h: r.height };
        n.el.hidden =
          mobile ||
          r.left < 8 ||
          r.right > w - 8 ||
          r.top < 90 ||
          r.bottom > innerHeight * 0.65 ||
          rects.slice(0, 3).some((v) => occupied(v, box));
        if (!n.el.hidden) cells.push(box);
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
        ...(mobile
          ? [
              [-60, 0],
              [60, 0],
              [0, -88],
              [0, 88],
            ]
          : []),
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
        if (![...rects, ...cells].some((other) => occupied(r, other))) {
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
let loopPhase = 0, idleTime = 0;
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
    view = world.render(at, intro, loopPhase, idleTime, travelLight);
  openingStage.hidden = at >= 2;
  document.body.classList.toggle("folio-arrival", at >= 1.2 && at < 1.985);
  copy.inert = at < 1.86;
  if (window.tourCapture) window.tourCapture.registration=view.registration;
  window.tourCapture && (window.tourCapture.fieldCorners = view.fieldCorners);
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
        : "";
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
  if (at < 2) world.opening.positionTitle(at);
  const captionLight = travel && idFor(at) !== travel.caption ? 0 : travelLight;
  copy.style.opacity = captionLight * (index ? ramp(u, 22.08, 22.72) : view.fade);
  sceneName.style.opacity = view.fade;
  $("#chapters").style.setProperty("--position", (u / end) * 100 + "%");
  readout.hidden = !(isAct && f.b);
  let paths = "";
  if (!readout.hidden) {
    let html = record(f);
    if (f.a === 1 && f.b === 4) {
      const c = view.fieldCorners;
      const tangent = [
        (c[1].x + c[2].x - c[0].x - c[3].x) / 566,
        (c[1].y + c[2].y - c[0].y - c[3].y) / 566,
      ];
      const row = [
        (c[3].x + c[2].x - c[0].x - c[1].x) / 28,
        (c[3].y + c[2].y - c[0].y - c[1].y) / 28,
      ];
      const pitch =
        Math.abs(tangent[0] * row[1] - tangent[1] * row[0]) /
        (Math.abs(row[0]) + Math.abs(row[1]));
      const bin = 2 ** Math.floor(Math.log2(Math.max(1, 2.25 / pitch)));
      html +=
        "<p>Centre · " +
        (pitch >= 4
          ? "one term per column"
          : "occupied terms per bin · " + bin + " / " + bin * 2 + " terms") +
        "</p>";
    }
    if (readout.innerHTML !== html) readout.innerHTML = html;
    readout.style.opacity = view.fade;
    const phone = innerWidth <= 740,
      pt = view.endpoint,
      copyBox = copy.getBoundingClientRect();
    const yLimit =
      innerHeight -
      document.querySelector("footer").offsetHeight -
      document.querySelector("#chapters").offsetHeight -
      readout.offsetHeight -
      12;
    readout.style.bottom = "auto";
    const w = readout.offsetWidth,
      h = readout.offsetHeight;
    // The offset names a free margin of the subject in each composition. A negative
    // fraction of the readout width docks its far edge to the data.
    const offsets = [
      [
        [-0.3, 0, 40],
        [0, 148, -22],
        [-0.28, 0, 44],
        [-0.52, 0, 40],
        [0, 24, 50],
      ],
      [
        [-0.78, 0, -h - 72],
        [-0.88, 0, 36],
        [-0.34, 0, 51],
        [-0.78, 0, 92],
        [-1, -40, -h * 0.48],
      ],
      [
        [-0.3, 0, -h - 49],
        [-0.47, 0, -h - 52],
        [-0.1, 0, 36],
        [-0.65, 0, 46],
        [-0.2, 0, 64],
      ],
    ];
    const [fraction, dx, dy] = offsets[f.a][f.b - 1];
    let left = clamp(pt.x + fraction * w + dx, 48, innerWidth - w - 48);
    let top = clamp(pt.y + dy, 105, yLimit);
    if (!phone && f.a === 1 && f.b === 4) {
      const close = ramp(f.t, 3.45, 3.7) * (1 - ramp(f.t, 3.8, 4));
      top = Math.min(
        yLimit,
        top + Math.max(0, innerHeight * 0.68 - top) * close,
      );
    }
    const captionEdge = copyBox.right + 24;
    if (top + h > copyBox.top - 14 && left < captionEdge) {
      if (captionEdge + w < innerWidth - 36) left = captionEdge;
      else top = Math.max(100, copyBox.top - h - 16);
    }
    if (phone) {
      readout.style.left = "";
      readout.style.right = "";
      top = Math.max(90, Math.min(innerHeight * 0.47, copyBox.top - h - 12));
    } else {
      readout.style.right = "auto";
      readout.style.left = left + "px";
    }
    readout.style.top = top + "px";
    const box = readout.getBoundingClientRect();
    const x = clamp(pt.x, box.left, box.right),
      y = clamp(pt.y, box.top, box.bottom);
    paths =
      '<path class="data-wire" opacity="' +
      view.fade +
      '" d="M ' +
      pt.x +
      " " +
      pt.y +
      " L " +
      x +
      " " +
      y +
      '"/>';
  }
  layoutWords(view, f);
  if (index) {
    const entries = [...copy.querySelectorAll(".project-entry")];
    const results = [...copy.querySelectorAll(".plate-results>div")];
    const phone = innerWidth < 741;
    const end = view.windowEnd ?? 49;
    results[1].querySelector("strong").textContent =
      (end - 30).toFixed(1) + " — " + end.toFixed(1) + " s";
    const retained = convo.utterances
      .filter((u) => u.end <= end && u.end >= end - 30)
      .map((u) => u.end.toFixed(1));
    results[1].querySelector("span").textContent =
      "Retained ends · " + retained.join(" / ") + " s";
    const intervals = convo.utterances.filter(
      (v) => v.end <= end && v.end >= end - 30,
    );
    results[1].querySelector(".retained-window").innerHTML = intervals
      .map((v) => {
        const l = Math.max(0, v.start - end + 30),
          r = v.end - end + 30;
        return (
          '<i style="left:' +
          (l / 30) * 100 +
          "%;width:" +
          ((r - l) / 30) * 100 +
          '%"></i>'
        );
      })
      .join("");
    // Fade each tether along its own direction, including horizontal/vertical
    // runs (object-bounding-box gradients are singular for those paths).
    let threadId = 0;
    function path(d, progress, tone = "") {
      const chunks = d.match(/[MLHV][^MLHV]*/g);
      const start = chunks[0].slice(1).trim().split(/\s+/).map(Number);
      const finish = start.slice();
      const points = [start];
      for (const chunk of chunks.slice(1)) {
        const point = chunk.slice(1).trim().split(/\s+/).map(Number);
        if (chunk[0] === "V") finish[1] = point[0];
        else if (chunk[0] === "H") finish[0] = point[0];
        else [finish[0], finish[1]] = point;
        points.push(finish.slice());
      }
      if (points.length === 3) {
        const [a, b, c] = points;
        const radius = Math.min(
          8,
          Math.abs(b[1] - a[1]) * 0.3,
          Math.abs(c[0] - b[0]) * 0.3,
        );
        d = `M ${a} L ${b[0]} ${b[1] - Math.sign(b[1] - a[1]) * radius} Q ${b} ${b[0] + Math.sign(c[0] - b[0]) * radius} ${b[1]} L ${c}`;
      }
      const id = "thread-ink-" + threadId++;
      const color = tone ? "var(--context)" : "var(--accent)";
      return `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${start[0]}" y1="${start[1]}" x2="${finish[0]}" y2="${finish[1]}">
        <stop stop-color="${color}" stop-opacity="0"/><stop offset=".08" stop-color="${color}"/>
        <stop offset=".92" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
        <path class="plate-thread ${tone}" style="stroke:url(#${id})" stroke-linejoin="round" stroke-linecap="round"
        pathLength="1" opacity="${progress}" stroke-dasharray="${progress} 2" d="${d}"/>`;
    }
    entries.forEach((entry, i) => {
      const row = entry.getBoundingClientRect(),
        detail = results[i].getBoundingClientRect();
      const cx = phone ? detail.left : detail.left + detail.width / 2;
      const cy = phone ? detail.top + detail.height / 2 : detail.top;
      const from = view.ports[i];
      const appear = ramp(u, 22.3, 23.05);
      const inlet = phone
        ? cx
        : Math.max(detail.left + 8, Math.min(detail.right - 8, from.x));
      paths += path(
        "M " + from.x + " " + from.y + " L " + inlet + " " + cy,
        appear,
        "quiet",
      );
      if (!phone)
        paths += path(
          "M " + cx + " " + detail.bottom + " V " + row.top,
          appear,
        );
    });
    if (!phone) {
      const table = copy.querySelector(".plate-visit").getBoundingClientRect();
      paths += path(
        "M " + view.commit.x + " " + view.commit.y + " V " + table.bottom,
        ramp(u, 22.35, 23.1),
        "quiet",
      );
    }
    const first = entries[0].getBoundingClientRect(),
      last = entries[2].getBoundingClientRect();
    const base = phone ? last.bottom + 8 : last.bottom + 16;
    const target = view.signature;
    if (!phone) {
      for (const el of entries) {
        const r = el.getBoundingClientRect(),
          x = r.left + r.width / 2;
        paths += path(
          "M " + x + " " + r.bottom + " V " + base,
          view.gather,
          "quiet",
        );
      }
      paths += path(
        "M " +
          (last.left + last.width / 2) +
          " " +
          base +
          " H " +
          (first.left + first.width / 2),
        view.gather,
        "quiet",
      );
      for (let n = 0; n < 3; n++)
        paths += path(
          "M " +
            (first.left + first.width / 2 + n * 3) +
            " " +
            base +
            " V " +
            (target.y + n * 3) +
            " H " +
            target.x,
          view.gather,
        );
    }
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
  if (!locked && u < .23) idleTime = now / 1000;
  if (dirty || travelling || u !== old || intro !== oldIntro || (!locked && u < .23)) {
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
  $(".folio-reader-stage").append(...readerFront.map(el=>el.cloneNode(true)));
  $("#reader").hidden = false;
  if (at !== null) {
    const id = idFor(at);
    jump(id);
    // Load-time anchoring must run after the first document layout in the still edition.
    requestAnimationFrame(() => {
      if (reading) jump(id);
    });
  }
}
let contactFocus = false;
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
if (reduced.matches) staticPage();
else {
  try {
    const { createWorld } = await import("./world.js");
    prepareReplay();
    world = createWorld($("#world"));
    world.opening.materialsReady.then(()=>{dirty=true});
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
  posterPass: n => world?.opening.setPass(n),
  seek: (p, formation = 1, loop = 0, seconds = 0) => {
    idleTime = seconds;
    loopPhase = loop;
    seek(clamp(p) * end, formation);
  },
  renderer: world?.renderer,
  accent: setAccent,
};
