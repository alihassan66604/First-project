'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@/components/ui';

interface ListingReviewItem {
  id: string;
  clientName: string;
  shopNiche: string;
  title: string;
  tagCount: number;
  status: 'pending' | 'approved' | 'changes_requested';
  submittedAt: string;
}

interface SupportTicket {
  id: string;
  clientName: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  timeAgo: string;
}

export default function OfficeDashboardPage() {
  const [reviews, setReviews] = useState<ListingReviewItem[]>([
    {
      id: 'rev-101',
      clientName: 'Sarah Craft Shop',
      shopNiche: 'Digital Wedding Stationery',
      title: 'Minimalist Wedding Invitation Template | Editable Canva Printable Card',
      tagCount: 13,
      status: 'pending',
      submittedAt: 'Today, 2:15 PM'
    },
    {
      id: 'rev-102',
      clientName: 'PlannerPro Studio',
      shopNiche: 'Digital Planners',
      title: 'All-in-One Daily Planner 2026 | GoodNotes iPad Routine Schedule',
      tagCount: 13,
      status: 'pending',
      submittedAt: 'Today, 11:30 AM'
    },
    {
      id: 'rev-103',
      clientName: 'WallArtPrintables',
      shopNiche: 'Botanical Line Art',
      title: 'Set of 3 Botanical Wall Art Prints | Modern Minimalist Gallery Decor',
      tagCount: 12,
      status: 'changes_requested',
      submittedAt: 'Yesterday'
    },
  ]);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: 'tkt-1', clientName: 'Jessica Bloom', subject: 'Need help clustering 85 wedding stationery keywords', priority: 'high', status: 'open', timeAgo: '15m ago' },
    { id: 'tkt-2', clientName: 'Mark Thompson', subject: 'How do I paste the 13 Etsy tags into Shop Manager?', priority: 'medium', status: 'in_progress', timeAgo: '1h ago' },
    { id: 'tkt-3', clientName: 'Elena Rostova', subject: 'Requesting custom product ideas for knitting niche', priority: 'low', status: 'open', timeAgo: '3h ago' },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const handleApproveListing = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    setNotification('Listing review marked as Approved & client notified.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRequestChanges = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'changes_requested' } : r));
    setNotification('Feedback and change request sent to client.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResolveTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved' } : t));
    setNotification('Support ticket marked as Resolved.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Office &amp; Operations Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold border border-indigo-300/40">
              Staff Portal
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Client Etsy listing approvals, keyword queue reviews, customer tickets, and team collaboration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Queue: {reviews.filter(r => r.status === 'pending').length} Pending
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 text-xs font-semibold text-brand-800 dark:text-brand-300 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {notification}
        </div>
      )}

      {/* Operations Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Reviews</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {reviews.filter(r => r.status === 'pending').length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Etsy listing drafts awaiting review</p>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Open Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {tickets.filter(t => t.status !== 'resolved').length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Customer support inquiries</p>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Approved Today</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">18</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">SEO quality audits passed</p>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Turnaround</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">24m</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Response time across team</p>
        </Card>
      </div>

      {/* Listing Review Queue */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Etsy Listing Quality Review Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify client titles, 13 tags compliance, and character limits before publication.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-3.5">Client &amp; Niche</th>
                <th className="p-3.5">Generated Title Draft</th>
                <th className="p-3.5">Tags</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reviews.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {item.clientName}
                    </div>
                    <div className="text-xs text-slate-400">{item.shopNiche}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.submittedAt}</div>
                  </td>
                  <td className="p-3.5 max-w-sm">
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-snug">
                      {item.title}
                    </p>
                  </td>
                  <td className="p-3.5">
                    <Badge variant={item.tagCount === 13 ? 'success' : 'warning'}>
                      {item.tagCount} / 13 Tags
                    </Badge>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      item.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      item.status === 'changes_requested' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    {item.status === 'pending' ? (
                      <>
                        <Button size="sm" variant="primary" onClick={() => handleApproveListing(item.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRequestChanges(item.id)}>
                          Feedback
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 italic">
                        Action logged
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Support Tickets Queue */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Customer SEO Inquiries &amp; Tickets
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct assistance for Etsy creators on keywords, tags, and content outlines.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {tickets.map((t) => (
            <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    t.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                    t.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {t.priority} priority
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {t.clientName}
                  </h4>
                  <span className="text-[11px] text-slate-400">• {t.timeAgo}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t.subject}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Badge variant={t.status === 'resolved' ? 'success' : 'purple'}>
                  {t.status.replace('_', ' ')}
                </Badge>
                {t.status !== 'resolved' && (
                  <Button size="sm" variant="outline" onClick={() => handleResolveTicket(t.id)}>
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
