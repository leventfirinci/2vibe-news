import { NextResponse } from "next/server";
import { fetchAllSources } from "@/lib/rss-fetcher";
import { summarizeArticle } from "@/lib/ai-summarizer";
import { addArticles, getArticles } from "@/lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    console.log("[FETCH] Starting RSS fetch cycle...");

    // Fetch from all RSS sources
    const rawArticles = await fetchAllSources();
    console.log(`[FETCH] Got ${rawArticles.length} raw articles`);

    // Check which articles are new (not already in store)
    const existing = new Set(getArticles().map((a) => a.originalUrl));
    const newArticles = rawArticles.filter(
      (a) => !existing.has(a.originalUrl)
    );
    console.log(`[FETCH] ${newArticles.length} new articles to process`);

    // AI summarize top articles (limit to save API calls)
    const toSummarize = newArticles
      .filter((a) => a.priority === "breaking" || a.priority === "important")
      .slice(0, 10);

    const hasAIKeys =
      process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;

    if (hasAIKeys && toSummarize.length > 0) {
      console.log(`[AI] Summarizing ${toSummarize.length} important articles...`);

      for (const article of toSummarize) {
        try {
          const { summaryShort, whyItMatters } =
            await summarizeArticle(article);
          article.summaryShort = summaryShort || article.summaryShort;
          article.whyItMatters = whyItMatters || undefined;
        } catch (err) {
          console.error(`[AI] Failed to summarize: ${article.title}`, err);
        }
      }
    }

    // Store all articles
    addArticles(newArticles);

    return NextResponse.json({
      success: true,
      fetched: rawArticles.length,
      new: newArticles.length,
      summarized: toSummarize.length,
      totalInStore: getArticles().length,
    });
  } catch (error) {
    console.error("[FETCH] Error:", error);
    return NextResponse.json(
      { error: "Fetch failed", details: String(error) },
      { status: 500 }
    );
  }
}
