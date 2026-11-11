import type { ProductIdea } from '@/types';

interface NicheTemplate {
  category: string;
  subCategories: {
    concept: (n: string, lang: string) => string;
    audience: (n: string, lang: string) => string;
    format: string;
    title: (n: string, lang: string) => string;
    keywords: string[];
  }[];
}

const CATEGORIES_DATA: NicheTemplate[] = [
  {
    category: 'Planners & Agendas',
    subCategories: [
      {
        concept: (n, l) => `All-in-One Daily & Weekly ${n} Growth Planner`,
        audience: (n, l) => `Busy individuals and enthusiasts organizing their ${n} routine`,
        format: 'Printable PDF (A4, A5, US Letter) & GoodNotes Digital Interactive PDF',
        title: (n, l) => `Editable ${n} Planner | Daily Weekly Monthly Routine Tracker Printable`,
        keywords: ['daily planner', 'weekly routine', 'undated planner', 'printable insert']
      },
      {
        concept: (n, l) => `Minimalist Monthly & Quarterly ${n} Goal Setting Planner`,
        audience: (n, l) => `Goal-oriented professionals tracking ${n} objectives`,
        format: 'Fillable PDF & Hyperlinked Tablet Digital Planner',
        title: (n, l) => `Minimalist ${n} Goal Planner | 90-Day Quarterly Growth Journal`,
        keywords: ['monthly agenda', 'quarterly goals', 'goal planner', 'digital planner']
      },
      {
        concept: (n, l) => `Academic & Student Semester ${n} Study Planner`,
        audience: (n, l) => `Students and self-learners managing study schedules`,
        format: 'A4 Printable PDF + iPad GoodNotes Interactive Notes',
        title: (n, l) => `Student ${n} Academic Planner | Semester Study Schedule Template`,
        keywords: ['student planner', 'study schedule', 'semester tracker', 'exam prep']
      },
      {
        concept: (n, l) => `Self-Care & Daily Mindful Reflection Journal for ${n}`,
        audience: (n, l) => `Individuals building healthy wellness habits`,
        format: 'A5 Printable PDF & Printable Journaling Pages',
        title: (n, l) => `Mindful ${n} Reflection Journal | Daily Mindfulness & Self Care Sheet`,
        keywords: ['wellness journal', 'self care planner', 'daily reflection', 'habit log']
      },
      {
        concept: (n, l) => `Budget & Expense Tracking Insert for ${n}`,
        audience: (n, l) => `Budget-conscious individuals managing finances`,
        format: 'Printable Sheet & Editable Excel/Google Sheet',
        title: (n, l) => `${n} Budget Tracker | Financial Expense Log Sheet Printable`,
        keywords: ['budget insert', 'expense tracker', 'finance sheet', 'savings log']
      },
      {
        concept: (n, l) => `Fitness & Health Routine Tracker for ${n}`,
        audience: (n, l) => `Fitness enthusiasts and trainers tracking workouts`,
        format: 'Printable Workout PDF & Digital Fitness Log',
        title: (n, l) => `${n} Fitness Tracker | Workout Log & Health Routine Sheet`,
        keywords: ['fitness log', 'workout tracker', 'meal planner', 'health agenda']
      },
      {
        concept: (n, l) => `Family & Household Management Hub for ${n}`,
        audience: (n, l) => `Families coordinating shared routines and chores`,
        format: 'US Letter Printable Binder Pages & Printable Wall Board',
        title: (n, l) => `Family ${n} Organizer | Chore Chart & Home Management Binder`,
        keywords: ['family binder', 'household planner', 'home organizer', 'chore chart']
      }
    ]
  },
  {
    category: 'Templates & Social Media',
    subCategories: [
      {
        concept: (n) => `Canva Editable Social Media & Marketing Kit for ${n}`,
        audience: (n) => `Small business owners, influencers, and creators in ${n}`,
        format: 'Editable Canva Template Link with 50+ Cohesive Layouts',
        title: (n) => `50 Modern ${n} Instagram Templates | Canva Editable Social Media Bundle`,
        keywords: ['canva template', 'social media kit', 'instagram post', 'branding kit']
      },
      {
        concept: (n) => `Pinterest Viral Pin & Blog Header Graphic Kit for ${n}`,
        audience: (n) => `Bloggers and e-commerce stores driving traffic`,
        format: '30 Long-Pin Canva Templates (1000x1500px)',
        title: (n) => `Viral ${n} Pinterest Pin Templates | High-Click Blog Post Graphics`,
        keywords: ['pinterest templates', 'blog pins', 'click-worthy pins', 'traffic kit']
      },
      {
        concept: (n) => `Carousel Infographic & Education Post Pack for ${n}`,
        audience: (n) => `Educators and niche leaders sharing actionable tips`,
        format: '20 Seamless Multi-Slide Carousel Templates in Canva',
        title: (n) => `Educational ${n} Carousel Templates | Instagram LinkedIn Slide Kit`,
        keywords: ['carousel templates', 'educational slides', 'instagram carousel', 'swipe file']
      },
      {
        concept: (n) => `YouTube Thumbnail & Channel Banner Kit for ${n}`,
        audience: (n) => `Video creators and streamers in the ${n} category`,
        format: 'High-CTR Canva Thumbnails & Matching Channel Art',
        title: (n) => `Click-Worthy ${n} YouTube Thumbnails | Channel Art & Banner Pack`,
        keywords: ['youtube thumbnail', 'channel banner', 'video covers', 'creator kit']
      },
      {
        concept: (n) => `TikTok & Reel Vertical Video Title Cards for ${n}`,
        audience: (n) => `Short-form video creators building engaged audiences`,
        format: '1080x1920 Mobile Story & Reel Hook Templates',
        title: (n) => `${n} Reel Hook Templates | TikTok & Shorts Title Card Bundle`,
        keywords: ['reel templates', 'tiktok covers', 'story graphics', 'video hooks']
      },
      {
        concept: (n) => `Newsletter & Email Header Branding Kit for ${n}`,
        audience: (n) => `Substack, Mailchimp, and ConvertKit newsletter writers`,
        format: 'Responsive Email Header Graphics + Footer Sign-Offs',
        title: (n) => `Clean ${n} Newsletter Header Templates | Email Marketing Banner Pack`,
        keywords: ['newsletter header', 'email banner', 'email branding', 'substack art']
      },
      {
        concept: (n) => `Brand Style Guide & Moodboard Template for ${n}`,
        audience: (n) => `Freelance designers and boutique agencies`,
        format: 'Comprehensive 15-Page Canva & Figma Brand Presentation',
        title: (n) => `Professional ${n} Brand Style Guide | Color Palette & Typography Deck`,
        keywords: ['brand guidelines', 'style guide', 'moodboard kit', 'brand identity']
      }
    ]
  },
  {
    category: 'Invitations & Event Stationery',
    subCategories: [
      {
        concept: (n) => `Elegant & Minimalist ${n} Event Invitation Card`,
        audience: (n) => `Event hosts, party planners, and families celebrating ${n}`,
        format: '5x7 inch Editable Canva Template + 1080x1920 Electronic Text Invite',
        title: (n) => `Minimalist ${n} Invitation Template | Digital Electronic & Printable Invite`,
        keywords: ['event invite', 'custom invitation', 'electronic invite', 'printable card']
      },
      {
        concept: (n) => `Complete Table Setting & Menu Card Bundle for ${n}`,
        audience: (n) => `Hosts organizing dinner parties and formal receptions`,
        format: 'Printable Place Cards, Table Numbers & 4x9 Menu Cards',
        title: (n) => `Cohesive ${n} Menu & Table Numbers | Printable Dinner Stationery Bundle`,
        keywords: ['table stationery', 'menu template', 'place cards', 'dinner stationery']
      },
      {
        concept: (n) => `Welcome Sign & Seating Chart Poster for ${n}`,
        audience: (n) => `Couples and venue coordinators organizing grand entrances`,
        format: 'Large Format 18x24 and 24x36 Poster Templates',
        title: (n) => `Modern ${n} Welcome Sign Poster | Large Format Printable Venue Sign`,
        keywords: ['welcome sign', 'seating chart', 'event poster', 'entrance signage']
      },
      {
        concept: (n) => `Thank You & Favor Tags Pack for ${n}`,
        audience: (n) => `Party hosts thanking attendees and gifters`,
        format: '2x3 inch Printable Tag Sheets with Cut Lines',
        title: (n) => `Custom ${n} Thank You Favor Tags | Printable Gift Label Sheets`,
        keywords: ['favor tags', 'thank you card', 'gift labels', 'printable tags']
      },
      {
        concept: (n) => `Save The Date Digital Video & Card Pack for ${n}`,
        audience: (n) => `Hosts announcing upcoming celebrations early`,
        format: 'Animated Mobile Video Invite + Printable Postcard',
        title: (n) => `Animated ${n} Save The Date | Mobile Text Message & Postcard Invite`,
        keywords: ['save the date', 'animated invite', 'mobile announcement', 'calendar card']
      },
      {
        concept: (n) => `Interactive Party Games & Quiz Sheets for ${n}`,
        audience: (n) => `Party guests and hosts entertaining gatherings`,
        format: '5 Printable Game Sheets with Answer Keys',
        title: (n) => `5 Fun ${n} Party Games Pack | Printable Trivia & Icebreaker Sheets`,
        keywords: ['party games', 'printable trivia', 'icebreaker cards', 'guest activity']
      },
      {
        concept: (n) => `Event Program & Order of Ceremony Sheet for ${n}`,
        audience: (n) => `Attendees following structured ceremony events`,
        format: 'Double-Sided Program Card (4x9 or 5x7 inch)',
        title: (n) => `Elegant ${n} Event Program Card | Order of Service Printable Template`,
        keywords: ['event program', 'ceremony sheet', 'order of service', 'program fans']
      }
    ]
  },
  {
    category: 'Wall Art & Home Decor',
    subCategories: [
      {
        concept: (n) => `Modern Botanical & Line Art Typography Prints for ${n}`,
        audience: (n) => `Home decorators, studio owners, and gift buyers`,
        format: 'High-Resolution 300 DPI JPEGs in 5 Scalable Aspect Ratio Files',
        title: (n) => `${n} Wall Art Print | Minimalist Typography Digital Poster Printable`,
        keywords: ['wall art printable', 'gallery wall print', 'modern poster', 'digital decor']
      },
      {
        concept: (n) => `Mid-Century Boho Abstract Gallery Set for ${n}`,
        audience: (n) => `Living room and apartment decorators wanting warmth`,
        format: 'Set of 3 Matching Gallery Wall Prints in 300 DPI',
        title: (n) => `Set of 3 ${n} Boho Prints | Mid-Century Modern Abstract Wall Decor`,
        keywords: ['boho wall art', 'set of 3 prints', 'gallery set', 'earthy posters']
      },
      {
        concept: (n) => `Inspirational Quote & Mindset Poster for ${n}`,
        audience: (n) => `Home office workers, entrepreneurs, and students`,
        format: 'Black & White Clean Typography Print Files',
        title: (n) => `Inspirational ${n} Quote Print | Home Office Minimalist Motivation Art`,
        keywords: ['quote wall art', 'office poster', 'motivational print', 'typography decor']
      },
      {
        concept: (n) => `Retro Vintage Exhibition Style Poster for ${n}`,
        audience: (n) => `Lovers of vintage aesthetic and museum prints`,
        format: 'Textured Art Gallery Poster with Museum Border',
        title: (n) => `Vintage ${n} Exhibition Poster | Retro Aesthetic Museum Art Print`,
        keywords: ['vintage poster', 'exhibition art', 'retro print', 'aesthetic wall art']
      },
      {
        concept: (n) => `Kids Nursery & Playroom Watercolor Art for ${n}`,
        audience: (n) => `Parents decorating nurseries and children's rooms`,
        format: 'Soft Pastel Watercolor Animal & Whimsical Art Files',
        title: (n) => `Nursery ${n} Watercolor Art Print | Cute Child Bedroom Wall Decor`,
        keywords: ['nursery art', 'kids bedroom print', 'watercolor decor', 'playroom poster']
      },
      {
        concept: (n) => `Architectural Blueprint & Schematic Diagram for ${n}`,
        audience: (n) => `Tech enthusiasts, engineers, and modern loft owners`,
        format: 'Dark Blueprint & Light Industrial Vector Line Drawings',
        title: (n) => `Industrial ${n} Blueprint Print | Technical Schematic Wall Art Poster`,
        keywords: ['blueprint art', 'schematic poster', 'technical drawing', 'industrial decor']
      },
      {
        concept: (n) => `Mindful Meditation & Yoga Corner Tapestry/Print for ${n}`,
        audience: (n) => `Wellness studios, yoga teachers, and calm spaces`,
        format: 'Sacred Geometry & Zen Aesthetic Art Suite',
        title: (n) => `Zen ${n} Meditation Print | Mindful Calm Studio Wall Art Decor`,
        keywords: ['zen wall art', 'meditation poster', 'yoga decor', 'calm aesthetic']
      }
    ]
  },
  {
    category: 'Trackers & Automated Spreadsheets',
    subCategories: [
      {
        concept: (n) => `Progress & Goal Habit Tracker Sheet for ${n}`,
        audience: (n) => `Goal-oriented individuals tracking ${n} milestones and habits`,
        format: 'Interactive Google Sheets / Microsoft Excel Sheet + Printable PDF',
        title: (n) => `${n} Progress Tracker | Automated Habit Log & Milestone Chart`,
        keywords: ['progress tracker', 'habit log', 'spreadsheet tracker', 'milestone sheet']
      },
      {
        concept: (n) => `Automated Budget & Debt Snowball Calculator for ${n}`,
        audience: (n) => `Individuals managing paychecks, savings goals, and debts`,
        format: 'Dynamic Google Sheets Template with Automated Visual Charts',
        title: (n) => `Smart ${n} Budget Calculator | Automated Monthly Finance Dashboard`,
        keywords: ['budget spreadsheet', 'debt payoff tracker', 'google sheets budget', 'finance tool']
      },
      {
        concept: (n) => `Project Task & Milestone Gantt Chart Sheet for ${n}`,
        audience: (n) => `Project leads, freelancers, and small teams`,
        format: 'Color-Coded Automated Gantt Schedule in Excel & Sheets',
        title: (n) => `${n} Project Milestone Tracker | Automated Gantt Timeline Spreadsheet`,
        keywords: ['project tracker', 'gantt chart sheet', 'milestone spreadsheet', 'task tracker']
      },
      {
        concept: (n) => `Inventory & Stock Level Management Sheet for ${n}`,
        audience: (n) => `Small business makers, Etsy sellers, and craft shops`,
        format: 'Stock Alert & Cost of Goods Sold Automated Calculator',
        title: (n) => `${n} Inventory Management Sheet | Automated Stock & COGS Calculator`,
        keywords: ['inventory sheet', 'stock tracker', 'small business spreadsheet', 'cogs tracker']
      },
      {
        concept: (n) => `Client CRM & Sales Pipeline Sheet for ${n}`,
        audience: (n) => `Service providers tracking leads and client communications`,
        format: 'Clean Pipeline Dashboard with Follow-Up Date Alerts',
        title: (n) => `Simple ${n} Client CRM Spreadsheet | Sales Pipeline & Lead Tracker`,
        keywords: ['client crm', 'sales pipeline', 'lead tracker sheet', 'freelancer crm']
      },
      {
        concept: (n) => `Reading & Learning Challenge Tracker for ${n}`,
        audience: (n) => `Avid readers, researchers, and book club members`,
        format: 'Book Review Dashboard with Star Rating Graphs',
        title: (n) => `${n} Reading Challenge Sheet | Book Tracker & Review Log Spreadsheet`,
        keywords: ['reading tracker', 'book log spreadsheet', 'learning tracker', 'book review sheet']
      },
      {
        concept: (n) => `Weight, Workout & Measurement Progression Sheet for ${n}`,
        audience: (n) => `Health coaches and trainees tracking body statistics`,
        format: 'Automated Metric/Imperial Measurement Visual Graph Sheet',
        title: (n) => `${n} Fitness Progress Dashboard | Body Measurement & Weight Tracker`,
        keywords: ['body measurement sheet', 'weight loss tracker', 'fitness spreadsheet', 'health log']
      }
    ]
  },
  {
    category: 'Workbooks & Learning Guides',
    subCategories: [
      {
        concept: (n) => `Guided Reflection & Skill-Building Worksheet Workbook for ${n}`,
        audience: (n) => `Students, educators, and coaching clients focusing on ${n}`,
        format: 'Multi-page Printable Workbook (US Letter / A4)',
        title: (n) => `${n} Workbook & Activity Sheets | Educational Guided Worksheets`,
        keywords: ['activity worksheet', 'guided workbook', 'printable exercise', 'coaching tools']
      },
      {
        concept: (n) => `Beginner's Masterclass eBook & Resource Guide for ${n}`,
        audience: (n) => `Total newcomers seeking a comprehensive roadmap`,
        format: '30-Page Beautifully Designed Canva eBook Template',
        title: (n) => `Beginner's Guide to ${n} | Comprehensive Roadmap & Starter Handbook`,
        keywords: ['beginner ebook', 'niche roadmap', 'how to handbook', 'starter guide']
      },
      {
        concept: (n) => `Journaling Prompts Deck: 50 Deep Inquiries for ${n}`,
        audience: (n) => `Reflective writers and personal development seekers`,
        format: '50 Printable Cards & 1-Page Summary Matrix',
        title: (n) => `50 Powerful ${n} Journal Prompts | Printable Mindfulness Cards Deck`,
        keywords: ['journal prompts', 'prompt cards', 'reflection questions', 'daily writing']
      },
      {
        concept: (n) => `Interactive Coaching Homework & Session Kit for ${n}`,
        audience: (n) => `Certified coaches, consultants, and workshop leaders`,
        format: '10 Rebrandable Client Homework Exercises in PDF',
        title: (n) => `${n} Client Coaching Exercises | Rebrandable Homework Worksheets`,
        keywords: ['coaching homework', 'client exercises', 'workshop kit', 'consultant tools']
      },
      {
        concept: (n) => `Classroom Lesson Plan & Activity Bundle for ${n}`,
        audience: (n) => `Teachers, homeschool parents, and tutors`,
        format: 'Full Week Lesson Plans + Printable Student Worksheets',
        title: (n) => `${n} Lesson Plan & Worksheet Pack | Homeschool & Teacher Activity Unit`,
        keywords: ['lesson plan', 'homeschool curriculum', 'teacher worksheet', 'activity unit']
      },
      {
        concept: (n) => `Goal Breakdown & Quarterly Accountability Guide for ${n}`,
        audience: (n) => `Ambitious creators achieving major milestone leaps`,
        format: 'Step-by-Step Strategic Action Mapping System',
        title: (n) => `${n} Action Mapping Guide | Quarterly Milestone & Accountability Book`,
        keywords: ['action mapping', 'accountability book', 'goal breakdown', 'strategic guide']
      },
      {
        concept: (n) => `Self-Audit & Assessment Scorecard for ${n}`,
        audience: (n) => `Practitioners auditing their strengths and growth areas`,
        format: 'Scored Assessment Form + Diagnostic Recommendations',
        title: (n) => `${n} Self-Assessment Scorecard | Diagnostic Diagnostic & Audit Tool`,
        keywords: ['assessment scorecard', 'self audit', 'diagnostic sheet', 'growth matrix']
      }
    ]
  },
  {
    category: 'Business Contracts & Agency Tools',
    subCategories: [
      {
        concept: (n) => `Client Onboarding & Invoice Form Pack for ${n} Services`,
        audience: (n) => `Freelancers, service providers, and agencies in ${n}`,
        format: 'Customizable Google Docs / Microsoft Word / Canva Document',
        title: (n) => `Professional ${n} Contract & Invoice Template Bundle | Client Agreement`,
        keywords: ['invoice template', 'service agreement', 'client onboarding', 'business forms']
      },
      {
        concept: (n) => `Service Proposal & Pitch Presentation Deck for ${n}`,
        audience: (n) => `Boutique agencies pitching premium client retainers`,
        format: '20-Slide Editable Canva & Pitch Deck Presentation',
        title: (n) => `High-Converting ${n} Client Proposal Deck | Service Pitch Deck Template`,
        keywords: ['proposal template', 'pitch deck', 'service proposal', 'client presentation']
      },
      {
        concept: (n) => `Standard Operating Procedures (SOP) Library for ${n}`,
        audience: (n) => `Growing businesses onboarding remote staff and VAs`,
        format: 'Notion Workspace + Google Docs SOP Templates',
        title: (n) => `${n} SOP Template Library | Operations Manual & Team Workflow Pack`,
        keywords: ['sop templates', 'operations manual', 'team workflow', 'process documentation']
      },
      {
        concept: (n) => `Independent Contractor Agreement & NDA Pack for ${n}`,
        audience: (n) => `Business owners safeguarding proprietary assets`,
        format: 'Fillable Word Document & PDF Contract Forms',
        title: (n) => `${n} Contractor Agreement & NDA Contract | Legal Business Form Pack`,
        keywords: ['contractor agreement', 'nda template', 'freelance contract', 'service contract']
      },
      {
        concept: (n) => `Client Welcome & Offboarding Packet for ${n}`,
        audience: (n) => `High-touch service professionals delighting clients`,
        format: 'Polished Magazine-Style Welcome Guide in Canva',
        title: (n) => `${n} Client Welcome Packet | Service Guide & Offboarding Handover`,
        keywords: ['client welcome packet', 'offboarding guide', 'client packet', 'magazine guide']
      },
      {
        concept: (n) => `Rate Card & Service Pricing Sheet for ${n}`,
        audience: (n) => `Creators and consultants sending quick pricing options`,
        format: 'One-Page Sleek Pricing Matrix PDF & Canva Link',
        title: (n) => `Modern ${n} Rate Card & Pricing Sheet | Transparent Service Menu`,
        keywords: ['rate card', 'pricing menu', 'services sheet', 'media kit rates']
      },
      {
        concept: (n) => `Testimonial & Feedback Intake Survey for ${n}`,
        audience: (n) => `Agencies collecting social proof and case studies`,
        format: 'Typeform / Google Forms Ready Questionnaire + Graphic Review Cards',
        title: (n) => `${n} Client Feedback Questionnaire | Social Proof & Review Template`,
        keywords: ['client survey', 'testimonial template', 'case study questions', 'feedback intake']
      }
    ]
  },
  {
    category: 'Notion Workspaces & Systems',
    subCategories: [
      {
        concept: (n) => `Second Brain & Knowledge Management OS for ${n}`,
        audience: (n) => `Notion power users, researchers, and multi-passionate creators`,
        format: 'Complete Notion Template with Relational Databases and Dashboards',
        title: (n) => `Notion ${n} Second Brain OS | All-in-One Life & Knowledge System`,
        keywords: ['notion second brain', 'notion workspace', 'notion template', 'knowledge hub']
      },
      {
        concept: (n) => `Content Creator Hub & Multi-Platform Calendar for ${n}`,
        audience: (n) => `Content managers scheduling posts across YouTube, TikTok, and Blogs`,
        format: 'Kanban Production Workflow with Built-In Scripting Prompts',
        title: (n) => `Notion ${n} Content Production Dashboard | Editorial Calendar Workspace`,
        keywords: ['notion content hub', 'editorial calendar', 'content planner notion', 'video tracker']
      },
      {
        concept: (n) => `Student Study & Assignment Hub for ${n}`,
        audience: (n) => `College students organizing notes, classes, and deadlines`,
        format: 'Course Database, GPA Calculator, and Flashcard Spaced Repetition',
        title: (n) => `Notion ${n} Student Hub | Course Organizer & Assignment Deadlines`,
        keywords: ['notion student hub', 'assignment tracker', 'class dashboard', 'study workspace']
      },
      {
        concept: (n) => `Freelancer Client Portal & Project Wiki for ${n}`,
        audience: (n) => `Freelancers sharing live deliverable dashboards with clients`,
        format: 'White-Labeled Client-Facing Notion Page with Embeds',
        title: (n) => `Notion ${n} Client Portal | Collaborative Project Deliverable Workspace`,
        keywords: ['client portal notion', 'freelancer workspace', 'project wiki', 'client dashboard']
      },
      {
        concept: (n) => `Home Maintenance & Inventory Tracker in Notion for ${n}`,
        audience: (n) => `Homeowners tracking warranties, repairs, and seasonal chores`,
        format: 'Room-by-Room Inventory Database + Maintenance Reminder Alerts',
        title: (n) => `Notion ${n} Home Inventory | Maintenance Schedule & Warranty Hub`,
        keywords: ['home inventory notion', 'maintenance tracker', 'household notion', 'warranty tracker']
      },
      {
        concept: (n) => `Habit & Routine Gamified Dashboard for ${n}`,
        audience: (n) => `Gamified productivity enthusiasts leveling up habits`,
        format: 'Streak Tracker with Daily Checkboxes & Progress Percentage Bars',
        title: (n) => `Notion ${n} Gamified Habit Tracker | Daily Routine Streaks & XP System`,
        keywords: ['notion habit tracker', 'gamified habits', 'daily streak dashboard', 'routine tracker']
      },
      {
        concept: (n) => `Fitness & Nutrition Macro Hub for ${n}`,
        audience: (n) => `Athletes tracking workouts, calories, and recipe libraries`,
        format: 'Recipe Database + Workout Exercise Archive in Notion',
        title: (n) => `Notion ${n} Workout & Recipe Hub | Meal Planner & Exercise Matrix`,
        keywords: ['notion workout hub', 'recipe database notion', 'meal planner notion', 'fitness system']
      }
    ]
  },
  {
    category: 'Digital Stickers & Clipart',
    subCategories: [
      {
        concept: (n) => `500+ Aesthetic Digital Sticky Notes & Icons for ${n}`,
        audience: (n) => `GoodNotes, Notability, and digital journaling creators`,
        format: 'Cropped Individual Transparent PNGs + GoodNotes .collection File',
        title: (n) => `500+ ${n} Digital Stickers | Aesthetic Functional GoodNotes Stickers`,
        keywords: ['digital stickers', 'goodnotes stickers', 'planner stickers', 'transparent png']
      },
      {
        concept: (n) => `Seasonal Holiday Icon & Badge Clipart Pack for ${n}`,
        audience: (n) => `Card makers, graphic designers, and scrapbookers`,
        format: 'Vector SVG Files & 300 DPI Transparent PNG Cliparts',
        title: (n) => `50 ${n} Clipart Vector Graphics | Commercial Use Illustration Pack`,
        keywords: ['vector clipart', 'svg cut files', 'commercial graphics', 'illustration pack']
      },
      {
        concept: (n) => `Hand-Drawn Washi Tape & Ribbon Strips for ${n}`,
        audience: (n) => `Crafters and scrapbook lovers decorating layouts`,
        format: '40 Seamless Texture Washi Tape Graphics in PNG',
        title: (n) => `40 ${n} Washi Tape Graphics | Printable Scrapbooking Ribbon Strips`,
        keywords: ['washi tape png', 'scrapbook ribbons', 'digital washi', 'decorative tape']
      },
      {
        concept: (n) => `Motivational Lettering & Word Quotes Stickers for ${n}`,
        audience: (n) => `Journalers adding artistic lettering to daily entries`,
        format: 'High-Res Brush Calligraphy Quotes with White Outlines for Cutting',
        title: (n) => `75 ${n} Quote Stickers | Handwritten Calligraphy Planner Words`,
        keywords: ['quote stickers', 'calligraphy stickers', 'planner words', 'motivational stickers']
      },
      {
        concept: (n) => `Cricut & Silhouette Die-Cut Ready Sticker Sheets for ${n}`,
        audience: (n) => `Crafters printing and cutting home physical sticker sheets`,
        format: 'Print & Cut Silhouette Studio, Cricut SVG, and PNG Sheets',
        title: (n) => `Printable ${n} Sticker Sheets | Cricut Silhouette Cut Files Bundle`,
        keywords: ['cricut stickers', 'print and cut', 'die cut stickers', 'sticker sheets']
      },
      {
        concept: (n) => `Minimalist Functional Flag & Priority Labels for ${n}`,
        audience: (n) => `Corporate professionals needing clear organizational tags`,
        format: 'Vector Outline Labels and Numbered Index Tabs',
        title: (n) => `Functional ${n} Index Tabs & Flags | Minimalist Daily Marker Stickers`,
        keywords: ['functional stickers', 'index tabs', 'priority flags', 'label stickers']
      },
      {
        concept: (n) => `Whimsical Doodle & Icon Sketch Pack for ${n}`,
        audience: (n) => `Stationery shops and bullet journal aficionados`,
        format: 'Hand-Inked Black Outline Doodles with Transparent Backgrounds',
        title: (n) => `100 Hand-Drawn ${n} Doodles | Bullet Journal Icons & Sketch Clipart`,
        keywords: ['doodle stickers', 'bullet journal icons', 'sketch clipart', 'hand drawn art']
      }
    ]
  },
  {
    category: 'Resumes, Portfolios & Career',
    subCategories: [
      {
        concept: (n) => `ATS-Friendly Minimalist Modern Resume Template for ${n}`,
        audience: (n) => `Job seekers, career changers, and applicants in ${n}`,
        format: '1, 2, and 3 Page Word, Google Docs & Mac Pages Resume Formats',
        title: (n) => `ATS-Friendly ${n} Resume Template | Clean Modern CV & Cover Letter`,
        keywords: ['ats resume', 'modern cv template', 'cover letter template', 'job application']
      },
      {
        concept: (n) => `Executive Career Portfolio & Case Study Book for ${n}`,
        audience: (n) => `Senior professionals showcasing portfolio deliverables`,
        format: 'Landscape 16:9 Presentation PDF and Canva Slides',
        title: (n) => `Executive ${n} Portfolio Presentation | Career Case Study Slide Deck`,
        keywords: ['career portfolio', 'case study template', 'portfolio deck', 'executive cv']
      },
      {
        concept: (n) => `LinkedIn Profile Banner & Optimization Checklist for ${n}`,
        audience: (n) => `Professionals networking and attracting recruiters`,
        format: '1584x396px Custom Banner Layouts + Headline Formulas Guide',
        title: (n) => `${n} LinkedIn Banner & Headline Pack | Profile Optimization Kit`,
        keywords: ['linkedin banner', 'profile optimization', 'headline formula', 'recruiter kit']
      },
      {
        concept: (n) => `Interview Preparation Flashcards & Question Vault for ${n}`,
        audience: (n) => `Candidates practicing high-stakes behavioural questions`,
        format: '50 Common Interview Questions with Model STAR Framework Answers',
        title: (n) => `${n} Interview Question Vault | 50 Behavioural Question Flashcards`,
        keywords: ['interview prep', 'star method sheet', 'job interview cards', 'interview vault']
      },
      {
        concept: (n) => `Salary Negotiation Script & Compensation Worksheet for ${n}`,
        audience: (n) => `Employees negotiating higher salaries and promotions`,
        format: 'Word-for-Word Email Scripts + Total Reward Compensation Calculator',
        title: (n) => `${n} Salary Negotiation Scripts | Compensation & Benefits Calculator`,
        keywords: ['salary negotiation', 'counter offer script', 'promotion request', 'raise guide']
      },
      {
        concept: (n) => `Freelance Portfolio One-Pager & Media Kit for ${n}`,
        audience: (n) => `Independent consultants pitching corporate contracts`,
        format: 'Canva 1-Page Capabilities Summary Sheet',
        title: (n) => `${n} Consultant Capabilities Sheet | 1-Page Freelance Service Summary`,
        keywords: ['capabilities sheet', 'one pager resume', 'consultant portfolio', 'media kit']
      },
      {
        concept: (n) => `Reference Letter & Recommendation Request Template for ${n}`,
        audience: (n) => `Professionals collecting endorsements and letters of recommendation`,
        format: 'Pre-Drafted Fillable Recommendation Letters in Word & Google Docs',
        title: (n) => `${n} Recommendation Letter Templates | Reference Request Email Pack`,
        keywords: ['recommendation letter', 'reference request', 'endorsement template', 'reference sheet']
      }
    ]
  },
  {
    category: 'Flashcards & Educational Printables',
    subCategories: [
      {
        concept: (n) => `Printable Vocabulary & Key Concept Flashcards for ${n}`,
        audience: (n) => `Learners, tutors, and exam candidates mastering ${n}`,
        format: 'Printable Double-Sided Flashcards with Cut Lines',
        title: (n) => `100 ${n} Flashcards | Core Concept Mastery Printable Study Deck`,
        keywords: ['printable flashcards', 'study cards', 'vocabulary deck', 'concept flashcards']
      },
      {
        concept: (n) => `Toddler & Preschool Learning Activity Mats for ${n}`,
        audience: (n) => `Parents and kindergarten teachers engaging young minds`,
        format: 'Laminatable Playdough & Wipe-Clean Activity Mats in A4/Letter',
        title: (n) => `Preschool ${n} Activity Mats | Wipe Clean Educational Learning Sheets`,
        keywords: ['activity mats', 'preschool printables', 'toddler learning', 'wipe clean sheets']
      },
      {
        concept: (n) => `Matching Pairs & Memory Card Game for ${n}`,
        audience: (n) => `Families, classrooms, and game nights`,
        format: '48 Illustrated Card Tokens with Beautiful Thematic Borders',
        title: (n) => `${n} Memory Matching Game | Printable Cognitive Learning Cards`,
        keywords: ['memory game', 'matching cards', 'educational game', 'printable card game']
      },
      {
        concept: (n) => `Trace & Write Handwriting Practice Sheets for ${n}`,
        audience: (n) => `Early writers developing pen control and fine motor skills`,
        format: 'Dotted Line Handwriting & Pen Control Practice Book',
        title: (n) => `${n} Handwriting Practice Sheets | Dotted Letter Tracing Workbook`,
        keywords: ['handwriting sheets', 'tracing workbook', 'pen control', 'letter tracing']
      },
      {
        concept: (n) => `Interactive Bingo Game for Groups & Classrooms in ${n}`,
        audience: (n) => `Parties, Sunday schools, and school classes`,
        format: '30 Unique Bingo Player Cards + Calling Cards Sheet',
        title: (n) => `30-Player ${n} Bingo Game Set | Classroom & Family Party Printable`,
        keywords: ['printable bingo', 'bingo game set', 'classroom bingo', 'party activity']
      },
      {
        concept: (n) => `Visual Scavenger Hunt & Discovery Checklist for ${n}`,
        audience: (n) => `Outdoor explorers, nature walks, and field trips`,
        format: 'Full Color Illustrated Picture Checkcards',
        title: (n) => `${n} Scavenger Hunt Checklist | Fun Interactive Discovery Game`,
        keywords: ['scavenger hunt', 'nature checklist', 'outdoor game', 'discovery sheet']
      },
      {
        concept: (n) => `Periodic / Timeline Anchor Chart Poster for ${n}`,
        audience: (n) => `Study rooms, classroom wall displays, and revision hubs`,
        format: 'High-Resolution 300 DPI Infographic Reference Chart',
        title: (n) => `${n} Anchor Chart Poster | Educational Revision Infographic Wall Art`,
        keywords: ['anchor chart', 'educational poster', 'revision chart', 'classroom infographic']
      }
    ]
  },
  {
    category: 'Crafts, Patterns & SVG Cut Files',
    subCategories: [
      {
        concept: (n) => `SVG Cut File Bundle for Cricut & Silhouette: ${n}`,
        audience: (n) => `T-shirt printers, mug makers, and home crafters`,
        format: 'Clean Cut Line SVG, DXF, EPS, and High-Res Transparent PNGs',
        title: (n) => `20 ${n} SVG Cut Files | Commercial Cricut Silhouette Crafting Bundle`,
        keywords: ['svg cut files', 'cricut bundle', 'silhouette svg', 'crafting vectors']
      },
      {
        concept: (n) => `Printable Sewing & Pattern Drafting Template for ${n}`,
        audience: (n) => `Sewists, quilters, and fashion design enthusiasts`,
        format: 'Full Scale Printable Tiled PDF Pattern with Assembly Marks',
        title: (n) => `Beginner ${n} Sewing Pattern | Tiled Printable PDF Pattern & Instructions`,
        keywords: ['sewing pattern', 'pdf pattern', 'quilting template', 'sewing tutorial']
      },
      {
        concept: (n) => `Crochet & Knitting Step-by-Step PDF Pattern for ${n}`,
        audience: (n) => `Yarn crafters creating handmade gifts and wear`,
        format: 'Photo-Rich Stitch by Stitch PDF Pattern with Video Tutorial Links',
        title: (n) => `${n} Crochet Pattern | Beginner Friendly Illustrated Yarn Tutorial`,
        keywords: ['crochet pattern', 'knitting pattern', 'yarn tutorial', 'handmade pattern']
      },
      {
        concept: (n) => `Laser Cutting & Engraving Files (Glowforge Ready) for ${n}`,
        audience: (n) => `Woodworkers and laser engravers selling physical gifts`,
        format: 'Layered Laser Vector Files in SVG and Lightburn Formats',
        title: (n) => `${n} Laser Cut File | Glowforge Ready Wood Engraving SVG Pattern`,
        keywords: ['glowforge svg', 'laser cut files', 'wood engraving', 'laser pattern']
      },
      {
        concept: (n) => `Sublimation Tumbler & Mug Wrap Designs for ${n}`,
        audience: (n) => `Drinkware makers printing custom gifts and tumblers`,
        format: 'Straight and Tapered 20oz Skinny Tumbler 300 DPI PNG Wraps',
        title: (n) => `${n} 20oz Tumbler Wrap PNG | Seamless Sublimation Skinny Tumbler Design`,
        keywords: ['tumbler wrap', 'sublimation png', 'skinny tumbler', 'mug wrap']
      },
      {
        concept: (n) => `Paper Flower & 3D Shadow Box Template for ${n}`,
        audience: (n) => `Paper artists creating 3D layered shadow boxes`,
        format: 'Numbered Layer SVG Files for Cutting Machines',
        title: (n) => `3D Layered ${n} Shadow Box SVG | Cricut Paper Cut Artwork Template`,
        keywords: ['shadow box svg', '3d paper art', 'layered svg', 'paper cut craft']
      },
      {
        concept: (n) => `Embroidery Pattern & Color Palette Guide for ${n}`,
        audience: (n) => `Hoop artists and hand embroidery hobbyists`,
        format: 'Traceable Hoop Pattern (6", 7", 8") + DMC Thread Chart',
        title: (n) => `Modern ${n} Hand Embroidery Pattern | Traceable Hoop Pattern & DMC Chart`,
        keywords: ['embroidery pattern', 'hand embroidery', 'dmc thread guide', 'hoop art pattern']
      }
    ]
  }
];

/**
 * Generates 100+ rule-based product ideas across 12 comprehensive categories for any niche
 */
export function generateProductIdeas(
  nicheInput: string,
  userId: string = 'local-user',
  targetCount: number = 100,
  lang: string = 'en'
): ProductIdea[] {
  const niche = nicheInput.trim() || 'Creative Business';
  const nicheCap = niche.charAt(0).toUpperCase() + niche.slice(1);

  const allIdeas: ProductIdea[] = [];
  let ideaIndex = 0;

  for (const cat of CATEGORIES_DATA) {
    for (const sub of cat.subCategories) {
      ideaIndex++;
      allIdeas.push({
        id: `idea-${Date.now()}-${ideaIndex}`,
        user_id: userId,
        project_id: null,
        niche: nicheCap,
        category: cat.category,
        product_concept: sub.concept(nicheCap, lang),
        target_audience: sub.audience(nicheCap, lang),
        related_keywords: sub.keywords.map(k => `${nicheCap.toLowerCase()} ${k}`),
        suggested_format: sub.format,
        possible_listing_title: sub.title(nicheCap, lang),
        created_at: new Date().toISOString(),
      });
    }
  }

  // Synthesize variations to reliably reach 100+ ideas if needed
  if (allIdeas.length < targetCount) {
    const variations = [
      'Deluxe Multi-Pack Edition',
      'Beginner Starter Bundle',
      'Minimalist Pastel Collection',
      'Pro Master Toolkit',
      'Instant Printable Gift Pack',
      'Commercial License Extended Kit'
    ];

    for (const v of variations) {
      if (allIdeas.length >= targetCount) break;
      for (const baseIdea of allIdeas.slice(0, 15)) {
        if (allIdeas.length >= targetCount) break;
        ideaIndex++;
        allIdeas.push({
          id: `idea-${Date.now()}-${ideaIndex}`,
          user_id: userId,
          project_id: null,
          niche: nicheCap,
          category: baseIdea.category,
          product_concept: `${v}: ${baseIdea.product_concept}`,
          target_audience: `${baseIdea.target_audience} seeking ${v.toLowerCase()}`,
          related_keywords: baseIdea.related_keywords.map(k => `${k} ${v.toLowerCase()}`),
          suggested_format: `${baseIdea.suggested_format} + Bonus Resources`,
          possible_listing_title: `${v} | ${baseIdea.possible_listing_title}`,
          created_at: new Date().toISOString(),
        });
      }
    }
  }

  return allIdeas.slice(0, targetCount);
}
