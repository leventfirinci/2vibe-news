// In-memory store for MVP (replaces Supabase initially for zero-cost)
// Can be swapped for Supabase when ready
import { Article, Category } from "@/lib/types";

let articlesCache: Article[] = [];
let lastFetchTime: Date | null = null;

export function getArticles(): Article[] {
  return articlesCache;
}

export function setArticles(articles: Article[]): void {
  articlesCache = articles;
  lastFetchTime = new Date();
}

export function addArticles(newArticles: Article[]): void {
  // Merge: add new articles that don't already exist
  const existingUrls = new Set(articlesCache.map((a) => a.originalUrl));
  const fresh = newArticles.filter((a) => !existingUrls.has(a.originalUrl));

  articlesCache = [...fresh, ...articlesCache]
    .sort((a, b) => {
      if (a.priority === "breaking" && b.priority !== "breaking") return -1;
      if (b.priority === "breaking" && a.priority !== "breaking") return 1;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    })
    .slice(0, 500); // Keep max 500 articles in memory

  lastFetchTime = new Date();
}

export function getArticleById(id: string): Article | undefined {
  return articlesCache.find((a) => a.id === id);
}

export function getArticlesByCategory(category: Category): Article[] {
  return articlesCache.filter(
    (a) => a.category === category ||
      (a.secondaryCategories && a.secondaryCategories.includes(category))
  );
}

export function getRelatedArticles(article: Article): Article[] {
  // Find articles with same cluster or similar titles
  return articlesCache.filter(
    (a) =>
      a.id !== article.id &&
      a.category === article.category &&
      Math.abs(
        new Date(a.publishedAt).getTime() -
          new Date(article.publishedAt).getTime()
      ) <
        24 * 60 * 60 * 1000 // within 24 hours
  ).slice(0, 5);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase();
  return articlesCache.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summaryShort?.toLowerCase().includes(q) ||
      a.sourceName.toLowerCase().includes(q)
  );
}

export function getLastFetchTime(): Date | null {
  return lastFetchTime;
}

export function getStats(): {
  totalArticles: number;
  byCategory: Record<string, number>;
  byLanguage: Record<string, number>;
  lastFetch: string | null;
} {
  const byCategory: Record<string, number> = {};
  const byLanguage: Record<string, number> = {};

  for (const a of articlesCache) {
    byCategory[a.category] = (byCategory[a.category] || 0) + 1;
    byLanguage[a.language] = (byLanguage[a.language] || 0) + 1;
  }

  return {
    totalArticles: articlesCache.length,
    byCategory,
    byLanguage,
    lastFetch: lastFetchTime?.toISOString() || null,
  };
}
