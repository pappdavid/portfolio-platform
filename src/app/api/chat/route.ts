import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { streamText } from 'ai';
import fs from 'fs';
import path from 'path';
import { getPortfolioModel } from '@/lib/openrouter';
import { chatPublicRateLimit, chatAuthRateLimit } from '@/lib/rate-limit';
import { getOrCreateCompanyForUser } from '@/lib/company';
import { amaCorpus } from '@/lib/ama/corpus';
import {
  buildPortfolioKnowledgeBase,
  formatKnowledgeContext,
  retrieveKnowledge,
  toEvidenceItems
} from '@/lib/chat/knowledge-base';
import { getReferralPersonalization } from '@/lib/referral-context';
import {
  buildReferralChatContext,
  buildReferralRetrievalQuery,
  REFERRAL_COOKIE
} from '@/lib/referral-personalization';
import {
  checkAndConsumeQuota,
  DemoExpiredError,
  QuotaExhaustedError
} from '@/lib/demo-quota';
import { findRecruiterChipAnswer } from '@/lib/recruiter-chips';

async function optionalUserId() {
  if (!process.env.CLERK_SECRET_KEY) return null;
  return (await auth()).userId;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

let portfolioKnowledgeBase = buildPortfolioKnowledgeBase(amaCorpus, []);
try {
  const projectsPath = path.join(
    process.cwd(),
    'src/data/github-projects-rag.json'
  );
  if (fs.existsSync(projectsPath)) {
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    portfolioKnowledgeBase = buildPortfolioKnowledgeBase(
      amaCorpus,
      projectsData
    );
  }
} catch (err) {
  console.error('Failed to load portfolio knowledge base', err);
}

const SYSTEM_PROMPT = `You are the terminal-OS portfolio assistant for David Papp, an AI Solutions Developer based in the Rotterdam area, NL.
Your tone is developer-first, concise, lowercased-leaning, and technical.
Speak as David's assistant (assistant: ready).
You have retrieval access to David's reviewed portfolio knowledge base: professional work, earlier experience, availability, stack, project scope, and selected engineering projects. AgentSec component repositories are supporting modules, not separate portfolio products.

Accuracy rules — these override everything else:
- Only state facts present in the provided context. If the context does not contain the answer, say you don't have that detail and suggest emailing contact@davidpapp.dev.
- David's personal projects are engineering showcases, NOT commercial products and NOT production systems with customers. Describe them with their real status (tested prototype, live demo, proof-of-concept) as given in context.
- Never invent metrics. Do not claim uptime numbers, latency numbers, token-savings percentages, "100% coverage", or benchmark results — none exist for the personal projects. The only approved quantitative result is the approximately 40% LLM API cost reduction on an inherited service at WEBINFORM, which is an approximate professional result, not a lab benchmark.
- Do not attribute personal projects to WEBINFORM, and do not attribute WEBINFORM client work to personal projects.
- David has not fine-tuned production models; fine-tuning is coursework/personal-experiment territory. Say so if asked.

If the user asks about David's availability or status for hire (e.g. 'is David available to start?'), explicitly return: available full-time; NL/EU work authorization (no sponsorship required); based in the Rotterdam area, NL (remote/hybrid/on-site); and a direct mailto link (mailto:contact@davidpapp.dev).
Keep normal answers under 180 words. Use concise Markdown when structure helps. If the response includes a file structure, tech stack, or code snippet, format it using markdown code blocks.`;

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

  const cookieStore = await cookies();
  const referral = await getReferralPersonalization(
    cookieStore.get(REFERRAL_COOKIE)?.value
  );

  const body = await req.json();
  const { messages } = body as {
    messages: ChatMessage[];
  };

  if (!messages || messages.length === 0) {
    return NextResponse.json(
      { error: 'messages is required' },
      { status: 400 }
    );
  }

  const lastMessage = messages[messages.length - 1];
  let augmentedContent = lastMessage.content;

  // Non-technical recruiter chip questions get a deterministic, corpus-grounded
  // answer injected into context so the assistant never hallucinates a response
  // to concern-type questions (e.g. "Will he fit our team?").
  const chipAnswer = findRecruiterChipAnswer(lastMessage.content);

  const retrievalQuery = buildReferralRetrievalQuery(
    lastMessage.content,
    referral
  );
  const relevantKnowledge = retrieveKnowledge(
    retrievalQuery,
    portfolioKnowledgeBase,
    4,
    { pinnedTitles: referral?.featuredProjects }
  );
  const evidenceItems = toEvidenceItems(relevantKnowledge);

  if (chipAnswer) {
    augmentedContent = `Verified answer (use this as the basis for your response):\n${chipAnswer}\n\nUser question: ${lastMessage.content}`;
  } else if (relevantKnowledge.length > 0) {
    augmentedContent = `Context from David's reviewed portfolio knowledge base:\n${formatKnowledgeContext(relevantKnowledge)}\n\nUser question: ${lastMessage.content}`;
  }

  const model = getPortfolioModel();

  const result = streamText({
    model,
    system: referral
      ? `${SYSTEM_PROMPT}\n\n${buildReferralChatContext(referral)}`
      : SYSTEM_PROMPT,
    messages: [
      ...messages.slice(0, -1),
      { role: 'user', content: augmentedContent }
    ]
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: 'evidence', items: evidenceItems })}\n\n`
        )
      );
      for await (const content of result.textStream) {
        if (content) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'delta', content })}\n\n`
            )
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
