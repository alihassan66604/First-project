'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, Button, Input } from '@/components/ui';

export default function DashboardPage() {
  const router = useRouter();
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      router.push(`/keywords/research?q=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Quick Search Hero */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-brand-500/10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-brand-100 mb-3 border border-white/10">
            ⚡ 100% Free SEO Toolkit
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Boost Your Search Visibility & Listings
          </h1>
          <p className="mt-2 text-brand-100 text-sm sm:text-base leading-relaxed">
            Find high-intent long-tail keywords, organize clusters, and craft optimized Etsy listings and blog outlines with zero paid API keys.
          </p>

          <form onSubmit={handleQuickSearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-lg">
            <input
              type="text"
              placeholder="Enter seed keyword (e.g. digital planner)..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 shadow-sm"
            />
            <Button type="submit" variant="secondary" className="font-semibold text-brand-700 shadow-md">
              Research
            </Button>
          </form>
        </div>
      </div>

      {/* Quick Launchpad Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Core Optimization Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/keywords/research" className="group">
            <Card hover className="h-full border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <CardTitle className="text-base group-hover:text-brand-600 transition-colors">Keyword Research</CardTitle>
              <CardDescription className="text-xs mt-1">
                Expand seed terms into dozens of high-relevance long-tail keyword ideas locally.
              </CardDescription>
            </Card>
          </Link>

          <Link href="/keywords/clusters" className="group">
            <Card hover className="h-full border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <CardTitle className="text-base group-hover:text-brand-600 transition-colors">Keyword Clusters</CardTitle>
              <CardDescription className="text-xs mt-1">
                Group semantic search terms with token similarity algorithms for targeted content hubs.
              </CardDescription>
            </Card>
          </Link>

          <Link href="/tools/etsy" className="group">
            <Card hover className="h-full border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <CardTitle className="text-base group-hover:text-brand-600 transition-colors">Etsy SEO Toolkit</CardTitle>
              <CardDescription className="text-xs mt-1">
                Draft titles within 140 chars and generate all 13 high-converting product tags.
              </CardDescription>
            </Card>
          </Link>

          <Link href="/tools/seo-checker" className="group">
            <Card hover className="h-full border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle className="text-base group-hover:text-brand-600 transition-colors">SEO Content Checker</CardTitle>
              <CardDescription className="text-xs mt-1">
                Audit copy for keyword density, early placement, length, and headings score.
              </CardDescription>
            </Card>
          </Link>
        </div>
      </div>

      {/* Secondary Tools and Assistant Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>SEO Pilot Feature Highlights</CardTitle>
            <CardDescription>
              Designed for digital creators, Etsy shop owners, and indie bloggers.
            </CardDescription>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Zero Fabricated Data</h4>
                <p className="text-xs text-slate-500 mt-0.5">No fake search volume estimates; 100% genuine algorithmic results.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Rule-Based Assistant</h4>
                <p className="text-xs text-slate-500 mt-0.5">Automate keyword generation, clustering, and drafts with quick slash commands.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">RFC 4180 CSV Export</h4>
                <p className="text-xs text-slate-500 mt-0.5">Export your research and clusters directly to spreadsheets anytime.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Database Row Level Security</h4>
                <p className="text-xs text-slate-500 mt-0.5">Your private projects and keywords are protected at the database tier.</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40">
          <CardHeader>
            <CardTitle className="text-brand-900 dark:text-brand-100">Need inspiration?</CardTitle>
            <CardDescription>
              Brainstorm top-selling digital download product ideas for any niche.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Generate 8 categorized digital product ideas including planners, checklists, Canva templates, and printable art.
            </p>
            <Link href="/tools/product-ideas">
              <Button fullWidth size="sm" variant="primary">
                Open Product Idea Generator →
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
