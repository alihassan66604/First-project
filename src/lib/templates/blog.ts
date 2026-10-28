import type { BlogDraft, BlogOutlineSection } from '@/types';

export interface BlogInputData {
  mainKeyword: string;
  targetAudience?: string;
  relatedKeywords?: string[];
  lang?: string;
}

/**
 * Builds a comprehensive SEO-optimized blog post outline, meta tags, and FAQ suggestions
 * with multi-language support (English, Urdu, Hindi, Spanish, etc.)
 */
export function generateBlogDraft(data: BlogInputData, userId: string = 'local-user'): BlogDraft {
  const { mainKeyword, targetAudience = 'beginners', relatedKeywords = [], lang = 'en' } = data;
  const kwCap = mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1);

  const isUrdu = lang === 'ur';
  const isHindi = lang === 'hi';
  const isSpanish = lang === 'es';

  // Title variations
  let blogTitles = [
    `The Ultimate Guide to ${kwCap}: Everything You Need to Know`,
    `How to Master ${kwCap} in 2026 (Step-by-Step for ${targetAudience})`,
    `10 Essential ${kwCap} Tips and Strategies for Proven Success`,
    `${kwCap} Explained: Best Practices, Common Mistakes, and Pro Advice`,
    `Why ${kwCap} Matters (And How to Get Started Today)`
  ];

  if (isUrdu) {
    blogTitles = [
      `${kwCap}: مکمل رہنمائی اور عملی طریقے (2026)`,
      `${targetAudience} کے لیے ${kwCap} شروع کرنے کا مرحلہ وار گائیڈ`,
      `${kwCap} کے 10 اہم ترین اصول اور تجاویز`,
      `${kwCap} کیا ہے اور اس سے کیسے فائدہ اٹھائیں؟`,
    ];
  } else if (isHindi) {
    blogTitles = [
      `${kwCap}: संपूर्ण गाइड और उपयोगी टिप्स (2026)`,
      `${targetAudience} के लिए ${kwCap} शुरू करने की आसान गाइड`,
      `${kwCap} की 10 महत्वपूर्ण रणनीतियाँ और सफलता के उपाय`,
      `${kwCap} क्या है और इसके मुख्य लाभ क्या हैं?`,
    ];
  } else if (isSpanish) {
    blogTitles = [
      `La Guía Definitiva de ${kwCap}: Todo lo que Necesitas Saber`,
      `Cómo Dominar ${kwCap} en 2026 (Paso a Paso para ${targetAudience})`,
      `10 Consejos y Estrategias Esenciales de ${kwCap}`,
      `Por Qué ${kwCap} es Fundamental y Cómo Empezar Hoy`,
    ];
  }

  // Outline with H1, H2, H3
  const outline: BlogOutlineSection[] = [
    {
      heading: isUrdu ? `${kwCap} کا تعارف` : isHindi ? `${kwCap} का परिचय` : isSpanish ? `Introducción a ${kwCap}` : `Introduction to ${kwCap}`,
      level: 'h2',
      content_prompt: `Define what ${mainKeyword} is, why it is essential for ${targetAudience}, and outline the main takeaways readers will gain from this guide. Hook the reader with a relatable pain point.`,
      keywords_to_include: [mainKeyword, relatedKeywords[0] || 'guide']
    },
    {
      heading: isUrdu ? `${kwCap} کی بنیادی اہمیت` : isHindi ? `${kwCap} का महत्व` : isSpanish ? `Por Qué ${kwCap} es Crucial Hoy` : `Why ${kwCap} Is Critical Today`,
      level: 'h2',
      content_prompt: `Discuss the modern landscape, key benefits, and why ignoring ${mainKeyword} hurts growth or results. Present compelling logic or common statistics.`,
      keywords_to_include: [mainKeyword, relatedKeywords[1] || 'benefits']
    },
    {
      heading: isUrdu ? `اہم بنیادی اصول` : isHindi ? `महत्वपूर्ण बुनियादी सिद्धांत` : isSpanish ? `Principios Fundamentales` : `Core Principles You Must Understand`,
      level: 'h3',
      content_prompt: `Break down the foundational concepts. Keep explanations simple, jargon-free, and actionable.`,
      keywords_to_include: [relatedKeywords[2] || 'fundamentals']
    },
    {
      heading: isUrdu ? `مرحلہ وار گائیڈ` : isHindi ? `स्टेप-बाय-स्टेप कार्यान्वयन गाइड` : isSpanish ? `Guía Paso a Paso` : `Step-by-Step Implementation Guide`,
      level: 'h2',
      content_prompt: `Walk through concrete, numbered steps from start to finish. Include practical examples, tools, or templates where helpful.`,
      keywords_to_include: [mainKeyword, relatedKeywords[3] || 'steps']
    },
    {
      heading: isUrdu ? `عام غلطیاں جن سے بچنا چاہیے` : isHindi ? `सामान्य गलतियाँ और उनसे बचाव` : isSpanish ? `Errores Comunes a Evitar` : `Common Mistakes to Avoid`,
      level: 'h3',
      content_prompt: `Highlight the top 3-4 pitfalls beginners encounter with ${mainKeyword} and how to circumvent them easily.`,
      keywords_to_include: ['mistakes', mainKeyword]
    },
    {
      heading: isUrdu ? `اکثر پوچھے گئے سوالات (FAQ)` : isHindi ? `अक्सर पूछे जाने वाले प्रश्न` : isSpanish ? `Preguntas Frecuentes` : `Frequently Asked Questions`,
      level: 'h2',
      content_prompt: `Provide direct, concise answers to high-intent questions people search for around ${mainKeyword}.`,
      keywords_to_include: [mainKeyword]
    },
    {
      heading: isUrdu ? `نتیجہ اور اگلے اقدامات` : isHindi ? `निष्कर्ष और अगले कदम` : isSpanish ? `Conclusión y Siguientes Pasos` : `Conclusion & Next Steps`,
      level: 'h2',
      content_prompt: `Summarize the key takeaways, give an encouraging final thought, and provide a clear call to action.`,
      keywords_to_include: [mainKeyword]
    }
  ];

  // Meta Tags
  const metaTitle = `${kwCap} Guide: Best Tips & Strategies (2026)`;
  const metaDescription = `Learn everything you need to know about ${mainKeyword}. Discover proven steps, expert tips, and best practices tailored for ${targetAudience}.`;

  // FAQ suggestions
  const faqQuestions = [
    `What is ${mainKeyword} and how does it work?`,
    `How long does it take to see results with ${mainKeyword}?`,
    `Can beginners succeed with ${mainKeyword} without prior experience?`,
    `What are the most common mistakes made in ${mainKeyword}?`
  ];

  return {
    id: `blog-${Date.now()}`,
    user_id: userId,
    project_id: null,
    main_keyword: mainKeyword,
    blog_titles: blogTitles,
    selected_title: blogTitles[0],
    outline,
    meta_title: metaTitle,
    meta_description: metaDescription,
    faq_questions: faqQuestions,
    related_keywords: relatedKeywords,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
