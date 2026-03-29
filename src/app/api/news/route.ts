import { NextRequest, NextResponse } from "next/server";
import {
  getArticles,
  searchArticles,
  getStats,
} from "@/lib/store";
import { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as Category | null;
  const query = searchParams.get("q");
  const language = searchParams.get("lang");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "30");
  const statsOnly = searchParams.get("stats") === "true";

  if (statsOnly) {
    return NextResponse.json(getStats());
  }

  let articles = query ? searchArticles(query) : getArticles();

  // Dual-category filter: match primary OR secondary categories
  if (category) {
    articles = articles.filter(
      (a) =>
        a.category === category ||
        (a.secondaryCategories && a.secondaryCategories.includes(category))
    );
  }

  // Filter by language
  if (language) {
    articles = articles.filter((a) => a.language === language);
  }

  // Paginate
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
