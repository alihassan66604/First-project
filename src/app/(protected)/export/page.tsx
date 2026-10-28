'use client';

import { useState } from 'react';
import { exportKeywordsToCsv, exportClustersToCsv, triggerCsvDownload } from '@/lib/export/csv';
import { expandKeywordsLocally } from '@/lib/keywords/expand';
import { clusterKeywordsLocally } from '@/lib/keywords/cluster';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, Badge } from '@/components/ui';

export default function ExportCenterPage() {
  const [seedKeyword, setSeedKeyword] = useState('digital budget tracker');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleExportKeywords = () => {
    if (!seedKeyword.trim()) return;
    const keywords = expandKeywordsLocally(seedKeyword.trim());
    const csv = exportKeywordsToCsv(keywords);
    triggerCsvDownload(csv, `keywords_${seedKeyword.trim().replace(/\s+/g, '_')}.csv`);
    setStatusMessage(`Exported ${keywords.length} keywords to CSV.`);
  };

  const handleExportClusters = () => {
    if (!seedKeyword.trim()) return;
    const keywords = expandKeywordsLocally(seedKeyword.trim());
    const clusters = clusterKeywordsLocally(keywords);
    const csv = exportClustersToCsv(clusters);
    triggerCsvDownload(csv, `clusters_${seedKeyword.trim().replace(/\s+/g, '_')}.csv`);
    setStatusMessage(`Exported ${clusters.length} keyword clusters to CSV.`);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Export Center</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Download your keyword research, clustering data, and content strategies directly as clean RFC 4180 CSV files.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs font-medium text-emerald-800 dark:text-emerald-300">
          ✓ {statusMessage}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick CSV Generation</CardTitle>
          <CardDescription>
            Enter a topic to generate and download immediate spreadsheet-ready keyword data.
          </CardDescription>
        </CardHeader>

        <div className="space-y-4">
          <Input
            label="Target Topic / Seed Keyword"
            placeholder="e.g. digital budget tracker, wall art printable..."
            value={seedKeyword}
            onChange={(e) => setSeedKeyword(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Full Keyword List (.CSV)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Includes keyword, source, search intent classification, relevance score, and timestamp.
                </p>
              </div>
              <div className="mt-4">
                <Button fullWidth variant="outline" size="sm" onClick={handleExportKeywords}>
                  Download Keywords CSV
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Semantic Clusters (.CSV)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Includes cluster title, primary keyword, intent, content type recommendation, and all secondary keywords.
                </p>
              </div>
              <div className="mt-4">
                <Button fullWidth variant="outline" size="sm" onClick={handleExportClusters}>
                  Download Clusters CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
