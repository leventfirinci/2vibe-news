import RSSParser from "rss-parser";
import { NEWS_SOURCES } from "@/data/sources";
import { Article, Category, Language, Priority } from "@/lib/types";
import { classifyCategory, detectPriority } from "@/lib/classifier";

const parser = new RSSParser({
  timeout: 10000,
  headers: {
    "User-Agent": "2VibeNews/1.0 (news aggregator; contact@2vibenews.com)",
  },
});

function generateId(url: string, title: string): string {
  const str = `${url}::${title}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36) + Date.now().toString(36);
}

function extractImageUrl(item: RSSParser.Item): string | undefined {
  // Try enclosure
  if (item.enclosure?.url) return item.enclosure.url;

  // Try media content
  const media = (item as Record<string, unknown>)["media:content"] as
    | { $?: { url?: string } }
    | undefined;
  if (media?.$?.url) return media.$.url;

  // Try media thumbnail
  const thumb = (item as Record<string, unknown>)["media:thumbnail"] as
    | { $?: { url?: string } }
    | undefined;
  if (thumb?.$?.url) return thumb.$.url;

  // Try to extract from content/description
  const content = item.content || item.contentSnippet || "";
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  return undefined;
}

function cleanText(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "") // strip HTML
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchFromSource(
  source: (typeof NEWS_SOURCES)[number]
): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.rssUrl);
    const articles: Article[] = [];

    const items = feed.items.slice(0, 15); // Max 15 per source

    for (const item of items) {
      if (!item.title || !item.link) continue;

      const title = cleanText(item.title);
      const snippet = cleanText(
        item.contentSnippet || item.content || item.summary || ""
      );

      const category = classifyCategory(title, snippet, source.defaultCategory);
      const priority = detectPriority(title, snippet, source.language);

      const article: Article = {
        id: generateId(item.link, title),
        sourceId: source.id,
        sourceName: source.name,
        sourceReliability: source.reliabilityScore,
        sourceReliabilityTier: source.reliabilityTier,
        title,
        originalUrl: item.link,
        imageUrl: extractImageUrl(item),
        language: source.language,
        category,
        priority,
        summaryShort: snippet.slice(0, 200) || undefined,
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        collectedAt: new Date().toISOString(),
      };

      articles.push(article);
    }

    return articles;
  } catch (error) {
    console.error(`[RSS] Failed to fetch ${source.name}:`, error);
    return [];
  }
}

export async function fetchAllSources(): Promise<Article[]> {
  const results = await Promise.allSettled(
    NEWS_SOURCES.map((source) => fetchFromSource(source))
  );

  const allArticles: Article[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const result of results) {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
      if (result.value.length > 0) successCount++;
    } else {
      failCount++;
    }
  }

  console.log(
    `[RSS] Fetched ${allArticles.length} articles from ${successCount} sources (${failCount} failed)`
  );

  // Deduplicate by similar titles
  const seen = new Map<string, Article>();
  for (const article of allArticles) {
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^a-zçğıöşü0-9]/g, "")
      .slice(0, 60);

    const existing = seen.get(normalizedTitle);
    if (!existing || article.sourceReliability > existing.sourceReliability) {
      // Keep the one from higher reliability source but track related
      if (existing) {
        article.relatedArticleIds = [
          ...(article.relatedArticleIds || []),
          existing.id,
        ];
      }
      seen.set(normalizedTitle, article);
    }
  }

  // Sort by date, breaking first
  const deduped = Array.from(seen.values());
  deduped.sort((a, b) => {
    if (a.priority === "breaking" && b.priority !== "breaking") return -1;
    if (b.priority === "breaking" && a.priority !== "breaking") return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return deduped;
}
