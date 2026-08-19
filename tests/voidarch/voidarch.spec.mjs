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

test('lower architecture sections use distinct visual systems and expose planned scope', async () => {
  await withPage(async (page) => {
    await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });
    const text = (await page.locator('body').innerText()).toUpperCase();
    for (const phrase of [
      'MEMORY HAS TOPOLOGY',
      'A REQUEST BECOMES A ROUTE',
      'AN OPERATIONAL RUNWAY',
      'SELF-IMPROVEMENT AS A CONTROLLED LOOP',
      'THE CORE HAS AN ECOSYSTEM',
      'PAST WORK BECOMES AN ARCHITECTURAL EXTRACTION PATH'
    ]) assert.match(text, new RegExp(phrase));
    assert.match(text, /PLANNED/);
    assert.match(text, /FUTURE/);
    assert.match(text, /EXTERNAL/);
  });
});

test('memory view is interactive and switches lifecycle detail', async () => {
  await withPage(async (page) => {
    await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /^Episodic$/ }).click();
    const detail = page.getByTestId('memory-detail');
    assert.match(await detail.innerText(), /What happened during a run/i);
    assert.match(await detail.innerText(), /TRACE-LINKED/i);
  });
});

test('Studio and ecosystem graphs each own their labels and geometry in one SVG', async () => {
  await withPage(async (page) => {
    await page.goto(`${baseURL}/voidarch`, { waitUntil: 'networkidle' });
    const studio = page.getByTestId('studio-topology');
    assert.equal(await studio.getAttribute('viewBox'), '0 0 720 430');
    const studioText = await studio.textContent();
    assert.match(studioText ?? '', /ORCHESTRATOR/);
    assert.match(studioText ?? '', /VERIFY/);
    assert.match(studioText ?? '', /ARTIFACT \/ STATE DELTA/);

    const ecosystem = page.getByTestId('ecosystem-boundary');
    assert.equal(await ecosystem.getAttribute('viewBox'), '0 0 1180 650');
    const ecoText = ((await ecosystem.textContent()) ?? '').toUpperCase();
    assert.match(ecoText, /HERMES/);
    assert.match(ecoText, /MCP/);
    assert.match(ecoText, /VOID-ARCH/);
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
    await page.getByRole('heading', { name: /memory has topology/i }).scrollIntoViewIfNeeded();
    assert.ok(await page.getByRole('button', { name: /^Episodic$/ }).isVisible());
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
