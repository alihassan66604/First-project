/** Core database & application types for SEO Pilot */

export type UserRole = 'owner' | 'office' | 'user';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  theme_preference: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  seed_keywords: string[];
  created_at: string;
  updated_at: string;
}

export type KeywordSource = 
  | 'local_expansion' 
  | 'manual' 
  | 'google_autocomplete' 
  | 'etsy_autocomplete';

export type SearchIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';

export interface KeywordResearchRun {
  id: string;
  user_id: string;
  project_id: string | null;
  seed_keyword: string;
  source: KeywordSource;
  language?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Keyword {
  id: string;
  research_run_id: string;
  user_id: string;
  keyword: string;
  source: KeywordSource;
  language?: string;
  search_intent: SearchIntent;
  relevance_score: number;
  is_selected: boolean;
  collected_at: string;
}

export interface KeywordCluster {
  id: string;
  user_id: string;
  project_id: string | null;
  name: string;
  primary_keyword: string;
  search_intent: SearchIntent;
  suggested_content_type: string | null;
  keywords?: Keyword[];
  created_at: string;
  updated_at: string;
}

export interface ClusterKeyword {
  id: string;
  cluster_id: string;
  keyword_id: string;
  is_primary: boolean;
  added_at: string;
}

export interface ChecklistItem {
  label: string;
  checked: boolean;
}

export interface EtsyListingDraft {
  id: string;
  user_id: string;
  project_id: string | null;
  product_type: string;
  main_keyword: string;
  target_audience: string;
  product_features: string[];
  related_keywords: string[];
  existing_listing_text: string | null;
  generated_title: string;
  generated_tags: string[];
  generated_description: string;
  primary_keyword: string;
  secondary_keywords: string[];
  keyword_placement_tips: string[];
  improvement_checklist: ChecklistItem[];
  created_at: string;
  updated_at: string;
}

export interface BlogOutlineSection {
  heading: string;
  level: 'h1' | 'h2' | 'h3';
  content_prompt: string;
  keywords_to_include: string[];
}

export interface BlogDraft {
  id: string;
  user_id: string;
  project_id: string | null;
  main_keyword: string;
  blog_titles: string[];
  selected_title: string | null;
  outline: BlogOutlineSection[];
  meta_title: string;
  meta_description: string;
  faq_questions: string[];
  related_keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface SeoCheck {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details: string | null;
}

export interface SeoAudit {
  id: string;
  user_id: string;
  project_id: string | null;
  content_text: string;
  target_keyword: string;
  overall_score: number;
  checks: SeoCheck[];
  recommendations: string[];
  created_at: string;
}

export interface ProductIdea {
  id: string;
  user_id: string;
  project_id: string | null;
  niche: string;
  product_concept: string;
  target_audience: string;
  related_keywords: string[];
  suggested_format: string;
  possible_listing_title: string;
  category: string;
  created_at: string;
}

export interface AssistantTask {
  id: string;
  user_id: string;
  project_id: string | null;
  command: string;
  parameters: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  default_keyword_source: KeywordSource;
  notifications_enabled: boolean;
  updated_at: string;
}

/** Email / Gmail Center Types */
export interface EmailMessage {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  preview: string;
  body: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'starred' | 'trash';
  category: 'primary' | 'seo_alerts' | 'etsy_leads' | 'system';
  isStarred: boolean;
  isRead: boolean;
  timestamp: string;
}
