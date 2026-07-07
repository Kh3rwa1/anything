import { describe, expect, it, beforeEach } from 'vitest';
import { checkRateLimit, rateLimitByIP } from './rate-limit';

describe('checkRateLimit', () => {
  it('allows requests within the limit', () => {
    const key = `test-${Date.now()}-allow`;
    const config = { maxRequests: 3, windowSeconds: 60 };

    const r1 = checkRateLimit(key, config);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(key, config);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(key, config);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it('blocks requests exceeding the limit', () => {
    const key = `test-${Date.now()}-block`;
    const config = { maxRequests: 2, windowSeconds: 60 };

    checkRateLimit(key, config);
    checkRateLimit(key, config);

    const r3 = checkRateLimit(key, config);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
  });

  it('resets after the window expires', () => {
    const key = `test-${Date.now()}-expire`;
    const config = { maxRequests: 1, windowSeconds: 0 }; // 0 seconds = immediate expiry

    const r1 = checkRateLimit(key, config);
    expect(r1.allowed).toBe(true);

    // Window has expired (0 seconds), next request should be allowed
    const r2 = checkRateLimit(key, config);
    expect(r2.allowed).toBe(true);
  });
});

describe('rateLimitByIP', () => {
  it('returns null when within limits', () => {
    const req = new Request('http://test.com/api/auth/signin', {
      headers: { 'x-forwarded-for': `test-ip-${Date.now()}` },
    });
    const result = rateLimitByIP(req, { maxRequests: 5, windowSeconds: 60 });
    expect(result).toBeNull();
  });

  it('returns 429 when limit exceeded', () => {
    const ip = `blocked-ip-${Date.now()}`;
    const config = { maxRequests: 1, windowSeconds: 60 };

    const req1 = new Request('http://test.com/api/auth/signin', {
      headers: { 'x-forwarded-for': ip },
    });
    rateLimitByIP(req1, config);

    const req2 = new Request('http://test.com/api/auth/signin', {
      headers: { 'x-forwarded-for': ip },
    });
    const result = rateLimitByIP(req2, config);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(429);
  });
});
