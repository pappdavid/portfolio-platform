// Coordinates are in drawing units, one unit per CSS pixel before projection.
// Each surface belongs to an actual page, function, document, packet or record.
import { replay } from './companion-data.js';
import { records, smooth, bookingPrefix } from './systems.js';
import { BOOKING } from './engine.mjs';

const q = 'What is the API batch limit?',
  excerpt = 'up to 50 records';
const docTabs = ['v1 · public', 'v2 · public', 'v2 · internal', 'v2 · public'];
const span = (t, cls = '') => '<span class="' + cls + '">' + t + '</span>';
const head = (name, meta = '') =>
  '<div class="sheet-head"><b>' +
  name +
  '</b><small>' +
  meta +
  '</small></div>';
const row = (a, b, active = false) =>
  '<div class="field' +
  (active ? ' selected' : '') +
  '"><small>' +
  a +
  '</small><span>' +
  b +
  '</span></div>';
const table = (fields, rows, selected = -1) =>
  '<table><thead><tr>' +
  fields.map((s) => '<th>' + s + '</th>').join('') +
  '</tr></thead><tbody>' +
  rows
    .map(
      (r, i) =>
        '<tr' +
        (i === selected ? ' class="selected"' : '') +
        '>' +
        r.map((s) => '<td>' + s + '</td>').join('') +
        '</tr>',
    )
    .join('') +
  '</tbody></table>';
const sheet = (id, x, y, z, w, h, content, beats, options = {}) => ({
  id,
  x,
  y,
  z,
  w,
  h,
  content,
  beats,
  ...options,
});
const stroke = (s, from, to, a, b) => s.wire(from, to, a, b);
const move = (s, id, from, to, t) =>
  s.move(
    id,
    from.map((v, i) => v + (to[i] - v) * t),
  );
const range = (x, start, end) => smooth((x - start) / (end - start));

export function studio(s) {
  const author = (b, u) => {
    const review = b >= 4;
    const task = review
      ? '<b>Review &amp; activate</b>' +
        row('Audience', 'Customer') +
        row('Sources', 'v2 · public') +
        row('Test', excerpt) +
        span(u < 0.13 && b === 4 ? '□ Review' : '☑ Reviewed', 'confirm') +
        '<div class="author-controls">' +
        span('Approve', u > 0.16 ? 'selected' : '') +
        span('Activate', u > 0.32 ? 'selected' : '') +
        '</div>'
      : '<b>Test a question</b><small>Pasted text</small><blockquote>' +
        excerpt +
        '</blockquote>' +
        '<small>Question</small><div class="question-field">' +
        q +
        '</div><small>Answer</small><strong>' +
        (b >= 2 ? excerpt : '—') +
        '</strong>';
    return (
      head('Studio', 'Workspace  /  Customer runtime ↗') +
      '<div class="page-toolbar"><b>Working canvas</b><span>Audience · customer</span></div><div class="author-layout"><aside>' +
      [
        'Purpose',
        'Sources',
        'Choices',
        'Behavior',
        'Test',
        'Approval',
        'Runtime',
      ]
        .map((x, i) => span(x, i === (review ? 5 : 4) ? 'selected' : ''))
        .join('') +
      '</aside><section><div class="task-tabs">Sources　 Test　 Review</div>' +
      task +
      '</section>' +
      '<aside class="library"><b>Source library</b>' +
      docTabs.map((d) => span(d)).join('') +
      span('Review queue') +
      span('Connection details') +
      '</aside></div><div class="page-command"><span>Workspace edit</span><b>' +
      (b === 5 && u > 0.23 ? '409' : 'Apply change') +
      '</b></div>'
    );
  };
  const results = (b, u) => b > 4 || (b === 4 && u >= 0.38);
  const lineMeasures = [
    [
      [9, 7, 1, 9],
      [10, 3, 3, 3, 6, 3],
      [7, 2, 8, 3, 6],
      [3, 3, 4, 4, 11],
      [7, 2, 2, 2, 8, 3],
      [11, 3, 11],
    ],
    [
      [9, 7, 1, 9],
      [10, 3, 3, 3, 6, 3],
      [7, 3, 8, 3, 6],
      [3, 3, 4, 4, 11],
      [7, 2, 2, 2, 8, 3],
      [11, 3, 11],
    ],
    [
      [9, 13, 5, 2],
      [3, 7, 4, 2, 3, 2],
      [9, 2, 3, 7, 1, 6],
      [5, 6, 7, 1, 5, 3],
      [1, 7, 10, 2, 7],
      [8, 7, 8],
      [15, 4, 5, 2],
      [8, 2, 10],
    ],
    [
      [9, 9, 8],
      [5, 6, 5, 3, 9],
      [2, 8, 3, 10],
      [8, 8, 7, 5],
      [5, 8, 5],
    ],
  ];
  const textLines = (i) =>
    '<div class="text-lines">' +
    lineMeasures[i]
      .map(
        (line) =>
          '<div>' +
          line.map((n) => '<i style="width:' + n * 2.65 + 'px"></i>').join('') +
          '</div>',
      )
      .join('') +
    '</div>';
  const doc = (tab, i) =>
    head(tab.slice(0, 2), tab.split(' · ')[1]) +
    '<article class="document">' +
    textLines(i) +
    (i === 1 ? '<blockquote>' + excerpt + '</blockquote>' : '') +
    '</article>';
  const parts = [
    sheet('Studio page', -72, 150, -95, 419, 239, author, [1, 2, 4, 5], {
      tier: 2,
    }),
    sheet(
      'Customer runtime',
      245,
      150,
      -95,
      190,
      197,
      (b, u) =>
        head('Customer runtime') +
        '<div class="page-toolbar">Customer · workspace</div><article><small>Active evidence</small><blockquote>' +
        (results(b, u) ? excerpt : '—') +
        '</blockquote><small>Connection details</small><small>Question</small><div class="question-field"></div><small>Answer</small></article>',
      [3, 4],
      { tier: 2 },
    ),
    sheet(
      'Server route',
      15,
      80,
      50,
      360,
      121,
      (b, u) =>
        head('Server route', 'GET / POST') +
        '<div class="server-body">' +
        row('Session', 'Cookie → workspace', b === 1) +
        row(
          b === 5 ? 'Revision check' : 'Command handler',
          b === 5 ? 'stale ≠ current' : 'Review → Approve → Activate',
          b >= 4,
        ) +
        row('Audience filter', 'public · v2', b === 3) +
        row('Lexical retrieval', 'API · batch · limit', b === 2) +
        '</div>',
      [1, 2, 3, 4, 5],
      { tier: 1 },
    ),
    sheet(
      'Model gateway',
      296,
      80,
      68,
      117,
      58,
      head('Model gateway') + '<article>off in this demo</article>',
      [],
      { tier: 1, dark: true },
    ),
    sheet(
      'PostgreSQL',
      -5,
      0,
      183,
      415,
      157,
      head('PostgreSQL', 'Workspace') +
        '<article><small>Versioned sources</small></article>',
      [2, 3, 4, 5],
    ),
    ...docTabs.map((d, i) =>
      sheet(
        'source' + i,
        -146 + i * 38,
        8 + i * 3,
        195,
        112,
        103,
        doc(d, i),
        [2, 3],
        { document: true },
      ),
    ),
    sheet(
      'Frozen snapshot',
      119,
      15,
      198,
      168,
      104,
      (b, u) =>
        head('Frozen snapshot', results(b, u) ? 'Active' : '') +
        '<article>' +
        (results(b, u)
          ? '<small>Configuration · v2 · public</small><blockquote>' +
            excerpt +
            '</blockquote>'
          : '<small>Configuration and sources</small>') +
        '</article>',
      [4, 5],
    ),
    sheet('operation', 0, 0, 0, 242, 67, '', [1, 2, 3, 4, 5], {
      message: true,
    }),
  ];
  s.add(parts);
  return {
    labels: [
      ['Studio page', 'Studio page'],
      ['Customer runtime', 'Customer runtime'],
      ['Server route', 'Session · GET / POST'],
      ['source1', 'Versioned sources'],
      ['PostgreSQL', 'PostgreSQL'],
      ['Frozen snapshot', 'Frozen snapshot'],
      ['Model gateway', 'Model gateway · off in this demo'],
    ],
    update(b, u, spread) {
      s.tiers(spread);
      const f = range(u, 0.05, 0.41),
        packet = s.part('operation');
      s.show('operation', b > 0);
      const source = s.pos('source1'),
        server = s.pos('Server route'),
        author = s.pos('Studio page'),
        snap = s.pos('Frozen snapshot'),
        runtime = s.pos('Customer runtime');
      // Elbows terminate at the faces they join. Storage has only a server edge.
      for (const [x, top] of [
        [author[0], author],
        [runtime[0], runtime],
      ]) {
        const a = [x, top[1], top[2] + 82],
          c = [Math.min(x, 140), server[1], server[2] - 56];
        stroke(s, a, [a[0], c[1], a[2]], 0.45);
        stroke(s, [a[0], c[1], a[2]], c, 0.45);
      }
      stroke(
        s,
        [server[0], server[1], server[2] + 56],
        [server[0], 5, server[2] + 56],
        0.65,
      );
      stroke(s, [server[0], 5, server[2] + 56], [0, 5, 144], 0.65);
      const starts = [
        [],
        [author[0] - 40, author[1] + 4, author[2] + 45],
        source,
        source,
        author,
        server,
      ];
      const ends = [
        [],
        [-45, server[1] + 30, 21],
        [-62, server[1] + 42, 112],
        [75, server[1] + 34, 106],
        [129, snap[1] + 43, 232],
        [-101, author[1] + 30, -7],
      ];
      if (b) {
        move(s, 'operation', starts[b], ends[b], f);
        const messages = [
          '',
          head('POST', 'Question') + '<strong>' + q + '</strong>',
          head('Source v2', 'public') + '<strong>“' + excerpt + '”</strong>',
          head('Customer evidence', 'Audience filter') +
            '<strong>v2 · public</strong>',
          head(f > 0.68 ? 'Active' : 'Approved', 'Snapshot') +
            '<strong>v2 · ' +
            excerpt +
            '</strong>',
          head('Revision check', 'stale ≠ current') + '<strong>409</strong>',
        ];
        s.html(packet, messages[b]);
        s.scale('operation', b === 2 ? 1 + 0.27 * f : 1);
        if (b === 4 && u > 0.39) {
          const from = [129, snap[1] + 43, 232],
            via = [116, server[1] + 16, 61],
            to = [runtime[0], runtime[1] + 10, -9];
          if (u < 0.44) move(s, 'operation', from, via, range(u, 0.39, 0.44));
          else move(s, 'operation', via, to, range(u, 0.44, 0.5));
        }
      }
      if (b === 2) {
        s.offset('source1', -48 * f, 56 * f, 17 * f);
        s.scale('source1', 1 + 0.43 * f);
      }
      if (b === 3) {
        s.offset('source0', -76 * f, 0, 0);
        s.offset('source1', 52 * f, 44 * f, -18 * f);
        s.offset('source2', -48 * f, 3 * f, 51 * f);
        s.offset('source3', 119 * f, 44 * f, -18 * f);
        stroke(s, [-44, server[1], server[2] + 62], [36, 48, 154], 0.84, true);
      }
      if (b === 4 && u > 0.35)
        stroke(
          s,
          [runtime[0], runtime[1], runtime[2] + 82],
          [140, server[1], server[2] - 56],
          1,
        );
      return b === 0
        ? []
        : b === 1
          ? [['operation', 'Question received']]
          : b === 2
            ? [
                ['operation', 'Quoted excerpt'],
                ['source1', 'Source v2'],
              ]
            : b === 3
              ? [
                  ['source2', 'Internal · withheld'],
                  ['operation', 'Customer evidence'],
                ]
              : b === 4
                ? [
                    ['Frozen snapshot', 'Frozen snapshot'],
                    ['Customer runtime', 'Active evidence'],
                  ]
                : [
                    ['operation', 'Write refused'],
                    ['Frozen snapshot', 'Active copy'],
                  ];
    },
  };
}

const seconds = (t) => Number(t).toFixed(1);
const timeStamp = (u) => seconds(u.start) + '–' + seconds(u.end) + ' s';
const matrixTerms = new Set(
  replay.queryTerms.map((t) => replay.vocab.indexOf(t)),
);
const files = ['acme_account', 'contacts_and_facts', 'notes'];
const fileGroups = files.map((name) =>
  replay.chunks.filter((c) => c.id.split(':')[0] === name),
);
function cardMarkup() {
  return (
    head(replay.card.title, '49.0 s') +
    '<article class="card-body">' +
    replay.card.bullets
      .map((b) => '<p>' + b.text + '</p><small>Source: ' + b.title + '</small>')
      .join('') +
    '</article>'
  );
}

export function companion(s) {
  const timelineX = (t) => -373 + t * 8.5;
  const parts = [
    sheet(
      'Transcript',
      -112,
      78,
      -92,
      557,
      76,
      head('Transcript', 'technical_discussion') +
        '<div class="lanes"><small>engineer</small><small>se</small></div><div class="seconds">' +
        [0, 10, 20, 30, 40, 50].map((v) => span(v + ' s')).join('') +
        '</div>',
      [1, 2, 3],
      { tier: 1 },
    ),
    ...replay.utterances.map((u, i) =>
      sheet(
        'utterance' + i,
        timelineX((u.start + u.end) / 2),
        83,
        -92 + (u.speaker === 'se' ? 19 : 2),
        (u.end - u.start) * 8.5,
        13,
        span(seconds(u.end)),
        [1, 2, 3],
        { tier: 1, bar: true },
      ),
    ),
    sheet(
      'Window',
      0,
      87,
      -91,
      255,
      58,
      '<div class="window-ends"></div>',
      [2, 3],
      { tier: 1, frame: true },
    ),
    sheet(
      'Intent classifier',
      216,
      77,
      -145,
      139,
      83,
      (b, u) =>
        head('classify') +
        '<article><small>Intent</small><b>' +
        (b === 3 && u < 0.22 ? 'technical_detail' : 'contact_lookup') +
        '</b></article>',
      [3],
      { tier: 1 },
    ),
    ...files.map((file, i) =>
      sheet(
        file,
        -366 + i * 119,
        0,
        13 + i * 17,
        122,
        157,
        head(file + '.md', String(fileGroups[i].length)) +
          '<div class="file-chunks">' +
          fileGroups[i].map((c) => span(c.title)).join('') +
          '</div>',
        [4],
        { file: true, chunks: fileGroups[i] },
      ),
    ),
    sheet(
      'TF-IDF retrieval',
      -97,
      0,
      217,
      524,
      125,
      head(
        'TF-IDF retrieval',
        replay.vocab.length + ' terms × ' + replay.chunks.length + ' chunks',
      ) +
        '<div class="matrix-query">' +
        replay.queryTerms.join(' · ') +
        '</div>',
      [4],
      { matrix: true },
    ),
    sheet(
      'Ranked chunks',
      165,
      0,
      61,
      270,
      147,
      head('Ranked chunks', 'cosine') +
        table(
          ['rank', 'id', 'title'],
          replay.hits.map((h, i) => [i + 1, h.id, h.title]),
          1,
        ),
      [4],
    ),
    sheet(
      'Card list',
      384,
      76,
      -114,
      207,
      173,
      head('Card list') +
        replay.titles
          .slice(0, 4)
          .reverse()
          .map((t, i) => row(seconds(replay.utterances[3 - i].end) + ' s', t))
          .join(''),
      [4, 5],
      { tier: 1 },
    ),
    sheet('Evidence card', 395, 94, 0, 217, 153, cardMarkup(), [4, 5], {
      tier: 1,
    }),
    sheet(
      'Local lab',
      304,
      0,
      235,
      207,
      99,
      head('Model lane', 'local lab only') +
        '<article><small>Citation check</small><b>Retrieved title</b></article>',
      [5],
      { dark: true },
    ),
    sheet('readout', 0, 0, 0, 303, 120, '', [1, 2, 3, 5], { message: true }),
  ];
  s.add(parts);
  return {
    labels: [
      ['Transcript', 'Transcript'],
      ['Window', '30-second window'],
      ['Intent classifier', 'Intent classifier'],
      ['notes', 'Knowledge base'],
      ['TF-IDF retrieval', 'TF-IDF retrieval'],
      ['Evidence card', 'Evidence card'],
      ['Card list', 'Card list'],
      ['Local lab', 'Model lane · local lab only'],
    ],
    update(b, u, spread) {
      s.tiers(spread);
      const f = range(u, 0.06, 0.44);
      const time =
        b === 1
          ? u < 0.21
            ? 10.5
            : 14.5
          : b === 2
            ? u < 0.08
              ? 31
              : u < 0.17
                ? 35
                : 49
            : 49;
      const windowEnd = b === 2 ? 35 + 14 * range(u, 0.17, 0.43) : time;
      const wy = s.pos('Transcript')[1] + 8;
      s.move('Window', [
        timelineX(windowEnd - 15),
        wy + (b === 2 ? 17 * f : 0),
        -83,
      ]);
      s.html(
        s.part('Window'),
        '<div class="window-ends"><b>' +
          seconds(time - 30) +
          ' s</b><b>' +
          seconds(time) +
          ' s</b></div>',
      );
      s.show('Window', b !== 1);
      for (const [i, utt] of replay.utterances.entries()) {
        const id = 'utterance' + i;
        if (b === 2 && i >= 2 && i <= 4) s.offset(id, 0, 17 * f, 0);
        if (b === 2 && i < 2) {
          const gone = range(windowEnd, utt.end + 30, utt.end + 34);
          s.offset(id, -12 * gone, -47 * gone, 49 * gone);
          s.light(id, 1 - 0.55 * gone);
        } else if (b > 0)
          s.light(id, utt.end <= time && utt.end >= time - 30 ? 1 : 0.23);
      }
      s.show('readout', [1, 2, 3, 5].includes(b));
      // Accumulated UI cards reflect only the transcript prefix already ingested.
      const completed = replay.utterances.filter((u) => u.end <= time);
      s.html(
        s.part('Card list'),
        head('Card list') +
          completed
            .slice(0, 4)
            .map((u, i) => row(seconds(u.end) + ' s', replay.titles[i]))
            .reverse()
            .join(''),
      );
      if (b === 2) {
        const retained = replay.utterances.filter(
          (u) => u.end <= time && u.end >= time - 30,
        );
        s.html(
          s.part('readout'),
          head('SlidingWindow', retained.length + ' utterances') +
            table(
              ['speaker', 'start', 'end'],
              retained.map((u) => [
                u.speaker,
                seconds(u.start) + ' s',
                seconds(u.end) + ' s',
              ]),
            ),
        );
        s.move('readout', [-82, wy + 17, 36]);
        s.scale('readout', 0.9);
      }
      if (b === 1 || b === 3) {
        const idx = b === 1 ? (u < 0.21 ? 0 : 1) : b === 2 ? 4 : 4,
          utter = replay.utterances[idx];
        const body =
          b === 3
            ? utter.text
                .replaceAll('Who is', '<mark>Who is</mark>')
                .replace('from your team', '<mark>from your team</mark>')
            : utter.text;
        s.html(
          s.part('readout'),
          head(utter.speaker, timeStamp(utter)) +
            '<article class="utterance-text">' +
            body +
            '</article>',
        );
        const dest =
          b === 3
            ? [66, wy + 40, -27]
            : b === 1
              ? [-156, wy + 45, 17]
              : [-72, wy + 50, 30];
        move(s, 'readout', [timelineX(utter.end), wy, -74], dest, f);
      }
      const matrix = s.part('TF-IDF retrieval');
      if (b === 4) {
        const open = range(u, 0.22, 0.44);
        move(s, 'Evidence card', [167, 11, 67], [351, 142, 29], open);
        s.scale('Evidence card', 0.48 + 0.68 * open);
        s.show('Evidence card', u > 0.12);
        s.offset('Ranked chunks', -30 * f, 13 * f, 17 * f);
      }
      // Exact term presence in every chunk, with query intersections in accent.
      s.lightMatrix(matrix, b === 0 || b >= 4);
      if (b === 5) {
        const content =
          head('Citation check', 'local lab only') +
          table(
            ['candidate', 'cite'],
            [
              ['Supported citation', '[Known source]'],
              ['Invented citation', 'Another source'],
            ],
            0,
          );
        s.html(
          s.part('readout'),
          u < 0.24
            ? content
            : u < 0.68
              ? content + row('Accepted', 'Supported citation')
              : head('Citation check', 'local lab only') +
                row('claim without cite', '∅') +
                row('Card mode', 'retrieval'),
        );
        move(s, 'readout', [287, 14, 202], [267, 49, 144], f);
      }
      stroke(s, [151, wy - 8, -87], [161, wy - 8, -87], 0.7);
      stroke(s, [208, wy - 8, -53], [202, 7, 17], 0.5);
      stroke(s, [91, 6, 109], [90, 6, 115], 0.7);
      for (let i = 0; i < 3; i++) {
        const p = s.pos(files[i]);
        stroke(s, [p[0], 3, p[2] + 60], [p[0] * 0.45, 3, 104], 0.45);
      }
      stroke(s, [274, 6, 55], [304, wy, 19], 0.65);
      if (b > 0 && b < 4) s.show('Evidence card', false);
      if (b === 0) return [];
      if (b === 1) return [['readout', 'Transcript entry']];
      if (b === 2)
        return [
          [
            f > 0.8 ? 'utterance1' : 'Transcript',
            f > 0.8 ? '10.5 s / 14.5 s · expired' : 'Transcript',
          ],
          ['Window', '30-second window'],
        ];
      if (b === 3) return [['Intent classifier', 'contact_lookup']];
      if (b === 4)
        return [
          ['TF-IDF retrieval', 'Query × chunks'],
          ['Evidence card', "Source: Who's who"],
        ];
      return [
        ['readout', 'Local citation check'],
        ['Evidence card', 'Retrieval card retained'],
      ];
    },
  };
}

export function faultline(s) {
  const visitsCols = ['id', 'key', 'operation', 'service', 'slot', 'location'];
  const traceCols = ['sequence', 'attempt', 'kind', 'title', 'detail'];
  const [first, plainFirst, plain, fixed, conflict] = records;
  const firstReceipt = Object.values(first.receipts)[0];
  const original = firstReceipt.fingerprint;
  const changed = JSON.parse(original);
  // probeConflict changes this single field. The engine emits the conflict status.
  changed[2] = '11:00–11:30';
  const parts = [
    sheet('Client', -267, 0, -80, 226, 173, '', [1, 2, 3, 4, 5]),
    sheet('Receiver', 181, 0, -103, 168, 113, '', [1, 3, 4, 5]),
    sheet('Visits', 257, 0, 17, 407, 119, '', [1, 2, 3, 4, 5]),
    sheet('Receipts', 257, 0, 143, 407, 105, '', [1, 4, 5]),
    sheet('Trace', -26, 0, 267, 740, 145, '', [1, 2, 3, 4, 5]),
    sheet('packet', 0, 0, 0, 168, 50, '', [1, 2, 3, 4, 5], { message: true }),
  ];
  s.add(parts);
  return {
    labels: [
      ['Client', 'Client'],
      ['request', 'Request · before commit'],
      ['response', 'Response · after commit'],
      ['Receiver', 'Receiver · baseline / fixed'],
      ['Visits', 'Visits'],
      ['Receipts', 'Receipts · fixed'],
      ['Trace', 'Trace'],
    ],
    update(b, u) {
      const f = range(u, 0.02, 0.47);
      const run = [first, first, first, plain, fixed, conflict][b],
        baseline = b === 3;
      const beforeRetry = b === 3 ? plainFirst : first;
      const prefix = bookingPrefix(b, u);
      const committed =
        b === 0
          ? []
          : b === 1 && prefix < 2
            ? []
            : b === 3 && prefix < 5
              ? plainFirst.visits
              : run.visits;
      const receiptRows =
        committed.length && !baseline ? Object.entries(run.receipts) : [];
      const clientId =
        b === 0 || b <= 2
          ? null
          : b === 5
            ? fixed.observedId
            : prefix < 6
              ? beforeRetry.observedId
              : run.observedId;
      const hot = b === 3 && prefix >= 5;
      s.html(
        s.part('Client'),
        head('Client', 'BOOKING') +
          row('Idempotency-Key', BOOKING.operation, true) +
          Object.entries(BOOKING)
            .map(([k, v]) => row(k, b === 5 && k === 'slot' ? changed[2] : v))
            .join('') +
          row('observedId', clientId ?? 'null'),
      );
      s.html(
        s.part('Receiver'),
        head('receive', baseline ? 'baseline' : 'fixed') +
          '<article>' +
          span('POST /visits', 'endpoint') +
          row('key', BOOKING.operation) +
          span(
            baseline
              ? 'Append visit'
              : b === 5
                ? 'Compare fingerprint'
                : 'Lookup receipt',
          ) +
          '</article>',
      );
      const visitRows = committed.map((v) => visitsCols.map((k) => v[k]));
      s.html(
        s.part('Visits'),
        head(
          'Visits',
          committed.length +
            ' ' +
            (committed.length === 1 ? 'visit' : 'visits'),
        ) +
          table(
            visitsCols,
            visitRows,
            hot ? 1 : b === 1 && committed.length ? 0 : -1,
          ),
      );
      s.show('Receipts', !baseline);
      s.html(
        s.part('Receipts'),
        head('Receipts', 'fixed') +
          table(
            ['key', 'fingerprint', 'id'],
            receiptRows.map(([k, v]) => [k, v.fingerprint, v.id]),
            b >= 4 && f >= 0.5 ? 0 : -1,
          ),
      );
      const trace = run.trace.slice(0, prefix);
      s.html(
        s.part('Trace'),
        head('Trace', trace.length + ' events') +
          table(
            traceCols,
            trace.map((e) => traceCols.map((k) => e[k])),
            trace.length - 1,
          ),
      );
      s.depth('Trace', Math.max(54, 45 + trace.length * 23));
      s.depth('Visits', 54 + committed.length * 32);
      if (b === 3 || b === 4 || b === 5) {
        const id = b === 3 ? 'Visits' : 'Receipts';
        s.offset(id, -48 * f, (b === 3 ? 80 : 66) * f, 15 * f);
        s.enlarge(id, 1 + 0.2 * f);
      }
      // Both directions are drawn separately; only the first response can drop.
      const loss = b === 2 ? range(u, 0.05, 0.27) : 0;
      const left = -153,
        right = 96,
        zOut = -108,
        zBack = -58;
      stroke(s, [left, 3, zOut], [right, 3, zOut], 0.82, true);
      stroke(s, [right, 3, zBack], [-30 + 17 * loss, 3, zBack], 0.85);
      stroke(s, [-30 - 17 * loss, 3, zBack], [left, 3, zBack], 0.85, true);
      // Mark the two fault sites on their own links.
      for (const [x, z, gap] of [
        [13, zOut, 0],
        [-30, zBack, loss * 17],
      ]) {
        for (const dir of [-1, 1])
          stroke(
            s,
            [x + dir * (3 + gap), 4, z - 5],
            [x + dir * (3 + gap), 4, z + 5],
            0.95,
          );
      }
      s.anchor('request', [12, 5, zOut]);
      s.anchor('response', [-29, 5, zBack]);
      stroke(s, [201, 3, -45], [201, 3, -35], 0.65, true);
      if (!baseline) stroke(s, [283, 3, -101], [301, 3, 59], 0.58, true);
      s.show('packet', b > 0);
      if (b) {
        const outbound = [left + 20, 17, zOut - 12],
          recv = [right + 25, 20, zOut - 12];
        const back = [right, 19, zBack + 22],
          arrived = [left, 19, zBack + 22];

        if (b === 1) move(s, 'packet', outbound, recv, range(f, 0, 0.48));
        else if (b === 2)
          move(s, 'packet', back, [-3, 28, zBack + 50], range(f, 0, 0.55));
        else if (f < 0.5) move(s, 'packet', outbound, recv, f * 2);
        else move(s, 'packet', back, arrived, range(f, 0.5, 0.94));
        const title =
          b === 1
            ? f < 0.48
              ? 'POST /visits'
              : '201 · VIS-742'
            : b === 2
              ? f < 0.6
                ? '201 · VIS-742'
                : 'Response lost'
              : f < 0.5
                ? 'POST /visits'
                : b === 5
                  ? '409'
                  : b === 3
                    ? '201 · VIS-743'
                    : '200 · VIS-742';
        s.html(
          s.part('packet'),
          head(title) +
            span(
              b === 2 && f >= 0.6
                ? 'after commit'
                : b === 5
                  ? 'Key reused'
                  : BOOKING.operation,
              'packet-key',
            ),
        );
        if (b === 5) {
          s.depth('Receipts', 143);
          s.html(
            s.part('Receipts'),
            head('Receipts', 'fixed') +
              table(
                ['key', 'fingerprint', 'id'],
                receiptRows.map(([k, v]) => [
                  k,
                  v.fingerprint.replace(
                    '09:30–10:00',
                    '<mark>09:30–10:00</mark>',
                  ),
                  v.id,
                ]),
              ) +
              row(
                'incoming',
                JSON.stringify(changed).replace(
                  changed[2],
                  '<mark>' + changed[2] + '</mark>',
                ),
              ) +
              row('result', f >= 0.5 ? '409' : 'Compare fingerprint', f >= 0.5),
          );
        }
      }
      if (b === 0) return [];
      if (b === 1)
        return prefix < 2
          ? [['packet', 'POST /visits']]
          : [
              ['Visits', 'Committed · VIS-742'],
              ['Receipts', 'Receipt stored'],
            ];
      if (b === 2)
        return [
          ['response', prefix < 3 ? 'Response' : 'Break · after commit'],
          ['Client', 'observedId · null'],
        ];
      if (b === 3)
        return [
          ['Visits', hot ? 'VIS-742  /  VIS-743' : 'VIS-742'],
          ['Receiver', 'baseline'],
        ];
      if (b === 4)
        return [
          ['Receipts', prefix < 5 ? 'Receipt lookup' : 'Replay · VIS-742'],
          ['Visits', 'One committed visit'],
        ];
      return prefix < 8
        ? [['Receipts', 'Fingerprint comparison']]
        : [
            ['Receipts', 'Payload mismatch'],
            ['packet', '409'],
          ];
    },
  };
}
export { matrixTerms };
