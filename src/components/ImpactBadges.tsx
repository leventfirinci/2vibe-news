"use client";

import { ImpactArea, Category } from "@/lib/types";
import { IMPACT_LABELS } from "@/lib/impact-labels";
import { CATEGORIES } from "@/data/sources";

interface ImpactBadgesProps {
  impactAreas: ImpactArea[];
  secondaryCategories?: Category[];
  size?: "sm" | "md";
}

export default function ImpactBadges({ impactAreas, secondaryCategories = [], size = "sm" }: ImpactBadgesProps) {
  const items = impactAreas.slice(0, 3);
  const secondaryCats = secondaryCategories.slice(0, 2);

  if (items.length === 0 && secondaryCats.length === 0) return null;

  const textSize = size === "sm" ? "text-[9px]" : "text-[10px]";
  const padding = size === "sm" ? "px-1.5 py-0.5" : "px-2 py-0.5";

  return (
    <div className="flex flex-wrap items-center gap-1">
      {/* Secondary categories */}
      {secondaryCats.map((catId) => {
        const cat = CATEGORIES.find((c) => c.id === catId);
        if (!cat) return null;
        return (
          <span
            key={catId}
            className={`${textSize} ${padding} rounded font-medium`}
            style={{
              color: cat.color,
              backgroundColor: `${cat.color}12`,
            }}
          >
            {cat.labelTr}
          </span>
        );
      })}

      {/* Impact areas */}
      {items.map((area) => {
        const label = IMPACT_LABELS[area];
        return (
          <span
            key={area}
            className={`${textSize} ${padding} rounded font-medium`}
            style={{
              color: label.color,
              backgroundColor: `${label.color}12`,
            }}
          >
            {label.tr}
          </span>
        );
      })}
    </div>
  );
}
