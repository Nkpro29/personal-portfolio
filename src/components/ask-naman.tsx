"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { ChatOverlay, type ChatTurn } from "@/components/chat-overlay";

const PLACEHOLDERS = [
  "Ask about my experience...",
  "What has Naman built?",
  "Ask me about AI...",
  "How does Naman approach system design?",
  "Which projects has Naman worked on?",
];

function getSessionToken() {
  const key = "naman-chat-session";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const token = crypto.randomUUID();
  window.localStorage.setItem(key, token);
  return token;
}

function Composer({
  query,
  onQuery,
  onSend,
  placeholder,
  pending,
}: {
  query: string;
  onQuery: (value: string) => void;
  onSend: (value: string) => void;
  placeholder: string;
  pending: boolean;
}) {
  return (
    <form
      className="flex items-center gap-2 rounded-full border border-line-strong bg-surface/90 px-4 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      onSubmit={(event) => {
        event.preventDefault();
        onSend(query);
      }}
    >
      <input
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder={placeholder}
        aria-label="Ask anything about Naman"
        className="h-11 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
      />
      <button
        type="submit"
        disabled={pending || !query.trim()}
        aria-label="Send question"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-accent/10 text-accent disabled:opacity-40"
      >
        <ArrowUp size={16} />
      </button>
    </form>
  );
}

export function AskNaman() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIndex((value) => (value + 1) % PLACEHOLDERS.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function send(text: string) {
    const message = text.trim();
    if (!message || pending) return;

    setQuery("");
    setOpen(true);
    setPending(true);

    const assistantId = crypto.randomUUID();
    setTurns((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: message },
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sessionToken: getSessionToken(),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("The assistant could not respond.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const snapshot = accumulated;
        setTurns((current) =>
          current.map((turn) =>
            turn.id === assistantId ? { ...turn, content: snapshot, streaming: true } : turn,
          ),
        );
      }

      setTurns((current) =>
        current.map((turn) =>
          turn.id === assistantId
            ? {
                ...turn,
                content:
                  accumulated.trim() ||
                  "I don't have that information in Naman's portfolio.",
                streaming: false,
              }
            : turn,
        ),
      );
    } catch {
      setTurns((current) =>
        current.map((turn) =>
          turn.id === assistantId
            ? {
                ...turn,
                content:
                  "The assistant is temporarily unavailable. I can still only answer from Naman's portfolio once the connection is restored.",
                streaming: false,
              }
            : turn,
        ),
      );
    } finally {
      setPending(false);
    }
  }

  const composer = (
    <Composer
      query={query}
      onQuery={setQuery}
      onSend={send}
      placeholder={PLACEHOLDERS[placeholderIndex]}
      pending={pending}
    />
  );

  return (
    <>
      {!open && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          <div className="pointer-events-auto mx-auto w-full max-w-2xl">{composer}</div>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <ChatOverlay
            turns={turns}
            pending={pending}
            reduce={Boolean(reduce)}
            onClose={() => setOpen(false)}
            composer={composer}
          />
        )}
      </AnimatePresence>
    </>
  );
}
