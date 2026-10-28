import type { Keyword, KeywordCluster } from '@/types';
import { tokenize } from './normalize';
import { classifySearchIntent } from './intent';

/** Stop words that shouldn't define cluster themes */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'the', 'for', 'in', 'on', 'at', 'to', 'of', 'with', 'by', 'from'
]);

/**
 * Calculates Jaccard similarity index between token sets of two keywords
 */
export function calculateJaccardSimilarity(kwA: string, kwB: string): number {
  const tokensA = new Set(tokenize(kwA).filter(t => !STOP_WORDS.has(t)));
  const tokensB = new Set(tokenize(kwB).filter(t => !STOP_WORDS.has(t)));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) intersection++;
  }

  const union = new Set([...tokensA, ...tokensB]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Suggests an optimal content type based on search intent and tokens
 */
function suggestContentType(intent: string, clusterName: string): string {
  const lower = clusterName.toLowerCase();
  if (lower.includes('template') || lower.includes('planner') || lower.includes('worksheet')) {
    return 'Digital Download / Printable Product';
  }
  if (lower.includes('how to') || lower.includes('guide') || lower.includes('tutorial')) {
    return 'Step-by-Step Tutorial / Pillar Blog Post';
  }
  if (intent === 'transactional') {
    return 'Etsy Product Listing & Multi-Pack Bundle';
  }
  if (intent === 'commercial') {
    return 'Comparison Guide & Buying Checklist';
  }
  return 'Informational Blog Article & Resource Hub';
}

/**
 * Deterministic local clustering algorithm:
 * Groups keywords based on significant token overlap (shared stems, modifiers, or Jaccard >= 0.35).
 */
export function clusterKeywordsLocally(
  keywords: Keyword[],
  userId: string = 'local-user',
  projectId: string | null = null
): KeywordCluster[] {
  if (!keywords || keywords.length === 0) return [];

  // Sort keywords by relevance score descending so the most prominent keyword is evaluated first
  const sorted = [...keywords].sort((a, b) => b.relevance_score - a.relevance_score);

  const clusters: { name: string; primary: Keyword; members: Keyword[] }[] = [];

  for (const item of sorted) {
    let matchedCluster: { name: string; primary: Keyword; members: Keyword[] } | null = null;
    let maxSim = 0;

    for (const cluster of clusters) {
      const sim = calculateJaccardSimilarity(cluster.primary.keyword, item.keyword);
      if (sim >= 0.35 && sim > maxSim) {
        maxSim = sim;
        matchedCluster = cluster;
      }
    }

    if (matchedCluster) {
      matchedCluster.members.push(item);
    } else {
      // Create new cluster centered around this primary keyword
      const tokens = tokenize(item.keyword).filter(t => !STOP_WORDS.has(t));
      const clusterTitle = tokens.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Group';

      clusters.push({
        name: clusterTitle,
        primary: item,
        members: [item]
      });
    }
  }

  // Format into final KeywordCluster objects
  return clusters.map((c, idx) => {
    const dominantIntent = classifySearchIntent(c.primary.keyword);
    return {
      id: `cluster-${Date.now()}-${idx}`,
      user_id: userId,
      project_id: projectId,
      name: c.name,
      primary_keyword: c.primary.keyword,
      search_intent: dominantIntent,
      suggested_content_type: suggestContentType(dominantIntent, c.name),
      keywords: c.members,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}
