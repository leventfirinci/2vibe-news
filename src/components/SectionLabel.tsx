"use client";

import { ReactNode } from "react";

interface SectionLabelProps {
  title: string;
  icon?: ReactNode;
  count?: number;
  className?: string;
}

export default function SectionLabel({ title, icon, count, className = "" }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-2 mb-4 ${className}`}>
      {icon && <span className="text-[var(--color-accent)]">{icon}</span>}
      <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
      {count !== undefined && count > 0 && (
        <span className="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)] px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}
