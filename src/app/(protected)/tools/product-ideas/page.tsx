'use client';

import { useState } from 'react';
import { generateProductIdeas } from '@/lib/templates/products';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, Badge } from '@/components/ui';
import type { ProductIdea } from '@/types';

export default function ProductIdeasPage() {
  const [niche, setNiche] = useState('Home Gardening');
  const [selectedLang, setSelectedLang] = useState('en');
  const [ideas, setIdeas] = useState<ProductIdea[]>(() => generateProductIdeas('Home Gardening'));
  const [copiedTitleId, setCopiedTitleId] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;
    const generated = generateProductIdeas(niche.trim());
    setIdeas(generated);
  };

  const copyListingTitle = (title: string, id: string) => {
    navigator.clipboard.writeText(title);
    setCopiedTitleId(id);
    setTimeout(() => setCopiedTitleId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Digital Product Idea Generator</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Brainstorm 8 high-demand digital product formats tailored to your niche. 100% brainstorming ideas with zero fake revenue claims.
        </p>
      </div>

      {/* Input */}
      <Card>
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <Input
              label="Enter Niche or Interest"
              placeholder="e.g. Wedding, Personal Finance, Real Estate, Yoga, Homeschooling..."
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              required
            />
          </div>
          <div className="w-full sm:w-48">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Language
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
          <div>
            <Button type="submit" variant="primary">
              Generate 8 Product Ideas
            </Button>
          </div>
        </form>
      </Card>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.map((idea) => (
          <Card key={idea.id} className="flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="purple">{idea.category}</Badge>
                <span className="text-[11px] text-slate-400 font-mono">
                  {idea.niche} Niche
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {idea.product_concept}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Audience: </span>
                  {idea.target_audience}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Suggested Format
                </label>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  {idea.suggested_format}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Draft Listing Title
                  </label>
                  <button
                    type="button"
                    onClick={() => copyListingTitle(idea.possible_listing_title, idea.id)}
                    className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-medium cursor-pointer"
                  >
                    {copiedTitleId === idea.id ? 'Copied!' : 'Copy Title'}
                  </button>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-mono bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  {idea.possible_listing_title}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Target Keywords
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {idea.related_keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
