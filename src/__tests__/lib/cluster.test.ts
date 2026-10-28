import { describe, it, expect } from 'vitest';
import { clusterKeywordsLocally, calculateJaccardSimilarity } from '@/lib/keywords/cluster';
import { expandKeywordsLocally } from '@/lib/keywords/expand';

describe('Keyword Clustering Algorithm', () => {
  it('computes Jaccard token similarity correctly', () => {
    const simHigh = calculateJaccardSimilarity('daily habit tracker printable', 'habit tracker daily pdf');
    expect(simHigh).toBeGreaterThan(0.4);

    const simLow = calculateJaccardSimilarity('wedding invite template', 'garage workshop blueprint');
    expect(simLow).toBe(0);
  });

  it('clusters related keywords into distinct groups with primary keyword and suggested content type', () => {
    const keywords = expandKeywordsLocally('habit tracker');
    const clusters = clusterKeywordsLocally(keywords);

    expect(clusters.length).toBeGreaterThan(0);
    for (const cluster of clusters) {
      expect(cluster.primary_keyword).toBeDefined();
      expect(cluster.name).toBeDefined();
      expect(cluster.search_intent).toBeDefined();
      expect(cluster.suggested_content_type).toBeDefined();
      expect((cluster.keywords || []).length).toBeGreaterThan(0);
    }
  });

  it('handles empty keyword list gracefully', () => {
    expect(clusterKeywordsLocally([])).toEqual([]);
  });
});
