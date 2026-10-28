import { expandKeywordsLocally } from '../keywords/expand';
import { clusterKeywordsLocally } from '../keywords/cluster';
import { generateEtsyListing } from '../templates/etsy';
import { generateBlogDraft } from '../templates/blog';
import { auditContent } from '../seo/checker';
import { generateProductIdeas } from '../templates/products';
import { exportKeywordsToCsv } from '../export/csv';
import type { Keyword, KeywordCluster, EtsyListingDraft, BlogDraft, SeoAudit, ProductIdea } from '@/types';

export interface AssistantExecutionResult {
  command: string;
  success: boolean;
  message: string;
  data?: {
    type: 'keywords' | 'clusters' | 'etsy' | 'blog' | 'audit' | 'ideas' | 'csv' | 'help';
    payload: Keyword[] | KeywordCluster[] | EtsyListingDraft | BlogDraft | SeoAudit | ProductIdea[] | string | { commands: { command: string; desc: string }[] };
  };
}

/**
 * Parses and executes assistant commands locally with zero external API dependencies.
 */
export function executeAssistantCommand(input: string, contextKeywords: Keyword[] = []): AssistantExecutionResult {
  const clean = input.trim();
  const lower = clean.toLowerCase();

  // 1. HELP COMMAND
  if (lower === 'help' || lower === '?') {
    return {
      command: clean,
      success: true,
      message: 'Here are the supported SEO Assistant commands:',
      data: {
        type: 'help',
        payload: {
          commands: [
            { command: 'research <seed keyword>', desc: 'Find 30+ long-tail keyword ideas locally' },
            { command: 'cluster', desc: 'Group current keywords into semantic clusters' },
            { command: 'etsy <keyword>', desc: 'Draft an optimized Etsy listing (title, 13 tags, description)' },
            { command: 'blog <keyword>', desc: 'Generate an SEO blog post outline and meta tags' },
            { command: 'ideas <niche>', desc: 'Brainstorm 8 digital product ideas for this niche' },
            { command: 'audit <text> --kw=<keyword>', desc: 'Evaluate content SEO quality and density' },
            { command: 'export csv', desc: 'Generate an RFC 4180 CSV export of active keywords' },
          ]
        }
      }
    };
  }

  // 2. RESEARCH COMMAND
  if (lower.startsWith('research ') || lower.startsWith('find ')) {
    const seed = clean.replace(/^(research|find)\s+/i, '').trim();
    if (!seed) {
      return {
        command: clean,
        success: false,
        message: 'Please provide a seed keyword. Example: "research digital planner"'
      };
    }
    const keywords = expandKeywordsLocally(seed);
    return {
      command: clean,
      success: true,
      message: `Generated ${keywords.length} keyword ideas locally for "${seed}".`,
      data: {
        type: 'keywords',
        payload: keywords
      }
    };
  }

  // 3. CLUSTER COMMAND
  if (lower.startsWith('cluster') || lower.startsWith('group')) {
    if (!contextKeywords || contextKeywords.length === 0) {
      return {
        command: clean,
        success: false,
        message: 'No keywords available in context to cluster. Run a keyword research first or provide keywords.'
      };
    }
    const clusters = clusterKeywordsLocally(contextKeywords);
    return {
      command: clean,
      success: true,
      message: `Grouped ${contextKeywords.length} keywords into ${clusters.length} semantic clusters.`,
      data: {
        type: 'clusters',
        payload: clusters
      }
    };
  }

  // 4. ETSY COMMAND
  if (lower.startsWith('etsy ') || lower.startsWith('listing ')) {
    const keyword = clean.replace(/^(etsy|listing)\s+/i, '').trim();
    if (!keyword) {
      return {
        command: clean,
        success: false,
        message: 'Please specify the main keyword. Example: "etsy budget planner"'
      };
    }
    const draft = generateEtsyListing({
      productType: 'Printable Template',
      mainKeyword: keyword,
      targetAudience: 'Planners and Organizers',
      productFeatures: [
        'Instant digital PDF download',
        'Easy to print at home or local print shop',
        'Fully customizable layout'
      ],
      relatedKeywords: contextKeywords.slice(0, 5).map(k => k.keyword)
    });
    return {
      command: clean,
      success: true,
      message: `Generated Etsy listing draft with exactly ${draft.generated_tags.length} tags.`,
      data: {
        type: 'etsy',
        payload: draft
      }
    };
  }

  // 5. BLOG COMMAND
  if (lower.startsWith('blog ') || lower.startsWith('outline ')) {
    const keyword = clean.replace(/^(blog|outline)\s+/i, '').trim();
    if (!keyword) {
      return {
        command: clean,
        success: false,
        message: 'Please specify a topic or keyword. Example: "blog etsy seo tips"'
      };
    }
    const draft = generateBlogDraft({
      mainKeyword: keyword,
      targetAudience: 'beginners',
      relatedKeywords: contextKeywords.slice(0, 4).map(k => k.keyword)
    });
    return {
      command: clean,
      success: true,
      message: `Generated SEO blog structure with ${draft.outline.length} detailed sections.`,
      data: {
        type: 'blog',
        payload: draft
      }
    };
  }

  // 6. IDEAS COMMAND
  if (lower.startsWith('ideas ') || lower.startsWith('products ')) {
    const niche = clean.replace(/^(ideas|products)\s+/i, '').trim();
    if (!niche) {
      return {
        command: clean,
        success: false,
        message: 'Please specify a niche. Example: "ideas real estate"'
      };
    }
    const ideas = generateProductIdeas(niche);
    return {
      command: clean,
      success: true,
      message: `Generated ${ideas.length} digital product concepts for the "${niche}" niche.`,
      data: {
        type: 'ideas',
        payload: ideas
      }
    };
  }

  // 7. EXPORT COMMAND
  if (lower.startsWith('export')) {
    if (!contextKeywords || contextKeywords.length === 0) {
      return {
        command: clean,
        success: false,
        message: 'No keywords available to export.'
      };
    }
    const csvData = exportKeywordsToCsv(contextKeywords);
    return {
      command: clean,
      success: true,
      message: `Exported ${contextKeywords.length} keywords to CSV format.`,
      data: {
        type: 'csv',
        payload: csvData
      }
    };
  }

  // 8. UNKNOWN COMMAND FALLBACK
  return {
    command: clean,
    success: false,
    message: `Unknown command "${clean}". Type "help" to view all available commands.`
  };
}
