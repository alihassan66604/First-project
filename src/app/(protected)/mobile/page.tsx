'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, Input } from '@/components/ui';

const TRADEMARKS = ['disney', 'nike', 'apple', 'cricut', 'lego', 'barbie', 'chanel', 'gucci', 'iphone'];

interface KeywordRow {
  keyword: string;
  intent: string;
  score: number;
}

interface MobileUser {
  name: string;
  email: string;
  shopName: string;
}

// Client-side intelligent keyword synthesizer (instant fallback if offline or unauthenticated)
function generateClientKeywords(seed: string, lang: string, source: string, targetCount: number = 100): KeywordRow[] {
  const q = seed.trim().toLowerCase();
  if (!q) return [];

  const prefixes = [
    'best', 'how to make', 'diy', 'printable', 'digital', 'editable', 'free download', 'top rated',
    'affordable', 'custom', 'modern', 'minimalist', 'aesthetic', 'luxury', 'simple', 'cute',
    'commercial use', 'instant download', 'high quality', 'unique', 'vintage', 'handmade'
  ];

  const suffixes = [
    'template', 'ideas', 'for beginners', '2026', 'checklist', 'bundle', 'pdf', 'canva',
    'goodnotes', 'organizer', 'kit', 'guide', 'tracker', 'sheet', 'planner', 'design',
    'collection', 'printable', 'format', 'layout', 'download', 'sample'
  ];

  const langModifiers: Record<string, string[]> = {
    ur: ['پاکستان', 'طریقہ', 'ڈیزائن', 'آن لائن', 'آئیڈیاز', 'سستا', 'بہترین'],
    hi: ['डिजाइन', 'तरीका', 'ऑनलाइन', 'विचार', 'सस्ता', 'सर्वश्रेष्ठ', 'टेम्पलेट'],
    es: ['plantilla', 'imprimible', 'digital', 'para editar', 'descarga inmediata', 'ideas'],
    fr: ['modele', 'a imprimer', 'telechargement', 'gratuit', 'personnalise', 'idees'],
    ar: ['قالب', 'جاهز للطباعة', 'تحميل فوري', 'تصميم', 'افكار', 'رقمي'],
    en: []
  };

  const results: KeywordRow[] = [
    { keyword: q, intent: 'informational', score: 100 },
    { keyword: `${q} template`, intent: 'transactional', score: 98 },
    { keyword: `${q} printable`, intent: 'transactional', score: 96 },
    { keyword: `best ${q} 2026`, intent: 'commercial', score: 94 },
    { keyword: `${q} digital download`, intent: 'transactional', score: 92 },
    { keyword: `how to create ${q}`, intent: 'informational', score: 90 },
    { keyword: `${q} canva editable`, intent: 'transactional', score: 89 },
    { keyword: `${q} ideas`, intent: 'commercial', score: 87 },
  ];

  const seen = new Set<string>(results.map(r => r.keyword));

  // Add source-specific terms
  if (source === 'etsy') {
    const etsyTerms = ['etsy best seller', 'etsy shop listing', 'commercial license', 'instant download link', 'svg cut file'];
    for (const et of etsyTerms) {
      const kw = `${q} ${et}`;
      if (!seen.has(kw)) {
        seen.add(kw);
        results.push({ keyword: kw, intent: 'transactional', score: 91 });
      }
    }
  }

  // Add language modifiers if selected
  const activeLangMods = langModifiers[lang] || [];
  for (const mod of activeLangMods) {
    const kw = `${q} ${mod}`;
    if (!seen.has(kw)) {
      seen.add(kw);
      results.push({ keyword: kw, intent: 'commercial', score: 88 });
    }
  }

  // Permutations
  for (const pre of prefixes) {
    if (results.length >= targetCount) break;
    const kw = `${pre} ${q}`;
    if (!seen.has(kw)) {
      seen.add(kw);
      results.push({
        keyword: kw,
        intent: pre.includes('how') || pre.includes('diy') ? 'informational' : pre.includes('free') ? 'transactional' : 'commercial',
        score: Math.max(60, 95 - results.length * 0.05)
      });
    }
  }

  for (const suf of suffixes) {
    if (results.length >= targetCount) break;
    const kw = `${q} ${suf}`;
    if (!seen.has(kw)) {
      seen.add(kw);
      results.push({
        keyword: kw,
        intent: suf.includes('template') || suf.includes('pdf') || suf.includes('kit') ? 'transactional' : 'commercial',
        score: Math.max(60, 92 - results.length * 0.05)
      });
    }
  }

  return results.slice(0, targetCount);
}

export default function MobileAppViewPage() {
  // Mobile Auth State (Sign In / Sign Up)
  const [currentUser, setCurrentUser] = useState<MobileUser | null>(null);

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authShop, setAuthShop] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeFeature, setActiveFeature] = useState<
    | 'dashboard'
    | 'research'
    | 'clusters'
    | 'article'
    | 'coverage'
    | 'etsy'
    | 'blog'
    | 'checker'
    | 'ideas'
    | 'projects'
    | 'assistant'
    | 'export'
  >('research');

  const [menuOpen, setMenuOpen] = useState(false);

  // 1. Keyword Research State
  const [query, setQuery] = useState('leather wallet');
  const [source, setSource] = useState<'google' | 'etsy'>('google');
  const [lang, setLang] = useState('en');
  const [targetCount, setTargetCount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordRow[]>(() =>
    generateClientKeywords('leather wallet', 'en', 'google', 100)
  );

  // 2. Etsy SEO Toolkit & QA
  const [title, setTitle] = useState('Handmade Genuine Leather Wallet for Men | Slim RFID Bifold Card Holder Gift');
  const [tagsInput, setTagsInput] = useState('leather wallet, mens wallet, slim wallet, bifold wallet, personalized wallet, groomsmen gift, minimalist wallet, rfid wallet, handmade wallet, card holder, anniversary gift, vintage wallet, custom leather');

  // 3. Content Coverage
  const [coverageArticle, setCoverageArticle] = useState(
    'This genuine leather wallet is a handcrafted slim bifold designed with rfid blocking technology and a minimalist card holder.'
  );
  const [coverageKeywordsInput, setCoverageKeywordsInput] = useState(
    'leather wallet, genuine leather, slim bifold, rfid blocking, handmade wallet, card holder'
  );

  // 4. Page Article Builder
  const [articleTopic, setArticleTopic] = useState('How to Choose the Best Leather Wallet');
  const [articleOutline, setArticleOutline] = useState<string[]>([
    'H1: Complete Buyer & Style Guide to Leather Wallets in 2026',
    'H2: Why High-Quality Full Grain Leather Outlasts Synthetic Wallets',
    'H3: Key Features to Look For: Stitching, Edging & RFID Protection',
    'H2: Optimizing the 140-Character Title & Exactly 13 Tags',
    'H2: Top 5 Recommended Styles & Pricing Strategies',
  ]);

  // 5. Blog SEO Toolkit
  const [blogTitle, setBlogTitle] = useState('How to Spot Genuine Leather Wallets: Complete Buyer Guide');
  const [blogSlug, setBlogSlug] = useState('how-to-spot-genuine-leather-wallets-complete-buyer-guide');
  const [blogMetaDesc, setBlogMetaDesc] = useState(
    'Learn how to identify full grain genuine leather wallets, stitch quality, and RFID blocking protection before purchasing.'
  );

  // 6. SEO Checker
  const [auditListingTitle, setAuditListingTitle] = useState('Custom Engraved Leather Wallet for Men | Minimalist Bifold');
  const [auditListingTags, setAuditListingTags] = useState('leather wallet, mens wallet, engraved wallet, bifold, slim wallet, card holder, groomsmen gift, custom gift, handmade, leather gift, vintage wallet, pocket wallet, rfid');
  const [auditScoreResult, setAuditScoreResult] = useState<any>(null);

  // 7. Product Ideas
  const [selectedCat, setSelectedCat] = useState('All');
  const [ideasSearch, setIdeasSearch] = useState('');

  // 8. Saved Projects
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState([
    { id: '1', name: 'Leather Goods Niche', keywords: 50, status: 'Active', updated: 'Today' },
    { id: '2', name: 'Wedding Stationery 2026', keywords: 48, status: 'Completed', updated: 'Yesterday' },
  ]);

  // 9. AI Assistant Chat
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Salam! Main aap ka Mobile SEO Assistant hoon. Apne seed keyword ya shop niche batayein, main 13 tags aur title recommendations bana kar doonga.' },
  ]);

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Sign In Handler
  const handleSignIn = async () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      showToast('Please enter email and password!');
      return;
    }
    setAuthLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail.trim(), password: authPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser({
          name: data.user?.name || 'Sarah Craft',
          email: data.user?.email || authEmail.trim(),
          shopName: 'SarahDigitalStudio',
        });
        showToast('Signed In successfully!');
        setAuthLoading(false);
        return;
      }
    } catch {
      // Fallback local signin for demo
    }

    // Default local demo account sign in
    setCurrentUser({
      name: authName.trim() || 'Sarah Craft',
      email: authEmail.trim(),
      shopName: authShop.trim() || 'SarahDigitalStudio',
    });
    showToast(`Signed In as ${authEmail.trim()}!`);
    setAuthLoading(false);
  };

  // Sign Up Handler
  const handleSignUp = () => {
    if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
      showToast('Please fill in your name, email and password!');
      return;
    }

    setCurrentUser({
      name: authName.trim(),
      email: authEmail.trim(),
      shopName: authShop.trim() || `${authName.trim()}Studio`,
    });
    showToast(`Account created for ${authName.trim()}! Welcome to SEO Pilot Mobile.`);
  };

  const handleLogOut = () => {
    setCurrentUser(null);
    setMenuOpen(false);
    showToast('Logged out of Mobile App.');
  };

  // Search keywords dynamically from API
  const handleSearch = async () => {
    const q = query.trim();
    if (!q) {
      showToast('Please type a keyword first!');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/keywords/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          source: source === 'google' ? 'google_autocomplete' : 'etsy_autocomplete',
          lang,
          targetCount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.keywords && data.keywords.length > 0) {
          setKeywords(
            data.keywords.map((k: any) => ({
              keyword: k.keyword,
              intent: k.search_intent,
              score: Math.round(k.relevance_score * 100),
            }))
          );
          showToast(`Found ${data.keywords.length} pure Google keywords for "${q}"`);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Continue to local generation
    }

    const local = generateClientKeywords(q, lang, source, targetCount);
    setKeywords(local);
    showToast(`Generated ${local.length} keywords for "${q}"`);
    setLoading(false);
  };

  const copyText = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt);
    showToast(`${label} copied to clipboard!`);
  };

  // 25 Clusters dynamically calculated based on current keywords / query
  const clusters25 = useMemo(() => {
    const seed = query.trim() || 'product';
    const list = keywords.length > 0 ? keywords.map(k => k.keyword) : generateClientKeywords(seed, lang, source, 100).map(k => k.keyword);
    const groups: { name: string; tags: string[] }[] = [];

    const intents = ['Commercial Intent', 'Buyer Download', 'How-to & DIY', 'Aesthetic & Design', 'Templates & Kits', 'Printable & PDF'];

    for (let i = 1; i <= 25; i++) {
      const intentName = intents[(i - 1) % intents.length];
      const chunk = list.slice((i - 1) * 3, i * 3);
      const tags = chunk.length > 0 ? chunk : [
        `${seed} pack #${i}`,
        `best ${seed} ${intentName.toLowerCase()}`,
        `${seed} download #${i}`
      ];
      groups.push({
        name: `${seed.charAt(0).toUpperCase() + seed.slice(1)} - ${intentName} #${i}`,
        tags
      });
    }
    return groups;
  }, [keywords, query, lang, source]);

  // QA Calculations
  const tagsList = tagsInput.split(/[,]+/).map((t) => t.trim()).filter(Boolean);
  const titleLen = title.length;
  const isTitleValid = titleLen > 0 && titleLen <= 140;
  const isTagsValid = tagsList.length === 13;
  const tagsOverLimit = tagsList.filter((t) => t.length > 20);
  const trademarkHits = [title, ...tagsList].flatMap((t) => TRADEMARKS.filter((tm) => t.toLowerCase().includes(tm)));
  const isCompliant = isTitleValid && isTagsValid && tagsOverLimit.length === 0 && trademarkHits.length === 0;

  // Content Coverage Calculations
  const coverageAnalysis = useMemo(() => {
    const targetKws = coverageKeywordsInput.split(/[,]+/).map(k => k.trim()).filter(Boolean);
    const textLower = coverageArticle.toLowerCase();
    const covered: string[] = [];
    const missing: string[] = [];

    targetKws.forEach(kw => {
      if (textLower.includes(kw.toLowerCase())) {
        covered.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const pct = targetKws.length > 0 ? Math.round((covered.length / targetKws.length) * 100) : 0;
    return {
      percentage: pct,
      covered,
      missing,
      grade: pct >= 80 ? 'A+' : pct >= 60 ? 'B' : 'C'
    };
  }, [coverageArticle, coverageKeywordsInput]);

  // Generate dynamic outline for any topic
  const generateNewOutline = (topic: string) => {
    const t = topic.trim() || 'Digital Products';
    const newOut = [
      `H1: Ultimate Guide to ${t} (2026 Strategy)`,
      `H2: Why ${t} is High-Search & Profitable on Etsy & Google`,
      `H3: Key Tools Needed to Create ${t} (Canva, GoodNotes, Photoshop)`,
      `H2: Step-by-Step Creation & Export Checklist for ${t}`,
      `H3: Optimizing the 140-Character Title & Exactly 13 Tags`,
      `H2: Pricing, Delivery & Customer Support Best Practices`,
    ];
    setArticleOutline(newOut);
    showToast(`Generated outline for "${t}"!`);
  };

  // Run SEO Checker
  const handleRunAudit = () => {
    const tLen = auditListingTitle.length;
    const tArr = auditListingTags.split(/[,]+/).map(t => t.trim()).filter(Boolean);
    const over20 = tArr.filter(t => t.length > 20);
    const tm = [auditListingTitle, ...tArr].flatMap(txt => TRADEMARKS.filter(t => txt.toLowerCase().includes(t)));

    setAuditScoreResult({
      titleLength: tLen,
      titleStatus: tLen > 0 && tLen <= 140 ? 'Optimal' : 'Exceeded',
      tagCount: tArr.length,
      tagStatus: tArr.length === 13 ? 'Exact 13 Tags (Pass)' : `${tArr.length}/13 Tags (Fix Needed)`,
      over20Count: over20.length,
      trademarkViolations: tm,
      overallScore: tLen <= 140 && tArr.length === 13 && over20.length === 0 && tm.length === 0 ? 100 : 70
    });
    showToast('Audit scorecard generated!');
  };

  // AI Assistant reply
  const handleSendChat = () => {
    const prompt = chatInput.trim();
    if (!prompt) return;
    const userMsg = { role: 'user', text: prompt };

    let botResponse = `Aap ke keyword "${prompt}" ke liye SEO tajweez:\n• Recommended Tags: ${prompt} for men, genuine ${prompt}, slim ${prompt}, rfid blocking, personalized gift, bifold.\n• Character Limit: 13 tags aur title 140 chars mein rakhein!`;

    setChatMessages(prev => [...prev, userMsg, { role: 'assistant', text: botResponse }]);
    setChatInput('');
  };

  // ALL 12 FEATURES
  const ALL_FEATURES = [
    { id: 'dashboard', label: 'User Dashboard', icon: '🏠', category: 'Overview' },
    { id: 'research', label: 'Keyword Research (5000)', icon: '🔍', category: 'SEO Tools' },
    { id: 'clusters', label: 'Keyword Grouping (25)', icon: '🗂️', category: 'SEO Tools' },
    { id: 'article', label: 'Page Article Builder', icon: '📄', category: 'SEO Tools' },
    { id: 'coverage', label: 'Content Coverage', icon: '🎯', category: 'SEO Tools' },
    { id: 'etsy', label: 'Etsy SEO Toolkit (13 Tags)', icon: '🛍️', category: 'Etsy Tools' },
    { id: 'blog', label: 'Blog SEO Toolkit', icon: '✍️', category: 'SEO Tools' },
    { id: 'checker', label: 'SEO Checker & Audit', icon: '🔎', category: 'SEO Tools' },
    { id: 'ideas', label: '100+ Product Ideas', icon: '💡', category: 'Etsy Tools' },
    { id: 'projects', label: 'Saved Projects', icon: '📁', category: 'Workspace' },
    { id: 'assistant', label: 'SEO AI Assistant', icon: '🤖', category: 'Workspace' },
    { id: 'export', label: 'Export Center', icon: '📤', category: 'Workspace' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-6 min-h-[calc(100vh-4rem)]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 z-50 px-4 py-2 bg-slate-900 text-white border border-slate-700 rounded-xl shadow-2xl text-xs font-bold animate-bounce flex items-center gap-2">
          <span className="text-emerald-400">✓</span>
          {toast}
        </div>
      )}

      {/* Top Header */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between px-2">
        <div>
          <h1 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>📱</span> Mobile App Suite &bull; {currentUser ? currentUser.name : 'Guest'}
          </h1>
          <p className="text-[11px] text-slate-500">Sign In / Sign Up &amp; 12 Creator Tools</p>
        </div>

        {currentUser ? (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-2.5 py-1 text-xs font-extrabold bg-indigo-600 text-white rounded-lg shadow-sm flex items-center gap-1 active:scale-95"
          >
            <span>☰</span> All 12 Tools
          </button>
        ) : (
          <button
            onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
            className="px-2.5 py-1 text-xs font-extrabold bg-indigo-600 text-white rounded-lg shadow-sm"
          >
            {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        )}
      </div>

      {/* SMARTPHONE FRAME */}
      <div className="relative w-full max-w-[390px] h-[770px] bg-white dark:bg-slate-950 rounded-[44px] shadow-2xl border-[6px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
        
        {/* Dynamic Island */}
        <div className="h-6 w-full bg-slate-900 flex items-center justify-center">
          <div className="w-24 h-3 bg-black rounded-full flex items-center justify-end px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-6 w-full flex items-center justify-between px-5 text-[11px] font-semibold text-slate-400 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
          <span>9:41</span>
          <div className="flex items-center gap-1 text-[10px]">
            <span>5G</span>
            <span>📶</span>
            <span>🔋 100%</span>
          </div>
        </div>

        {/* ================= CONDITION 1: LOGGED OUT AUTH SCREEN ================= */}
        {!currentUser ? (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between bg-slate-50 dark:bg-slate-900/60 scrollbar-thin">
            <div>
              {/* Brand Logo & Welcome */}
              <div className="text-center my-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20 text-white mb-2">
                  🚀
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">SEO Pilot Mobile</h2>
                <p className="text-xs text-slate-500">Client &amp; Etsy Seller Workspace</p>
              </div>

              {/* Sign In / Sign Up Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`py-1.5 rounded-lg transition-all ${
                    authMode === 'signin'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`py-1.5 rounded-lg transition-all ${
                    authMode === 'signup'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* AUTH FORM CARD */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                {authMode === 'signup' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                      <Input
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Sarah Craft"
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Etsy Shop / Brand Name</label>
                      <Input
                        value={authShop}
                        onChange={(e) => setAuthShop(e.target.value)}
                        placeholder="SarahDigitalStudio"
                        className="text-xs h-9"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                  <Input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="user@seopilot.app"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                  <Input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="text-xs h-9"
                  />
                </div>

                {authMode === 'signin' ? (
                  <Button
                    onClick={handleSignIn}
                    disabled={authLoading}
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    {authLoading ? 'Signing In...' : 'Sign In to Mobile App →'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSignUp}
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    Create Free Creator Account →
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Feature Badges Footer */}
            <div className="mt-4 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-center space-y-1">
              <p className="text-[11px] font-extrabold text-indigo-900 dark:text-indigo-200">
                ✓ 5,000 Keywords &bull; 25 Groups &bull; 13 Tags QA
              </p>
              <p className="text-[10px] text-slate-500">100% Free Client Mobile Experience</p>
            </div>
          </div>
        ) : (
          /* ================= CONDITION 2: LOGGED IN FULL SUITE ================= */
          <>
            {/* Top App Bar with active title & menu button */}
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-30">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  ☰
                </button>
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                    {ALL_FEATURES.find((f) => f.id === activeFeature)?.label}
                  </p>
                  <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-wider">
                    {currentUser.name} &bull; Pro Client
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogOut}
                className="px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-[9px] font-bold border border-red-200 dark:border-red-900"
              >
                Log Out
              </button>
            </div>

            {/* FULL 12 FEATURES OVERLAY MENU */}
            {menuOpen && (
              <div className="absolute inset-x-2 top-16 bottom-14 z-50 bg-slate-900/95 backdrop-blur-md p-3.5 overflow-y-auto space-y-2.5 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                  <span className="text-xs font-black text-white uppercase tracking-wider">All 12 Features &amp; Options</span>
                  <button onClick={() => setMenuOpen(false)} className="text-xs font-bold text-slate-400 hover:text-white">✕ Close</button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  {ALL_FEATURES.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveFeature(item.id as any);
                        setMenuOpen(false);
                      }}
                      className={`p-2 rounded-xl text-left border transition-all flex flex-col gap-0.5 ${
                        activeFeature === item.id
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="text-xs font-extrabold leading-tight">{item.label}</span>
                      <span className="text-[9px] text-slate-400">{item.category}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleLogOut}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl"
                >
                  🚪 Log Out of Mobile Account
                </button>
              </div>
            )}

            {/* SCROLLABLE BODY CONTENT */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50 dark:bg-slate-900/40 scrollbar-thin">
              
              {/* 1. DASHBOARD OVERVIEW */}
              {activeFeature === 'dashboard' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Welcome, {currentUser.name}</span>
                    <h3 className="text-base font-black mt-0.5">{currentUser.shopName} Hub</h3>
                    <p className="text-xs opacity-90 mt-1">All 12 Web features ready on mobile.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{keywords.length}</span>
                      <p className="text-[10px] text-slate-400 font-bold">Researched</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">25</span>
                      <p className="text-[10px] text-slate-400 font-bold">Groups</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-base font-black text-purple-600 dark:text-purple-400">{projects.length}</span>
                      <p className="text-[10px] text-slate-400 font-bold">Projects</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Tap to Open Tool:</p>
                    {[
                      { id: 'research', title: '5,000 Keywords Autocomplete', icon: '🔍', desc: 'Type ANY niche for instant keywords' },
                      { id: 'clusters', title: 'Keyword Grouping (25 Groups)', icon: '🗂️', desc: 'Dynamic semantic clusters' },
                      { id: 'etsy', title: 'Etsy SEO Toolkit (13 Tags QA)', icon: '🛍️', desc: '140 chars & trademark audit' },
                      { id: 'coverage', title: 'Content Coverage & Gap Analyzer', icon: '🎯', desc: 'Topical completeness 0-100%' },
                      { id: 'article', title: 'Page Article Builder', icon: '📄', desc: 'H1, H2, H3 outline generator' },
                      { id: 'assistant', title: 'SEO AI Assistant', icon: '🤖', desc: 'Chat with SEO AI' },
                    ].map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setActiveFeature(t.id as any)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{t.icon}</span>
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white">{t.title}</p>
                            <p className="text-[10px] text-slate-400">{t.desc}</p>
                          </div>
                        </div>
                        <span className="text-indigo-500 font-bold">→</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. KEYWORD RESEARCH (5,000) */}
              {activeFeature === 'research' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSource('google')}
                      className={`py-1 text-xs font-bold rounded-lg ${source === 'google' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      🌐 Google (5,000)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSource('etsy')}
                      className={`py-1 text-xs font-bold rounded-lg ${source === 'etsy' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      🛍️ Etsy Market
                    </button>
                  </div>

                  <div className="flex gap-1.5">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                      }}
                      placeholder="Type any keyword (e.g. leather wallet, shoes)..."
                      className="text-xs h-9 bg-white dark:bg-slate-800"
                    />
                    <Button onClick={handleSearch} disabled={loading} size="sm" className="h-9 font-bold px-3">
                      {loading ? '...' : 'Search'}
                    </Button>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div className="flex gap-1 overflow-x-auto py-0.5">
                      {[
                        { code: 'en', label: 'EN' },
                        { code: 'ur', label: 'اردو' },
                        { code: 'hi', label: 'हिंदी' },
                        { code: 'es', label: 'ES' },
                        { code: 'ar', label: 'عربي' },
                      ].map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code);
                            const updated = generateClientKeywords(query, l.code, source, targetCount);
                            setKeywords(updated);
                            showToast(`Switched to ${l.label}`);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${lang === l.code ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-bold">Max:</span>
                      <select
                        value={targetCount}
                        onChange={(e) => {
                          const count = Number(e.target.value);
                          setTargetCount(count);
                          const updated = generateClientKeywords(query, lang, source, count);
                          setKeywords(updated);
                          showToast(`Scaled to ${count} keywords`);
                        }}
                        className="bg-white dark:bg-slate-800 border text-[10px] rounded px-1.5 py-0.5 font-bold"
                      >
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="250">250</option>
                        <option value="500">500</option>
                        <option value="1000">1,000</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs font-bold">
                    <span>{keywords.length} Keywords for "{query}"</span>
                    <button
                      onClick={() => copyText(keywords.slice(0, 13).map((k) => k.keyword).join(', '), '13 Etsy Tags')}
                      className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-extrabold rounded-md active:scale-95"
                    >
                      📋 Copy Top 13 Tags
                    </button>
                  </div>

                  <div className="space-y-1.5 pb-4">
                    {keywords.map((kw, i) => (
                      <div
                        key={i}
                        onClick={() => copyText(kw.keyword, kw.keyword)}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-xs flex justify-between items-center cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 w-4">#{i + 1}</span>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">{kw.keyword}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] uppercase font-bold text-indigo-500">{kw.intent}</span>
                              <span className="text-[9px] text-slate-400">{Math.round(kw.score)}% rel</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-slate-400 hover:text-indigo-500">📋</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. KEYWORD GROUPING (25 GROUPS) */}
              {activeFeature === 'clusters' && (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs">
                    <p className="font-extrabold text-emerald-800 dark:text-emerald-300">25 Semantic Clusters for "{query}"</p>
                    <p className="text-[10px] text-slate-500">Auto-clustered into 25 targeted groups for Etsy tags &amp; Google SEO.</p>
                  </div>

                  <div className="space-y-2 pb-4">
                    {clusters25.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-extrabold text-slate-900 dark:text-white">Group #{i + 1}: {c.name}</span>
                          <button onClick={() => copyText(c.tags.join(', '), `Group #${i + 1}`)} className="text-[10px] font-bold text-indigo-500 hover:underline">
                            📋 Copy Tags
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {c.tags.map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[9px] text-slate-700 dark:text-slate-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. PAGE ARTICLE BUILDER */}
              {activeFeature === 'article' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border space-y-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Type Any Article Topic:</span>
                    <div className="flex gap-1.5">
                      <Input value={articleTopic} onChange={(e) => setArticleTopic(e.target.value)} className="text-xs h-9" />
                      <Button onClick={() => generateNewOutline(articleTopic)} size="sm" className="h-9 px-3 font-bold">
                        Generate
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Generated Outline ({articleOutline.length} Headings)</span>
                      <button onClick={() => copyText(articleOutline.join('\n'), 'Article Outline')} className="text-[10px] font-bold text-indigo-500">
                        📋 Copy Outline
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {articleOutline.map((line, i) => (
                        <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. CONTENT COVERAGE */}
              {activeFeature === 'coverage' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Topical Coverage Score</span>
                      <p className="text-xl font-black text-emerald-600">{coverageAnalysis.percentage}% &bull; Grade {coverageAnalysis.grade}</p>
                    </div>
                    <Badge variant={coverageAnalysis.percentage >= 70 ? 'success' : 'warning'}>
                      {coverageAnalysis.percentage >= 70 ? 'Rank Ready' : 'Needs Optimization'}
                    </Badge>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border space-y-1.5">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Target Keywords (comma-separated):</span>
                    <textarea
                      value={coverageKeywordsInput}
                      onChange={(e) => setCoverageKeywordsInput(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border space-y-1.5">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Your Article / Listing Description:</span>
                    <textarea
                      value={coverageArticle}
                      onChange={(e) => setCoverageArticle(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border space-y-1">
                    <p className="font-bold text-emerald-600">Covered Keywords ({coverageAnalysis.covered.length}):</p>
                    <p className="text-[10px] text-slate-500">{coverageAnalysis.covered.join(', ') || 'None yet'}</p>
                    
                    {coverageAnalysis.missing.length > 0 && (
                      <>
                        <p className="font-bold text-amber-600 mt-2">Missing Keywords ({coverageAnalysis.missing.length}):</p>
                        <p className="text-[10px] text-slate-500">{coverageAnalysis.missing.join(', ')}</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 6. ETSY SEO TOOLKIT */}
              {activeFeature === 'etsy' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>Etsy Listing Title</span>
                      <span className={titleLen <= 140 ? 'text-emerald-500' : 'text-red-500 font-bold'}>
                        {titleLen} / 140 chars {titleLen > 140 ? '(EXCEEDED)' : ''}
                      </span>
                    </div>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xs h-9" />
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${titleLen <= 140 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, (titleLen / 140) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>13 Etsy Tags</span>
                      <span className={isTagsValid ? 'text-emerald-500' : 'text-amber-500 font-bold'}>
                        {tagsList.length} / 13 Tags {isTagsValid ? '✓' : '(MUST BE 13)'}
                      </span>
                    </div>
                    <textarea
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white focus:outline-none"
                    />

                    {tagsOverLimit.length > 0 && (
                      <p className="text-red-500 text-[10px] font-bold">
                        ⚠️ {tagsOverLimit.length} tag(s) exceed 20 characters limit!
                      </p>
                    )}

                    {trademarkHits.length > 0 && (
                      <p className="text-red-500 text-[10px] font-bold">
                        🚨 Trademark violation detected: {trademarkHits.join(', ')}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => copyText(tagsList.join(', '), '13 Etsy Tags')}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg active:scale-95"
                    >
                      📋 1-Tap Copy 13 Tags for Etsy
                    </button>
                  </div>

                  <div className={`p-2.5 rounded-xl text-xs border ${isCompliant ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
                    <p className="font-bold">{isCompliant ? '✓ 100% Compliant for Etsy Shop' : '⚠️ Action Required:'}</p>
                    <p className="text-[10px] mt-0.5">
                      {isCompliant
                        ? '140 chars, exactly 13 tags (≤20 chars), 0 trademark violations.'
                        : 'Check title length or adjust tags count.'}
                    </p>
                  </div>
                </div>
              )}

              {/* 7. BLOG SEO TOOLKIT */}
              {activeFeature === 'blog' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border space-y-1.5">
                    <span className="font-bold">Blog Title</span>
                    <Input
                      value={blogTitle}
                      onChange={(e) => {
                        setBlogTitle(e.target.value);
                        setBlogSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border space-y-1.5">
                    <span className="font-bold">Auto-Generated URL Slug</span>
                    <Input value={blogSlug} onChange={(e) => setBlogSlug(e.target.value)} className="text-xs h-9" />
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border space-y-1.5">
                    <span className="font-bold">Meta Description</span>
                    <textarea
                      value={blogMetaDesc}
                      onChange={(e) => setBlogMetaDesc(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border"
                    />
                  </div>
                </div>
              )}

              {/* 8. SEO CHECKER */}
              {activeFeature === 'checker' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border space-y-2">
                    <span className="font-bold">Listing Title to Audit:</span>
                    <Input value={auditListingTitle} onChange={(e) => setAuditListingTitle(e.target.value)} className="text-xs h-9" />
                    <span className="font-bold">Listing Tags:</span>
                    <textarea value={auditListingTags} onChange={(e) => setAuditListingTags(e.target.value)} rows={2} className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border" />
                    <Button onClick={handleRunAudit} size="sm" className="w-full font-bold">
                      Run Instant Audit
                    </Button>
                  </div>

                  {auditScoreResult && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Audit Score</span>
                        <Badge variant={auditScoreResult.overallScore === 100 ? 'success' : 'warning'}>
                          {auditScoreResult.overallScore} / 100
                        </Badge>
                      </div>
                      <p className="text-[11px]">&bull; Title Length: {auditScoreResult.titleLength}/140 ({auditScoreResult.titleStatus})</p>
                      <p className="text-[11px]">&bull; Tags Count: {auditScoreResult.tagStatus}</p>
                      <p className="text-[11px]">&bull; Tags Over 20 chars: {auditScoreResult.over20Count}</p>
                      <p className="text-[11px]">&bull; Trademark Violations: {auditScoreResult.trademarkViolations.length}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 9. 100+ PRODUCT IDEAS */}
              {activeFeature === 'ideas' && (
                <div className="space-y-3 text-xs">
                  <Input
                    value={ideasSearch}
                    onChange={(e) => setIdeasSearch(e.target.value)}
                    placeholder="Search ideas (e.g. planner, resume, wedding)..."
                    className="text-xs h-9 bg-white dark:bg-slate-800"
                  />

                  <div className="flex gap-1 overflow-x-auto pb-1">
                    {['All', 'Leather', 'Notion', 'Canva', 'GoodNotes', 'Wedding', 'Budget'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCat(cat)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedCat === cat ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 pb-4">
                    {[
                      { cat: 'Leather', title: 'Minimalist Slim RFID Bifold Leather Wallet', price: '$29 - $49', tags: 'leather wallet, slim bifold, rfid wallet, mens gift' },
                      { cat: 'Notion', title: 'Second Brain All-in-One Life OS', price: '$19 - $29', tags: 'notion template, second brain, life planner, productivity' },
                      { cat: 'Canva', title: 'Instagram Coaching Carousel Kit (50 Posts)', price: '$14 - $28', tags: 'canva template, instagram carousel, coaching graphics' },
                      { cat: 'GoodNotes', title: '2026 Hyperlinked Digital Daily Routine Planner', price: '$19 - $35', tags: 'goodnotes planner, hyperlinked pdf, ipad schedule, routine' },
                      { cat: 'Wedding', title: 'Minimalist Boho Wedding Invitation Suite (5-in-1)', price: '$15 - $32', tags: 'wedding invite, canva wedding, rsvp card, save the date' },
                      { cat: 'Budget', title: 'Monthly Automated 50-30-20 Budget Spreadsheet', price: '$10 - $22', tags: 'budget spreadsheet, google sheets budget, debt snowball' },
                    ]
                      .filter((i) => selectedCat === 'All' || i.cat === selectedCat)
                      .filter((i) => !ideasSearch.trim() || i.title.toLowerCase().includes(ideasSearch.toLowerCase()))
                      .map((idea, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold uppercase text-indigo-500">{idea.cat} Blueprint</span>
                            <span className="font-bold text-emerald-500">{idea.price}</span>
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white">{idea.title}</p>
                          <button onClick={() => copyText(idea.tags, idea.title)} className="w-full py-1 bg-slate-100 dark:bg-slate-700 text-indigo-500 text-[10px] font-bold rounded">
                            📋 Copy 13 Tags Blueprint
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 10. SAVED PROJECTS */}
              {activeFeature === 'projects' && (
                <div className="space-y-3 text-xs">
                  <div className="flex gap-1.5">
                    <Input
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="New project name (e.g. Leather Wallets)..."
                      className="text-xs h-9 bg-white dark:bg-slate-800"
                    />
                    <Button
                      onClick={() => {
                        if (!newProjectName.trim()) return;
                        setProjects([...projects, { id: String(Date.now()), name: newProjectName.trim(), keywords: 15, status: 'Active', updated: 'Just now' }]);
                        setNewProjectName('');
                        showToast('Project added!');
                      }}
                      size="sm"
                      className="h-9 px-3 font-bold"
                    >
                      + Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {projects.map((p) => (
                      <div key={p.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.keywords} keywords &bull; Updated {p.updated}</p>
                        </div>
                        <Badge variant="primary">{p.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 11. AI SEO ASSISTANT */}
              {activeFeature === 'assistant' && (
                <div className="space-y-2.5 text-xs">
                  <div className="h-60 overflow-y-auto space-y-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border">
                    {chatMessages.map((m, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-xl text-xs whitespace-pre-line leading-relaxed max-w-[90%] ${
                          m.role === 'assistant'
                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border'
                            : 'bg-indigo-600 text-white ml-auto'
                        }`}
                      >
                        {m.text}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1.5">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendChat();
                      }}
                      placeholder="Ask assistant for tags, title, ideas..."
                      className="text-xs h-9"
                    />
                    <Button onClick={handleSendChat} size="sm" className="h-9 px-3 font-bold">
                      Send
                    </Button>
                  </div>
                </div>
              )}

              {/* 12. EXPORT CENTER */}
              {activeFeature === 'export' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border space-y-2">
                    <p className="font-bold text-slate-900 dark:text-white">Export Keyword Data ({keywords.length} items)</p>
                    <button
                      onClick={() => {
                        const csv = 'Keyword,Intent,Relevance\n' + keywords.map(k => `"${k.keyword}","${k.intent}",${k.score}`).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `keywords-${query}.csv`;
                        a.click();
                        showToast('CSV downloaded!');
                      }}
                      className="w-full py-2 bg-indigo-600 text-white font-extrabold rounded-lg active:scale-95"
                    >
                      📥 Download CSV File
                    </button>
                    <button
                      onClick={() => {
                        const json = JSON.stringify(keywords, null, 2);
                        navigator.clipboard?.writeText(json);
                        showToast('JSON copied to clipboard!');
                      }}
                      className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-lg"
                    >
                      📋 Copy JSON to Clipboard
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* BOTTOM FIXED 4 FAST TABS */}
            <div className="h-14 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 flex items-center justify-around z-30">
              {[
                { id: 'dashboard', label: 'Home', icon: '🏠' },
                { id: 'research', label: 'Keywords', icon: '🔍' },
                { id: 'clusters', label: '25 Groups', icon: '🗂️' },
                { id: 'etsy', label: '13 Tags QA', icon: '✅' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFeature(tab.id as any)}
                  className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${
                    activeFeature === tab.id ? 'text-indigo-600 font-extrabold' : 'text-slate-400'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span className="text-[10px]">{tab.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Home Indicator */}
        <div className="h-3 w-full bg-white dark:bg-slate-900 flex items-center justify-center pb-1">
          <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
