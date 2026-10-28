import type { SeoAudit, SeoCheck } from '@/types';
import { SEO_THRESHOLDS } from '../constants';

export interface SeoAuditInput {
  title?: string;
  metaDescription?: string;
  contentText: string;
  targetKeyword: string;
}

/**
 * Evaluates on-page content using transparent rule-based heuristics.
 */
export function auditContent(input: SeoAuditInput, userId: string = 'local-user'): SeoAudit {
  const { title = '', metaDescription = '', contentText = '', targetKeyword = '' } = input;
  const kw = targetKeyword.trim().toLowerCase();
  const checks: SeoCheck[] = [];
  const recommendations: string[] = [];

  let score = 100;

  // 1. Target keyword provided
  if (!kw) {
    return {
      id: `audit-${Date.now()}`,
      user_id: userId,
      project_id: null,
      content_text: contentText,
      target_keyword: '',
      overall_score: 0,
      checks: [{
        name: 'Target Keyword Specified',
        status: 'fail',
        message: 'No target keyword was entered for the audit.',
        details: 'Please provide a primary target keyword to check content alignment.'
      }],
      recommendations: ['Enter a target keyword to evaluate SEO relevance.'],
      created_at: new Date().toISOString()
    };
  }

  // 2. Title checks
  if (!title.trim()) {
    score -= 20;
    checks.push({
      name: 'Page Title Presence',
      status: 'fail',
      message: 'Title is missing.',
      details: 'A descriptive title tag is critical for search engine rankings and CTR.'
    });
    recommendations.push('Add an SEO-optimized title tag between 30 and 60 characters.');
  } else {
    const titleLen = title.length;
    if (titleLen < SEO_THRESHOLDS.titleMinLength || titleLen > SEO_THRESHOLDS.titleMaxLength) {
      score -= 5;
      checks.push({
        name: 'Title Length',
        status: 'warning',
        message: `Title length is ${titleLen} characters (recommended: 30-60).`,
        details: titleLen > SEO_THRESHOLDS.titleMaxLength ? 'Title may be truncated in search results.' : 'Title is too short to provide good context.'
      });
      recommendations.push(`Adjust title length to 30-60 characters (currently ${titleLen}).`);
    } else {
      checks.push({
        name: 'Title Length',
        status: 'pass',
        message: `Title is an optimal length (${titleLen} characters).`,
        details: null
      });
    }

    if (title.toLowerCase().includes(kw)) {
      checks.push({
        name: 'Target Keyword in Title',
        status: 'pass',
        message: 'Primary keyword is present in the title.',
        details: null
      });
    } else {
      score -= 10;
      checks.push({
        name: 'Target Keyword in Title',
        status: 'fail',
        message: 'Target keyword is missing from the title.',
        details: 'Include the exact primary keyword near the beginning of your title.'
      });
      recommendations.push('Include your target keyword in the title tag.');
    }
  }

  // 3. Meta Description Checks
  if (!metaDescription.trim()) {
    score -= 10;
    checks.push({
      name: 'Meta Description Presence',
      status: 'warning',
      message: 'Meta description is missing.',
      details: 'Meta descriptions improve click-through rates from search results.'
    });
    recommendations.push('Write a meta description between 120 and 160 characters.');
  } else {
    const descLen = metaDescription.length;
    if (descLen < SEO_THRESHOLDS.descriptionMinLength || descLen > SEO_THRESHOLDS.descriptionMaxLength) {
      score -= 5;
      checks.push({
        name: 'Meta Description Length',
        status: 'warning',
        message: `Description is ${descLen} characters (recommended: 120-160).`,
        details: 'Aim for 120-160 characters so it fits neatly without being cut off.'
      });
    } else {
      checks.push({
        name: 'Meta Description Length',
        status: 'pass',
        message: `Description length is optimal (${descLen} characters).`,
        details: null
      });
    }

    if (metaDescription.toLowerCase().includes(kw)) {
      checks.push({
        name: 'Target Keyword in Meta Description',
        status: 'pass',
        message: 'Keyword appears in the meta description.',
        details: null
      });
    } else {
      score -= 5;
      checks.push({
        name: 'Target Keyword in Meta Description',
        status: 'warning',
        message: 'Keyword not found in meta description.',
        details: 'Search engines highlight matching terms in search snippets.'
      });
      recommendations.push('Incorporate your target keyword naturally into the meta description.');
    }
  }

  // 4. Content Body Checks
  const words = contentText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 100) {
    score -= 20;
    checks.push({
      name: 'Content Length',
      status: 'fail',
      message: `Content is very thin (${wordCount} words).`,
      details: 'Search engines favor comprehensive content answering search queries thoroughly.'
    });
    recommendations.push('Expand content to at least 300-500 words for better depth.');
  } else if (wordCount < SEO_THRESHOLDS.minWordCount) {
    score -= 10;
    checks.push({
      name: 'Content Length',
      status: 'warning',
      message: `Content length is ${wordCount} words (minimum recommended: ${SEO_THRESHOLDS.minWordCount}).`,
      details: 'Consider adding more actionable details or FAQs to expand coverage.'
    });
    recommendations.push(`Increase content body to at least ${SEO_THRESHOLDS.minWordCount} words.`);
  } else {
    checks.push({
      name: 'Content Length',
      status: 'pass',
      message: `Sufficient content length (${wordCount} words).`,
      details: null
    });
  }

  // 5. Keyword Density & First Paragraph Occurrence
  if (wordCount > 0) {
    const textLower = contentText.toLowerCase();
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const matches = textLower.match(regex);
    const count = matches ? matches.length : 0;
    const density = Number(((count / wordCount) * 100).toFixed(2));

    if (count === 0) {
      score -= 15;
      checks.push({
        name: 'Keyword Body Presence',
        status: 'fail',
        message: 'Target keyword does not appear in the body text.',
        details: 'Your primary keyword must be present in the content body.'
      });
      recommendations.push('Add your primary keyword into the introductory and body paragraphs.');
    } else if (density > SEO_THRESHOLDS.maxKeywordDensity) {
      score -= 10;
      checks.push({
        name: 'Keyword Density',
        status: 'warning',
        message: `Keyword density is high (${density}%, ${count} occurrences).`,
        details: 'Avoid keyword stuffing. Target between 0.5% and 2.5%.'
      });
      recommendations.push('Reduce keyword repetitions to keep language natural and reader-friendly.');
    } else if (density < SEO_THRESHOLDS.minKeywordDensity) {
      score -= 5;
      checks.push({
        name: 'Keyword Density',
        status: 'warning',
        message: `Keyword density is low (${density}%, ${count} occurrence).`,
        details: 'Mention the keyword a few more times where relevant.'
      });
      recommendations.push('Consider using the keyword in 1-2 additional sections or subheadings.');
    } else {
      checks.push({
        name: 'Keyword Density',
        status: 'pass',
        message: `Balanced keyword density (${density}%, ${count} mentions).`,
        details: null
      });
    }

    // First paragraph check (first 250 characters)
    const firstSnippet = textLower.slice(0, 250);
    if (firstSnippet.includes(kw)) {
      checks.push({
        name: 'Early Keyword Placement',
        status: 'pass',
        message: 'Keyword appears in the first 250 characters.',
        details: null
      });
    } else {
      score -= 5;
      checks.push({
        name: 'Early Keyword Placement',
        status: 'warning',
        message: 'Keyword does not appear early in the text.',
        details: 'Search engines and readers benefit from immediate context in the opening lines.'
      });
      recommendations.push('Introduce the keyword in your very first paragraph.');
    }
  }

  // 6. Heading structure checks (check for markdown headings or tags)
  const hasHeadings = /#+\s+|<h2>|<h3>|<h1>/i.test(contentText);
  if (hasHeadings) {
    checks.push({
      name: 'Subheading Organization',
      status: 'pass',
      message: 'Content contains structured subheadings.',
      details: null
    });
  } else {
    score -= 10;
    checks.push({
      name: 'Subheading Organization',
      status: 'warning',
      message: 'No clear subheadings detected.',
      details: 'Break content into distinct sections using H2 and H3 headings.'
    });
    recommendations.push('Organize content with clear section headers (H2 and H3 tags).');
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    id: `audit-${Date.now()}`,
    user_id: userId,
    project_id: null,
    content_text: contentText,
    target_keyword: targetKeyword,
    overall_score: finalScore,
    checks,
    recommendations,
    created_at: new Date().toISOString()
  };
}
