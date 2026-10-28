import { normalizeKeyword, deduplicateKeywords } from './normalize';
import { classifySearchIntent } from './intent';
import type { Keyword, KeywordSource } from '@/types';

/** Modifier collections for local keyword expansion */
const PREFIX_MODIFIERS = [
  'best', 'how to make', 'diy', 'free', 'custom', 'simple', 'cute', 'aesthetic',
  'minimalist', 'modern', 'vintage', 'printable', 'digital', 'editable', 'personalized'
];

const SUFFIX_MODIFIERS = [
  'ideas', 'template', 'for beginners', 'printable', 'design', 'planner',
  'checklist', 'download', 'bundle', 'kit', 'for small business', 'guide',
  'worksheet', 'tracker', 'art', 'wall art', 'decor', 'gift'
];

const AUDIENCE_MODIFIERS = [
  'for moms', 'for teachers', 'for students', 'for kids', 'for men', 'for women',
  'for entrepreneurs', 'for couples', 'for weddings', 'for classrooms'
];

const QUESTION_PREFIXES = [
  'how to create', 'what is the best', 'where to find', 'how to sell'
];

/**
 * Calculates a deterministic relevance score between 0.50 and 1.00 based on seed overlap
 */
export function calculateRelevance(seed: string, variation: string): number {
  const seedTokens = new Set(seed.toLowerCase().split(' ').filter(Boolean));
  const varTokens = variation.toLowerCase().split(' ').filter(Boolean);

  if (seedTokens.size === 0 || varTokens.length === 0) return 0.5;

  let overlapCount = 0;
  for (const t of varTokens) {
    if (seedTokens.has(t)) overlapCount++;
  }

  // Exact match gets 1.0
  if (seed.toLowerCase() === variation.toLowerCase()) return 1.0;

  // Proportion of seed tokens found + length penalty factor
  const overlapRatio = overlapCount / seedTokens.size;
  const score = 0.5 + 0.5 * Math.min(1, overlapRatio);
  return Number(score.toFixed(2));
}

/**
 * Expands a seed keyword locally using deterministic combinatorial matrices.
 * Generates 25-45 high-quality long-tail suggestions suitable for Etsy sellers, bloggers, & creators.
 */
export function expandKeywordsLocally(seed: string, userId: string = 'local-user', runId: string = 'local-run'): Keyword[] {
  const normSeed = normalizeKeyword(seed);
  if (!normSeed) return [];

  const rawKeywords: string[] = [normSeed];

  // 1. Prefix expansion
  for (const prefix of PREFIX_MODIFIERS) {
    rawKeywords.push(`${prefix} ${normSeed}`);
  }

  // 2. Suffix expansion
  for (const suffix of SUFFIX_MODIFIERS) {
    rawKeywords.push(`${normSeed} ${suffix}`);
  }

  // 3. Audience expansion
  for (const audience of AUDIENCE_MODIFIERS) {
    rawKeywords.push(`${normSeed} ${audience}`);
  }

  // 4. Questions
  for (const q of QUESTION_PREFIXES) {
    rawKeywords.push(`${q} ${normSeed}`);
  }

  // 5. High-intent compound e-commerce terms
  rawKeywords.push(`editable ${normSeed} canva`);
  rawKeywords.push(`instant download ${normSeed}`);
  rawKeywords.push(`minimalist ${normSeed} printable`);

  const uniqueList = deduplicateKeywords(rawKeywords);

  return uniqueList.map((kw, index) => {
    return {
      id: `kw-${Date.now()}-${index}`,
      research_run_id: runId,
      user_id: userId,
      keyword: kw,
      source: 'local_expansion' as KeywordSource,
      search_intent: classifySearchIntent(kw),
      relevance_score: calculateRelevance(normSeed, kw),
      is_selected: false,
      collected_at: new Date().toISOString(),
    };
  });
}
