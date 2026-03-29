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
      className="w-full flex items-center gap-3 py-2.5 px-3 hover:bg-[var(--color-bg-hover)] transition-colors text-left group border-b border-[var(--color-border-light)] last:border-b-0"
    >
      {/* Category dot */}
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0 opacity-60"
        style={{ backgroundColor: category?.color || "var(--color-text-muted)" }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-accent)] transition-colors leading-tight">
          {article.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-[var(--color-text-muted)]">{article.sourceName}</span>
          <span className="text-[10px] text-[var(--color-text-muted)] opacity-40">|</span>
          <span className="text-[10px] text-[var(--color-text-muted)]">{category?.labelTr}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        <ReliabilityBadge score={article.sourceReliability} size="sm" />
        <span className="text-[10px] text-[var(--color-text-muted)] whitespace-nowrap">
          {timeAgo(article.publishedAt)}
        </span>
      </div>
    </button>
  );
}
