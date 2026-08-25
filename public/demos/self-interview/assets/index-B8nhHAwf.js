(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) r(o);
  new MutationObserver((o) => {
    for (const s of o)
      if (s.type === 'childList')
        for (const d of s.addedNodes)
          d.tagName === 'LINK' && d.rel === 'modulepreload' && r(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(o) {
    const s = {};
    return (
      o.integrity && (s.integrity = o.integrity),
      o.referrerPolicy && (s.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === 'use-credentials'
        ? (s.credentials = 'include')
        : o.crossOrigin === 'anonymous'
          ? (s.credentials = 'omit')
          : (s.credentials = 'same-origin'),
      s
    );
  }
  function r(o) {
    if (o.ep) return;
    o.ep = !0;
    const s = n(o);
    fetch(o.href, s);
  }
})();
const v = [
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
function A(e) {
  const t = (e || '').toLowerCase();
  for (const n of v) if (n.patterns.some((r) => t.includes(r))) return n.answer;
  return null;
}
const y = [
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
  return y.find((t) => t.id === e);
}
const E = [
    'Is he junior?',
    'Has he shipped real things?',
    "What's actually production vs prototype?",
    'Did fixing a service cut costs?',
    "What's his stack?"
  ],
  L =
    "Good question — I don't have a scripted answer for that one, and I won't improvise facts. Ask David directly and he'll give you a straight answer.",
  l = document.getElementById('chat'),
  p = document.getElementById('chips'),
  S = document.getElementById('composer-form'),
  g = document.getElementById('composer-input'),
  i = window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  a = (e) => new Promise((t) => setTimeout(t, i ? 0 : e));
function u() {
  requestAnimationFrame(() => {
    l.scrollTop = l.scrollHeight;
  });
}
function c(e, t) {
  const n = document.createElement('div');
  return (
    (n.className = `msg ${e}`), (n.textContent = t), l.appendChild(n), u(), n
  );
}
function T(e, t) {
  if (!t) return;
  const n = document.createElement('span');
  (n.className = 'receipt'), (n.textContent = `✔ ${t}`), e.appendChild(n);
}
async function f() {
  const e = document.createElement('div');
  (e.className = 'typing'),
    (e.innerHTML = '<span></span><span></span><span></span>'),
    l.appendChild(e),
    u(),
    await a(650),
    e.remove();
}
async function w(e, t) {
  await f();
  const n = c('david', '');
  if (i) n.textContent = e;
  else {
    for (let r = 4; r <= e.length; r += 4)
      (n.textContent = e.slice(0, r)),
        u(),
        await new Promise((o) => setTimeout(o, 12));
    n.textContent = e;
  }
  T(n, t);
}
const m = {
  'ai-engineering': 'the AI Engineering page',
  'ai-integration': 'the AI Integration page',
  automation: 'the Automation page',
  'product-engineering': 'the Product Engineering page'
};
function C() {
  try {
    const e = new URLSearchParams(window.location.search).get('role');
    return e && m[e]
      ? `(You came from ${m[e]} — happy to zoom in on that side of David's work.)`
      : null;
  } catch {
    return null;
  }
}
let h = !1;
async function k() {
  if (h) return;
  h = !0;
  const e = C();
  e && (c('recruiter', e), await a(i ? 0 : 400));
  for (const t of y)
    c('recruiter', t.question),
      await a(i ? 0 : 400),
      await w(t.answer, t.source),
      await a(i ? 0 : 500);
}
function x(e) {
  p.innerHTML = '';
  for (const t of e) {
    const n = document.createElement('button');
    (n.type = 'button'),
      (n.className = 'chip'),
      (n.textContent = t),
      n.addEventListener('click', () => I(t)),
      p.appendChild(n);
  }
}
async function I(e) {
  (g.value = ''), c('user', e);
  const t = A(e),
    n = t ? b(t) : null;
  await a(i ? 0 : 300),
    n ? await w(n.answer, n.source) : (await f(), c('david', L));
}
S.addEventListener('submit', (e) => {
  e.preventDefault();
  const t = g.value.trim();
  t && I(t);
});
x(E);
k();
//# sourceMappingURL=index-B8nhHAwf.js.map
