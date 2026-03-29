export type Category =
  | "breaking"
  | "economy"
  | "politics"
  | "technology"
  | "sports"
  | "world"
  | "science"
  | "health"
  | "culture";

export type Language = "tr" | "en";

export type Priority = "breaking" | "important" | "normal";

export type ReliabilityTier = "A" | "B" | "C" | "D";

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl: string;
  language: Language;
  reliabilityScore: number; // 0-100
  reliabilityTier: ReliabilityTier;
  defaultCategory: Category;
  country: string;
  isOfficial: boolean; // government/official source
}

export type ImpactArea = "economic" | "political" | "social" | "security" | "technological" | "environmental" | "legal" | "humanitarian";

export interface Article {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceReliability: number;
  sourceReliabilityTier: ReliabilityTier;
  title: string;
  originalUrl: string;
  imageUrl?: string;
  language: Language;
  category: Category;
  secondaryCategories: Category[]; // Dual-category: impact areas
  impactAreas: ImpactArea[]; // What domains this news impacts
  priority: Priority;
  summaryShort?: string;
  summaryDetailed?: string;
  whyItMatters?: string;
  publishedAt: string;
  collectedAt: string;
  clusterId?: string;
  relatedArticleIds?: string[];
}

export interface EventCluster {
  id: string;
  title: string;
  category: Category;
  articleCount: number;
  sources: string[];
  firstSeen: string;
  lastUpdated: string;
  isTrending: boolean;
}

export interface CategoryInfo {
  id: Category;
  labelTr: string;
  labelEn: string;
  icon: string;
  color: string;
}
