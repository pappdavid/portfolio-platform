import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();

function read(path) {
  return readFileSync(resolve(root, path), 'utf8');
}

function assertNoWrongLinkedIn(path) {
  const source = read(path);
  assert(
    !source.includes('linkedin.com/in/pappdavid'),
    `${path} must not reference the old LinkedIn handle`
  );
  assert(
    !source.includes('https://www.linkedin.com/in/pappdavid'),
    `${path} must not link to the old LinkedIn URL`
  );
}

const cv = statSync(resolve(root, 'public/cv.pdf'));
const cvSource = readFileSync(resolve(root, 'public/cv.pdf'), 'latin1');
assert(cv.size > 5_000, 'public/cv.pdf must be a real non-empty CV PDF');
assert(
  cvSource.includes('David Papp'),
  'public/cv.pdf must contain readable CV text'
);
assert(
  !cvSource.includes('<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]>>'),
  'public/cv.pdf must not be the blank one-page placeholder'
);

for (const path of [
  'src/components/landing/contact-section.tsx',
  'src/components/landing/footer-sig.tsx',
  'src/components/layout/footer.tsx',
  'src/lib/ama/corpus.ts'
]) {
  assertNoWrongLinkedIn(path);
}

const chrome = read('src/components/landing/chrome2.tsx');
assert(
  chrome.includes("href='/#contact'"),
  'top navigation connect CTA should scroll to the contact section'
);
assert(
  !chrome.includes("href='mailto:contact@davidpapp.dev'"),
  'top navigation connect CTA should not directly open mailto'
);

const about = read('src/app/(public)/about/page.tsx');
assert(
  about.includes("redirect('/#proof')"),
  '/about should redirect into the DavidOS homepage experience'
);

const publicFooter = read('src/components/layout/footer.tsx');
assert(
  !publicFooter.includes("href: '/about'"),
  'generic public footer should not link to the orphaned about route'
);

const assistant = read('src/components/landing/assistant-section.tsx');
assert(
  !assistant.includes("href='/chat'"),
  'assistant examples and CTA should not navigate to the RAG demo'
);
assert(
  assistant.includes("fetch('/api/ama'"),
  'assistant section should use the portfolio-local AMA endpoint'
);

const amaApi = read('src/app/api/ama/route.ts');
assert(
  !amaApi.includes("{ label: 'About David', url: '/about' }"),
  'AMA responses should not send users to /about'
);
assert(
  amaApi.includes('answerPortfolioQuestion'),
  'AMA API should have a local portfolio answer fallback'
);

const mcp = read('src/components/mcp/mcp-content.tsx');
assert(
  !mcp.includes('new EventSource'),
  'MCP sample workflow should not depend on a network SSE call'
);
assert(
  mcp.includes('DEMO_EVENTS') && mcp.includes('STREAM_STEP_MS'),
  'MCP sample workflow should use deterministic client-side demo events'
);
