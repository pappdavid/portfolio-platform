import { createHmac } from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const hasRedis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasRedis
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!
    })
  : null;

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  unavailable?: boolean;
};

function createLimiter(
  window: Parameters<typeof Ratelimit.slidingWindow>[0],
  duration: Parameters<typeof Ratelimit.slidingWindow>[1],
  prefix: string,
  failClosed = false
) {
  const unavailable = (): RateLimitResult => ({
    success: !failClosed,
    limit: 0,
    remaining: 0,
    unavailable: failClosed
  });
  if (!redis) return { limit: async () => unavailable() };
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(window, duration),
    analytics: false,
    prefix
  });
  return {
    limit: async (identifier: string): Promise<RateLimitResult> => {
      try {
        const key = createHmac(
          'sha256',
          process.env.MCP_HMAC_SECRET ||
            process.env.UPSTASH_REDIS_REST_TOKEN ||
            'local-only'
        )
          .update(`${new Date().toISOString().slice(0, 10)}:${identifier}`)
          .digest('hex');
        const result = await limiter.limit(key);
        // Upstash's default timeout resolves successfully rather than throwing.
        if (failClosed && result.reason === 'timeout') return unavailable();
        return result;
      } catch {
        return unavailable();
      }
    }
  };
}

export const chatPublicRateLimit = createLimiter(
  2,
  '1 h',
  'ratelimit:chat:public',
  true
);
export const chatAuthRateLimit = createLimiter(
  50,
  '1 h',
  'ratelimit:chat:auth',
  true
);
export const mcpRateLimit = createLimiter(100, '1 m', 'ratelimit:mcp');
export const trainingRateLimit = createLimiter(5, '1 h', 'ratelimit:training');
export const amaPublicRateLimit = createLimiter(
  5,
  '1 h',
  'ratelimit:ama:public',
  true
);
export const amaAuthRateLimit = createLimiter(
  20,
  '1 h',
  'ratelimit:ama:auth',
  true
);
export const refMintRateLimit = createLimiter(10, '1 h', 'ratelimit:ref:mint');
export const refVisitRateLimit = createLimiter(
  30,
  '1 m',
  'ratelimit:ref:visit'
);
