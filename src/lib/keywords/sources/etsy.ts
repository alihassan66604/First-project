/**
 * Etsy Autocomplete Suggestion Client
 * Queries Etsy's public search autocomplete endpoint.
 * Zero paid API keys, zero authorization required.
 */
import { normalizeKeyword, deduplicateKeywords } from '../normalize';

export interface EtsySuggestionOptions {
  query: string;
  lang?: string;
  deepSearch?: boolean;
}

/**
 * Fetches direct suggestions from Etsy's public typeahead endpoint
 */
export async function fetchEtsySuggestions(query: string, lang = 'en'): Promise<string[]> {
  const clean = query.trim();
  if (!clean) return [];

  // Primary endpoint: Etsy bespoke typeahead
  const url = `https://www.etsy.com/api/v3/public/bespoke/member/neu/specs/typeahead?term=${encodeURIComponent(clean)}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': `${lang},en;q=0.9`,
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      // Fallback endpoint: Etsy static autocomplete
      return await fetchEtsyFallback(clean);
    }

    const data = await res.json();
    const suggestions: string[] = [];

    // Extract queries from results
    if (data?.results && Array.isArray(data.results)) {
      for (const item of data.results) {
        if (item?.query && typeof item.query === 'string') {
          suggestions.push(normalizeKeyword(item.query));
        }
      }
    }

    if (suggestions.length > 0) {
      return suggestions.filter(Boolean);
    }

    return await fetchEtsyFallback(clean);
  } catch (err) {
    console.warn('[Etsy Autocomplete Warning]: Falling back to secondary typeahead endpoint', err);
    return await fetchEtsyFallback(clean);
  }
}

/**
 * Fallback to Etsy CDN autocomplete
 */
async function fetchEtsyFallback(query: string): Promise<string[]> {
  const fallbackUrl = `https://ac.etsystatic.com/autocomplete?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(fallbackUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];

    const data = await res.json();
    if (Array.isArray(data)) {
      return data
        .map((item: any) => normalizeKeyword(item?.query || item?.name || String(item)))
        .filter(Boolean);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Runs deep Etsy e-commerce suggestions using common purchase modifiers
 */
export async function getDeepEtsySuggestions(options: EtsySuggestionOptions): Promise<string[]> {
  const { query, lang = 'en', deepSearch = true } = options;
  const base = normalizeKeyword(query);
  if (!base) return [];

  const primary = await fetchEtsySuggestions(base, lang);
  const allResults = [...primary];

  if (deepSearch) {
    const commerceModifiers = [
      `${base} printable`,
      `${base} digital`,
      `${base} template`,
      `${base} gift`,
    ];

    const extraPromises = commerceModifiers.map(q => fetchEtsySuggestions(q, lang));
    const extraBatches = await Promise.allSettled(extraPromises);

    for (const batch of extraBatches) {
      if (batch.status === 'fulfilled' && Array.isArray(batch.value)) {
        allResults.push(...batch.value);
      }
    }
  }

  return deduplicateKeywords(allResults);
}
