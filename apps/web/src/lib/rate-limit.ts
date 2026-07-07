/**
 * Simple in-memory sliding-window rate limiter.
 * For production at scale, swap this for Redis or Upstash.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 5 * 60 * 1000);
  // Allow Node.js process to exit despite the timer
  if (typeof timer === 'object' && 'unref' in timer) {
    (timer as { unref: () => void }).unref();
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window. */
  maxRequests: number;
  /** Window duration in seconds. */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request from the given key is within rate limits.
 * Returns an object with `allowed`, `remaining`, and `resetAt`.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    const resetAt = now + config.windowSeconds * 1000;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Returns a 429 Response if the rate limit is exceeded.
 * Call at the start of auth API routes.
 *
 * @param request - The incoming request (uses IP or x-forwarded-for for keying)
 * @param config - Rate limit configuration
 * @returns null if allowed, Response if rate-limited
 */
export function rateLimitByIP(
  request: Request,
  config: RateLimitConfig = { maxRequests: 10, windowSeconds: 60 }
): Response | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const key = `rl:${ip}:${new URL(request.url).pathname}`;

  const result = checkRateLimit(key, config);
  if (!result.allowed) {
    return Response.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }
  return null;
}
