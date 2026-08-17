import { portfolio, type KnowledgeItem } from "@/lib/portfolio";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "in",
  "on",
  "for",
  "to",
  "is",
  "are",
  "was",
  "does",
  "did",
  "do",
  "how",
  "what",
  "where",
  "who",
  "which",
  "his",
  "her",
  "he",
  "she",
  "naman",
  "kulshresth",
  "me",
  "about",
  "tell",
  "please",
  "can",
  "you",
]);

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9+./#]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function scoreItem(queryTokens: string[], item: KnowledgeItem) {
  const haystack = `${item.title} ${item.content} ${item.keywords.join(" ")} ${item.category}`.toLowerCase();
  let score = 0;

  for (const token of queryTokens) {
    if (item.keywords.some((keyword) => keyword.includes(token) || token.includes(keyword))) {
      score += 4;
    }
    if (item.title.toLowerCase().includes(token)) score += 3;
    if (haystack.includes(token)) score += 1;
  }

  if (item.category === "profile") score += 0.2;
  return score;
}

export async function getKnowledgeCorpus(): Promise<KnowledgeItem[]> {
  if (!isDatabaseConfigured()) {
    return portfolio.knowledge;
  }

  try {
    const rows = await prisma.portfolioKnowledge.findMany({
      orderBy: { createdAt: "asc" },
    });
    if (!rows.length) return portfolio.knowledge;
    return rows.map((row) => ({
      id: row.id,
      category: row.category,
      title: row.title,
      content: row.content,
      keywords: row.keywords,
      sourceType: row.sourceType,
      sourceId: row.sourceId,
    }));
  } catch {
    return portfolio.knowledge;
  }
}

export async function retrieveRelevantKnowledge(query: string, limit = 8) {
  const corpus = await getKnowledgeCorpus();
  const tokens = tokenize(query);

  if (!tokens.length) {
    return {
      items: corpus.filter((item) => item.category === "profile").slice(0, 3),
      maxScore: 1,
      offTopic: false,
    };
  }

  const ranked = corpus
    .map((item) => ({ item, score: scoreItem(tokens, item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!ranked.length || ranked[0].score < 2) {
    return {
      items: corpus.filter((item) => item.category === "profile" || item.category === "policy").slice(0, 3),
      maxScore: ranked[0]?.score ?? 0,
      offTopic: ranked.length === 0,
    };
  }

  const top = ranked.slice(0, limit).map((entry) => entry.item);
  return { items: top, maxScore: ranked[0].score, offTopic: false };
}

export function formatKnowledgeForPrompt(items: KnowledgeItem[]) {
  return items
    .map(
      (item, index) =>
        `[${index + 1}] ${item.title} (${item.category})\n${item.content}`,
    )
    .join("\n\n");
}
