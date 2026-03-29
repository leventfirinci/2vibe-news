import { NextRequest, NextResponse } from "next/server";
import {
  getArticles,
  addArticles,
  searchArticles,
  getStats,
  getLastFetchTime,
} from "@/lib/store";
import { fetchAllSources } from "@/lib/rss-fetcher";
import { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

// Auto-fetch if store is empty or stale (serverless cold start fix)
async function ensureArticles() {
  const lastFetch = getLastFetchTime();
  const staleMs = 3 * 60 * 1000; // 3 minutes

  if (getArticles().length === 0 || !lastFetch || Date.now() - lastFetch.getTime() > staleMs) {
    try {
      const articles = await fetchAllSources();
      addArticles(articles);
    } catch (e) {
      console.error("[NEWS] Auto-fetch failed:", e);
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as Category | null;
  const query = searchParams.get("q");
  const language = searchParams.get("lang");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "30");
  const statsOnly = searchParams.get("stats") === "true";

  // Ensure we have articles (handles serverless cold start)
  await ensureArticles();

  if (statsOnly) {
    return NextResponse.json(getStats());
  }

  let articles = query ? searchArticles(query) : getArticles();

  // Dual-category filter
  if (category) {
    articles = articles.filter(
      (a) =>
        a.category === category ||
        (a.secondaryCategories && a.secondaryCategories.includes(category))
    );
  }

  if (language) {
    articles = articles.filter((a) => a.language === language);
  }

  const total = articles.length;
  const start = (page - 1) * limit;
  const paginated = articles.slice(start, start + limit);

  return NextResponse.json({
    articles: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    lastFetch: getStats().lastFetch,
  });
}
