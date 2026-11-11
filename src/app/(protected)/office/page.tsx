'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, Input } from '@/components/ui';

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

interface StaffTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'todo' | 'in_progress' | 'done';
}

const TRADEMARK_BLACKLIST = ['disney', 'nike', 'velcro', 'tiffany', 'chanel', 'gucci', 'lego', 'barbie', 'cricut', 'iphone', 'apple'];

export default function OfficeDashboardPage() {
  const [activeTab, setActiveTab] = useState<'queue' | 'compliance' | 'tickets' | 'tasks' | 'health' | 'shift'>('queue');

  // 1. Listing Reviews Queue
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

  // 2. Interactive Compliance QA Tester
  const [testTitle, setTestTitle] = useState('Digital Wedding Planner Template | Editable GoodNotes iPad Routine Tracker Printable');
  const [testTagsInput, setTestTagsInput] = useState('wedding planner, digital planner, goodnotes planner, bridal shower gift, daily schedule, budget template, printable planner, habit tracker, routine log, wedding organizer, guest list tracker, seating chart, instant download');

  // 3. Support Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: 'tkt-1', clientName: 'Jessica Bloom', subject: 'Need help clustering 85 wedding stationery keywords', priority: 'high', status: 'open', timeAgo: '15m ago' },
    { id: 'tkt-2', clientName: 'Mark Thompson', subject: 'How do I paste the 13 Etsy tags into Shop Manager?', priority: 'medium', status: 'in_progress', timeAgo: '1h ago' },
    { id: 'tkt-3', clientName: 'Elena Rostova', subject: 'Digital download link expired for Baby Shower invitation pack', priority: 'high', status: 'open', timeAgo: '2h ago' },
    { id: 'tkt-4', clientName: 'David Lee', subject: 'Requesting custom product ideas for yoga fitness niche', priority: 'low', status: 'open', timeAgo: '3h ago' },
  ]);

  // 4. Daily Staff Kanban Tasks
  const [staffTasks, setStaffTasks] = useState<StaffTask[]>([
    { id: 'st-1', title: 'Audit 15 new listings for tag compliance (13 tags rule)', priority: 'high', dueDate: 'Today, 5:00 PM', status: 'in_progress' },
    { id: 'st-2', title: 'Verify high-res download links for PlannerPro Studio', priority: 'medium', dueDate: 'Today, 6:00 PM', status: 'todo' },
    { id: 'st-3', title: 'Check missing keyword coverage for Wedding Stationery', priority: 'high', dueDate: 'Tomorrow, 12:00 PM', status: 'todo' },
    { id: 'st-4', title: 'Respond to Elena Rostova expired link inquiry', priority: 'high', dueDate: 'Immediate', status: 'done' },
  ]);

  // 5. Shift Log
  const [reviewedCount, setReviewedCount] = useState(18);
  const [shiftNotes, setShiftNotes] = useState('All pending morning tickets resolved. 3 client listings cleared for launch.');
  const [notification, setNotification] = useState<string | null>(null);

  const handleApproveListing = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    setReviewedCount(prev => prev + 1);
    setNotification('Listing marked Approved & QA verified.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRequestChanges = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'changes_requested' } : r));
    setNotification('Feedback and change request sent to client.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResolveTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved' } : t));
    setNotification('Support ticket resolved.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Compliance calculations
  const parsedTags = testTagsInput.split(/[,]+/).map(t => t.trim()).filter(Boolean);
  const titleCharCount = testTitle.length;
  const isTitleLengthValid = titleCharCount > 0 && titleCharCount <= 140;
  const isTagCountValid = parsedTags.length === 13;
  const tagsOverLimit = parsedTags.filter(t => t.length > 20);
  const trademarkViolations = [testTitle, ...parsedTags]
    .flatMap(text => TRADEMARK_BLACKLIST.filter(tm => text.toLowerCase().includes(tm)));

  const isFullyCompliant = isTitleLengthValid && isTagCountValid && tagsOverLimit.length === 0 && trademarkViolations.length === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Office Operations &amp; Staff Suite
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold border border-indigo-300/40">
              Staff Portal
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Etsy listing review queue, compliance QA checker, customer ticket desk, daily workflow tasks, and shop health monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Queue: {reviews.filter(r => r.status === 'pending').length} Pending Reviews
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {notification}
        </div>
      )}

      {/* Feature Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'queue', label: 'Listing Review Queue', icon: '📥' },
          { id: 'compliance', label: 'Compliance QA Engine', icon: '✅' },
          { id: 'tickets', label: 'Customer Ticket Desk', icon: '💬' },
          { id: 'tasks', label: 'Staff Task Kanban', icon: '📋' },
          { id: 'health', label: 'Shop Health Watchdog', icon: '🔍' },
          { id: 'shift', label: 'Shift & Productivity Log', icon: '⏱️' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: REVIEW QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <span className="text-xs font-semibold text-slate-500">Pending Reviews</span>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">
                {reviews.filter(r => r.status === 'pending').length}
              </div>
            </Card>
            <Card>
              <span className="text-xs font-semibold text-slate-500">Approved Today</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">{reviewedCount}</div>
            </Card>
            <Card>
              <span className="text-xs font-semibold text-slate-500">Open Tickets</span>
              <div className="text-3xl font-extrabold text-blue-600 mt-1">
                {tickets.filter(t => t.status !== 'resolved').length}
              </div>
            </Card>
            <Card>
              <span className="text-xs font-semibold text-slate-500">Approval Rate</span>
              <div className="text-3xl font-extrabold text-indigo-600 mt-1">94.8%</div>
            </Card>
          </div>

          <Card padding="none" className="overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Awaiting Operations Approval
              </span>
              <Badge variant="purple">{reviews.length} Total in Queue</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="p-3.5">Client &amp; Niche</th>
                    <th className="p-3.5">Title Draft</th>
                    <th className="p-3.5">Tags</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {reviews.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{r.clientName}</div>
                        <div className="text-slate-400 text-[11px]">{r.shopNiche} &bull; {r.submittedAt}</div>
                      </td>
                      <td className="p-3.5 max-w-xs font-mono text-slate-800 dark:text-slate-200">
                        {r.title}
                      </td>
                      <td className="p-3.5">
                        <Badge variant={r.tagCount === 13 ? 'success' : 'warning'}>
                          {r.tagCount} / 13 Tags
                        </Badge>
                      </td>
                      <td className="p-3.5">
                        <Badge variant={r.status === 'approved' ? 'success' : r.status === 'pending' ? 'warning' : 'error'}>
                          {r.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {r.status === 'pending' ? (
                          <>
                            <Button size="sm" variant="primary" onClick={() => handleApproveListing(r.id)}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRequestChanges(r.id)}>
                              Changes
                            </Button>
                          </>
                        ) : (
                          <span className="text-slate-400 italic">Logged</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: COMPLIANCE QA ENGINE */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Etsy Listing QA &amp; Compliance Checker</span>
                {isFullyCompliant ? (
                  <Badge variant="success">100% Compliant &bull; Ready to Publish</Badge>
                ) : (
                  <Badge variant="error">Non-Compliant &bull; Issues Detected</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Audits titles (140-char limit), verifies exactly 13 tags (&le; 20 chars each), and screens for trademark violations.
              </CardDescription>
            </CardHeader>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Listing Title</span>
                  <span className={titleCharCount <= 140 ? 'text-emerald-600' : 'text-red-600 font-bold'}>
                    {titleCharCount} / 140 characters {titleCharCount > 140 ? '(EXCEEDED)' : ''}
                  </span>
                </div>
                <Input
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Listing Tags (Comma-Separated)</span>
                  <span className={parsedTags.length === 13 ? 'text-emerald-600' : 'text-amber-600 font-bold'}>
                    {parsedTags.length} / 13 Tags {parsedTags.length !== 13 ? '(Must be exactly 13)' : ''}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={testTagsInput}
                  onChange={(e) => setTestTagsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Compliance Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className={`p-3 rounded-xl border ${isTitleLengthValid ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  <span className="font-bold block">1. Title Length (Max 140)</span>
                  <span>{isTitleLengthValid ? '✓ Within character limit' : '✗ Title exceeds 140 chars'}</span>
                </div>

                <div className={`p-3 rounded-xl border ${isTagCountValid ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                  <span className="font-bold block">2. Exactly 13 Tags</span>
                  <span>{isTagCountValid ? '✓ Exactly 13 tags filled' : `✗ Currently ${parsedTags.length} tags`}</span>
                </div>

                <div className={`p-3 rounded-xl border ${tagsOverLimit.length === 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  <span className="font-bold block">3. Tag Length (Max 20 chars)</span>
                  <span>{tagsOverLimit.length === 0 ? '✓ All tags under 20 chars' : `✗ ${tagsOverLimit.length} tag(s) over 20 chars`}</span>
                </div>

                <div className={`p-3 rounded-xl border ${trademarkViolations.length === 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  <span className="font-bold block">4. Trademark Scanner</span>
                  <span>{trademarkViolations.length === 0 ? '✓ No blacklisted terms' : `✗ Flagged: ${trademarkViolations.join(', ')}`}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: CUSTOMER TICKETS */}
      {activeTab === 'tickets' && (
        <Card padding="none" className="overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Client Support Tickets Desk</span>
            <Badge variant="purple">{tickets.filter(t => t.status !== 'resolved').length} Open</Badge>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      t.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.priority}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.clientName}</h4>
                    <span className="text-slate-400 text-[11px]">&bull; {t.timeAgo}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t.subject}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={t.status === 'resolved' ? 'success' : 'warning'}>
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
      )}

      {/* TAB 4: STAFF TASK KANBAN */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* To Do Column */}
            <Card className="bg-slate-50/60 dark:bg-slate-900/40">
              <div className="flex items-center justify-between font-bold text-xs pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                <span className="text-slate-700 dark:text-slate-300">To Do</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px]">
                  {staffTasks.filter(t => t.status === 'todo').length}
                </span>
              </div>
              <div className="space-y-2.5">
                {staffTasks.filter(t => t.status === 'todo').map((task) => (
                  <div key={task.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs shadow-sm">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Due: {task.dueDate}</span>
                      <button
                        onClick={() => setStaffTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'in_progress' } : t))}
                        className="text-brand-600 font-bold hover:underline"
                      >
                        Start →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* In Progress Column */}
            <Card className="bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <div className="flex items-center justify-between font-bold text-xs pb-3 border-b border-blue-200 dark:border-blue-800 mb-3">
                <span className="text-blue-900 dark:text-blue-300">In Progress</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-[10px]">
                  {staffTasks.filter(t => t.status === 'in_progress').length}
                </span>
              </div>
              <div className="space-y-2.5">
                {staffTasks.filter(t => t.status === 'in_progress').map((task) => (
                  <div key={task.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 space-y-2 text-xs shadow-sm">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Due: {task.dueDate}</span>
                      <button
                        onClick={() => setStaffTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'done' } : t))}
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        Complete ✓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Done Column */}
            <Card className="bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center justify-between font-bold text-xs pb-3 border-b border-emerald-200 dark:border-emerald-800 mb-3">
                <span className="text-emerald-900 dark:text-emerald-300">Done</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-[10px]">
                  {staffTasks.filter(t => t.status === 'done').length}
                </span>
              </div>
              <div className="space-y-2.5">
                {staffTasks.filter(t => t.status === 'done').map((task) => (
                  <div key={task.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 space-y-1 text-xs opacity-75">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 line-through">{task.title}</p>
                    <span className="text-[10px] text-emerald-600 font-bold block">✓ Verified &amp; Closed</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 5: SHOP HEALTH WATCHDOG */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shop Health &amp; Broken Link Monitor</CardTitle>
              <CardDescription>Automated diagnostic surveillance for digital download links and tag expiration.</CardDescription>
            </CardHeader>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block">Digital Asset Delivery CDNs</span>
                  <span className="text-emerald-700 dark:text-emerald-400 text-[11px]">All GoodNotes and PDF download links responding with HTTP 200 OK</span>
                </div>
                <Badge variant="success">Healthy</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <div>
                  <span className="font-bold text-amber-900 dark:text-amber-200 block">WallArtPrintables Studio</span>
                  <span className="text-amber-700 dark:text-amber-400 text-[11px]">Listing #rev-103 only has 12 tags. 1 tag slot empty.</span>
                </div>
                <Badge variant="warning">Attention Needed</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block">Tag Renewal Tracker</span>
                  <span className="text-emerald-700 dark:text-emerald-400 text-[11px]">0 tags approaching Etsy 4-month auto-expire window</span>
                </div>
                <Badge variant="success">Up to Date</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 6: SHIFT & PRODUCTIVITY */}
      {activeTab === 'shift' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shift Activity &amp; Handover Notes</CardTitle>
            <CardDescription>Log daily output and leave operational handover notes for the next shift.</CardDescription>
          </CardHeader>
          <div className="space-y-4 pt-2 max-w-lg text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Total Listings Cleared Today</span>
              <span className="font-bold font-mono text-brand-600 text-sm">{reviewedCount}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Shift Handover Log &bull; Office Staff Notes
              </label>
              <textarea
                rows={4}
                value={shiftNotes}
                onChange={(e) => setShiftNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <Button
              variant="primary"
              onClick={() => {
                setNotification('Shift log updated and synced to Owner executive panel.');
                setTimeout(() => setNotification(null), 3000);
              }}
            >
              Save Shift Handover
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
