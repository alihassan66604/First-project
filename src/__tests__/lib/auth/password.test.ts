// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

describe('password hashing', () => {
  it('verifies the correct password and rejects a wrong one', async () => {
    const hash = await hashPassword('correct horse battery', 10000);
    expect(hash.startsWith('pbkdf2$10000$')).toBe(true);
    expect(await verifyPassword('correct horse battery', hash)).toBe(true);
    expect(await verifyPassword('correct horse batterY', hash)).toBe(false);
  });

  it('salts every hash so equal passwords produce different hashes', async () => {
    expect(await hashPassword('same-password', 10000)).not.toBe(await hashPassword('same-password', 10000));
  });

  it('fails closed on malformed or weak hashes', async () => {
    expect(await verifyPassword('x', '')).toBe(false);
    expect(await verifyPassword('x', 'plaintext')).toBe(false);
    expect(await verifyPassword('x', 'pbkdf2$abc$salt$hash')).toBe(false);
    expect(await verifyPassword('x', 'pbkdf2$100$AAAA$AAAA')).toBe(false); // too few iterations
    expect(await verifyPassword('x', 'md5$1$a$b')).toBe(false);
  });
});
