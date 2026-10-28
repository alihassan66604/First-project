import { describe, it, expect } from 'vitest';
import { normalizeKeyword, tokenize, deduplicateKeywords } from '@/lib/keywords/normalize';

describe('Keyword Normalization Utilities', () => {
  it('converts keywords to lowercase and removes excessive whitespace', () => {
    expect(normalizeKeyword('   Digital   PLANNER  Template  ')).toBe('digital planner template');
  });

  it('strips special punctuation while preserving dashes and words', () => {
    expect(normalizeKeyword('Best planner! (2026) #printable $10?')).toBe('best planner 2026 printable 10');
  });

  it('handles empty and null-ish strings gracefully', () => {
    expect(normalizeKeyword('')).toBe('');
    expect(normalizeKeyword('    ')).toBe('');
  });

  it('tokenizes keywords into clean word arrays', () => {
    expect(tokenize('habit tracker printable pdf')).toEqual(['habit', 'tracker', 'printable', 'pdf']);
    expect(tokenize('')).toEqual([]);
  });

  it('preserves international Unicode characters in Urdu, Hindi, Spanish, and Arabic', () => {
    expect(normalizeKeyword('شادی کارڈ! 2026?')).toBe('شادی کارڈ 2026');
    expect(normalizeKeyword('शादी कार्ड #1')).toBe('शादी कार्ड 1');
    expect(normalizeKeyword('diseño gráfico!')).toBe('diseño gráfico');
  });

  it('deduplicates keywords case-insensitively while preserving order', () => {
    const list = ['daily planner', 'Daily Planner', 'DAILY PLANNER', 'habit tracker', 'daily planner'];
    expect(deduplicateKeywords(list)).toEqual(['daily planner', 'habit tracker']);
  });
});
