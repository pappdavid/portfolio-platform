import { NextRequest } from 'next/server';

export const runtime = 'edge';

const TOOLS = ['file_read', 'web_search', 'code_execute', 'db_query', 'send_email'];
const STATUSES = ['allowed', 'allowed', 'allowed', 'warning', 'blocked'] as const;

function makeDemoEvent(i: number) {
  return JSON.stringify({
    id: `evt_${Math.random().toString(36).slice(2, 8)}`,
    tool_name: TOOLS[i % TOOLS.length],
    action: STATUSES[i % STATUSES.length],
    latency_ms: Math.floor(Math.random() * 18 + 3),
    created_at: new Date().toISOString()
  });
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let index = 0;

  const stream = new ReadableStream({
    start(controller) {
      const burst = setInterval(() => {
        controller.enqueue(encoder.encode(`data: ${makeDemoEvent(index++)}\n\n`));
        if (index >= 5) {
          clearInterval(burst);
        }
      }, 600);

      const keepalive = setInterval(() => {
        controller.enqueue(encoder.encode(': keepalive\n\n'));
      }, 30000);

      req.signal.addEventListener('abort', () => {
        clearInterval(burst);
        clearInterval(keepalive);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
