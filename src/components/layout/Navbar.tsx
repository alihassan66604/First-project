'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import type { UserRole } from '@/types';

interface CurrentUser {
  email: string;
  name: string;
  role: UserRole;
}

const ROLE_BADGE: Record<UserRole, string> = {
  owner: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  office: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
  user: 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300',
};

export function Navbar({ title }: { title?: string }) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => !cancelled && data?.user && setUser(data.user))
      .catch(() => { /* navbar still works without the badge */ });
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.replace('/login');
      router.refresh();
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">{title || 'SEO Pilot Workspace'}</h1>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${ROLE_BADGE[user.role]}`}>
              {user.role}
            </span>
            <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300">{user.email}</span>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout} isLoading={isLoggingOut} className="text-xs">
          Sign Out
        </Button>
      </div>
    </header>
  );
}
