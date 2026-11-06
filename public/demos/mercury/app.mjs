import { fixture, scenarios, totalFrames, transition, pruneStaleNodes } from "./engine.mjs";
const $ = (id) => document.getElementById(id);
const svgNS = "http://www.w3.org/2000/svg";
let state = { page: null, accepted: 0, rejected: 0, error: null };
let index = 0,
  scene = "atlas",
  timer = null;
const trace = [];
let droppedEvents = 0;
function record(event) {
  if (trace.length >= 500) {
    trace.shift();
    droppedEvents++;
  }
  trace.push(event);
}
function svg(tag, attrs) {
  const el = document.createElementNS(svgNS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  return el;
}
function stop(label = "Paused") {
  clearTimeout(timer);
  timer = null;
  $("play").textContent = "▶ Play stream";
  $("play-state").textContent = label;
}
function render(raw) {
  state = transition(state, raw);
  record({
    event: "frame",
    index,
    scene,
    accepted: !state.error,
    error: state.error,
    snapshot: raw,
  });
  $("accepted").textContent = state.accepted;
  $("rejected").textContent = state.rejected;
  $("gate-status").textContent =
    state.error || "Schema valid. Composition committed.";
  $("gate-status").classList.toggle("error", !!state.error);
  $("raw").textContent = raw;
  if (state.error) return;
  const s = state.page;
  for (const key of ["kicker", "title", "subtitle", "note"])
    $(key).textContent = s[key];
  $("page").style.setProperty("--accent", s.color);
  $("diagram").style.opacity = String(0.4 + s.phase * 0.006);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $("diagram").animate([{ filter: "blur(1.5px)" }, { filter: "blur(0)" }], {
      duration: 400,
    });
  }
  $("stage").textContent =
    s.phase === 100 ? "RESOLVED" : s.phase < 40 ? "FORMING" : "REFINING";
  $("diagram").setAttribute(
    "aria-label",
    `${s.title}. Nodes: ${s.nodes.map((n) => n.label).join(", ")}. Connections: ${s.edges.map(([a, b]) => `${s.nodes[a].label} to ${s.nodes[b].label}`).join("; ")}.`,
  );
  const edges = s.edges.map(([a, b]) =>
    svg("line", {
      x1: s.nodes[a].x,
      y1: s.nodes[a].y,
      x2: s.nodes[b].x,
      y2: s.nodes[b].y,
      class: "edge",
    }),
  );
  $("edges").replaceChildren(...edges);
  // Reuse SVG node identities across full-state replacements. No generated HTML.
  const ids = new Set(s.nodes.map((n) => n.id));
  pruneStaleNodes($("nodes").children, ids);
  for (const n of s.nodes) {
    let g = $("nodes").querySelector(`[data-node="${CSS.escape(n.id)}"]`);
    if (!g) {
      g = svg("g", { "data-node": n.id });
      g.append(
        svg("circle", { r: 17, class: "node-ring" }),
        svg("circle", { r: 4, class: "node-dot" }),
        svg("text", { y: 35, "text-anchor": "middle", class: "node-label" }),
      );
      $("nodes").append(g);
    }
    g.setAttribute("transform", `translate(${n.x} ${n.y})`);
    g.querySelector("text").textContent = n.label;
  }
  $("frame").value = index;
  $("frame-output").textContent =
    String(index + 1).padStart(2, "0") + " / " + totalFrames;
  $("phase-label").textContent =
    "FRAME " + String(index + 1).padStart(2, "0") + " / " + totalFrames;
}
function show() {
  render(fixture(scene, index));
}
function tick() {
  timer = setTimeout(
    () => {
      if (index < totalFrames - 1) {
        index++;
        show();
      }
      if (index === totalFrames - 1) {
        stop("Replay complete");
      } else tick();
    },
    Number($("speed").value),
  );
}
function play() {
  if (timer) {
    stop();
    return;
  }
  if (index === totalFrames - 1) {
    index = 0;
    show();
  }
  $("play").textContent = "Ⅱ Pause stream";
  $("play-state").textContent = "Replaying synthetic frames";
  tick();
}
$("play").addEventListener("click", play);
$("reset").addEventListener("click", () => {
  stop("Reset to first frame");
  index = 0;
  show();
});
$("frame").addEventListener("input", (e) => {
  stop("Scrubbing synthetic frames");
  index = Number(e.target.value);
  show();
});
$("scene").addEventListener("change", (e) => {
  if (!Object.hasOwn(scenarios, e.target.value)) return;
  stop("Composition changed");
  scene = e.target.value;
  index = 0;
  show();
});
$("speed").addEventListener("change", () => {
  if (timer) {
    clearTimeout(timer);
    tick();
  }
});
$("invalid").addEventListener("click", () => {
  stop("Invalid frame rejected");
  render('{"version":1,"title":"Unfinished');
});
$("interrupt").addEventListener("click", () => {
  stop("Interrupted. Last valid frame retained.");
  record({ event: "interrupt", scene, index });
  $("gate-status").textContent =
    "Stream interrupted. Last valid composition retained. Resume with Play.";
  $("gate-status").classList.add("error");
});
$("download").addEventListener("click", () => {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          source: "synthetic",
          description:
            "Hand-authored fixtures. No live Mercury calls or performance measurements.",
          accepted: state.accepted,
          rejected: state.rejected,
          droppedEvents,
          traceLimit: 500,
          events: trace,
        },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mercury-renderer-synthetic-trace.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && timer) stop("Paused while tab is hidden");
});
show();
