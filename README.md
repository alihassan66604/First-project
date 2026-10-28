# 🚀 SEO Pilot — Free SEO Research & Optimization Platform

**Version:** 1.0  
**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + RLS)  
**Budget:** $0 (Zero paid APIs, zero fake metrics)

---

## 📖 Overview

**SEO Pilot** is a professional, free SEO platform engineered specifically for **Etsy sellers, bloggers, digital product creators, and SEO beginners**.

It solves keyword research, semantic clustering, Etsy listing creation, blog outlines, and SEO audits using **100% deterministic local algorithms and open-source libraries**—without requiring paid API keys or subscriptions.

---

## ✨ Features

1. **Deterministic Keyword Research:**
   - Seed keyword expansion into 30+ high-intent long-tail ideas.
   - Transparent rule-based search intent classification (`transactional`, `commercial`, `informational`, `navigational`).
   - Algorithmic relevance scoring (0.00 – 1.00).
   - Zero fabricated search volume or fake keyword difficulty numbers.

2. **Semantic Keyword Clustering:**
   - Jaccard token similarity clustering.
   - Automatic assignment of Primary and Secondary keywords.
   - Recommended content type mapping per cluster.

3. **Etsy SEO Toolkit:**
   - Front-loaded titles strictly under 140 characters.
   - **Exactly 13 tags** formatted under 20 characters each.
   - Structured product description templates with instant copy.
   - Seller compliance checklist.

4. **Blog SEO Toolkit:**
   - H1, H2, and H3 hierarchical outline generator.
   - Actionable section writing prompts.
   - Meta title (30-60 chars) and meta description (120-160 chars) generator.
   - FAQ question builder for featured snippets.

5. **SEO Content Checker:**
   - On-page heuristic score (0–100).
   - Checks title presence/length, meta description, early placement, keyword density (0.5%–2.5%), and heading structure.
   - Transparent scoring breakdown (not an official Google/Etsy grade).

6. **Digital Product Idea Generator:**
   - Generates 8 distinct digital product blueprints per niche across planners, Canva templates, invitations, wall art, trackers, checklists, worksheets, and business templates.

7. **Rule-Based SEO Assistant:**
   - Quick slash commands (`research`, `cluster`, `etsy`, `blog`, `ideas`, `export csv`, `help`).
   - Multi-step memory context across actions.

8. **RFC 4180 CSV Export:**
   - Download keyword lists and cluster tables directly into Excel or Google Sheets.

9. **Security & Authentication:**
   - Supabase Auth session management.
   - PostgreSQL Row Level Security (RLS) on all 12 tables.
   - Route protection middleware: Only `/login` and `/signup` are public; all other routes require authentication.

---

## 📁 Project Structure

```
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  # Complete 12-table PostgreSQL schema with RLS
│       └── README.md               # Supabase setup instructions
├── src/
│   ├── app/
│   │   ├── (auth)/                 # Public routes
│   │   │   ├── login/              # Sign in & password reset
│   │   │   └── signup/             # Account registration
│   │   ├── (protected)/            # Authenticated application routes
│   │   │   ├── dashboard/          # Hub & quick search
│   │   │   ├── keywords/
│   │   │   │   ├── research/       # Long-tail keyword finder
│   │   │   │   └── clusters/       # Semantic clustering
│   │   │   ├── tools/
│   │   │   │   ├── etsy/           # Title & 13 tags generator
│   │   │   │   ├── blog/           # Outlines & meta tags
│   │   │   │   ├── seo-checker/    # Content audit
│   │   │   │   └── product-ideas/  # Digital product brainstormer
│   │   │   ├── projects/           # Saved workspaces
│   │   │   ├── assistant/          # Rule-based command assistant
│   │   │   ├── export/             # CSV download center
│   │   │   └── settings/           # Profile & password
│   │   ├── globals.css             # Tailwind base styles
│   │   └── layout.tsx              # Root HTML shell
│   ├── components/
│   │   ├── ui/                     # Design primitives (Button, Card, Input, etc.)
│   │   └── layout/                 # Sidebar, Navbar, and UserMenu
│   ├── lib/
│   │   ├── constants.ts            # App tokens, Etsy limits, SEO thresholds
│   │   ├── supabase/               # Browser, Server, & Middleware clients
│   │   ├── keywords/               # Expansion, clustering, intent, normalize
│   │   ├── templates/              # Etsy, blog, & product blueprints
│   │   ├── seo/                    # Audit & scoring engine
│   │   ├── export/                 # RFC 4180 CSV exporter
│   │   └── assistant/              # Deterministic command execution engine
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── middleware.ts               # Next.js route protection middleware
│   └── __tests__/                  # Unit test suites (Vitest)
└── package.json
```

---

## 🛠️ Setup & Local Development

### 1. Prerequisites
- Node.js 18+ installed on your system.

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Edit `.env.local` with your free Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Setup Supabase Database
1. Create a free account at [Supabase.com](https://supabase.com).
2. Create a new project.
3. Open **SQL Editor** in the left sidebar.
4. Paste the entire content of [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).
5. Click **Run**. All 12 tables, indexes, triggers, and Row Level Security policies will be configured instantly.

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

Run the full automated test suite with Vitest:
```bash
npm run test:run
```
To run tests in watch mode:
```bash
npm test
```

---

## 🔒 Security Best Practices Implemented

- **No Secrets in Code:** Sensitive keys only in `.env.local` (included in `.gitignore`).
- **Database Row Level Security (RLS):** Every query checks `auth.uid() = user_id`.
- **Route Guard Middleware:** Unauthenticated requests to `/dashboard`, `/keywords/*`, `/tools/*`, etc., are automatically redirected to `/login`.
- **Zero Hallucinated Metrics:** Clear UI labeling that metrics are deterministic local heuristics.
