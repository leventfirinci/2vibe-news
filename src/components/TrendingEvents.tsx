"use client";

import { NewsEvent } from "@/lib/event-cluster";
import { CATEGORIES } from "@/data/sources";
import { TrendingUp, Users, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface TrendingEventsProps {
  events: NewsEvent[];
  onSelectEvent: (event: NewsEvent) => void;
}

function timeAgo(dateStr: string): string {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr }); }
  catch { return ""; }
}

export default function TrendingEvents({ events, onSelectEvent }: TrendingEventsProps) {
  if (events.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-1.5 mb-3">
        <TrendingUp className="w-3.5 h-3.5 text-[var(--color-accent)]" />
        <span className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">Su An Gundemde</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {events.map((event, i) => {
          const category = CATEGORIES.find((c) => c.id === event.category);
          return (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="text-left bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-3.5 hover:border-[var(--color-accent)]/20 transition-all group relative overflow-hidden"
            >
              {/* Number indicator */}
              <div className="absolute top-2.5 right-3 text-[28px] font-black text-[var(--color-border)] select-none leading-none">
                {i + 1}
              </div>

              {/* Category + sources */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: category?.color }}
                />
                <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  {category?.labelTr}
                </span>
                <div className="flex items-center gap-0.5 text-[10px] text-[var(--color-accent)] font-semibold ml-auto mr-6">
                  <Users className="w-2.5 h-2.5" />
                  {event.sourceCount}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[13px] font-semibold text-[var(--color-text)] leading-snug mb-1.5 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2 pr-4">
                {event.title}
              </h3>

              {/* Meta */}
              <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
                <span>{event.leadArticle.sourceName}</span>
                <span className="opacity-30">|</span>
                <span>{timeAgo(event.latestUpdate)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
