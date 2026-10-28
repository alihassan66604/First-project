/** Application-wide constants */

export const APP_NAME = 'SEO Pilot';
export const APP_DESCRIPTION = 'Free SEO Research & Optimization Platform';

/** Design tokens */
export const THEME = {
  borderRadius: 'rounded-2xl',       // 16px
  borderRadiusSm: 'rounded-xl',      // 12px
  borderRadiusInput: 'rounded-xl',   // 12px
  borderRadiusButton: 'rounded-xl',  // 12px
} as const;

/** Etsy listing constraints (configurable) */
export const ETSY_LIMITS = {
  titleMaxLength: 140,
  tagCount: 13,
  tagMaxLength: 20,
  descriptionMaxLength: 10000,
} as const;

/** SEO audit scoring thresholds */
export const SEO_THRESHOLDS = {
  titleMinLength: 30,
  titleMaxLength: 60,
  descriptionMinLength: 120,
  descriptionMaxLength: 160,
  minKeywordDensity: 0.5, // %
  maxKeywordDensity: 2.5, // %
  minWordCount: 300,
} as const;

/** Keyword Sources */
export const KEYWORD_SOURCES = [
  { id: 'local_expansion', label: 'Local Expansion', description: 'Deterministic seed expansion, n-grams, modifiers, and intent modifiers' },
  { id: 'manual', label: 'Manual Entry', description: 'Type or paste your own keyword list' },
] as const;

/** Search Intent definition badge colors */
export const SEARCH_INTENTS = [
  { id: 'informational', label: 'Informational', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200' },
  { id: 'commercial', label: 'Commercial', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200' },
  { id: 'transactional', label: 'Transactional', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' },
  { id: 'navigational', label: 'Navigational', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200' },
] as const;

/** Product Categories for brainstorming */
export const PRODUCT_CATEGORIES = [
  'Planners',
  'Templates',
  'Invitations',
  'Wall Art',
  'Trackers',
  'Checklists',
  'Printable Worksheets',
  'Business Templates',
] as const;

/** Navigation links */
export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/keywords/research', label: 'Keyword Research', icon: 'Search' },
  { href: '/keywords/clusters', label: 'Keyword Clusters', icon: 'Network' },
  { href: '/tools/etsy', label: 'Etsy SEO Toolkit', icon: 'ShoppingBag' },
  { href: '/tools/blog', label: 'Blog SEO Toolkit', icon: 'FileText' },
  { href: '/tools/seo-checker', label: 'SEO Checker', icon: 'CheckCircle' },
  { href: '/tools/product-ideas', label: 'Product Ideas', icon: 'Lightbulb' },
  { href: '/projects', label: 'Saved Projects', icon: 'FolderKanban' },
  { href: '/assistant', label: 'SEO Assistant', icon: 'Bot' },
  { href: '/export', label: 'Export Center', icon: 'Download' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
] as const;
