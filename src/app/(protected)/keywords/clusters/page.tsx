'use client';

import { useState } from 'react';
import { clusterKeywordsLocally } from '@/lib/keywords/cluster';
import { expandKeywordsLocally } from '@/lib/keywords/expand';
import { deduplicateKeywords, normalizeKeyword } from '@/lib/keywords/normalize';
import { classifySearchIntent } from '@/lib/keywords/intent';
import { exportClustersToCsv, triggerCsvDownload } from '@/lib/export/csv';
import { Button, Input, Card, Badge, EmptyState } from '@/components/ui';
import type { KeywordCluster, Keyword, SearchIntent } from '@/types';

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

export default function KeywordGroupingPage() {
  const [seedKeyword, setSeedKeyword] = useState('');
  const [customListInput, setCustomListInput] = useState('');
  const [mode, setMode] = useState<'seed' | 'custom'>('seed');
  const [groupingMethod, setGroupingMethod] = useState<'semantic' | 'intent' | 'modifier'>('semantic');
  const [selectedLang, setSelectedLang] = useState('en');
  const [clusters, setClusters] = useState<KeywordCluster[]>([]);
  const [editingClusterId, setEditingClusterId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedClusterId, setCopiedClusterId] = useState<string | null>(null);

  const handleGenerateClusters = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    let rawKeywords: Keyword[] = [];

    if (mode === 'seed') {
      if (!seedKeyword.trim()) return;
      rawKeywords = expandKeywordsLocally(seedKeyword.trim()).map(k => ({
        ...k,
        language: selectedLang,
      }));
    } else {
      if (!customListInput.trim()) return;
      const lines = deduplicateKeywords(
        customListInput.split(/[\n,]+/).map(k => normalizeKeyword(k)).filter(Boolean)
      );

      rawKeywords = lines.map((kw, idx) => ({
        id: `custom-group-${Date.now()}-${idx}`,
        research_run_id: 'custom-run',
        user_id: 'local-user',
        keyword: kw,
        source: 'manual',
        language: selectedLang,
        search_intent: classifySearchIntent(kw),
        relevance_score: 1.0,
        is_selected: false,
        collected_at: new Date().toISOString(),
      }));
    }

    if (rawKeywords.length === 0) return;

    let generated: KeywordCluster[] = [];

    if (groupingMethod === 'intent') {
      // Group by Search Intent
      const intentGroups: Record<SearchIntent, Keyword[]> = {
        transactional: [],
        commercial: [],
        informational: [],
        navigational: [],
      };

      rawKeywords.forEach(k => {
        intentGroups[k.search_intent].push(k);
      });

      generated = Object.entries(intentGroups)
        .filter(([_, items]) => items.length > 0)
        .map(([intent, items], idx) => ({
          id: `intent-cluster-${idx}`,
          user_id: 'local-user',
          project_id: null,
          name: `${intent.charAt(0).toUpperCase() + intent.slice(1)} Intent Hub`,
          primary_keyword: items[0]?.keyword || intent,
          search_intent: intent as SearchIntent,
          suggested_content_type:
            intent === 'transactional'
              ? 'Etsy Product Listing & Multi-Pack'
              : intent === 'commercial'
              ? 'Comparison Guide & Review Article'
              : 'Informational Pillar Guide',
          keywords: items,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
    } else {
      // Default to semantic clustering
      generated = clusterKeywordsLocally(rawKeywords);
    }

    setClusters(generated);
    setStatusMessage(`Successfully grouped into ${generated.length} keyword hubs from ${rawKeywords.length} keywords in ${selectedLang.toUpperCase()}.`);
  };

  const handleCopyCluster = (clusterId: string, kws: Keyword[]) => {
    const text = kws.map(k => k.keyword).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedClusterId(clusterId);
    setTimeout(() => setCopiedClusterId(null), 2000);
  };

  const handleRenameCluster = (id: string) => {
    if (!editName.trim()) return;
    setClusters(prev => prev.map(c => c.id === id ? { ...c, name: editName.trim() } : c));
    setEditingClusterId(null);
    setEditName('');
  };

  const handleDeleteCluster = (id: string) => {
    setClusters(prev => prev.filter(c => c.id !== id));
    setStatusMessage('Cluster deleted.');
  };

  const handleRemoveKeyword = (clusterId: string, keywordId: string) => {
    setClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        return {
          ...c,
          keywords: (c.keywords || []).filter(k => k.id !== keywordId)
        };
      }
      return c;
    }));
  };

  const handleExportCsv = () => {
    if (clusters.length === 0) return;
    const csv = exportClustersToCsv(clusters);
    triggerCsvDownload(csv, `seo_pilot_keyword_groups_${selectedLang}.csv`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Keyword Grouping &amp; Clusters</span>
            <Badge variant="purple">Content Hubs</Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize keywords into targeted content clusters, semantic silos, and search intent groups with international language support.
          </p>
        </div>

        {clusters.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Groups CSV
          </Button>
        )}
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 text-xs font-medium text-brand-800 dark:text-brand-300">
          {statusMessage}
        </div>
      )}

      {/* Grouping Generator Input */}
      <Card>
        <div className="flex border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('seed')}
            className={`pb-1 border-b-2 transition-colors ${
              mode === 'seed'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Auto-Expand from Topic
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`pb-1 border-b-2 transition-colors ${
              mode === 'custom'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Paste Custom Keyword List
          </button>
        </div>

        <form onSubmit={handleGenerateClusters} className="space-y-3">
          {mode === 'seed' ? (
            <Input
              placeholder="Enter seed topic to cluster (e.g., printable wedding planner, habit tracker, wedding card)..."
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
            />
          ) : (
            <textarea
              placeholder="Paste custom keywords separated by commas or new lines..."
              value={customListInput}
              onChange={(e) => setCustomListInput(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-slate-500 font-medium">Language:</label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.label} ({l.native})
                    </option>
                  ))}
                </select>
              </div>

              {/* Grouping Strategy */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-slate-500 font-medium">Group by:</label>
                <select
                  value={groupingMethod}
                  onChange={(e) => setGroupingMethod(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <option value="semantic">Semantic Topic Overlap</option>
                  <option value="intent">Search Intent (Transactional/Commercial)</option>
                </select>
              </div>
            </div>

            <Button type="submit" variant="primary">
              Build Keyword Groups
            </Button>
          </div>
        </form>
      </Card>

      {/* Clusters Grid */}
      {clusters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clusters.map((cluster) => {
            const isEditing = editingClusterId === cluster.id;
            const isCopied = copiedClusterId === cluster.id;

            return (
              <Card key={cluster.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Cluster name"
                          autoFocus
                        />
                        <Button size="sm" variant="primary" onClick={() => handleRenameCluster(cluster.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingClusterId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                            {cluster.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingClusterId(cluster.id);
                              setEditName(cluster.name);
                            }}
                            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          >
                            Rename
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="purple">
                            {cluster.search_intent}
                          </Badge>
                          <span className="text-[11px] text-slate-400">
                            {cluster.keywords?.length || 0} keywords
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyCluster(cluster.id, cluster.keywords || [])}
                      >
                        {isCopied ? 'Copied!' : 'Copy'}
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCluster(cluster.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Delete cluster"
                      >
                        &times;
                      </button>
                    </div>
                  </div>

                  {/* Suggested Content Pillar */}
                  {cluster.suggested_content_type && (
                    <div className="mb-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Suggested Content Hub: </span>
                      <span className="text-slate-500 dark:text-slate-400">{cluster.suggested_content_type}</span>
                    </div>
                  )}

                  {/* Keywords Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(cluster.keywords || []).map((kw) => (
                      <span
                        key={kw.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 group"
                      >
                        <span>{kw.keyword}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(cluster.id, kw.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="py-12">
          <EmptyState
            title="No keyword groups yet"
            description="Enter a topic or paste a list of keywords above to organize them into semantic content silos."
          />
        </Card>
      )}
    </div>
  );
}
