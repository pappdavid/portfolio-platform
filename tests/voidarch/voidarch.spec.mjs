import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const baseURL = process.env.VOIDARCH_BASE_URL ?? 'http://127.0.0.1:3100';

async function withPage(run, options = {}) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(options);
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  try {
    await run(page);
  } finally {
    await browser.close();
  }
}

test('VoidArch route renders the thesis, atlas, and maturity labels', async () => {
  await withPage(async (page) => {
    const response = await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), 200);
    await assert.doesNotReject(() => page.getByRole('heading', { level: 1, name: /context, route, execute, remember/i }).waitFor());
    await assert.doesNotReject(() => page.getByTestId('voidarch-atlas').waitFor());
    await assert.doesNotReject(() => page.getByTestId('voidarch-liquid-field').waitFor());
    const body = (await page.locator('body').innerText()).toUpperCase();
    assert.match(body, /WORKING/);
    assert.match(body, /PROTOTYPE/);
    assert.match(body, /ACTIVE/);
  });
});

test('atlas focus, zoom reset, and route playback are interactive', async () => {
  await withPage(async (page) => {
    await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: /^Router$/ }).click();
    const inspector = page.getByTestId('voidarch-inspector');
    await inspector.waitFor();
    assert.match(await inspector.innerText(), /Intent and capability-aware decision layer/i);
    assert.match(await inspector.innerText(), /PROTOTYPE/);

    const world = page.getByTestId('voidarch-world');
    assert.equal(await world.getAttribute('data-zoom'), '1.00');
    await page.getByRole('button', { name: /zoom in/i }).click();
    assert.notEqual(await world.getAttribute('data-zoom'), '1.00');
    await page.getByRole('button', { name: /reset atlas view/i }).click();
    assert.equal(await world.getAttribute('data-zoom'), '1.00');

    await page.getByRole('button', { name: /play request route/i }).click();
    const trace = page.getByTestId('voidarch-route-trace');
    await trace.waitFor();
    await page.waitForFunction(() => document.querySelector('[data-testid="voidarch-route-trace"]')?.getAttribute('data-state') === 'success');
    assert.match(await trace.innerText(), /evidence persisted/i);
  });
});

test('atlas uses one fixed world coordinate system across viewport resize', async () => {
  await withPage(async (page) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });
    const world = page.getByTestId('voidarch-world');
    assert.equal(await world.getAttribute('data-world-width'), '1600');
    assert.equal(await world.getAttribute('data-world-height'), '900');
    await page.setViewportSize({ width: 900, height: 900 });
    assert.equal(await world.getAttribute('data-world-width'), '1600');
    assert.equal(await world.getAttribute('data-world-height'), '900');
    assert.equal(await page.getByTestId('edge-context-router').getAttribute('viewBox'), '0 0 1600 900');
  });
});

test('lower page is project-specific, evidence-dense, and avoids fake demo metrics', async () => {
  await withPage(async (page) => {
    await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });
    const text = (await page.locator('body').innerText()).toUpperCase();
    for (const phrase of [
      'THE ARCHITECTURE IS ALREADY SPLIT INTO REAL PROJECTS',
      'A TASK CROSSES SIX CONCRETE BOUNDARIES',
      'CONTEXT IS SIX SYSTEMS BEFORE IT IS A PROMPT',
      'STUDIO IS A DAEMON BEFORE IT IS A DASHBOARD',
      'SECURITY WORK BECAME POLICY PRIMITIVES',
      'PRODUCT EXPERIMENTS EXPOSED THE SAME INFRASTRUCTURE PROBLEMS',
      'WHAT IS STILL MISSING'
    ]) assert.match(text, new RegExp(phrase));
    for (const fact of ['SURREALKV', 'BM25', 'TREE-SITTER', 'PREPAREDCONTEXTREQUEST', 'DAEMON-OWNED PTY', 'TAURI', 'REQUIRES_APPROVAL']) {
      assert.match(text, new RegExp(fact));
    }
    assert.doesNotMatch(text, /€0\.18|GROUNDING 93%|QUEUE 12/);
  });
});

test('Context internals are interactive and expose actual commands and storage layers', async () => {
  await withPage(async (page) => {
    await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /^Code graph$/ }).click();
    const detail = page.getByTestId('context-detail');
    assert.match(await detail.innerText(), /Tree-sitter/i);
    assert.match(await detail.innerText(), /graph build/i);
    await page.getByRole('button', { name: /^Vectors$/ }).click();
    assert.match(await detail.innerText(), /MiniLM/i);
  });
});

test('Studio and policy diagrams each own labels and geometry in one SVG', async () => {
  await withPage(async (page) => {
    await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });
    const studio = page.getByTestId('studio-topology');
    assert.equal(await studio.getAttribute('viewBox'), '0 0 900 520');
    const studioText = ((await studio.textContent()) ?? '').toUpperCase();
    assert.match(studioText, /DAEMON/);
    assert.match(studioText, /PTY SESSIONS/);
    assert.match(studioText, /TAURI SHELL/);
    assert.match(studioText, /WORKTREES/);

    const policy = page.getByTestId('policy-flow');
    assert.equal(await policy.getAttribute('viewBox'), '0 0 1000 360');
    const policyText = ((await policy.textContent()) ?? '').toUpperCase();
    assert.match(policyText, /ALLOW/);
    assert.match(policyText, /BLOCK/);
    assert.match(policyText, /REQUIRES_APPROVAL/);
    assert.match(policyText, /APPROVEOPS/);
  });
});

test('atlas nodes are keyboard operable and mobile layout does not overflow the viewport', async () => {
  await withPage(async (page) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });
    const router = page.getByRole('button', { name: /^Router$/ });
    await router.focus();
    await page.keyboard.press('Enter');
    await page.getByTestId('voidarch-inspector').waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 1, `horizontal overflow: ${overflow}px`);
    await page.getByRole('heading', { name: /context is six systems/i }).scrollIntoViewIfNeeded();
    assert.ok(await page.getByRole('button', { name: /^Code graph$/ }).isVisible());
  });
});

test('reduced motion is respected and the liquid field can be disabled without hiding the atlas', async () => {
  await withPage(async (page) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });
    const canvas = page.getByTestId('voidarch-liquid-field');
    await page.waitForFunction(() => Boolean(document.querySelector('[data-testid="voidarch-liquid-field"]')?.getAttribute('data-webgl')));
    const state = await canvas.getAttribute('data-webgl');
    assert.ok(['reduced-motion', 'fallback'].includes(state ?? ''), state ?? 'missing');

    await page.getByRole('button', { name: /toggle liquid field/i }).click();
    assert.equal(await canvas.getAttribute('data-enabled'), 'false');
    assert.ok(await page.getByTestId('voidarch-atlas').isVisible());
  });
});


test('Agent View opens a readable interface instead of raw JSON', async () => {
  await withPage(async (page) => {
    await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: /agent view/i }).click();
    await page.waitForURL(/\/voidarch\/agent(?:$|\?)/);
    assert.match(await page.getByRole('heading', { level: 1 }).innerText(), /agent-readable architecture/i);
    assert.ok(await page.getByRole('link', { name: 'RAW ARCHITECTURE JSON', exact: true }).isVisible());
    assert.ok(await page.getByRole('link', { name: 'RAW EVIDENCE JSON', exact: true }).isVisible());
    const agentText = (await page.locator('body').innerText()).toUpperCase();
    assert.match(agentText, /MACHINE-READABLE/);
    assert.match(agentText, /PROJECT PROVENANCE/);
    assert.match(agentText, /VOIDARCH CONTEXT/);
  });
});
