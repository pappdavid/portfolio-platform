// Only the alphabet is rasterized. Names, stage labels and captions are HTML.
export const alphabet = Array.from(" .:–=+*#░▒▓█─╱│╲┌┐└┘┬┴├┤┼→←↑↓×═■");
export const projects = [
  {
    name: "client-studio",
    line: "Answers questions with exact quotes from supplied text.",
    kind: "Hosted workflow",
    proof: "65 tests",
    source: "Private source",
    detail:
      "An answer keeps its exact source excerpt. Review it, approve it, then activate a frozen snapshot.",
    sample: "Fictional sample · “What is the API batch limit?”",
    fact: "The hosted demo makes no AI calls.",
    demo: "https://client-studio-psi.vercel.app",
    steps: [
      "An exact excerpt is lifted out of the supplied text.",
      "The excerpt is ready for review.",
      "The reviewed answer passes approval.",
      "Activation freezes the approved answer in a snapshot.",
    ],
  },
  {
    name: "active-companion",
    line: "Turns transcript lines into traceable evidence cards.",
    kind: "Scripted replay",
    proof: "18 tests in CI",
    source: "Public MIT source",
    detail:
      "Replay four fictional conversations. Transcript lines become evidence cards, each naming the source it came from.",
    sample: "Fictional transcript · Each tether leads back to its speaker.",
    demo: "https://active-companion-replay.vercel.app",
    repo: "https://github.com/pappdavid/active-companion",
    steps: [
      "Lines from the fictional conversation arrive.",
      "A line from Mira condenses into a named evidence card.",
      "A second card stays tied to Noor’s original line.",
    ],
  },
  {
    name: "faultline",
    line: "Shows how a retry can create a duplicate.",
    kind: "Browser model",
    proof: "12 tests in CI",
    source: "Public MIT source",
    detail:
      "A receiver saves a receipt, but the reply gets lost. A plain retry duplicates the work. Reusing the same key returns the saved receipt.",
    demo: "https://davidpapp.dev/faultline/index.html",
    repo: "https://github.com/pappdavid/faultline",
    steps: [
      "The request reaches the receiver, which saves a receipt.",
      "The reply is lost before it reaches the sender.",
      "A plain retry does the work again, creating a duplicate.",
      "Reusing the key returns the saved receipt.",
    ],
  },
];
export function makeDiagram(index, w, h) {
  const cells = [],
    labels = [];
  const label = (x, y, text, group = -1) =>
    labels.push({ x: Math.round(x), y: Math.round(y), text, group });
  function put(x, y, g, group, progress = 0, angle = 0) {
    cells.push({ x, y, g, group, progress, angle });
  }
  function path(points, group, end = true, ink) {
    const steps = [];
    for (let i = 1; i < points.length; i++) {
      const [sx, sy] = points[i - 1],
        [ex, ey] = points[i];
      const dx = Math.sign(ex - sx),
        dy = Math.sign(ey - sy),
        len = Math.max(Math.abs(ex - sx), Math.abs(ey - sy));
      for (let k = 0; k <= len; k++) {
        if (i > 1 && !k) continue;
        steps.push([sx + dx * k, sy + dy * k, dx, dy]);
      }
    }
    steps.forEach(([x, y, dx, dy], j) => {
      let glyph = ink || (dx ? "─" : "│");
      const next = steps[j + 1];
      if (next && (next[2] !== dx || next[3] !== dy)) {
        const right = dx < 0 || next[2] > 0,
          down = dy < 0 || next[3] > 0;
        glyph = down ? (right ? "┌" : "┐") : right ? "└" : "┘";
      }
      if (end && !next)
        glyph = dx > 0 ? "→" : dx < 0 ? "←" : dy > 0 ? "↓" : "↑";
      put(
        x,
        y,
        glyph,
        group,
        j / Math.max(1, steps.length - 1),
        Math.atan2(dy, dx),
      );
    });
  }
  function box(x, y, width, height, group) {
    path(
      [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
        [x, y],
      ],
      group,
      false,
    );
    put(x, y, "┌", group);
  }
  const left = 1,
    right = w - 3,
    mid = Math.floor(w * 0.5),
    top = Math.max(1, Math.floor((h - 20) / 2));
  if (index === 0) {
    const end = Math.floor(w * 0.29),
      lift = Math.floor(w * 0.43),
      gateY = top + 14,
      last = right - 4;
    label(left, top, "Source v2");
    for (let i = 0; i < 4; i++) {
      for (let j = left; j <= end - [2, 0, 3, 6][i]; j++)
        if (i === 1 || j % 8 !== 0)
          put(
            j,
            top + 3 + i,
            i === 1 ? "═" : "=",
            i === 1 ? 0 : -1,
            (j - left) / end,
          );
    }
    path(
      [
        [end + 1, top + 4],
        [lift, top + 4],
        [lift, top + 2],
        [lift + 4, top + 2],
      ],
      0,
    );
    label(lift + 6, top + 2, "“up to 50 records”", 0);
    path(
      [
        [right - 6, top + 4],
        [right - 6, top + 9],
        [left + 4, top + 9],
        [left + 4, gateY - 1],
      ],
      1,
    );
    const gates = [left + 4, mid, last];
    gates.forEach((x, i) => {
      if (i < 2)
        path(
          [
            [x + 2, gateY],
            [gates[i + 1] - 2, gateY],
          ],
          i + 2,
        );
      box(x - 1, gateY - 1, 2, 2, i + 1);
      label(
        i === 0 ? left : i === 1 ? mid - 4 : last - 8,
        gateY + 2,
        ["Review", "Approve", "Activate"][i],
        i + 1,
      );
    });
  } else if (index === 1) {
    const end = Math.floor(w * 0.32),
      branch = Math.floor(w * 0.46),
      card = Math.floor(w * 0.61);
    label(left, top, "Transcript");
    label(card, top, "Evidence cards");
    for (let i = 0; i < 2; i++) {
      const y = top + 4 + i * 8;
      label(left, y - 1, ["Mira", "Noor"][i], i + 1);
      for (let k = 0; k < 3; k++)
        for (let x = left; x <= end - [0, 4, 2][k]; x++)
          if (x % 7 !== 0 || !k)
            put(
              x,
              y + 1 + k,
              k === 0 ? "═" : "=",
              k === 0 ? i + 1 : 0,
              (x - left) / end,
            );
      path(
        [
          [end + 1, y + 1],
          [branch + i * 2, y + 1],
          [branch + i * 2, y + 3],
          [card - 1, y + 3],
        ],
        i + 1,
      );
      box(card, y, right - card, 5, i + 1);
      label(card + 3, y + 2, ["Source: Mira", "Source: Noor"][i], i + 1);
    }
  } else {
    const a = left + 1,
      b = right - 6,
      split = Math.floor(w * 0.52);
    const names = [
      ["Request", "Receipt saved"],
      ["Reply lost", "Response"],
      ["Plain retry", "Duplicate"],
      ["Saved receipt", "Same key"],
    ];
    for (let i = 0; i < 4; i++) {
      const y = top + 5 * i;
      label(left, y, names[i][0], i);
      label(right - Math.ceil(names[i][1].length * 1.2), y, names[i][1], i);
      const row = y + 2;
      if (i === 1) {
        path(
          [
            [b, row],
            [split, row],
          ],
          i,
          false,
        );
        put(split - 1, row, "×", i, 1, Math.PI);
      } else
        path(
          i === 3
            ? [
                [b, row],
                [a, row],
              ]
            : [
                [a, row],
                [b, row],
              ],
          i,
        );
      if (i === 0 || i === 2) {
        box(b + 1, row - 1, 2, 2, i);
        if (i === 2) box(b + 4, row - 1, 2, 2, i);
      }
      if (i === 3) put(b + 1, row, "■", i);
    }
  }
  return { cells, labels };
}

// Project an actual tube surface into terminal cells. The depth test keeps the
// crossings legible. Tangent and surface light become inputs to the flow solver.
export function knot(w, h) {
  const data = new Uint8Array(w * h * 4),
    depth = new Float32Array(w * h).fill(-Infinity);
  const center = (t) => {
    // Front projection of a trefoil retains three open lobes and alternating crossings.
    const x = Math.sin(t) + 2 * Math.sin(2 * t),
      y = Math.cos(t) - 2 * Math.cos(2 * t),
      z = -Math.sin(3 * t);
    return [
      x * 0.89 - y * 0.45,
      (x * 0.45 + y * 0.89) * 0.97 + z * 0.23,
      z * 0.97 - (x * 0.45 + y * 0.89) * 0.23,
    ];
  };
  const unit = (v) => {
    const d = Math.hypot(...v);
    return v.map((x) => x / d);
  };
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const radius = 0.42;
  let x0 = Infinity,
    y0 = Infinity,
    x1 = -Infinity,
    y1 = -Infinity;
  for (let i = 0; i < 360; i++) {
    const [x, y] = center((i * Math.PI) / 180);
    x0 = Math.min(x0, x - radius);
    y0 = Math.min(y0, y - radius);
    x1 = Math.max(x1, x + radius);
    y1 = Math.max(y1, y + radius);
  }
  for (let i = 0; i < 720; i++) {
    const t = (i * Math.PI) / 360,
      c = center(t),
      next = center(t + 0.001);
    const tangent = unit(next.map((v, k) => v - c[k]));
    const normal = unit(cross(tangent, [0, 0, 1])),
      binormal = cross(tangent, normal);
    for (let j = 0; j < 100; j++) {
      const v = (j * Math.PI) / 50;
      const n = normal.map(
        (x, k) => x * Math.cos(v) + binormal[k] * Math.sin(v),
      );
      const x = Math.floor(
          w * (0.035 + (0.93 * (c[0] + radius * n[0] - x0)) / (x1 - x0)),
        ),
        y = Math.floor(
          h * (0.035 + (0.93 * (c[1] + radius * n[1] - y0)) / (y1 - y0)),
        );
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const z = c[2] + radius * n[2],
        k = y * w + x;
      if (z <= depth[k]) continue;
      depth[k] = z;
      const lit = Math.max(0, -0.3 * n[0] - 0.74 * n[1] + 0.6 * n[2]);
      data.set(
        [
          Math.round(62 + lit * 186),
          Math.round(127 + 120 * tangent[0]),
          Math.round(127 + 120 * tangent[1]),
          Math.round(
            135 + 65 * Math.cos(v * 7 + t * 5) + 52 * Math.sin(t * 13),
          ),
        ],
        4 * k,
      );
    }
  }
  return data;
}
