import { type ReactNode } from 'react';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-50 via-slate-50 to-brand-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-brand-950/40">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/login" className="inline-flex items-center gap-2 mb-2 group">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:bg-brand-700 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-brand-700 to-indigo-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
            {APP_NAME}
          </span>
        </Link>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Free SEO Research & Optimization Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl shadow-brand-950/5 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
