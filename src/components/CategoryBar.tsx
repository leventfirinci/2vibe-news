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
    <div className="sticky top-[53px] z-40 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
          <button
            onClick={() => onSelect("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selected === "all"
                ? "bg-[var(--color-text)] text-[var(--color-bg-card)] shadow-sm"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
            }`}
          >
            Tumu {total > 0 && <span className="text-xs opacity-60 ml-1">{total}</span>}
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = selected === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
                }`}
                style={isActive ? { backgroundColor: cat.color } : undefined}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isActive ? "white" : cat.color }}
                />
                {cat.labelTr}
                {(counts[cat.id] || 0) > 0 && (
                  <span className="text-xs opacity-60 ml-0.5">{counts[cat.id]}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
