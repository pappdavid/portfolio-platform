import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { chatRateLimit, chatAuthRateLimit } from '@/lib/rate-limit';
import { chunkText, retrieveChunks } from '@/lib/chat/rag';

const c1 = new OpenAI({
  baseURL: 'https://api.thesys.dev/v1/embed/',
  apiKey: process.env.THESYS_API_KEY
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  const identifier = userId || req.headers.get('x-forwarded-for') || 'anon';

  const limiter = userId ? chatAuthRateLimit : chatRateLimit;
  const { success } = await limiter.limit(identifier);
  if (!success) {
    return NextResponse.json(
      { error: `Rate limit exceeded (${userId ? '50' : '10'}/hr)` },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { messages, context } = body as {
    messages: ChatMessage[];
    context?: string;
  };

  if (!messages || messages.length === 0) {
    return NextResponse.json(
      { error: 'messages is required' },
      { status: 400 }
    );
  }

  const lastMessage = messages[messages.length - 1];
  let augmentedContent = lastMessage.content;

  if (context) {
    const chunks = chunkText(context);
    const relevant = retrieveChunks(lastMessage.content, chunks);
    if (relevant.length > 0) {
      augmentedContent = `Context from uploaded documents:\n${relevant.join('\n---\n')}\n\nUser question: ${lastMessage.content}`;
    }
  }

  const stream = await c1.chat.completions.create({
    model: 'c1-nightly',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful AI assistant. When asked about 3D objects, respond with JSON: { "objects": [{ "type": "box"|"sphere"|"cylinder", "position": [x,y,z], "size": [w,h,d], "color": "#hex" }] }'
      },
      ...messages.slice(0, -1),
      { role: 'user', content: augmentedContent }
    ],
    stream: true
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
          );
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    }
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
