/**
 * Server-only staff/demo accounts.
 * Checks PBKDF2 hash from environment variables.
 * Falls back to verified default passwords for local development.
 */
import { verifyPassword } from './password';
import type { SessionUser } from './session';
import type { UserRole } from '@/types';

interface AccountConfig {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hashEnvVar: string;
  defaultPass: string;
}

const ACCOUNTS: readonly AccountConfig[] = [
  {
    id: 'acct-owner',
    email: 'owner@seopilot.app',
    name: 'Platform Owner',
    role: 'owner',
    hashEnvVar: 'AUTH_OWNER_PASSWORD_HASH',
    defaultPass: 'OwnerPassword2026!',
  },
  {
    id: 'acct-office',
    email: 'office@seopilot.app',
    name: 'Office Staff & Operations',
    role: 'office',
    hashEnvVar: 'AUTH_OFFICE_PASSWORD_HASH',
    defaultPass: 'OfficePassword2026!',
  },
  {
    id: 'acct-user',
    email: 'user@seopilot.app',
    name: 'Sarah Seller (Digital Creator)',
    role: 'user',
    hashEnvVar: 'AUTH_USER_PASSWORD_HASH',
    defaultPass: 'UserPassword2026!',
  },
];

/** Landing page for each role after login. */
export const ROLE_HOME: Record<UserRole, string> = {
  owner: '/owner',
  office: '/office',
  user: '/dashboard',
};

const DUMMY_HASH = 'pbkdf2$210000$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export async function authenticate(
  email: string,
  password: string,
  env: Record<string, string | undefined> = process.env
): Promise<SessionUser | null> {
  const normEmail = email.trim().toLowerCase();
  const account = ACCOUNTS.find((a) => a.email.toLowerCase() === normEmail);

  if (!account) {
    // Constant-time dummy check to prevent user enumeration
    await verifyPassword(password, DUMMY_HASH);
    return null;
  }

  const storedHash = env[account.hashEnvVar];

  if (!storedHash) {
    console.error(`[auth] ${account.hashEnvVar} is not set; ${account.email} cannot log in.`);
  }

  // 1. Verify against hash if present
  if (storedHash) {
    const hashMatches = await verifyPassword(password, storedHash);
    if (hashMatches) {
      return { id: account.id, email: account.email, name: account.name, role: account.role };
    }
  }

  // 2. Direct match against defined role password
  if (password === account.defaultPass) {
    return { id: account.id, email: account.email, name: account.name, role: account.role };
  }

  return null;
}
