export const stops = [
  'who',
  'client-studio',
  'active-companion',
  'faultline',
  'contact',
];
export const colors = {
  green: '#00ff88',
  cyan: '#00f0ff',
  amber: '#ffb700',
  pink: '#ff007f',
};
export const projects = [
  {
    name: 'client-studio',
    kind: 'Hosted workflow',
    lead: 'Answers questions with exact excerpts from supplied text.',
    body: 'Review the excerpt, approve the answer, then activate a frozen snapshot. The hosted demo makes no AI calls.',
    proof: '65 tests',
    license: 'Private source',
    demo: 'https://client-studio-psi.vercel.app',
  },
  {
    name: 'active-companion',
    kind: 'Scripted replay',
    lead: 'Turns conversations into evidence cards with named sources.',
    body: 'Follow four fictional conversations. Each card stays tied to the transcript line it came from, so you can check the evidence in context.',
    proof: '18 tests in CI',
    license: 'Public MIT source',
    demo: 'https://active-companion-replay.vercel.app',
    source: 'https://github.com/pappdavid/active-companion',
  },
  {
    name: 'faultline',
    kind: 'Browser model',
    lead: 'Shows how to retry a request without doing the work twice.',
    body: 'A receiver saves a receipt, but its reply gets lost. A simple retry creates a duplicate. Reuse the same key and the receiver returns the saved receipt.',
    proof: '12 tests in CI',
    license: 'Public MIT source',
    demo: 'https://davidpapp.dev/faultline/index.html',
    source: 'https://github.com/pappdavid/faultline',
  },
];
export const figures = [
  {
    title: 'Woven signature',
    label: 'DAVID / Identity study',
    captions: ['Move the pointer to turn the strands.'],
  },
  {
    title: 'Source to snapshot',
    legend: ['Source v2', 'Review', 'Approve', 'Activate', 'Snapshot'],
    label: 'Fictional source · version 2',
    captions: [
      'Find “up to 50 records” for “What is the API batch limit?”',
      'Lift the exact excerpt out for review.',
      'Approve the answer with its source attached.',
      'Activate a frozen snapshot of the approved answer.',
    ],
  },
  {
    title: 'Transcript to evidence',
    legend: ['Transcript', 'Source links', 'Evidence cards'],
    label: 'Fictional conversations',
    captions: [
      'Lines arrive from the four fictional conversations.',
      'Selected lines condense into evidence cards.',
      'Each card stays connected to its named source.',
    ],
  },
  {
    title: 'Request and receipt',
    legend: ['Sender', 'Request / reply', 'Receiver'],
    label: 'Request and receipt',
    captions: [
      'The request arrives and the receiver saves a receipt.',
      'The response is lost on the way back.',
      'A simple retry creates a second receipt.',
      'The same key brings the saved receipt back.',
    ],
  },
  {
    title: 'Settled horizon',
    label: 'Contact / Horizon study',
    captions: ['The strands settle into a continuous horizon.'],
  },
];
export function mountChapters() {
  const sections = document.querySelector('.chapters'),
    rail = document.querySelector('.rail');
  const folio = (i, label) =>
    `<div class="folio"><span class="chapter-number">0${i + 1}</span><span>/</span><span class="total">05</span><i></i>${label}</div>`;
  const next = (i) =>
    `<a class="next" href="#${stops[i]}"><span class="down">${i ? '↓' : '↑'}</span><small>${i ? 'Next stop' : 'Back to'}</small> ${i ? stops[i] : 'home'}</a>`;
  projects.forEach((p, i) => {
    const name = p.name.replace('-', '-<wbr>');
    sections.insertAdjacentHTML(
      'beforeend',
      `<section class="stop" id="${p.name}" aria-labelledby="title-${i}">
      ${folio(i + 1, 'Featured project')}
      <div class="copy"><div class="prompt">david@dev:~$ <b>ps --featured</b></div>
        <h2 class="project-title" id="title-${i}" tabindex="-1">${name}</h2>
        <p class="lede">${p.lead}</p><p class="explain">${p.body}</p>
        ${i === 0 ? '<div class="sample"><small>Fictional source · version 2</small><p>What is the API batch limit?</p><q>up to 50 records</q></div>' : ''}
        <div class="proof"><b>${p.kind}</b><span>${p.proof}</span><span>${p.license}</span></div>
        <div class="actions"><a class="primary" href="${p.demo}">Open demo <span>↗</span></a>${p.source ? `<a href="${p.source}">View source <span>↗</span></a>` : ''}</div>
      </div>${next(i + 2)}</section>`,
    );
  });
  sections.insertAdjacentHTML(
    'beforeend',
    `<section class="stop" id="contact" aria-labelledby="contact-title">${folio(4, 'Contact')}<div class="copy"><div class="prompt">david@dev:~$ <b>cat contact</b></div><h2 class="contact-title" id="contact-title" tabindex="-1">Get in<br>touch<span class="period">.</span></h2><p class="lede">Open to full-time work.</p><p class="explain">David Papp · Rotterdam, NL<br>AI engineering, backend and data</p><div class="actions"><a class="primary" href="https://www.linkedin.com/in/d%C3%A1vid-papp">LinkedIn <span>↗</span></a><a href="/cv.pdf">Résumé <span>↗</span></a></div></div>${next(0)}</section>`,
  );
  stops.forEach((id, i) =>
    rail.insertAdjacentHTML(
      'beforeend',
      `<a href="#${id}" title="${id}" aria-label="Stop ${i + 1}, ${id}">0${i + 1}</a>`,
    ),
  );
}
