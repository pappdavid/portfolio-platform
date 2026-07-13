import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { amaPublicRateLimit, amaAuthRateLimit } from '@/lib/rate-limit';
import { amaCorpus } from '@/lib/ama/corpus';
import {
  answerPortfolioQuestion,
  portfolioAssistantLinks
} from '@/lib/ama/answer';
import { chunkText, retrieveChunks } from '@/lib/chat/rag';

const SYSTEM_PROMPT = `You are a portfolio assistant for David Papp, an AI engineer. Answer questions about David's work, projects, experience, and tech stack based strictly on the provided context.

Rules:
- Be concise (2-4 sentences max)
- Speak in third person about David ("David built...", "David focuses on...")
- Only reference facts from the context
- Always return valid JSON in this exact format: {"answer":"...","links":[{"label":"...","url":"..."}]}
- Include 1-3 relevant links from this list: ${JSON.stringify(portfolioAssistantLinks)}
- If you don't know the answer from context, say "I don't have that detail in my portfolio content."`;

const HIRING_FACT_TERMS = [
  'available',
  'availability',
  'full-time',
  'full time',
  'open to work',
  'open for work',
  'work authorization',
  'work permit',
  'sponsorship',
  'visa',
  'start date',
  'when can david start',
  'hire david'
];

const PROJECT_FACT_TERMS = [
  'project',
  'portfolio',
  'voidarch',
  'agentsec',
  'promptshield',
  'mcpguard',
  'agentmap',
  'approveops',
  'saas-core',
  'saas core'
];

function containsAnyTerm(question: string, terms: string[]) {
  const normalized = question.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

function asksForHiringFacts(question: string) {
  return containsAnyTerm(question, HIRING_FACT_TERMS);
}

function asksForProjectFacts(question: string) {
  return containsAnyTerm(question, PROJECT_FACT_TERMS);
}

async function optionalUserId() {
  if (!process.env.CLERK_SECRET_KEY) return null;
  return (await auth()).userId;
}

export async function POST(req: Request) {
  const userId = await optionalUserId();
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

  const fallback = answerPortfolioQuestion(question);

  // Hiring, work-authorization, and project identity facts must never vary by
  // model output. Return the reviewed deterministic answer even with an API key.
  if (
    asksForHiringFacts(question) ||
    asksForProjectFacts(question) ||
    !process.env.OPENAI_API_KEY
  ) {
    return NextResponse.json(fallback);
  }

  const chunks = chunkText(amaCorpus);
  const relevant = retrieveChunks(question, chunks, 3);
  const context =
    relevant.length > 0 ? relevant.join('\n\n') : amaCorpus.slice(0, 1500);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const raw = completion.choices[0]?.message?.content ?? '';

    const parsed = JSON.parse(raw) as {
      answer: string;
      links: Array<{ label: string; url: string }>;
    };
    return NextResponse.json({
      answer: parsed.answer ?? '',
      links: parsed.links ?? []
    });
  } catch {
    return NextResponse.json(fallback);
  }
}
