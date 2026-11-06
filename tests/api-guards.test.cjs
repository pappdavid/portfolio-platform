const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

// Execute the real TypeScript modules with explicit in-process service doubles.
// No provider, Redis, Clerk, or database network calls are made.
function load(file, mocks) {
  const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    }
  }).outputText;
  const module = { exports: {} };
  const localRequire = (id) =>
    Object.hasOwn(mocks, id) ? mocks[id] : require(id);
  new Function('require', 'module', 'exports', compiled)(
    localRequire,
    module,
    module.exports
  );
  return module.exports;
}

function setup(mode, authenticated = false) {
  let calls = 0;
  class FakeRateLimit {
    static slidingWindow() {
      return {};
    }
    async limit() {
      if (mode === 'throws') throw new Error('Redis unavailable');
      if (mode === 'timeout')
        return { success: true, limit: 0, remaining: 0, reason: 'timeout' };
      if (mode === 'denied') return { success: false, limit: 2, remaining: 0 };
      return { success: true, limit: 2, remaining: 1 };
    }
  }
  const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (mode === 'missing') {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  } else {
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.invalid';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test';
  }
  const limiters = load('src/lib/rate-limit.ts', {
    '@upstash/ratelimit': { Ratelimit: FakeRateLimit },
    '@upstash/redis': { Redis: class {} }
  });
  if (originalUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
  else process.env.UPSTASH_REDIS_REST_URL = originalUrl;
  if (originalToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN;
  else process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
  const common = {
    '@clerk/nextjs/server': {
      auth: async () => ({ userId: authenticated ? 'user' : null }),
      currentUser: async () => null
    },
    'next/server': {
      NextResponse: { json: (body, options) => Response.json(body, options) }
    },
    ai: {
      generateText: async () => {
        calls++;
        return { text: JSON.stringify({ answer: 'model', links: [] }) };
      },
      streamText: () => {
        calls++;
        return {
          textStream: (async function* () {
            yield 'model';
          })()
        };
      }
    },
    '@/lib/rate-limit': limiters,
    '@/lib/openrouter': { getPortfolioModel: () => 'mock-model' },
    '@/lib/ama/corpus': { amaCorpus: 'reviewed corpus' },
    '@/lib/ama/eligibility': {
      asksForWorkEligibility: () => false,
      workEligibilityAnswer: ''
    },
    '@/lib/chat/knowledge-base': {
      buildPortfolioKnowledgeBase: () => [],
      retrieveKnowledge: () => [],
      formatKnowledgeContext: () => '',
      toEvidenceItems: () => []
    },
    '@/lib/company': {
      getOrCreateCompanyForUser: async () => ({ companyId: 'company' })
    },
    '@/lib/referral-context': { getReferralPersonalization: async () => null },
    '@/lib/referral-personalization': {
      buildReferralChatContext: () => '',
      buildReferralRetrievalQuery: (q) => q
    },
    '@/lib/demo-quota': {
      checkAndConsumeQuota: async () => {},
      DemoExpiredError: class extends Error {},
      QuotaExhaustedError: class extends Error {}
    },
    '@/data/github-projects-rag.json': [],
    '@/lib/ama/answer': {
      answerPortfolioQuestion: () => ({
        answer: 'reviewed fallback',
        links: []
      }),
      portfolioAssistantLinks: []
    }
  };
  const oldSecret = process.env.CLERK_SECRET_KEY;
  if (authenticated) process.env.CLERK_SECRET_KEY = 'test';
  else delete process.env.CLERK_SECRET_KEY;
  return {
    limiters,
    common,
    calls: () => calls,
    restore: () => {
      if (oldSecret === undefined) delete process.env.CLERK_SECRET_KEY;
      else process.env.CLERK_SECRET_KEY = oldSecret;
    }
  };
}
function request(body) {
  return new Request('http://localhost/api', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
}

test('unavailable accounting prevents chat inference, including SDK timeout', async () => {
  for (const authenticated of [false, true])
    for (const mode of ['missing', 'throws', 'timeout']) {
      const env = setup(mode, authenticated);
      try {
        const route = load('src/app/api/chat/route.ts', env.common);
        const response = await route.POST(
          request({ messages: [{ role: 'user', content: 'hello' }] })
        );
        assert.equal(
          response.status,
          503,
          `${mode}, authenticated=${authenticated}`
        );
        assert.equal(env.calls(), 0);
      } finally {
        env.restore();
      }
    }
});

test('AMA rejects malformed and oversized questions without inference', async () => {
  for (const question of [null, 3, {}, [], '', '   ', 'x'.repeat(501)]) {
    const env = setup('allowed');
    try {
      const response = await load('src/app/api/ama/route.ts', env.common).POST(
        request({ question })
      );
      assert.equal(response.status, 400, JSON.stringify(question));
      assert.equal(env.calls(), 0);
    } finally {
      env.restore();
    }
  }
});

test('AMA returns deterministic fallback when accounting is unavailable', async () => {
  for (const authenticated of [false, true])
    for (const mode of ['missing', 'throws', 'timeout']) {
      const env = setup(mode, authenticated);
      try {
        const response = await load(
          'src/app/api/ama/route.ts',
          env.common
        ).POST(request({ question: 'Tell me about your skills' }));
        assert.equal(response.status, 200, mode);
        assert.equal((await response.json()).answer, 'reviewed fallback');
        assert.equal(env.calls(), 0);
      } finally {
        env.restore();
      }
    }
});

test('AMA accepts a question at the length limit', async () => {
  const env = setup('allowed');
  try {
    const response = await load('src/app/api/ama/route.ts', env.common).POST(
      request({ question: 'x'.repeat(500) })
    );
    assert.equal(response.status, 200);
    assert.equal(env.calls(), 1);
  } finally {
    env.restore();
  }
});

test('normal rate limits block or permit provider calls', async () => {
  for (const mode of ['denied', 'allowed'])
    for (const routeName of ['chat', 'ama']) {
      const env = setup(mode);
      try {
        const body =
          routeName === 'chat'
            ? { messages: [{ role: 'user', content: 'hello' }] }
            : { question: 'Tell me about your skills' };
        const response = await load(
          `src/app/api/${routeName}/route.ts`,
          env.common
        ).POST(request(body));
        assert.equal(
          response.status,
          mode === 'denied' ? 429 : 200,
          `${mode} ${routeName}`
        );
        assert.equal(env.calls(), mode === 'denied' ? 0 : 1);
      } finally {
        env.restore();
      }
    }
});

test('non-inference referral limiter retains its current fail-open policy', async () => {
  for (const mode of ['missing', 'throws', 'timeout']) {
    const env = setup(mode);
    try {
      assert.equal(
        (await env.limiters.refVisitRateLimit.limit('test')).success,
        true
      );
    } finally {
      env.restore();
    }
  }
});
