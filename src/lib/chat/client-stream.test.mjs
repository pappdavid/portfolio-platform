import assert from 'node:assert/strict';
import test from 'node:test';
import { readPortfolioReply } from './client-stream.ts';

function responseFromChunks(chunks) {
  const bytes = new TextEncoder().encode(chunks.join(''));
  // Split at every byte, including inside multi-byte Unicode characters.
  return new Response(
    new ReadableStream({
      start(controller) {
        for (let i = 0; i < bytes.length; i++)
          controller.enqueue(new Uint8Array([bytes[i]]));
        controller.close();
      }
    })
  );
}

test('reads split SSE frames and Unicode, emits evidence and waits for full answer', async () => {
  let answer = '';
  let evidence = 0;
  await readPortfolioReply(
    responseFromChunks([
      'data: {"type":"evidence","items":[{"id":"one","title":"Context","kind":"project","summary":"Local","score":1}]}\r\n\r\n',
      'data: {"type":"delta","content":"Dávid "}\n\n',
      'data: {"type":"delta","content":"builds tools."}\n\n',
      'data: [DONE]\n\n'
    ]),
    (text) => {
      answer += text;
    },
    (items) => {
      evidence += items.length;
    }
  );
  assert.equal(answer, 'Dávid builds tools.');
  assert.equal(evidence, 1);
});

test('rate limits explain the next step without exposing response details', async () => {
  await assert.rejects(
    readPortfolioReply(
      new Response('private provider details', { status: 429 }),
      () => {},
      () => {}
    ),
    /chat limit.*contact@davidpapp.dev/
  );
});

test('empty and malformed streams do not appear successful', async () => {
  for (const body of ['', 'data: nope\n\n', 'data: [DONE]\n\n']) {
    await assert.rejects(
      readPortfolioReply(
        responseFromChunks([body]),
        () => {},
        () => {}
      ),
      /returned no reply/
    );
  }
});

test('provider error event gives an actionable interruption message', async () => {
  await assert.rejects(
    readPortfolioReply(
      responseFromChunks(['data: {"type":"error"}\n\n']),
      () => {},
      () => {}
    ),
    /reply was interrupted/
  );
});

test('cancels an open response stream when the provider sends an error event', async () => {
  let cancelled = false;
  const response = new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode('data: {"type":"error"}\n\n')
        );
      },
      cancel() {
        cancelled = true;
      }
    })
  );
  await assert.rejects(
    readPortfolioReply(
      response,
      () => {},
      () => {}
    ),
    /reply was interrupted/
  );
  assert.equal(cancelled, true);
});

test('rejects a partial answer when the server closes before its completion marker', async () => {
  await assert.rejects(
    readPortfolioReply(
      responseFromChunks(['data: {"type":"delta","content":"partial"}\n\n']),
      () => {},
      () => {}
    ),
    /interrupted/
  );
});

test('validates evidence shape and allows only HTTPS or local absolute paths', async () => {
  const item = {
    id: 'one',
    title: 'Context',
    kind: 'project',
    summary: 'Local',
    score: 1
  };
  const hrefs = [
    '/projects',
    'https://github.com/pappdavid',
    'javascript:alert(1)',
    '//evil.example',
    '/\\evil.example',
    'http://example.com',
    'data:text/html,unsafe'
  ];
  const items = hrefs.map((href, i) => ({ ...item, id: String(i), href }));
  let evidence = [];
  await readPortfolioReply(
    responseFromChunks([
      `data: ${JSON.stringify({ type: 'evidence', items: [null, {}, { ...item, title: {} }, ...items] })}\n\n`,
      'data: {"type":"delta","content":"answer"}\n\ndata: [DONE]\n\n'
    ]),
    () => {},
    (value) => {
      evidence = value;
    }
  );
  assert.equal(evidence.length, 7);
  assert.deepEqual(
    evidence.map((value) => value.href),
    [
      '/projects',
      'https://github.com/pappdavid',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]
  );
});

test('cancels non-OK response bodies before returning an actionable error', async () => {
  let cancelled = false;
  const response = new Response(
    new ReadableStream({
      cancel() {
        cancelled = true;
      }
    }),
    { status: 429 }
  );
  await assert.rejects(
    readPortfolioReply(
      response,
      () => {},
      () => {}
    ),
    /chat limit/
  );
  assert.equal(cancelled, true);
});
