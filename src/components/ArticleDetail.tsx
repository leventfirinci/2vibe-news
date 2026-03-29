"use client";

import { Article } from "@/lib/types";
import { CATEGORIES } from "@/data/sources";
import ReliabilityBadge from "./ReliabilityBadge";
import { X, Clock, Lightbulb, ArrowRight, Users } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface ArticleDetailProps {
  article: Article;
  relatedArticles: Article[];
  onClose: () => void;
  onSelectRelated: (article: Article) => void;
}

function reliabilityBarColor(score: number) {
  if (score >= 80) return "var(--color-green)";
  if (score >= 60) return "var(--color-yellow)";
  return "var(--color-red)";
}

export default function ArticleDetail({ article, relatedArticles, onClose, onSelectRelated }: ArticleDetailProps) {
  const category = CATEGORIES.find((c) => c.id === article.category);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 fade-in" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-xl bg-[var(--color-bg-card)] overflow-y-auto slide-in shadow-2xl transition-colors">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] px-5 py-3 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">{article.sourceName}</span>
            <ReliabilityBadge score={article.sourceReliability} size="md" />
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image */}
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-52 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}

        <div className="p-5 fade-in">
          {/* Category + Date */}
          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mb-3">
            {article.priority === "breaking" && (
              <span className="text-[var(--color-red)] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-red)] live-pulse" />
                Son Dakika
              </span>
            )}
            {article.priority === "important" && (
              <span className="text-[var(--color-yellow)] font-semibold">Onemli</span>
            )}
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium text-white"
              style={{ backgroundColor: category?.color || "#666" }}
            >
              {category?.labelTr}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(article.publishedAt), "dd MMM yyyy HH:mm", { locale: tr })}
            </span>
            <span className="uppercase">{article.language}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-[var(--color-text)] leading-tight mb-4">
            {article.title}
          </h1>

          {/* Summary */}
          {article.summaryShort && (
            <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed mb-5">
              {article.summaryShort}
            </p>
          )}

          {/* Why it matters */}
          {article.whyItMatters && (
            <div className="mb-5 bg-[var(--color-accent-light)] rounded-xl p-4 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="text-sm font-semibold text-[var(--color-accent)]">Neden Onemli?</span>
              </div>
              <p className="text-sm text-[var(--color-accent)] leading-relaxed">
                {article.whyItMatters}
              </p>
            </div>
          )}

          {/* Source Reliability Visual */}
          <div className="mb-5 p-4 bg-[var(--color-bg)] rounded-xl transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-[var(--color-text)]">Kaynak Guvenilirlik</span>
            </div>
            <ReliabilityBadge score={article.sourceReliability} size="lg" />
          </div>

          {/* CTA */}
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 transition-opacity mb-6"
          >
            Haberin Tamami
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Related - Source Comparison */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-[var(--color-border)] pt-5 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-[var(--color-accent)]" />
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Ayni konu, farkli kaynaklar ({relatedArticles.length})
                </h3>
              </div>

              {/* Reliability comparison bars */}
              <div className="space-y-2 mb-4">
                {/* Current article */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--color-text)] w-28 truncate">{article.sourceName}</span>
                  <div className="flex-1 h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${article.sourceReliability}%`,
                        backgroundColor: reliabilityBarColor(article.sourceReliability),
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold w-8 text-right" style={{ color: reliabilityBarColor(article.sourceReliability) }}>
                    {article.sourceReliability}
                  </span>
                </div>

                {relatedArticles.map((r) => (
                  <div key={r.id} className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-secondary)] w-28 truncate">{r.sourceName}</span>
                    <div className="flex-1 h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${r.sourceReliability}%`,
                          backgroundColor: reliabilityBarColor(r.sourceReliability),
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold w-8 text-right" style={{ color: reliabilityBarColor(r.sourceReliability) }}>
                      {r.sourceReliability}
                    </span>
                  </div>
                ))}
              </div>

              {/* Related article links */}
              <div className="space-y-2">
                {relatedArticles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onSelectRelated(r)}
                    className="w-full text-left p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)]">{r.sourceName}</span>
                      <ReliabilityBadge score={r.sourceReliability} size="sm" />
                    </div>
                    <p className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                      {r.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
