// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { createSessionToken, verifySessionToken, SESSION_TTL_SECONDS } from '@/lib/auth/session';
import { base64UrlEncode } from '@/lib/auth/password';

const SECRET = 'test-secret-that-is-at-least-32-characters-long';
const user = { id: 'acct-user', email: 'user@seopilot.app', name: 'User', role: 'user' as const };

describe('session tokens', () => {
  it('round-trips a valid session', async () => {
    const token = await createSessionToken(user, SECRET);
    expect(await verifySessionToken(token, SECRET)).toEqual(user);
  });

  it('rejects a token whose role was edited (privilege escalation attempt)', async () => {
    const token = await createSessionToken(user, SECRET);
    const [, signature] = token.split('.');
    const forgedBody = base64UrlEncode(
      new TextEncoder().encode(JSON.stringify({ ...user, role: 'owner', exp: 9999999999 }))
    );
    expect(await verifySessionToken(`${forgedBody}.${signature}`, SECRET)).toBeNull();
  });

  it('rejects a token signed with a different secret', async () => {
    const token = await createSessionToken(user, 'another-secret-that-is-also-32-chars-long!!');
    expect(await verifySessionToken(token, SECRET)).toBeNull();
  });

  it('rejects expired tokens', async () => {
    const issuedAt = 1_000_000;
    const token = await createSessionToken(user, SECRET, issuedAt);
    expect(await verifySessionToken(token, SECRET, issuedAt + SESSION_TTL_SECONDS - 1)).toEqual(user);
    expect(await verifySessionToken(token, SECRET, issuedAt + SESSION_TTL_SECONDS)).toBeNull();
  });

  it('rejects missing and garbage tokens', async () => {
    expect(await verifySessionToken(undefined, SECRET)).toBeNull();
    expect(await verifySessionToken('', SECRET)).toBeNull();
    expect(await verifySessionToken('not-a-token', SECRET)).toBeNull();
    expect(await verifySessionToken('a.b.c', SECRET)).toBeNull();
    expect(await verifySessionToken('{"role":"owner"}', SECRET)).toBeNull(); // old unsigned JSON cookie
  });

  it('throws a clear error when SESSION_SECRET is missing or too short', async () => {
    await expect(createSessionToken(user, '')).rejects.toThrow(/SESSION_SECRET/);
    await expect(createSessionToken(user, 'short')).rejects.toThrow(/SESSION_SECRET/);
    const token = await createSessionToken(user, SECRET);
    await expect(verifySessionToken(token, '')).rejects.toThrow(/SESSION_SECRET/);
  });
});
