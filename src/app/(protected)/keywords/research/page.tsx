'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { expandKeywordsLocally } from '@/lib/keywords/expand';
import { deduplicateKeywords, normalizeKeyword } from '@/lib/keywords/normalize';
import { classifySearchIntent } from '@/lib/keywords/intent';
import { exportKeywordsToCsv, triggerCsvDownload } from '@/lib/export/csv';
import { Button, Input, Card, Badge, EmptyState } from '@/components/ui';
import type { Keyword, SearchIntent, KeywordSource } from '@/types';

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

export default function KeywordResearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [seedInput, setSeedInput] = useState(initialQuery);
  const [sourceMode, setSourceMode] = useState<KeywordSource>('google_autocomplete');
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [targetCount, setTargetCount] = useState<number>(1000);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 50;
  const [manualInput, setManualInput] = useState('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [filterIntent, setFilterIntent] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'alpha'>('relevance');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-run if query param was passed from dashboard
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery, sourceMode, selectedLang);
    }
  }, [initialQuery]);

  const handleSearch = async (seed: string, source: KeywordSource, lang: string, count: number = targetCount) => {
    const cleanSeed = normalizeKeyword(seed);
    if (!cleanSeed) return;

    setStatusMessage(null);
    setIsLoading(true);
    setCurrentPage(1);

    try {
      if (source === 'manual') {
        setIsLoading(false);
        return;
      }

      if (source === 'local_expansion') {
        const local = expandKeywordsLocally(cleanSeed);
        setKeywords(prev => deduplicateKeywordsList([...local, ...prev]));
        setSelectedIds(new Set());
        setStatusMessage({
          type: 'success',
          text: `Generated ${local.length} deterministic keyword ideas for "${cleanSeed}".`,
        });
      } else {
        // Fetch via server-side autocomplete API (Google or Etsy)
        const res = await fetch('/api/keywords/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: cleanSeed,
            source,
            lang,
            targetCount: count,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch autocomplete suggestions (HTTP ${res.status})`);
        }

        const data = await res.json();
        const returnedKeywords: Keyword[] = data.keywords || [];

        setKeywords(prev => deduplicateKeywordsList([...returnedKeywords, ...prev]));
        setSelectedIds(new Set());

        const sourceLabel = source === 'google_autocomplete' ? 'Google' : 'Etsy';
        const langObj = LANGUAGES.find(l => l.code === lang);
        const langLabel = langObj ? `${langObj.label} (${lang})` : lang;

        setStatusMessage({
          type: 'success',
          text: `Found ${returnedKeywords.length} live ${sourceLabel} autocomplete suggestions in ${langLabel} for "${cleanSeed}".`,
        });
      }
    } catch (err: any) {
      console.error('[Keyword Research Error]:', err);
      // Fallback locally if network failed
      const fallback = expandKeywordsLocally(cleanSeed);
      setKeywords(prev => deduplicateKeywordsList([...fallback, ...prev]));
      setStatusMessage({
        type: 'info',
        text: `Network request encountered an issue. Generated ${fallback.length} local deterministic keywords as a graceful fallback.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deduplicateKeywordsList = (list: Keyword[]): Keyword[] => {
    const seen = new Set<string>();
    const result: Keyword[] = [];
    for (const kw of list) {
      const norm = normalizeKeyword(kw.keyword);
      if (!seen.has(norm)) {
        seen.add(norm);
        result.push(kw);
      }
    }
    return result;
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const lines = manualInput
      .split(/[\n,]+/)
      .map(k => normalizeKeyword(k))
      .filter(Boolean);

    const uniqueLines = deduplicateKeywords(lines);

    const newKeywords: Keyword[] = uniqueLines.map((kw, idx) => ({
      id: `manual-${Date.now()}-${idx}`,
      research_run_id: 'manual-run',
      user_id: 'local-user',
      keyword: kw,
      source: 'manual',
      language: selectedLang,
      search_intent: classifySearchIntent(kw),
      relevance_score: 1.0,
      is_selected: false,
      collected_at: new Date().toISOString(),
    }));

    setKeywords(prev => deduplicateKeywordsList([...newKeywords, ...prev]));
    setManualInput('');
    setStatusMessage({
      type: 'success',
      text: `Added ${newKeywords.length} manual keywords.`,
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredKeywords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredKeywords.map(k => k.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeSelected = () => {
    setKeywords(prev => prev.filter(k => !selectedIds.has(k.id)));
    setSelectedIds(new Set());
    setStatusMessage({
      type: 'info',
      text: 'Selected keywords removed.',
    });
  };

  const copyKeyword = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    const toExport = keywords.filter(k => selectedIds.size === 0 || selectedIds.has(k.id));
    if (toExport.length === 0) return;

    const csvData = exportKeywordsToCsv(toExport);
    const fileName = `seo_pilot_${sourceMode}_${selectedLang}_${seedInput ? normalizeKeyword(seedInput).replace(/\s+/g, '_') : 'keywords'}.csv`;
    triggerCsvDownload(csvData, fileName);
  };

  // Filter and sort
  const filteredKeywords = keywords
    .filter(k => filterIntent === 'all' || k.search_intent === filterIntent)
    .filter(k => filterSource === 'all' || k.source === filterSource)
    .sort((a, b) => {
      if (sortBy === 'relevance') return b.relevance_score - a.relevance_score;
      return a.keyword.localeCompare(b.keyword);
    });

  const totalPages = Math.ceil(filteredKeywords.length / pageSize) || 1;
  const paginatedKeywords = filteredKeywords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const intentColorMap: Record<SearchIntent, 'info' | 'warning' | 'success' | 'purple'> = {
    informational: 'info',
    commercial: 'warning',
    transactional: 'success',
    navigational: 'purple',
  };

  const sourceConfig: Record<KeywordSource, { label: string; badge: 'info' | 'warning' | 'success' | 'default'; icon: string }> = {
    google_autocomplete: {
      label: 'Google',
      badge: 'info',
      icon: '🌐',
    },
    etsy_autocomplete: {
      label: 'Etsy',
      badge: 'warning',
      icon: '🛍️',
    },
    local_expansion: {
      label: 'Local Permutations',
      badge: 'success',
      icon: '⚡',
    },
    manual: {
      label: 'Manual Entry',
      badge: 'default',
      icon: '✍️',
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <span>Keyword Research Studio</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              $0 Budget Free APIs
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time live autocomplete from Google and Etsy with multi-language support (English, Urdu, Hindi, Spanish, Arabic, etc.), plus deterministic local permutations.
          </p>
        </div>

        {keywords.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setKeywords([])}>
              Clear All ({keywords.length})
            </Button>
            <Button variant="primary" size="sm" onClick={handleExportCsv}>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </Button>
          </div>
        )}
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
              : 'bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Source Selection Tabs */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
          {/* Google Autocomplete Tab */}
          <button
            type="button"
            onClick={() => setSourceMode('google_autocomplete')}
            className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
              sourceMode === 'google_autocomplete'
                ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
                </svg>
                <span>Google Autocomplete</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                Live
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Real-time Google search suggestions & modifier queries
            </span>
          </button>

          {/* Etsy Autocomplete Tab */}
          <button
            type="button"
            onClick={() => setSourceMode('etsy_autocomplete')}
            className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
              sourceMode === 'etsy_autocomplete'
                ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Etsy Autocomplete</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                E-comm
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Etsy typeahead for digital products, printables & crafts
            </span>
          </button>

          {/* Local Expansion Tab */}
          <button
            type="button"
            onClick={() => setSourceMode('local_expansion')}
            className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
              sourceMode === 'local_expansion'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Local Expansion</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                Fast
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic permutation engine with zero network latency
            </span>
          </button>

          {/* Manual Entry Tab */}
          <button
            type="button"
            onClick={() => setSourceMode('manual')}
            className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
              sourceMode === 'manual'
                ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/30 text-brand-900 dark:text-brand-100 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Manual Entry</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Bulk
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Paste or type your own list of custom keywords
            </span>
          </button>
        </div>

        {/* Input Forms */}
        {sourceMode === 'manual' ? (
          <form onSubmit={handleManualAdd} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Paste keywords (separated by commas or new lines):
              </label>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500">Language Tag:</label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.label} ({l.native})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <textarea
              placeholder="e.g. digital wedding invitation, budget planner excel, baby shower invitation printable, minimalist resume template"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                Add to Research List
              </Button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(seedInput, sourceMode, selectedLang);
            }}
            className="flex flex-col md:flex-row gap-3 items-stretch md:items-center"
          >
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {sourceMode === 'google_autocomplete' ? (
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
                  </svg>
                ) : sourceMode === 'etsy_autocomplete' ? (
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              <input
                type="text"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                placeholder={
                  sourceMode === 'google_autocomplete'
                    ? 'Enter search query (e.g. digital planner, wedding card, web design)...'
                    : sourceMode === 'etsy_autocomplete'
                    ? 'Enter Etsy product idea (e.g. wall art, invoice template, crochet pattern)...'
                    : 'Enter seed keyword for local expansion (e.g. habit tracker, keto diet)...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Language Dropdown */}
            <div className="w-full md:w-52 shrink-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label} ({l.native})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Count Dropdown (Allows fetching up to 1,000 keywords) */}
            <div className="w-full md:w-48 shrink-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <select
                  value={targetCount}
                  onChange={(e) => setTargetCount(Number(e.target.value))}
                  className="w-full pl-9 pr-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium cursor-pointer"
                >
                  <option value={1000}>1,000 Keywords (Full 1K)</option>
                  <option value={500}>500 Keywords</option>
                  <option value={250}>250 Keywords</option>
                  <option value={100}>100 Keywords</option>
                  <option value={50}>50 Keywords</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !seedInput.trim()}
              className="shrink-0"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>
                    {sourceMode === 'google_autocomplete'
                      ? 'Get Google Autocomplete'
                      : sourceMode === 'etsy_autocomplete'
                      ? 'Get Etsy Suggestions'
                      : 'Expand Permutations'}
                  </span>
                </div>
              )}
            </Button>
          </form>
        )}
      </Card>

      {/* Summary KPI Strip */}
      {keywords.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Keywords</span>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {keywords.length}
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-500 dark:text-slate-400">Google Autocomplete</span>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              {keywords.filter(k => k.source === 'google_autocomplete').length}
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-500 dark:text-slate-400">Etsy Autocomplete</span>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {keywords.filter(k => k.source === 'etsy_autocomplete').length}
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-500 dark:text-slate-400">Local / Manual</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {keywords.filter(k => k.source === 'local_expansion' || k.source === 'manual').length}
            </div>
          </div>
        </div>
      )}

      {/* Results Table & Toolbar */}
      {keywords.length > 0 && (
        <Card padding="none" className="overflow-hidden">
          {/* Action Toolbar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {filteredKeywords.length} of {keywords.length} Keywords
              </span>
              {selectedIds.size > 0 && (
                <Badge variant="purple">
                  {selectedIds.size} selected
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Source */}
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Sources</option>
                <option value="google_autocomplete">🌐 Google Autocomplete</option>
                <option value="etsy_autocomplete">🛍️ Etsy Autocomplete</option>
                <option value="local_expansion">⚡ Local Expansion</option>
                <option value="manual">✍️ Manual Entry</option>
              </select>

              {/* Filter Intent */}
              <select
                value={filterIntent}
                onChange={(e) => setFilterIntent(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Intents</option>
                <option value="transactional">Transactional</option>
                <option value="commercial">Commercial</option>
                <option value="informational">Informational</option>
                <option value="navigational">Navigational</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'alpha')}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="alpha">Sort Alphabetically</option>
              </select>

              {selectedIds.size > 0 && (
                <Button variant="destructive" size="sm" onClick={removeSelected}>
                  Delete Selected
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredKeywords.length && filteredKeywords.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">Keyword</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Language</th>
                  <th className="p-3">Search Intent</th>
                  <th className="p-3">Relevance</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedKeywords.map((kw) => {
                  const isSelected = selectedIds.has(kw.id);
                  const isCopied = copiedId === kw.id;
                  const cfg = sourceConfig[kw.source] || sourceConfig.manual;

                  return (
                    <tr
                      key={kw.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(kw.id)}
                          className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <span>{kw.keyword}</span>
                          <button
                            type="button"
                            title="Copy keyword"
                            onClick={() => copyKeyword(kw.id, kw.keyword)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          >
                            {isCopied ? (
                              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant={cfg.badge}>
                          <span className="mr-1">{cfg.icon}</span>
                          {cfg.label}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                          {kw.language || 'en'}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge variant={intentColorMap[kw.search_intent]}>
                          {kw.search_intent}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                        {(kw.relevance_score * 100).toFixed(0)}%
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setKeywords(prev => prev.filter(k => k.id !== kw.id));
                            setSelectedIds(prev => {
                              const next = new Set(prev);
                              next.delete(kw.id);
                              return next;
                            });
                          }}
                          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {filteredKeywords.length > pageSize && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-600 dark:text-slate-400">
              <div>
                Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">{Math.min(currentPage * pageSize, filteredKeywords.length)}</span> of{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredKeywords.length}</span> keywords
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <span className="px-2 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {keywords.length === 0 && (
        <Card className="py-12">
          <EmptyState
            title="Start your keyword exploration"
            description="Select Google Autocomplete, Etsy Autocomplete, or Local Expansion above to find genuine, high-intent keywords in any language."
          />
        </Card>
      )}
    </div>
  );
}
