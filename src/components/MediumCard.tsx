"use client";

import { Article } from "@/lib/types";
import { CATEGORIES } from "@/data/sources";
import ReliabilityBadge from "./ReliabilityBadge";
import { Lightbulb, Clock, AlertTriangle } from "lucide-react";
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
      className="group cursor-pointer bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] hover:shadow-lg hover:border-[var(--color-accent)]/20 transition-all duration-200 overflow-hidden flex flex-col sm:flex-row"
    >
      {/* Image */}
      {hasImage && (
        <div className="relative w-full sm:w-2/5 h-44 sm:h-auto overflow-hidden bg-[var(--color-bg-secondary)] shrink-0">
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          {/* Category badge on image */}
          <span
            className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-md"
            style={{ backgroundColor: category?.color || "#666" }}
          >
            {category?.labelTr}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Priority badge */}
          {article.priority === "important" && (
            <div className="flex items-center gap-1 text-[var(--color-yellow)] text-[11px] font-semibold mb-2">
              <AlertTriangle className="w-3 h-3" />
              Onemli
            </div>
          )}
          {article.priority === "breaking" && (
            <div className="flex items-center gap-1 text-[var(--color-red)] text-[11px] font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-red)] live-pulse" />
              Son Dakika
            </div>
          )}

          {/* Title */}
          <h3 className="text-base font-semibold text-[var(--color-text)] leading-snug mb-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Summary */}
          {article.summaryShort && (
            <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-2 leading-relaxed">
              {article.summaryShort}
            </p>
          )}

          {/* Why it matters */}
          {article.whyItMatters && (
            <div className="flex items-start gap-1.5 bg-[var(--color-accent-light)] rounded-lg px-2.5 py-1.5 mb-2">
              <Lightbulb className="w-3 h-3 text-[var(--color-accent)] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[var(--color-accent)] leading-relaxed line-clamp-2">
                {article.whyItMatters}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-light)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">{article.sourceName}</span>
            <ReliabilityBadge score={article.sourceReliability} size="sm" />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
            <Clock className="w-3 h-3" />
            {timeAgo(article.publishedAt)}
          </div>
        </div>
      </div>
    </article>
  );
}
