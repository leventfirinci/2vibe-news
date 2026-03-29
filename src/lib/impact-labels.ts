import { ImpactArea } from "@/lib/types";

export const IMPACT_LABELS: Record<ImpactArea, { tr: string; en: string; color: string; icon: string }> = {
  economic: { tr: "Ekonomik Etki", en: "Economic Impact", color: "#22c55e", icon: "trending-up" },
  political: { tr: "Siyasi Etki", en: "Political Impact", color: "#8b5cf6", icon: "landmark" },
  social: { tr: "Toplumsal Etki", en: "Social Impact", color: "#f97316", icon: "users" },
  security: { tr: "Guvenlik Etkisi", en: "Security Impact", color: "#ef4444", icon: "shield" },
  technological: { tr: "Teknolojik Etki", en: "Tech Impact", color: "#3b82f6", icon: "cpu" },
  environmental: { tr: "Cevre Etkisi", en: "Environmental Impact", color: "#10b981", icon: "leaf" },
  legal: { tr: "Hukuki Etki", en: "Legal Impact", color: "#6366f1", icon: "scale" },
  humanitarian: { tr: "Insani Etki", en: "Humanitarian Impact", color: "#ec4899", icon: "heart" },
};
