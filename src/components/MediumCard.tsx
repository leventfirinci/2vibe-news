"use client";

import { Article } from "@/lib/types";
import { CATEGORIES } from "@/data/sources";
import ReliabilityBadge from "./ReliabilityBadge";
import { Lightbulb, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface MediumCardProps {
  article: Article;
  onSelect: (article: Article) => void;
}

function timeAgo(dateStr: string): string {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr }); }
  catch { return ""; }
}

export default function MediumCard({ article, onSelect }: MediumCardProps) {
  const category = CATEGORIES.find((c) => c.id === article.category);
  const hasImage = !!article.imageUrl;

  return (
    <article
      onClick={() => onSelect(article)}
      className="group cursor-pointer bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/25 transition-all duration-200 overflow-hidden flex flex-col sm:flex-row"
    >
      {/* Image */}
      {hasImage && (
        <div className="relative w-full sm:w-[38%] h-40 sm:h-auto overflow-hidden bg-[var(--color-bg-secondary)] shrink-0">
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <span
            className="absolute top-2.5 left-2.5 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ backgroundColor: `${category?.color}cc` }}
          >
            {category?.labelTr}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Priority */}
        {article.priority === "breaking" && (
          <div className="flex items-center gap-1.5 text-[var(--color-red)] text-[10px] font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-red)] live-pulse" />
            Son Dakika
          </div>
        )}

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-[var(--color-text)] leading-snug mb-1.5 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Summary */}
        {article.summaryShort && (
          <p className="text-[13px] text-[var(--color-text-secondary)] line-clamp-2 mb-2 leading-relaxed">
            {article.summaryShort}
          </p>
        )}

        {/* Why it matters */}
        {article.whyItMatters && (
          <div className="flex items-start gap-1.5 bg-[var(--color-accent-light)] rounded-lg px-2.5 py-1.5 mb-2">
            <Lightbulb className="w-3 h-3 text-[var(--color-accent)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--color-accent)] leading-relaxed line-clamp-1">
              {article.whyItMatters}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-[var(--color-border-light)]">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{article.sourceName}</span>
          <ReliabilityBadge score={article.sourceReliability} size="sm" />
          <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] ml-auto">
            <Clock className="w-2.5 h-2.5" />
            {timeAgo(article.publishedAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
