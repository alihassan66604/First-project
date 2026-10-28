'use client';

import { useState } from 'react';
import { generateEtsyListing, formatEtsyTag } from '@/lib/templates/etsy';
import { ETSY_LIMITS } from '@/lib/constants';
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, Badge } from '@/components/ui';
import type { EtsyListingDraft } from '@/types';

export default function EtsyToolPage() {
  const [productType, setProductType] = useState('Printable Template');
  const [mainKeyword, setMainKeyword] = useState('daily planner');
  const [targetAudience, setTargetAudience] = useState('busy moms and students');
  const [selectedLang, setSelectedLang] = useState('en');
  const [featuresInput, setFeaturesInput] = useState('High resolution PDF\nInstant digital download\nA4 and US Letter sizes included\nUndated pages for endless reuse');
  const [relatedInput, setRelatedInput] = useState('daily schedule, habit tracker, routine checklist, minimalist planner');
  const [draft, setDraft] = useState<EtsyListingDraft | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainKeyword.trim() || !productType.trim()) return;

    const features = featuresInput.split('\n').map(s => s.trim()).filter(Boolean);
    const related = relatedInput.split(/[,]+/).map(s => s.trim()).filter(Boolean);

    const result = generateEtsyListing({
      productType: productType.trim(),
      mainKeyword: mainKeyword.trim(),
      targetAudience: targetAudience.trim() || 'everyone',
      productFeatures: features,
      relatedKeywords: related,
      lang: selectedLang,
    });

    setDraft(result);
  };

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Etsy SEO Toolkit</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate optimized listing titles, exactly 13 search tags, and structured descriptions tailored to Etsy&apos;s algorithm.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Listing Details</CardTitle>
              <CardDescription>Enter product attributes to generate deterministic templates.</CardDescription>
            </CardHeader>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Listing Language
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
                label="Product Type"
                placeholder="e.g. Printable Planner, Wall Art, SVG Bundle"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                required
              />

              <Input
                label="Primary Target Keyword"
                placeholder="e.g. daily planner, wedding invitation"
                value={mainKeyword}
                onChange={(e) => setMainKeyword(e.target.value)}
                required
              />

              <Input
                label="Target Audience"
                placeholder="e.g. busy moms, realtors, brides-to-be"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />

              <Textarea
                label="Key Product Features (one per line)"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                rows={4}
              />

              <Input
                label="Related Keywords (comma separated)"
                placeholder="e.g. schedule, habit log, routine"
                value={relatedInput}
                onChange={(e) => setRelatedInput(e.target.value)}
              />

              <Button type="submit" variant="primary" fullWidth>
                Generate Etsy Draft
              </Button>
            </form>
          </Card>
        </div>

        {/* Generated Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {draft ? (
            <div className="space-y-6">
              {/* Title Section */}
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Listing Title</h3>
                    <Badge variant={draft.generated_title.length <= ETSY_LIMITS.titleMaxLength ? 'success' : 'error'}>
                      {draft.generated_title.length} / {ETSY_LIMITS.titleMaxLength} chars
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(draft.generated_title, 'title')}
                  >
                    {copiedSection === 'title' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono">
                  {draft.generated_title}
                </p>
              </Card>

              {/* 13 Tags Section */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      13 Etsy Tags (Exact Count)
                    </h3>
                    <Badge variant="purple">
                      {draft.generated_tags.length} / 13 Tags
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(draft.generated_tags.join(', '), 'tags')}
                  >
                    {copiedSection === 'tags' ? 'Copied All!' : 'Copy Tags'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {draft.generated_tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                    >
                      <span className="text-slate-700 dark:text-slate-200">
                        <span className="text-slate-400 mr-2 font-mono">#{idx + 1}</span>
                        {tag}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {tag.length}/{ETSY_LIMITS.tagMaxLength}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Product Description */}
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    Structured Description Draft
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(draft.generated_description, 'desc')}
                  >
                    {copiedSection === 'desc' ? 'Copied!' : 'Copy Description'}
                  </Button>
                </div>
                <pre className="text-xs p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {draft.generated_description}
                </pre>
              </Card>

              {/* SEO Checklist & Placement Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Etsy Placement Tips & Checklist</CardTitle>
                </CardHeader>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {draft.keyword_placement_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ) : (
            <Card className="py-16 text-center">
              <p className="text-slate-400 text-sm">
                Fill in the listing details on the left and click &quot;Generate Etsy Draft&quot; to view title, 13 tags, and formatted description.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
