import { NextResponse } from 'next/server';
import { getDeepGoogleSuggestions } from '@/lib/keywords/sources/google';
import { getDeepEtsySuggestions } from '@/lib/keywords/sources/etsy';
import { expandKeywordsLocally, calculateRelevance } from '@/lib/keywords/expand';
import { classifySearchIntent } from '@/lib/keywords/intent';
import { normalizeKeyword, deduplicateKeywords } from '@/lib/keywords/normalize';
import type { Keyword, KeywordSource } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, source = 'google_autocomplete', lang = 'en', targetCount = 100 } = body;

    const cleanQuery = normalizeKeyword(query);
    if (!cleanQuery) {
      return NextResponse.json({ error: 'Search query is required.' }, { status: 400 });
    }

    let rawStrings: string[] = [];
    let activeSource: KeywordSource = source;

    if (source === 'google_autocomplete') {
      try {
        rawStrings = await getDeepGoogleSuggestions({
          query: cleanQuery,
          lang,
          targetCount: Math.min(Number(targetCount) || 100, 1000),
        });
      } catch (err) {
        console.warn('Google autocomplete failed, falling back to local expansion:', err);
      }
    } else if (source === 'etsy_autocomplete') {
      try {
        rawStrings = await getDeepEtsySuggestions({
          query: cleanQuery,
          lang,
        });
      } catch (err) {
        console.warn('Etsy autocomplete failed, falling back to local expansion:', err);
      }
    }

    // Graceful fallback: If external network is slow/empty, or if local_expansion was selected
    if (rawStrings.length === 0 || source === 'local_expansion') {
      const localResults = expandKeywordsLocally(cleanQuery);
      rawStrings = localResults.map(k => k.keyword);
      if (source !== 'local_expansion') {
        activeSource = source; // retain original requested source label
      }
    }

    const uniqueList = deduplicateKeywords([cleanQuery, ...rawStrings]);

    // Format into typed Keyword array
    const keywords: Keyword[] = uniqueList.map((kw, idx) => ({
      id: `sugg-${Date.now()}-${idx}`,
      research_run_id: `run-${Date.now()}`,
      user_id: 'active-user',
      keyword: kw,
      source: activeSource,
      language: lang,
      search_intent: classifySearchIntent(kw),
      relevance_score: calculateRelevance(cleanQuery, kw),
      is_selected: false,
      collected_at: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      query: cleanQuery,
      source: activeSource,
      language: lang,
      count: keywords.length,
      keywords,
    });
  } catch (error) {
    console.error('[Suggest API Error]:', error);
    return NextResponse.json({ error: 'Failed to generate keyword suggestions.' }, { status: 500 });
  }
}
