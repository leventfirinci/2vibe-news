import { Article } from "@/lib/types";

// AI Provider rotation for zero-cost summarization
// Priority: Gemini (1K/day) → Groq (14.4K/day) → Fallback to snippet

interface AIProvider {
  name: string;
  summarize: (title: string, snippet: string, lang: string) => Promise<string>;
  whyItMatters: (title: string, summary: string, category: string, lang: string) => Promise<string>;
}

// Track daily usage to rotate between providers
const dailyUsage: Record<string, { count: number; date: string }> = {};

function getUsageToday(provider: string): number {
  const today = new Date().toISOString().split("T")[0];
  if (!dailyUsage[provider] || dailyUsage[provider].date !== today) {
    dailyUsage[provider] = { count: 0, date: today };
  }
  return dailyUsage[provider].count;
}

function incrementUsage(provider: string): void {
  const today = new Date().toISOString().split("T")[0];
  if (!dailyUsage[provider] || dailyUsage[provider].date !== today) {
    dailyUsage[provider] = { count: 0, date: today };
  }
  dailyUsage[provider].count++;
}

// Gemini provider
const geminiProvider: AIProvider = {
  name: "gemini",
  async summarize(title, snippet, lang) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("No Gemini API key");
    if (getUsageToday("gemini") >= 900) throw new Error("Gemini daily limit");

    const prompt =
      lang === "tr"
        ? `Sen bir haber editörüsün. Bu haberi 2-3 cümlede özetle. Sadece gerçekleri yaz, yorum yapma. Belirsiz iddiaları "iddia ediliyor" olarak belirt.\n\nBaşlık: ${title}\nİçerik: ${snippet}`
        : `You are a news editor. Summarize this news in 2-3 sentences. Only state facts, no opinions. Mark uncertain claims with "reportedly".\n\nTitle: ${title}\nContent: ${snippet}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.3 },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
    const data = await res.json();
    incrementUsage("gemini");
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  },

  async whyItMatters(title, summary, category, lang) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("No Gemini API key");
    if (getUsageToday("gemini") >= 900) throw new Error("Gemini daily limit");

    const prompt =
      lang === "tr"
        ? `Bu haberin neden önemli olduğunu 2 cümlede açıkla. Okuyucunun hayatına nasıl dokunabileceğini belirt. Tarafsız ol.\n\nBaşlık: ${title}\nÖzet: ${summary}\nKategori: ${category}`
        : `Explain in 2 sentences why this news matters. How it could affect the reader. Be neutral.\n\nTitle: ${title}\nSummary: ${summary}\nCategory: ${category}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0.4 },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
    const data = await res.json();
    incrementUsage("gemini");
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  },
};

// Groq provider (Llama)
const groqProvider: AIProvider = {
  name: "groq",
  async summarize(title, snippet, lang) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("No Groq API key");
    if (getUsageToday("groq") >= 14000) throw new Error("Groq daily limit");

    const systemPrompt =
      lang === "tr"
        ? "Sen bir haber editörüsün. Haberleri 2-3 cümlede özetlersin. Sadece gerçekleri yaz."
        : "You are a news editor. Summarize news in 2-3 sentences. Only state facts.";

    const userPrompt = `Başlık: ${title}\nİçerik: ${snippet}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!res.ok) throw new Error(`Groq error: ${res.status}`);
    const data = await res.json();
    incrementUsage("groq");
    return data.choices?.[0]?.message?.content || "";
  },

  async whyItMatters(title, summary, category, lang) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("No Groq API key");
    if (getUsageToday("groq") >= 14000) throw new Error("Groq daily limit");

    const systemPrompt =
      lang === "tr"
        ? "Haberlerin neden önemli olduğunu kısa ve öz açıklarsın."
        : "You explain why news matters in a brief, clear way.";

    const userPrompt =
      lang === "tr"
        ? `Bu haberin neden önemli olduğunu 2 cümlede açıkla.\nBaşlık: ${title}\nÖzet: ${summary}\nKategori: ${category}`
        : `Explain in 2 sentences why this matters.\nTitle: ${title}\nSummary: ${summary}\nCategory: ${category}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 150,
        temperature: 0.4,
      }),
    });

    if (!res.ok) throw new Error(`Groq error: ${res.status}`);
    const data = await res.json();
    incrementUsage("groq");
    return data.choices?.[0]?.message?.content || "";
  },
};

// Provider rotation with fallback
async function callWithRotation<T>(
  fn: (provider: AIProvider) => Promise<T>,
  fallback: T
): Promise<T> {
  const providers = [geminiProvider, groqProvider];

  for (const provider of providers) {
    try {
      return await fn(provider);
    } catch {
      console.log(`[AI] ${provider.name} failed, trying next...`);
      continue;
    }
  }

  return fallback;
}

export async function summarizeArticle(article: Article): Promise<{
  summaryShort: string;
  whyItMatters: string;
}> {
  const snippet = article.summaryShort || article.title;

  const summaryShort = await callWithRotation(
    (p) => p.summarize(article.title, snippet, article.language),
    snippet
  );

  // Only generate "why it matters" for breaking/important news
  let whyItMatters = "";
  if (article.priority === "breaking" || article.priority === "important") {
    whyItMatters = await callWithRotation(
      (p) =>
        p.whyItMatters(
          article.title,
          summaryShort,
          article.category,
          article.language
        ),
      ""
    );
  }

  return { summaryShort, whyItMatters };
}

export function getAIUsageStats(): Record<string, { count: number; date: string }> {
  return { ...dailyUsage };
}
