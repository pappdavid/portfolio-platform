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

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Load public github projects corpus
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

const SYSTEM_PROMPT = `You are the terminal-OS portfolio assistant for David Papp, an AI Solution Developer based in Rotterdam, NL.
Your tone is developer-first, concise, lowercased-leaning, and highly technical.
Speak as David's assistant (zui@portfolio or assistant: ready).
You have direct RAG access to David's public GitHub projects: AgentSec, agent-cli-mcp-rust, antigravity-skill-injector, thesys-c1-dashboard, and saas-core.
Always answer questions about David's projects, experience, stack, and availability with highly detailed, technically accurate information, using the provided context.
If the user asks about David's availability, startup readiness, or status for hire (e.g. 'is David available to start?'), you MUST explicitly return his availability date (Available immediately / present), his work authorization (NL / EU Work Authorization - no sponsorship required), his location (Rotterdam, NL - remote / hybrid), and a direct mailto link (mailto:contact@davidpapp.dev) encouraging them to get in touch.
If a user asks about David's projects, write content about them or write code/ASCII designs.
If the response includes a file structure, tech stack, or code snippet, format it clearly using markdown code blocks.
If requested to draft project cards, write content in concise metadata format:
NAME: <project_name>
SIZE: <file_size>
MODIFIED: <iso_date>
DESCRIPTION: <brief_tagline>
CASE STUDY: <detailed_summary>`;

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

  // Retrieve matching public projects
  const relevantProjects = retrieveChunks(
    lastMessage.content,
    githubProjectsChunks,
    3
  );

  // Retrieve matching uploaded document context
  let relevantUploads: string[] = [];
  if (context) {
    const chunks = chunkText(context);
    relevantUploads = retrieveChunks(lastMessage.content, chunks, 3);
  }

  const allContext = [...relevantProjects, ...relevantUploads];
  if (allContext.length > 0) {
    augmentedContent = `Context from David's public GitHub repositories and documents:\n${allContext.join('\n---\n')}\n\nUser question: ${lastMessage.content}`;
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
