"use client";

import { Article } from "@/lib/types";
import { CATEGORIES } from "@/data/sources";
import ReliabilityBadge from "./ReliabilityBadge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface CompactCardProps {
  article: Article;
  onSelect: (article: Article) => void;
}

function timeAgo(dateStr: string): string {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr }); }
  catch { return ""; }
}

export default function CompactCard({ article, onSelect }: CompactCardProps) {
  const category = CATEGORIES.find((c) => c.id === article.category);

  return (
    <button
      onClick={() => onSelect(article)}
      className="w-full flex items-center gap-3 py-3 px-3 border-b border-[var(--color-border-light)] hover:bg-[var(--color-bg-hover)] transition-colors text-left group"
    >
      {/* Category dot */}
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: category?.color || "var(--color-text-muted)" }}
      />

      {/* Title + source */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-accent)] transition-colors">
          {article.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-[var(--color-text-muted)]">{article.sourceName}</span>
          <span className="text-[11px] text-[var(--color-text-muted)]">{category?.labelTr}</span>
        </div>
      </div>

      {/* Right: reliability + time */}
      <div className="flex items-center gap-2 shrink-0">
        <ReliabilityBadge score={article.sourceReliability} size="sm" />
        <span className="text-[11px] text-[var(--color-text-muted)] w-20 text-right">
          {timeAgo(article.publishedAt)}
        </span>
      </div>
    </button>
  );
}
