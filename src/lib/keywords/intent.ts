import type { SearchIntent } from '@/types';
import { normalizeKeyword } from './normalize';

/** Intent indicator trigger words */
const NAVIGATIONAL_TRIGGERS = [
  'login', 'signin', 'portal', 'website', 'app', 'account', 'official', 
  'contact', 'customer service', 'support', 'dashboard'
];

const QUESTION_INFORMATIONAL_TRIGGERS = [
  'how to', 'what is', 'why', 'guide', 'tutorial', 'tips', 
  'ideas', 'examples', 'learn', 'steps', 'definition', 'meaning', 'difference'
];

const TRANSACTIONAL_TRIGGERS = [
  'buy', 'shop', 'order', 'purchase', 'cheap', 'discount', 'coupon', 'deal', 
  'price', 'cost', 'sale', 'download', 'printable', 'instant download', 'for sale', 
  'store', 'cart', 'svg', 'png', 'bundle', 'kit'
];

const COMMERCIAL_TRIGGERS = [
  'best', 'top', 'vs', 'versus', 'review', 'comparison', 'recommended', 
  'affordable', 'alternative', 'features', 'ratings', 'pros and cons'
];

const GENERAL_INFORMATIONAL_TRIGGERS = [
  'how', 'what', 'template', 'checklist', 'diy', 'pattern', 'inspiration'
];

/**
 * Predicts search intent using hierarchy:
 * 1. Specific account/login -> Navigational
 * 2. Clear research questions/guides -> Informational
 * 3. Commercial research / comparisons -> Commercial
 * 4. Purchase / download / price -> Transactional
 * 5. General terms -> Informational
 */
export function classifySearchIntent(keyword: string): SearchIntent {
  const normalized = normalizeKeyword(keyword);

  // 1. Navigational (login, portal, account)
  for (const trigger of NAVIGATIONAL_TRIGGERS) {
    const regex = new RegExp(`\\b${trigger}\\b`, 'i');
    if (regex.test(normalized)) {
      return 'navigational';
    }
  }

  // 2. Clear question / tutorial queries (e.g. "what is an etsy seo tag", "how to make...")
  for (const trigger of QUESTION_INFORMATIONAL_TRIGGERS) {
    const regex = new RegExp(`\\b${trigger}\\b`, 'i');
    if (regex.test(normalized)) {
      return 'informational';
    }
  }

  // 3. Commercial investigation (e.g. "best", "vs", "review")
  for (const trigger of COMMERCIAL_TRIGGERS) {
    const regex = new RegExp(`\\b${trigger}\\b`, 'i');
    if (regex.test(normalized)) {
      return 'commercial';
    }
  }

  // 4. Transactional intent (e.g. "buy", "printable", "download", "svg")
  for (const trigger of TRANSACTIONAL_TRIGGERS) {
    const regex = new RegExp(`\\b${trigger}\\b`, 'i');
    if (regex.test(normalized)) {
      return 'transactional';
    }
  }

  // 5. General Informational (e.g. "ideas", "checklist", "diy")
  for (const trigger of GENERAL_INFORMATIONAL_TRIGGERS) {
    const regex = new RegExp(`\\b${trigger}\\b`, 'i');
    if (regex.test(normalized)) {
      return 'informational';
    }
  }

  // Default fallback
  return 'informational';
}
