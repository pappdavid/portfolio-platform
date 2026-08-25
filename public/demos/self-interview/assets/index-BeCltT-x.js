(function () {
  const n = document.createElement('link').relList;
  if (n && n.supports && n.supports('modulepreload')) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const o of s)
      if (o.type === 'childList')
        for (const d of o.addedNodes)
          d.tagName === 'LINK' && d.rel === 'modulepreload' && r(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(s) {
    const o = {};
    return (
      s.integrity && (o.integrity = s.integrity),
      s.referrerPolicy && (o.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === 'use-credentials'
        ? (o.credentials = 'include')
        : s.crossOrigin === 'anonymous'
          ? (o.credentials = 'omit')
          : (o.credentials = 'same-origin'),
      o
    );
  }
  function r(s) {
    if (s.ep) return;
    s.ep = !0;
    const o = t(s);
    fetch(s.href, o);
  }
})();
const I = [
  {
    name: 'junior',
    patterns: ['junior', 'jr', 'entry', 'entry-level', 'beginner'],
    answer: 'experience'
  },
  {
    name: 'production',
    patterns: [
      'production',
      'live',
      'real product',
      'real thing',
      'real customer'
    ],
    answer: 'production-vs-prototype'
  },
  {
    name: 'prototype',
    patterns: [
      'prototype',
      'personal project',
      'side project',
      'portfolio project',
      'toy'
    ],
    answer: 'prototypes'
  },
  {
    name: 'cost_saving',
    patterns: [
      'cost',
      'save money',
      'budget',
      'reduce spend',
      'cheaper',
      'llm cost'
    ],
    answer: 'cost-saving'
  },
  {
    name: 'delivery_count',
    patterns: [
      'how many',
      'number of',
      'count',
      'websites',
      'webshops',
      'built'
    ],
    answer: 'delivery-count'
  },
  {
    name: 'stack',
    patterns: ['tech stack', 'technology', 'tools', 'framework', 'languages'],
    answer: 'stack'
  },
  {
    name: 'demo',
    patterns: ['demo', 'live demo', 'example', 'see it in action', 'agent'],
    answer: 'demo'
  },
  {
    name: 'education',
    patterns: [
      'education',
      'degree',
      'university',
      'school',
      'student',
      'studying'
    ],
    answer: 'education'
  },
  {
    name: 'employer',
    patterns: ['employer', 'company', 'who do', 'work for', 'current job'],
    answer: 'employer'
  }
];
function v(e) {
  const n = (e || '').toLowerCase();
  for (const t of I) if (t.patterns.some((r) => n.includes(r))) return t.answer;
  return null;
}
const h = [
  {
    id: 'experience',
    question: 'Is he junior?',
    answer:
      "I joined WEBINFORM IT Ltd as an AI Solutions Developer in October 2024, and I'm a BSc Artificial Intelligence student at VU Amsterdam. My training is current — LLMs, search, agents — and I flag exactly what is production versus prototype so you're never guessing.",
    source: 'WEBINFORM IT Ltd · VU Amsterdam',
    tags: ['experience']
  },
  {
    id: 'delivery-count',
    question: 'Has he shipped real things?',
    answer:
      "Yes — 20+ delivered websites and webshops, three internal systems, one user-facing platform, and two ERP/AI integration projects at WEBINFORM IT. That's real client work with real deadlines.",
    source: 'Delivery record at WEBINFORM IT Ltd',
    tags: ['experience']
  },
  {
    id: 'production-vs-prototype',
    question: "What's actually production vs prototype?",
    answer:
      'Honest split: the work websites/webshops, internal systems, user-facing platform and ERP/AI integrations were delivered for WEBINFORM IT clients. My personal projects — VoidArch Context, VoidArch Studio, AgentSec Suite, and saas-core — are prototypes. AgentSec Suite has a public live demo you can click through right now.',
    source: 'Project inventory',
    tags: ['prototypes']
  },
  {
    id: 'cost-saving',
    question: 'Can he actually save us money?',
    answer:
      "One concrete example: I inherited an AI-first service that was bleeding budget. By repairing it instead of rebuilding, I cut its LLM API costs by roughly 40%. I keep the word 'roughly' on purpose — I don't inflate numbers.",
    source: 'Inherited AI service repair',
    tags: ['cost-saving']
  },
  {
    id: 'stack',
    question: 'What does he build with?',
    answer:
      "My delivery stack is Next.js, TypeScript, Prisma, Clerk, Supabase, and Tailwind — the modern typed full-stack. It's what I use daily for shipped client work.",
    source: 'Delivery stack',
    tags: ['stack']
  },
  {
    id: 'education',
    question: 'Does he actually understand AI, or just glue APIs?',
    answer:
      "I'm a BSc Artificial Intelligence student at VU Amsterdam — so the fundamentals (ML, search, agents) are coursework, not buzzwords. Combined with two ERP/AI integration projects shipped in production settings, it's theory that has met reality.",
    source: 'VU Amsterdam · ERP/AI integrations',
    tags: ['education']
  },
  {
    id: 'demo',
    question: 'Can I see something live right now?',
    answer:
      "Yes — AgentSec Suite is publicly reachable at promptshield-cyan.vercel.app. Click through it yourself; no sales call required. It's a personal project, so: prototype, proudly.",
    source: 'promptshield-cyan.vercel.app',
    tags: ['demo']
  },
  {
    id: 'employer',
    question: 'Where does he actually work?',
    answer:
      'AI Solutions Developer at WEBINFORM IT Ltd, since October 2024. Day to day that means client delivery: websites, webshops, internal systems, and AI integrations.',
    source: 'WEBINFORM IT Ltd (Oct 2024–)',
    tags: ['employer']
  },
  {
    id: 'trust',
    question: 'Why should I trust any of this?',
    answer:
      "Because everything on this page comes from one verified fact list — no invented clients, no invented metrics, and anything simulated is labelled illustrative. The production/prototype line stays explicit, and 'roughly' stays roughly. Ask me anything else directly.",
    source: 'Verified-fact policy of this demo',
    tags: ['trust']
  }
];
function b(e) {
  return h.find((n) => n.id === e);
}
const A = [
    'Is he junior?',
    'Has he shipped real things?',
    "What's actually production vs prototype?",
    'Did fixing a service cut costs?',
    "What's his stack?"
  ],
  E =
    "Good question — I don't have a scripted answer for that one, and I won't improvise facts. Ask David directly and he'll give you a straight answer.",
  a = document.getElementById('chat'),
  p = document.getElementById('chips'),
  L = document.getElementById('composer-form'),
  y = document.getElementById('composer-input'),
  i = window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  c = (e) => new Promise((n) => setTimeout(n, i ? 0 : e));
function u() {
  requestAnimationFrame(() => {
    a.scrollTop = a.scrollHeight;
  });
}
function l(e, n) {
  const t = document.createElement('div');
  return (
    (t.className = `msg ${e}`), (t.textContent = n), a.appendChild(t), u(), t
  );
}
function T(e, n) {
  if (!n) return;
  const t = document.createElement('span');
  (t.className = 'receipt'), (t.textContent = `✔ ${n}`), e.appendChild(t);
}
async function f() {
  const e = document.createElement('div');
  (e.className = 'typing'),
    (e.innerHTML = '<span></span><span></span><span></span>'),
    a.appendChild(e),
    u(),
    await c(650),
    e.remove();
}
async function g(e, n) {
  await f();
  const t = l('david', '');
  if (i) t.textContent = e;
  else {
    for (let r = 4; r <= e.length; r += 4)
      (t.textContent = e.slice(0, r)),
        u(),
        await new Promise((s) => setTimeout(s, 12));
    t.textContent = e;
  }
  T(t, n);
}
let m = !1;
async function S() {
  if (!m) {
    m = !0;
    for (const e of h)
      l('recruiter', e.question),
        await c(i ? 0 : 400),
        await g(e.answer, e.source),
        await c(i ? 0 : 500);
  }
}
function C(e) {
  p.innerHTML = '';
  for (const n of e) {
    const t = document.createElement('button');
    (t.type = 'button'),
      (t.className = 'chip'),
      (t.textContent = n),
      t.addEventListener('click', () => w(n)),
      p.appendChild(t);
  }
}
async function w(e) {
  (y.value = ''), l('user', e);
  const n = v(e),
    t = n ? b(n) : null;
  await c(i ? 0 : 300),
    t ? await g(t.answer, t.source) : (await f(), l('david', E));
}
L.addEventListener('submit', (e) => {
  e.preventDefault();
  const n = y.value.trim();
  n && w(n);
});
C(A);
S();
//# sourceMappingURL=index-BeCltT-x.js.map
