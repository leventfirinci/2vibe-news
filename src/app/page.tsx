"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import LiveHero from "@/components/LiveHero";
// TrendingEvents replaced by inline Breaking News + Most Discussed sections
import EventCard from "@/components/EventCard";
import CompactCard from "@/components/CompactCard";
import SectionLabel from "@/components/SectionLabel";
import EventDetail from "@/components/EventDetail";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Article, Category } from "@/lib/types";
import { CATEGORIES } from "@/data/sources";
import { clusterArticlesIntoEvents, NewsEvent } from "@/lib/event-cluster";
import { Newspaper, RefreshCw, Zap, List, Radio, MessageCircle } from "lucide-react";

interface NewsResponse {
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
  lastFetch: string | null;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<"all" | "tr" | "en">("all");
  const [selectedEvent, setSelectedEvent] = useState<NewsEvent | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("2vibe-dark");
    if (saved === "true" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("2vibe-dark", String(next));
  };

  const fetchNews = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (searchQuery) params.set("q", searchQuery);
      if (language !== "all") params.set("lang", language);
      params.set("limit", "100");

      const [res, statsRes] = await Promise.all([
        fetch(`/api/news?${params.toString()}`),
        fetch("/api/news?stats=true"),
      ]);

      if (!res.ok) throw new Error("Failed");
      const data: NewsResponse = await res.json();
      setArticles(data.articles);

      const stats = await statsRes.json();
      setCategoryCounts(stats.byCategory || {});

      if (selectedCategory !== "all" || searchQuery || language !== "all") {
        const allRes = await fetch("/api/news?limit=100");
        const allData: NewsResponse = await allRes.json();
        setAllArticles(allData.articles);
      } else {
        setAllArticles(data.articles);
      }

      setError(null);
    } catch {
      setError("Haberler yuklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, language]);

  const triggerFetch = useCallback(async () => {
    setFetching(true);
    try {
      await fetch("/api/rss-fetch");
      await fetchNews();
    } catch { /* network error */ }
    finally { setFetching(false); }
  }, [fetchNews]);

  useEffect(() => { triggerFetch(); }, []); // eslint-disable-line
  useEffect(() => { if (!loading) fetchNews(); }, [selectedCategory, searchQuery, language]); // eslint-disable-line
  useEffect(() => {
    const i = setInterval(triggerFetch, 5 * 60 * 1000);
    return () => clearInterval(i);
  }, [triggerFetch]);

  // CORE: Cluster articles into events
  const events = useMemo(() => clusterArticlesIntoEvents(articles), [articles]);
  const allEvents = useMemo(() => clusterArticlesIntoEvents(allArticles), [allArticles]);

  // Split events by priority
  const { heroEvent, breakingEvents, mostDiscussedEvents, importantEvents, normalEvents } = useMemo(() => {
    const breaking = events.filter((e) => e.priority === "breaking");
    const important = events.filter((e) => e.priority === "important");
    const normal = events.filter((e) => e.priority === "normal");

    const hero = breaking.sort((a, b) => b.sourceCount - a.sourceCount)[0] || null;

    // Breaking news = all breaking events except hero (urgent, separate from feed)
    const breakingNews = breaking.filter((e) => e.id !== hero?.id).slice(0, 4);

    // Most discussed = events with highest source count across ALL events
    const mostDiscussed = allEvents
      .filter((e) => e.id !== hero?.id && e.sourceCount >= 2)
      .sort((a, b) => b.sourceCount - a.sourceCount)
      .slice(0, 6);

    // Important stories
    const imp = [...important].slice(0, 8);

    return {
      heroEvent: hero,
      breakingEvents: breakingNews,
      mostDiscussedEvents: mostDiscussed,
      importantEvents: imp,
      normalEvents: normal,
    };
  }, [events, allEvents]);

  // Find event containing an article (for hero click → event detail)
  const findEventForArticle = useCallback((articleId: string): NewsEvent | null => {
    return events.find((e) => e.articles.some((a) => a.id === articleId))
      || allEvents.find((e) => e.articles.some((a) => a.id === articleId))
      || null;
  }, [events, allEvents]);

  // Hero click → find the event and open EventDetail
  const handleHeroClick = useCallback((articleId: string) => {
    const event = findEventForArticle(articleId);
    if (event) setSelectedEvent(event);
    else if (heroEvent) setSelectedEvent(heroEvent);
  }, [findEventForArticle, heroEvent]);

  // Event card / trending click → open EventDetail
  const handleSelectEvent = useCallback((event: NewsEvent) => {
    setSelectedEvent(event);
  }, []);

  // Compact card click → wrap single article in a minimal event
  const handleCompactClick = useCallback((article: Article) => {
    const event = findEventForArticle(article.id);
    if (event) {
      setSelectedEvent(event);
    } else {
      // Wrap single article as a 1-source event
      setSelectedEvent({
        id: `event-${article.id}`,
        title: article.title,
        summary: article.summaryShort || "",
        category: article.category,
        secondaryCategories: article.secondaryCategories || [],
        impactAreas: article.impactAreas || [],
        priority: article.priority,
        articles: [article],
        sourceCount: 1,
        sources: [article.sourceName],
        highestReliability: article.sourceReliability,
        latestUpdate: article.publishedAt,
        firstSeen: article.publishedAt,
        whyItMatters: article.whyItMatters,
        imageUrl: article.imageUrl,
        leadArticle: article,
      });
    }
  }, [findEventForArticle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Header onSearch={() => {}} onLanguageChange={() => {}} onRefresh={() => {}} totalArticles={0} isLoading={true} currentLang="all" darkMode={darkMode} onToggleDark={toggleDark} />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors">
      <Header
        onSearch={setSearchQuery}
        onLanguageChange={setLanguage}
        onRefresh={triggerFetch}
        totalArticles={articles.length}
        isLoading={fetching}
        currentLang={language}
        darkMode={darkMode}
        onToggleDark={toggleDark}
      />

      <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} counts={categoryCounts} />

      <main className="max-w-6xl mx-auto px-4 pt-5 pb-12">
        {fetching && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] mb-3">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Kaynaklar kontrol ediliyor...
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-sm text-[var(--color-red)] mb-3">{error}</p>
            <button onClick={triggerFetch} className="text-sm text-[var(--color-accent)] font-medium hover:underline">
              Tekrar dene
            </button>
          </div>
        )}

        {events.length === 0 && !error ? (
          <div className="flex flex-col items-center py-24 text-center fade-in">
            <Newspaper className="w-10 h-10 text-[var(--color-text-muted)] mb-3" />
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              {searchQuery ? `"${searchQuery}" icin sonuc bulunamadi.` : "Kaynaklar taraniyor..."}
            </p>
            <button onClick={triggerFetch} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">
              Haberleri Yukle
            </button>
          </div>
        ) : (
          <div className="space-y-8 fade-in">

            {/* === 1. LIVE HERO === */}
            {heroEvent && (
              <LiveHero event={heroEvent} onSelectArticle={handleHeroClick} />
            )}

            {/* === 2. BREAKING NEWS (separate urgent section) === */}
            {breakingEvents.length > 0 && (
              <section>
                <SectionLabel title="Son Dakika" icon={<Radio className="w-3.5 h-3.5" />} count={breakingEvents.length} className="text-[var(--color-red)]" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {breakingEvents.map((event) => {
                    const cat = CATEGORIES.find((c) => c.id === event.category);
                    return (
                      <button
                        key={event.id}
                        onClick={() => handleSelectEvent(event)}
                        className="text-left bg-[var(--color-red-bg)] border border-[var(--color-red)]/10 rounded-xl p-3 hover:border-[var(--color-red)]/30 transition-all group"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-red)] live-pulse" />
                          <span className="text-[10px] font-bold text-[var(--color-red)] uppercase tracking-wider">Canli</span>
                          <span className="text-[10px] text-[var(--color-text-muted)]">{cat?.labelTr}</span>
                        </div>
                        <p className="text-[13px] font-semibold text-[var(--color-text)] leading-snug line-clamp-2 group-hover:text-[var(--color-red)] transition-colors">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--color-text-muted)]">
                          <span>{event.leadArticle.sourceName}</span>
                          {event.sourceCount > 1 && (
                            <span className="text-[var(--color-red)] font-semibold">{event.sourceCount} kaynak</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* === 3. MOST DISCUSSED — visual grid with images === */}
            {mostDiscussedEvents.length > 0 && (
              <section>
                <SectionLabel title="En Cok Konusulan" icon={<MessageCircle className="w-3.5 h-3.5" />} count={mostDiscussedEvents.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mostDiscussedEvents.map((event, i) => {
                    const cat = CATEGORIES.find((c) => c.id === event.category);
                    return (
                      <button
                        key={event.id}
                        onClick={() => handleSelectEvent(event)}
                        className="text-left rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 transition-all group relative"
                      >
                        {/* Image or gradient placeholder */}
                        <div className="relative h-32 overflow-hidden bg-[var(--color-bg-secondary)]">
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : (
                            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${cat?.color}20 0%, ${cat?.color}08 100%)` }} />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          {/* Rank number */}
                          <div className="absolute top-2 left-2.5 text-[24px] font-black text-white/30 leading-none">{i + 1}</div>
                          {/* Source count */}
                          <div className="absolute top-2 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                            <MessageCircle className="w-2.5 h-2.5" />
                            {event.sourceCount}
                          </div>
                        </div>
                        <div className="p-3 bg-[var(--color-bg-card)]">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat?.color }} />
                            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{cat?.labelTr}</span>
                          </div>
                          <p className="text-[13px] font-semibold text-[var(--color-text)] leading-snug line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                            {event.title}
                          </p>
                          <span className="text-[10px] text-[var(--color-text-muted)] mt-1 block">{event.leadArticle.sourceName}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* === 4. IMPORTANT EVENTS === */}
            {importantEvents.length > 0 && (
              <section>
                <SectionLabel title="Onemli Gelismeler" icon={<Zap className="w-3.5 h-3.5" />} count={importantEvents.length} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {importantEvents.map((event) => (
                    <EventCard key={event.id} event={event} onSelect={handleSelectEvent} />
                  ))}
                </div>
              </section>
            )}

            {/* === 5. LATEST EVENTS — mini cards with images === */}
            {normalEvents.length > 0 && (
              <section>
                <SectionLabel title="Son Gelismeler" icon={<List className="w-3.5 h-3.5" />} count={normalEvents.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {normalEvents.slice(0, 15).map((event) => {
                    const cat = CATEGORIES.find((c) => c.id === event.leadArticle.category);
                    const hasImg = !!event.imageUrl;
                    return (
                      <button
                        key={event.id}
                        onClick={() => handleSelectEvent(event)}
                        className="flex items-start gap-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-2.5 hover:border-[var(--color-accent)]/15 transition-all text-left group"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-[var(--color-bg-secondary)]">
                          {hasImg ? (
                            <img src={event.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.background = `linear-gradient(135deg, ${cat?.color}25 0%, ${cat?.color}08 100%)`; (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${cat?.color}20 0%, ${cat?.color}08 100%)` }}>
                              <span className="text-[16px] opacity-40">{cat?.icon}</span>
                            </div>
                          )}
                        </div>
                        {/* Text */}
                        <div className="flex-1 min-w-0 py-0.5">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: cat?.color }} />
                            <span className="text-[9px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{cat?.labelTr}</span>
                            {event.sourceCount > 1 && (
                              <span className="text-[9px] text-[var(--color-accent)] font-semibold ml-auto">{event.sourceCount} kaynak</span>
                            )}
                          </div>
                          <p className="text-[12px] font-medium text-[var(--color-text)] leading-snug line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                            {event.title}
                          </p>
                          <span className="text-[9px] text-[var(--color-text-muted)] mt-0.5 block">{event.leadArticle.sourceName}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* EVENT DETAIL PANEL */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <footer className="border-t border-[var(--color-border)] py-5 text-center">
        <p className="text-[10px] text-[var(--color-text-muted)] tracking-wide">
          2Vibe News — AI destekli haber istihbarat platformu
        </p>
      </footer>
    </div>
  );
}
