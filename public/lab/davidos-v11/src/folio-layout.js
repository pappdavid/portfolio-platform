import { Print } from "./folio-text.js";
import { names, short } from "./folio-records.js";
export function bounds(W, H) {
  const phone = W <= 740;
  const x = phone ? 14 : Math.round(W * 0.331),
    r = phone ? 15 : Math.round(W * 0.043);
  const top = phone
    ? Math.max(315, Math.min(390, H * 0.459))
    : Math.round(H * 0.192);
  const bottom = phone ? H - 104 : H - 151;
  return {
    phone,
    x,
    w: W - x - r,
    top,
    bottom,
    h: bottom - top,
    coverTop: phone ? Math.round(H * 0.275) : Math.round(H * 0.18),
  };
}
export function coverPrint(w, h, phone) {
  const p = new Print(),
    m = phone ? 11 : 30,
    bar = phone ? 37 : 64,
    dy = (h - bar - 10) / 3;
  p.text(
    "david@dev:~$ ps --featured",
    m,
    phone ? 25 : 41,
    phone ? 15 : 22,
    "accent",
    700,
  );
  const diagrams = [];
  names.forEach((n, i) => {
    const y = bar + i * dy,
      cw = phone ? w * 0.54 : w * 0.48;
    p.line(m, y, w - m, y, "rule", 1);
    p.text(
      n,
      m,
      y + (phone ? 28 : 53),
      phone ? 19 : Math.max(27, Math.min(32, w / 29)),
      "paper",
      700,
    );
    p.text(
      short[i],
      m,
      y + (phone ? 52 : 87),
      phone ? 15 : 18,
      "paper",
      400,
      cw - m,
    );
    diagrams.push([cw + 8, y + 8, w - cw - m - 7, dy - 16]);
  });
  return { p, diagrams, bar, dy };
}
