"use client";

import { CATEGORIES } from "@/data/sources";
import { Category } from "@/lib/types";

interface CategoryBarProps {
  selected: Category | "all";
  onSelect: (cat: Category | "all") => void;
  counts: Record<string, number>;
}

export default function CategoryBar({ selected, onSelect, counts }: CategoryBarProps) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="sticky top-[56px] z-40 bg-[var(--color-bg-card)]/80 backdrop-blur-xl border-b border-[var(--color-border)] transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-0.5 overflow-x-auto py-1.5 no-scrollbar">
          <button
            onClick={() => onSelect("all")}
            className={`shrink-0 px-2.5 py-1 rounded-md text-[12px] font-medium transition-all ${
              selected === "all"
                ? "bg-[var(--color-text)] text-[var(--color-bg-card)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]"
            }`}
          >
            Tumu {total > 0 && <span className="opacity-50 ml-0.5">{total}</span>}
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = selected === cat.id;
            const count = counts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-medium transition-all ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                }`}
                style={isActive ? { backgroundColor: cat.color } : undefined}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                  style={{ backgroundColor: isActive ? "rgba(255,255,255,0.7)" : cat.color }}
                />
                {cat.labelTr}
                {count > 0 && <span className="opacity-40 ml-0.5">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
