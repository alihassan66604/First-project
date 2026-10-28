'use client';

import { useState } from 'react';
import { generateBlogDraft } from '@/lib/templates/blog';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, Badge } from '@/components/ui';
import type { BlogDraft } from '@/types';

export default function BlogToolPage() {
  const [mainKeyword, setMainKeyword] = useState('etsy seo for digital products');
  const [targetAudience, setTargetAudience] = useState('digital shop owners');
  const [selectedLang, setSelectedLang] = useState('en');
  const [relatedInput, setRelatedInput] = useState('keyword research, tags optimization, etsy ranking factors, listing titles');
  const [draft, setDraft] = useState<BlogDraft | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainKeyword.trim()) return;

    const related = relatedInput.split(/[,]+/).map(s => s.trim()).filter(Boolean);
    const result = generateBlogDraft({
      mainKeyword: mainKeyword.trim(),
      targetAudience: targetAudience.trim() || 'beginners',
      relatedKeywords: related,
      lang: selectedLang,
    });

    setDraft(result);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Blog SEO Toolkit</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Plan high-ranking content outlines, headings, meta descriptions, and FAQ sections with deterministic templates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Article Parameters</CardTitle>
              <CardDescription>Input primary target topic and audience.</CardDescription>
            </CardHeader>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Content Language
                </label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="en">English (English)</option>
                  <option value="ur">Urdu (اردو)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="ar">Arabic (العربية)</option>
                </select>
              </div>

              <Input
                label="Primary Keyword"
                placeholder="e.g. passive income digital products"
                value={mainKeyword}
                onChange={(e) => setMainKeyword(e.target.value)}
                required
              />

              <Input
                label="Target Reader"
                placeholder="e.g. beginner creators, Etsy sellers"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />

              <Input
                label="Secondary Keywords (comma separated)"
                placeholder="e.g. canva, profit, marketing"
                value={relatedInput}
                onChange={(e) => setRelatedInput(e.target.value)}
              />

              <Button type="submit" variant="primary" fullWidth>
                Generate Blog Blueprint
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-8 space-y-6">
          {draft ? (
            <div className="space-y-6">
              {/* Title Suggestions */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    Suggested Article Titles (Click to Copy)
                  </h3>
                </div>
                <div className="space-y-2">
                  {draft.blog_titles.map((title, idx) => (
                    <div
                      key={idx}
                      onClick={() => copyToClipboard(title, `title-${idx}`)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium hover:border-brand-500 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <span className="text-slate-800 dark:text-slate-200">{title}</span>
                      <span className="text-[11px] text-brand-600 font-normal">
                        {copiedKey === `title-${idx}` ? 'Copied!' : 'Click to copy'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Meta Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Meta Tags Preview</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Meta Title</label>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono">
                      {draft.meta_title}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Meta Description</label>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
                      {draft.meta_description}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Outline Sections (H1/H2/H3) */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    Structured Article Outline
                  </h3>
                  <Badge variant="purple">{draft.outline.length} Sections</Badge>
                </div>
                <div className="space-y-4">
                  {draft.outline.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 uppercase">
                          {sec.level}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {sec.heading}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {sec.content_prompt}
                      </p>
                      {sec.keywords_to_include.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          <span className="text-[10px] text-slate-400 mr-1">Include:</span>
                          {sec.keywords_to_include.map((kw, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* FAQ Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">High-Intent FAQ Questions</CardTitle>
                </CardHeader>
                <ul className="space-y-2">
                  {draft.faq_questions.map((faq, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-brand-600 font-bold">Q:</span>
                      <span>{faq}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ) : (
            <Card className="py-16 text-center">
              <p className="text-slate-400 text-sm">
                Enter your topic parameters on the left and click &quot;Generate Blog Blueprint&quot; to view title ideas, outlines, meta tags, and FAQ prompts.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
