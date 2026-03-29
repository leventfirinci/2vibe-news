"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, RefreshCw, Moon, Sun } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
  onLanguageChange: (lang: "all" | "tr" | "en") => void;
  onRefresh: () => void;
  totalArticles: number;
  isLoading: boolean;
  currentLang: "all" | "tr" | "en";
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function Header({
  onSearch,
  onLanguageChange,
  onRefresh,
  totalArticles,
  isLoading,
  currentLang,
  darkMode,
  onToggleDark,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value), 300);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg-card)]/80 backdrop-blur-xl border-b border-[var(--color-border)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-white font-extrabold text-sm tracking-tight">2V</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-[var(--color-text)] tracking-tight">
              2Vibe<span className="text-[var(--color-accent)] ml-0.5">News</span>
            </span>
            {!isLoading && totalArticles > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] live-pulse" title="Canli" />
            )}
          </div>
        </a>

        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Haber ara..."
            className="w-full bg-[var(--color-bg)] rounded-lg pl-8 pr-8 py-1.5 text-sm border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); onSearch(""); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Language */}
        <div className="flex rounded-md border border-[var(--color-border)] overflow-hidden text-[11px] font-medium">
          {(["all", "tr", "en"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-2 py-1 transition-all ${
                currentLang === lang
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]"
              }`}
            >
              {lang === "all" ? "ALL" : lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dark mode */}
        <button
          onClick={onToggleDark}
          className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-all"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-all disabled:opacity-30"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </header>
  );
}
