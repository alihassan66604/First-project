import { ETSY_LIMITS } from '../constants';
import type { EtsyListingDraft } from '@/types';

export interface EtsyInputData {
  productType: string;
  mainKeyword: string;
  targetAudience: string;
  productFeatures: string[];
  relatedKeywords: string[];
  existingListingText?: string;
  lang?: string;
}

/**
 * Sanitizes tag string to fit Etsy limits (maximum 20 characters, lowercase, no punctuation)
 * Supports international Unicode letters (Spanish, Hindi, Urdu, etc.)
 */
export function formatEtsyTag(tag: string): string {
  const cleaned = tag.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim();
  return cleaned.slice(0, ETSY_LIMITS.tagMaxLength);
}

/**
 * Generates exactly 13 Etsy tags from main keyword, features, and related terms
 */
export function generateEtsyTags(mainKeyword: string, productType: string, audience: string, related: string[]): string[] {
  const tagPool: string[] = [];

  tagPool.push(formatEtsyTag(mainKeyword));
  tagPool.push(formatEtsyTag(productType));
  tagPool.push(formatEtsyTag(`${mainKeyword} gift`));
  tagPool.push(formatEtsyTag(`${productType} printable`));
  tagPool.push(formatEtsyTag(`gift for ${audience}`.slice(0, ETSY_LIMITS.tagMaxLength)));
  tagPool.push(formatEtsyTag('digital download'));
  tagPool.push(formatEtsyTag('instant download'));
  tagPool.push(formatEtsyTag('printable template'));

  for (const rel of related) {
    if (rel) {
      tagPool.push(formatEtsyTag(rel));
    }
  }

  // Deduplicate and filter out empty strings
  const uniqueTags = Array.from(new Set(tagPool.filter(t => t.length > 2)));

  // Fallback generic high-converting tags if needed to guarantee exactly 13
  const fallbacks = [
    'diy template',
    'editable template',
    'modern printable',
    'custom keepsake',
    'minimalist art',
    'planner insert',
    'stationery gift',
    'easy print'
  ];

  for (const fb of fallbacks) {
    if (uniqueTags.length >= ETSY_LIMITS.tagCount) break;
    if (!uniqueTags.includes(fb)) {
      uniqueTags.push(fb);
    }
  }

  return uniqueTags.slice(0, ETSY_LIMITS.tagCount);
}

/**
 * Builds an Etsy listing draft deterministically
 */
export function generateEtsyListing(data: EtsyInputData, userId: string = 'local-user'): EtsyListingDraft {
  const { productType, mainKeyword, targetAudience, productFeatures, relatedKeywords, lang = 'en' } = data;

  const isUrdu = lang === 'ur';
  const isHindi = lang === 'hi';
  const isSpanish = lang === 'es';

  // Title generation <= 140 chars
  let titlePart1 = `${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)} ${productType}`;
  let titlePart2 = isUrdu 
    ? `${targetAudience} کے لیے ایڈٹ ایبل ٹیمپلیٹ`
    : isHindi
    ? `${targetAudience} के लिए एडिटेबल टेम्पलेट`
    : isSpanish
    ? `Plantilla Imprimible para ${targetAudience}`
    : `Editable Printable Template for ${targetAudience}`;
  let titlePart3 = isUrdu ? 'فوری ڈیجیٹل ڈاؤنلوڈ' : isHindi ? 'तुरंत डिजिटल डाउनलोड' : isSpanish ? 'Descarga Digital Instantánea' : 'Instant Digital Download';
  
  let generatedTitle = `${titlePart1} | ${titlePart2} | ${titlePart3}`;
  if (generatedTitle.length > ETSY_LIMITS.titleMaxLength) {
    generatedTitle = `${titlePart1} - ${titlePart2}`.slice(0, ETSY_LIMITS.titleMaxLength);
  }

  // Exactly 13 tags
  const tags = generateEtsyTags(mainKeyword, productType, targetAudience, relatedKeywords);

  // Description generation
  const featuresList = productFeatures.length > 0 
    ? productFeatures.map(f => `  • ${f}`).join('\n')
    : '  • High-resolution printable PDF / PNG files\n  • Fully customizable & editable in minutes\n  • Instant download access after purchase';

  const whatYouReceiveText = isUrdu ? 'آپ کو کیا ملے گا:' : isHindi ? 'आपको क्या मिलेगा:' : isSpanish ? 'QUÉ RECIBIRÁS:' : 'WHAT YOU RECEIVE:';
  const howItWorksText = isUrdu ? 'استعمال کا طریقہ:' : isHindi ? 'यह कैसे काम करता है:' : isSpanish ? 'CÓMO FUNCIONA:' : 'HOW IT WORKS:';
  const noticeText = isUrdu ? 'یہ ایک ڈیجیٹل پراڈکٹ ہے، کوئی فزیکل آئٹم نہیں بھیجا جائے گا۔' : isHindi ? 'यह एक डिजिटल उत्पाद है। कोई भी भौतिक वस्तु नहीं भेजी जाएगी।' : isSpanish ? 'Este es un producto digital instantáneo. No se enviará ningún artículo físico.' : 'This is an instant digital product. No physical item will be shipped.';

  const generatedDescription = `✨ **${mainKeyword.toUpperCase()} ${productType.toUpperCase()}** ✨
${targetAudience}

---
⭐ **${whatYouReceiveText}**
${featuresList}

---
📥 **${howItWorksText}**
1. Purchase & instant access.
2. Download your files directly.
3. Print or customize at home!

---
💡 **NOTICE:**
${noticeText}

Keywords: ${mainKeyword}, ${relatedKeywords.slice(0, 4).join(', ')}`;

  // Placement tips
  const keywordPlacementTips = [
    'Place your exact primary keyword within the first 30 characters of your title for maximum Etsy search visibility.',
    'Match your primary keyword into at least one of your 13 tags verbatim.',
    'Include the primary keyword naturally in the first 160 characters of the product description.',
    'Use multi-word tags (long-tail keywords) rather than single generic words.',
    'Ensure all 13 tag slots are utilized.'
  ];

  // Improvement checklist
  const improvementChecklist = [
    { label: 'Title is within 140 characters and front-loaded with primary keyword', checked: true },
    { label: 'All 13 tags are filled without punctuation symbols', checked: tags.length === 13 },
    { label: 'Primary keyword is included in the first sentence of description', checked: true },
    { label: 'High-quality listing mockups showing size, format, and lifestyle context prepared', checked: false },
    { label: 'Attributes and category properly matched in Etsy Shop Manager', checked: false },
  ];

  return {
    id: `etsy-${Date.now()}`,
    user_id: userId,
    project_id: null,
    product_type: productType,
    main_keyword: mainKeyword,
    target_audience: targetAudience,
    product_features: productFeatures,
    related_keywords: relatedKeywords,
    existing_listing_text: data.existingListingText || null,
    generated_title: generatedTitle,
    generated_tags: tags,
    generated_description: generatedDescription,
    primary_keyword: mainKeyword,
    secondary_keywords: relatedKeywords.slice(0, 5),
    keyword_placement_tips: keywordPlacementTips,
    improvement_checklist: improvementChecklist,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
