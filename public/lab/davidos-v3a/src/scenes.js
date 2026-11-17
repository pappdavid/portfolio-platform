// Coordinates use the plot's top-left as origin. The same paths supply GPU
// attractors and the still diagram used when WebGL is unavailable.
function line(points, weight = 1, tint = 0.25, start = -1, span = 0) {
  return { points, weight, tint, start, span };
}
function box(x, y, w, h, tint, start) {
  return line(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
      [x, y],
    ],
    2,
    tint,
    start,
    0.07,
  );
}
const label = (x, y, text, accent = false) => ({ x, y, text, accent });

const client = {
  title: "Source to snapshot",
  legend: "Source → excerpt → frozen snapshot",
  paths: [],
  labels: [
    label(0.14, 0.16, "Source · v2"),
    label(0.5, 0.16, "Fictional sample"),
    label(0.5, 0.32, "“up to 50 records”", true),
    label(0.46, 0.76, "Review"),
    label(0.65, 0.76, "Approve"),
    label(0.84, 0.76, "Activate"),
    label(0.84, 0.91, "Frozen snapshot", true),
  ],
  ends: [0.1, 0.35, 0.54, 0.75, 1],
  phases: [
    "Read source",
    "Lift exact excerpt",
    "Review excerpt",
    "Approve excerpt",
    "Activate snapshot",
  ],
};
for (let i = 0; i < 7; i++) {
  const y = 0.32 + i * 0.066;
  client.paths.push(
    line(
      [
        [0.055, y],
        [0.19 + (i % 3) * 0.02, y],
      ],
      1.2,
      i === 3 ? 1 : 0.06,
      i === 3 ? 0 : -1,
      0.1,
    ),
  );
}
client.paths.push(
  line(
    [
      [0.22, 0.518],
      [0.27, 0.518],
      [0.33, 0.39],
      [0.5, 0.39],
      [0.5, 0.44],
      [0.39, 0.44],
      [0.39, 0.58],
      [0.899, 0.58],
    ],
    4,
    0.8,
    0.1,
    0.78,
  ),
);
for (const [i, x] of [0.46, 0.65, 0.84].entries()) {
  client.paths.push(
    line(
      [
        [x - 0.016, 0.48],
        [x + 0.014, 0.48],
        [x + 0.014, 0.676],
        [x - 0.016, 0.676],
      ],
      1.5,
      0.64,
      0.37 + i * 0.22,
      0.09,
    ),
  );
}
client.paths.push(box(0.89, 0.52, 0.045, 0.12, 1, 0.9));

const companion = {
  title: "Transcript to evidence",
  legend: "Transcript lines → source-linked cards",
  paths: [],
  labels: [
    label(0.23, 0.14, "Fictional transcript"),
    label(0.76, 0.14, "Evidence cards"),
    label(0.76, 0.345, "Source · Mira"),
    label(0.76, 0.685, "Source · Noor"),
    label(0.18, 0.355, "Mira"),
    label(0.18, 0.645, "Noor"),
  ],
  ends: [0.17, 0.57, 1],
  phases: ["Stream transcript", "Extract evidence", "Trace to source"],
};
for (let i = 0; i < 8; i++) {
  const y = 0.26 + i * 0.073,
    end = 0.28 + (i % 3) * 0.035;
  companion.paths.push(
    line(
      [
        [0.06, y],
        [end, y],
      ],
      1.5,
      i === 2 || i === 6 ? 0.95 : 0.15,
      i * 0.055,
      0.12,
    ),
  );
  if (i === 2 || i === 6) {
    const dest = i === 2 ? 0.38 : 0.72;
    companion.paths.push(
      line(
        [
          [end, y],
          [0.4, y],
          [0.53, dest - 0.045],
          [0.63, dest - 0.045],
        ],
        2,
        0.7,
        0.25 + i * 0.04,
        0.25,
      ),
      box(0.63, dest - 0.09, 0.26, 0.18, 0.78, 0.55 + i * 0.035),
    );
  }
}
const fault = {
  title: "Retry paths",
  legend: "Request / lost response / retry",
  paths: [],
  labels: [
    label(0.17, 0.08, "Sender"),
    label(0.83, 0.08, "Receiver"),
    label(0.36, 0.16, "Request"),
    label(0.84, 0.32, "Receipt saved", true),
    label(0.52, 0.37, "Response lost"),
    label(0.28, 0.55, "Naive retry"),
    label(0.84, 0.69, "Duplicate", true),
    label(0.28, 0.77, "Same key"),
    label(0.68, 0.94, "Saved receipt returned", true),
  ],
  ends: [0.15, 0.24, 0.4, 0.65, 1],
  phases: [
    "Send request",
    "Save receipt",
    "Lose response",
    "Naive retry duplicates",
    "Same key reuses receipt",
  ],
};
const arrow = (x, y, dir, start) =>
  line(
    [
      [x - dir * 0.02, y - 0.022],
      [x, y],
      [x - dir * 0.02, y + 0.022],
    ],
    0.45,
    0.9,
    start,
    0.03,
  );
fault.paths.push(
  line(
    [
      [0.14, 0.23],
      [0.79, 0.23],
    ],
    3,
    0.7,
    0,
    0.14,
  ),
  arrow(0.78, 0.23, 1, 0.14),
  box(0.8, 0.19, 0.07, 0.08, 1, 0.14),
  line(
    [
      [0.8, 0.42],
      [0.58, 0.42],
    ],
    1.4,
    0.45,
    0.24,
    0.13,
  ),
  line(
    [
      [0.568, 0.4],
      [0.548, 0.45],
    ],
    0.25,
    0.9,
    0.38,
    0.02,
  ),
  line(
    [
      [0.548, 0.4],
      [0.568, 0.45],
    ],
    0.25,
    0.9,
    0.38,
    0.02,
  ),
  line(
    [
      [0.15, 0.61],
      [0.79, 0.61],
    ],
    2.5,
    0.6,
    0.4,
    0.15,
  ),
  arrow(0.78, 0.61, 1, 0.55),
  box(0.79, 0.57, 0.052, 0.08, 0.68, 0.56),
  box(0.855, 0.57, 0.052, 0.08, 0.95, 0.6),
  line(
    [
      [0.15, 0.82],
      [0.81, 0.82],
      [0.81, 0.87],
      [0.15, 0.87],
    ],
    4,
    0.8,
    0.66,
    0.32,
  ),
  arrow(0.15, 0.87, -1, 0.96),
);
export const scenes = [client, companion, fault];

export function pathAtlas(scene) {
  const width = 256,
    height = 128,
    data = new Float32Array(width * height * 4);
  const weight = scene.paths.reduce((n, p) => n + p.weight, 0);
  let row = 0,
    total = 0;
  for (const path of scene.paths) {
    total += path.weight;
    const lengths = path.points
      .slice(1)
      .map(([x, y], i) =>
        Math.hypot(x - path.points[i][0], y - path.points[i][1]),
      );
    const arc = lengths.reduce((a, b) => a + b);
    const end = Math.round((total / weight) * height);
    for (; row < end; row++) {
      for (let x = 0; x < width; x++) {
        const u = x / (width - 1);
        let dist = u * arc,
          i = 0;
        while (i < lengths.length - 1 && dist > lengths[i])
          dist -= lengths[i++];
        const a = path.points[i],
          b = path.points[i + 1],
          v = dist / lengths[i];
        data.set(
          [
            a[0] + (b[0] - a[0]) * v,
            a[1] + (b[1] - a[1]) * v,
            path.tint,
            path.start < 0 ? -1 : path.start + u * path.span,
          ],
          (row * width + x) * 4,
        );
      }
    }
  }
  return { width, height, data };
}
