import { describe, it, expect } from 'vitest';
import { createRateLimiter } from '@/lib/auth/rate-limit';

describe('login rate limiter', () => {
  it('allows up to the limit, then blocks until the window resets', () => {
    const check = createRateLimiter(3, 60_000);
    const t = 1_000;
    expect(check('ip', t).allowed).toBe(true);
    expect(check('ip', t).allowed).toBe(true);
    expect(check('ip', t).allowed).toBe(true);

    const blocked = check('ip', t + 1_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBe(59);

    expect(check('ip', t + 60_000).allowed).toBe(true);
  });

  it('tracks each key separately', () => {
    const check = createRateLimiter(1, 60_000);
    expect(check('a', 0).allowed).toBe(true);
    expect(check('a', 0).allowed).toBe(false);
    expect(check('b', 0).allowed).toBe(true);
  });
});
