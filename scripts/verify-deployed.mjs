// Read-only verification of an explicitly selected public deployment.
// Never accept a matching project name as evidence of the requested revision.
import assert from 'node:assert/strict';
const [baseInput, expected] = process.argv.slice(2);
assert(
  baseInput && /^[0-9a-f]{40}$/.test(expected ?? ''),
  'Usage: node scripts/verify-deployed.mjs https://deployment 40-character-commit-sha'
);
const base = new URL(baseInput);
assert(
  base.protocol === 'https:' && !base.username && !base.password && !base.port,
  'Use a public HTTPS deployment URL without credentials'
);
assert(
  base.hostname === 'davidpapp.dev' || base.hostname.endsWith('.vercel.app'),
  'Use davidpapp.dev or the actual Vercel deployment hostname'
);
assert(
  base.pathname === '/' && !base.search && !base.hash,
  'Use the deployment origin only'
);
async function get(path, redirect = 'follow') {
  const response = await fetch(new URL(path, base), {
    redirect,
    signal: AbortSignal.timeout(30000)
  });
  return response;
}
const home = await get('/');
assert.equal(home.status, 200, 'Homepage must be publicly available');
const html = await home.text();
assert(
  html.includes(`<meta name="portfolio:commit" content="${expected}"`),
  'Deployed source revision is absent or differs from the requested commit'
);
for (const path of [
  '/projects',
  '/brand',
  '/security',
  '/privacy-policy',
  '/terms-of-service'
]) {
  const response = await get(path);
  assert.equal(response.status, 200, `${path}: expected 200`);
  const text = await response.text();
  assert(
    !/Application error|Internal Server Error/.test(text),
    `${path}: application error`
  );
  console.log(`${path}: 200`);
}
for (const path of [
  '/saas-projects',
  '/mcp',
  '/training',
  '/chat',
  '/projects/mcp-sentinel',
  '/projects/rag-chat',
  '/projects/training',
  '/projects/portfolio',
  '/about'
]) {
  const response = await get(path, 'manual');
  assert(
    [307, 308].includes(response.status),
    `${path}: retired route must redirect`
  );
  const target = new URL(response.headers.get('location'), base);
  assert.equal(
    target.origin,
    base.origin,
    `${path}: redirect must stay on site`
  );
  assert.equal(
    target.pathname,
    path === '/about' ? '/' : '/projects',
    `${path}: wrong redirect`
  );
  console.log(`${path}: ${response.status} -> ${target.pathname}`);
}
const pdf = await get('/cv.pdf');
assert.equal(pdf.status, 200, 'CV must load');
assert(
  pdf.headers.get('content-type')?.includes('application/pdf'),
  'CV content type'
);
const bytes = new Uint8Array(await pdf.arrayBuffer());
assert(
  bytes.length > 20000 &&
    new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-',
  'CV must contain a valid generated PDF'
);
assert(html.includes('contact@davidpapp.dev'), 'Contact email missing');
console.log(
  `Verified ${base.origin} at ${expected}; CV ${bytes.length} bytes.`
);
