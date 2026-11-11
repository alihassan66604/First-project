'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, Input } from '@/components/ui';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'office' | 'user';
  status: 'active' | 'suspended';
  joinedDate: string;
  totalSearches: number;
}

interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  items: { description: string; amount: number }[];
  total: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface StaffTask {
  id: string;
  title: string;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export default function OwnerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'finance' | 'tasks' | 'clients' | 'plans' | 'security' | 'branding'>('overview');

  // Users State
  const [users, setUsers] = useState<UserRecord[]>([
    { id: 'usr-1', name: 'Platform Owner', email: 'owner@seopilot.app', role: 'owner', status: 'active', joinedDate: '2026-01-10', totalSearches: 420 },
    { id: 'usr-2', name: 'Operations Team Lead', email: 'office@seopilot.app', role: 'office', status: 'active', joinedDate: '2026-01-15', totalSearches: 185 },
    { id: 'usr-3', name: 'Sarah Craft Shop', email: 'sarah.etsy@example.com', role: 'user', status: 'active', joinedDate: '2026-02-01', totalSearches: 64 },
    { id: 'usr-4', name: 'Digital Printables Co', email: 'hello@digitalprints.io', role: 'user', status: 'active', joinedDate: '2026-02-12', totalSearches: 92 },
    { id: 'usr-5', name: 'David Planner Hub', email: 'david@plannerhub.net', role: 'user', status: 'active', joinedDate: '2026-02-20', totalSearches: 38 },
  ]);

  // 1. Invoices State
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([
    {
      id: 'inv-1',
      invoiceNumber: 'INV-2026-001',
      clientName: 'Digital Printables Co',
      clientEmail: 'hello@digitalprints.io',
      items: [
        { description: 'Full SEO Audit & Keyword Strategy', amount: 350 },
        { description: '13 Etsy Listing Optimization Pack', amount: 200 }
      ],
      total: 550,
      date: '2026-03-01',
      dueDate: '2026-03-15',
      status: 'paid'
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-2026-002',
      clientName: 'Sarah Craft Shop',
      clientEmail: 'sarah.etsy@example.com',
      items: [
        { description: 'Monthly Retainer: SEO Monitoring & Tag Compliance', amount: 300 }
      ],
      total: 300,
      date: '2026-03-10',
      dueDate: '2026-03-24',
      status: 'pending'
    },
    {
      id: 'inv-3',
      invoiceNumber: 'INV-2026-003',
      clientName: 'Modern Home Wall Art',
      clientEmail: 'contact@modernprints.art',
      items: [
        { description: 'Topical Authority Content Plan (25 Articles)', amount: 750 }
      ],
      total: 750,
      date: '2026-02-15',
      dueDate: '2026-03-01',
      status: 'overdue'
    }
  ]);

  // Invoice creation form state
  const [newInvClient, setNewInvClient] = useState('');
  const [newInvEmail, setNewInvEmail] = useState('');
  const [newInvDesc, setNewInvDesc] = useState('');
  const [newInvAmount, setNewInvAmount] = useState('');
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceRecord | null>(null);

  // 2. Staff Task Assignment State
  const [staffTasks, setStaffTasks] = useState<StaffTask[]>([
    { id: 'tsk-1', title: 'Audit 15 new listings for tag compliance (13 tags)', assignedTo: 'office@seopilot.app', priority: 'high', dueDate: '2026-03-20', status: 'in_progress' },
    { id: 'tsk-2', title: 'Review customer ticket for digital download link replacement', assignedTo: 'office@seopilot.app', priority: 'medium', dueDate: '2026-03-18', status: 'completed' },
    { id: 'tsk-3', title: 'Verify keywords coverage on Wedding Stationery pack', assignedTo: 'office@seopilot.app', priority: 'high', dueDate: '2026-03-22', status: 'pending' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // 3. Agency Branding State
  const [agencyName, setAgencyName] = useState('SEO Pilot Agency & Studio');
  const [supportEmail, setSupportEmail] = useState('support@seopilot.app');
  const [currency, setCurrency] = useState('USD ($)');
  const [whiteLabelActive, setWhiteLabelActive] = useState(true);

  // 4. Plans State
  const [plans, setPlans] = useState([
    { name: 'Creator Free', price: '$0 / mo', activeUsers: 1140, limits: '100 Keywords / Search', status: 'active' },
    { name: 'Pro SEO Seller', price: '$29 / mo', activeUsers: 84, limits: '1,000 Keywords + Page Builder', status: 'active' },
    { name: 'Agency Unlimited', price: '$99 / mo', activeUsers: 24, limits: '5,000 Keywords + Invoicing + White-Label', status: 'active' },
  ]);

  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleRoleChange = (userId: string, newRole: 'owner' | 'office' | 'user') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setStatusNotice(`User role updated to ${newRole.toUpperCase()} successfully.`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvClient.trim() || !newInvAmount) return;

    const amt = parseFloat(newInvAmount) || 0;
    const inv: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-00${invoices.length + 1}`,
      clientName: newInvClient.trim(),
      clientEmail: newInvEmail.trim() || 'billing@client.com',
      items: [{ description: newInvDesc.trim() || 'SEO Services & Optimization', amount: amt }],
      total: amt,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'pending'
    };

    setInvoices(prev => [inv, ...prev]);
    setNewInvClient('');
    setNewInvEmail('');
    setNewInvDesc('');
    setNewInvAmount('');
    setStatusNotice(`Invoice ${inv.invoiceNumber} generated successfully.`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: StaffTask = {
      id: `tsk-${Date.now()}`,
      title: newTaskTitle.trim(),
      assignedTo: 'office@seopilot.app',
      priority: newTaskPriority,
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      status: 'pending',
    };

    setStaffTasks(prev => [task, ...prev]);
    setNewTaskTitle('');
    setStatusNotice('Task assigned to Office Team successfully.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.total, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Owner Executive Suite
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold border border-amber-300/40">
              Master Admin
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Invoicing &amp; client billing, financial revenue analytics, staff task delegation, plans, security telemetry, and governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System 100% Operational &bull; $0 Infrastructure Cost
          </div>
        </div>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {statusNotice}
        </div>
      )}

      {/* Feature Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'overview', label: 'Executive Overview', icon: '📊' },
          { id: 'invoices', label: 'Invoices & Billing', icon: '🧾' },
          { id: 'finance', label: 'Revenue & Finance', icon: '💰' },
          { id: 'tasks', label: 'Staff Task Assignment', icon: '📋' },
          { id: 'clients', label: 'Client Accounts', icon: '🏢' },
          { id: 'plans', label: 'Subscription Tiers', icon: '💎' },
          { id: 'security', label: 'Security & PBKDF2 Logs', icon: '🛡️' },
          { id: 'branding', label: 'White-Label Branding', icon: '🎨' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase text-slate-500">Collected Revenue</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">${totalRevenue.toLocaleString()}</div>
              <p className="text-[11px] text-slate-400 mt-1">${pendingRevenue.toLocaleString()} pending payments</p>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase text-slate-500">Active Invoices</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{invoices.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">100% free self-hosted billing</p>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase text-slate-500">API Cost Surpassed</span>
              <div className="text-3xl font-extrabold text-indigo-600 mt-1">$0.00</div>
              <p className="text-[11px] text-slate-400 mt-1">Free public endpoints &amp; local algorithms</p>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase text-slate-500">Total Users</span>
              <div className="text-3xl font-extrabold text-purple-600 mt-1">{users.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">Owner, Office &amp; User roles</p>
            </Card>
          </div>

          {/* User Governance Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                User Management &amp; Role Governance
              </h3>
              <Badge variant="purple">{users.length} Registered Accounts</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Joined</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{u.name}</td>
                      <td className="p-3 font-mono text-slate-500">{u.email}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                          className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold cursor-pointer"
                        >
                          <option value="owner">Owner (Admin)</option>
                          <option value="office">Office (Staff)</option>
                          <option value="user">User (Client)</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <Badge variant={u.status === 'active' ? 'success' : 'error'}>{u.status}</Badge>
                      </td>
                      <td className="p-3 text-slate-400">{u.joinedDate}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, status: usr.status === 'active' ? 'suspended' : 'active' } : usr));
                          }}
                          className="text-xs text-brand-600 hover:underline font-medium"
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: INVOICES & BILLING */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          {/* Create Invoice Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Generate Client Invoice</span>
                <span className="text-xs text-slate-400 font-normal">Self-Hosted $0 Billing Engine</span>
              </CardTitle>
              <CardDescription>Issue formatted PDF-ready invoices to agency and SEO clients.</CardDescription>
            </CardHeader>

            <form onSubmit={handleCreateInvoice} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Name *</label>
                <Input
                  placeholder="e.g. Acme Studio LLC"
                  value={newInvClient}
                  onChange={(e) => setNewInvClient(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Email</label>
                <Input
                  type="email"
                  placeholder="billing@acme.com"
                  value={newInvEmail}
                  onChange={(e) => setNewInvEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Item Description</label>
                <Input
                  placeholder="e.g. 13 Etsy Tags + Keyword Strategy"
                  value={newInvDesc}
                  onChange={(e) => setNewInvDesc(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount ($ USD) *</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="350"
                    value={newInvAmount}
                    onChange={(e) => setNewInvAmount(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="primary" className="shrink-0">
                    Create
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Invoices List Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">All Client Invoices</span>
                <span className="text-xs text-slate-400">({invoices.length} invoices)</span>
              </div>
              <div className="text-xs font-bold text-emerald-600">
                Total Billed: ${(totalRevenue + pendingRevenue).toLocaleString()}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">{inv.invoiceNumber}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{inv.clientName}</div>
                        <div className="text-[10px] text-slate-400">{inv.clientEmail}</div>
                      </td>
                      <td className="p-3">{inv.date}</td>
                      <td className="p-3">{inv.dueDate}</td>
                      <td className="p-3 font-bold font-mono text-slate-900 dark:text-slate-100">${inv.total.toFixed(2)}</td>
                      <td className="p-3">
                        <select
                          value={inv.status}
                          onChange={(e) => {
                            setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: e.target.value as any } : i));
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer border ${
                            inv.status === 'paid'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : inv.status === 'pending'
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : 'bg-red-50 border-red-300 text-red-800'
                          }`}
                        >
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setViewingInvoice(inv)}
                          className="text-xs text-brand-600 hover:underline font-semibold"
                        >
                          View / Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Printable Invoice Modal */}
          {viewingInvoice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-start justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{agencyName}</h2>
                    <p className="text-xs text-slate-500">{supportEmail}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-400 block">{viewingInvoice.invoiceNumber}</span>
                    <Badge variant={viewingInvoice.status === 'paid' ? 'success' : 'warning'}>
                      {viewingInvoice.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Billed To:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{viewingInvoice.clientName}</p>
                    <p className="text-slate-500">{viewingInvoice.clientEmail}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block font-semibold">Invoice Date:</span>
                    <p className="font-medium text-slate-700 dark:text-slate-300">{viewingInvoice.date}</p>
                    <span className="text-slate-400 block font-semibold mt-1">Due Date:</span>
                    <p className="font-medium text-slate-700 dark:text-slate-300">{viewingInvoice.dueDate}</p>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                      <tr>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {viewingInvoice.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 text-slate-800 dark:text-slate-200">{it.description}</td>
                          <td className="p-2.5 text-right font-mono font-bold">${it.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800/40 font-bold border-t border-slate-200 dark:border-slate-800">
                      <tr>
                        <td className="p-2.5 text-slate-900 dark:text-slate-100">Total Balance Due</td>
                        <td className="p-2.5 text-right font-mono text-base text-brand-600">${viewingInvoice.total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 text-center">
                  Payment instructions: Direct Wire / Bank Transfer / Stripe. Thank you for your business!
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    Print Invoice
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setViewingInvoice(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REVENUE & FINANCE */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <span className="text-xs font-semibold text-slate-500">Monthly Recurring Revenue (MRR)</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">$4,850</div>
              <span className="text-xs text-emerald-600 font-semibold">↑ +18% from last month</span>
            </Card>
            <Card>
              <span className="text-xs font-semibold text-slate-500">Annual Run Rate (ARR)</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">$58,200</div>
              <span className="text-xs text-slate-400">Projected annualized run rate</span>
            </Card>
            <Card>
              <span className="text-xs font-semibold text-slate-500">Net Profit Margin</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">98.5%</div>
              <span className="text-xs text-emerald-700 font-medium">$0 paid API costs achieved</span>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue &amp; Cost Breakdown</CardTitle>
              <CardDescription>Zero-overhead SaaS financial architecture comparison.</CardDescription>
            </CardHeader>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Gross Software Retainers</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">+$4,850.00</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Third-Party Paid Search API Fees</span>
                <span className="font-mono font-bold text-emerald-600">$0.00 (Self-Hosted)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Server Infrastructure &amp; DB Storage</span>
                <span className="font-mono font-bold text-emerald-600">$0.00 (Free Tier Cloud)</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 font-bold text-sm">
                <span className="text-emerald-900 dark:text-emerald-200">Total Net Operating Margin</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-mono">+$4,850.00 (100%)</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: STAFF TASK ASSIGNMENT */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assign Operational Task to Office Staff</CardTitle>
              <CardDescription>Delegate SEO audits, customer ticket reviews, and tag verification to the team.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex-1">
                <Input
                  placeholder="Task title (e.g. Audit 25 Etsy tags for Etsy Shop X)..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="w-full sm:w-44">
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <Button type="submit" variant="primary">
                Assign Task
              </Button>
            </form>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Delegated Operations Tasks</span>
              <Badge variant="purple">{staffTasks.length} Active Tasks</Badge>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {staffTasks.map((t) => (
                <div key={t.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Assigned to: <span className="font-mono text-slate-600 dark:text-slate-300">{t.assignedTo}</span> &bull; Due: {t.dueDate}
                    </div>
                  </div>
                  <div>
                    <select
                      value={t.status}
                      onChange={(e) => {
                        setStaffTasks(prev => prev.map(item => item.id === t.id ? { ...item, status: e.target.value as any } : item));
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: CLIENT ACCOUNTS */}
      {activeTab === 'clients' && (
        <Card padding="none" className="overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Agency Clients &amp; Retainers</span>
            <Button size="sm" variant="outline">Add Client</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="p-3">Client Studio</th>
                  <th className="p-3">Primary Niche</th>
                  <th className="p-3">Monthly Value</th>
                  <th className="p-3">Assigned Lead</th>
                  <th className="p-3">Contract Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">Digital Printables Co</td>
                  <td className="p-3">Wedding &amp; Event Stationery</td>
                  <td className="p-3 font-bold font-mono">$650/mo</td>
                  <td className="p-3 font-mono">office@seopilot.app</td>
                  <td className="p-3"><Badge variant="success">Active Retainer</Badge></td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">Sarah Craft Shop</td>
                  <td className="p-3">Physical Handmade Gifts</td>
                  <td className="p-3 font-bold font-mono">$300/mo</td>
                  <td className="p-3 font-mono">office@seopilot.app</td>
                  <td className="p-3"><Badge variant="success">Active Retainer</Badge></td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">Modern Prints Studio</td>
                  <td className="p-3">Wall Art Prints</td>
                  <td className="p-3 font-bold font-mono">$750/mo</td>
                  <td className="p-3 font-mono">owner@seopilot.app</td>
                  <td className="p-3"><Badge variant="warning">Renewal Pending</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 6: SUBSCRIPTION TIERS */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p, idx) => (
            <Card key={idx} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base text-slate-900 dark:text-slate-100">{p.name}</span>
                  <Badge variant="purple">{p.status}</Badge>
                </div>
                <div className="text-2xl font-extrabold text-brand-600 mb-2">{p.price}</div>
                <p className="text-xs text-slate-500 mb-3">{p.limits}</p>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Active Subscribers: <span className="font-mono text-brand-600">{p.activeUsers}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <Button variant="outline" size="sm" className="w-full">Edit Plan Limits</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 7: SECURITY & PBKDF2 */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cryptographic Session &amp; Security Telemetry</CardTitle>
              <CardDescription>PBKDF2 100,000-iteration hashing and HMAC-SHA256 cookie validation status.</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-800 dark:text-emerald-200 font-bold block">PBKDF2 Password Protection</span>
                <span className="text-emerald-600 text-[11px] mt-0.5 block">100,000 SHA-256 Iterations</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <span className="text-blue-800 dark:text-blue-200 font-bold block">HMAC Session Signing</span>
                <span className="text-blue-600 text-[11px] mt-0.5 block">Edge Cryptographic Signatures</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                <span className="text-purple-800 dark:text-purple-200 font-bold block">Brute-Force Rate Limiting</span>
                <span className="text-purple-600 text-[11px] mt-0.5 block">5 attempts / 60s Sliding Window</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 8: WHITE-LABEL BRANDING */}
      {activeTab === 'branding' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agency White-Label &amp; Custom Branding</CardTitle>
            <CardDescription>Customize platform name, invoices, and client reporting logos.</CardDescription>
          </CardHeader>
          <div className="space-y-4 pt-2 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Agency Display Name</label>
              <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Support Email on Invoices</label>
              <Input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Invoice Currency</label>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="wl"
                checked={whiteLabelActive}
                onChange={(e) => setWhiteLabelActive(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="wl" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Enable white-label header and custom footer on all client PDF exports
              </label>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setStatusNotice('Agency white-label settings saved.');
                setTimeout(() => setStatusNotice(null), 3000);
              }}
            >
              Save Branding Settings
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
