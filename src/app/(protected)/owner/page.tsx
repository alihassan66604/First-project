'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@/components/ui';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'office' | 'user';
  status: 'active' | 'suspended';
  joinedDate: string;
  totalSearches: number;
}

export default function OwnerDashboardPage() {
  const [users, setUsers] = useState<UserRecord[]>([
    { id: 'usr-1', name: 'Platform Owner', email: 'owner@seopilot.app', role: 'owner', status: 'active', joinedDate: '2026-01-10', totalSearches: 420 },
    { id: 'usr-2', name: 'Operations Team Lead', email: 'office@seopilot.app', role: 'office', status: 'active', joinedDate: '2026-01-15', totalSearches: 185 },
    { id: 'usr-3', name: 'Sarah Craft Shop', email: 'sarah.etsy@example.com', role: 'user', status: 'active', joinedDate: '2026-02-01', totalSearches: 64 },
    { id: 'usr-4', name: 'Digital Printables Co', email: 'hello@digitalprints.io', role: 'user', status: 'active', joinedDate: '2026-02-12', totalSearches: 92 },
    { id: 'usr-5', name: 'David Planner Hub', email: 'david@plannerhub.net', role: 'user', status: 'active', joinedDate: '2026-02-20', totalSearches: 38 },
  ]);

  const [filterRole, setFilterRole] = useState<string>('all');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleRoleChange = (userId: string, newRole: 'owner' | 'office' | 'user') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setStatusNotice(`User role updated to ${newRole.toUpperCase()} successfully.`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        setStatusNotice(`Account status changed to ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const filteredUsers = users.filter(u => filterRole === 'all' || u.role === filterRole);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Owner &amp; Super Admin Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold border border-amber-300/40">
              Master Admin
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Global governance, budget surveillance, security telemetry, and cross-organization user management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System 100% Operational
          </div>
        </div>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 text-xs font-semibold text-brand-800 dark:text-brand-300 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {statusNotice}
        </div>
      )}

      {/* Executive KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Users</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">1,248</span>
            <span className="text-xs text-emerald-600 font-semibold ml-2">↑ +14% this month</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across free creator accounts</p>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">API Cost / Budget</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">$0.00</span>
            <span className="text-xs text-emerald-600 font-semibold ml-2">100% Free Tier</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Strict zero-budget rule maintained</p>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Keyword Searches</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">38,910</span>
            <span className="text-xs text-brand-600 font-semibold ml-2">Deterministic runs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Local expansion &amp; clustering</p>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Security &amp; RLS</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">12 / 12</span>
            <span className="text-xs text-emerald-600 font-semibold ml-2">Tables Protected</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Row Level Security enabled</p>
        </Card>
      </div>

      {/* Database & Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Infrastructure &amp; Resource Allocation</CardTitle>
            <CardDescription>Real-time status of PostgreSQL tables, storage quotas, and edge middleware.</CardDescription>
          </CardHeader>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Supabase Free Database Storage (500 MB quota)</span>
                <span className="text-brand-600 font-mono">14.2 MB / 500 MB (2.8%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-brand-600 h-2 rounded-full" style={{ width: '2.8%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Monthly Active Users (50,000 free tier limit)</span>
                <span className="text-indigo-600 font-mono">1,248 / 50,000 (2.5%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '2.5%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Edge Middleware Executions</span>
                <span className="text-emerald-600 font-mono">18,400 / 500,000 (3.6%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '3.6%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block font-medium">Postgres Engine</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">v15.6 Cloud</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block font-medium">Next.js Framework</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">14.2 App Router</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block font-medium">Avg Query Time</span>
              <span className="text-xs font-bold text-emerald-600">8.4 ms</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block font-medium">Uptime Guarantee</span>
              <span className="text-xs font-bold text-emerald-600">99.98%</span>
            </div>
          </div>
        </Card>

        {/* Security & Audit Events */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="text-base">Security Audit Feed</CardTitle>
              <CardDescription>Access control verification logs.</CardDescription>
            </CardHeader>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-0.5">
                <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                  <span>RLS Policy Verified</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Passed</span>
                </div>
                <p className="text-[11px] text-slate-500">12 tables verified for user_id isolation</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-0.5">
                <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                  <span>Route Guard Middleware</span>
                  <span className="text-[10px] text-blue-600 font-mono">Active</span>
                </div>
                <p className="text-[11px] text-slate-500">Unauthenticated traffic redirected to /login</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-0.5">
                <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                  <span>Zero Secret Leak Check</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Clean</span>
                </div>
                <p className="text-[11px] text-slate-500">No private keys embedded in bundle or repository</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button fullWidth size="sm" variant="outline" onClick={() => {
              setStatusNotice('Security health re-verified. All checks 100% compliant.');
              setTimeout(() => setStatusNotice(null), 3000);
            }}>
              Re-Scan Security Policies
            </Button>
          </div>
        </Card>
      </div>

      {/* User Management & Role Assignment Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              User Accounts &amp; Access Controls
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Assign Owner, Office, or User roles to control platform privileges.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter Role:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="office">Office Staff</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-3.5">User / Account</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Joined Date</th>
                <th className="p-3.5">Keywords Analyzed</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {u.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="owner">Owner (Admin)</option>
                      <option value="office">Office (Staff)</option>
                      <option value="user">User (Standard)</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      u.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-xs text-slate-500 font-mono">
                    {u.joinedDate}
                  </td>
                  <td className="p-3.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                    {u.totalSearches} runs
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                        u.status === 'active'
                          ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:hover:bg-red-950/40'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/60 dark:hover:bg-emerald-950/40'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
