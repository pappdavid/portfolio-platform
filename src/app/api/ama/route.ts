import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { amaPublicRateLimit, amaAuthRateLimit } from '@/lib/rate-limit';
import { amaCorpus } from '@/lib/ama/corpus';
import { chunkText, retrieveChunks } from '@/lib/chat/rag';

const AVAILABLE_LINKS = [
  { label: 'MCP Sentinel demo', url: '/mcp' },
  { label: 'Training Pipeline demo', url: '/training' },
  { label: 'RAG + 3D Chat demo', url: '/chat' },
  { label: 'Projects overview', url: '/projects' },
  { label: 'About David', url: '/about' },
  { label: 'MCP dashboard', url: '/dashboard/mcp' },
  { label: 'Training dashboard', url: '/dashboard/training' }
];

const SYSTEM_PROMPT = `You are a portfolio assistant for David Papp, an AI engineer. Answer questions about David's work, projects, experience, and tech stack based strictly on the provided context.

Rules:
- Be concise (2-4 sentences max)
- Speak in third person about David ("David built...", "David focuses on...")
- Only reference facts from the context
- Always return valid JSON in this exact format: {"answer":"...","links":[{"label":"...","url":"..."}]}
- Include 1-3 relevant links from this list: ${JSON.stringify(AVAILABLE_LINKS)}
- If you don't know the answer from context, say "I don't have that detail in my portfolio content."`;

export async function POST(req: Request) {
  const { userId } = await auth();
  const identifier = userId || req.headers.get('x-forwarded-for') || 'anon';

  const limiter = userId ? amaAuthRateLimit : amaPublicRateLimit;
  const { success } = await limiter.limit(identifier);
  if (!success) {
    return NextResponse.json(
      { error: `Rate limit exceeded (${userId ? '20' : '5'}/hr)` },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const question = body?.question?.trim();
  if (!question) {
    return NextResponse.json(
      { error: 'question is required' },
      { status: 400 }
    );
  }

  const chunks = chunkText(amaCorpus);
  const relevant = retrieveChunks(question, chunks, 3);
  const context =
    relevant.length > 0 ? relevant.join('\n\n') : amaCorpus.slice(0, 1500);

  const c1 = new OpenAI({
    baseURL: 'https://api.thesys.dev/v1/embed/',
    apiKey: process.env.THESYS_API_KEY
  });

  try {
    const completion = await c1.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4.6/v-20260331',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`
        }
      ],
      stream: false
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    console.log('AMA raw response:', raw.slice(0, 500));

    // Parse JSON response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ answer: raw, links: [] });
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]) as {
        answer: string;
        links: Array<{ label: string; url: string }>;
      };
      return NextResponse.json({
        answer: parsed.answer ?? '',
        links: parsed.links ?? []
      });
    } catch {
      // JSON parse failed — return raw content
      return NextResponse.json({ answer: raw, links: [] });
    }
  } catch (err) {
    console.error('AMA error:', err);
    return NextResponse.json(
      { error: 'Failed to generate answer' },
      { status: 500 }
    );
  }
}
