import type { Keyword, KeywordCluster } from '@/types';

/**
 * Escapes a single CSV field value according to RFC 4180 rules
 */
export function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates an RFC 4180 compliant CSV string from an array of Keyword objects
 */
export function exportKeywordsToCsv(keywords: Keyword[]): string {
  const headers = ['Keyword', 'Source', 'Language', 'Search Intent', 'Relevance Score', 'Collected At'];
  const rows = keywords.map(kw => [
    kw.keyword,
    kw.source,
    kw.language || 'en',
    kw.search_intent,
    kw.relevance_score,
    kw.collected_at
  ]);

  const csvLines = [
    headers.map(escapeCsvField).join(','),
    ...rows.map(row => row.map(escapeCsvField).join(','))
  ];

  return csvLines.join('\r\n');
}

/**
 * Generates an RFC 4180 compliant CSV string for Keyword Clusters
 */
export function exportClustersToCsv(clusters: KeywordCluster[]): string {
  const headers = ['Cluster Name', 'Primary Keyword', 'Search Intent', 'Suggested Content Type', 'Member Keywords'];
  const rows = clusters.map(c => [
    c.name,
    c.primary_keyword,
    c.search_intent,
    c.suggested_content_type || '',
    (c.keywords || []).map(k => k.keyword).join('; ')
  ]);

  const csvLines = [
    headers.map(escapeCsvField).join(','),
    ...rows.map(row => row.map(escapeCsvField).join(','))
  ];

  return csvLines.join('\r\n');
}

/**
 * Helper to trigger browser download of a CSV file
 */
export function triggerCsvDownload(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
