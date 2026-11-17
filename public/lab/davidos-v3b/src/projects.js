export const projects = [
  {
    name: "client-studio",
    kind: "Hosted workflow",
    proof: "65 tests",
    demo: "https://client-studio-psi.vercel.app",
    line: "Answers questions with exact excerpts from supplied text.",
    story:
      "The answer to “What is the API batch limit?” cites “up to 50 records” from source version 2. Review and approve the answer, then activate a frozen snapshot.",
    facts: "65 tests · No AI calls in demo · Private source",
    caption: "Excerpt workflow",
    labels: [
      [0.18, 0.09, "Fictional source · v2"],
      [0.155, 0.56, "up to 50 records", 1],
      [0.44, 0.67, "Review"],
      [0.63, 0.67, "Approve"],
      [0.83, 0.67, "Activate"],
      [0.85, 0.16, "Frozen snapshot", 1],
    ],
  },
  {
    name: "active-companion",
    kind: "Scripted replay",
    proof: "18 tests in CI",
    demo: "https://active-companion-replay.vercel.app",
    source: "https://github.com/pappdavid/active-companion",
    line: "Turns transcript lines into evidence cards with named sources.",
    story:
      "Replay four fictional conversations. Selected transcript lines condense into evidence cards. Each tether leads back to the line that supplied the evidence.",
    facts: "18 tests in CI · Public MIT source",
    caption: "Transcript to evidence",
    labels: [
      [0.21, 0.09, "Fictional transcript"],
      [0.75, 0.09, "Evidence cards"],
      [0.77, 0.34, "Intake notes", 1],
      [0.77, 0.72, "Review notes", 1],
    ],
  },
  {
    name: "faultline",
    kind: "Browser model",
    proof: "12 tests in CI",
    demo: "https://davidpapp.dev/faultline/index.html",
    source: "https://github.com/pappdavid/faultline",
    line: "Shows how to retry a request without duplicating its effect.",
    story:
      "The receiver saves a receipt, but the response is lost. A naive retry duplicates the effect. Retrying with the same key returns the saved receipt.",
    facts: "12 tests in CI · Public MIT source",
    caption: "Retry paths",
    labels: [
      [0.12, 0.1, "Sender"],
      [0.8, 0.1, "Receiver"],
      [0.14, 0.24, "Request"],
      [0.8, 0.24, "Save receipt", 1],
      [0.38, 0.41, "Lost response"],
      [0.14, 0.6, "Naive retry"],
      [0.8, 0.6, "Duplicate"],
      [0.14, 0.79, "Same key"],
      [0.48, 0.92, "Saved receipt", 1],
    ],
  },
];

// Each polyline is an emitter. Phase intervals determine when its dye and
// directional force peak during the replay. Coordinates follow the DOM plot.
export function diagramLines(name) {
  const lines = [];
  const line = (points, start, end, weight = 1) =>
    lines.push({ points, start, end, weight });
  const rect = (x, y, w, h, a, b, weight) =>
    line(
      [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
        [x, y],
      ],
      a,
      b,
      weight,
    );
  const wave = (x1, y1, x2, y2, bend = 0) =>
    Array.from({ length: 37 }, (_, i) => {
      const t = i / 36,
        s = t * t * (3 - 2 * t);
      return [
        x1 + (x2 - x1) * t,
        y1 + (y2 - y1) * s + Math.sin(t * Math.PI) * bend,
      ];
    });
  if (name === "client-studio") {
    for (let j = 0; j < 8; j++) {
      const y = 0.24 + j * 0.064;
      line(
        [
          [0.055, y],
          [0.24 + (j % 3) * 0.022, y],
        ],
        0,
        0.16,
        j === 5 ? 1 : 0.42,
      );
    }
    for (let j = -3; j <= 3; j++)
      line(
        wave(0.18, 0.56 + j * 0.008, 0.43, 0.4 + j * 0.012, -0.055),
        0.12,
        0.34,
      );
    for (let j = 0; j < 3; j++) {
      const x = 0.44 + j * 0.195;
      line(
        [
          [x - 0.014, 0.31],
          [x - 0.014, 0.52],
          [x + 0.016, 0.52],
        ],
        0.34 + j * 0.18,
        0.44 + j * 0.18,
      );
      line(
        [
          [x + 0.016, 0.49],
          [x + 0.016, 0.28],
          [x - 0.014, 0.28],
        ],
        0.37 + j * 0.18,
        0.47 + j * 0.18,
      );
      for (let k = -3; k <= 3; k++)
        line(
          wave(
            x,
            0.4 + k * 0.012,
            j === 2 ? 0.946 : x + 0.195,
            0.4 + k * 0.012,
            0.011,
          ),
          0.41 + j * 0.18,
          0.55 + j * 0.18,
        );
    }
    rect(0.91, 0.32, 0.052, 0.16, 0.86, 0.98);
  } else if (name === "active-companion") {
    for (let j = 0; j < 10; j++) {
      const y = 0.18 + 0.071 * j;
      line(
        wave(0.04, y, 0.34 + (j % 4) * 0.026, y),
        j * 0.026,
        0.33 + j * 0.027,
        j === 2 || j === 7 ? 1 : 0.5,
      );
    }
    for (const [i, y] of [0.34, 0.72].entries()) {
      for (let j = -3; j <= 3; j++)
        line(
          wave(
            0.335,
            0.18 + (i ? 7 : 2) * 0.071 + j * 0.006,
            0.62,
            y + j * 0.012,
            i ? -0.06 : 0.09,
          ),
          0.29 + i * 0.17,
          0.64 + i * 0.17,
        );
      rect(0.62, y - 0.12, 0.3, 0.24, 0.6 + i * 0.12, 0.89 + i * 0.1);
      line(
        [
          [0.65, y + 0.075],
          [0.87, y + 0.075],
        ],
        0.74,
        0.99,
        0.65,
      );
    }
  } else if (name === "faultline") {
    const lanes = [
      [0.2, 0.24, 0.885, 0.24, 0.0, 0.18],
      [0.88, 0.41, 0.49, 0.41, 0.2, 0.36],
      [0.23, 0.6, 0.88, 0.6, 0.39, 0.57],
      [0.23, 0.79, 0.88, 0.79, 0.61, 0.79],
      [0.88, 0.91, 0.19, 0.91, 0.81, 0.99],
    ];
    for (const [a, y, b, v, s, e] of lanes) {
      for (let k = -2; k <= 2; k++)
        line(wave(a, y + k * 0.009, b, v + k * 0.009, k * 0.006), s, e);
      const sign = Math.sign(b - a);
      line(
        [
          [b - 0.018 * sign, y - 0.034],
          [b, y],
          [b - 0.018 * sign, y + 0.034],
        ],
        e - 0.035,
        e,
      );
    }
    line(
      [
        [0.89, 0.25],
        [0.92, 0.25],
        [0.92, 0.41],
        [0.88, 0.41],
      ],
      0.17,
      0.24,
    );
    line(
      [
        [0.88, 0.79],
        [0.92, 0.79],
        [0.92, 0.91],
        [0.88, 0.91],
      ],
      0.77,
      0.84,
    );
    line(
      [
        [0.48, 0.37],
        [0.5, 0.45],
      ],
      0.33,
      0.37,
    );
    line(
      [
        [0.5, 0.37],
        [0.48, 0.45],
      ],
      0.33,
      0.37,
    );
    rect(0.91, 0.54, 0.035, 0.074, 0.55, 0.59);
    rect(0.925, 0.568, 0.035, 0.074, 0.57, 0.61);
  }
  return lines;
}
