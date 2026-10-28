import { describe, it, expect } from 'vitest';
import { decideAccess } from '@/lib/auth/access';

const PROTECTED_PAGES = [
  '/dashboard', '/keywords/research', '/keywords/clusters', '/tools/etsy', '/tools/blog',
  '/tools/seo-checker', '/tools/product-ideas', '/projects', '/assistant', '/export',
  '/settings', '/mail', '/owner', '/office',
];

describe('route access rules', () => {
  describe('logged out', () => {
    it('can open only /login and /signup', () => {
      expect(decideAccess('/login', null)).toEqual({ action: 'allow' });
      expect(decideAccess('/signup', null)).toEqual({ action: 'allow' });
    });

    it.each(['/', ...PROTECTED_PAGES])('is redirected to /login from %s', (path) => {
      expect(decideAccess(path, null)).toEqual({ action: 'redirect', location: '/login' });
    });

    it('gets 401 (not a redirect) from protected APIs', () => {
      expect(decideAccess('/api/auth/me', null)).toEqual({ action: 'unauthorized' });
      expect(decideAccess('/api/projects', null)).toEqual({ action: 'unauthorized' });
    });

    it('can call the login and logout APIs', () => {
      expect(decideAccess('/api/auth/login', null)).toEqual({ action: 'allow' });
      expect(decideAccess('/api/auth/logout', null)).toEqual({ action: 'allow' });
    });
  });

  describe('logged in', () => {
    it.each([
      ['owner', '/owner'],
      ['office', '/office'],
      ['user', '/dashboard'],
    ] as const)('%s is sent to their home from /, /login and /signup', (role, home) => {
      for (const path of ['/', '/login', '/signup']) {
        expect(decideAccess(path, role)).toEqual({ action: 'redirect', location: home });
      }
    });

    it('owner can open every area including /owner and /mail', () => {
      for (const path of PROTECTED_PAGES) expect(decideAccess(path, 'owner')).toEqual({ action: 'allow' });
    });

    it('office can open /office but not /owner or /mail', () => {
      expect(decideAccess('/office', 'office')).toEqual({ action: 'allow' });
      expect(decideAccess('/owner', 'office')).toEqual({ action: 'redirect', location: '/office' });
      expect(decideAccess('/mail', 'office')).toEqual({ action: 'redirect', location: '/office' });
    });

    it('user cannot open /owner, /office, or /mail', () => {
      expect(decideAccess('/owner', 'user')).toEqual({ action: 'redirect', location: '/dashboard' });
      expect(decideAccess('/office', 'user')).toEqual({ action: 'redirect', location: '/dashboard' });
      expect(decideAccess('/mail', 'user')).toEqual({ action: 'redirect', location: '/dashboard' });
    });

    it('user can open creator tools', () => {
      for (const path of ['/dashboard', '/keywords/research', '/tools/etsy', '/settings']) {
        expect(decideAccess(path, 'user')).toEqual({ action: 'allow' });
      }
    });
  });
});
