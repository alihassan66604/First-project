'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Badge, EmptyState } from '@/components/ui';
import { expandKeywordsLocally } from '@/lib/keywords/expand';
import { normalizeKeyword, tokenize } from '@/lib/keywords/normalize';
import { classifySearchIntent } from '@/lib/keywords/intent';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe' },
];

interface CoverageItem {
  keyword: string;
  category: 'essential' | 'recommended' | 'opportunity';
  searchIntent: string;
  isCovered: boolean;
  frequency: number;
}

interface CoverageAuditResult {
  topic: string;
  language: string;
  totalKeywordsEvaluated: number;
  coveredCount: number;
  missingCount: number;
  coveragePercentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'Incomplete';
  items: CoverageItem[];
  missingSections: string[];
  missingQuestions: string[];
}

export default function ContentCoveragePage() {
  const router = useRouter();
  const [topic, setTopic] = useState('digital wedding planner');
  const [selectedLang, setSelectedLang] = useState('en');
  const [existingContent, setExistingContent] = useState(`Looking for the best digital wedding planner? Our printable and digital wedding planner includes budget spreadsheets, guest list tracker, and seating chart templates.`);
  const [auditResult, setAuditResult] = useState<CoverageAuditResult | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'missing' | 'covered'>('missing');

  const handleRunCoverageAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTopic = normalizeKeyword(topic);
    if (!cleanTopic) return;

    // 1. Generate semantic landscape keywords
    const landscape = expandKeywordsLocally(cleanTopic);
    const normalizedContent = normalizeKeyword(existingContent);
    const contentTokens = new Set(tokenize(existingContent));

    let coveredCount = 0;
    const items: CoverageItem[] = landscape.map((item, idx) => {
      const kw = item.keyword;
      const kwTokens = tokenize(kw);
      
      // Exact match or token coverage
      const isExact = normalizedContent.includes(kw);
      const tokenOverlap = kwTokens.filter(t => contentTokens.has(t)).length / (kwTokens.length || 1);
      const isCovered = isExact || tokenOverlap >= 0.75;

      if (isCovered) coveredCount++;

      return {
        keyword: kw,
        category: idx < 6 ? 'essential' : idx < 15 ? 'recommended' : 'opportunity',
        searchIntent: classifySearchIntent(kw),
        isCovered,
        frequency: isExact ? (normalizedContent.split(kw).length - 1) : (isCovered ? 1 : 0),
      };
    });

    const total = items.length || 1;
    const pct = Math.round((coveredCount / total) * 100);

    const grade: CoverageAuditResult['grade'] =
      pct >= 85 ? 'A+' : pct >= 70 ? 'A' : pct >= 50 ? 'B' : pct >= 30 ? 'C' : 'Incomplete';

    const missingItems = items.filter(i => !i.isCovered);

    const missingSections = [
      `Section Guide: How to choose the best ${cleanTopic}`,
      `Comparison & Pricing breakdown for ${cleanTopic}`,
      `Step-by-step checklist and printable templates`,
      `Common mistakes to avoid when using ${cleanTopic}`,
    ];

    const missingQuestions = missingItems
      .filter(i => i.searchIntent === 'informational' || i.keyword.startsWith('how') || i.keyword.startsWith('what'))
      .slice(0, 5)
      .map(i => `How does ${i.keyword} work for beginners?`);

    setAuditResult({
      topic: cleanTopic,
      language: selectedLang,
      totalKeywordsEvaluated: total,
      coveredCount,
      missingCount: total - coveredCount,
      coveragePercentage: pct,
      grade,
      items,
      missingSections,
      missingQuestions,
    });
  };

  const handleSendToArticleBuilder = () => {
    if (!auditResult) return;
    router.push(`/tools/article?topic=${encodeURIComponent(auditResult.topic)}`);
  };

  const filteredItems = auditResult?.items.filter(item => {
    if (activeTab === 'missing') return !item.isCovered;
    if (activeTab === 'covered') return item.isCovered;
    return true;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <span>Content Coverage &amp; Gap Analyzer</span>
            <Badge variant="purple">Topical Authority</Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare your copy against the complete semantic search landscape to uncover missing topics, subtopics, and ranking gaps.
          </p>
        </div>

        {auditResult && (
          <Button variant="primary" size="sm" onClick={handleSendToArticleBuilder}>
            Fill Gaps in Page Article Builder
          </Button>
        )}
      </div>

      {/* Input Form Card */}
      <Card>
        <form onSubmit={handleRunCoverageAudit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Topic / Focus Keyword *
              </label>
              <Input
                placeholder="e.g. digital wedding planner, etsy seo tags, keto diet meal plan..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Language
              </label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.label} ({l.native})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Existing Article / Page Copy / Product Description *
            </label>
            <textarea
              rows={5}
              placeholder="Paste your page draft, article, or product description to evaluate what semantic topics and keyword gaps you are missing..."
              value={existingContent}
              onChange={(e) => setExistingContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-xs leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Run Content Coverage Audit
            </Button>
          </div>
        </form>
      </Card>

      {/* Audit KPI Cards */}
      {auditResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 dark:text-slate-400">Topical Coverage</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                  {auditResult.coveragePercentage}%
                </span>
                <Badge variant={auditResult.coveragePercentage >= 70 ? 'success' : auditResult.coveragePercentage >= 50 ? 'warning' : 'error'}>
                  Grade {auditResult.grade}
                </Badge>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 dark:text-slate-400">Covered Keywords</span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {auditResult.coveredCount}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 dark:text-slate-400">Missing Gaps</span>
              <div className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">
                {auditResult.missingCount}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Landscape</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {auditResult.totalKeywordsEvaluated}
              </div>
            </div>
          </div>

          {/* Actionable Recommendations to Hit 100% Coverage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Recommended Headings to Add</span>
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-amber-900 dark:text-amber-300">
                {auditResult.missingSections.map((sec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">&bull;</span>
                    <span>{sec}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Missing Question Queries (People Also Ask)</span>
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-blue-900 dark:text-blue-300">
                {auditResult.missingQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">&bull;</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Granular Coverage Items Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('missing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'missing'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  Missing Gaps ({auditResult.missingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('covered')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'covered'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  Covered ({auditResult.coveredCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'all'
                      ? 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  All ({auditResult.totalKeywordsEvaluated})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="p-3">Keyword / Semantic Subtopic</th>
                    <th className="p-3">Priority Category</th>
                    <th className="p-3">Search Intent</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Occurrence in Text</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                        {item.keyword}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.category === 'essential'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : item.category === 'recommended'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3 capitalize">
                        {item.searchIntent}
                      </td>
                      <td className="p-3">
                        {item.isCovered ? (
                          <Badge variant="success">Covered</Badge>
                        ) : (
                          <Badge variant="error">Missing Gap</Badge>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {item.frequency}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {!auditResult && (
        <Card className="py-12">
          <EmptyState
            title="Analyze your content coverage"
            description="Enter a topic and paste your draft copy above to detect ranking blind spots and missing semantic topics."
          />
        </Card>
      )}
    </div>
  );
}
