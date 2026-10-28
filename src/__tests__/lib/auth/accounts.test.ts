// @vitest-environment node
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { authenticate } from '@/lib/auth/accounts';
import { hashPassword } from '@/lib/auth/password';

let env: Record<string, string>;

beforeAll(async () => {
  env = {
    AUTH_OWNER_PASSWORD_HASH: await hashPassword('owner-pass-123', 10000),
    AUTH_OFFICE_PASSWORD_HASH: await hashPassword('office-pass-123', 10000),
    AUTH_USER_PASSWORD_HASH: await hashPassword('user-pass-123', 10000),
  };
});

describe('authenticate', () => {
  it.each([
    ['owner@seopilot.app', 'owner-pass-123', 'owner'],
    ['office@seopilot.app', 'office-pass-123', 'office'],
    ['user@seopilot.app', 'user-pass-123', 'user'],
  ])('logs in %s with the right role', async (email, password, role) => {
    const user = await authenticate(email, password, env);
    expect(user?.role).toBe(role);
    expect(user?.email).toBe(email);
  });

  it('ignores email case and surrounding spaces', async () => {
    expect((await authenticate('  OWNER@SeoPilot.app ', 'owner-pass-123', env))?.role).toBe('owner');
  });

  it('rejects wrong passwords, including another role\'s password', async () => {
    expect(await authenticate('owner@seopilot.app', 'wrong', env)).toBeNull();
    expect(await authenticate('owner@seopilot.app', 'user-pass-123', env)).toBeNull();
  });

  it('rejects unknown emails', async () => {
    expect(await authenticate('hacker@example.com', 'owner-pass-123', env)).toBeNull();
  });

  it('blocks login and logs a developer error when the hash env var is missing', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await authenticate('owner@seopilot.app', 'owner-pass-123', {})).toBeNull();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('AUTH_OWNER_PASSWORD_HASH'));
    spy.mockRestore();
  });
});
