import { describe, it, expect } from 'vitest';
import { classifySearchIntent } from '@/lib/keywords/intent';

describe('Search Intent Classifier', () => {
  it('classifies transactional queries accurately', () => {
    expect(classifySearchIntent('buy wedding invitation printable')).toBe('transactional');
    expect(classifySearchIntent('instant download digital planner')).toBe('transactional');
    expect(classifySearchIntent('cheap wall art bundle svg')).toBe('transactional');
  });

  it('classifies commercial investigation queries', () => {
    expect(classifySearchIntent('best digital planner for ipad')).toBe('commercial');
    expect(classifySearchIntent('goodnotes vs notion planner review')).toBe('commercial');
    expect(classifySearchIntent('top habit trackers 2026')).toBe('commercial');
  });

  it('classifies informational queries', () => {
    expect(classifySearchIntent('how to create digital stickers in canva')).toBe('informational');
    expect(classifySearchIntent('what is an etsy seo tag')).toBe('informational');
    expect(classifySearchIntent('tips for etsy beginners guide')).toBe('informational');
  });

  it('classifies navigational queries', () => {
    expect(classifySearchIntent('etsy seller portal login')).toBe('navigational');
    expect(classifySearchIntent('canva app account')).toBe('navigational');
  });
});
