/**
 * Pure route-access rules (no Next.js imports) so they are easy to unit test.
 * Only /login and /signup are public. Everything else needs a valid session.
 * 
 * Strict Area Restrictions:
 * - /owner -> ONLY 'owner'
 * - /mail  -> ONLY 'owner'
 * - /office -> 'owner' and 'office'
 * - /dashboard & tools -> all authenticated roles
 */
import type { UserRole } from '@/types';

export type AccessDecision =
  | { action: 'allow' }
  | { action: 'redirect'; location: string }
  | { action: 'unauthorized' };

const PUBLIC_PAGES = ['/login', '/signup'];
const PUBLIC_APIS = ['/api/auth/login', '/api/auth/logout'];

const ROLE_HOME: Record<UserRole, string> = { owner: '/owner', office: '/office', user: '/dashboard' };

/** Which roles may open each restricted area. */
const AREA_ROLES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: '/owner', roles: ['owner'] },
  { prefix: '/mail', roles: ['owner'] }, // Gmail / Mailbox is strictly restricted to Owner
  { prefix: '/office', roles: ['owner', 'office'] },
];

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function decideAccess(pathname: string, role: UserRole | null): AccessDecision {
  const isApi = pathname.startsWith('/api/');

  if (PUBLIC_APIS.includes(pathname)) return { action: 'allow' };

  if (!role) {
    if (isApi) return { action: 'unauthorized' };
    if (PUBLIC_PAGES.includes(pathname)) return { action: 'allow' };
    return { action: 'redirect', location: '/login' };
  }

  // Logged-in users have no reason to see login/signup or the bare root.
  if (pathname === '/' || PUBLIC_PAGES.includes(pathname)) {
    return { action: 'redirect', location: ROLE_HOME[role] };
  }

  const area = AREA_ROLES.find((a) => matchesPrefix(pathname, a.prefix));
  if (area && !area.roles.includes(role)) {
    return isApi ? { action: 'unauthorized' } : { action: 'redirect', location: ROLE_HOME[role] };
  }

  return { action: 'allow' };
}
