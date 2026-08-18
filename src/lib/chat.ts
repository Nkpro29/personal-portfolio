export type ChatRole = "user" | "assistant";
export type ChatInputMode = "text" | "voice";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  inputMode: ChatInputMode;
  streaming?: boolean;
};

const SESSION_KEY = "naman-chat-session";
let memorySessionId: string | null = null;

export function getChatSessionId() {
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const token = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, token);
    return token;
  } catch {
    if (!memorySessionId) {
      memorySessionId = crypto.randomUUID();
    }
    return memorySessionId;
  }
}

export async function streamPortfolioChat(
  message: string,
  onDelta: (text: string) => void,
  signal?: AbortSignal,
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      sessionId: getChatSessionId(),
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error("network");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    accumulated += decoder.decode(value, { stream: true });
    onDelta(accumulated);
  }

  return (
    accumulated.trim() || "I don't have that information in Naman's portfolio."
  );
}
