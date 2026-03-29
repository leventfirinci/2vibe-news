<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-6-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/AI-Gemini%20%2B%20Groq-orange?style=flat-square" alt="AI" />
  <img src="https://img.shields.io/badge/Sources-30%2B-green?style=flat-square" alt="Sources" />
  <img src="https://img.shields.io/badge/Cost-%240%2Fmo-brightgreen?style=flat-square" alt="Zero Cost" />
</p>

<h1 align="center">2Vibe News</h1>

<p align="center">
  <strong>Understand the world. Instantly.</strong>
</p>

<p align="center">
  AI-powered <strong>News Intelligence Platform</strong> that transforms raw news into clear, reliable, real-time insights.
  <br /><br />
  This is not just another news app.<br />
  It helps you answer: <em>"What is happening in the world right now?"</em>
  <br /><br />
  <a href="#features">Features</a> &middot; <a href="#how-it-works">How It Works</a> &middot; <a href="#getting-started">Get Started</a> &middot; <a href="#roadmap">Roadmap</a>
</p>

---

## The Problem

People consume news from single sources, trapped in filter bubbles. They can't easily verify what's real, compare perspectives, or understand why a story matters. Existing news apps optimize for engagement, not understanding.

## The Solution

2Vibe News aggregates news from 30+ trusted sources in real-time, clusters them into **events** (not articles), uses AI to summarize and explain significance, scores source reliability, and shows the same story from multiple perspectives side by side.

Most apps show news. **2Vibe explains it.**

---

## Features

### AI Intelligence Layer
- **Smart Summaries** — Clean, 2-3 sentence AI-generated summaries
- **"Why It Matters"** — Context-aware explanations of story significance
- **Event Clustering** — Related articles grouped into single events with source count

### Multi-Source Verification
- **30+ News Sources** — BBC, Reuters, AP, Al Jazeera, NTV, Sozcu, TechCrunch, ESPN, and more
- **Cross-Source Validation** — Same event shown with "X sources confirmed"
- **Duplicate Detection** — Trigram-based title similarity matching

### Reliability Scoring
- **Source Scores (0-100)** — Each source rated by editorial independence and accuracy
- **Tier System (A/B/C/D)** — Visual badges on every article
- **Comparison Bars** — Side-by-side reliability comparison in detail view

### Breaking News Detection
- **Priority System** — Automatic breaking / important / normal classification
- **Live Hero Section** — Dominant visual for the most confirmed breaking event
- **War/Conflict Detection** — Context-aware classification prevents mis-categorization

### Smart Categorization
Economy | Politics | Technology | Sports | World | Science | Health | Culture

### User Experience
- **Event-Based Feed** — See events, not article duplicates
- **3-Tier Visual Hierarchy** — Hero / Medium Cards / Compact List
- **Trending Now** — Top events ranked by source confirmation count
- **Dark Mode** — Premium dark theme with system preference detection
- **Bilingual** — Turkish + English with instant language filtering
- **Real-Time Updates** — Auto-refresh every 5 minutes
- **Responsive** — Mobile-first, works on all screen sizes

---

## How It Works

```
RSS Feeds (30+ sources, polled every 5 min)
    |
    v
[Content Extraction] — Title, snippet, image, date
    |
    v
[Deduplication] — Normalized title matching, keeps highest-reliability source
    |
    v
[Classification Engine] — Keyword scoring with context awareness
    |                      Title matches = 3x weight
    |                      War context suppresses tech false positives
    v
[AI Processing] — Provider rotation: Gemini (1K/day) -> Groq (14.4K/day)
    |              Summarization + "Why It Matters" for breaking/important
    v
[Event Clustering] — Trigram similarity grouping (12hr window, 35% threshold)
    |                  Articles become EVENTS with source counts
    v
[API Layer] — Filtering, pagination, stats
    |
    v
[Intelligence UI] — Live Hero -> Trending Events -> Important -> Latest
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16 (App Router) | React SSR, API routes, zero-config |
| **Language** | TypeScript 6 | Type safety across frontend + backend |
| **Styling** | Tailwind CSS 4 | Utility-first, dark mode, responsive |
| **RSS** | rss-parser | Reliable feed parsing with timeout control |
| **AI - Primary** | Gemini 2.0 Flash Lite | 1,000 req/day free, excellent Turkish |
| **AI - Secondary** | Groq (Llama 3.1 8B) | 14,400 req/day free, fast inference |
| **Icons** | Lucide React | Clean, consistent icon set |
| **Dates** | date-fns | Locale-aware (Turkish) date formatting |

**Total monthly cost: $0** (all free tiers)

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/leventfirinci/2vibe-news.git
cd 2vibe-news
npm install
```

### Configuration (Optional)

AI summarization works without API keys (falls back to RSS snippets). For AI features:

```bash
cp .env.local.example .env.local
```

Add your free API keys:
```env
# Free: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_key_here

# Free: https://console.groq.com/keys
GROQ_API_KEY=your_key_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Architecture

```
src/
  app/
    page.tsx              # Event-based homepage with intelligence layout
    layout.tsx            # Root layout with OG metadata
    globals.css           # Design system tokens + animations
    api/
      news/route.ts       # Article query API (filter, paginate, stats)
      rss-fetch/route.ts  # RSS ingestion + AI summarization trigger
  components/
    Header.tsx            # Glass-effect nav with debounced search
    CategoryBar.tsx       # Color-coded category filter pills
    LiveHero.tsx          # Breaking event hero with source confirmation
    TrendingEvents.tsx    # Top events grid ranked by source count
    EventCard.tsx         # Important event cards with multi-source badge
    CompactCard.tsx       # Dense list items with source count
    ArticleDetail.tsx     # Slide-in panel with reliability comparison bars
    ReliabilityBadge.tsx  # Score badge with SVG arc (sm/md/lg)
    SectionLabel.tsx      # Reusable section headers
    LoadingSkeleton.tsx   # Shimmer loading states
  lib/
    types.ts              # TypeScript interfaces
    event-cluster.ts      # Trigram-based event clustering engine
    store.ts              # In-memory article storage
    rss-fetcher.ts        # RSS parsing + deduplication
    classifier.ts         # Category + priority classification
    ai-summarizer.ts      # Multi-provider AI with rotation
  data/
    sources.ts            # 30+ news source definitions with reliability scores
```

---

## Source Reliability

Every source is scored based on editorial independence, fact-checking practices, and historical accuracy:

| Tier | Score | Sources |
|------|-------|---------|
| **A** (80-100) | Highly Reliable | BBC, Reuters, AP, NPR, The Guardian, Ars Technica |
| **B** (60-79) | Reliable with bias | CNN, NTV, Sozcu, TechCrunch, ESPN, BloombergHT |

Reliability scores are displayed on every article and compared visually in the detail view.

---

## Roadmap

### Phase 1 — MVP (Current)
- [x] 30+ RSS source aggregation
- [x] AI summarization (Gemini + Groq)
- [x] Source reliability scoring
- [x] Category classification with context awareness
- [x] Event clustering (trigram similarity)
- [x] 3-tier visual hierarchy
- [x] Dark mode with glass effects
- [x] Turkish + English
- [x] Search + filtering

### Phase 2 — Persistence & Scale
- [ ] Supabase database integration
- [ ] User accounts + saved articles
- [ ] Push notifications (Web Push API)
- [ ] Telegram bot distribution
- [ ] Email newsletter (daily digest)

### Phase 3 — Deep Intelligence
- [ ] Semantic event clustering (embedding-based)
- [ ] Fake news detection signals
- [ ] Government/law tracking (Resmi Gazete)
- [ ] Economic indicator integration (TCMB, TUIK)
- [ ] Personalized feed algorithm

### Phase 4 — Platform
- [ ] Mobile app (PWA or React Native)
- [ ] API for third-party access
- [ ] Premium subscription tier
- [ ] B2B news intelligence API

---

## Product Vision

> Build the fastest and most intelligent way to understand global events.

We are not building a news reader. We are building a **real-time intelligence system** that helps people make sense of the world — instantly, reliably, and without noise.

---

## Legal

2Vibe News is a **news aggregator**. All news content belongs to and is linked back to its original publishers. We display short factual summaries with source attribution and direct links to original articles. No full article text is stored or displayed.

RSS feeds are publicly published by news organizations for third-party consumption. AI-generated summaries are original short-form content that does not replicate the narrative structure of source articles.

---

## Contributing

This project is in active development. Contributions welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>2Vibe News</strong> — Don't just read the news. Understand it.
  <br />
  Built with Next.js, powered by AI, driven by trust.
  <br /><br />
  <em>by Levent Firinci</em>
</p>
