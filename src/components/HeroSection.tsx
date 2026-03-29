"use client";

import { Article } from "@/lib/types";
import { CATEGORIES } from "@/data/sources";
import ReliabilityBadge from "./ReliabilityBadge";
import { Clock, Radio, Users, ArrowRight } from "lucide-react";
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
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer group scale-in"
      style={{ minHeight: "clamp(260px, 40vh, 400px)" }}
    >
      {/* Background */}
      {article.imageUrl ? (
        <img
          src={article.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0505] via-[#2d0a0a] to-[#0a0a0a]" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 gradient-overlay" />

      {/* Red accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-red)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8 lg:p-10">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-[var(--color-red)] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg">
            <Radio className="w-3 h-3" />
            <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse" />
            Canli
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider text-white/90 px-2.5 py-1 rounded-md"
            style={{ backgroundColor: `${category?.color}bb` }}
          >
            {category?.labelTr}
          </span>
          {sourceCount > 1 && (
            <div className="flex items-center gap-1 text-white/50 text-[11px]">
              <Users className="w-3 h-3" />
              {sourceCount} kaynak
            </div>
          )}
        </div>

        {/* Headline */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] font-extrabold text-white leading-[1.15] mb-3 max-w-3xl tracking-tight">
          {article.title}
        </h1>

        {/* Summary */}
        {article.summaryShort && (
          <p className="text-sm md:text-base text-white/70 leading-relaxed mb-4 line-clamp-2 max-w-2xl">
            {article.summaryShort}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-white/80">{article.sourceName}</span>
          <ReliabilityBadge score={article.sourceReliability} size="sm" />
          <span className="flex items-center gap-1 text-white/40 text-xs">
            <Clock className="w-3 h-3" />
            {timeAgo(article.publishedAt)}
          </span>
          <div className="ml-auto flex items-center gap-1 text-white/50 text-xs group-hover:text-[var(--color-accent)] transition-colors">
            Detay <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </section>
  );
}
