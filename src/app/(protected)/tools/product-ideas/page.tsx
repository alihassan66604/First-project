'use client';

import { useState } from 'react';
import { generateProductIdeas } from '@/lib/templates/products';
import { Button, Input, Card, Badge } from '@/components/ui';
import type { ProductIdea } from '@/types';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
];

export default function ProductIdeasPage() {
  const [niche, setNiche] = useState('Digital Planning & Organization');
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [ideas, setIdeas] = useState<ProductIdea[]>(() => generateProductIdeas('Digital Planning & Organization', 'local-user', 100, 'en'));
  const [copiedTitleId, setCopiedTitleId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;
    const generated = generateProductIdeas(niche.trim(), 'local-user', 100, selectedLang);
    setIdeas(generated);
    setCurrentPage(1);
  };

  const copyListingTitle = (title: string, id: string) => {
    navigator.clipboard.writeText(title);
    setCopiedTitleId(id);
    setTimeout(() => setCopiedTitleId(null), 2500);
  };

  const categories = ['All', ...Array.from(new Set(ideas.map(i => i.category)))];

  const filteredIdeas = selectedCategory === 'All' 
    ? ideas 
    : ideas.filter(i => i.category === selectedCategory);

  const totalPages = Math.ceil(filteredIdeas.length / pageSize) || 1;
  const paginatedIdeas = filteredIdeas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>100+ Digital Product Idea Generator</span>
            <Badge variant="purple">100+ Ideas</Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Brainstorm 100+ high-demand digital product concepts across 12 product categories for your niche with multi-language support.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
          {ideas.length} Ideas Ready
        </span>
      </div>

      {/* Input Form */}
      <Card>
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <Input
              label="Enter Niche or Interest *"
              placeholder="e.g. Wedding, Personal Finance, Real Estate, Yoga, Homeschooling, Coding..."
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
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>
                  {l.label} ({l.native})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Button type="submit" variant="primary">
              Generate 100+ Product Ideas
            </Button>
          </div>
        </form>
      </Card>

      {/* Category Pills Filter */}
      {ideas.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat} ({cat === 'All' ? ideas.length : ideas.filter(i => i.category === cat).length})
            </button>
          ))}
        </div>
      )}

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedIdeas.map((idea) => (
          <Card key={idea.id} className="flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="purple">{idea.category}</Badge>
                <span className="text-[10px] text-slate-400 font-mono">
                  {idea.niche}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {idea.product_concept}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Audience: </span>
                  {idea.target_audience}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Format
                </label>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  {idea.suggested_format}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Listing Title
                  </label>
                  <button
                    type="button"
                    onClick={() => copyListingTitle(idea.possible_listing_title, idea.id)}
                    className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-medium cursor-pointer"
                  >
                    {copiedTitleId === idea.id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-mono bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 line-clamp-2">
                  {idea.possible_listing_title}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredIdeas.length > pageSize && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">{Math.min(currentPage * pageSize, filteredIdeas.length)}</span> of{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredIdeas.length}</span> ideas
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
