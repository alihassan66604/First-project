'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Card, Badge } from '@/components/ui';
import type { EmailMessage } from '@/types';

export default function MailboxPage() {
  const [messages, setMessages] = useState<EmailMessage[]>([
    {
      id: 'msg-1',
      from: 'alerts@etsy.com',
      fromName: 'Etsy Seller Insights',
      to: 'creator@seopilot.app',
      subject: '🔥 Search Trend Alert: "Daily Planner 2026" searches up 48%',
      preview: 'Buyers are actively looking for digital and printable daily routine planners. Check your 13 tags and listing titles...',
      body: `Hello Seller,

Our search patterns indicate a massive 48% surge in keyword queries related to "Daily Planner 2026", "Minimalist Weekly Schedule", and "Student Routine Tracker".

Recommended Actions:
1. Review your Etsy listing titles to ensure "Daily Planner 2026" is front-loaded in the first 30 characters.
2. Ensure you are utilizing all 13 multi-word tag slots.
3. Refresh product mockups with high-contrast lifestyle imagery.

Happy Selling,
The Etsy Merchant Team`,
      folder: 'inbox',
      category: 'etsy_leads',
      isStarred: true,
      isRead: false,
      timestamp: '10:42 AM'
    },
    {
      id: 'msg-2',
      from: 'seo-bot@seopilot.app',
      fromName: 'SEO Pilot Audit Engine',
      to: 'creator@seopilot.app',
      subject: '✅ Content Audit Completed: "Printable Budget Planner" scored 92/100',
      preview: 'Your latest listing description has been audited against keyword density and title placement thresholds...',
      body: `Hi there,

Your automated SEO content audit for "Printable Budget Planner" has completed.

Audit Summary:
• Overall Score: 92 / 100
• Keyword Density: 1.8% (Optimal between 0.5% - 2.5%)
• Title Length: 54 characters (Optimal)
• All 13 Tags Present: Yes

Recommendations:
- Consider adding 1 additional subheading (H3) with FAQs to answer common buyer purchase queries.

Keep optimizing!`,
      folder: 'inbox',
      category: 'seo_alerts',
      isStarred: false,
      isRead: false,
      timestamp: '8:15 AM'
    },
    {
      id: 'msg-3',
      from: 'client-inquiries@shopdecor.com',
      fromName: 'Emily Vance (Wholesale Lead)',
      to: 'creator@seopilot.app',
      subject: 'Wholesale inquiry for printable wedding invitation bundle',
      preview: 'Hi! I manage a boutique event agency in Chicago and we love your minimalist wedding stationery templates...',
      body: `Hi!

I run an event planning boutique in Chicago. We frequently recommend your Canva editable wedding stationery templates to our brides.

Do you offer a commercial license or multi-client bundle discount for your full invitation suite?

Looking forward to hearing from you!

Best regards,
Emily Vance
Creative Director, Chicago Nuptials`,
      folder: 'inbox',
      category: 'primary',
      isStarred: true,
      isRead: true,
      timestamp: 'Yesterday'
    },
    {
      id: 'msg-4',
      from: 'system@seopilot.app',
      fromName: 'SEO Pilot Security',
      to: 'creator@seopilot.app',
      subject: '🔒 Weekly Database Backup & RLS Policy Check: 100% Passed',
      preview: 'All 12 user tables verified. PostgreSQL Row Level Security is active and isolating your private workspaces...',
      body: `Security Telemetry Report:
- Database: Supabase PostgreSQL
- Row Level Security: Enforced on all 12 tables
- Access Control: Multi-tenant user_id isolation verified
- Zero secrets committed to client bundle.

No anomalies detected.`,
      folder: 'inbox',
      category: 'system',
      isStarred: false,
      isRead: true,
      timestamp: 'Oct 25'
    },
  ]);

  const [activeFolder, setActiveFolder] = useState<'inbox' | 'starred' | 'sent' | 'drafts' | 'trash'>('inbox');
  const [activeCategory, setActiveCategory] = useState<'all' | 'primary' | 'seo_alerts' | 'etsy_leads' | 'system'>('all');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>('msg-1');
  const [searchQuery, setSearchQuery] = useState('');

  // Compose Modal state
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeNotice, setComposeNotice] = useState<string | null>(null);

  // Filter messages
  const filteredMessages = messages.filter(m => {
    // Folder filter
    if (activeFolder === 'starred' && !m.isStarred) return false;
    if (activeFolder !== 'starred' && m.folder !== activeFolder) return false;

    // Category filter
    if (activeCategory !== 'all' && m.category !== activeCategory) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.subject.toLowerCase().includes(q) ||
        m.fromName.toLowerCase().includes(q) ||
        m.body.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || null;

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isStarred: !m.isStarred } : m));
  };

  const handleSelectMessage = (id: string) => {
    setSelectedMessageId(id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, folder: 'trash' } : m));
    setSelectedMessageId(null);
  };

  const handleSendCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim()) return;

    const newSentMessage: EmailMessage = {
      id: `sent-${Date.now()}`,
      from: 'you@seopilot.app',
      fromName: 'Me',
      to: composeTo.trim(),
      subject: composeSubject.trim(),
      preview: composeBody.slice(0, 80) + '...',
      body: composeBody.trim(),
      folder: 'sent',
      category: 'primary',
      isStarred: false,
      isRead: true,
      timestamp: 'Just now'
    };

    setMessages(prev => [newSentMessage, ...prev]);
    setIsComposing(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setComposeNotice('Email sent successfully!');
    setTimeout(() => setComposeNotice(null), 3000);
  };

  const unreadInboxCount = messages.filter(m => m.folder === 'inbox' && !m.isRead).length;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Bar with Mailbox Branding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Gmail &amp; Mailbox Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage client inquiries, Etsy search notifications, and SEO alerts directly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {composeNotice && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
              ✓ {composeNotice}
            </span>
          )}
          <Button variant="primary" size="sm" onClick={() => setIsComposing(true)} className="gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Compose Email
          </Button>
        </div>
      </div>

      {/* Main Mailbox Canvas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[620px]">
        {/* Left Mailbox Nav */}
        <div className="w-full md:w-56 border-r border-slate-200 dark:border-slate-800 p-3 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveFolder('inbox')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeFolder === 'inbox'
                  ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span>Inbox</span>
              </div>
              {unreadInboxCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white">
                  {unreadInboxCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveFolder('starred')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeFolder === 'starred'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Starred</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveFolder('sent')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeFolder === 'sent'
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Sent</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveFolder('drafts')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeFolder === 'drafts'
                  ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Drafts</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveFolder('trash')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeFolder === 'trash'
                  ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Trash</span>
              </div>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Categories
            </span>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                activeCategory === 'all' ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              • All Mail
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('primary')}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                activeCategory === 'primary' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              • Primary / Inquiries
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('etsy_leads')}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                activeCategory === 'etsy_leads' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              • Etsy Search Leads
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('seo_alerts')}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                activeCategory === 'seo_alerts' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              • SEO Audit Alerts
            </button>
          </div>
        </div>

        {/* Middle Message List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="relative">
              <input
                type="text"
                placeholder="Search mail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Email Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand-50/80 dark:bg-brand-950/40'
                      : !msg.isRead
                      ? 'bg-white dark:bg-slate-900 font-bold'
                      : 'bg-slate-50/30 dark:bg-slate-900/20 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <button
                        type="button"
                        onClick={(e) => toggleStar(msg.id, e)}
                        className="text-slate-300 hover:text-amber-500"
                      >
                        <svg className={`w-3.5 h-3.5 ${msg.isStarred ? 'text-amber-500 fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                      <span className={`text-xs truncate ${!msg.isRead ? 'font-extrabold text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                        {msg.fromName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  <h4 className={`text-xs truncate mb-0.5 ${!msg.isRead ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                    {msg.subject}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {msg.preview}
                  </p>
                </div>
              );
            })}

            {filteredMessages.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No emails in this view.
              </div>
            )}
          </div>
        </div>

        {/* Right Message Reader Panel */}
        <div className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 p-4 sm:p-6 min-h-[400px]">
          {selectedMessage ? (
            <div className="space-y-5">
              {/* Message Header Action toolbar */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={
                    selectedMessage.category === 'etsy_leads' ? 'success' :
                    selectedMessage.category === 'seo_alerts' ? 'warning' : 'purple'
                  }>
                    {selectedMessage.category.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">{selectedMessage.timestamp}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Move to trash"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Subject & Senders */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedMessage.subject}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                    {selectedMessage.fromName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {selectedMessage.fromName} <span className="font-normal text-slate-400">&lt;{selectedMessage.from}&gt;</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      to {selectedMessage.to}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {selectedMessage.body}
              </div>

              {/* Reply Box Shortcut */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setComposeTo(selectedMessage.from);
                    setComposeSubject(`Re: ${selectedMessage.subject}`);
                    setIsComposing(true);
                  }}
                  className="gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Reply to {selectedMessage.fromName}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Select an email to view its full contents</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Email Modal */}
      {isComposing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 max-w-xl w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Compose New Email
              </h3>
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendCompose} className="space-y-3">
              <Input
                label="To"
                placeholder="recipient@example.com"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                required
              />

              <Input
                label="Subject"
                placeholder="Listing optimization inquiry / Wholesale lead..."
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                required
              />

              <Textarea
                label="Message Body"
                placeholder="Write your email here..."
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                rows={6}
                required
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsComposing(false)}>
                  Discard
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Email
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
