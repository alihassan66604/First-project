/**
 * Google Autocomplete Suggestion Client
 * Uses Google's public JSON completion endpoint.
 * Zero paid API keys, zero authentication required.
 * Supports international languages via the `hl` parameter (e.g. 'en', 'ur', 'hi', 'es', etc.)
 * Capable of scaling from 50 up to 1,000 long-tail keywords via multi-query expansion.
 */
import { normalizeKeyword, deduplicateKeywords } from '../normalize';

export interface SuggestionOptions {
  query: string;
  lang?: string; // e.g. 'en', 'ur', 'hi', 'es', 'fr', 'de', 'ar'
  targetCount?: number; // 50, 100, 250, 500, 1000
  deepSearch?: boolean;
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const NUMBERS = '0123456789'.split('');

const MODIFIERS_BY_LANG: Record<string, string[]> = {
  en: [
    'best', 'how to', 'free', 'online', 'pdf', 'template', 'printable', 'ideas',
    'download', 'examples', 'guide', 'review', 'tutorial', 'for beginners',
    'alternatives', 'tips', 'checklist', 'tools', 'diy', 'near me', 'cost', 'buy'
  ],
  ur: [
    'بہترین', 'طریقہ', 'مفت', 'ڈاؤنلوڈ', 'ڈیزائن', 'آن لائن', 'آئیڈیاز', 'فائدے',
    'کیسے کریں', 'پی ڈی ایف', 'رہنمائی', 'کورس'
  ],
  hi: [
    'बेस्ट', 'तरीका', 'फ्री', 'डाउनलोड', 'डिजाइन', 'ऑनलाइन', 'आइडियाज', 'फायदे',
    'कैसे बनाएं', 'पीडीएफ', 'गाइड', 'कोर्स'
  ],
  es: [
    'mejor', 'como hacer', 'gratis', 'online', 'pdf', 'plantilla', 'imprimible',
    'ideas', 'descargar', 'ejemplos', 'guia', 'tutorial', 'para principiantes'
  ],
  fr: [
    'meilleur', 'comment faire', 'gratuit', 'en ligne', 'pdf', 'modele', 'a imprimer',
    'idees', 'telecharger', 'exemples', 'guide', 'tutoriel', 'pour debutant'
  ],
  de: [
    'beste', 'wie macht man', 'kostenlos', 'online', 'pdf', 'vorlage', 'zum ausdrucken',
    'ideen', 'herunterladen', 'beispiele', 'anleitung', 'tipps', 'fur anfanger'
  ],
  ar: [
    'افضل', 'كيفية', 'مجانا', 'تحميل', 'تصميم', 'اون لاين', 'افكار', 'فوائد',
    'طريقة عمل', 'بي دي اف', 'دليل', 'شرح'
  ],
};

/**
 * Fetches direct suggestions from Google completion endpoint
 */
export async function fetchGoogleSuggestions(query: string, lang = 'en'): Promise<string[]> {
  const clean = query.trim();
  if (!clean) return [];

  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(clean)}&hl=${encodeURIComponent(lang)}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
      },
      next: { revalidate: 3600 } // cache for 1 hour
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[1])) {
      return (data[1] as string[]).map(s => normalizeKeyword(s)).filter(Boolean);
    }
    return [];
  } catch (err) {
    console.error('[Google Autocomplete Error]:', err);
    return [];
  }
}

/**
 * Helper to execute an array of queries in parallel batches
 */
async function runQueryBatches(queries: string[], lang: string, batchSize = 10): Promise<string[]> {
  const allResults: string[] = [];

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const promises = batch.map(q => fetchGoogleSuggestions(q, lang));
    const settled = await Promise.allSettled(promises);

    for (const res of settled) {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        allResults.push(...res.value);
      }
    }
  }

  return allResults;
}

/**
 * Runs deep Google multi-query expansion capable of scaling up to 1,000 keywords
 */
export async function getDeepGoogleSuggestions(options: SuggestionOptions): Promise<string[]> {
  const { query, lang = 'en', targetCount = 100, deepSearch = true } = options;
  const base = normalizeKeyword(query);
  if (!base) return [];

  const collected = new Set<string>();
  collected.add(base);

  // 1. Direct query
  const primary = await fetchGoogleSuggestions(base, lang);
  primary.forEach(kw => collected.add(kw));

  if (!deepSearch && targetCount <= 20) {
    return Array.from(collected);
  }

  // 2. Language-specific common modifiers
  const langMods = MODIFIERS_BY_LANG[lang] || MODIFIERS_BY_LANG.en;
  const modifierQueries = langMods.map(mod => `${base} ${mod}`);
  const modResults = await runQueryBatches(modifierQueries.slice(0, 15), lang, 8);
  modResults.forEach(kw => collected.add(kw));

  // If user only wanted ~50 keywords, return now
  if (collected.size >= targetCount && targetCount <= 50) {
    return Array.from(collected).slice(0, targetCount);
  }

  // 3. A-Z alphabetic suffix queries: "query a", "query b", ..., "query z"
  const suffixQueries = ALPHABET.map(char => `${base} ${char}`);
  const suffixResults = await runQueryBatches(suffixQueries, lang, 8);
  suffixResults.forEach(kw => collected.add(kw));

  if (collected.size >= targetCount && targetCount <= 150) {
    return Array.from(collected).slice(0, targetCount);
  }

  // 4. A-Z alphabetic prefix queries: "a query", "b query", ..., "z query"
  const prefixQueries = ALPHABET.map(char => `${char} ${base}`);
  const prefixResults = await runQueryBatches(prefixQueries, lang, 8);
  prefixResults.forEach(kw => collected.add(kw));

  // 5. Numeric queries: "query 0" to "query 9"
  const numQueries = NUMBERS.map(num => `${base} ${num}`);
  const numResults = await runQueryBatches(numQueries, lang, 8);
  numResults.forEach(kw => collected.add(kw));

  // 6. Secondary branching: take top unique discoveries and query their suffixes if target is high (500 to 1000)
  if (targetCount > 250 && collected.size < targetCount) {
    const seedBranches = Array.from(collected)
      .filter(k => k !== base && k.split(' ').length <= 4)
      .slice(0, 20);

    const branchQueries: string[] = [];
    for (const b of seedBranches) {
      branchQueries.push(`${b} free`, `${b} printable`, `${b} ideas`, `${b} guide`);
    }
    const branchResults = await runQueryBatches(branchQueries, lang, 10);
    branchResults.forEach(kw => collected.add(kw));
  }

  // 7. Combinatorial Long-Tail Synthesis to reliably reach up to targetCount (up to 1,000 keywords)
  if (collected.size < targetCount) {
    const gatheredList = Array.from(collected);
    const subWords = Array.from(new Set(gatheredList.flatMap(k => k.split(' '))))
      .filter(w => w.length > 2 && w !== base);

    // Intent combinations
    const intents = ['best', 'top', 'how to make', 'simple', 'pro', 'modern', 'minimalist', 'free', 'printable', 'diy', 'template', 'guide', 'ideas', 'tutorial', '2026'];
    const qualifiers = ['for beginners', 'step by step', 'online free', 'for students', 'for business', 'pdf download', 'printable sheet', 'instant download', 'bundle pack'];

    for (const kw of gatheredList) {
      if (collected.size >= targetCount) break;
      for (const qual of qualifiers) {
        if (collected.size >= targetCount) break;
        if (!kw.includes(qual)) {
          collected.add(`${kw} ${qual}`);
        }
      }
    }

    for (const intent of intents) {
      if (collected.size >= targetCount) break;
      for (const word of subWords.slice(0, 30)) {
        if (collected.size >= targetCount) break;
        collected.add(`${intent} ${base} ${word}`);
        collected.add(`${base} ${word} ${intent}`);
      }
    }
  }

  const finalList = deduplicateKeywords(Array.from(collected));
  return finalList.slice(0, targetCount);
}
