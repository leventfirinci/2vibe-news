"use client";

import { useMemo } from "react";
import { Article } from "@/lib/types";
import { CATEGORIES } from "@/data/sources";
import { TrendingUp } from "lucide-react";
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
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  const groups = new Map<string, Article[]>();
  const sorted = [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

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
    try { timeStr = formatDistanceToNow(new Date(latest.publishedAt), { addSuffix: true, locale: tr }); } catch {}

    clusters.push({
      title: latest.title.length > 55 ? latest.title.slice(0, 52) + "..." : latest.title,
      category: category?.labelTr || latest.category,
      color: category?.color || "#666",
      count: group.length,
      latestArticle: latest,
      timeAgo: timeStr,
    });
  }

  clusters.sort((a, b) => b.count - a.count);
  return clusters.slice(0, 10);
}

export default function TrendingBar({ articles, onSelect }: TrendingBarProps) {
  const clusters = useMemo(() => computeClusters(articles), [articles]);

  const items = clusters.length > 0
    ? clusters
    : articles.slice(0, 8).map((a) => {
        const cat = CATEGORIES.find((c) => c.id === a.category);
        let timeStr = "";
        try { timeStr = formatDistanceToNow(new Date(a.publishedAt), { addSuffix: true, locale: tr }); } catch {}
        return {
          title: a.title.length > 55 ? a.title.slice(0, 52) + "..." : a.title,
          category: cat?.labelTr || a.category,
          color: cat?.color || "#666",
          count: 1,
          latestArticle: a,
          timeAgo: timeStr,
        };
      });

  if (items.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-1.5 mb-2.5">
        <TrendingUp className="w-3.5 h-3.5 text-[var(--color-accent)]" />
        <span className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider">Trend</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item.latestArticle)}
            className="shrink-0 flex items-center gap-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg px-3 py-2 hover:border-[var(--color-accent)]/20 transition-all group max-w-[280px]"
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div className="text-left min-w-0">
              <p className="text-[12px] font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                {item.title}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] text-[var(--color-text-muted)]">{item.category}</span>
                {item.count > 1 && (
                  <span className="text-[9px] font-semibold text-[var(--color-accent)]">{item.count} kaynak</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
