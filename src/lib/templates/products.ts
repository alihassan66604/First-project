import type { ProductIdea } from '@/types';

interface NicheTemplate {
  category: string;
  conceptPattern: (niche: string) => string;
  audiencePattern: (niche: string) => string;
  format: string;
  titlePattern: (niche: string) => string;
  keywordModifiers: string[];
}

const PRODUCT_BLUEPRINTS: NicheTemplate[] = [
  {
    category: 'Planners',
    conceptPattern: (niche) => `All-in-One Daily & Weekly ${niche} Growth Planner`,
    audiencePattern: (niche) => `Busy individuals and enthusiasts organizing their ${niche} routine`,
    format: 'Printable PDF (A4, A5, US Letter) & GoodNotes Digital Interactive PDF',
    titlePattern: (niche) => `Editable ${niche} Planner | Daily Weekly Monthly Routine Tracker Printable`,
    keywordModifiers: ['daily planner', 'weekly routine', 'undated planner', 'printable insert']
  },
  {
    category: 'Templates',
    conceptPattern: (niche) => `Canva Editable Social Media & Marketing Kit for ${niche}`,
    audiencePattern: (niche) => `Small business owners, influencers, and creators in the ${niche} space`,
    format: 'Editable Canva Template Link with 30+ Cohesive Layouts',
    titlePattern: (niche) => `30 Modern ${niche} Instagram Templates | Canva Editable Social Media Bundle`,
    keywordModifiers: ['canva template', 'social media kit', 'instagram post', 'branding kit']
  },
  {
    category: 'Invitations',
    conceptPattern: (niche) => `Elegant & Minimalist ${niche} Event Invitation Card`,
    audiencePattern: (niche) => `Event hosts, party planners, and families celebrating a ${niche} milestone`,
    format: '5x7 inch Editable Canva Template + 1080x1920 Electronic Text Invite',
    titlePattern: (niche) => `Minimalist ${niche} Invitation Template | Digital Electronic & Printable Invite`,
    keywordModifiers: ['event invite', 'custom invitation', 'electronic invite', 'printable card']
  },
  {
    category: 'Wall Art',
    conceptPattern: (niche) => `Modern Botanical & Line Art Typography Prints for ${niche}`,
    audiencePattern: (niche) => `Home decorators, studio owners, and gift buyers interested in ${niche}`,
    format: 'High-Resolution 300 DPI JPEGs in 5 Scalable Aspect Ratio Files',
    titlePattern: (niche) => `${niche} Wall Art Print | Minimalist Typography Digital Poster Printable`,
    keywordModifiers: ['wall art printable', 'gallery wall print', 'modern poster', 'digital decor']
  },
  {
    category: 'Trackers',
    conceptPattern: (niche) => `Progress & Goal Habit Tracker Sheet for ${niche}`,
    audiencePattern: (niche) => `Goal-oriented individuals tracking ${niche} milestones and habits`,
    format: 'Interactive Google Sheets / Microsoft Excel Sheet + Printable PDF',
    titlePattern: (niche) => `${niche} Progress Tracker | Automated Habit Log & Milestone Chart`,
    keywordModifiers: ['progress tracker', 'habit log', 'spreadsheet tracker', 'milestone sheet']
  },
  {
    category: 'Checklists',
    conceptPattern: (niche) => `Ultimate Step-by-Step Preparation & Audit Checklist for ${niche}`,
    audiencePattern: (niche) => `Beginners navigating their first ${niche} project with confidence`,
    format: 'One-Page Quick Reference PDF + Fillable Digital Checklist',
    titlePattern: (niche) => `Essential ${niche} Checklist | Step by Step Preparation Guide Printable`,
    keywordModifiers: ['preparation checklist', 'audit sheet', 'quick reference guide', 'cheat sheet']
  },
  {
    category: 'Printable Worksheets',
    conceptPattern: (niche) => `Guided Reflection & Skill-Building Worksheet Workbook for ${niche}`,
    audiencePattern: (niche) => `Students, educators, and coaching clients focusing on ${niche}`,
    format: 'Multi-page Printable Workbook (US Letter / A4)',
    titlePattern: (niche) => `${niche} Workbook & Activity Sheets | Educational Guided Worksheets`,
    keywordModifiers: ['activity worksheet', 'guided workbook', 'printable exercise', 'coaching tools']
  },
  {
    category: 'Business Templates',
    conceptPattern: (niche) => `Client Onboarding & Invoice Form Pack for ${niche} Services`,
    audiencePattern: (niche) => `Freelancers, service providers, and agencies specializing in ${niche}`,
    format: 'Customizable Google Docs / Microsoft Word / Canva Document',
    titlePattern: (niche) => `Professional ${niche} Contract & Invoice Template Bundle | Client Agreement`,
    keywordModifiers: ['invoice template', 'service agreement', 'client onboarding', 'business forms']
  }
];

/**
 * Generates rule-based product ideas across all major digital product categories for any seed niche
 */
export function generateProductIdeas(nicheInput: string, userId: string = 'local-user'): ProductIdea[] {
  const niche = nicheInput.trim() || 'Creative Hobby';
  const nicheCap = niche.charAt(0).toUpperCase() + niche.slice(1);

  return PRODUCT_BLUEPRINTS.map((bp, index) => {
    return {
      id: `idea-${Date.now()}-${index}`,
      user_id: userId,
      project_id: null,
      niche: nicheCap,
      category: bp.category,
      product_concept: bp.conceptPattern(nicheCap),
      target_audience: bp.audiencePattern(nicheCap),
      related_keywords: bp.keywordModifiers.map(k => `${nicheCap.toLowerCase()} ${k}`),
      suggested_format: bp.format,
      possible_listing_title: bp.titlePattern(nicheCap),
      created_at: new Date().toISOString(),
    };
  });
}
