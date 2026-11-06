// Run against an isolated local app, with Playwright installed separately.
// CHAT_TEST_ORIGIN=http://localhost:3109 PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/client-chat-regression.mjs
import assert from 'node:assert/strict';
import { mkdir, writeFile, rm } from 'node:fs/promises';
const origin = process.env.CHAT_TEST_ORIGIN || 'http://localhost:3109';
assert(
  ['127.0.0.1', 'localhost'].includes(new URL(origin).hostname),
  'Local test server required'
);
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || 'playwright'
);
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox']
});
const fixture = new URL('../src/app/chat-regression-fixture/', import.meta.url);
await mkdir(fixture); // Refuse to overwrite any existing route.
await writeFile(
  new URL('page.tsx', fixture),
  `'use client';\nimport { useState } from 'react';\nimport { LandingContent } from '@/components/landing/landing-content';\nexport default function Fixture() { const [show, setShow] = useState(true); return <><button onClick={() => setShow(false)}>Unmount conversation</button>{show && <LandingContent />}</>; }\n`
);
const results = [];
async function scenario(name, run) {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  // Stub only the external chat boundary; the real React lifecycle and reader run.
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    window.chatRequests = [];
    window.chatMode = 'success';
    window.chatAborted = false;
    window.fetch = (input, init) => {
      if (input !== '/api/chat') return originalFetch(input, init);
      window.chatRequests.push(JSON.parse(init.body));
      const abortable = (resolve, reject) => {
        init.signal.addEventListener(
          'abort',
          () => {
            window.chatAborted = true;
            reject(new DOMException('Aborted', 'AbortError'));
          },
          { once: true }
        );
      };
      if (window.chatMode === 'fetch-hang') return new Promise(abortable);
      const enc = new TextEncoder();
      return Promise.resolve(
        new Response(
          new ReadableStream({
            start(controller) {
              controller.enqueue(
                enc.encode(
                  'data: {"type":"evidence","items":[{"id":"one","title":"Reviewed source","kind":"project","summary":"Source","score":1,"href":"/projects"}]}\n\n'
                )
              );
              if (window.chatMode === 'read-hang') {
                init.signal.addEventListener(
                  'abort',
                  () => {
                    window.chatAborted = true;
                    controller.error(new DOMException('Aborted', 'AbortError'));
                  },
                  { once: true }
                );
                return;
              }
              controller.enqueue(
                enc.encode(
                  'data: {"type":"delta","content":"partial answer"}\n\n'
                )
              );
              controller.enqueue(
                enc.encode(
                  window.chatMode === 'error'
                    ? 'data: {"type":"error"}\n\n'
                    : 'data: [DONE]\n\n'
                )
              );
              controller.close();
            }
          }),
          { headers: { 'Content-Type': 'text/event-stream' } }
        )
      );
    };
  });
  try {
    // Next dev discovers the temporary route asynchronously after creation.
    for (let attempt = 0; attempt < 20; attempt++) {
      const response = await page.goto(
        `${origin}/chat-regression-fixture?capture=1`
      );
      if (response.status() !== 404) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const input = page.getByRole('textbox', {
      name: 'Question for the portfolio assistant'
    });
    await input.waitFor();
    await run(page, input);
    results.push({ name, status: 'PASS' });
  } catch (error) {
    results.push({ name, status: 'FAIL', error: error.message });
  } finally {
    await context.close();
  }
}
try {
  await scenario(
    'IME Enter does not send; committed Enter sends once',
    async (page, input) => {
      await input.fill('日本語');
      await input.dispatchEvent('keydown', { key: 'Enter', isComposing: true });
      assert.equal(await page.evaluate(() => window.chatRequests.length), 0);
      await input.press('Enter');
      await page.waitForFunction(() => window.chatRequests.length === 1);
    }
  );
  await scenario(
    'failed partial answer and evidence are removed and excluded from later history',
    async (page, input) => {
      await page.evaluate(() => {
        window.chatMode = 'error';
      });
      await input.fill('First question');
      await input.press('Enter');
      await page
        .getByRole('log')
        .getByText(/reply was interrupted/)
        .waitFor();
      assert.equal(
        await page
          .getByRole('log')
          .getByText('partial answer', { exact: true })
          .count(),
        0
      );
      assert.equal(
        await page.getByRole('log').getByText('Reviewed source').count(),
        0
      );
      await page.evaluate(() => {
        window.chatMode = 'success';
      });
      await input.fill('Second question');
      await input.press('Enter');
      await page.waitForFunction(() => window.chatRequests.length === 2);
      const messages = await page.evaluate(
        () => window.chatRequests[1].messages
      );
      assert(
        !messages.some((m) => /interrupted|partial answer/.test(m.content))
      );
      assert(messages.some((m) => m.content === 'First question'));
    }
  );
  for (const mode of ['fetch-hang', 'read-hang']) {
    await scenario(
      `30-second timeout releases UI and supports retry during ${mode}`,
      async (page, input) => {
        await page.clock.install();
        await page.evaluate((value) => {
          window.chatMode = value;
        }, mode);
        await input.fill('A question');
        await input.press('Enter');
        await page.waitForFunction(() => window.chatRequests.length === 1);
        await page.clock.fastForward(30001);
        await page
          .getByRole('log')
          .getByText(/took too long/)
          .waitFor();
        assert.equal(
          await page.getByRole('log').getAttribute('aria-busy'),
          'false'
        );
        assert.equal(await page.evaluate(() => window.chatAborted), true);
        await page.evaluate(() => {
          window.chatMode = 'success';
        });
        await input.fill('Retry');
        await input.press('Enter');
        await page
          .getByRole('log')
          .getByText('partial answer', { exact: true })
          .waitFor();
      }
    );
  }
  for (const mode of ['fetch-hang', 'read-hang'])
    await scenario(`unmount aborts ${mode}`, async (page, input) => {
      await page.evaluate((value) => {
        window.chatMode = value;
      }, mode);
      await input.fill('A question');
      await input.press('Enter');
      await page.waitForFunction(() => window.chatRequests.length === 1);
      await page.getByRole('button', { name: 'Unmount conversation' }).click();
      assert.equal(await page.evaluate(() => window.chatAborted), true);
    });
  await scenario(
    'projects render six separate hosted sample links',
    async (page) => {
      await page.goto(`${origin}/projects`);
      await page
        .getByRole('button', { name: /Hosted AI Product Showcases/ })
        .click();
      const hosts = [
        'standup-liar',
        'meeting-receipt',
        'velocity-truth',
        'cloud-shame',
        'speccop',
        'crueldocs'
      ];
      for (const host of hosts) {
        assert(
          (await page
            .locator(`a[href="https://${host}-showcase.vercel.app/"]`)
            .count()) > 0,
          `${host} link missing`
        );
      }
    }
  );
} finally {
  await browser.close();
  await rm(fixture, { recursive: true });
}
console.log(JSON.stringify(results, null, 2));
if (results.some((result) => result.status !== 'PASS')) process.exitCode = 1;
