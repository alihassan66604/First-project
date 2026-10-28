import { describe, it, expect } from 'vitest';
import { auditContent } from '@/lib/seo/checker';

describe('SEO Content Audit Checker', () => {
  it('returns 0 score and warning when target keyword is missing', () => {
    const audit = auditContent({
      title: 'Sample title',
      metaDescription: 'Sample desc',
      contentText: 'Some sample text here',
      targetKeyword: '',
    });

    expect(audit.overall_score).toBe(0);
    expect(audit.checks[0].status).toBe('fail');
  });

  it('audits content accurately for title, description, and density', () => {
    const audit = auditContent({
      title: 'Digital Planner Template for Beginners 2026',
      metaDescription: 'Learn how our digital planner template helps you organize daily and weekly routines with ease and focus.',
      contentText: `# Digital Planner Template
Using a digital planner template gives you freedom and clarity. This digital planner template is designed for everyday efficiency.

## How to use the template
Download the files and import them directly.`,
      targetKeyword: 'digital planner template',
    });

    expect(audit.overall_score).toBeGreaterThan(60);
    expect(audit.checks.length).toBeGreaterThanOrEqual(5);

    const titleCheck = audit.checks.find(c => c.name === 'Target Keyword in Title');
    expect(titleCheck?.status).toBe('pass');
  });
});
