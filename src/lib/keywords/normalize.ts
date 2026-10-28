/**
 * Keyword normalization and sanitization utilities
 */

/**
 * Normalizes a keyword string:
 * - Trims leading/trailing whitespace
 * - Converts to lowercase
 * - Strips special punctuation (keeps alphanumeric, dashes, and single spaces)
 * - Collapses consecutive spaces
 */
export function normalizeKeyword(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
    .replace(/\s+/g, ' ');
}

/**
 * Tokenizes a keyword into individual words, removing common non-informative noise words
 */
export function tokenize(keyword: string): string[] {
  const normalized = normalizeKeyword(keyword);
  if (!normalized) return [];
  return normalized.split(' ').filter(token => token.length > 0);
}

/**
 * Removes duplicate keywords case-insensitively, preserving order of first appearance
 */
export function deduplicateKeywords(keywords: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of keywords) {
    const norm = normalizeKeyword(item);
    if (norm && !seen.has(norm)) {
      seen.add(norm);
      result.push(norm);
    }
  }

  return result;
}
