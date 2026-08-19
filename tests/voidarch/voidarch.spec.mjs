import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const baseURL = process.env.VOIDARCH_BASE_URL ?? 'http://127.0.0.1:3100';

async function withPage(run, options = {}) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(options);
  const page = await context.newPage();
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
