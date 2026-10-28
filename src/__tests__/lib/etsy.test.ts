import { describe, it, expect } from 'vitest';
import { generateEtsyListing, formatEtsyTag } from '@/lib/templates/etsy';
import { ETSY_LIMITS } from '@/lib/constants';

describe('Etsy SEO Listing Generator', () => {
  it('formats tags correctly under 20 chars without special symbols', () => {
    const formatted = formatEtsyTag('Best #1 Wedding Planner (2026)!');
    expect(formatted.length).toBeLessThanOrEqual(ETSY_LIMITS.tagMaxLength);
    expect(formatted).not.toContain('#');
    expect(formatted).not.toContain('!');
    expect(formatted).not.toContain('(');
  });

  it('generates an Etsy listing with title <= 140 chars and EXACTLY 13 tags', () => {
    const draft = generateEtsyListing({
      productType: 'Printable Template',
      mainKeyword: 'budget planner',
      targetAudience: 'college students',
      productFeatures: ['Instant download', 'A4 and US Letter sizes'],
      relatedKeywords: ['finance log', 'monthly expense tracker', 'money organizer'],
    });

    expect(draft.generated_title.length).toBeLessThanOrEqual(ETSY_LIMITS.titleMaxLength);
    expect(draft.generated_tags.length).toBe(ETSY_LIMITS.tagCount); // Exactly 13 tags!

    // Ensure every tag is <= 20 characters
    for (const tag of draft.generated_tags) {
      expect(tag.length).toBeLessThanOrEqual(ETSY_LIMITS.tagMaxLength);
      expect(tag.length).toBeGreaterThan(0);
    }

    expect(draft.generated_description).toContain('budget planner'.toUpperCase());
    expect(draft.improvement_checklist.length).toBeGreaterThan(0);
  });
});
