"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import LiveHero from "@/components/LiveHero";
import TrendingEvents from "@/components/TrendingEvents";
import EventCard from "@/components/EventCard";
import CompactCard from "@/components/CompactCard";
import SectionLabel from "@/components/SectionLabel";
import EventDetail from "@/components/EventDetail";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Article, Category } from "@/lib/types";
import { clusterArticlesIntoEvents, NewsEvent } from "@/lib/event-cluster";
import { Newspaper, RefreshCw, Zap, List } from "lucide-react";

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
  const { heroEvent, trendingEvents, importantEvents, normalEvents } = useMemo(() => {
    const breaking = events.filter((e) => e.priority === "breaking");
    const important = events.filter((e) => e.priority === "important");
    const normal = events.filter((e) => e.priority === "normal");

    const hero = breaking.sort((a, b) => b.sourceCount - a.sourceCount)[0] || null;

    const trending = allEvents
      .filter((e) => e.id !== hero?.id && e.sourceCount >= 2)
      .sort((a, b) => b.sourceCount - a.sourceCount)
      .slice(0, 6);

    const imp = [...breaking.filter((e) => e.id !== hero?.id), ...important].slice(0, 8);

    return { heroEvent: hero, trendingEvents: trending, importantEvents: imp, normalEvents: normal };
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
            {heroEvent && (
              <LiveHero event={heroEvent} onSelectArticle={handleHeroClick} />
            )}

            {trendingEvents.length > 0 && (
              <TrendingEvents events={trendingEvents} onSelectEvent={handleSelectEvent} />
            )}

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

            {normalEvents.length > 0 && (
              <section>
                <SectionLabel title="Son Gelismeler" icon={<List className="w-3.5 h-3.5" />} count={normalEvents.length} />
                <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                  {normalEvents.map((event) => (
                    <CompactCard
                      key={event.id}
                      article={event.leadArticle}
                      onSelect={handleCompactClick}
                      sourceCount={event.sourceCount}
                    />
                  ))}
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
