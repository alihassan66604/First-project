export type SearchIntent = 'commercial' | 'transactional' | 'informational' | 'navigational';

export interface KeywordItem {
  id: string;
  keyword: string;
  search_intent: SearchIntent;
  relevance_score: number;
  source: 'google_autocomplete' | 'etsy_autocomplete';
  language: string;
}

export interface ClusterGroup {
  id: string;
  name: string;
  intent: SearchIntent;
  keywords: string[];
}

export interface ProductIdea {
  id: string;
  category: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  estPrice: string;
  tags: string[];
  audience: string;
}

export interface UserSession {
  email: string;
  role: 'user' | 'client';
  token: string;
  name: string;
  shopName?: string;
}

export type TabType =
  | 'dashboard'
  | 'keywords'
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
  | 'profile';
