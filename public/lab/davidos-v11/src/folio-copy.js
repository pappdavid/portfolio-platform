import { acts, linkedin, github } from "./story.js";
import { sentences, legends, captions, disclosures } from "./folio-records.js";
export const esc = (v) =>
  String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
export function links(i) {
  const a = acts[i];
  return (
    '<a href="' +
    a.demo +
    '">Demo ↗</a>' +
    (a.repo ? ' <a href="' + a.repo + '">Source ↗</a>' : "")
  );
}
export function details(i) {
  const a = acts[i];
  return (
    "<details><summary>Project details</summary><dl>" +
    ["stack", "proof", "scope"]
      .map((k) => "<dt>" + k + "</dt><dd>" + esc(a[k]) + "</dd>")
      .join("") +
    '</dl><div class="actions">' +
    links(i) +
    "</div></details>"
  );
}
export function identity(ending = false) {
  return (
    '<div class="identity"><p class="prompt">david@dev:~$ <b>' +
    (ending ? "ps --featured" : "whoami") +
    '</b></p><h1 aria-label="David Papp"><span class="folio-mark" aria-hidden="true"></span>Papp<span class="point">.</span></h1><p class="role">AI solution developer</p><p class="available">Rotterdam, NL · Open to full-time work</p><div class="actions"><a class="primary" href="/cv.pdf">Résumé ↗</a>' +
    (ending
      ? '<a href="' +
        linkedin +
        '" data-contact>Contact ↗</a><a href="' +
        github +
        '">GitHub ↗</a>'
      : '<a href="#client-studio">See the work ↓</a>') +
    "</div></div>"
  );
}
export function column(i, b, u) {
  if (i < 0 || i === 3) return identity(i === 3);
  const preview = i === 0 && u < 2,
    cap = preview
      ? u < 0.88
        ? [
            "Three projects, each on its own sheet.",
            "The first follows a question from its source to a customer answer.",
          ]
        : [
            "The answer shows its source.",
            "The words in the answer come from the public document in version 2.",
          ]
      : captions[i][Math.max(0, b - 1)];
  return (
    '<div class="project-copy"><p class="eyebrow">' +
    esc(disclosures[i]) +
    "</p><h2>" +
    acts[i].id +
    '</h2><p class="sentence">' +
    sentences[i] +
    '</p><p class="legend">' +
    legends[i] +
    '</p><div class="beat-copy"><p class="step">Step ' +
    Math.max(1, b) +
    " of 5</p><h3>" +
    esc(cap[0]) +
    '</h3><p class="technical">' +
    esc(cap[1]) +
    "</p></div>" +
    details(i) +
    "</div>"
  );
}
