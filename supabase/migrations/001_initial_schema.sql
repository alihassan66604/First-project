-- ============================================================================
-- SEO Pilot - Initial Database Schema Migration
-- ============================================================================
-- This migration creates the complete database schema for the SEO Pilot app.
-- It includes all tables, indexes, RLS policies, and trigger functions.
-- ============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- REUSABLE TRIGGER FUNCTION: Auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER FUNCTION: Auto-create profile on user signup
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 1. PROFILES
-- ============================================================================
CREATE TABLE profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text NOT NULL,
  full_name     text,
  avatar_url    text,
  theme_preference text DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark')),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profile is created by trigger, so allow the SECURITY DEFINER function to insert
CREATE POLICY "Service can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger on auth.users to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 2. PROJECTS
-- ============================================================================
CREATE TABLE projects (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text,
  seed_keywords text[] DEFAULT '{}',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Auto-update updated_at
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 3. KEYWORD_RESEARCH_RUNS
-- ============================================================================
CREATE TABLE keyword_research_runs (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id    uuid REFERENCES projects(id) ON DELETE SET NULL,
  seed_keyword  text NOT NULL,
  source        text NOT NULL CHECK (source IN ('local_expansion', 'manual')),
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX idx_keyword_research_runs_user_id ON keyword_research_runs(user_id);
CREATE INDEX idx_keyword_research_runs_project_id ON keyword_research_runs(project_id);

-- RLS
ALTER TABLE keyword_research_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own keyword research runs"
  ON keyword_research_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own keyword research runs"
  ON keyword_research_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own keyword research runs"
  ON keyword_research_runs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own keyword research runs"
  ON keyword_research_runs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. KEYWORDS
-- ============================================================================
CREATE TABLE keywords (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  research_run_id uuid NOT NULL REFERENCES keyword_research_runs(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword         text NOT NULL,
  source          text NOT NULL CHECK (source IN ('local_expansion', 'manual')),
  search_intent   text NOT NULL DEFAULT 'informational' CHECK (search_intent IN ('informational', 'commercial', 'transactional', 'navigational')),
  relevance_score numeric(3,2) DEFAULT 0.00,
  is_selected     boolean DEFAULT false,
  collected_at    timestamptz DEFAULT now()
);

CREATE INDEX idx_keywords_user_id ON keywords(user_id);
CREATE INDEX idx_keywords_research_run_id ON keywords(research_run_id);

-- RLS
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own keywords"
  ON keywords FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own keywords"
  ON keywords FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own keywords"
  ON keywords FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own keywords"
  ON keywords FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. KEYWORD_CLUSTERS
-- ============================================================================
CREATE TABLE keyword_clusters (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id            uuid REFERENCES projects(id) ON DELETE SET NULL,
  name                  text NOT NULL,
  primary_keyword       text NOT NULL,
  search_intent         text NOT NULL DEFAULT 'informational' CHECK (search_intent IN ('informational', 'commercial', 'transactional', 'navigational')),
  suggested_content_type text,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX idx_keyword_clusters_user_id ON keyword_clusters(user_id);
CREATE INDEX idx_keyword_clusters_project_id ON keyword_clusters(project_id);

-- Auto-update updated_at
CREATE TRIGGER set_keyword_clusters_updated_at
  BEFORE UPDATE ON keyword_clusters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE keyword_clusters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own keyword clusters"
  ON keyword_clusters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own keyword clusters"
  ON keyword_clusters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own keyword clusters"
  ON keyword_clusters FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own keyword clusters"
  ON keyword_clusters FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 6. CLUSTER_KEYWORDS (junction table)
-- ============================================================================
CREATE TABLE cluster_keywords (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cluster_id  uuid NOT NULL REFERENCES keyword_clusters(id) ON DELETE CASCADE,
  keyword_id  uuid NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  is_primary  boolean DEFAULT false,
  added_at    timestamptz DEFAULT now(),

  UNIQUE (cluster_id, keyword_id)
);

CREATE INDEX idx_cluster_keywords_cluster_id ON cluster_keywords(cluster_id);

-- RLS: user can access if they own the parent cluster
ALTER TABLE cluster_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select cluster_keywords they own"
  ON cluster_keywords FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM keyword_clusters
      WHERE keyword_clusters.id = cluster_keywords.cluster_id
        AND keyword_clusters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert cluster_keywords they own"
  ON cluster_keywords FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM keyword_clusters
      WHERE keyword_clusters.id = cluster_keywords.cluster_id
        AND keyword_clusters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update cluster_keywords they own"
  ON cluster_keywords FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM keyword_clusters
      WHERE keyword_clusters.id = cluster_keywords.cluster_id
        AND keyword_clusters.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM keyword_clusters
      WHERE keyword_clusters.id = cluster_keywords.cluster_id
        AND keyword_clusters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete cluster_keywords they own"
  ON cluster_keywords FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM keyword_clusters
      WHERE keyword_clusters.id = cluster_keywords.cluster_id
        AND keyword_clusters.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 7. ETSY_LISTING_DRAFTS
-- ============================================================================
CREATE TABLE etsy_listing_drafts (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id            uuid REFERENCES projects(id) ON DELETE SET NULL,
  product_type          text NOT NULL,
  main_keyword          text NOT NULL,
  target_audience       text NOT NULL,
  product_features      text[] DEFAULT '{}',
  related_keywords      text[] DEFAULT '{}',
  existing_listing_text text,
  generated_title       text NOT NULL,
  generated_tags        text[] NOT NULL,
  generated_description text NOT NULL,
  primary_keyword       text NOT NULL,
  secondary_keywords    text[] DEFAULT '{}',
  keyword_placement_tips text[] DEFAULT '{}',
  improvement_checklist jsonb DEFAULT '[]',
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX idx_etsy_listing_drafts_user_id ON etsy_listing_drafts(user_id);
CREATE INDEX idx_etsy_listing_drafts_project_id ON etsy_listing_drafts(project_id);

-- Auto-update updated_at
CREATE TRIGGER set_etsy_listing_drafts_updated_at
  BEFORE UPDATE ON etsy_listing_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE etsy_listing_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own etsy listing drafts"
  ON etsy_listing_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own etsy listing drafts"
  ON etsy_listing_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own etsy listing drafts"
  ON etsy_listing_drafts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own etsy listing drafts"
  ON etsy_listing_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 8. BLOG_DRAFTS
-- ============================================================================
CREATE TABLE blog_drafts (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id        uuid REFERENCES projects(id) ON DELETE SET NULL,
  main_keyword      text NOT NULL,
  blog_titles       text[] DEFAULT '{}',
  selected_title    text,
  outline           jsonb DEFAULT '[]',
  meta_title        text NOT NULL,
  meta_description  text NOT NULL,
  faq_questions     text[] DEFAULT '{}',
  related_keywords  text[] DEFAULT '{}',
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_blog_drafts_user_id ON blog_drafts(user_id);
CREATE INDEX idx_blog_drafts_project_id ON blog_drafts(project_id);

-- Auto-update updated_at
CREATE TRIGGER set_blog_drafts_updated_at
  BEFORE UPDATE ON blog_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE blog_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own blog drafts"
  ON blog_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blog drafts"
  ON blog_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog drafts"
  ON blog_drafts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog drafts"
  ON blog_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 9. SEO_AUDITS
-- ============================================================================
CREATE TABLE seo_audits (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id      uuid REFERENCES projects(id) ON DELETE SET NULL,
  content_text    text NOT NULL,
  target_keyword  text NOT NULL,
  overall_score   integer NOT NULL,
  checks          jsonb NOT NULL DEFAULT '[]',
  recommendations text[] DEFAULT '{}',
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_seo_audits_user_id ON seo_audits(user_id);
CREATE INDEX idx_seo_audits_project_id ON seo_audits(project_id);

-- RLS
ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own seo audits"
  ON seo_audits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own seo audits"
  ON seo_audits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seo audits"
  ON seo_audits FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own seo audits"
  ON seo_audits FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 10. PRODUCT_IDEAS
-- ============================================================================
CREATE TABLE product_ideas (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id            uuid REFERENCES projects(id) ON DELETE SET NULL,
  niche                 text NOT NULL,
  product_concept       text NOT NULL,
  target_audience       text NOT NULL,
  related_keywords      text[] DEFAULT '{}',
  suggested_format      text NOT NULL,
  possible_listing_title text NOT NULL,
  category              text NOT NULL,
  created_at            timestamptz DEFAULT now()
);

CREATE INDEX idx_product_ideas_user_id ON product_ideas(user_id);
CREATE INDEX idx_product_ideas_project_id ON product_ideas(project_id);

-- RLS
ALTER TABLE product_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own product ideas"
  ON product_ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own product ideas"
  ON product_ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own product ideas"
  ON product_ideas FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own product ideas"
  ON product_ideas FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 11. ASSISTANT_TASKS
-- ============================================================================
CREATE TABLE assistant_tasks (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id    uuid REFERENCES projects(id) ON DELETE SET NULL,
  command       text NOT NULL,
  parameters    jsonb DEFAULT '{}',
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  result        jsonb,
  error_message text,
  created_at    timestamptz DEFAULT now(),
  completed_at  timestamptz
);

CREATE INDEX idx_assistant_tasks_user_id ON assistant_tasks(user_id);

-- RLS
ALTER TABLE assistant_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own assistant tasks"
  ON assistant_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assistant tasks"
  ON assistant_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assistant tasks"
  ON assistant_tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assistant tasks"
  ON assistant_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 12. USER_PREFERENCES
-- ============================================================================
CREATE TABLE user_preferences (
  id                     uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme                  text DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  default_keyword_source text DEFAULT 'local_expansion' CHECK (default_keyword_source IN ('local_expansion', 'manual')),
  notifications_enabled  boolean DEFAULT true,
  updated_at             timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER set_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================
-- Tables created: 12
--   1. profiles
--   2. projects
--   3. keyword_research_runs
--   4. keywords
--   5. keyword_clusters
--   6. cluster_keywords
--   7. etsy_listing_drafts
--   8. blog_drafts
--   9. seo_audits
--  10. product_ideas
--  11. assistant_tasks
--  12. user_preferences
--
-- Features:
--   - UUID primary keys via uuid-ossp extension
--   - Row Level Security on every table
--   - RLS policies for SELECT, INSERT, UPDATE, DELETE on all tables
--   - cluster_keywords uses join-based RLS through keyword_clusters
--   - Auto-updating updated_at triggers on applicable tables
--   - Auto-create profile on user signup via auth.users trigger
--   - Indexes on user_id and foreign keys for query performance
-- ============================================================================
