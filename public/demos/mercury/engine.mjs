// Synthetic full-state fixtures. No model calls or benchmark measurements.
export const scenarios = {
  atlas: {
    title: "An atlas of quiet places",
    kicker: "FIELD NOTES / 01",
    subtitle: "A little distance. A different perspective.",
    labels: ["Observe", "Wander", "Connect", "Return"],
    color: "#db5a2a",
    note: "Map a slower route through the city. Keep the places that invite you to pause.",
  },
  orbit: {
    title: "A mission taking shape",
    kicker: "ORBITAL STUDY / 02",
    subtitle: "From a scattered signal to a shared direction.",
    labels: ["Discover", "Design", "Build", "Release"],
    color: "#386e8c",
    note: "A fictional mission plan, rendered from complete text snapshots. Each revision replaces the last.",
  },
  signal: {
    title: "Finding the signal",
    kicker: "SYSTEM STUDY / 03",
    subtitle: "Trace the edges. Keep the evidence.",
    labels: ["Detect", "Contain", "Inspect", "Recover"],
    color: "#71813c",
    note: "An illustrative incident map. Follow the path from observation to a verified recovery.",
  },
};
export const totalFrames = 16;
export function fixture(name, index) {
  const s = scenarios[name] || scenarios.atlas;
  const p = Math.min(1, Math.max(0, index / (totalFrames - 1)));
  return JSON.stringify({
    version: 1,
    kicker: s.kicker,
    title:
      p < 0.25
        ? "A shape is emerging"
        : p < 0.55
          ? s.title.replace(/\S+$/, "…")
          : s.title,
    subtitle: p < 0.4 ? "Fragments becoming a composition." : s.subtitle,
    note:
      p < 0.7
        ? "The layout holds its position while the text and connections are revised."
        : s.note,
    color: s.color,
    nodes: s.labels.map((label, i) => ({
      id: "node-" + i,
      label: p < 0.2 ? "Fragment " + (i + 1) : label,
      x: 110 + [0, 260, 450, 220][i] + Math.sin(i * 3 + index) * 32 * (1 - p),
      y: 110 + [90, -20, 140, 270][i] + Math.cos(i * 2 + index) * 24 * (1 - p),
    })),
    edges:
      p < 0.35
        ? [
            [0, 1],
            [1, 2],
          ]
        : [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            [1, 3],
          ],
    phase: Math.round(p * 100),
  });
}
export function validateSnapshot(raw) {
  if (typeof raw !== "string" || raw.length > 20000)
    throw new Error("Frame must be a bounded text snapshot.");
  let s;
  try {
    s = JSON.parse(raw);
  } catch {
    throw new Error("Incomplete JSON. Previous valid frame retained.");
  }
  const bounded = (v, max) =>
    typeof v === "string" && v.length > 0 && v.length <= max;
  if (
    !s ||
    s.version !== 1 ||
    !bounded(s.title, 100) ||
    !bounded(s.subtitle, 160) ||
    !bounded(s.kicker, 60) ||
    !bounded(s.note, 300) ||
    !/^#[0-9a-f]{6}$/i.test(s.color) ||
    !Number.isFinite(s.phase) ||
    s.phase < 0 ||
    s.phase > 100
  )
    throw new Error("Snapshot does not match the page schema.");
  if (
    !Array.isArray(s.nodes) ||
    s.nodes.length !== 4 ||
    new Set(s.nodes.map((n) => n?.id)).size !== 4 ||
    !s.nodes.every(
      (n) =>
        n &&
        bounded(n.id, 30) &&
        bounded(n.label, 40) &&
        Number.isFinite(n.x) &&
        n.x >= 60 &&
        n.x <= 620 &&
        Number.isFinite(n.y) &&
        n.y >= 60 &&
        n.y <= 480,
    )
  )
    throw new Error("Invalid diagram nodes.");
  if (
    !Array.isArray(s.edges) ||
    s.edges.length > 8 ||
    !s.edges.every(
      (e) =>
        Array.isArray(e) &&
        e.length === 2 &&
        e.every((i) => Number.isInteger(i) && i >= 0 && i < 4),
    )
  )
    throw new Error("Invalid diagram connections.");
  return s;
}
export function transition(state, raw) {
  try {
    return {
      ...state,
      page: validateSnapshot(raw),
      accepted: state.accepted + 1,
      error: null,
    };
  } catch (error) {
    return { ...state, rejected: state.rejected + 1, error: error.message };
  }
}

// HTMLCollection is live: snapshot before removals so adjacent stale nodes
// are not skipped when full-state frames replace the diagram.
export function pruneStaleNodes(children, ids) {
  for (const existing of [...children]) {
    if (!ids.has(existing.getAttribute("data-node"))) existing.remove();
  }
}
