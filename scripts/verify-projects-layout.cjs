const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const b = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
    args: ['--no-sandbox']
  });
  const receipts = [];
  try {
    for (const width of [390, 768, 1180, 1366, 683]) {
      const p = await b.newPage({
        viewport: { width, height: 850 },
        reducedMotion: 'reduce'
      });
      const errors = [];
      p.on('pageerror', (e) => errors.push(e.message));
      await p.goto(process.argv[2] + '/projects', { waitUntil: 'networkidle' });
      for (const card of await p
        .getByRole('button', {
          name: /VoidArch Context|VoidArch Studio|AgentSec Suite|saas-core|Hosted AI Product|Active Companion|Client Studio/
        })
        .all()) {
        await card.click();
        const bg = await card.evaluate(
          (e) => getComputedStyle(e).backgroundColor
        );
        assert(!bg.startsWith('rgba('), 'Selected card must be opaque: ' + bg);
      }
      for (const name of ['Overview', 'Code', 'Architecture']) {
        await p.getByRole('tab', { name, exact: true }).click();
        const values = await p.getByRole('tab').evaluateAll((items) =>
          items.map((e) => {
            const rgba = (color) => {
              const c = document.createElement('canvas');
              c.width = c.height = 1;
              const x = c.getContext('2d');
              x.fillStyle = color;
              x.fillRect(0, 0, 1, 1);
              return [...x.getImageData(0, 0, 1, 1).data];
            };
            let a = e,
              bg;
            while (a) {
              bg = rgba(getComputedStyle(a).backgroundColor);
              if (bg[3] === 255) break;
              a = a.parentElement;
            }
            return {
              label: e.textContent,
              color: rgba(getComputedStyle(e).color),
              bg
            };
          })
        );
        const luminance = (a) =>
          a
            .slice(0, 3)
            .map((v) => {
              v /= 255;
              return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
            })
            .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
        for (const v of values) {
          const a = luminance(v.color),
            z = luminance(v.bg),
            contrast = (Math.max(a, z) + 0.05) / (Math.min(a, z) + 0.05);
          assert(contrast >= 4.5, v.label + ' contrast ' + contrast);
        }
        await p.screenshot({
          path: process.argv[3] + '/' + width + '-' + name + '.png',
          fullPage: true
        });
      }
      assert.equal(
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth
        ),
        false,
        'Page overflow'
      );
      assert.equal(errors.length, 0, errors.join('\n'));
      receipts.push({ width, result: 'PASS' });
      await p.close();
    }
    fs.writeFileSync(
      process.argv[3] + '/receipt.json',
      JSON.stringify(receipts, null, 2)
    );
    console.log(receipts);
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
