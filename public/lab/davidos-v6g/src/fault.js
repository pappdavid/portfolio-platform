import { makeAtlas, heading, table, step } from "./atlas.js";
import { booking, beatPhase, faultFrame, clamp } from "./story.js";

export function fault(m) {
  const a = makeAtlas(m),
    panel = a.surface;
  const client = panel("Client", -5.05, 1.35, 0.1, 2.86, 3.08, {
    ry: 0.19,
    depth: 0.16,
  });
  const receiver = panel("Receiver", 3.28, 2.87, -0.76, 4.45, 1.47, {
    rx: -0.14,
    ry: -0.05,
    depth: 0.14,
  });
  const visits = panel("Visits", 3.73, 1.89, 0.3, 6.2, 0.86, {
    rx: -0.34,
    ry: -0.06,
    depth: 0.1,
    css: "visits",
  });
  const visitRows = [0, 1].map((i) =>
    panel("Visit record", 3.73, 1.1 - i * 0.68, 0.48 + i * 0.19, 6.2, 0.66, {
      rx: -0.34,
      ry: -0.06,
      ink: -0.75,
      depth: 0.07,
      css: "visit-row",
    }),
  );
  const receipts = panel("Receipts", 3.64, -0.28, 1.14, 5.94, 1.54, {
    rx: -0.3,
    ry: -0.08,
    depth: 0.11,
    css: "receipts",
  });
  const trace = panel("Trace", 0.18, -2.45, 1.26, 10.35, 2.89, {
    rx: -0.57,
    depth: 0.09,
    css: "trace",
  });
  const req = [
    [-3.62, 2.15, -0.1],
    [-3.03, 2.15, -1.7],
    [-2.33, 2.55, -1.7],
    [0.26, 2.55, -1.7],
    [1.17, 2.5, -0.66],
  ];
  const res = [
    [1.13, 1.55, 0.32],
    [0.67, 0.72, 1.23],
    [-1.56, 0.72, 1.23],
    [-3.17, 0.72, 1.23],
    [-3.62, 0.72, 0.2],
  ];
  a.path(req, -0.85, 0.038);
  a.path(res.slice(0, 3), -0.88, 0.038);
  a.path([[-2.16, 0.72, 1.23], ...res.slice(3)], -0.88, 0.038);
  const comparison = panel(
    "Fingerprint comparison",
    1.92,
    3.58,
    0.33,
    5.7,
    1.92,
    { css: "compare", ink: 0.95, depth: 0.07 },
  );
  const join = a.path([res[2], [-2.16, 0.72, 1.23]], -0.88, 0.038);
  const arrow = (x, y, z, dir) =>
    a.path(
      [
        [x - dir * 0.15, y + 0.09, z],
        [x, y, z],
        [x - dir * 0.15, y - 0.09, z],
      ],
      0.95,
    );
  arrow(-1.1, 2.55, -1.7, 1);
  arrow(-2.91, 0.72, 1.23, -1);
  const seam = panel("Request link", -1.1, 2.92, -1.72, 2.72, 0.45, {
    css: "link-label",
    ink: -0.32,
  });
  const gap = panel("Response link", -1.8, 0.38, 1.23, 3.04, 0.54, {
    css: "link-label",
    ink: -0.32,
  });
  const msg = panel("Message", 0, 0, 0, 2.7, 0.71, {
    ink: 0.96,
    fill: 0.085,
    css: "token",
  });
  function update(t) {
    const b = clamp(Math.floor(t + 0.5), 0, 5),
      p = beatPhase(t, b);
    const {
      run,
      trace: events,
      visits: rows,
      receipts: saved,
      observed,
    } = faultFrame(b, p);
    const level = (...beats) => (!b || beats.includes(b) ? 1 : 0.31);
    const fixed = run.config.adapter === "fixed";
    const fingerprint = saved[0]?.[1].fingerprint || "";
    client.set(
      heading("Client", "BOOKING") +
        table(
          ["field", "value"],
          Object.entries(booking).map(([k, v]) => [
            k,
            b === 5 && k === "slot" ? "11:00–11:30" : v,
          ]),
        ) +
        "<small>Idempotency-Key</small><b>" +
        booking.operation +
        "</b><small>observedId</small><b>" +
        observed +
        "</b>",
      level(1, 2, 3, 5),
    );
    receiver.set(
      heading("Receiver", "receive") +
        '<div class="controls"><i class="' +
        (!fixed ? "chosen" : "") +
        '">baseline</i><i class="' +
        (fixed ? "chosen" : "") +
        '">fixed</i></div><p>' +
        (b === 5
          ? "fingerprint ≠ candidate"
          : fixed
            ? "key → fingerprint → id"
            : "append → visit") +
        "</p>",
      level(1, 3, 4, 5),
    );
    const columns = ["id", "operation", "key", "service", "slot", "location"];
    const cells = (values) =>
      '<div class="visit-cols">' +
      values.map((v) => "<span>" + v + "</span>").join("") +
      "</div>";
    visits.set(
      heading(
        "Visits",
        rows.length + " " + (rows.length === 1 ? "visit" : "visits"),
      ) + cells(columns),
      level(1, 2, 3, 4, 5),
    );
    visitRows.forEach((face, i) => {
      const row = rows[i];
      const add = b === 3 && i === 1 ? step(p, 0.34, 0.66) : 1;
      face.obj.position.x = 3.73 - (1 - add) * 2.2;
      face.obj.position.z = 0.48 + i * 0.19 + (1 - add) * 0.85;
      face.el.classList.toggle("new-row", i === 1);
      face.set(row ? cells(columns.map((k) => row[k])) : "", 1, !!row);
    });
    comparison.set(
      heading(
        "Fingerprint comparison",
        p > 0.42 ? "409 · Conflict" : "same key",
      ) +
        table(
          ["", "fingerprint"],
          [
            [
              "Stored",
              fingerprint.replace(
                booking.slot,
                "<mark>" + booking.slot + "</mark>",
              ),
            ],
            [
              "Incoming",
              fingerprint.replace(booking.slot, "<mark>11:00–11:30</mark>"),
            ],
          ],
        ),
      1,
      b === 5,
    );
    const savedRow = saved.map(([k, v]) => [
      k,
      b === 5
        ? fingerprint.replace(booking.slot, "<mark>" + booking.slot + "</mark>")
        : fingerprint,
      v.id,
    ]);
    receipts.set(
      heading("Receipts", "fixed") +
        table(
          ["key", "fingerprint", "id"],
          savedRow,
          b === 4 && p > 0.32 ? 0 : -1,
        ),
      level(1, 4, 5),
      fixed,
    );
    trace.set(
      heading("Trace", run.config.adapter) +
        table(
          ["sequence", "attempt", "kind", "title", "detail"],
          events.map((e) => [e.sequence, e.attempt, e.kind, e.title, e.detail]),
          events.length - 1,
        ),
      level(2, 3, 4, 5),
    );
    const depth = events.length
      ? Math.min(1, 0.31 + events.length * 0.1)
      : 0.34;
    // Grow the log downwards with its event prefix, keeping its type at reading size.
    trace.obj.scale.y = depth;
    trace.el.style.setProperty("--log-height", depth);
    trace.obj.position.y = -1.12 - depth * 1.14;
    const lost = b === 2 && p > 0.39;
    join.visible = !lost;
    seam.set("Request link · before commit", b <= 1 ? 0.95 : 0.45);
    gap.obj.position.y = lost ? -0.02 : 0.38;
    gap.set(
      lost ? "Response lost · after commit" : "Response link · after commit",
      b === 2 || !b ? 1 : 0.45,
    );
    let path = req,
      f = step(p, 0, 0.55),
      text = "POST /visits",
      sub = "Idempotency-Key: " + booking.operation;
    if (b === 1 && p > 0.55) {
      text = "Committed";
      sub = rows[0]?.id || "";
    }
    if (b === 2) {
      path = res.slice(0, 3);
      f = step(p, 0, 0.52);
      text = lost ? "Response lost" : rows[0].id;
      sub = lost ? "after commit" : "Response";
    }
    if ((b === 3 || b === 4) && p > 0.62) {
      path = res;
      f = step(p, 0.62, 0.95);
      text = events.at(-1).title;
      sub = b === 3 ? "baseline" : "fixed";
    }
    if (b === 5) {
      text = p > 0.42 ? "409" : "POST /visits";
      sub =
        p > 0.42 ? "Key reused with a different payload" : "slot · 11:00–11:30";
      if (p > 0.42) {
        path = res;
        f = step(p, 0.42, 0.95);
      }
    }
    a.travel(msg, path, f);
    msg.obj.position.y += 0.48;
    msg.obj.position.z += 0.24;
    msg.set("<b>" + text + "</b><small>" + sub + "</small>", 1, b > 0);
  }
  return { ...a, update };
}
