"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import LiveHero from "@/components/LiveHero";
import EventDetail from "@/components/EventDetail";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Article, Category } from "@/lib/types";
import { CATEGORIES } from "@/data/sources";
import { clusterArticlesIntoEvents, NewsEvent } from "@/lib/event-cluster";
import { Newspaper, RefreshCw, Clock, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

function timeAgo(d: string) { try { return formatDistanceToNow(new Date(d), { addSuffix: true, locale: tr }); } catch { return ""; } }

interface NewsResponse {
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
  lastFetch: string | null;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
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
      setError(null);
    } catch {
      setError("Haberler yuklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, language]);

  const triggerFetch = useCallback(async () => {
    setFetching(true);
    try { await fetch("/api/rss-fetch"); await fetchNews(); }
    catch { /* ignore */ }
    finally { setFetching(false); }
  }, [fetchNews]);

  useEffect(() => { triggerFetch(); }, []); // eslint-disable-line
  useEffect(() => { if (!loading) fetchNews(); }, [selectedCategory, searchQuery, language]); // eslint-disable-line
  useEffect(() => { const i = setInterval(triggerFetch, 5 * 60 * 1000); return () => clearInterval(i); }, [triggerFetch]);

  // Cluster → 3 sections only
  const events = useMemo(() => clusterArticlesIntoEvents(articles), [articles]);

  const { hero, mainEvents, feedEvents } = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      if (a.priority === "breaking" && b.priority !== "breaking") return -1;
      if (b.priority === "breaking" && a.priority !== "breaking") return 1;
      return b.sourceCount - a.sourceCount;
    });

    return {
      hero: sorted[0] || null,
      mainEvents: sorted.slice(1, 6),
      feedEvents: sorted.slice(6),
    };
  }, [events]);

  const findEvent = useCallback((articleId: string) =>
    events.find((e) => e.articles.some((a) => a.id === articleId)) || null,
    [events]
  );

  const handleHeroClick = useCallback((articleId: string) => {
    const ev = findEvent(articleId);
    if (ev) setSelectedEvent(ev);
    else if (hero) setSelectedEvent(hero);
  }, [findEvent, hero]);

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
      <Header onSearch={setSearchQuery} onLanguageChange={setLanguage} onRefresh={triggerFetch} totalArticles={articles.length} isLoading={fetching} currentLang={language} darkMode={darkMode} onToggleDark={toggleDark} />
      <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} counts={categoryCounts} />

      <main className="max-w-6xl mx-auto px-4 pt-5 pb-16">
        {fetching && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] mb-3">
            <RefreshCw className="w-3 h-3 animate-spin" /> Guncelleniyor...
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-sm text-[var(--color-red)] mb-3">{error}</p>
            <button onClick={triggerFetch} className="text-sm text-[var(--color-accent)] font-medium hover:underline">Tekrar dene</button>
          </div>
        )}

        {events.length === 0 && !error ? (
          <div className="flex flex-col items-center py-24 text-center fade-in">
            <Newspaper className="w-10 h-10 text-[var(--color-text-muted)] mb-3" />
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              {searchQuery ? `"${searchQuery}" icin sonuc bulunamadi.` : "Kaynaklar taraniyor..."}
            </p>
            <button onClick={triggerFetch} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium">Haberleri Yukle</button>
          </div>
        ) : (
          <div className="space-y-10 fade-in">

            {/* ═══════════════════════════════════════════
                SECTION 1: HERO — Single most important event
                ═══════════════════════════════════════════ */}
            {hero && (
              <LiveHero event={hero} onSelectArticle={handleHeroClick} />
            )}

            {/* ═══════════════════════════════════════════
                SECTION 2: MAIN EVENTS — Top 5 stories
                ═══════════════════════════════════════════ */}
            {mainEvents.length > 0 && (
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mainEvents.map((event) => {
                    const cat = CATEGORIES.find((c) => c.id === event.category);
                    return (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="text-left rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 hover:shadow-lg transition-all group bg-[var(--color-bg-card)]"
                      >
                        {/* Image */}
                        <div className="relative h-40 overflow-hidden bg-[var(--color-bg-secondary)]">
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : (
                            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${cat?.color}18 0%, ${cat?.color}06 100%)` }} />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                          {/* Category pill on image */}
                          <div className="absolute bottom-2.5 left-2.5">
                            <span className="text-[10px] font-semibold text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded" style={{ borderLeft: `2px solid ${cat?.color}` }}>
                              {cat?.labelTr}
                            </span>
                          </div>

                          {/* Source count */}
                          {event.sourceCount > 1 && (
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded">
                              <Users className="w-2.5 h-2.5" /> {event.sourceCount}
                            </div>
                          )}

                          {/* Breaking indicator */}
                          {event.priority === "breaking" && (
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-[var(--color-red)] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                              <span className="w-1 h-1 rounded-full bg-white live-pulse" /> Canli
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3.5">
                          <h3 className="text-[14px] font-semibold text-[var(--color-text)] leading-snug line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors mb-2">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
                            <span>{event.leadArticle.sourceName}</span>
                            <span className="opacity-30">|</span>
                            <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {timeAgo(event.latestUpdate)}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ═══════════════════════════════════════════
                SECTION 3: FEED — Everything else
                ═══════════════════════════════════════════ */}
            {feedEvents.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Diger Haberler</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {feedEvents.slice(0, 18).map((event) => {
                    const cat = CATEGORIES.find((c) => c.id === event.leadArticle.category);
                    return (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="flex items-start gap-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-2.5 hover:border-[var(--color-accent)]/15 transition-all text-left group"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-[var(--color-bg-secondary)]">
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${cat?.color}18 0%, ${cat?.color}06 100%)` }}>
                              <span className="text-[14px] opacity-30">{cat?.icon}</span>
                            </div>
                          )}
                        </div>
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: cat?.color }} />
                            <span className="text-[9px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{cat?.labelTr}</span>
                          </div>
                          <p className="text-[12px] font-medium text-[var(--color-text)] leading-snug line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                            {event.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-[9px] text-[var(--color-text-muted)]">
                            <span>{event.leadArticle.sourceName}</span>
                            {event.sourceCount > 1 && <span className="text-[var(--color-accent)] font-semibold">{event.sourceCount} kaynak</span>}
                          </div>
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

      {selectedEvent && <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

      <footer className="border-t border-[var(--color-border)] py-5 text-center">
        <p className="text-[10px] text-[var(--color-text-muted)] tracking-wide">2Vibe News — AI destekli haber istihbarat platformu</p>
      </footer>
    </div>
  );
}
