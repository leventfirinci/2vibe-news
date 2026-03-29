"use client";

import { NewsEvent } from "@/lib/event-cluster";
import { CATEGORIES } from "@/data/sources";
import { getCategoryImage } from "@/data/category-images";
import ReliabilityBadge from "./ReliabilityBadge";
import { Radio, Clock, Users, Lightbulb, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface LiveHeroProps {
  event: NewsEvent;
  onSelectArticle: (articleId: string) => void;
}

function timeAgo(dateStr: string): string {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr }); }
  catch { return ""; }
}

export default function LiveHero({ event, onSelectArticle }: LiveHeroProps) {
  const category = CATEGORIES.find((c) => c.id === event.category);

  return (
    <section
      onClick={() => onSelectArticle(event.leadArticle.id)}
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer group"
      style={{ minHeight: "clamp(280px, 42vh, 420px)" }}
    >
      {/* Background — always a real photo */}
      <img
        src={event.imageUrl || getCategoryImage(event.category, event.title)}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          if (el.src !== getCategoryImage(event.category, event.title)) {
            el.src = getCategoryImage(event.category, event.title);
          }
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 gradient-overlay" />

      {/* Red accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-red)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8 lg:p-10">
        {/* Status bar */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-[var(--color-red)] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-lg shadow-red-500/20">
            <Radio className="w-3 h-3" />
            <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse" />
            Canli
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-widest text-white/90 px-2.5 py-1 rounded"
            style={{ backgroundColor: `${category?.color}aa` }}
          >
            {category?.labelTr}
          </span>
          <div className="flex items-center gap-1 text-white/40 text-[11px] ml-1">
            <Users className="w-3 h-3" />
            <span className="font-semibold text-white/60">{event.sourceCount}</span> kaynak dogruladi
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-[1.1] mb-3 max-w-3xl tracking-tight">
          {event.title}
        </h1>

        {/* Summary */}
        {event.summary && (
          <p className="text-sm md:text-[15px] text-white/65 leading-relaxed mb-3 line-clamp-2 max-w-2xl">
            {event.summary}
          </p>
        )}

        {/* Why it matters */}
        {event.whyItMatters && (
          <div className="flex items-start gap-2 glass rounded-lg px-3.5 py-2.5 mb-4 max-w-xl border border-white/5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 block mb-0.5">Neden Onemli</span>
              <p className="text-xs text-white/80 leading-relaxed">{event.whyItMatters}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-white/75">{event.leadArticle.sourceName}</span>
          <ReliabilityBadge score={event.highestReliability} size="sm" />
          <span className="flex items-center gap-1 text-white/35 text-xs">
            <Clock className="w-3 h-3" />
            {timeAgo(event.latestUpdate)}
          </span>
          {event.sourceCount > 1 && (
            <span className="ml-auto flex items-center gap-0.5 text-[11px] text-white/30 group-hover:text-[var(--color-accent)] transition-colors">
              {event.sourceCount} farkli kaynak <ChevronRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
