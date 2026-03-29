"use client";

import { NewsEvent } from "@/lib/event-cluster";
import { CATEGORIES } from "@/data/sources";
import ReliabilityBadge from "./ReliabilityBadge";
import { Clock, Users, Lightbulb, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface EventCardProps {
  event: NewsEvent;
  onSelect: (event: NewsEvent) => void;
}

function timeAgo(dateStr: string): string {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr }); }
  catch { return ""; }
}

export default function EventCard({ event, onSelect }: EventCardProps) {
  const category = CATEGORIES.find((c) => c.id === event.category);
  const hasImage = !!event.imageUrl;

  return (
    <article
      onClick={() => onSelect(event)}
      className="group cursor-pointer bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 transition-all duration-200 overflow-hidden flex flex-col sm:flex-row"
    >
      {/* Image */}
      {hasImage && (
        <div className="relative w-full sm:w-[36%] h-36 sm:h-auto overflow-hidden bg-[var(--color-bg-secondary)] shrink-0">
          <img
            src={event.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Source count badge on image */}
          {event.sourceCount > 1 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              <Users className="w-2.5 h-2.5" />
              {event.sourceCount} kaynak
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Category + priority */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: category?.color }}
          />
          <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
            {category?.labelTr}
          </span>
          {event.priority === "breaking" && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-red)] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-red)] live-pulse" />
              Canli
            </span>
          )}
          {!hasImage && event.sourceCount > 1 && (
            <div className="flex items-center gap-0.5 text-[10px] text-[var(--color-accent)] font-semibold ml-auto">
              <Users className="w-2.5 h-2.5" />
              {event.sourceCount}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-[var(--color-text)] leading-snug mb-1.5 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Summary */}
        {event.summary && (
          <p className="text-[12px] text-[var(--color-text-secondary)] line-clamp-2 mb-2 leading-relaxed">
            {event.summary}
          </p>
        )}

        {/* Why it matters */}
        {event.whyItMatters && (
          <div className="flex items-start gap-1.5 bg-[var(--color-accent-light)] rounded px-2 py-1.5 mb-2">
            <Lightbulb className="w-3 h-3 text-[var(--color-accent)] shrink-0 mt-0.5" />
            <p className="text-[10px] text-[var(--color-accent)] leading-relaxed line-clamp-1">
              {event.whyItMatters}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-[var(--color-border-light)]">
          <span className="text-[11px] text-[var(--color-text-secondary)]">{event.leadArticle.sourceName}</span>
          <ReliabilityBadge score={event.highestReliability} size="sm" />
          <span className="flex items-center gap-0.5 text-[10px] text-[var(--color-text-muted)] ml-auto">
            <Clock className="w-2.5 h-2.5" />
            {timeAgo(event.latestUpdate)}
          </span>
          {event.sourceCount > 1 && (
            <span className="text-[10px] text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors flex items-center">
              Kaynaklar <ChevronRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
