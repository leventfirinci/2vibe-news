"use client";

import { Article } from "@/lib/types";
import { CATEGORIES } from "@/data/sources";
import { TrendingUp, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface TrendingBarProps {
  articles: Article[];
  onSelect: (article: Article) => void;
}

interface TrendingCluster {
  title: string;
  category: string;
  color: string;
  count: number;
  latestArticle: Article;
  timeAgo: string;
}

function computeClusters(articles: Article[]): TrendingCluster[] {
  // Group articles by category + 6hr time windows
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  const groups = new Map<string, Article[]>();

  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  for (const article of sorted) {
    const time = new Date(article.publishedAt).getTime();
    const bucket = Math.floor(time / SIX_HOURS);
    const key = `${article.category}-${bucket}`;

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(article);
  }

  const clusters: TrendingCluster[] = [];
  for (const [, group] of groups) {
    if (group.length < 2) continue;
    const latest = group[0];
    const category = CATEGORIES.find((c) => c.id === latest.category);

    let timeStr = "";
    try { timeStr = formatDistanceToNow(new Date(latest.publishedAt), { addSuffix: true, locale: tr }); }
    catch { /* ignore */ }

    clusters.push({
      title: latest.title.length > 60 ? latest.title.slice(0, 57) + "..." : latest.title,
      category: category?.labelTr || latest.category,
      color: category?.color || "#666",
      count: group.length,
      latestArticle: latest,
      timeAgo: timeStr,
    });
  }

  // Sort by source count (most covered stories first)
  clusters.sort((a, b) => b.count - a.count);
  return clusters.slice(0, 10);
}

export default function TrendingBar({ articles, onSelect }: TrendingBarProps) {
  const clusters = computeClusters(articles);

  // Fallback: if no clusters, show 8 most recent
  const items = clusters.length > 0
    ? clusters
    : articles.slice(0, 8).map((a) => {
        const cat = CATEGORIES.find((c) => c.id === a.category);
        let timeStr = "";
        try { timeStr = formatDistanceToNow(new Date(a.publishedAt), { addSuffix: true, locale: tr }); }
        catch { /* ignore */ }
        return {
          title: a.title.length > 60 ? a.title.slice(0, 57) + "..." : a.title,
          category: cat?.labelTr || a.category,
          color: cat?.color || "#666",
          count: 1,
          latestArticle: a,
          timeAgo: timeStr,
        };
      });

  if (items.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-[var(--color-accent)]" />
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Trend</h2>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item.latestArticle)}
            className="shrink-0 flex items-center gap-2.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 hover:border-[var(--color-accent)]/30 hover:shadow-sm transition-all group max-w-xs"
          >
            {/* Category dot */}
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />

            {/* Content */}
            <div className="text-left min-w-0">
              <p className="text-xs font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-accent)] transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-[var(--color-text-muted)]">{item.category}</span>
                {item.count > 1 && (
                  <span className="text-[10px] font-medium text-[var(--color-accent)]">{item.count} kaynak</span>
                )}
                <span className="text-[10px] text-[var(--color-text-muted)]">{item.timeAgo}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
