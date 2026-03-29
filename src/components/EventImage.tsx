"use client";

import { useState } from "react";

interface EventImageProps {
  src?: string;
  category: string;
  categoryColor?: string;
  categoryIcon?: string;
  className?: string;
}

/**
 * Always shows a visual. If RSS image exists → show it.
 * If not → premium gradient placeholder with category pattern.
 * If image fails to load → fallback to placeholder.
 */
export default function EventImage({ src, category, categoryColor = "#666", categoryIcon = "", className = "" }: EventImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className={`relative overflow-hidden bg-[var(--color-bg-secondary)] ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="w-full h-full relative">
          {/* Gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${categoryColor}22 0%, ${categoryColor}08 50%, ${categoryColor}15 100%)`,
            }}
          />
          {/* Pattern overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`grid-${category}`} width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="1" fill={categoryColor} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${category})`} />
          </svg>
          {/* Category icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[28px] opacity-20 select-none">{categoryIcon}</span>
          </div>
        </div>
      )}
    </div>
  );
}
