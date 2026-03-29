"use client";

import { NewsEvent } from "@/lib/event-cluster";
import { CATEGORIES } from "@/data/sources";
import ReliabilityBadge from "./ReliabilityBadge";
import ImpactBadges from "./ImpactBadges";
import { X, Clock, Radio, Users, Lightbulb, ArrowRight, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { tr } from "date-fns/locale";
import { useState } from "react";

interface EventDetailProps {
  event: NewsEvent;
  onClose: () => void;
}

function timeAgo(dateStr: string): string {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr }); }
  catch { return ""; }
}

function formatDate(dateStr: string): string {
  try { return format(new Date(dateStr), "dd MMM yyyy HH:mm", { locale: tr }); }
  catch { return ""; }
}

function reliabilityBarColor(score: number) {
  if (score >= 80) return "var(--color-green)";
  if (score >= 60) return "var(--color-yellow)";
  return "var(--color-red)";
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  const category = CATEGORIES.find((c) => c.id === event.category);
  const [showAllSources, setShowAllSources] = useState(false);

  // Sort articles by reliability (highest first)
  const sortedArticles = [...event.articles].sort((a, b) => b.sourceReliability - a.sourceReliability);
  const visibleSources = showAllSources ? sortedArticles : sortedArticles.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 fade-in" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-xl bg-[var(--color-bg-card)] overflow-y-auto slide-in shadow-2xl transition-colors">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] px-5 py-3 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">{event.leadArticle.sourceName}</span>
            <ReliabilityBadge score={event.highestReliability} size="md" />
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image */}
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt=""
            className="w-full h-48 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}

        <div className="p-5 space-y-5 fade-in">
          {/* === STATUS BAR === */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {event.priority === "breaking" && (
                <span className="flex items-center gap-1 text-[var(--color-red)] font-bold">
                  <Radio className="w-3 h-3" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-red)] live-pulse" />
                  Son Dakika
                </span>
              )}
              {event.priority === "important" && (
                <span className="text-[var(--color-yellow)] font-bold">Onemli</span>
              )}
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium text-white"
                style={{ backgroundColor: category?.color || "#666" }}
              >
                {category?.labelTr}
              </span>
              <span className="flex items-center gap-1 text-[var(--color-accent)] font-semibold">
                <Users className="w-3 h-3" />
                {event.sourceCount} kaynak
              </span>
              <span className="text-[var(--color-text-muted)]">|</span>
              <span className="text-[var(--color-text-muted)] uppercase">{event.leadArticle.language}</span>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Ilk: {timeAgo(event.firstSeen)}
              </span>
              {event.firstSeen !== event.latestUpdate && (
                <span>Son guncelleme: {timeAgo(event.latestUpdate)}</span>
              )}
            </div>
          </div>

          {/* === TITLE === */}
          <h1 className="text-xl font-bold text-[var(--color-text)] leading-tight">
            {event.title}
          </h1>

          {/* === AI SUMMARY === */}
          {event.summary && (
            <div className="bg-[var(--color-bg)] rounded-xl p-4 transition-colors">
              <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
                {event.summary}
              </p>
            </div>
          )}

          {/* === WHY IT MATTERS === */}
          {event.whyItMatters && (
            <div className="bg-[var(--color-accent-light)] rounded-xl p-4 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="text-sm font-semibold text-[var(--color-accent)]">Neden Onemli?</span>
              </div>
              <p className="text-sm text-[var(--color-accent)] leading-relaxed">
                {event.whyItMatters}
              </p>
            </div>
          )}

          {/* === IMPACT AREAS === */}
          {(event.impactAreas?.length > 0 || event.secondaryCategories?.length > 0) && (
            <div>
              <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
                Etki Alanlari
              </span>
              <ImpactBadges impactAreas={event.impactAreas || []} secondaryCategories={event.secondaryCategories || []} size="md" />
            </div>
          )}

          {/* === SOURCE RELIABILITY COMPARISON === */}
          {event.articles.length > 1 && (
            <div className="bg-[var(--color-bg)] rounded-xl p-4 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  Kaynak Karsilastirmasi ({event.sourceCount})
                </span>
              </div>
              <div className="space-y-2">
                {sortedArticles.map((article) => (
                  <div key={article.id} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)] w-24 truncate">
                      {article.sourceName}
                    </span>
                    <div className="flex-1 h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${article.sourceReliability}%`,
                          backgroundColor: reliabilityBarColor(article.sourceReliability),
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold w-7 text-right"
                      style={{ color: reliabilityBarColor(article.sourceReliability) }}
                    >
                      {article.sourceReliability}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === ALL SOURCES LIST === */}
          <div>
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
              Bu Olayi Haberlestiren Kaynaklar
            </span>
            <div className="space-y-2">
              {visibleSources.map((article) => (
                <a
                  key={article.id}
                  href={article.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[var(--color-text)]">{article.sourceName}</span>
                      <ReliabilityBadge score={article.sourceReliability} size="sm" />
                      <span className="text-[10px] text-[var(--color-text-muted)]">{timeAgo(article.publishedAt)}</span>
                    </div>
                    <p className="text-[13px] text-[var(--color-text-secondary)] line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                      {article.title}
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0 mt-1 group-hover:text-[var(--color-accent)] transition-colors" />
                </a>
              ))}

              {sortedArticles.length > 3 && (
                <button
                  onClick={() => setShowAllSources(!showAllSources)}
                  className="flex items-center gap-1 text-xs text-[var(--color-accent)] font-medium hover:underline mx-auto"
                >
                  {showAllSources ? (
                    <>Daha az goster <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>{sortedArticles.length - 3} kaynak daha <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* === CTA — AT BOTTOM === */}
          <a
            href={event.leadArticle.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Haberin Tamami ({event.leadArticle.sourceName})
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
