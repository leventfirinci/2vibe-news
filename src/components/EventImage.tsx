"use client";

import { useState } from "react";
import { getCategoryImage } from "@/data/category-images";

interface EventImageProps {
  src?: string;
  category: string;
  title: string;
  className?: string;
}

/**
 * Always shows a real photo.
 * 1. RSS image → show it
 * 2. RSS fails → category placeholder (Unsplash)
 * 3. No RSS image → category placeholder (Unsplash)
 * Same article always gets the same placeholder (deterministic hash).
 */
export default function EventImage({ src, category, title, className = "" }: EventImageProps) {
  const [failed, setFailed] = useState(false);
  const placeholder = getCategoryImage(category, title);
  const showOriginal = src && !failed;

  return (
    <div className={`relative overflow-hidden bg-[var(--color-bg-secondary)] ${className}`}>
      <img
        src={showOriginal ? src : placeholder}
        alt=""
        className="w-full h-full object-cover"
        onError={() => {
          if (showOriginal) {
            setFailed(true); // Fallback to placeholder
          }
        }}
        loading="lazy"
      />
    </div>
  );
}
