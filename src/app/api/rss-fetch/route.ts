import { NextResponse } from "next/server";
import { fetchAllSources } from "@/lib/rss-fetcher";
import { summarizeArticle } from "@/lib/ai-summarizer";
import { addArticles, getArticles } from "@/lib/store";

export const dynamic = "force-dynamic";
// Vercel Hobby: max 10s. Pro: 60s. Set to 60 — Hobby will cap at 10.
export const maxDuration = 60;

export async function GET() {
  const startTime = Date.now();

  try {
    console.log("[FETCH] Starting RSS fetch cycle...");

    // Fetch from all RSS sources
    const rawArticles = await fetchAllSources();
    console.log(`[FETCH] Got ${rawArticles.length} articles in ${Date.now() - startTime}ms`);

    // Check which articles are new
    const existing = new Set(getArticles().map((a) => a.originalUrl));
    const newArticles = rawArticles.filter((a) => !existing.has(a.originalUrl));
    console.log(`[FETCH] ${newArticles.length} new articles`);

    // AI summarize — only if we have time and keys
    const hasAIKeys = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;
    let summarized = 0;

    if (hasAIKeys && newArticles.length > 0) {
      const toSummarize = newArticles
        .filter((a) => a.priority === "breaking" || a.priority === "important")
        .slice(0, 5); // Limit to 5 to stay within time

      for (const article of toSummarize) {
        // Check if we're running out of time (leave 2s buffer)
        if (Date.now() - startTime > 8000) {
          console.log("[AI] Time limit approaching, skipping remaining");
          break;
        }

        try {
          const { summaryShort, whyItMatters } = await summarizeArticle(article);
          article.summaryShort = summaryShort || article.summaryShort;
          article.whyItMatters = whyItMatters || undefined;
          summarized++;
        } catch (err) {
          console.error(`[AI] Failed: ${article.title}`, err);
        }
      }
    }

    // Store
    addArticles(newArticles);

    return NextResponse.json({
      success: true,
      fetched: rawArticles.length,
      new: newArticles.length,
      summarized,
      totalInStore: getArticles().length,
      durationMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error("[FETCH] Error:", error);
    return NextResponse.json(
      { error: "Fetch failed" },
      { status: 500 }
    );
  }
}
