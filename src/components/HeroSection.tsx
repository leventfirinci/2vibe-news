"use client";

import { Article } from "@/lib/types";
import { CATEGORIES } from "@/data/sources";
import ReliabilityBadge from "./ReliabilityBadge";
import { Lightbulb, Clock, Radio, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface HeroSectionProps {
  article: Article;
  sourceCount: number;
  onSelect: (article: Article) => void;
}

function timeAgo(dateStr: string): string {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr }); }
  catch { return ""; }
}

export default function HeroSection({ article, sourceCount, onSelect }: HeroSectionProps) {
  const category = CATEGORIES.find((c) => c.id === article.category);

  return (
    <section
      onClick={() => onSelect(article)}
      className="relative w-full min-h-[280px] md:min-h-[340px] rounded-2xl overflow-hidden cursor-pointer group scale-in"
    >
      {/* Background image */}
      {article.imageUrl ? (
        <img
          src={article.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-red-dark)] to-[#1a0a0a]" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-overlay" />

      {/* Red left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-red)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-5 md:p-8 max-w-3xl">
        {/* Top badges */}
        <div className="flex items-center gap-3 mb-3">
          {/* LIVE badge */}
          <div className="flex items-center gap-1.5 bg-[var(--color-red)] text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
            <Radio className="w-3 h-3" />
            <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse" />
            CANLI
          </div>

          {/* Category */}
          <span
            className="text-white text-[11px] font-semibold px-2.5 py-1 rounded-md"
            style={{ backgroundColor: `${category?.color || "#666"}cc` }}
          >
            {category?.labelTr}
          </span>

          {/* Source count */}
          {sourceCount > 1 && (
            <div className="flex items-center gap-1 text-white/70 text-[11px]">
              <Users className="w-3 h-3" />
              {sourceCount} kaynak
            </div>
          )}
        </div>

        {/* Headline */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
          {article.title}
        </h1>

        {/* Summary */}
        {article.summaryShort && (
          <p className="text-sm md:text-base text-white/80 leading-relaxed mb-3 line-clamp-2 max-w-2xl">
            {article.summaryShort}
          </p>
        )}

        {/* Why it matters */}
        {article.whyItMatters && (
          <div className="flex items-start gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 mb-3 max-w-xl">
            <Lightbulb className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
            <p className="text-xs text-white/90 leading-relaxed">{article.whyItMatters}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3 text-white/60 text-xs">
          <span className="font-medium text-white/80">{article.sourceName}</span>
          <ReliabilityBadge score={article.sourceReliability} size="sm" />
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(article.publishedAt)}
          </div>
        </div>
      </div>
    </section>
  );
}
