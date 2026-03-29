"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import HeroSection from "@/components/HeroSection";
import TrendingBar from "@/components/TrendingBar";
import MediumCard from "@/components/MediumCard";
import CompactCard from "@/components/CompactCard";
import SectionLabel from "@/components/SectionLabel";
import ArticleDetail from "@/components/ArticleDetail";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Article, Category } from "@/lib/types";
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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
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
      params.set("limit", "80");

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
        const allRes = await fetch("/api/news?limit=80");
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

  // 3-tier split (memoized)
  const { heroArticle, heroSourceCount, mediumArticles, normalArticles } = useMemo(() => {
    const breaking = articles.filter((a) => a.priority === "breaking");
    const important = articles.filter((a) => a.priority === "important");
    const normal = articles.filter((a) => a.priority === "normal");

    const hero = breaking[0] || null;
    const heroCount = hero
      ? articles.filter(
          (a) => a.id !== hero.id && a.category === hero.category &&
            Math.abs(new Date(a.publishedAt).getTime() - new Date(hero.publishedAt).getTime()) < 86400000
        ).length + 1
      : 0;

    const medium = [...breaking.slice(1), ...important].slice(0, 6);

    return { heroArticle: hero, heroSourceCount: heroCount, mediumArticles: medium, normalArticles: normal };
  }, [articles]);

  const getRelated = useCallback((a: Article) =>
    articles
      .filter((x) => x.id !== a.id && x.category === a.category &&
        Math.abs(new Date(x.publishedAt).getTime() - new Date(a.publishedAt).getTime()) < 86400000)
      .slice(0, 5),
    [articles]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] transition-colors">
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

      <main className="max-w-6xl mx-auto px-4 pt-5 pb-10">
        {/* Update indicator */}
        {fetching && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] mb-3">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Guncelleniyor...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-sm text-[var(--color-red)] mb-3">{error}</p>
            <button onClick={triggerFetch} className="text-sm text-[var(--color-accent)] font-medium hover:underline">
              Tekrar dene
            </button>
          </div>
        )}

        {articles.length === 0 && !error ? (
          <div className="flex flex-col items-center py-24 text-center fade-in">
            <Newspaper className="w-10 h-10 text-[var(--color-text-muted)] mb-3" />
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              {searchQuery ? `"${searchQuery}" icin sonuc bulunamadi.` : "Haberler yukleniyor..."}
            </p>
            <button onClick={triggerFetch} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">
              Haberleri Yukle
            </button>
          </div>
        ) : (
          <div className="space-y-6 fade-in">
            {/* HERO */}
            {heroArticle && (
              <HeroSection article={heroArticle} sourceCount={heroSourceCount} onSelect={setSelectedArticle} />
            )}

            {/* TRENDING */}
            <TrendingBar articles={allArticles} onSelect={setSelectedArticle} />

            {/* IMPORTANT */}
            {mediumArticles.length > 0 && (
              <section>
                <SectionLabel title="Onemli Haberler" icon={<Zap className="w-3.5 h-3.5" />} count={mediumArticles.length} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mediumArticles.map((article) => (
                    <MediumCard key={article.id} article={article} onSelect={setSelectedArticle} />
                  ))}
                </div>
              </section>
            )}

            {/* LATEST */}
            {normalArticles.length > 0 && (
              <section>
                <SectionLabel title="Son Haberler" icon={<List className="w-3.5 h-3.5" />} count={normalArticles.length} />
                <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                  {normalArticles.map((article) => (
                    <CompactCard key={article.id} article={article} onSelect={setSelectedArticle} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Detail panel */}
      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          relatedArticles={getRelated(selectedArticle)}
          onClose={() => setSelectedArticle(null)}
          onSelectRelated={setSelectedArticle}
        />
      )}

      <footer className="border-t border-[var(--color-border)] py-6 text-center">
        <p className="text-[11px] text-[var(--color-text-muted)]">
          2Vibe News — AI destekli haber istihbarat platformu. Haberler orijinal kaynaklarina aittir.
        </p>
      </footer>
    </div>
  );
}
