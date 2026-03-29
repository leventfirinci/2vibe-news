import { Category, Language, Priority, ImpactArea } from "@/lib/types";

// "breaking" is NOT a content category — it's a priority level.
// Categories describe TOPIC. Priority describes URGENCY.
// So we classify into real topics only: economy, politics, technology, sports, world, science, health, culture

const CATEGORY_KEYWORDS: Record<Exclude<Category, "breaking">, { tr: string[]; en: string[] }> = {
  economy: {
    tr: [
      "ekonomi", "dolar", "euro", "faiz", "enflasyon", "borsa",
      "merkez bankası", "tcmb", "bütçe", "vergi", "ihracat",
      "ithalat", "büyüme", "gsyh", "işsizlik", "maaş", "zam",
      "tüik", "asgari ücret", "döviz", "altın", "piyasa",
      "hazine", "maliye", "şirket", "gelir", "gider",
      "yatırım", "kredi", "banka", "sigorta",
    ],
    en: [
      "economy", "dollar", "euro", "interest rate", "inflation",
      "stock market", "fed", "gdp", "unemployment", "trade",
      "tariff", "budget", "tax", "fiscal", "monetary", "wall street",
      "nasdaq", "dow jones", "cryptocurrency", "bitcoin",
      "revenue", "profit", "earnings", "investment", "bond",
    ],
  },
  politics: {
    tr: [
      "siyaset", "meclis", "tbmm", "cumhurbaşkanı", "başbakan",
      "seçim", "oy", "parti", "muhalefet", "iktidar", "yasa",
      "kanun", "anayasa", "bakan", "milletvekili", "chp", "akp",
      "mhp", "iyi parti", "dem parti", "erdoğan", "kılıçdaroğlu",
      "belediye", "vali", "hükümet", "siyasi", "cumhur ittifakı",
      "millet ittifakı", "referandum", "demokrat", "muhalif",
    ],
    en: [
      "politics", "election", "congress", "parliament",
      "senate", "vote", "democrat", "republican", "policy",
      "legislation", "bill signed", "minister", "cabinet",
      "trump", "biden", "political", "governor", "mayor",
      "campaign", "ballot", "impeach",
    ],
  },
  technology: {
    tr: [
      "teknoloji", "yapay zeka", "yazılım", "donanım", "siber güvenlik",
      "iphone", "android telefon", "samsung galaxy", "uygulama güncelleme",
      "robot", "startup", "girişim", "kodlama", "programlama",
      "veri ihlali", "sosyal medya platformu", "oyun konsolu",
      "elektrikli araç", "otonom", "metaverse", "blockchain",
    ],
    en: [
      "artificial intelligence", "software", "hardware", "cybersecurity",
      "app update", "programming", "coding", "data breach",
      "social media platform", "gaming console", "electric vehicle",
      "autonomous", "metaverse", "blockchain", "openai", "chatgpt",
      "semiconductor", "spacex rocket", "quantum computing",
      "techcrunch", "startup funding",
    ],
  },
  sports: {
    tr: [
      "spor", "futbol", "basketbol", "voleybol", "galatasaray",
      "fenerbahçe", "beşiktaş", "trabzonspor", "süper lig",
      "şampiyonlar ligi", "gol", "maç", "derbi", "milli takım",
      "olimpiyat", "transfer", "teknik direktör", "tenis",
      "formula 1", "hakem", "puan durumu", "lig", "turnuva",
      "stadyum", "antrenör", "şampiyon", "kupa", "fifa",
      "uefa", "tff", "dünya kupası", "play-off",
    ],
    en: [
      "football", "soccer", "basketball", "nba", "nfl",
      "champions league", "premier league", "la liga",
      "goal scored", "match result", "olympics", "world cup",
      "tennis", "formula 1", "cricket", "rugby", "transfer",
      "coach", "championship", "tournament", "stadium",
      "fifa", "uefa", "playoff",
    ],
  },
  world: {
    tr: [
      "dünya", "uluslararası", "bm", "birleşmiş milletler",
      "suriye", "ukrayna", "rusya", "abd", "avrupa", "çin",
      "iran", "irak", "savaş", "barış", "diplomasi",
      "israil", "filistin", "gaza", "lübnan", "hamas", "hizbullah",
      "bombardıman", "füze", "ordu", "askeri", "çatışma", "ateşkes",
      "mülteci", "göç", "terör", "insansız hava aracı", "iha",
      "hava savunma", "petrol tesisi", "polis karargah",
      "dışişleri", "büyükelçi", "elçilik", "yaptırım",
      "bae", "suudi", "katar", "mısır", "libya", "yemen",
      "afganistan", "pakistan", "hindistan", "kore",
      "zelenski", "putin", "netanyahu", "husi", "houthi",
    ],
    en: [
      "international", "united nations", "geopolitics",
      "syria", "ukraine", "russia", "china", "iran", "iraq",
      "war", "peace", "diplomacy", "foreign policy",
      "israel", "palestine", "gaza", "lebanon", "hamas",
      "hezbollah", "bombing", "missile", "military",
      "conflict", "ceasefire", "refugee", "troops",
      "invasion", "sanctions", "embassy", "ambassador",
      "airstrike", "drone strike", "air defense",
      "saudi", "qatar", "egypt", "yemen", "houthi",
      "zelenskyy", "putin", "netanyahu",
    ],
  },
  science: {
    tr: [
      "bilim", "uzay", "nasa", "araştırma", "keşif", "esa",
      "gen", "dna", "iklim değişikliği", "çevre kirliliği",
      "fosil", "arkeoloji", "laboratuvar", "deney",
      "fizik", "kimya", "biyoloji", "matematik",
    ],
    en: [
      "science", "space exploration", "nasa", "esa", "research study",
      "discovery", "gene", "dna", "climate change",
      "fossil", "archaeology", "laboratory", "experiment",
      "physics", "chemistry", "biology",
    ],
  },
  health: {
    tr: [
      "sağlık", "hastane", "doktor", "ilaç", "aşı",
      "covid", "kanser", "grip", "salgın", "tedavi",
      "ameliyat", "hasta", "tıp", "sağlık bakanlığı",
    ],
    en: [
      "health", "hospital", "doctor", "medicine", "vaccine",
      "covid", "cancer", "flu", "pandemic", "treatment",
      "disease", "surgery", "patient", "medical",
    ],
  },
  culture: {
    tr: [
      "kültür", "sanat", "sinema", "müzik", "tiyatro",
      "konser", "film", "dizi", "kitap", "festival",
      "sergi", "müze", "edebiyat", "ödül töreni",
    ],
    en: [
      "culture", "art exhibition", "cinema", "music album",
      "theater", "concert", "film festival", "book",
      "museum", "literature", "award ceremony",
    ],
  },
};

// VIOLENCE / CRIME / WAR context — these override soft categories
// If any of these words appear, the article is NOT about economy/tech/culture/sports
const VIOLENCE_CONTEXT = [
  // Turkish violence/crime
  "öldü", "öldürüldü", "öldürdü", "cinayet", "katil", "katliam", "katletti",
  "hayatını kaybetti", "saldırı", "bıçakladı", "bıçaklandı", "tecavüz",
  "şiddet", "vahşet", "infaz", "suç", "suçlu", "ceset", "boğdu",
  "vurdu", "vuruldu", "vuruyor", "ateş açtı", "silahla", "tüfekle",
  "yaralı", "yaralandı", "şehit", "kurban", "maktul",
  // Turkish war/conflict
  "savaş", "bomba", "füze", "bombardıman", "çatışma", "ateşkes",
  "askeri", "ordu", "hava saldırısı", "patlama", "terör", "terörist",
  // Turkish disaster
  "deprem", "sel", "yangın", "afet", "tsunami", "felaket",
  // English violence/crime
  "killed", "murder", "murdered", "stabbed", "shot", "shooting",
  "death", "died", "dead", "victim", "homicide", "assault",
  "violence", "attacked", "attacker",
  // English war/conflict
  "war", "bomb", "bombing", "missile", "military", "troops", "invasion",
  "airstrike", "strike on", "attack on", "wounded", "injured", "casualties",
  "conflict", "combat", "shelling",
  // English disaster
  "earthquake", "flood", "fire", "disaster", "tsunami",
  // Geopolitical entities in conflict context
  "israil", "israel", "iran", "hamas", "hizbullah", "hezbollah",
  "gaza", "lübnan", "lebanon", "tahran", "tehran", "hayfa", "haifa",
];

// Categories that should be BLOCKED when violence context is detected
// These categories are "soft" — they should not override violence/world/politics
const VIOLENCE_BLOCKED_CATEGORIES: Category[] = [
  "economy", "technology", "sports", "science", "health", "culture",
];

const BREAKING_KEYWORDS = {
  tr: [
    "son dakika", "flaş", "acil", "deprem", "tsunami",
    "öldü", "hayatını kaybetti", "büyük yangın",
  ],
  en: [
    "breaking", "urgent", "just in", "earthquake",
    "tsunami", "mass shooting",
  ],
};

export function classifyCategory(
  title: string,
  snippet: string,
  defaultCategory: Category
): Category {
  const text = `${title} ${snippet}`.toLowerCase();
  const titleLower = title.toLowerCase();

  // Step 0: "breaking" is priority, not topic
  const fallback = defaultCategory === "breaking" ? "world" : defaultCategory;

  // Step 1: Detect violence/crime/war context FIRST
  const hasViolence = VIOLENCE_CONTEXT.some((w) => text.includes(w.toLowerCase()));

  // Step 2: Score all categories
  const scores: { category: Category; score: number }[] = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    const allKeywords = [...keywords.tr, ...keywords.en];

    for (const kw of allKeywords) {
      const kwLower = kw.toLowerCase();
      if (text.includes(kwLower)) {
        score += titleLower.includes(kwLower) ? 3 : 1;
      }
    }

    // Step 3: If violence detected, BLOCK soft categories
    if (hasViolence && VIOLENCE_BLOCKED_CATEGORIES.includes(category as Category)) {
      score = 0; // Kill the score — this is NOT economy/tech/sports news
    }

    scores.push({ category: category as Category, score });
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];

  // Step 4: Minimum threshold — need 2+ points
  if (!best || best.score < 2) {
    // If violence detected and fallback is a soft category, override to world/politics
    if (hasViolence && VIOLENCE_BLOCKED_CATEGORIES.includes(fallback)) {
      // Check if it has world or politics keywords
      const worldScore = scores.find((s) => s.category === "world")?.score || 0;
      const politicsScore = scores.find((s) => s.category === "politics")?.score || 0;
      return politicsScore > worldScore ? "politics" : "world";
    }
    return fallback;
  }

  return best.category;
}

export function detectPriority(
  title: string,
  snippet: string,
  language: Language
): Priority {
  const text = `${title} ${snippet}`.toLowerCase();
  const breakingKws = BREAKING_KEYWORDS[language] || BREAKING_KEYWORDS.en;

  for (const kw of breakingKws) {
    if (text.includes(kw.toLowerCase())) {
      return "breaking";
    }
  }

  const importantSignals = [
    "önemli gelişme", "kritik karar", "rekor", "ilk kez",
    "major", "historic", "record", "first time", "landmark",
  ];

  for (const signal of importantSignals) {
    if (text.includes(signal.toLowerCase())) {
      return "important";
    }
  }

  return "normal";
}

/**
 * Detect secondary categories.
 * RULE: Violence/crime/disaster → NO secondary categories at all.
 * RULE: Economy only if 5+ strong financial keyword matches.
 * RULE: Accuracy > quantity. Return empty array if unsure.
 */
export function detectSecondaryCategories(
  title: string,
  snippet: string,
  primaryCategory: Category
): Category[] {
  const text = `${title} ${snippet}`.toLowerCase();

  // HARD RULE: Violence/crime/disaster/death → ZERO secondary categories
  const hasViolence = VIOLENCE_CONTEXT.some((w) => text.includes(w.toLowerCase()));
  if (hasViolence) return [];

  const secondary: Category[] = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === primaryCategory) continue;
    if (category === "breaking") continue;

    let score = 0;
    const allKeywords = [...keywords.tr, ...keywords.en];
    for (const kw of allKeywords) {
      if (text.includes(kw.toLowerCase())) score++;
    }

    // Economy needs 5+ matches (very strict — only truly financial news)
    if (category === "economy" && score < 5) continue;
    // All others need 4+ matches
    if (category !== "economy" && score < 4) continue;

    secondary.push(category as Category);
  }

  return secondary.slice(0, 1); // Max 1 secondary (less noise, more trust)
}

/**
 * Detect impact areas — what domains does this news affect?
 */
const IMPACT_KEYWORDS: Record<ImpactArea, string[]> = {
  economic: [
    "economy", "ekonomi", "market", "piyasa", "dolar", "euro", "trade",
    "tariff", "inflation", "enflasyon", "oil", "petrol", "price", "fiyat",
    "stock", "borsa", "gdp", "recession", "supply chain", "export", "import",
    "sanctions", "yaptirim", "bank", "banka", "interest", "faiz",
  ],
  political: [
    "election", "secim", "government", "hukumet", "parliament", "meclis",
    "president", "cumhurbaskani", "policy", "legislation", "kanun",
    "diplomacy", "diplomasi", "summit", "zirve", "treaty",
  ],
  social: [
    "protest", "protesto", "community", "toplum", "education", "egitim",
    "inequality", "poverty", "unemployment", "issizlik", "migration", "goc",
    "refugee", "multeci", "housing", "konut", "public health",
  ],
  security: [
    "military", "askeri", "war", "savas", "terrorism", "teror",
    "defense", "savunma", "attack", "saldiri", "missile", "fuze",
    "nato", "intelligence", "istihbarat", "cybersecurity", "border", "sinir",
  ],
  technological: [
    "ai", "yapay zeka", "software", "yazilim", "cyber", "siber",
    "data", "veri", "digital", "dijital", "innovation", "inovasyon",
    "automation", "otomasyon", "semiconductor", "chip",
  ],
  environmental: [
    "climate", "iklim", "pollution", "kirlilik", "earthquake", "deprem",
    "flood", "sel", "fire", "yangin", "disaster", "afet", "carbon",
    "environment", "cevre", "tsunami", "drought", "kuraklik",
  ],
  legal: [
    "court", "mahkeme", "law", "kanun", "lawsuit", "dava", "regulation",
    "yonetmelik", "verdict", "karar", "judge", "hakim", "constitution",
    "anayasa", "arrest", "tutuklama", "prison", "cezaevi",
  ],
  humanitarian: [
    "civilian", "sivil", "aid", "yardim", "humanitarian", "insani",
    "victims", "kurban", "killed", "oldu", "death toll", "casualties",
    "hospital", "hastane", "children", "cocuk", "women", "kadin",
  ],
};

/**
 * Detect impact areas.
 * RULE: Violence/crime/disaster → only security + humanitarian allowed.
 * RULE: No "economic" impact for murder/earthquake/terror.
 * RULE: Threshold 3+ (was 2).
 * RULE: Max 2 impact areas.
 */
export function detectImpactAreas(title: string, snippet: string): ImpactArea[] {
  const text = `${title} ${snippet}`.toLowerCase();
  const hasViolence = VIOLENCE_CONTEXT.some((w) => text.includes(w.toLowerCase()));
  const impacts: { area: ImpactArea; score: number }[] = [];

  // Impact areas that are BLOCKED during violence/crime/disaster
  const violenceBlockedImpacts: ImpactArea[] = ["economic", "technological", "environmental"];

  for (const [area, keywords] of Object.entries(IMPACT_KEYWORDS)) {
    // Block irrelevant impacts during violence
    if (hasViolence && violenceBlockedImpacts.includes(area as ImpactArea)) continue;

    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) score++;
    }
    if (score >= 3) { // Raised from 2 to 3
      impacts.push({ area: area as ImpactArea, score });
    }
  }

  impacts.sort((a, b) => b.score - a.score);
  return impacts.slice(0, 2).map((i) => i.area);
}
