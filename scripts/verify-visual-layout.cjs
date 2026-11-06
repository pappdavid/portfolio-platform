// Actual rendered regressions; uses existing Playwright or an explicit installed module.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const [origin, output = '/tmp/portfolio-visual-layout'] = process.argv.slice(2);
assert(origin, 'Pass the exact build origin');
const rgb = (s) => s.match(/[\d.]+/g).map(Number);
function ratio(a, b) {
  const l = (c) =>
    c
      .slice(0, 3)
      .map((x) => {
        x /= 255;
        return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      })
      .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  return (Math.max(l(a), l(b)) + 0.05) / (Math.min(l(a), l(b)) + 0.05);
}
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
    args: ['--no-sandbox']
  });
  const receipt = [];
  try {
    for (const width of [320, 390, 768, 1180, 1366, 683]) {
      const page = await browser.newPage({
        viewport: { width, height: width === 390 ? 844 : 757 }
      });
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(origin, { waitUntil: 'networkidle', timeout: 60000 });
      await page.locator('.hero-name').waitFor();
      const measured = await page.evaluate(() => {
        const s = getComputedStyle(document.querySelector('.shell'));
        const d = getComputedStyle(document.querySelector('.demo-desc'));
        const m = getComputedStyle(document.querySelector('.rs-meta'));
        return {
          background: s.backgroundColor,
          foreground: s.color,
          secondary: m.color,
          demoFont: parseFloat(d.fontSize),
          metadataFont: parseFloat(m.fontSize),
          overlay: !!document.querySelector('.crt-overlay'),
          texture: getComputedStyle(document.body, '::before').content,
          overflow: document.documentElement.scrollWidth > innerWidth,
          commit: document.querySelector('meta[name="portfolio:commit"]')
            ?.content
        };
      });
      assert.equal(
        measured.overlay,
        false,
        'CRT must not cover reading surfaces'
      );
      assert.equal(
        rgb(measured.background)[3] ?? 1,
        1,
        'Reading column must be opaque'
      );
      assert.equal(measured.texture, 'none', 'No global scanline pseudo layer');
      assert(measured.demoFont >= 16, 'Demo copy must remain readable');
      assert(
        measured.metadataFont >= 14,
        'Supporting metadata must remain readable'
      );
      assert(!measured.overflow, 'Page must not overflow horizontally');
      measured.bodyContrast = ratio(
        rgb(measured.foreground),
        rgb(measured.background)
      );
      measured.secondaryContrast = ratio(
        rgb(measured.secondary),
        rgb(measured.background)
      );
      assert(measured.bodyContrast >= 4.5);
      assert(measured.secondaryContrast >= 4.5);
      await page.screenshot({ path: path.join(output, width + '-home.png') });
      for (const theme of ['green', 'cyan', 'amber', 'pink']) {
        const themeResult = await page.evaluate((t) => {
          document.documentElement.dataset.themeProfile = t;
          const e = document.querySelector('.hero-role'),
            s = getComputedStyle(e),
            bg = getComputedStyle(document.querySelector('.term-window'));
          return { foreground: s.color, background: bg.backgroundColor };
        }, theme);
        assert(
          ratio(rgb(themeResult.foreground), rgb(themeResult.background)) >=
            4.5,
          theme + ' role contrast'
        );
      }
      await page.evaluate(() => {
        document.documentElement.dataset.themeProfile = 'green';
      });
      const navOverflow = await page
        .locator('.tab')
        .evaluateAll((items) =>
          items.some((e) => e.scrollWidth > e.clientWidth + 1)
        );
      assert(!navOverflow, 'Navigation labels collide at this width');
      const rows = page.locator('.fs-row');
      for (let i = 0; i < (await rows.count()); i++) {
        await rows.nth(i).click();
        const info = await rows.nth(i).evaluate((e) => {
          const s = getComputedStyle(e.querySelector('.c-desc'));
          const r = e.getBoundingClientRect(),
            n = e.nextElementSibling?.getBoundingClientRect();
          return {
            clipped: e.scrollWidth > e.clientWidth + 1,
            description: s.display,
            whiteSpace: s.whiteSpace,
            overlap: n && n.top < r.bottom - 1
          };
        });
        assert(!info.clipped, 'Expanded project row overflows');
        assert.notEqual(info.description, 'none');
        assert.notEqual(info.whiteSpace, 'nowrap');
        assert(!info.overlap, 'Project panel collision');
        await rows.nth(i).click();
      }
      await rows.first().scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(output, width + '-projects.png')
      });
      const heads = page.locator('.demo-card-head');
      for (let i = 0; i < (await heads.count()); i++) {
        await heads.nth(i).click();
        const iframe = page.locator('iframe.demo-iframe');
        await iframe.waitFor();
        const box = await iframe.boundingBox();
        assert(box.width <= width && box.width > 0, 'Demo width fits viewport');
        const frame = await (await iframe.elementHandle()).contentFrame();
        await frame.locator('body').waitFor();
        if (i === 0) {
          await frame.locator('.msg.david').first().waitFor({ timeout: 20000 });
          await frame
            .locator('.typing')
            .waitFor({ state: 'detached', timeout: 20000 });
          for (const q of [
            'What are David’s skills?',
            'How can I contact David?'
          ]) {
            const answersBefore = await frame.locator('.msg.david').count();
            await frame.locator('#composer-input').fill(q);
            await frame.locator('#composer-form button').click();
            await frame.waitForFunction(
              (n) => document.querySelectorAll('.msg.david').length > n,
              answersBefore,
              { timeout: 20000 }
            );
            await frame
              .locator('.typing')
              .waitFor({ state: 'detached', timeout: 20000 });
          }
          await frame
            .locator('#chat')
            .evaluate((e) => (e.scrollTop = e.scrollHeight));
          const bounds = await frame.evaluate(() => {
            const chat = document.querySelector('#chat'),
              form = document.querySelector('.composer'),
              footer = document.querySelector('.contact-link'),
              messages = [...document.querySelectorAll('.msg')];
            return {
              chat: chat.getBoundingClientRect().toJSON(),
              composer: form.getBoundingClientRect().toJSON(),
              footer: footer.getBoundingClientRect().toJSON(),
              last: messages.at(-1).getBoundingClientRect().toJSON(),
              viewport: innerHeight,
              bodyHeight: document.body.scrollHeight
            };
          });
          assert(
            bounds.composer.top >= bounds.chat.bottom - 1,
            'Composer occludes transcript'
          );
          assert(
            bounds.last.bottom <= bounds.chat.bottom + 1,
            'Final answer/receipt unreachable'
          );
          assert(
            bounds.footer.bottom <= bounds.viewport + 1,
            'Contact footer unreachable'
          );
          assert(
            bounds.bodyHeight <= bounds.viewport + 1,
            'Demo creates nested page scrolling'
          );
          await iframe.scrollIntoViewIfNeeded();
          await page.screenshot({
            path: path.join(output, width + '-self-interview.png')
          });
          await frame.locator('#chat').evaluate((e) => (e.scrollTop = 0));
        }
        await heads.nth(i).click();
        assert.equal(
          await page.locator('iframe.demo-iframe').count(),
          0,
          'Closing demo removes frame'
        );
      }
      await page
        .getByRole('button', {
          name: 'Navigate to Contact and Assistant section',
          exact: true
        })
        .click();
      await page.locator('#contact').scrollIntoViewIfNeeded();
      await page.screenshot({
        path: path.join(output, width + '-contact.png')
      });
      assert.equal(errors.length, 0, errors.join('\n'));
      receipt.push({ width, ...measured, errors, result: 'PASS' });
      await page.close();
    }
    fs.writeFileSync(
      path.join(output, 'receipt.json'),
      JSON.stringify(receipt, null, 2)
    );
    console.log(JSON.stringify(receipt, null, 2));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
