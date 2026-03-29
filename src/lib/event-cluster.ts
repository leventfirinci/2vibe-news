import { Article, Category, ImpactArea } from "@/lib/types";

export interface NewsEvent {
  id: string;
  title: string;
  summary: string;
  category: string;
  secondaryCategories: Category[];
  impactAreas: ImpactArea[];
  priority: "breaking" | "important" | "normal";
  articles: Article[];
  sourceCount: number;
  sources: string[];
  highestReliability: number;
  latestUpdate: string;
  firstSeen: string;
  whyItMatters?: string;
  imageUrl?: string;
  leadArticle: Article;
}

/**
 * Groups articles into events using title similarity + time proximity.
 * This is the core intelligence layer — articles become EVENTS.
 */
export function clusterArticlesIntoEvents(articles: Article[]): NewsEvent[] {
  if (articles.length === 0) return [];

  const TIME_WINDOW = 12 * 60 * 60 * 1000; // 12 hours
  const SIMILARITY_THRESHOLD = 0.35;

  // Sort by date (newest first)
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const clusters: Article[][] = [];
  const assigned = new Set<string>();

  for (const article of sorted) {
    if (assigned.has(article.id)) continue;

    const cluster: Article[] = [article];
    assigned.add(article.id);

    // Find similar articles within time window
    for (const candidate of sorted) {
      if (assigned.has(candidate.id)) continue;
      if (candidate.category !== article.category) continue;

      const timeDiff = Math.abs(
        new Date(article.publishedAt).getTime() - new Date(candidate.publishedAt).getTime()
      );
      if (timeDiff > TIME_WINDOW) continue;

      const similarity = titleSimilarity(article.title, candidate.title);
      if (similarity >= SIMILARITY_THRESHOLD) {
        cluster.push(candidate);
        assigned.add(candidate.id);
      }
    }

    clusters.push(cluster);
  }

  // Convert clusters to NewsEvents
  return clusters.map((cluster) => {
    // Lead article = highest reliability source
    const lead = cluster.reduce((best, a) =>
      a.sourceReliability > best.sourceReliability ? a : best
    );

    const sources = [...new Set(cluster.map((a) => a.sourceName))];
    const priorities = cluster.map((a) => a.priority);
    const priority = priorities.includes("breaking")
      ? "breaking"
      : priorities.includes("important")
        ? "important"
        : "normal";

    const dates = cluster.map((a) => new Date(a.publishedAt).getTime());

    // Only use LEAD article's secondary/impact (don't merge — merging caused wrong badges)
    // Lead article has highest reliability → most trustworthy classification
    const leadSecondary = lead.secondaryCategories || [];
    const leadImpacts = lead.impactAreas || [];

    return {
      id: `event-${lead.id}`,
      title: lead.title,
      summary: lead.summaryShort || cluster.find((a) => a.summaryShort)?.summaryShort || "",
      category: lead.category,
      secondaryCategories: leadSecondary.slice(0, 1),
      impactAreas: leadImpacts.slice(0, 2),
      priority,
      articles: cluster,
      sourceCount: sources.length,
      sources,
      highestReliability: lead.sourceReliability,
      latestUpdate: new Date(Math.max(...dates)).toISOString(),
      firstSeen: new Date(Math.min(...dates)).toISOString(),
      whyItMatters: lead.whyItMatters || cluster.find((a) => a.whyItMatters)?.whyItMatters,
      imageUrl: lead.imageUrl || cluster.find((a) => a.imageUrl)?.imageUrl,
      leadArticle: lead,
    };
  });
}

/**
 * Trigram-based title similarity (language-agnostic, fast).
 */
function titleSimilarity(a: string, b: string): number {
  const normalize = (s: string) =>
    s.toLowerCase()
      .replace(/[^a-z0-9\u00e7\u011f\u0131\u00f6\u015f\u00fc\s]/g, "") // keep TR chars
      .replace(/\s+/g, " ")
      .trim();

  const na = normalize(a);
  const nb = normalize(b);

  if (na === nb) return 1;
  if (na.length < 5 || nb.length < 5) return 0;

  const trigramsA = getTrigrams(na);
  const trigramsB = getTrigrams(nb);

  if (trigramsA.size === 0 || trigramsB.size === 0) return 0;

  let intersection = 0;
  for (const t of trigramsA) {
    if (trigramsB.has(t)) intersection++;
  }

  return (2 * intersection) / (trigramsA.size + trigramsB.size);
}

function getTrigrams(s: string): Set<string> {
  const trigrams = new Set<string>();
  for (let i = 0; i <= s.length - 3; i++) {
    trigrams.add(s.slice(i, i + 3));
  }
  return trigrams;
}
