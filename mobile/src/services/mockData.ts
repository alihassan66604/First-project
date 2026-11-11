import { ProductIdea, KeywordItem, SearchIntent, ClusterGroup } from '../types';

export const DIGITAL_PRODUCT_IDEAS: ProductIdea[] = [
  // 1. Notion Templates
  { id: 'p1', category: 'Notion Templates', title: 'Second Brain All-in-One Life OS', difficulty: 'Medium', estPrice: '$15 - $29', audience: 'Students & Professionals', tags: ['notion template', 'second brain', 'life planner', 'productivity dashboard'] },
  { id: 'p2', category: 'Notion Templates', title: 'Freelancer Client CRM & Invoice Tracker', difficulty: 'Easy', estPrice: '$12 - $22', audience: 'Freelancers & Agencies', tags: ['client portal', 'notion crm', 'invoice tracker', 'freelance hub'] },
  { id: 'p3', category: 'Notion Templates', title: 'Content Creator Social Media Planner', difficulty: 'Easy', estPrice: '$9 - $19', audience: 'YouTubers & Creators', tags: ['content calendar', 'social media planner', 'youtube dashboard'] },
  { id: 'p4', category: 'Notion Templates', title: 'Student Academic Study & Exam Hub', difficulty: 'Easy', estPrice: '$7 - $15', audience: 'College & High School', tags: ['student notion', 'study planner', 'gpa tracker', 'homework log'] },
  { id: 'p5', category: 'Notion Templates', title: 'Habit Tracker & 30-Day Routine Challenge', difficulty: 'Easy', estPrice: '$5 - $12', audience: 'Self-Improvement Enthusiasts', tags: ['habit tracker', 'daily routine', 'atomic habits', 'wellness log'] },
  { id: 'p6', category: 'Notion Templates', title: 'Home Inventory & Grocery Meal Planner', difficulty: 'Medium', estPrice: '$9 - $18', audience: 'Homeowners & Families', tags: ['home inventory', 'meal planner', 'recipe organizer', 'grocery list'] },

  // 2. Canva Templates
  { id: 'p7', category: 'Canva Templates', title: 'Instagram Carousel Coaching Kit (50 Posts)', difficulty: 'Medium', estPrice: '$14 - $27', audience: 'Life & Business Coaches', tags: ['canva instagram', 'carousel template', 'coach branding', 'social kit'] },
  { id: 'p8', category: 'Canva Templates', title: 'Modern Real Estate Marketing Flyer Pack', difficulty: 'Easy', estPrice: '$12 - $25', audience: 'Realtors & Brokers', tags: ['real estate canva', 'open house flyer', 'property brochure', 'just listed'] },
  { id: 'p9', category: 'Canva Templates', title: 'Podcast Cover & Episode Graphic Kit', difficulty: 'Easy', estPrice: '$9 - $19', audience: 'Podcasters & Audio Hosts', tags: ['podcast artwork', 'canva podcast cover', 'audiogram template'] },
  { id: 'p10', category: 'Canva Templates', title: 'Restaurant & Cafe Modern Menu Bundle', difficulty: 'Easy', estPrice: '$15 - $30', audience: 'Bistro & Cafe Owners', tags: ['canva menu template', 'food menu design', 'drinks list', 'table card'] },
  { id: 'p11', category: 'Canva Templates', title: 'Etsy Shop Banner & Branding Aesthetic Suite', difficulty: 'Easy', estPrice: '$10 - $20', audience: 'New Etsy Sellers', tags: ['etsy shop banner', 'shop icon template', 'thank you card', 'receipt card'] },

  // 3. GoodNotes & iPad Planners
  { id: 'p12', category: 'GoodNotes Planners', title: 'Ultimate 2026 Hyperlinked Digital Life Planner', difficulty: 'Advanced', estPrice: '$19 - $35', audience: 'iPad & Tablet Users', tags: ['goodnotes planner', 'digital life planner', 'hyperlinked pdf', 'ipad journal'] },
  { id: 'p13', category: 'GoodNotes Planners', title: 'Dark Mode Minimalist Daily Schedule Journal', difficulty: 'Medium', estPrice: '$12 - $24', audience: 'Night Owls & Techies', tags: ['dark mode goodnotes', 'digital daily planner', 'routine schedule'] },
  { id: 'p14', category: 'GoodNotes Planners', title: 'Digital Reading Journal with 100+ Bookshelf Tabs', difficulty: 'Medium', estPrice: '$10 - $18', audience: 'Book Lovers & BookTok', tags: ['digital reading log', 'goodnotes book tracker', 'bookshelf sticker'] },
  { id: 'p15', category: 'GoodNotes Planners', title: 'Fitness, Workout & Calorie Tracker for iPad', difficulty: 'Medium', estPrice: '$12 - $22', audience: 'Gymgoers & Athletes', tags: ['goodnotes workout log', 'fitness planner pdf', 'macro tracker'] },
  { id: 'p16', category: 'GoodNotes Planners', title: 'Digital Sticker Book with 500+ Pre-Cropped PNGs', difficulty: 'Easy', estPrice: '$8 - $16', audience: 'GoodNotes Customizers', tags: ['digital stickers png', 'goodnotes sticker book', 'aesthetic doodles'] },

  // 4. Wedding Stationery
  { id: 'p17', category: 'Wedding Stationery', title: 'Minimalist Boho Wedding Invitation Suite (5-in-1)', difficulty: 'Medium', estPrice: '$15 - $32', audience: 'Brides & Event Planners', tags: ['boho wedding invite', 'canva wedding template', 'rsvp card', 'details card'] },
  { id: 'p18', category: 'Wedding Stationery', title: 'Arched Wedding Table Numbers & Seating Chart', difficulty: 'Easy', estPrice: '$10 - $20', audience: 'Modern Couples', tags: ['wedding seating chart', 'table number cards', 'reception stationery'] },
  { id: 'p19', category: 'Wedding Stationery', title: 'Wedding Budget, Guest List & Timeline Spreadsheet', difficulty: 'Medium', estPrice: '$12 - $22', audience: 'DIY Brides', tags: ['wedding budget tracker', 'google sheets wedding', 'guest list manager'] },
  { id: 'p20', category: 'Wedding Stationery', title: 'Bridal Shower Games Printable Bundle (12 Games)', difficulty: 'Easy', estPrice: '$7 - $15', audience: 'Maids of Honor', tags: ['bridal shower games', 'printable bachelorette', 'wedding trivia'] },

  // 5. Budgeting & Finance
  { id: 'p21', category: 'Budgeting & Finance', title: 'Monthly Automated Budget Spreadsheet (Google Sheets)', difficulty: 'Medium', estPrice: '$10 - $25', audience: 'Budgeters & Families', tags: ['monthly budget sheet', 'automated finance tracker', 'debt snowball'] },
  { id: 'p22', category: 'Budgeting & Finance', title: '50-30-20 Rule Paycheck Budgeting Workbook', difficulty: 'Easy', estPrice: '$8 - $18', audience: 'Young Professionals', tags: ['paycheck budget', '50 30 20 calculator', 'savings challenge'] },
  { id: 'p23', category: 'Budgeting & Finance', title: 'Net Worth & Investment Portfolio Dashboard', difficulty: 'Medium', estPrice: '$15 - $29', audience: 'Retail Investors & FIRE', tags: ['net worth tracker', 'investment google sheets', 'crypto stock tracker'] },
  { id: 'p24', category: 'Budgeting & Finance', title: 'Small Business Bookkeeping & Tax Prep Sheet', difficulty: 'Medium', estPrice: '$14 - $30', audience: 'Etsy & Solo Entrepreneurs', tags: ['small business bookkeeping', 'etsy income tracker', 'tax ledger'] },

  // 6. Wall Art & Line Art
  { id: 'p25', category: 'Printable Wall Art', title: 'Neutral Abstract Botanical Wall Art (Set of 6)', difficulty: 'Easy', estPrice: '$7 - $18', audience: 'Interior Decorators & Renters', tags: ['botanical wall art', 'printable gallery set', 'abstract leaf print'] },
  { id: 'p26', category: 'Printable Wall Art', title: 'Mid-Century Modern Geometric Gallery Art', difficulty: 'Easy', estPrice: '$8 - $19', audience: 'Modern Home Stylists', tags: ['mid century modern print', 'geometric wall decor', 'minimalist poster'] },
  { id: 'p27', category: 'Printable Wall Art', title: 'Inspirational Retro Typography Quote Prints', difficulty: 'Easy', estPrice: '$6 - $14', audience: 'College Dorms & Offices', tags: ['retro quote poster', 'typography wall art', 'positive vibes print'] },

  // 7. Kids & Educational
  { id: 'p28', category: 'Kids & Learning', title: 'Toddler Busy Book & Homeschool Learning Binder', difficulty: 'Medium', estPrice: '$9 - $20', audience: 'Moms & Preschool Teachers', tags: ['toddler busy book', 'preschool printables', 'homeschool binder'] },
  { id: 'p29', category: 'Kids & Learning', title: 'Handwriting & Alphabet Tracing Worksheets Pack', difficulty: 'Easy', estPrice: '$5 - $12', audience: 'Kindergarten Parents', tags: ['alphabet tracing worksheets', 'handwriting practice', 'kids learning sheets'] },
  { id: 'p30', category: 'Kids & Learning', title: 'Reward & Chore Chart for Kids (Printable + Editable)', difficulty: 'Easy', estPrice: '$6 - $14', audience: 'Parents', tags: ['kids chore chart', 'routine visual board', 'behavior sticker chart'] },

  // 8. Resume & Career
  { id: 'p31', category: 'Resume & Career', title: 'Executive ATS-Friendly Resume & Cover Letter Pack', difficulty: 'Easy', estPrice: '$12 - $24', audience: 'Job Seekers & Executives', tags: ['ats resume template', 'modern cv template', 'cover letter format'] },
  { id: 'p32', category: 'Resume & Career', title: 'Clean Tech & Software Engineer Minimalist Resume', difficulty: 'Easy', estPrice: '$10 - $20', audience: 'Developers & Designers', tags: ['developer resume', 'minimalist cv word', 'portfolio resume'] },
];

export const TRADEMARK_BLACKLIST = [
  'disney', 'nike', 'apple', 'iphone', 'lego', 'barbie', 'cricut', 'chanel', 'gucci', 'tiffany', 'marvel', 'star wars'
];

export function generateLocalKeywords(query: string, lang: string = 'en', targetCount: number = 50): KeywordItem[] {
  const q = query.trim().toLowerCase();
  const prefixes = ['best', 'how to make', 'diy', 'printable', 'digital', 'editable', 'free download', 'top', 'affordable'];
  const suffixes = ['template', 'ideas', 'for beginners', '2026', 'checklist', 'bundle', 'pdf', 'canva', 'goodnotes'];
  
  const results: KeywordItem[] = [
    { id: `kw-0`, keyword: q, search_intent: 'informational', relevance_score: 1.0, source: 'google_autocomplete', language: lang }
  ];

  let idCounter = 1;

  for (const pre of prefixes) {
    if (results.length >= targetCount) break;
    results.push({
      id: `kw-${idCounter++}`,
      keyword: `${pre} ${q}`,
      search_intent: pre.includes('make') || pre.includes('how') ? 'informational' : pre.includes('free') ? 'transactional' : 'commercial',
      relevance_score: 0.95,
      source: 'google_autocomplete',
      language: lang
    });
  }

  for (const suf of suffixes) {
    if (results.length >= targetCount) break;
    results.push({
      id: `kw-${idCounter++}`,
      keyword: `${q} ${suf}`,
      search_intent: suf.includes('template') || suf.includes('bundle') ? 'transactional' : 'commercial',
      relevance_score: 0.92,
      source: 'google_autocomplete',
      language: lang
    });
  }

  for (const pre of prefixes) {
    for (const suf of suffixes) {
      if (results.length >= targetCount) break;
      results.push({
        id: `kw-${idCounter++}`,
        keyword: `${pre} ${q} ${suf}`,
        search_intent: 'transactional',
        relevance_score: 0.88,
        source: 'google_autocomplete',
        language: lang
      });
    }
    if (results.length >= targetCount) break;
  }

  return results;
}

export function clusterKeywordsLocally(keywords: string[], targetGroups: number = 25): ClusterGroup[] {
  const clusters: ClusterGroup[] = [];
  const words = keywords.filter(Boolean);

  if (words.length === 0) return [];

  const chunkSize = Math.max(1, Math.ceil(words.length / targetGroups));

  for (let i = 0; i < targetGroups; i++) {
    const chunk = words.slice(i * chunkSize, (i + 1) * chunkSize);
    if (chunk.length === 0) break;

    const groupTitle = chunk[0]
      .split(' ')
      .slice(0, 3)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') + ` Cluster #${i + 1}`;

    clusters.push({
      id: `group-${i + 1}`,
      name: groupTitle,
      intent: i % 2 === 0 ? 'transactional' : 'commercial',
      keywords: chunk
    });
  }

  return clusters;
}
