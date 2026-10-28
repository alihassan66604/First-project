# Supabase Migrations

## How to Run the Migration

### Option 1: Supabase Dashboard (Recommended for first setup)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire contents of [`001_initial_schema.sql`](./001_initial_schema.sql)
6. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)
7. Verify the tables were created by checking **Table Editor** in the sidebar

### Option 2: Supabase CLI

If you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed:

```bash
# Link to your remote project (if not already linked)
supabase link --project-ref <your-project-ref>

# Push all migrations
supabase db push
```

## Migration Files

| File | Description |
|------|-------------|
| `001_initial_schema.sql` | Creates the complete database schema with 12 tables, RLS policies, indexes, and triggers |

## Schema Overview

The migration creates the following tables:

- **profiles** – User profiles, auto-created on signup
- **projects** – User projects containing seed keywords
- **keyword_research_runs** – Tracks keyword research sessions
- **keywords** – Individual keywords collected from research
- **keyword_clusters** – Groups of related keywords
- **cluster_keywords** – Junction table linking keywords to clusters
- **etsy_listing_drafts** – AI-generated Etsy listing content
- **blog_drafts** – AI-generated blog post drafts
- **seo_audits** – SEO content audit results
- **product_ideas** – AI-generated product ideas
- **assistant_tasks** – Task queue for AI assistant commands
- **user_preferences** – Per-user app settings

## Security

- **Row Level Security (RLS)** is enabled on every table
- Users can only access their own data via `auth.uid()` policies
- `cluster_keywords` uses join-based RLS through `keyword_clusters` ownership
