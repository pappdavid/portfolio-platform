import { makeAtlas, heading, field, step } from "./atlas.js";
import { sourceReplay as data, beatPhase, clamp } from "./story.js";

// The projected type and the ink share the same document edges.
const documentWordLengths = [
  [
    9, 7, 1, 9, 10, 3, 3, 3, 6, 3, 7, 2, 8, 3, 6, 3, 3, 4, 4, 11, 7, 2, 2, 2, 8,
    3, 11, 3, 11,
  ],
  [
    9, 7, 1, 9, 10, 3, 3, 3, 6, 3, 7, 3, 8, 3, 6, 3, 3, 4, 4, 11, 7, 2, 2, 2, 8,
    3, 11, 3, 11,
  ],
  [
    9, 13, 5, 2, 3, 7, 4, 2, 3, 2, 9, 2, 3, 7, 1, 6, 5, 6, 7, 1, 5, 3, 1, 7, 10,
    2, 7, 8, 7, 8, 15, 4, 5, 2, 8, 2, 10,
  ],
];
export function studio(m) {
  const a = makeAtlas(m),
    panel = a.surface;
  const author = panel("Studio page", -4.65, 2.48, 0.4, 3.15, 5.2, {
    ry: 0.31,
    depth: 0.16,
    css: "browser",
  });
  const runtime = panel("Customer runtime", 5.05, 1.65, 0.3, 2.85, 3.25, {
    ry: -0.37,
    depth: 0.14,
    css: "browser",
  });
  const route = panel("Server route", -0.2, 0.57, 1.1, 3.55, 1.36, {
    rx: -0.18,
    css: "route",
  });
  const lookup = panel(
    "Audience filter and lexical retrieval",
    0.05,
    2.0,
    -0.35,
    3.8,
    1.22,
    { rx: -0.32 },
  );
  const store = panel("PostgreSQL", -0.2, 3.56, -3.35, 6.7, 3.1, {
    rx: -1.06,
    ink: -0.6,
    fill: -0.025,
  });
  const docs = data.sources.map((s, i) =>
    panel(
      "Source v" + s.version,
      -2.4 + i * 0.83,
      3.65 + i * 0.18,
      -1.65 + i * 0.37,
      2.65,
      2.9,
      {
        rx: -0.3,
        ry: -0.15 + i * 0.17,
        rz: 0.14 - i * 0.13,
        css: "document",
        draw(g, w, h) {
          // Only word lengths leave the private source. Contours preserve wrapping without disclosing text.
          let x = 0,
            y = h * 0.23;
          for (const len of documentWordLengths[i]) {
            const extent = len * 0.031;
            if (x + extent > w * 0.83) {
              x = 0;
              y -= 0.103;
            }
            const at = -w * 0.42 + x;
            g.line([at, y, 0.015], [at + extent, y, 0.015], -0.56);
            x += extent + 0.045;
          }
        },
      },
    ),
  );
  const snapshot = panel("Frozen snapshot", 2.65, 3.1, -1.75, 2.5, 2.05, {
    ry: -0.18,
    rx: -0.3,
    depth: 0.13,
  });
  const gateway = panel("Model gateway", 3.98, 4.72, -3.3, 2.5, 0.84, {
    ry: -0.22,
    ink: -0.32,
    fill: -0.025,
  });
  const excerpt = panel("Quoted excerpt", 0, 0, 0, 3.45, 0.69, {
    ink: 1,
    fill: 0.095,
    depth: 0.025,
    css: "token",
  });
  const message = panel("Studio request", 0, 0, 0, 3.1, 0.74, {
    ink: 0.9,
    fill: 0.055,
    css: "token",
  });
  const left = [-3.08, 1.52, 0.4],
    entry = [-1.75, 0.6, 1.1],
    right = [3.62, 1.5, 0.3],
    exit = [1.57, 0.6, 1.1];
  for (const coords of [
    [left, [-2.55, 1.52, 0.4], [-2.55, 0.6, 1.1], entry],
    [exit, [2.5, 0.6, 1.1], [2.5, 1.5, 0.3], right],
    [
      [-0.2, 1.25, 1.1],
      [-0.2, 1.5, -0.35],
    ],
    [
      [0.5, 2.6, -0.35],
      [0.5, 2.8, -2.75],
    ],
    [
      [1.5, 3, -2.75],
      [2.65, 3.1, -1.75],
    ],
  ])
    a.path(coords);
  const buttons = (b, p) =>
    '<div class="controls"><i class="' +
    (b === 4 ? "chosen" : "") +
    '">' +
    (b >= 4 && p > 0.25 ? "Approved" : "Approve") +
    '</i><i class="' +
    (b >= 4 && p > 0.64 ? "chosen" : "") +
    '">' +
    (b >= 4 && p > 0.64 ? "Active" : "Activate") +
    "</i></div>";
  function update(t) {
    const b = clamp(Math.floor(t + 0.5), 0, 5),
      p = beatPhase(t, b),
      active = b > 4 || (b === 4 && p > 0.64);
    const q = b > 0 ? data.question : "";
    const quote = b > 2 || (b === 2 && p > 0.66) ? data.excerpt : "";
    const level = (...beats) => (!b || beats.includes(b) ? 1 : 0.37);
    author.set(
      heading("Studio page") +
        field(
          "Sources",
          '<div class="source-tags">v1 · public<br>v2 · public<br>v2 · internal</div>',
        ) +
        field("Question", q || "Ask a question") +
        field("Answer", quote ? "<mark>" + quote + "</mark>" : "") +
        field("Review", buttons(b, active ? 1 : p)),
      level(1, 2, 4, 5),
    );
    runtime.set(
      heading("Customer runtime") +
        field(
          "Active evidence",
          active ? "v2 · public<br><q>" + data.excerpt + "</q>" : "",
        ) +
        field("Question") +
        field("Answer"),
      level(4, 5),
    );
    route.set(
      heading("Server route", "POST") +
        '<div class="route-cols"><div><small>Anonymous session</small>Cookie → Workspace</div><div><small>Command handler</small>' +
        (b === 5 ? "Expected ≠ current" : "Review · Activate") +
        "</div></div>",
      level(1, 4, 5),
    );
    lookup.set(
      heading("Audience filter", "Customer") +
        '<div class="flow-row"><b>public</b> → Lexical retrieval</div><div class="flow-row muted">internal ' +
        (b === 3 ? "⊣ Withheld" : "⊣") +
        "</div>",
      level(2, 3),
    );
    store.set(heading("PostgreSQL", "Versioned sources"), level(2, 3, 4));
    docs.forEach((d, i) => {
      const s = data.sources[i],
        chosen = i === 1;
      d.obj.position.x = [-2.64, -0.92, 0.95][i];
      d.obj.position.y = [3.24, 3.69, 3.45][i];
      d.obj.position.z = [-2.05, -0.61, -2.02][i];
      d.set(
        heading("v" + s.version, s.visibility) +
          '<div class="source-body" aria-label="Source text">' +
          documentWordLengths[i]
            .map((n) => '<i style="width:' + n * 2.22 + 'px"></i>')
            .join("") +
          "</div>" +
          (chosen ? "<blockquote>" + data.excerpt + "</blockquote>" : "") +
          (i === 2 && b === 3 ? '<b class="stop">Withheld</b>' : ""),
        level(2, 3),
      );
    });
    const activation = b === 4 ? step(p, 0.28, 0.78) : b > 4 ? 1 : 0;
    snapshot.obj.position.set(
      2.65 + 0.32 * activation,
      3.1 + 0.14 * activation,
      -1.75 + 2.75 * activation,
    );
    snapshot.set(
      heading("Frozen snapshot", active ? "Active" : "") +
        field("Configuration", active ? "Customer" : "") +
        field(
          "Source",
          active ? "v2 · public<br><q>" + data.excerpt + "</q>" : "",
        ),
      level(4, 5),
    );
    gateway.set(
      heading("Model gateway") + "<small>off in this demo</small>",
      b ? 0.22 : 0.78,
    );
    const lift = step(p, 0.16, 0.95);
    excerpt.obj.position.set(
      -1.12 - 1.53 * lift,
      3.77 + 0.31 * lift,
      0.15 + 1.8 * lift,
    );
    excerpt.obj.rotation.set(-0.15 * (1 - lift), 0.1, 0);
    excerpt.set(
      "<strong>“" + data.excerpt + "”</strong>",
      1,
      b === 2 && p > 0.08,
    );
    let coords = [left, entry],
      content = data.question;
    if (b === 3) {
      coords = [
        [0.5, 3.45, -1],
        [0.6, 2.3, -0.2],
        [0.5, 1.95, 0.18],
      ];
      content = "internal · Withheld";
    }
    if (b === 4) {
      coords = [entry, [2.65, 3.1, -1.5], exit, right];
      content = p < 0.25 ? "Review" : p < 0.65 ? "Approved" : "Active · v2";
    }
    if (b === 5) {
      coords = [left, entry, [-0.1, 0.7, 1.4], entry, left];
      content =
        p < 0.38 ? "Stale edit" : data.late.status + " · Revision conflict";
    }
    a.travel(message, coords, step(p, 0.05, 0.94));
    message.obj.position.y += 0.76;
    message.obj.position.z += 0.55;
    message.set(
      "<b>" + content + "</b>",
      1,
      [1, 3, 4, 5].includes(b) && !(b === 4 && p > 0.94),
    );
  }
  return { ...a, update };
}
