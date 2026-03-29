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

// Words that should NEVER trigger technology category
const TECH_FALSE_POSITIVES = [
  // These words exist in tech but also in world/politics news
  "apple", "google", "microsoft", "tesla", // company names used in non-tech context
  "strike", "attack", "hack", // ambiguous
];

// If these words appear alongside a "tech" company name, it's NOT tech news
const NON_TECH_CONTEXT = [
  "saldırı", "savaş", "öldü", "öldürüldü", "öldürdü", "bomba", "füze",
  "askeri", "ordu", "vuruyor", "vurdu", "vuruldu", "yaralı", "yaralandı",
  "şehit", "patlama", "bombardıman", "çatışma", "ateşkes", "hava saldırısı",
  "gazeteci öldü", "sivil kayıp", "petrol tesisi",
  "killed", "war", "bomb", "missile", "military", "troops", "invasion",
  "strike on", "attack on", "airstrike", "wounded", "injured", "casualties",
  "kınadı", "condemned", "sanctions", "yaptırım",
  "israil", "israel", "iran", "hamas", "hizbullah", "hezbollah",
  "gaza", "lübnan", "lebanon", "tahran", "tehran", "hayfa", "haifa",
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

  // If default is "breaking", change to "world" as fallback
  // because "breaking" is priority, not topic
  const fallback = defaultCategory === "breaking" ? "world" : defaultCategory;

  let bestCategory: Category = fallback;
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    const allKeywords = [...keywords.tr, ...keywords.en];

    for (const kw of allKeywords) {
      const kwLower = kw.toLowerCase();
      if (text.includes(kwLower)) {
        // Title matches count 3x
        if (titleLower.includes(kwLower)) {
          score += 3;
        } else {
          score += 1;
        }
      }
    }

    // Special: If classified as technology, check for false positives
    if (category === "technology" && score > 0) {
      const hasNonTechContext = NON_TECH_CONTEXT.some((w) => text.includes(w.toLowerCase()));
      if (hasNonTechContext) {
        // War/conflict context — this is NOT tech news
        score = 0;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as Category;
    }
  }

  // Minimum threshold: need at least 2 points to override default
  if (bestScore < 2) {
    // Even if using fallback, check if content is actually about war/conflict
    // If the source default is technology but content is about war → force to world
    const hasWarContext = NON_TECH_CONTEXT.some((w) => text.includes(w.toLowerCase()));
    const hasWorldKeywords = [...CATEGORY_KEYWORDS.world.tr, ...CATEGORY_KEYWORDS.world.en]
      .some((kw) => text.includes(kw.toLowerCase()));

    if (hasWarContext && hasWorldKeywords && (fallback === "technology" || fallback === "culture" || fallback === "science")) {
      return "world";
    }
    return fallback;
  }

  return bestCategory;
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
 * Detect secondary categories — what other topics does this news touch?
 * Example: "Israel strikes Iran oil facility" → primary: world, secondary: [economy]
 */
export function detectSecondaryCategories(
  title: string,
  snippet: string,
  primaryCategory: Category
): Category[] {
  const text = `${title} ${snippet}`.toLowerCase();
  const secondary: Category[] = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === primaryCategory) continue;
    if (category === "breaking") continue;

    let score = 0;
    const allKeywords = [...keywords.tr, ...keywords.en];
    for (const kw of allKeywords) {
      if (text.includes(kw.toLowerCase())) score++;
    }

    // Lower threshold for secondary (1 match is enough)
    if (score >= 1) {
      secondary.push(category as Category);
    }
  }

  return secondary.slice(0, 3); // Max 3 secondary categories
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

export function detectImpactAreas(title: string, snippet: string): ImpactArea[] {
  const text = `${title} ${snippet}`.toLowerCase();
  const impacts: { area: ImpactArea; score: number }[] = [];

  for (const [area, keywords] of Object.entries(IMPACT_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) score++;
    }
    if (score >= 2) { // Need 2+ matches for impact area
      impacts.push({ area: area as ImpactArea, score });
    }
  }

  impacts.sort((a, b) => b.score - a.score);
  return impacts.slice(0, 3).map((i) => i.area);
}
