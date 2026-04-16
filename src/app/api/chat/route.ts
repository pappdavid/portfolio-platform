import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { chatPublicRateLimit, chatAuthRateLimit } from '@/lib/rate-limit';
import { chunkText, retrieveChunks } from '@/lib/chat/rag';
import { getOrCreateCompanyForUser } from '@/lib/company';
import {
  checkAndConsumeQuota,
  DemoExpiredError,
  QuotaExhaustedError
} from '@/lib/demo-quota';

function getOpenAIClient(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  const identifier = userId || req.headers.get('x-forwarded-for') || 'anon';

  const limiter = userId ? chatAuthRateLimit : chatPublicRateLimit;
  const { success } = await limiter.limit(identifier);
  if (!success) {
    return NextResponse.json(
      { error: `Rate limit exceeded (${userId ? '50' : '2'}/hr)` },
      { status: 429 }
    );
  }

  // Quota check for signed-in users
  if (userId) {
    try {
      const user = await currentUser();
      if (user) {
        const company = await getOrCreateCompanyForUser(user);
        await checkAndConsumeQuota(company.companyId, 'rag', userId);
      }
    } catch (err) {
      if (err instanceof DemoExpiredError) {
        return NextResponse.json({ code: 'DEMO_EXPIRED' }, { status: 403 });
      }
      if (err instanceof QuotaExhaustedError) {
        return NextResponse.json({ code: 'QUOTA_EXHAUSTED' }, { status: 403 });
      }
    }
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

  const stream = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful AI assistant.' },
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
