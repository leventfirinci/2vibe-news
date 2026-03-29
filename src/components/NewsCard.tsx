"use client";

import { Article } from "@/lib/types";
import { CATEGORIES } from "@/data/sources";
import { Clock, Lightbulb } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface NewsCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  featured?: boolean;
}

function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr });
  } catch {
    return "";
  }
}

function reliabilityColor(score: number) {
  if (score >= 80) return "text-[var(--color-green)] bg-[var(--color-green-bg)]";
  if (score >= 60) return "text-[var(--color-yellow)] bg-[var(--color-yellow-bg)]";
  return "text-[var(--color-red)] bg-[var(--color-red-bg)]";
}

export default function NewsCard({ article, onSelect, featured }: NewsCardProps) {
  const category = CATEGORIES.find((c) => c.id === article.category);

  return (
    <article
      onClick={() => onSelect(article)}
      className={`group cursor-pointer bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] hover:shadow-lg hover:border-[var(--color-accent)]/30 transition-all duration-200 overflow-hidden ${
        featured ? "col-span-full md:col-span-2 row-span-1" : ""
      }`}
    >
      {/* Image - only for featured */}
      {article.imageUrl && featured && (
        <div className="relative h-48 md:h-56 overflow-hidden bg-[var(--color-bg-secondary)]">
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          {article.priority === "breaking" && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[var(--color-red)] text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse" />
              Son Dakika
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Top: source + reliability + category */}
        <div className="flex items-center gap-2 mb-2 text-[12px]">
          <span className="font-semibold text-[var(--color-text-secondary)]">{article.sourceName}</span>
          <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${reliabilityColor(article.sourceReliability)}`}>
            {article.sourceReliability}
          </span>
          <span className="text-[var(--color-text-muted)]">{category?.labelTr}</span>
          {article.priority === "breaking" && !featured && (
            <span className="flex items-center gap-1 text-[var(--color-red)] font-semibold ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-red)] live-pulse" />
              Canli
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-semibold text-[var(--color-text)] leading-snug mb-2 group-hover:text-[var(--color-accent)] transition-colors ${
          featured ? "text-lg md:text-xl" : "text-[15px]"
        }`}>
          {article.title}
        </h3>

        {/* Summary - max 2 lines */}
        {article.summaryShort && (
          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3 leading-relaxed">
            {article.summaryShort}
          </p>
        )}

        {/* Why it matters */}
        {article.whyItMatters && (
          <div className="flex items-start gap-2 bg-[var(--color-accent-light)] rounded-lg px-3 py-2 mb-3">
            <Lightbulb className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--color-accent)] leading-relaxed">
              {article.whyItMatters}
            </p>
          </div>
        )}

        {/* Time */}
        <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)]">
          <Clock className="w-3 h-3" />
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
}
