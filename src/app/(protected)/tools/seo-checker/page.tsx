'use client';

import { useState } from 'react';
import { auditContent } from '@/lib/seo/checker';
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, Badge } from '@/components/ui';
import type { SeoAudit, SeoCheck } from '@/types';

export default function SeoCheckerPage() {
  const [targetKeyword, setTargetKeyword] = useState('digital planner template');
  const [selectedLang, setSelectedLang] = useState('en');
  const [title, setTitle] = useState('Digital Planner Template | Daily & Weekly Routine Planner');
  const [metaDesc, setMetaDesc] = useState('Get your instant digital planner template today. Perfect for staying organized with daily and weekly schedules. Download now.');
  const [contentText, setContentText] = useState(`Looking for the best digital planner template? Staying organized has never been easier. This digital planner template is designed to help you organize your daily tasks, weekly schedules, and long-term goals without unnecessary clutter.

## Why Use a Digital Planner Template?
Using a digital planner template gives you full flexibility. Whether you use GoodNotes or print it out on paper, having a structured layout keeps you focused.

### Key Features of the Template:
- Undated daily and weekly schedule layouts
- Built-in habit log and goal breakdown
- Minimalist design for quick readability

## How to Get Started
Simply download the files, import into your favorite note-taking application, and start tracking your productivity right away.`);

  const [auditResult, setAuditResult] = useState<SeoAudit | null>(null);

  // Auto-fill if redirected from Page Article Generator
  useState(() => {
    if (typeof window !== 'undefined') {
      const incoming = localStorage.getItem('seo_checker_incoming');
      if (incoming) {
        try {
          const parsed = JSON.parse(incoming);
          if (parsed.text) setContentText(parsed.text);
          if (parsed.keyword) setTargetKeyword(parsed.keyword);
          localStorage.removeItem('seo_checker_incoming');
        } catch {}
      }
    }
  });

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetKeyword.trim() || !contentText.trim()) return;

    const audit = auditContent({
      title,
      metaDescription: metaDesc,
      contentText,
      targetKeyword,
    });

    setAuditResult(audit);
  };

  const getStatusBadge = (status: SeoCheck['status']) => {
    switch (status) {
      case 'pass':
        return <Badge variant="success">Pass</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'fail':
        return <Badge variant="error">Issue</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">SEO Content Checker</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Audit on-page content, keyword density, meta tags, and structure using transparent scoring heuristics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content Under Evaluation</CardTitle>
              <CardDescription>Enter your target search term and paste copy.</CardDescription>
            </CardHeader>

            <form onSubmit={handleRunAudit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Content Language
                </label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="en">English (English)</option>
                  <option value="ur">Urdu (اردو)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="ar">Arabic (العربية)</option>
                </select>
              </div>

              <Input
                label="Target Keyword"
                placeholder="e.g. digital planner template"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                required
              />

              <Input
                label="Page Title"
                placeholder="e.g. Best Digital Planner Template for 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                helperText={`${title.length} characters (ideal: 30-60)`}
              />

              <Textarea
                label="Meta Description"
                placeholder="Brief summary shown in search snippets..."
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                rows={2}
                helperText={`${metaDesc.length} characters (ideal: 120-160)`}
              />

              <Textarea
                label="Content Body"
                placeholder="Paste your listing description or blog post here..."
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                rows={10}
                required
              />

              <Button type="submit" variant="primary" fullWidth>
                Run SEO Audit
              </Button>
            </form>
          </Card>
        </div>

        {/* Audit Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {auditResult ? (
            <div className="space-y-6">
              {/* Score Summary */}
              <Card className="flex items-center justify-between p-6 bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-slate-900 dark:to-brand-950/40 border-brand-200 dark:border-brand-900">
                <div>
                  <span className="text-xs font-semibold uppercase text-brand-700 dark:text-brand-300 tracking-wider">
                    Overall Content SEO Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                      {auditResult.overall_score}
                    </span>
                    <span className="text-sm font-medium text-slate-400">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Transparent rule-based check • Not an official Google/Etsy grade
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg border-2 border-brand-500 bg-white dark:bg-slate-900 text-brand-600 shadow-sm">
                  {auditResult.overall_score}%
                </div>
              </Card>

              {/* Individual Checks */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    Detailed Checks ({auditResult.checks.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {auditResult.checks.map((check, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {check.name}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {check.message}
                        </p>
                        {check.details && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {check.details}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0">{getStatusBadge(check.status)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Actionable Recommendations */}
              {auditResult.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Priority Recommendations</CardTitle>
                  </CardHeader>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {auditResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          ) : (
            <Card className="py-24 text-center">
              <p className="text-slate-400 text-sm">
                Paste your content and target keyword on the left and click &quot;Run SEO Audit&quot; to inspect title, body density, length, and heading structure.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
