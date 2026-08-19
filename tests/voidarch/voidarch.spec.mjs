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
