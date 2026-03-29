"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Dark mode
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

      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data: NewsResponse = await res.json();
      setArticles(data.articles);

      // Also fetch all articles for trending (unfiltered)
      if (selectedCategory !== "all" || searchQuery || language !== "all") {
        const allRes = await fetch("/api/news?limit=80");
        const allData: NewsResponse = await allRes.json();
        setAllArticles(allData.articles);
      } else {
        setAllArticles(data.articles);
      }

      const statsRes = await fetch("/api/news?stats=true");
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
    try {
      await fetch("/api/rss-fetch");
      await fetchNews();
    } catch { /* ignore */ }
    finally { setFetching(false); }
  }, [fetchNews]);

  useEffect(() => { triggerFetch(); }, []); // eslint-disable-line
  useEffect(() => { if (!loading) fetchNews(); }, [selectedCategory, searchQuery, language]); // eslint-disable-line
  useEffect(() => {
    const i = setInterval(triggerFetch, 5 * 60 * 1000);
    return () => clearInterval(i);
  }, [triggerFetch]);

  // 3-tier article split
  const breakingArticles = articles.filter((a) => a.priority === "breaking");
  const importantArticles = articles.filter((a) => a.priority === "important");
  const normalArticles = articles.filter((a) => a.priority === "normal");

  const heroArticle = breakingArticles[0] || null;
  const heroSourceCount = heroArticle
    ? articles.filter(
        (a) =>
          a.id !== heroArticle.id &&
          a.category === heroArticle.category &&
          Math.abs(new Date(a.publishedAt).getTime() - new Date(heroArticle.publishedAt).getTime()) < 86400000
      ).length + 1
    : 0;

  // Remaining breaking articles (after hero) go into important
  const remainingBreaking = breakingArticles.slice(1);
  const mediumArticles = [...remainingBreaking, ...importantArticles].slice(0, 6);

  const getRelated = (a: Article) =>
    articles
      .filter(
        (x) =>
          x.id !== a.id &&
          x.category === a.category &&
          Math.abs(new Date(x.publishedAt).getTime() - new Date(a.publishedAt).getTime()) < 86400000
      )
      .slice(0, 5);

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

      <main className="max-w-6xl mx-auto px-4 py-5">
        {/* Updating indicator */}
        {fetching && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-4">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Guncelleniyor...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10">
            <p className="text-sm text-[var(--color-red)] mb-3">{error}</p>
            <button onClick={triggerFetch} className="text-sm text-[var(--color-accent)] font-medium hover:underline">
              Tekrar dene
            </button>
          </div>
        )}

        {articles.length === 0 && !error ? (
          <div className="flex flex-col items-center py-20 text-center fade-in">
            <Newspaper className="w-12 h-12 text-[var(--color-text-muted)] mb-3" />
            <p className="text-[var(--color-text-secondary)] mb-4">
              {searchQuery ? `"${searchQuery}" icin sonuc bulunamadi.` : "Haberler yukleniyor..."}
            </p>
            <button onClick={triggerFetch} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium">
              Haberleri Yukle
            </button>
          </div>
        ) : (
          <div className="space-y-8 fade-in">
            {/* HERO: Breaking news */}
            {heroArticle && (
              <HeroSection
                article={heroArticle}
                sourceCount={heroSourceCount}
                onSelect={setSelectedArticle}
              />
            )}

            {/* TRENDING */}
            <TrendingBar articles={allArticles} onSelect={setSelectedArticle} />

            {/* IMPORTANT: Medium cards */}
            {mediumArticles.length > 0 && (
              <section>
                <SectionLabel
                  title="Onemli Haberler"
                  icon={<Zap className="w-4 h-4" />}
                  count={mediumArticles.length}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediumArticles.map((article) => (
                    <MediumCard
                      key={article.id}
                      article={article}
                      onSelect={setSelectedArticle}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* NORMAL: Compact list */}
            {normalArticles.length > 0 && (
              <section>
                <SectionLabel
                  title="Son Haberler"
                  icon={<List className="w-4 h-4" />}
                  count={normalArticles.length}
                />
                <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                  {normalArticles.map((article) => (
                    <CompactCard
                      key={article.id}
                      article={article}
                      onSelect={setSelectedArticle}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Article detail panel */}
      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          relatedArticles={getRelated(selectedArticle)}
          onClose={() => setSelectedArticle(null)}
          onSelectRelated={setSelectedArticle}
        />
      )}

      <footer className="border-t border-[var(--color-border)] mt-10 py-6 text-center text-xs text-[var(--color-text-muted)] transition-colors">
        <p>2Vibe News — AI destekli haber platformu. Haberler orijinal kaynaklarina aittir.</p>
      </footer>
    </div>
  );
}
