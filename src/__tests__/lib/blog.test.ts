import { describe, it, expect } from 'vitest';
import { generateBlogDraft } from '@/lib/templates/blog';

describe('Blog SEO Toolkit Blueprint Generator', () => {
  it('generates structured outline with H1/H2/H3, meta tags, and FAQs', () => {
    const draft = generateBlogDraft({
      mainKeyword: 'etsy shop optimization',
      targetAudience: 'craft sellers',
      relatedKeywords: ['tags', 'rankings', 'etsy algorithm', 'product photos'],
    });

    expect(draft.blog_titles.length).toBeGreaterThanOrEqual(3);
    expect(draft.outline.length).toBeGreaterThanOrEqual(5);

    // Verify sections have prompt and headings
    for (const section of draft.outline) {
      expect(section.heading).toBeDefined();
      expect(['h1', 'h2', 'h3']).toContain(section.level);
      expect(section.content_prompt.length).toBeGreaterThan(10);
    }

    expect(draft.meta_title).toContain('Etsy shop optimization');
    expect(draft.meta_description.length).toBeGreaterThan(50);
    expect(draft.faq_questions.length).toBeGreaterThanOrEqual(3);
  });
});
