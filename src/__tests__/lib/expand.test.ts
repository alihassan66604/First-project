import { describe, it, expect } from 'vitest';
import { expandKeywordsLocally, calculateRelevance } from '@/lib/keywords/expand';

describe('Local Keyword Expansion Engine', () => {
  it('returns an empty array when seed is blank', () => {
    expect(expandKeywordsLocally('')).toEqual([]);
    expect(expandKeywordsLocally('   ')).toEqual([]);
  });

  it('generates 20+ distinct keyword variations for a seed query', () => {
    const results = expandKeywordsLocally('digital planner');
    expect(results.length).toBeGreaterThan(20);

    const keywords = results.map(r => r.keyword);
    expect(keywords).toContain('digital planner');
    expect(keywords).toContain('best digital planner');
    expect(keywords).toContain('digital planner template');
    expect(keywords).toContain('digital planner for moms');
  });

  it('calculates relevance score with 1.0 for exact seed match', () => {
    expect(calculateRelevance('digital planner', 'digital planner')).toBe(1.0);
    expect(calculateRelevance('digital planner', 'best digital planner for students')).toBeGreaterThan(0.5);
  });
});
