"use client";

import { useState } from "react";
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
  isLoading,
  currentLang,
  darkMode,
  onToggleDark,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">2V</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-base font-bold text-[var(--color-text)]">
              2Vibe <span className="text-[var(--color-accent)]">News</span>
            </span>
            {!isLoading && (
              <span className="w-2 h-2 rounded-full bg-[var(--color-green)] live-pulse" title="Canli" />
            )}
          </div>
        </a>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="Haber ara..."
            className="w-full bg-[var(--color-bg)] rounded-lg pl-9 pr-8 py-2 text-sm border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/20 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); onSearch(""); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Language */}
        <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden text-xs font-medium">
          {(["all", "tr", "en"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-2.5 py-1.5 transition-colors ${
                currentLang === lang
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
              }`}
            >
              {lang === "all" ? "Hepsi" : lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-colors"
          title={darkMode ? "Acik tema" : "Karanlik tema"}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-colors disabled:opacity-40"
          title="Haberleri guncelle"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </header>
  );
}
