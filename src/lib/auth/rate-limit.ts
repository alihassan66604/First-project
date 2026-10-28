/**
 * Minimal fixed-window rate limiter for login attempts.
 * In-memory: fine for a single server process; use a shared store (e.g. Redis/Upstash)
 * if you run multiple instances.
 */
interface Window {
  count: number;
  resetAt: number;
}

export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, Window>();

  return function check(key: string, now: number = Date.now()): { allowed: boolean; retryAfterSec: number } {
    // Drop stale entries occasionally so the map can't grow forever.
    if (hits.size > 10000) {
      hits.forEach((w, k) => w.resetAt <= now && hits.delete(k));
    }

    const current = hits.get(key);
    if (!current || current.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSec: 0 };
    }

    current.count += 1;
    if (current.count > limit) {
      return { allowed: false, retryAfterSec: Math.ceil((current.resetAt - now) / 1000) };
    }
    return { allowed: true, retryAfterSec: 0 };
  };
}
