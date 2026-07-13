// Portfolio content consistency checks.
//
// These fail the build if recruiter-facing sources drift away from the verified
// project scope or approved professional facts. Run via `npm run check:content`.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();

function read(path) {
  return readFileSync(resolve(root, path), 'utf8');
}

const RECRUITER_FACING = [
  'src/components/landing/landing-content.tsx',
  'src/components/projects/projects-content.tsx',
  'src/components/saas-projects/saas-projects-content.tsx',
  'src/data/github-projects-rag.json',
  'src/data/saas-projects.json',
  'src/lib/ama/corpus.ts',
  'src/lib/ama/answer.ts',
  'src/app/api/chat/route.ts',
  'src/app/(public)/page.tsx',
  'src/app/(public)/saas-projects/page.tsx',
  'src/app/(public)/projects/page.tsx',
  'src/app/(public)/security/page.tsx',
  'src/app/(public)/terms-of-service/page.tsx',
  'src/app/(public)/privacy-policy/page.tsx',
  'src/components/landing/three-canvas.tsx',
  'src/app/layout.tsx',
  'public/cv.html',
  'README.md'
];

// Prevent specific unsupported recruiter-facing claims without mistaking CSS
// percentages or layout values for performance metrics.
const DISALLOWED = [
  [/100%\s*(?:of\s*)?(?:agent\s*)?executions?/i, 'execution-coverage claim'],
  [/99\.9%\s*(?:uptime|availability)/i, 'uptime claim'],
  [/97%\s*(?:token|reduction|savings)/i, 'token-savings claim'],
  [/0%\s*context\s*bloat/i, 'context-bloat claim'],
  [/\bp99\b/i, 'percentile metric'],
  [/production-ready/i, 'production-readiness claim for a prototype'],
  [/fine-tuning pipelines?/i, 'experience scope drift'],
  [/calendly\.com/i, 'stale booking link'],
  [/agentsec\.davidpapp\.dev/i, 'stale deployment link'],
  [/~?7(?:,?300|k)[-\s]?line/i, 'unverified source-line count'],
  [/\bused daily\b/i, 'unverified usage-frequency claim']
];

for (const path of RECRUITER_FACING) {
  const source = read(path);
  for (const [pattern, label] of DISALLOWED) {
    assert(!pattern.test(source), `${path}: disallowed ${label}`);
  }
}

// Guard against leaking private execution/session records or incident-specific
// cleanup language into tracked files or public commit metadata. Fragments keep
// this checker from containing the strings it is meant to reject.
const PRIVATE_TRACE_MARKERS = [
  ['Claude', '-Session'].join(''),
  ['Claude', ' Fable', ' 5'].join(''),
  ['session_', '01LzCNoz2', 'JPJUB4NxGE7LiLW'].join(''),
  ['sent to ', 'hundreds of employers'].join(''),
  ['unsupported, obsolete, ', 'or invented claims'].join(''),
  ['nonexistent ', 'hosted'].join('')
];

const trackedFiles = execFileSync('git', ['ls-files', '-z'])
  .toString('utf8')
  .split('\0')
  .filter(Boolean);
for (const path of trackedFiles) {
  const bytes = readFileSync(resolve(root, path));
  if (bytes.includes(0)) continue;
  const text = bytes.toString('utf8');
  for (const marker of PRIVATE_TRACE_MARKERS) {
    assert(!text.includes(marker), `${path}: private execution trace detected`);
  }
}
const headMessage = execFileSync('git', ['log', '-1', '--pretty=%B']).toString('utf8');
for (const marker of PRIVATE_TRACE_MARKERS) {
  assert(!headMessage.includes(marker), 'private execution trace detected in commit metadata');
}

// Core professional facts.
const landing = read('src/components/landing/landing-content.tsx');
assert(landing.includes('Oct 2024'), 'landing: WEBINFORM start date must be Oct 2024');
assert(landing.includes('WEBINFORM IT Ltd'), 'landing: employer name');
assert(landing.includes('roughly 40%'), 'landing: cost reduction must stay approximate');
assert(landing.includes('students aged 10–16'), 'landing: Logiscool age range');
assert(landing.includes('SIM.LATENCY'), 'landing: decorative telemetry must stay labelled SIM');
assert(!landing.includes('setCommitCount'), 'landing: generated commit counter must not return');

const cvHtml = read('public/cv.html');
assert(cvHtml.includes('Oct 2024'), 'cv.html: WEBINFORM start date');
assert(cvHtml.includes('2024 – 2027 (expected)'), 'cv.html: VU Amsterdam dates');
assert(cvHtml.includes('roughly 40%'), 'cv.html: approximate cost reduction wording');
assert(cvHtml.includes('page-break-inside: avoid'), 'cv.html: print pagination guard');

// The PDF must be current and usable.
const cvStat = statSync(resolve(root, 'public/cv.pdf'));
assert(cvStat.size > 20_000, 'public/cv.pdf must be the generated CV');
const cvPdf = readFileSync(resolve(root, 'public/cv.pdf'), 'latin1');
assert(cvPdf.startsWith('%PDF-'), 'public/cv.pdf must be a valid PDF');
assert(cvPdf.includes('/URI'), 'public/cv.pdf must contain clickable links');

// Contact identity must remain consistent.
for (const path of RECRUITER_FACING) {
  assert(
    !read(path).includes('linkedin.com/in/pappdavid'),
    `${path}: must use the current LinkedIn profile`
  );
}

// Previously shared routes must remain redirects, while retired pages stay absent.
const nextConfig = read('next.config.ts');
for (const route of [
  '/mcp',
  '/training',
  '/chat',
  '/projects/mcp-sentinel',
  '/projects/rag-chat',
  '/projects/training',
  '/projects/portfolio'
]) {
  assert(nextConfig.includes(`'${route}'`), `next.config.ts: missing redirect for ${route}`);
}
for (const gone of [
  'public/og/mcp-sentinel.png',
  'public/screenshots',
  'src/app/(public)/mcp/page.tsx',
  'src/app/(public)/training/page.tsx',
  'src/app/(public)/chat/page.tsx',
  'src/components/mcp/mcp-content.tsx',
  'src/components/training/training-content.tsx',
  'src/components/chat/chat-content.tsx'
]) {
  assert(!existsSync(resolve(root, gone)), `${gone}: retired content must stay removed`);
}

const about = read('src/app/(public)/about/page.tsx');
assert(about.includes('redirect('), '/about should redirect into the current homepage');

// Assistant grounding must point to current projects and current routes.
const ragData = JSON.parse(read('src/data/github-projects-rag.json'));
for (const project of ragData) {
  const text = JSON.stringify(project);
  assert(
    !/davidpapp\.dev\/(mcp|training|chat)/.test(text),
    `rag data (${project.id}): references a retired route`
  );
}
const corpus = read('src/lib/ama/corpus.ts');
assert(
  corpus.includes('not commercial products'),
  'assistant corpus: personal projects must stay framed as prototypes'
);

// The portfolio has exactly four primary projects. AgentSec is one integrated
// suite, not five competing cards, and only its integrated deployment is linked
// as a public demo.
const primaryProjectIds = ['voidarch-context', 'voidarch-studio', 'agentsec-suite', 'saas-core'];
const primaryProjectNames = ['VoidArch Context', 'VoidArch Studio', 'AgentSec Suite', 'saas-core'];
const retiredProjectMarkers = [
  'thesys-c1-dashboard',
  'THESYS_C1',
  'voidarch-context-portal'
];
const standaloneAgentSecIds = [
  "id: 'promptshield'",
  "id: 'agentsec-hook-pack'",
  "id: 'mcpguard-lite'",
  "id: 'agentmap'",
  "id: 'approveops'"
];

const projectsSource = read('src/components/projects/projects-content.tsx');
for (const name of primaryProjectNames) {
  assert(projectsSource.includes(name), `projects page: missing ${name}`);
  assert(landing.includes(name), `landing page: missing ${name}`);
  assert(cvHtml.includes(name), `CV: missing ${name}`);
  assert(corpus.includes(name), `assistant corpus: missing ${name}`);
}
for (const marker of retiredProjectMarkers) {
  for (const path of RECRUITER_FACING) {
    assert(!read(path).includes(marker), `${path}: retired project marker ${marker}`);
  }
}
for (const marker of standaloneAgentSecIds) {
  assert(!projectsSource.includes(marker), `projects page: AgentSec component must not be a standalone card (${marker})`);
}
assert(
  projectsSource.includes('https://promptshield-cyan.vercel.app'),
  'projects page: AgentSec Suite must link the integrated live demo'
);
for (const retiredDemo of [
  'https://mcpguard-lite.vercel.app',
  'https://agentmap-fawn.vercel.app',
  'https://approveops.vercel.app'
]) {
  assert(!projectsSource.includes(retiredDemo), `projects page: component demo must not be a primary CTA (${retiredDemo})`);
  assert(!landing.includes(retiredDemo), `landing page: component demo must not be a primary CTA (${retiredDemo})`);
}

const projectEntries = ragData.filter((entry) => entry.id !== 'about-david');
assert.equal(projectEntries.length, 4, 'RAG data: exactly four project entries required');
assert.deepEqual(
  projectEntries.map((entry) => entry.id),
  primaryProjectIds,
  'RAG data: project order and identities must match the approved portfolio'
);

console.log('portfolio content consistency checks passed');
