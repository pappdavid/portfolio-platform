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

type RateLimitResult = { success: boolean; limit: number; remaining: number };

const passthrough = {
  limit: async (): Promise<RateLimitResult> => ({
    success: true,
    limit: 0,
    remaining: 0
  })
};

function createLimiter(
  window: Parameters<typeof Ratelimit.slidingWindow>[0],
  duration: Parameters<typeof Ratelimit.slidingWindow>[1],
  prefix: string
) {
  if (!redis) return passthrough;
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(window, duration),
    analytics: true,
    prefix
  });
  return {
    limit: async (identifier: string): Promise<RateLimitResult> => {
      try {
        return await limiter.limit(identifier);
      } catch {
        // Redis unreachable — degrade gracefully, allow request through
        return { success: true, limit: 0, remaining: 0 };
      }
    }
  };
}

export const chatPublicRateLimit = createLimiter(
  2,
  '1 h',
  'ratelimit:chat:public'
);
export const chatAuthRateLimit = createLimiter(
  50,
  '1 h',
  'ratelimit:chat:auth'
);
export const mcpRateLimit = createLimiter(100, '1 m', 'ratelimit:mcp');
export const trainingRateLimit = createLimiter(5, '1 h', 'ratelimit:training');
export const amaPublicRateLimit = createLimiter(
  5,
  '1 h',
  'ratelimit:ama:public'
);
export const amaAuthRateLimit = createLimiter(20, '1 h', 'ratelimit:ama:auth');
