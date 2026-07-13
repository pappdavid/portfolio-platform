import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
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

async function optionalUserId() {
  if (!process.env.CLERK_SECRET_KEY) return null;
  return (await auth()).userId;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

let githubProjectsChunks: string[] = [];
try {
  const projectsPath = path.join(
    process.cwd(),
    'src/data/github-projects-rag.json'
  );
  if (fs.existsSync(projectsPath)) {
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    githubProjectsChunks = projectsData.map((proj: any) => {
      return `Project Name: ${proj.name}
Description: ${proj.description}
Tech Stack: ${proj.techStack.join(', ')}
Key Features:
${proj.keyFeatures.map((f: string) => `- ${f}`).join('\n')}
Architecture / Flow:
${proj.architecture}
File Structure:
${proj.fileStructure.map((f: string) => `- ${f}`).join('\n')}
Details: ${proj.details}`;
    });
  }
} catch (err) {
  console.error('Failed to load github-projects-rag.json', err);
}

const SYSTEM_PROMPT = `You are the terminal-OS portfolio assistant for David Papp, an AI Solutions Developer based in the Rotterdam area, NL.
Your tone is developer-first, concise, lowercased-leaning, and technical.
Speak as David's assistant (assistant: ready).
You have RAG access to David's selected engineering projects (VoidArch Context, VoidArch Studio, AgentSec Suite, and saas-core) and to a factual profile of his professional experience. AgentSec component repositories are supporting modules, not separate portfolio products.

Accuracy rules — these override everything else:
- Only state facts present in the provided context. If the context does not contain the answer, say you don't have that detail and suggest emailing contact@davidpapp.dev.
- David's personal projects are engineering showcases, NOT commercial products and NOT production systems with customers. Describe them with their real status (tested prototype, live demo, proof-of-concept) as given in context.
- Never invent metrics. Do not claim uptime numbers, latency numbers, token-savings percentages, "100% coverage", or benchmark results — none exist for the personal projects. The only approved quantitative result is the approximately 40% LLM API cost reduction on an inherited service at WEBINFORM, which is an approximate professional result, not a lab benchmark.
- Do not attribute personal projects to WEBINFORM, and do not attribute WEBINFORM client work to personal projects.
- David has not fine-tuned production models; fine-tuning is coursework/personal-experiment territory. Say so if asked.

If the user asks about David's availability or status for hire (e.g. 'is David available to start?'), explicitly return: available full-time; NL/EU work authorization (no sponsorship required); based in the Rotterdam area, NL (remote/hybrid/on-site); and a direct mailto link (mailto:contact@davidpapp.dev).
If the response includes a file structure, tech stack, or code snippet, format it using markdown code blocks.`;

export async function POST(req: Request) {
  const userId = await optionalUserId();
  const identifier = userId || req.headers.get('x-forwarded-for') || 'anon';

  const limiter = userId ? chatAuthRateLimit : chatPublicRateLimit;
  const { success } = await limiter.limit(identifier);
  if (!success) {
    return NextResponse.json(
      { error: `Rate limit exceeded (${userId ? '50' : '2'}/hr)` },
      { status: 429 }
    );
  }

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

  const relevantProjects = retrieveChunks(
    lastMessage.content,
    githubProjectsChunks,
    3
  );

  let relevantUploads: string[] = [];
  if (context) {
    const chunks = chunkText(context);
    relevantUploads = retrieveChunks(lastMessage.content, chunks, 3);
  }

  const allContext = [...relevantProjects, ...relevantUploads];
  if (allContext.length > 0) {
    augmentedContent = `Context from David's public GitHub repositories and documents:\n${allContext.join('\n---\n')}\n\nUser question: ${lastMessage.content}`;
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Chat is temporarily unavailable; use /api/ama or email contact@davidpapp.dev.' },
      { status: 503 }
    );
  }

  const stream = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
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
